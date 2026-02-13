import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Helper to re-upload dataset to FastAPI if missing
async function autoHealDataset(datasetId, token) {
    try {
        console.log(`Auto-healing dataset: ${datasetId}`)
        // 1. Get dataset info from Supabase (try both id and fastapi_dataset_id)
        let { data: dataset, error: dbError } = await supabase
            .from('datasets')
            .select('*')
            .or(`id.eq.${datasetId},fastapi_dataset_id.eq.${datasetId}`)
            .single()

        if (dbError || !dataset) {
            console.error('Dataset not found in Supabase (tried both ID types):', dbError)
            return false
        }

        // 2. Download from Storage
        const { data: fileData, error: storageError } = await supabase.storage
            .from('datasets')
            .download(dataset.filename)

        if (storageError || !fileData) {
            console.error('File not found in Storage:', storageError)
            return false
        }

        // 3. Upload to FastAPI
        const formData = new FormData()
        formData.append('file', fileData, dataset.original_filename || 'dataset.csv')
        formData.append('dataset_name', dataset.original_filename || 'dataset.csv')

        const uploadResponse = await fetch(`${FASTAPI_URL}/api/datasets/upload`, {
            method: 'POST',
            body: formData,
        })

        if (!uploadResponse.ok) {
            console.error('Failed to re-upload to FastAPI:', await uploadResponse.text())
            return false
        }

        const uploadResult = await uploadResponse.json()
        console.log(`Dataset re-uploaded successfully: ${uploadResult.dataset_id}`)
        return true
    } catch (error) {
        console.error('Auto-heal error:', error)
        return false
    }
}

export async function POST(request, { params }) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { slug } = params
        const path = slug.join('/')

        // Get the request body
        const body = await request.json()

        // Forward the request to FastAPI
        let response = await fetch(`${FASTAPI_URL}/api/ds/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
        })

        // Auto-heal if 404 (dataset missing from FastAPI's in-memory store)
        if (response.status === 404 && body.dataset_id) {
            const healed = await autoHealDataset(body.dataset_id, token)
            if (healed) {
                // Retry original request
                response = await fetch(`${FASTAPI_URL}/api/ds/${path}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body),
                })
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return NextResponse.json(
                { error: errorData.detail || `Backend error: ${response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.error(`Error in /api/ds proxy:`, error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(request, { params }) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { slug } = params
        const path = slug.join('/')

        const { searchParams } = new URL(request.url)
        const datasetId = searchParams.get('dataset_id')
        const queryString = searchParams.toString()
        const url = `${FASTAPI_URL}/api/ds/${path}${queryString ? '?' + queryString : ''}`

        let response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        // Auto-heal if 404
        if (response.status === 404 && datasetId) {
            const healed = await autoHealDataset(datasetId, token)
            if (healed) {
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return NextResponse.json(
                { error: errorData.detail || `Backend error: ${response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.error(`Error in /api/ds proxy (GET):`, error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
