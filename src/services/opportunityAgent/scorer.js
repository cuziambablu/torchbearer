/**
 * Torchbearer AI — Opportunity Scoring Engine
 * 
 * Implements configurable multi-factor weighted scoring:
 * - 30% Impact (Stipend, company prestige, career elevation)
 * - 20% Relevance (Skill alignment, branch eligibility, domain fit)
 * - 15% Confidence (Authenticity of source, link verifiability)
 * - 15% Actionability (Clear application process, open deadline, specific steps)
 * - 10% Freshness (Recency of posting, days remaining to deadline)
 * - 10% Competition Advantage (Accessible cohort size, student tier fit)
 * 
 * Classification Tiers:
 * 90-100 = Exceptional
 * 80-89  = Excellent
 * 70-79  = Strong
 * 60-69  = Moderate
 * Below 60 = Low Priority
 */

export const DEFAULT_SCORING_WEIGHTS = {
  impact: 0.30,
  relevance: 0.20,
  confidence: 0.15,
  actionability: 0.15,
  freshness: 0.10,
  competition: 0.10
};

/**
 * Calculates sub-factor metrics for an opportunity
 */
export function calculateSubFactorScores(opportunity = {}, studentProfile = {}) {
  // 1. Impact (0-100)
  let impactScore = 50;
  const orgName = (opportunity.sourceName || opportunity.organization || opportunity.company || '').toLowerCase();
  if (
    orgName.includes('google') ||
    orgName.includes('microsoft') ||
    orgName.includes('amazon') ||
    orgName.includes('isro') ||
    orgName.includes('drdo') ||
    orgName.includes('cern') ||
    orgName.includes('iit') ||
    orgName.includes('iisc')
  ) {
    impactScore += 25;
  }
  if (opportunity.stipendAmount && opportunity.stipendAmount >= 30000) {
    impactScore += 20;
  } else if (opportunity.stipend && !opportunity.stipend.toLowerCase().includes('unpaid')) {
    impactScore += 10;
  }
  if (opportunity.type === 'Scholarship' || opportunity.type === 'Research') {
    impactScore += 5;
  }
  impactScore = Math.min(100, Math.max(0, impactScore));

  // 2. Relevance (0-100)
  let relevanceScore = 60;
  const skillsCount = Array.isArray(opportunity.skills) ? opportunity.skills.length : 0;
  if (skillsCount >= 4) relevanceScore += 20;
  else if (skillsCount >= 2) relevanceScore += 10;

  if (opportunity.branches && opportunity.branches.length > 0) {
    relevanceScore += 15;
  }
  relevanceScore = Math.min(100, Math.max(0, relevanceScore));

  // 3. Confidence (0-100)
  let confidenceScore = 50;
  if (opportunity.verificationScore) {
    confidenceScore = opportunity.verificationScore;
  } else {
    const url = opportunity.applyUrl || opportunity.applicationUrl || '';
    if (url.startsWith('https://')) confidenceScore += 25;
    if (opportunity.sourceName) confidenceScore += 20;
  }
  confidenceScore = Math.min(100, Math.max(0, confidenceScore));

  // 4. Actionability (0-100)
  let actionabilityScore = 55;
  if (opportunity.applyUrl || opportunity.applicationUrl) actionabilityScore += 25;
  if (opportunity.eligibility && opportunity.eligibility.length > 10) actionabilityScore += 10;
  if (opportunity.responsibilities && opportunity.responsibilities.length > 0) actionabilityScore += 10;
  actionabilityScore = Math.min(100, Math.max(0, actionabilityScore));

  // 5. Freshness (0-100)
  let freshnessScore = 60;
  const deadline = opportunity.deadline || opportunity.applicationDeadline;
  if (deadline) {
    const diffDays = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (diffDays > 0 && diffDays <= 14) freshnessScore = 95; // Urgent & fresh
    else if (diffDays > 14 && diffDays <= 60) freshnessScore = 85;
    else if (diffDays <= 0) freshnessScore = 10; // Expired
  }
  const postedDate = opportunity.postedDate || opportunity.createdAt;
  if (postedDate) {
    const ageDays = (Date.now() - new Date(postedDate).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays <= 7) freshnessScore = Math.min(100, freshnessScore + 10);
  }
  freshnessScore = Math.min(100, Math.max(0, freshnessScore));

  // 6. Competition Advantage (0-100)
  let competitionScore = 65;
  if (opportunity.targetYears && opportunity.targetYears.length >= 3) {
    competitionScore += 15;
  }
  if (opportunity.mode === 'Remote' || opportunity.workMode === 'Remote') {
    competitionScore += 10;
  }
  competitionScore = Math.min(100, Math.max(0, competitionScore));

  return {
    impact: impactScore,
    relevance: relevanceScore,
    confidence: confidenceScore,
    actionability: actionabilityScore,
    freshness: freshnessScore,
    competition: competitionScore
  };
}

/**
 * Calculates a comprehensive Opportunity Score (0 to 100)
 */
export function calculateOpportunityScore(opportunity = {}, customWeights = {}) {
  const weights = { ...DEFAULT_SCORING_WEIGHTS, ...customWeights };
  const subScores = calculateSubFactorScores(opportunity);

  const weightedSum =
    subScores.impact * weights.impact +
    subScores.relevance * weights.relevance +
    subScores.confidence * weights.confidence +
    subScores.actionability * weights.actionability +
    subScores.freshness * weights.freshness +
    subScores.competition * weights.competition;

  const normalizedScore = Math.round(Math.max(0, Math.min(100, weightedSum)));

  let tier = 'Low Priority';
  let badgeColor = 'slate';

  if (normalizedScore >= 90) {
    tier = 'Exceptional';
    badgeColor = 'emerald';
  } else if (normalizedScore >= 80) {
    tier = 'Excellent';
    badgeColor = 'amber';
  } else if (normalizedScore >= 70) {
    tier = 'Strong';
    badgeColor = 'blue';
  } else if (normalizedScore >= 60) {
    tier = 'Moderate';
    badgeColor = 'indigo';
  } else {
    tier = 'Low Priority';
    badgeColor = 'slate';
  }

  return {
    overallScore: normalizedScore,
    qualityScore: normalizedScore, // Backward-compatibility
    tier,
    badgeColor,
    subScores,
    weights
  };
}

// Backward compatible alias
export function calculateQualityScore(opportunity = {}) {
  return calculateOpportunityScore(opportunity);
}
