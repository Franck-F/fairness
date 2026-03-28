// Pre-configured audit templates by industry/use case
// Each template pre-fills protected attributes, metrics, and thresholds

export const AUDIT_TEMPLATES = {
  credit_scoring: {
    label: 'Credit Scoring / Banque',
    description: 'Evaluation de credit et prets bancaires',
    icon: '🏦',
    protected_attributes: ['gender', 'age', 'race', 'marital_status'],
    thresholds: {
      demographic_parity: 0.1,
      equalized_odds: 0.1,
      disparate_impact: 0.8,
    },
    recommended_metrics: ['demographic_parity', 'equalized_odds', 'disparate_impact', 'predictive_parity'],
    compliance_notes: 'Reglementation EU AI Act - Systeme a haut risque (Annexe III, point 5b)',
  },
  hiring: {
    label: 'Recrutement / RH',
    description: 'Selection de candidats et gestion des talents',
    icon: '👥',
    protected_attributes: ['gender', 'age', 'ethnicity', 'disability'],
    thresholds: {
      demographic_parity: 0.08,
      equalized_odds: 0.08,
      disparate_impact: 0.8,
    },
    recommended_metrics: ['demographic_parity', 'equalized_odds', 'disparate_impact', 'equal_opportunity'],
    compliance_notes: 'EU AI Act - Systeme a haut risque (Annexe III, point 4a). Regle des 4/5 EEOC.',
  },
  healthcare: {
    label: 'Sante / Medical',
    description: 'Diagnostic, triage, allocation de soins',
    icon: '🏥',
    protected_attributes: ['gender', 'age', 'race', 'socioeconomic_status'],
    thresholds: {
      demographic_parity: 0.05,
      equalized_odds: 0.05,
      disparate_impact: 0.85,
    },
    recommended_metrics: ['equalized_odds', 'equal_opportunity', 'calibration', 'predictive_parity'],
    compliance_notes: 'EU AI Act - Systeme a haut risque (Annexe III, point 5a). Normes ISO 14971.',
  },
  insurance: {
    label: 'Assurance',
    description: 'Tarification et evaluation des risques',
    icon: '🛡️',
    protected_attributes: ['gender', 'age', 'race', 'zip_code'],
    thresholds: {
      demographic_parity: 0.1,
      equalized_odds: 0.1,
      disparate_impact: 0.8,
    },
    recommended_metrics: ['demographic_parity', 'disparate_impact', 'predictive_parity'],
    compliance_notes: 'Directive Solvabilite II. Interdiction discrimination par genre (directive 2004/113/CE).',
  },
  justice: {
    label: 'Justice / Recidive',
    description: 'Prediction de recidive et aide a la decision judiciaire',
    icon: '⚖️',
    protected_attributes: ['race', 'gender', 'age', 'socioeconomic_status'],
    thresholds: {
      demographic_parity: 0.05,
      equalized_odds: 0.05,
      disparate_impact: 0.9,
    },
    recommended_metrics: ['equalized_odds', 'calibration', 'predictive_parity', 'demographic_parity'],
    compliance_notes: 'EU AI Act - Systeme a haut risque (Annexe III, point 6). Exigences de transparence renforcees.',
  },
  education: {
    label: 'Education',
    description: 'Admission, notation, orientation',
    icon: '🎓',
    protected_attributes: ['gender', 'race', 'socioeconomic_status', 'disability'],
    thresholds: {
      demographic_parity: 0.08,
      equalized_odds: 0.08,
      disparate_impact: 0.8,
    },
    recommended_metrics: ['demographic_parity', 'equal_opportunity', 'equalized_odds'],
    compliance_notes: 'EU AI Act - Systeme a haut risque (Annexe III, point 3). Droit a l\'education non-discriminatoire.',
  },
  marketing: {
    label: 'Marketing / Publicite',
    description: 'Ciblage publicitaire et personnalisation',
    icon: '📢',
    protected_attributes: ['gender', 'age', 'ethnicity', 'zip_code'],
    thresholds: {
      demographic_parity: 0.15,
      equalized_odds: 0.15,
      disparate_impact: 0.75,
    },
    recommended_metrics: ['demographic_parity', 'disparate_impact'],
    compliance_notes: 'RGPD Art. 22. Digital Services Act - transparence algorithmique.',
  },
  housing: {
    label: 'Immobilier / Logement',
    description: 'Attribution de logement et evaluation locataire',
    icon: '🏠',
    protected_attributes: ['race', 'gender', 'family_status', 'disability', 'religion'],
    thresholds: {
      demographic_parity: 0.08,
      equalized_odds: 0.08,
      disparate_impact: 0.8,
    },
    recommended_metrics: ['demographic_parity', 'disparate_impact', 'equalized_odds'],
    compliance_notes: 'Fair Housing Act. EU AI Act - Annexe III, point 5c.',
  },
  fraud_detection: {
    label: 'Detection de fraude',
    description: 'Identification de transactions frauduleuses',
    icon: '🔍',
    protected_attributes: ['gender', 'age', 'nationality', 'zip_code'],
    thresholds: {
      demographic_parity: 0.12,
      equalized_odds: 0.1,
      disparate_impact: 0.8,
    },
    recommended_metrics: ['equalized_odds', 'equal_opportunity', 'predictive_parity'],
    compliance_notes: 'PSD2. Equilibre entre detection et non-discrimination.',
  },
  content_moderation: {
    label: 'Moderation de contenu',
    description: 'Filtrage et classification de contenu',
    icon: '🔒',
    protected_attributes: ['language', 'gender', 'ethnicity', 'religion'],
    thresholds: {
      demographic_parity: 0.1,
      equalized_odds: 0.1,
      disparate_impact: 0.8,
    },
    recommended_metrics: ['demographic_parity', 'equalized_odds'],
    compliance_notes: 'Digital Services Act. Obligations de transparence algorithmique.',
  },
}

export function getTemplateForUseCase(useCase) {
  return AUDIT_TEMPLATES[useCase] || null
}

export function getTemplatesList() {
  return Object.entries(AUDIT_TEMPLATES).map(([key, template]) => ({
    value: key,
    ...template,
  }))
}
