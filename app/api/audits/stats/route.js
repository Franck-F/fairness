import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/audits/stats - Get audit statistics
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

    // Get all audits for this user
    const { data: audits, error } = await supabase
      .from('audits')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate statistics
    const totalAudits = audits.length
    const completedAudits = audits.filter(a => a.status === 'completed')
    const criticalAudits = audits.filter(a => a.risk_level === 'High').length
    const mediumAudits = audits.filter(a => a.risk_level === 'Medium').length
    const lowAudits = audits.filter(a => a.risk_level === 'Low').length

    const averageScore = completedAudits.length > 0
      ? Math.round(
          completedAudits.reduce((sum, a) => sum + (a.overall_score || 0), 0) /
            completedAudits.length
        )
      : 0

    // Get recent audits (last 5)
    const recentAudits = audits
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)

    return NextResponse.json({
      stats: {
        totalAudits,
        criticalAudits,
        mediumAudits,
        lowAudits,
        averageScore,
      },
      recentAudits,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
