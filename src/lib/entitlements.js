// Plan definitions
export const PLANS = {
  free: {
    name: 'Безплатен',
    maxApplications: 5,
    maxSavedPrograms: 10,
    advancedReminders: false,
    advancedAICoach: false,
    decisionReports: false
  },
  premium: {
    name: 'Премиум',
    maxApplications: Infinity,
    maxSavedPrograms: Infinity,
    advancedReminders: true,
    advancedAICoach: true,
    decisionReports: true
  }
};

export function getEntitlements(plan = 'free') {
  return PLANS[plan] || PLANS.free;
}

export function canUseAdvancedReminders(plan) {
  return getEntitlements(plan).advancedReminders;
}

export function canUseUnlimitedApplications(plan) {
  return getEntitlements(plan).maxApplications === Infinity;
}

export function canUseAdvancedAICoach(plan) {
  return getEntitlements(plan).advancedAICoach;
}

export function canUseDecisionReports(plan) {
  return getEntitlements(plan).decisionReports;
}

export function isAtLimit(plan, resource, currentCount) {
  const ent = getEntitlements(plan);
  if (resource === 'applications') return currentCount >= ent.maxApplications;
  if (resource === 'savedPrograms') return currentCount >= ent.maxSavedPrograms;
  return false;
}
