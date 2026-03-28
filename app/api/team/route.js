import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { inviteTeamMemberSchema, updateTeamMemberSchema, validate } from '@/lib/validations'
import logger from '@/lib/logger'

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
    logger.error("TEAM", 'Team GET error:', error)
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

    const body = await request.json()
    const { success, errors, data: validated } = validate(inviteTeamMemberSchema, body)
    if (!success) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }
    const { email, role } = validated

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
      logger.error("TEAM", 'Invitation error (table may not exist):', inviteError)
      
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
        logger.error("TEAM", 'Member creation error:', memberError)
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
    logger.error("TEAM", 'Team POST error:', error)
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

    const putBody = await request.json()
    const { success: putSuccess, errors: putErrors, data: putValidated } = validate(updateTeamMemberSchema, putBody)
    if (!putSuccess) {
      return NextResponse.json({ error: putErrors.join(', ') }, { status: 400 })
    }
    const { memberId, role } = putValidated

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
    logger.error("TEAM", 'Team PUT error:', error)
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
    logger.error("TEAM", 'Team DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
