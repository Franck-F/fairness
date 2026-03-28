import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import logger from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getInternalUserId(authUser) {
  const { data } = await supabase.from('users').select('id').eq('email', authUser.email).single()
  return data?.id
}

// POST /api/v1/keys - Generate a new API key
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

    const { name } = await request.json()

    // Generate API key: aiq_<random 48 chars>
    const apiKey = `aiq_${crypto.randomBytes(24).toString('hex')}`
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')

    const { data: key, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        name: name || 'Default Key',
        key_hash: hashedKey,
        key_prefix: apiKey.substring(0, 12),
        is_active: true,
      })
      .select('id, name, key_prefix, is_active, created_at')
      .single()

    if (error) {
      logger.error("V1", 'API key creation error:', error)
      return NextResponse.json({ error: 'Failed to create API key. Make sure the api_keys table exists.' }, { status: 500 })
    }

    // Return the full key only on creation - it won't be shown again
    return NextResponse.json({
      success: true,
      api_key: apiKey,
      key_info: key,
      message: 'Conservez cette cle en lieu sur. Elle ne sera plus affichee.',
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET /api/v1/keys - List user's API keys
export async function GET(request) {
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

    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, is_active, created_at, last_used_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ keys: [] })
    }

    return NextResponse.json({ keys: keys || [] })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/v1/keys - Revoke an API key
export async function DELETE(request) {
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
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')

    if (!keyId) {
      return NextResponse.json({ error: 'Key ID required' }, { status: 400 })
    }

    await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId)
      .eq('user_id', userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
