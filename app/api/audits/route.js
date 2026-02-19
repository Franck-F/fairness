import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase
try {
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey)
  }
} catch (e) {
  console.error('Failed to initialize Supabase service client:', e)
}

const isPlaceholderKey = !supabaseServiceKey || supabaseServiceKey === 'your-service-role-key'
let dbClient

if (supabase) {
  dbClient = supabase
} else if (supabaseUrl && supabaseAnonKey) {
  console.warn('Using Supabase Anon Client as fallback (Service key missing or invalid)')
  dbClient = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.error('Critical: Missing Supabase URL or Keys')
}

// Helper to get internal user ID from auth user
async function getInternalUserId(authUser, dbClient) {
  let { data: internalUser } = await dbClient
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single()

  if (!internalUser) {
    const { data: newUser } = await dbClient
      .from('users')
      .insert({
        email: authUser.email,
        first_name: authUser.user_metadata?.full_name?.split(' ')[0] || 'User',
        last_name: authUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        hashed_password: 'oauth_user',
        role: 'user',
        plan: 'freemium',
      })
      .select('id')
      .single()
    internalUser = newUser
  }
  return internalUser?.id
}

export async function GET(request) {
  try {
    console.log('GET /api/audits - Request received')

    // Get auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      console.warn('GET /api/audits - No auth header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('GET /api/audits - Verifying token...')

    if (!dbClient) {
      console.error('GET /api/audits - dbClient is undefined. Check env vars.')
      return NextResponse.json({
        error: 'Database configuration error',
        debug: {
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey,
          hasAnonKey: !!supabaseAnonKey,
          nodeEnv: process.env.NODE_ENV
        }
      }, { status: 500 })
    }

    const { data: { user: authUser }, error: authError } = await dbClient.auth.getUser(token)

    if (authError || !authUser) {
      console.error('GET /api/audits - Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('GET /api/audits - Auth user found:', authUser.email)
    const userId = await getInternalUserId(authUser, dbClient)
    console.log('GET /api/audits - Internal user ID:', userId)

    if (!userId) {
      return NextResponse.json({ audits: [] })
    }

    // Fetch audits from database
    console.log('GET /api/audits - Fetching audits for user:', userId)
    const { data: audits, error } = await dbClient
      .from('audits')
      .select(`
        id,
        audit_name,
        use_case,
        target_column,
        sensitive_attributes,
        status,
        overall_score,
        risk_level,
        bias_detected,
        critical_bias_count,
        created_at,
        completed_at,
        dataset_id,
        datasets!audits_dataset_id_fkey (original_filename)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET /api/audits - Supabase query error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('GET /api/audits - Audits fetched:', audits?.length || 0)

    // Format response
    const formattedAudits = (audits || []).map(audit => ({
      ...audit,
      dataset_name: audit.datasets?.original_filename || null,
    }))

    return NextResponse.json({ audits: formattedAudits })
  } catch (error) {
    console.error('GET /api/audits - Internal error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

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
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { audit_name, use_case, dataset_id, dataset_id_post, config, model_type, ia_type, audit_type } = body

    // Match the actual database schema
    const { data: audit, error } = await dbClient
      .from('audits')
      .insert({
        user_id: userId,
        audit_name: audit_name || 'Nouvel Audit',
        use_case: use_case || 'general',
        dataset_id,
        dataset_id_post: dataset_id_post || null,
        model_type: model_type || null,
        ia_type: ia_type || null,
        audit_type: audit_type || 'single',
        target_column: config?.target_column || null,
        sensitive_attributes: config?.protected_attributes || [],
        fairness_metrics: ['demographic_parity', 'equalized_odds', 'disparate_impact'],
        status: 'pending',
        bias_detected: false,
        critical_bias_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Create audit error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ audit, success: true })
  } catch (error) {
    console.error('Create audit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
