import { describe, it, expect } from 'vitest'
import {
  validate,
  signinSchema,
  signupSchema,
  forgotPasswordSchema,
  createAuditSchema,
  updateAuditSchema,
  chatSchema,
  mlTrainSchema,
  generateReportSchema,
  whatifSchema,
  insightsSchema,
  inviteTeamMemberSchema,
  calculateFairnessSchema,
  createDsProjectSchema,
  googleAuthSchema,
} from '@/lib/validations'

// ============================================
// Auth Schemas
// ============================================

describe('signinSchema', () => {
  it('accepts valid credentials', () => {
    const { success, data } = validate(signinSchema, { email: 'test@example.com', password: 'secret123' })
    expect(success).toBe(true)
    expect(data.email).toBe('test@example.com')
  })

  it('rejects missing email', () => {
    const { success, errors } = validate(signinSchema, { password: 'secret123' })
    expect(success).toBe(false)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('rejects invalid email format', () => {
    const { success } = validate(signinSchema, { email: 'not-an-email', password: 'secret123' })
    expect(success).toBe(false)
  })

  it('rejects empty password', () => {
    const { success } = validate(signinSchema, { email: 'test@example.com', password: '' })
    expect(success).toBe(false)
  })
})

describe('signupSchema', () => {
  it('accepts valid registration', () => {
    const { success } = validate(signupSchema, { email: 'user@test.com', password: 'MyPass123!', fullName: 'John' })
    expect(success).toBe(true)
  })

  it('rejects short password', () => {
    const { success } = validate(signupSchema, { email: 'user@test.com', password: '123' })
    expect(success).toBe(false)
  })

  it('accepts without fullName', () => {
    const { success } = validate(signupSchema, { email: 'user@test.com', password: 'MyPass123!' })
    expect(success).toBe(true)
  })
})

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    const { success } = validate(forgotPasswordSchema, { email: 'user@test.com' })
    expect(success).toBe(true)
  })

  it('rejects invalid email', () => {
    const { success } = validate(forgotPasswordSchema, { email: 'bad' })
    expect(success).toBe(false)
  })
})

describe('googleAuthSchema', () => {
  it('accepts valid token', () => {
    const { success } = validate(googleAuthSchema, { idToken: 'some-long-token-value' })
    expect(success).toBe(true)
  })

  it('rejects empty token', () => {
    const { success } = validate(googleAuthSchema, { idToken: '' })
    expect(success).toBe(false)
  })
})

// ============================================
// Audit Schemas
// ============================================

describe('createAuditSchema', () => {
  it('accepts minimal audit', () => {
    const { success } = validate(createAuditSchema, { audit_name: 'Test Audit' })
    expect(success).toBe(true)
  })

  it('accepts full audit config', () => {
    const { success, data } = validate(createAuditSchema, {
      audit_name: 'Full Audit',
      use_case: 'credit',
      dataset_id: '550e8400-e29b-41d4-a716-446655440000',
      config: {
        target_column: 'income',
        protected_attributes: ['gender', 'age'],
        thresholds: { demographic_parity: 0.8 },
      },
      model_type: 'xgboost',
      ia_type: 'tabular',
    })
    expect(success).toBe(true)
    expect(data.config.protected_attributes).toHaveLength(2)
  })

  it('rejects empty audit name', () => {
    const { success } = validate(createAuditSchema, { audit_name: '' })
    expect(success).toBe(false)
  })

  it('rejects invalid dataset_id format', () => {
    const { success } = validate(createAuditSchema, { audit_name: 'Test', dataset_id: 'not-a-uuid' })
    expect(success).toBe(false)
  })
})

describe('updateAuditSchema', () => {
  it('accepts partial update', () => {
    const { success } = validate(updateAuditSchema, { status: 'completed', overall_score: 85 })
    expect(success).toBe(true)
  })

  it('rejects unknown fields (strict)', () => {
    const { success } = validate(updateAuditSchema, { unknown_field: 'hack' })
    expect(success).toBe(false)
  })

  it('rejects invalid status', () => {
    const { success } = validate(updateAuditSchema, { status: 'invalid_status' })
    expect(success).toBe(false)
  })

  it('rejects score out of range', () => {
    const { success } = validate(updateAuditSchema, { overall_score: 150 })
    expect(success).toBe(false)
  })
})

// ============================================
// Chat Schema
// ============================================

