import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGeminiModel } from '@/lib/gemini'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

const isPlaceholderKey = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your-service-role-key'
const authClient = isPlaceholderKey
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : supabase

// Helper to get internal user ID
async function getInternalUserId(authUser, dbClient) {
    const { data: internalUser } = await dbClient
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single()
    return internalUser?.id
}

// Generate AI insights for an audit
export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token)

        if (authError || !authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const dbClient = isPlaceholderKey
            ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
                global: { headers: { Authorization: `Bearer ${token}` } }
            })
            : supabase

        console.log('[INSIGHTS API] Fetching user ID...')
        const userId = await getInternalUserId(authUser, dbClient)
        console.log('[INSIGHTS API] User ID:', userId)

        const { audit_id } = await request.json()
        console.log('[INSIGHTS API] Looking for audit ID:', audit_id)

        if (!audit_id) {
            return NextResponse.json({ error: 'Missing audit_id' }, { status: 400 })
        }

        // Fetch audit details
        console.log('[INSIGHTS API] Fetching audit from database...')
        const { data: audit, error: auditError } = await dbClient
            .from('audits')
            .select('*, datasets!audits_dataset_id_fkey(*)')
            .eq('id', audit_id)
            .eq('user_id', userId)
            .single()

        console.log('[INSIGHTS API] Audit fetch result:', { found: !!audit, error: auditError?.message })

        if (auditError || !audit) {
            console.log('[INSIGHTS API] Audit not found:', auditError?.message)
            return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
        }

        console.log('[INSIGHTS API] Audit status:', audit.status)
        if (audit.status !== 'completed') {
            return NextResponse.json({ error: 'Audit not completed yet' }, { status: 400 })
        }

        console.log('[INSIGHTS API] Metrics results exists:', !!audit.metrics_results)
        // If no metrics_results, return fallback insights
        if (!audit.metrics_results || Object.keys(audit.metrics_results).length === 0) {
            console.log('[INSIGHTS API] No metrics, returning fallback')
            const fallbackInsights = [
                `L'audit "${audit.audit_name}" est terminé avec un score global de ${audit.overall_score || 0}%.`,
                audit.bias_detected
                    ? "Des biais ont été détectés. Lancez l'analyse de fairness détaillée pour obtenir des métriques complètes."
                    : "Statut initial favorable. Complétez l'analyse de fairness pour des insights détaillés.",
                "Utilisez le bouton 'Lancer l'Analyse' sur la page de détail pour calculer les métriques de fairness."
            ]
            return NextResponse.json({
                success: true,
                insights: fallbackInsights,
                fallback: true
            })
        }

        console.log('[INSIGHTS API] Generating Gemini insights...')

        // Build context for Gemini
        const metricsContext = audit.metrics_results
            ? Object.entries(audit.metrics_results).map(([attr, metrics]) => {
                const metricsList = Object.entries(metrics)
                    .map(([k, v]) => `${k}: ${(v * 100).toFixed(1)}%`)
                    .join(', ')
                return `**${attr}**: ${metricsList}`
            }).join('\n')
            : 'Aucune métrique disponible'

        const prompt = `Tu es un expert en fairness et en IA responsable. Analyse les résultats d'audit suivants et génère des insights courts et actionnables (maximum 2-3 phrases par insight).

**Audit**: ${audit.audit_name}
**Score Global**: ${audit.overall_score || 0}%
**Risque**: ${audit.risk_level || 'N/A'}
**Biais Détecté**: ${audit.bias_detected ? 'Oui' : 'Non'}

**Métriques par attribut sensible**:
${metricsContext}

Génère 2-3 insights clairs et concis au format suivant (sans numérotation, juste les insights séparés par des sauts de ligne):
- Un insight sur le niveau de risque global
- Un insight sur les attributs sensibles problématiques (si applicable)
- Une recommandation prioritaire

Réponds en français, sois direct et pragmatique.`

        // Call Gemini
        const model = getGeminiModel()
        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()

        // Parse insights (split by line breaks)
        const insights = text
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[-*•]\s*/, '').trim())
            .filter(line => line.length > 10)

        return NextResponse.json({
            success: true,
            insights: insights.slice(0, 3), // Max 3 insights
        })

    } catch (error) {
        console.error('Insights generation error:', error)
        return NextResponse.json({
            error: 'Failed to generate insights',
            details: error.message
        }, { status: 500 })
    }
}
