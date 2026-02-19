import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

const isPlaceholderKey = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your-service-role-key'
const authClient = isPlaceholderKey
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : supabase

async function getInternalUserId(authUser, dbClient) {
    const { data: internalUser } = await dbClient
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single()
    return internalUser?.id
}

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const token = authHeader.replace('Bearer ', '')
        const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token)

        if (authError || !authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const dbClient = isPlaceholderKey
            ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
                global: { headers: { Authorization: `Bearer ${token}` } }
            })
            : supabase

        const userId = await getInternalUserId(authUser, dbClient)
        if (!userId) return NextResponse.json({ projects: [] })

        const { data: projects, error } = await dbClient
            .from('ds_projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ projects: projects || [] })
    } catch (error) {
        console.error('DS Projects GET error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const token = authHeader.replace('Bearer ', '')
        const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token)

        if (authError || !authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { dataset_id, project_name, target_column, problem_type } = body

        const dbClient = isPlaceholderKey
            ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
                global: { headers: { Authorization: `Bearer ${token}` } }
            })
            : supabase

        const userId = await getInternalUserId(authUser, dbClient)
        if (!userId) return NextResponse.json({ error: 'User mapping failed' }, { status: 404 })

        // Use the backend to create the project or insert directly
        // Direct insert is safer for consistency with Next.js patterns here
        const payload = {
            user_id: userId,
            project_name,
            target_column,
            problem_type,
            status: 'active'
        }

        if (dataset_id) {
            payload.dataset_id = parseInt(dataset_id)
        }

        const { data: project, error } = await dbClient
            .from('ds_projects')
            .insert(payload)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ status: 'success', project })
    } catch (error) {
        console.error('DS Projects POST error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
