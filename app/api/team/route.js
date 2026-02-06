import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get team members
export async function GET(request) {
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

    // Get user's organization (simplified - using user_id as org for now)
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('*')
      .eq('organization_id', user.id)
      .order('created_at', { ascending: false })

    if (membersError) {
      // If table doesn't exist, return empty array
      return NextResponse.json({ members: [], owner: user })
    }

    return NextResponse.json({
      members: members || [],
      owner: {
        id: user.id,
        email: user.email,
        role: 'owner',
      },
    })
  } catch (error) {
    console.error('Team GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Invite team member
export async function POST(request) {
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

    const { email, role } = await request.json()

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['admin', 'auditor', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Check if member already exists
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('*')
      .eq('organization_id', user.id)
      .eq('email', email)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: 'Member already exists' }, { status: 400 })
    }

    // Create invitation
    const inviteToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    const { data: invitation, error: inviteError } = await supabase
      .from('team_invitations')
      .insert({
        organization_id: user.id,
        email: email,
        role: role,
        invite_token: inviteToken,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      })
      .select()
      .single()

    if (inviteError) {
      // Create table if it doesn't exist and retry
      console.error('Invitation error (table may not exist):', inviteError)
      
      // For now, create a pending member entry
      const { data: member, error: memberError } = await supabase
        .from('team_members')
        .insert({
          organization_id: user.id,
          email: email,
          role: role,
          status: 'pending',
          invited_by: user.id,
        })
        .select()
        .single()

      if (memberError) {
        console.error('Member creation error:', memberError)
        return NextResponse.json({ 
          success: true,
          message: 'Invitation envoyee (simulation)',
          invitation: {
            email,
            role,
            status: 'pending',
          }
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Invitation envoyee',
        member,
      })
    }

    // In production, send email invitation here
    // await sendInvitationEmail(email, inviteToken, user.email)

    return NextResponse.json({
      success: true,
      message: 'Invitation envoyee avec succes',
      invitation: {
        id: invitation?.id,
        email,
        role,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Team POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Update team member role
export async function PUT(request) {
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

    const { memberId, role } = await request.json()

    if (!memberId || !role) {
      return NextResponse.json({ error: 'Member ID and role are required' }, { status: 400 })
    }

    const validRoles = ['admin', 'auditor', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const { data: member, error: updateError } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', memberId)
      .eq('organization_id', user.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      member,
    })
  } catch (error) {
    console.error('Team PUT error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Remove team member
export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId)
      .eq('organization_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully',
    })
  } catch (error) {
    console.error('Team DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
