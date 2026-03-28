import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import logger from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const isPlaceholderKey = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your-service-role-key'
const dbClient = isPlaceholderKey
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : supabase

async function getInternalUserId(authUser) {
  const { data: internalUser } = await dbClient
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single()
  return internalUser?.id
}

// GET /api/notifications - List user notifications
export async function GET(request) {
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

    const userId = await getInternalUserId(authUser)
    if (!userId) {
      return NextResponse.json({ notifications: [], unread_count: 0 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const offset = (page - 1) * limit
    const unreadOnly = searchParams.get('unread') === 'true'

    let query = dbClient
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data: notifications, error, count } = await query

    if (error) {
      logger.error("NOTIFICATIONS", 'Notifications fetch error:', error)
      return NextResponse.json({ notifications: [], unread_count: 0 })
    }

    // Count unread
    const { count: unreadCount } = await dbClient
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    return NextResponse.json({
      notifications: notifications || [],
      unread_count: unreadCount || 0,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    logger.error("NOTIFICATIONS", 'Notifications GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/notifications - Mark notification(s) as read
export async function PUT(request) {
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

    const userId = await getInternalUserId(authUser)
    const { notification_id, mark_all } = await request.json()

    if (mark_all) {
      // Mark all as read
      await dbClient
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('read', false)

      return NextResponse.json({ success: true, message: 'Toutes les notifications marquees comme lues' })
    }

    if (!notification_id) {
      return NextResponse.json({ error: 'notification_id ou mark_all requis' }, { status: 400 })
    }

    const { error } = await dbClient
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notification_id)
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("NOTIFICATIONS", 'Notifications PUT error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/notifications - Delete notification
export async function DELETE(request) {
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

    const userId = await getInternalUserId(authUser)
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID requis' }, { status: 400 })
    }

    const { error } = await dbClient
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("NOTIFICATIONS", 'Notifications DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
