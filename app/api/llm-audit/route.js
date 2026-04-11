import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import logger from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const isPlaceholderKey = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your-service-role-key'
const authClient = isPlaceholderKey
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : supabase

// POST /api/llm-audit - Proxy to FastAPI /api/llm-audit/run
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token)
    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body?.endpoint?.url || !body?.endpoint?.payload_template) {
      return NextResponse.json(
        { error: 'Une URL d\'endpoint et un payload template sont requis.' },
        { status: 400 }
      )
    }

    const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'
    const backendResponse = await fetch(`${FASTAPI_URL}/api/llm-audit/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const payload = await backendResponse.json().catch(() => ({}))

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: payload?.detail || 'Echec de l\'audit LLM.' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(payload)
  } catch (error) {
    logger.error('LLM_AUDIT', 'LLM audit error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur interne' },
      { status: 500 }
    )
  }
}
