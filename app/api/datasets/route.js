import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Helper to get internal user ID
async function getInternalUserId(authUser) {
  const { data: internalUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single()
  return internalUser?.id
}

// Get all datasets for the user
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
    if (!userId) {
      return NextResponse.json({ datasets: [] })
    }

    const { data: datasets, error: datasetsError } = await supabase
      .from('datasets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (datasetsError) {
      console.error('Datasets fetch error:', datasetsError)
      return NextResponse.json({ datasets: [] })
    }

    return NextResponse.json({
      datasets: datasets || [],
    })
  } catch (error) {
    console.error('Datasets GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Delete a dataset
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
    const datasetId = searchParams.get('id')

    if (!datasetId) {
      return NextResponse.json({ error: 'Dataset ID required' }, { status: 400 })
    }

    // Delete from Supabase
    const { error: deleteError } = await supabase
      .from('datasets')
      .delete()
      .eq('id', datasetId)
      .eq('user_id', userId)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete dataset' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Dataset deleted successfully',
    })
  } catch (error) {
    console.error('Datasets DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