describe('chatSchema', () => {
  it('accepts valid messages', () => {
    const { success } = validate(chatSchema, {
      messages: [{ role: 'user', content: 'Hello' }],
    })
    expect(success).toBe(true)
  })

  it('rejects empty messages array', () => {
    const { success } = validate(chatSchema, { messages: [] })
    expect(success).toBe(false)
  })

  it('rejects invalid role', () => {
    const { success } = validate(chatSchema, {
      messages: [{ role: 'hacker', content: 'test' }],
    })
    expect(success).toBe(false)
  })

  it('rejects empty content', () => {
    const { success } = validate(chatSchema, {
      messages: [{ role: 'user', content: '' }],
    })
    expect(success).toBe(false)
  })

  it('accepts with context', () => {
    const { success } = validate(chatSchema, {
      messages: [{ role: 'user', content: 'Explain bias' }],
      context: { audit_id: '123', score: 85 },
    })
    expect(success).toBe(true)
  })
})

// ============================================
// ML Training Schema
// ============================================

describe('mlTrainSchema', () => {
  it('accepts valid training config', () => {
    const { success, data } = validate(mlTrainSchema, {
      dataset_id: '550e8400-e29b-41d4-a716-446655440000',
      target_column: 'label',
    })
    expect(success).toBe(true)
    expect(data.algorithm).toBe('logistic_regression') // default
    expect(data.test_size).toBe(0.2) // default
  })

  it('rejects invalid algorithm', () => {
    const { success } = validate(mlTrainSchema, {
      dataset_id: '550e8400-e29b-41d4-a716-446655440000',
      target_column: 'label',
      algorithm: 'unknown_algo',
    })
    expect(success).toBe(false)
  })

  it('rejects test_size out of range', () => {
    const { success } = validate(mlTrainSchema, {
      dataset_id: '550e8400-e29b-41d4-a716-446655440000',
      target_column: 'label',
      test_size: 0.9,
    })
    expect(success).toBe(false)
  })
})

// ============================================
// Report Schema
// ============================================

describe('generateReportSchema', () => {
  it('accepts valid report request', () => {
    const { success } = validate(generateReportSchema, {
      audit_id: '550e8400-e29b-41d4-a716-446655440000',
      format: 'pdf',
    })
    expect(success).toBe(true)
  })

  it('rejects invalid format', () => {
    const { success } = validate(generateReportSchema, {
      audit_id: '550e8400-e29b-41d4-a716-446655440000',
      format: 'docx',
    })
    expect(success).toBe(false)
  })
})

// ============================================
// WhatIf Schema
// ============================================

describe('whatifSchema', () => {
  it('accepts valid whatif request', () => {
    const { success } = validate(whatifSchema, {
      audit_id: '550e8400-e29b-41d4-a716-446655440000',
      instance_data: { age: 30, income: 50000 },
      target_outcome: 1,
    })
    expect(success).toBe(true)
  })

  it('rejects target_outcome out of range', () => {
    const { success } = validate(whatifSchema, {
      audit_id: '550e8400-e29b-41d4-a716-446655440000',
      instance_data: { age: 30 },
      target_outcome: 5,
    })
    expect(success).toBe(false)
  })
})

// ============================================
// Team Schema
// ============================================

describe('inviteTeamMemberSchema', () => {
  it('accepts valid invite', () => {
    const { success } = validate(inviteTeamMemberSchema, { email: 'colleague@test.com', role: 'auditor' })
    expect(success).toBe(true)
  })

  it('rejects invalid role', () => {
    const { success } = validate(inviteTeamMemberSchema, { email: 'colleague@test.com', role: 'superadmin' })
    expect(success).toBe(false)
  })
})

// ============================================
// Fairness Schema
// ============================================

describe('calculateFairnessSchema', () => {
  it('accepts valid UUID audit_id', () => {
    const { success } = validate(calculateFairnessSchema, { audit_id: '550e8400-e29b-41d4-a716-446655440000' })
    expect(success).toBe(true)
  })

  it('rejects non-UUID audit_id', () => {
    const { success } = validate(calculateFairnessSchema, { audit_id: 'random-string' })
    expect(success).toBe(false)
  })
})

// ============================================
// DS Project Schema
// ============================================

describe('createDsProjectSchema', () => {
  it('accepts valid project', () => {
    const { success } = validate(createDsProjectSchema, { project_name: 'My Analysis' })
    expect(success).toBe(true)
  })

  it('rejects empty project name', () => {
    const { success } = validate(createDsProjectSchema, { project_name: '' })
    expect(success).toBe(false)
  })

  it('accepts with problem_type', () => {
    const { success } = validate(createDsProjectSchema, { project_name: 'Test', problem_type: 'classification' })
    expect(success).toBe(true)
  })

  it('rejects invalid problem_type', () => {
    const { success } = validate(createDsProjectSchema, { project_name: 'Test', problem_type: 'unknown' })
    expect(success).toBe(false)
  })
})
