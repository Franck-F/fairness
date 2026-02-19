import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

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

// Calculate fairness metrics via FastAPI backend
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

    if (!audit_id) {
      return NextResponse.json({ error: 'audit_id is required' }, { status: 400 })
    }

    // Get audit with dataset info from Supabase
    const { data: audit, error: auditError } = await dbClient
      .from('audits')
      .select('*')
      .eq('id', audit_id)
      .eq('user_id', userId)
      .single()

    if (auditError || !audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Reset audit status and results to ensure polling waits correctly
    console.log(`[Calculate] Resetting status for Audit ${audit_id}...`)
    await dbClient
      .from('audits')
      .update({
        status: 'processing',
        metrics_results: null,
        overall_score: null,
        bias_detected: false,
        critical_bias_count: 0,
        recommendations: null,
        completed_at: null
      })
      .eq('id', audit_id)

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
    const fastApiDatasetIdPre = await uploadToFastAPI(audit.dataset_id)
    const fastApiDatasetIdPost = await uploadToFastAPI(audit.dataset_id_post)

    // If we have at least the pre dataset, calculate fairness
    if (fastApiDatasetIdPre) {
      try {
        const fairnessResponse = await fetch(`${FASTAPI_URL}/api/fairness/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataset_id: fastApiDatasetIdPre,
            dataset_id_post: fastApiDatasetIdPost,
            target_column: audit.target_column,
            sensitive_attributes: audit.sensitive_attributes || [],
            favorable_outcome: 1,
            model_type: audit.model_type,
            ia_type: audit.ia_type
          }),
        })

        if (fairnessResponse.ok) {
          const result = await fairnessResponse.json()

          // Update audit in Supabase with real results
          const recommendations = (result.recommendations || []).map(rec => ({
            title: typeof rec === 'string' ? rec : rec.title || rec,
            description: typeof rec === 'string' ? rec : rec.description || rec,
            impact: '+8%',
            effort: 'Moyen',
            priority: 'Haute',
            technique: 'Mixte',
          }))

          // Calculate critical_bias_count from failed metrics
          let criticalBiasCount = 0
          if (result.metrics_by_attribute) {
            Object.values(result.metrics_by_attribute).forEach(metrics => {
              if (Array.isArray(metrics)) {
                criticalBiasCount += metrics.filter(m => m.status === 'fail').length
              }
            })
          }

          const { error: updateError } = await dbClient
            .from('audits')
            .update({
              status: 'completed',
              overall_score: Math.round(result.overall_score),
              risk_level: result.risk_level === 'faible' ? 'Low' : result.risk_level === 'moyen' ? 'Medium' : 'High',
              bias_detected: result.bias_detected,
              critical_bias_count: criticalBiasCount,
              metrics_results: result.metrics_by_attribute,
              comparison_results: result.comparison_results || null,
              recommendations: recommendations,
              completed_at: new Date().toISOString(),
            })
            .eq('id', audit_id)

          if (updateError) {
            console.error('Failed to update audit:', updateError)
          }

          return NextResponse.json({
            success: true,
            overall_score: Math.round(result.overall_score),
            risk_level: result.risk_level,
            bias_detected: result.bias_detected,
            metrics_by_attribute: result.metrics_by_attribute,
            recommendations: result.recommendations,
          })
        }
      } catch (fairnessError) {
        console.error('FastAPI fairness error:', fairnessError)
      }
    }

    // FastAPI backend is unreachable — return error instead of fake data
    console.error('FastAPI backend unreachable, cannot calculate fairness metrics')

    // Mark audit as failed so the user knows
    await dbClient
      .from('audits')
      .update({
        status: 'failed',
      })
      .eq('id', audit_id)

    return NextResponse.json({
      error: 'Le serveur d\'analyse (FastAPI) est injoignable. Veuillez vérifier qu\'il est lancé sur le port 8000.',
      details: 'Lancez le backend avec: cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload',
    }, { status: 503 })

  } catch (error) {
    console.error('Fairness calculation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
