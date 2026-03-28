import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { z } from 'zod'
import { safeFetchBackend } from '@/lib/security'
import logger from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Schema for public API audit request
const publicAuditSchema = z.object({
  audit_name: z.string().min(1).max(200),
  target_column: z.string().min(1),
  sensitive_attributes: z.array(z.string()).min(1),
  use_case: z.string().max(100).optional(),
  model_type: z.string().max(100).optional(),
})

// Authenticate via API key (X-API-Key header)
async function authenticateApiKey(request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || !apiKey.startsWith('aiq_')) {
    return null
  }

  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')

  const { data: keyRecord } = await supabase
    .from('api_keys')
    .select('user_id, is_active')
    .eq('key_hash', hashedKey)
    .eq('is_active', true)
    .single()

  if (!keyRecord) return null

  // Update last_used_at
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_hash', hashedKey)

  return keyRecord.user_id
}

// POST /api/v1/audit - Create and run a fairness audit (public API)
export async function POST(request) {
  try {
    const userId = await authenticateApiKey(request)
    if (!userId) {
      return NextResponse.json({
        error: 'Invalid or missing API key',
        hint: 'Include your API key in the X-API-Key header',
      }, { status: 401 })
    }

    // Parse request - check if multipart (with file) or JSON
    const contentType = request.headers.get('content-type') || ''

    let body, fileContent
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      body = {
        audit_name: formData.get('audit_name'),
        target_column: formData.get('target_column'),
        sensitive_attributes: JSON.parse(formData.get('sensitive_attributes') || '[]'),
        use_case: formData.get('use_case'),
        model_type: formData.get('model_type'),
      }
      const file = formData.get('file')
      if (file) {
        fileContent = await file.text()
      }
    } else {
      body = await request.json()
    }

    // Validate
    const result = publicAuditSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
      }, { status: 400 })
    }

    const { audit_name, target_column, sensitive_attributes, use_case, model_type } = result.data

    // Create audit record
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .insert({
        user_id: userId,
        audit_name,
        use_case: use_case || 'general',
        target_column,
        sensitive_attributes,
        model_type: model_type || null,
        status: 'pending',
        bias_detected: false,
        critical_bias_count: 0,
        fairness_metrics: ['demographic_parity', 'equalized_odds', 'disparate_impact'],
      })
      .select()
      .single()

    if (auditError) {
      return NextResponse.json({ error: 'Failed to create audit', details: auditError.message }, { status: 500 })
    }

    // If file content provided, upload to FastAPI and trigger analysis
    if (fileContent) {
      try {
        const formData = new FormData()
        const blob = new Blob([fileContent], { type: 'text/csv' })
        formData.append('file', blob, 'data.csv')
        formData.append('dataset_name', `api_${audit.id}`)

        const uploadRes = await safeFetchBackend('/api/datasets/upload', { method: 'POST', body: formData })

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json()
          const datasetId = uploadResult.dataset_id

          // Trigger fairness calculation
          const fairnessRes = await safeFetchBackend('/api/fairness/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dataset_id: String(datasetId),
              target_column,
              sensitive_attributes,
              favorable_outcome: 1,
              model_type: model_type || 'classification',
            }),
          })

          if (fairnessRes.ok) {
            const fairnessResult = await fairnessRes.json()

            await supabase
              .from('audits')
              .update({
                status: 'completed',
                overall_score: Math.round(fairnessResult.overall_score),
                risk_level: fairnessResult.risk_level === 'faible' ? 'Low' : fairnessResult.risk_level === 'moyen' ? 'Medium' : 'High',
                bias_detected: fairnessResult.bias_detected,
                metrics_results: fairnessResult.metrics_by_attribute,
                recommendations: fairnessResult.recommendations || [],
                completed_at: new Date().toISOString(),
              })
              .eq('id', audit.id)

            return NextResponse.json({
              success: true,
              audit_id: audit.id,
              status: 'completed',
              overall_score: Math.round(fairnessResult.overall_score),
              risk_level: fairnessResult.risk_level,
              bias_detected: fairnessResult.bias_detected,
              metrics: fairnessResult.metrics_by_attribute,
              recommendations: fairnessResult.recommendations,
            })
          }
        }
      } catch (e) {
        logger.error("V1", 'FastAPI error in public API:', e)
      }

      // FastAPI failed - return pending status
      await supabase.from('audits').update({ status: 'failed' }).eq('id', audit.id)
    }

    return NextResponse.json({
      success: true,
      audit_id: audit.id,
      status: audit.status,
      message: fileContent
        ? 'Analyse echouee - verifiez que le backend FastAPI est disponible'
        : 'Audit cree. Uploadez un dataset via le dashboard pour lancer l\'analyse.',
    }, { status: fileContent ? 503 : 201 })
  } catch (error) {
    logger.error("V1", 'Public API audit error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET /api/v1/audit?id=<audit_id> - Get audit results
export async function GET(request) {
  try {
    const userId = await authenticateApiKey(request)
    if (!userId) {
      return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const auditId = searchParams.get('id')

    if (!auditId) {
      // List audits
      const { data: audits } = await supabase
        .from('audits')
        .select('id, audit_name, status, overall_score, risk_level, bias_detected, created_at, completed_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      return NextResponse.json({ audits: audits || [] })
    }

    // Get specific audit
    const { data: audit, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .eq('user_id', userId)
      .single()

    if (error || !audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    return NextResponse.json({
      audit_id: audit.id,
      audit_name: audit.audit_name,
      status: audit.status,
      overall_score: audit.overall_score,
      risk_level: audit.risk_level,
      bias_detected: audit.bias_detected,
      metrics: audit.metrics_results,
      recommendations: audit.recommendations,
      created_at: audit.created_at,
      completed_at: audit.completed_at,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
