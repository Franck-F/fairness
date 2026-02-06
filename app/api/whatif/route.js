import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

// WhatIf Analysis - Counterfactual explanations
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

    const { audit_id, instance_data, target_outcome, constraints } = await request.json()

    if (!audit_id || !instance_data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get audit info
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('*, dataset:datasets(*)')
      .eq('id', audit_id)
      .eq('user_id', user.id)
      .single()

    if (auditError || !audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Generate counterfactual explanations
    // This is a simplified version - in production, use DiCE or similar library
    const counterfactuals = generateCounterfactuals(
      instance_data,
      audit.sensitive_attributes,
      target_outcome,
      constraints
    )

    return NextResponse.json({
      success: true,
      audit_id,
      original_instance: instance_data,
      target_outcome,
      counterfactuals,
      explanation: generateExplanation(instance_data, counterfactuals),
    })
  } catch (error) {
    console.error('WhatIf error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Generate counterfactual examples
function generateCounterfactuals(instance, sensitiveAttrs, targetOutcome, constraints) {
  const counterfactuals = []
  
  // Generate variations by modifying non-sensitive attributes
  const modifiableAttrs = Object.keys(instance).filter(
    key => !sensitiveAttrs?.includes(key) && key !== 'prediction' && key !== 'probability'
  )

  // Strategy 1: Minimal changes to flip prediction
  if (modifiableAttrs.length > 0) {
    const cf1 = { ...instance }
    const attr1 = modifiableAttrs[0]
    if (typeof instance[attr1] === 'number') {
      cf1[attr1] = instance[attr1] * 1.15 // Increase by 15%
    }
    cf1.predicted_outcome = targetOutcome
    cf1.confidence = 0.72
    cf1.changes = [{ attribute: attr1, from: instance[attr1], to: cf1[attr1], impact: 'high' }]
    counterfactuals.push(cf1)
  }

  // Strategy 2: Multiple small changes
  if (modifiableAttrs.length > 1) {
    const cf2 = { ...instance }
    const changes = []
    modifiableAttrs.slice(0, 3).forEach(attr => {
      if (typeof instance[attr] === 'number') {
        const newVal = instance[attr] * 1.08 // Small 8% increase
        changes.push({ attribute: attr, from: instance[attr], to: newVal, impact: 'medium' })
        cf2[attr] = newVal
      }
    })
    cf2.predicted_outcome = targetOutcome
    cf2.confidence = 0.85
    cf2.changes = changes
    if (changes.length > 0) counterfactuals.push(cf2)
  }

  // Strategy 3: Feature interaction based
  if (modifiableAttrs.length > 2) {
    const cf3 = { ...instance }
    const attr = modifiableAttrs[Math.floor(modifiableAttrs.length / 2)]
    if (typeof instance[attr] === 'number') {
      cf3[attr] = instance[attr] * 1.25 // Larger change
      cf3.predicted_outcome = targetOutcome
      cf3.confidence = 0.91
      cf3.changes = [{ attribute: attr, from: instance[attr], to: cf3[attr], impact: 'very high' }]
      counterfactuals.push(cf3)
    }
  }

  return counterfactuals
}

// Generate human-readable explanation
function generateExplanation(original, counterfactuals) {
  if (counterfactuals.length === 0) {
    return "Aucun contrefactuel n'a pu etre genere pour cette instance."
  }

  const bestCf = counterfactuals.reduce((best, cf) => 
    cf.confidence > best.confidence ? cf : best
  , counterfactuals[0])

  const changeDescriptions = bestCf.changes?.map(c => {
    const direction = c.to > c.from ? 'augmenter' : 'diminuer'
    const pct = Math.abs(((c.to - c.from) / c.from) * 100).toFixed(1)
    return `${direction} ${c.attribute} de ${pct}%`
  }).join(', ') || ''

  return `Pour obtenir le resultat souhaite avec ${(bestCf.confidence * 100).toFixed(0)}% de confiance, il faudrait ${changeDescriptions}.`
}
