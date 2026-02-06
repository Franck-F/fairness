import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Helper to get internal user ID from auth user
async function getInternalUserId(authUser) {
  let { data: internalUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single()

  if (!internalUser) {
    const { data: newUser } = await supabase
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
    // Get auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = await getInternalUserId(authUser)
    if (!userId) {
      return NextResponse.json({ audits: [] })
    }

    // Fetch audits from database
    const { data: audits, error } = await supabase
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
        datasets (original_filename)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format response
    const formattedAudits = (audits || []).map(audit => ({
      ...audit,
      dataset_name: audit.datasets?.original_filename || null,
    }))

    return NextResponse.json({ audits: formattedAudits })
  } catch (error) {
    console.error('Get audits error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = await getInternalUserId(authUser)
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { audit_name, use_case, dataset_id, config } = body

    // Match the actual database schema
    const { data: audit, error } = await supabase
      .from('audits')
      .insert({
        user_id: userId,
        audit_name: audit_name || 'Nouvel Audit',
        use_case: use_case || 'general',
        dataset_id,
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
