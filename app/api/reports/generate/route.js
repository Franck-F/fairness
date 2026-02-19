import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const isPlaceholderKey = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your-service-role-key'
const dbClient = isPlaceholderKey
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

// Generate PDF or TXT report via FastAPI backend
export async function POST(request) {
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

    const userId = await getInternalUserId(authUser, dbClient)
    const { audit_id, format } = await request.json()

    if (!audit_id || !format) {
      return NextResponse.json({ error: 'Audit ID and format required' }, { status: 400 })
    }

    // Get audit with full details from Supabase
    const { data: audit, error: auditError } = await dbClient
      .from('audits')
      .select(`*, datasets!audits_dataset_id_fkey(*)`)
      .eq('id', audit_id)
      .eq('user_id', userId)
      .single()

    if (auditError || !audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // For PDF, call FastAPI backend
    if (format === 'pdf') {
      try {
        const response = await fetch(`${FASTAPI_URL}/api/reports/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audit_id: audit_id,
            dataset_name: audit.datasets?.original_filename || audit.audit_name,
            fairness_results: {
              overall_score: audit.overall_score,
              risk_level: audit.risk_level,
              bias_detected: audit.bias_detected,
              metrics_by_attribute: audit.metrics_results || {},
              recommendations: audit.recommendations?.map(r => r.title || r) || [],
            },
            model_metrics: audit.datasets?.model_metrics || null,
            format: 'pdf',
          }),
        })

        if (response.ok) {
          // Return PDF as blob
          const pdfBuffer = await response.arrayBuffer()

          // Create report record in Supabase
          const fileName = `report_${audit_id}_${Date.now()}.pdf`
          await dbClient.from('reports').insert({
            audit_id: audit_id,
            user_id: userId,
            report_name: `Rapport ${audit.audit_name}`,
            format: 'pdf',
            file_path: fileName,
            file_size: pdfBuffer.byteLength,
          })

          return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename=${fileName}`,
            },
          })
        }
      } catch (fastApiError) {
        console.error('FastAPI PDF generation failed, falling back to HTML:', fastApiError)
      }
    }

    // Fallback: Generate HTML/TXT locally
    let reportContent
    let contentType
    let fileExtension

    if (format === 'txt') {
      reportContent = generateTXTReport(audit)
      contentType = 'text/plain'
      fileExtension = 'txt'
    } else {
      reportContent = generateHTMLReport(audit)
      contentType = 'text/html'
      fileExtension = 'html'
    }

    const fileName = `report_${audit_id}_${Date.now()}.${fileExtension}`

    return NextResponse.json({
      success: true,
      content: reportContent,
      content_type: contentType,
      filename: fileName,
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Generate TXT report
function generateTXTReport(audit) {
  const date = new Date(audit.created_at).toLocaleDateString('fr-FR')

  let report = `
========================================
RAPPORT D'AUDIT DE FAIRNESS - AuditIQ
========================================

Nom de l'audit: ${audit.audit_name}
Date: ${date}
Cas d'usage: ${audit.use_case}
Statut: ${audit.status}

========================================
RESUME EXECUTIF
========================================

Score global d'equite: ${audit.overall_score}%
Niveau de risque: ${audit.risk_level}
Biais detectes: ${audit.bias_detected ? 'Oui' : 'Non'}
Nombre de biais critiques: ${audit.critical_bias_count}

`

  // Add metrics results
  if (audit.metrics_results) {
    report += `
========================================
METRIQUES DE FAIRNESS
========================================

`
    for (const attr in audit.metrics_results) {
      report += `\nAttribut sensible: ${attr}\n`
      report += `${'-'.repeat(40)}\n`
      for (const metric in audit.metrics_results[attr]) {
        const value = (audit.metrics_results[attr][metric] * 100).toFixed(1)
        report += `  ${metric}: ${value}%\n`
      }
    }
  }

  // Add recommendations
  if (audit.recommendations && audit.recommendations.length > 0) {
    report += `
========================================
RECOMMANDATIONS
========================================

`
    audit.recommendations.forEach((rec, idx) => {
      report += `\n${idx + 1}. ${rec.title}\n`
      report += `   Description: ${rec.description}\n`
      report += `   Impact estime: ${rec.impact}\n`
      report += `   Effort: ${rec.effort}\n`
      report += `   Priorite: ${rec.priority}\n`
      report += `   Technique: ${rec.technique}\n`
    })
  }

  report += `
========================================
FIN DU RAPPORT
========================================

Genere par AuditIQ - ${new Date().toLocaleString('fr-FR')}
`

  return report
}

// Generate HTML report (can be converted to PDF client-side)
function generateHTMLReport(audit) {
  const date = new Date(audit.created_at).toLocaleDateString('fr-FR')

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport d'Audit - ${audit.audit_name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #3b82f6; margin-bottom: 10px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #3b82f6; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .summary-item { margin: 10px 0; }
    .summary-item strong { display: inline-block; width: 200px; }
    .metric-group { margin-bottom: 20px; }
    .metric-group h3 { color: #1f2937; margin-bottom: 10px; }
    .metric-item { padding: 10px; background: #f9fafb; margin: 5px 0; border-left: 4px solid #3b82f6; }
    .recommendation { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
    .score { font-size: 48px; font-weight: bold; color: ${audit.overall_score >= 80 ? '#10b981' : audit.overall_score >= 60 ? '#f59e0b' : '#ef4444'}; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Rapport d'Audit de Fairness</h1>
    <p><strong>${audit.audit_name}</strong></p>
    <p>Date: ${date}</p>
  </div>

  <div class="section">
    <h2>Resume Executif</h2>
    <div class="summary">
      <div class="summary-item"><strong>Score global:</strong> <span class="score">${audit.overall_score}%</span></div>
      <div class="summary-item"><strong>Niveau de risque:</strong> ${audit.risk_level}</div>
      <div class="summary-item"><strong>Cas d'usage:</strong> ${audit.use_case}</div>
      <div class="summary-item"><strong>Biais detectes:</strong> ${audit.bias_detected ? 'Oui' : 'Non'}</div>
      <div class="summary-item"><strong>Biais critiques:</strong> ${audit.critical_bias_count}</div>
    </div>
  </div>

  <div class="section">
    <h2>Metriques de Fairness</h2>
    ${Object.keys(audit.metrics_results || {}).map(attr => `
      <div class="metric-group">
        <h3>Attribut sensible: ${attr}</h3>
        ${Object.keys(audit.metrics_results[attr]).map(metric => `
          <div class="metric-item">
            <strong>${metric}:</strong> ${(audit.metrics_results[attr][metric] * 100).toFixed(1)}%
          </div>
        `).join('')}
      </div>
    `).join('')}
  </div>

  ${audit.recommendations && audit.recommendations.length > 0 ? `
    <div class="section">
      <h2>Recommandations</h2>
      ${audit.recommendations.map((rec, idx) => `
        <div class="recommendation">
          <h4>${idx + 1}. ${rec.title}</h4>
          <p>${rec.description}</p>
          <p><strong>Impact:</strong> ${rec.impact} | <strong>Effort:</strong> ${rec.effort} | <strong>Priorite:</strong> ${rec.priority}</p>
          <p><strong>Technique:</strong> ${rec.technique}</p>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <div class="footer">
    <p>Genere par AuditIQ - ${new Date().toLocaleString('fr-FR')}</p>
  </div>
</body>
</html>
`
}
