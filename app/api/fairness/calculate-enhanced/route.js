import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

const isPlaceholderKey = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your-service-role-key'
const dbClient = isPlaceholderKey
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : supabase

// Helper to get internal user ID
async function getInternalUserId(authUser, dbClient) {
    const { data: internalUser } = await dbClient
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single()
    return internalUser?.id
}

// Calculate enhanced fairness metrics (with LLM) via FastAPI backend
export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user: authUser }, error: authError } = await dbClient.auth.getUser(token)

        if (authError || !authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = await getInternalUserId(authUser, dbClient)
        const body = await request.json()
        const { audit_id } = body

        const validAuditId = audit_id || body.id

        if (!validAuditId) {
            return NextResponse.json({ error: 'audit_id is required' }, { status: 400 })
        }

        // Get audit with dataset info from Supabase
        const { data: audit, error: auditError } = await dbClient
            .from('audits')
            .select('*')
            .eq('id', validAuditId)
            .eq('user_id', userId)
            .single()

        if (auditError || !audit) {
            return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
        }

        // Reset audit status and results to ensure polling waits correctly
        console.log(`[Calculate-Enhanced] Resetting status for Audit ${validAuditId}...`)
        await dbClient
            .from('audits')
            .update({
                status: 'processing',
                metrics_results: null,
                overall_score: null,
                bias_detected: false,
                critical_bias_count: 0,
                recommendations: null,
                llm_insights: null,
                completed_at: null
            })
            .eq('id', validAuditId)

        // Helper to upload dataset to FastAPI
        const uploadToFastAPI = async (datasetId) => {
            if (!datasetId) return null

            const { data: dataset } = await dbClient
                .from('datasets')
                .select('*')
                .eq('id', datasetId)
                .single()

            if (!dataset) return null

            try {
                const { data: fileData, error: downloadError } = await dbClient.storage
                    .from('datasets')
                    .download(dataset.filename)

                if (downloadError || !fileData) return null

                const content = await fileData.text()
                const formData = new FormData()
                const blob = new Blob([content], { type: 'text/csv' })
                formData.append('file', blob, dataset.original_filename || 'data.csv')
                formData.append('dataset_name', dataset.original_filename || 'data.csv')
                formData.append('dataset_id', datasetId)

                const uploadResponse = await fetch(`${FASTAPI_URL}/api/datasets/upload`, {
                    method: 'POST',
                    body: formData,
                })

                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json()
                    return uploadResult.dataset_id
                }
            } catch (e) {
                console.error('FastAPI upload error:', e)
            }
            return null
        }

        // Upload both datasets if present
        console.log(`[Calculate-Enhanced] Starting analysis for Audit: ${validAuditId}`)
        console.log(`[Calculate-Enhanced] Fetching pre-dataset: ${audit.dataset_id}...`)
        const fastApiDatasetIdPre = await uploadToFastAPI(audit.dataset_id)
        console.log(`[Calculate-Enhanced] Pre-dataset upload result: ${fastApiDatasetIdPre}`)

        console.log(`[Calculate-Enhanced] Fetching post-dataset: ${audit.dataset_id_post}...`)
        const fastApiDatasetIdPost = await uploadToFastAPI(audit.dataset_id_post)
        console.log(`[Calculate-Enhanced] Post-dataset upload result: ${fastApiDatasetIdPost}`)

        // If we have at least the pre dataset, calculate fairness
        if (fastApiDatasetIdPre) {
            try {
                console.log(`[Calculate-Enhanced] Calling FastAPI fairness endpoint...`)
                const fairnessResponse = await fetch(`${FASTAPI_URL}/api/fairness/calculate-enhanced`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dataset_id: String(fastApiDatasetIdPre),
                        dataset_id_post: fastApiDatasetIdPost ? String(fastApiDatasetIdPost) : null,
                        target_column: audit.target_column,
                        sensitive_attributes: audit.sensitive_attributes || [],
                        favorable_outcome: 1,
                        model_type: audit.model_type,
                        ia_type: audit.ia_type,
                        enable_llm: true,
                        model_id: String(validAuditId) // Pass audit_id as string for backend background task
                    }),
                    signal: AbortSignal.timeout(300000) // 300 seconds timeout
                })

                if (fairnessResponse.ok) {
                    const result = await fairnessResponse.json()

                    // Always return processing status if backend says so
                    if (result.status === 'processing' || (result.message && result.message.includes('background'))) {
                        console.log(`[Calculate-Enhanced] ${result.message}`)
                        return NextResponse.json({
                            success: true,
                            status: 'processing',
                            message: result.message
                        })
                    }

                    // Fallback for completion
                    console.log(`[Calculate-Enhanced] Calculation successful.`)

                    // Note: We are now depending on background tasks, but if synchronous fallback happens:
                    // Only update if we have results.
                    if (result.overall_score !== undefined) {
                        // Update audit logic here if needed, but primarily relying on backend background task
                        // For now, return the result directly.
                        return NextResponse.json({
                            success: true,
                            ...result
                        })
                    }

                    return NextResponse.json({
                        success: true,
                        status: 'processing',
                        message: "Processing started"
                    })

                } else {
                    const errorText = await fairnessResponse.text()
                    console.error('FastAPI error response:', errorText)
                    throw new Error(`FastAPI returned ${fairnessResponse.status}: ${errorText}`)
                }
            } catch (fairnessError) {
                console.error('FastAPI fairness error:', fairnessError)
                return NextResponse.json({ error: fairnessError.message || 'Error occurred during fairness calculation' }, { status: 500 })
            }
        }

        // FastAPI backend is unreachable or setup failed
        return NextResponse.json({
            error: 'Impossible de préparer les données pour l\'analyse.',
        }, { status: 503 })

    } catch (error) {
        console.error('Fairness calculation error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
