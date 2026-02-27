/**
 * Feature flags system based on user plan (Free/Pro/Enterprise).
 * Controls access to features and enforces limits per plan.
 */

const PLAN_LIMITS = {
  free: {
    maxAuditsPerMonth: 5,
    maxDatasetSizeMB: 10,
    maxTeamMembers: 0,
    features: {
      basicFairness: true,
      llmInsights: false,
      exportPDF: true,
      exportCSV: false,
      dataScience: false,
      whatIfAnalysis: false,
      complianceReport: false,
      prioritySupport: false,
      customBranding: false,
    },
  },
  pro: {
    maxAuditsPerMonth: 50,
    maxDatasetSizeMB: 100,
    maxTeamMembers: 5,
    features: {
      basicFairness: true,
      llmInsights: true,
      exportPDF: true,
      exportCSV: true,
      dataScience: true,
      whatIfAnalysis: true,
      complianceReport: true,
      prioritySupport: false,
      customBranding: false,
    },
  },
  enterprise: {
    maxAuditsPerMonth: Infinity,
    maxDatasetSizeMB: 500,
    maxTeamMembers: Infinity,
    features: {
      basicFairness: true,
      llmInsights: true,
      exportPDF: true,
      exportCSV: true,
      dataScience: true,
      whatIfAnalysis: true,
      complianceReport: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
}

export function getPlanLimits(plan = 'free') {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free
}

export function hasFeature(plan, featureName) {
  const limits = getPlanLimits(plan)
  return limits.features[featureName] ?? false
}

export function canPerformAction(plan, action, currentCount = 0) {
  const limits = getPlanLimits(plan)

  switch (action) {
    case 'create_audit':
      return currentCount < limits.maxAuditsPerMonth
    case 'upload_dataset':
      return true // size check done server-side
    case 'add_team_member':
      return currentCount < limits.maxTeamMembers
    default:
      return true
  }
}

export function getUpgradeMessage(plan, featureName) {
  if (hasFeature(plan, featureName)) return null

  const upgradeTarget = plan === 'free' ? 'Pro' : 'Enterprise'
  const messages = {
    llmInsights: `Les insights IA sont disponibles avec le plan ${upgradeTarget}.`,
    dataScience: `Le module Data Science est disponible avec le plan ${upgradeTarget}.`,
    whatIfAnalysis: `L'analyse What-If est disponible avec le plan ${upgradeTarget}.`,
    complianceReport: `Les rapports de conformite sont disponibles avec le plan ${upgradeTarget}.`,
    exportCSV: `L'export CSV est disponible avec le plan ${upgradeTarget}.`,
  }

  return messages[featureName] || `Cette fonctionnalite necessite le plan ${upgradeTarget}.`
}
