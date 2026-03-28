import { z } from 'zod';

// ============================================
// Shared primitives
// ============================================

const email = z.string().email('Email invalide').max(255);
const password = z.string().min(8, 'Mot de passe: 8 caractères minimum').max(128);
const uuid = z.string().uuid('ID invalide');

// ============================================
// Auth schemas
// ============================================

export const signinSchema = z.object({
  email,
  password: z.string().min(1, 'Mot de passe requis').max(128),
});

export const signupSchema = z.object({
  email,
  password,
  fullName: z.string().min(1).max(100).optional(),
});

export const forgotPasswordSchema = z.object({
  email,
});

export const sendVerificationSchema = z.object({
  email,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token requis'),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'Token Google requis'),
});

// ============================================
// Audit schemas
// ============================================

export const createAuditSchema = z.object({
  audit_name: z.string().min(1, 'Nom requis').max(200),
  use_case: z.string().min(1).max(100).optional(),
  dataset_id: uuid.optional(),
  dataset_id_post: uuid.optional(),
  config: z.object({
    target_column: z.string().min(1).optional(),
    protected_attributes: z.array(z.string()).optional(),
    thresholds: z.record(z.string(), z.number().min(0).max(1)).optional(),
  }).optional(),
  model_type: z.string().max(100).optional(),
  ia_type: z.string().max(100).optional(),
  audit_type: z.string().max(100).optional(),
});

export const updateAuditSchema = z.object({
  audit_name: z.string().min(1).max(200).optional(),
  use_case: z.string().max(100).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  overall_score: z.number().min(0).max(100).optional(),
  risk_level: z.enum(['Low', 'Medium', 'High']).optional(),
  bias_detected: z.boolean().optional(),
  critical_bias_count: z.number().int().min(0).optional(),
  metrics_results: z.record(z.string(), z.any()).optional(),
  recommendations: z.array(z.any()).optional(),
}).strict();

// ============================================
// Fairness schemas
// ============================================

export const calculateFairnessSchema = z.object({
  audit_id: uuid,
});

export const calculateEnhancedFairnessSchema = z.object({
  audit_id: z.string().min(1).optional(),
  id: z.string().min(1).optional(),
}).refine(data => data.audit_id || data.id, {
  message: 'audit_id ou id requis',
});

// ============================================
// Chat schemas
// ============================================

export const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(10000),
  })).min(1, 'Au moins un message requis'),
  context: z.any().optional(),
});

// ============================================
// Dataset schemas
// ============================================

export const deleteDatasetSchema = z.object({
  id: uuid,
});

// ============================================
// ML schemas
// ============================================

export const mlTrainSchema = z.object({
  dataset_id: uuid,
  target_column: z.string().min(1, 'Colonne cible requise'),
  algorithm: z.enum([
    'logistic_regression', 'random_forest', 'xgboost',
    'lightgbm', 'svm', 'decision_tree',
  ]).default('logistic_regression'),
  feature_columns: z.array(z.string()).optional(),
  test_size: z.number().min(0.05).max(0.5).default(0.2),
});

// ============================================
// Report schemas
// ============================================

export const generateReportSchema = z.object({
  audit_id: uuid,
  format: z.enum(['pdf', 'html', 'txt']),
});

// ============================================
// WhatIf schemas
// ============================================

export const whatifSchema = z.object({
  audit_id: uuid,
  instance_data: z.record(z.string(), z.any()),
  target_outcome: z.number().min(0).max(1).optional(),
  constraints: z.record(z.string(), z.any()).optional(),
});

// ============================================
// Insights schemas
// ============================================

export const insightsSchema = z.object({
  audit_id: uuid,
});

// ============================================
// Team schemas
// ============================================

export const inviteTeamMemberSchema = z.object({
  email,
  role: z.enum(['admin', 'auditor', 'viewer']),
});

export const updateTeamMemberSchema = z.object({
  memberId: uuid,
  role: z.enum(['admin', 'auditor', 'viewer']),
});

// ============================================
// DS Project schemas
// ============================================

export const createDsProjectSchema = z.object({
  dataset_id: uuid.optional(),
  project_name: z.string().min(1).max(200),
  target_column: z.string().max(100).optional(),
  problem_type: z.enum(['classification', 'regression', 'clustering']).optional(),
});

// ============================================
// Validation helper
// ============================================

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
    return { success: false, errors, data: null };
  }
  return { success: true, errors: null, data: result.data };
}
