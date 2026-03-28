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

// GET /api/monitoring - Drift detection and monitoring data
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
      return NextResponse.json({ monitors: [], drift_alerts: [] })
    }

    // Fetch all completed audits with scores over time
    const { data: audits, error } = await dbClient
      .from('audits')
      .select('id, audit_name, overall_score, risk_level, bias_detected, critical_bias_count, created_at, completed_at, sensitive_attributes, metrics_results, use_case')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!audits || audits.length === 0) {
      return NextResponse.json({ monitors: [], drift_alerts: [], summary: null })
    }

    // Calculate drift: compare each audit's score to the moving average
    const driftAlerts = []
    const windowSize = 3

    for (let i = windowSize; i < audits.length; i++) {
      const window = audits.slice(i - windowSize, i)
      const avgScore = window.reduce((sum, a) => sum + (a.overall_score || 0), 0) / windowSize
      const current = audits[i]
      const deviation = (current.overall_score || 0) - avgScore

      if (Math.abs(deviation) > 10) {
        driftAlerts.push({
          audit_id: current.id,
          audit_name: current.audit_name,
          date: current.completed_at,
          score: current.overall_score,
          expected_score: Math.round(avgScore),
          deviation: Math.round(deviation),
          severity: Math.abs(deviation) > 20 ? 'critical' : 'warning',
          message: deviation < 0
            ? `Score en baisse de ${Math.abs(Math.round(deviation))} points par rapport a la moyenne`
            : `Score en hausse de ${Math.round(deviation)} points par rapport a la moyenne`,
        })
      }
    }

    // Group audits by use case for monitoring
    const useCaseGroups = {}
    audits.forEach(a => {
      const uc = a.use_case || 'general'
      if (!useCaseGroups[uc]) useCaseGroups[uc] = []
      useCaseGroups[uc].push(a)
    })

    const monitors = Object.entries(useCaseGroups).map(([useCase, ucAudits]) => {
      const scores = ucAudits.map(a => a.overall_score || 0)
      const latestScore = scores[scores.length - 1]
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      const trend = scores.length >= 2 ? scores[scores.length - 1] - scores[scores.length - 2] : 0

      return {
        use_case: useCase,
        audit_count: ucAudits.length,
        latest_score: latestScore,
        avg_score: avgScore,
        trend: Math.round(trend),
        status: latestScore >= 80 ? 'healthy' : latestScore >= 60 ? 'warning' : 'critical',
        history: ucAudits.map(a => ({
          date: a.completed_at,
          score: a.overall_score,
          risk_level: a.risk_level,
        })),
      }
    })

    // Overall summary
    const allScores = audits.map(a => a.overall_score || 0)
    const summary = {
      total_audits: audits.length,
      avg_score: Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length),
      latest_score: allScores[allScores.length - 1],
      drift_alerts_count: driftAlerts.length,
      critical_alerts: driftAlerts.filter(d => d.severity === 'critical').length,
      trend: allScores.length >= 2 ? Math.round(allScores[allScores.length - 1] - allScores[allScores.length - 2]) : 0,
      health: allScores[allScores.length - 1] >= 80 ? 'healthy' : allScores[allScores.length - 1] >= 60 ? 'degraded' : 'critical',
    }

    return NextResponse.json({
      monitors,
      drift_alerts: driftAlerts,
      summary,
      timeline: audits.map(a => ({
        date: a.completed_at,
        score: a.overall_score,
        name: a.audit_name,
        risk_level: a.risk_level,
      })),
    })
  } catch (error) {
    logger.error("MONITORING", 'Monitoring error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
