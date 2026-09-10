/**
 * CampusLaunch AI Opportunity Agent — Quality Scoring Engine
 */

/**
 * Calculates a comprehensive Quality Score (0 to 100) for student readiness
 */
export function calculateQualityScore(opportunity = {}) {
  let score = 50; // Baseline
  const breakdown = {};

  // 1. Source Credibility (+15 points)
  const sourceName = (opportunity.sourceName || '').toLowerCase();
  if (sourceName.includes('official') || sourceName.includes('google') || sourceName.includes('microsoft') || sourceName.includes('aicte') || sourceName.includes('cern')) {
    score += 15;
    breakdown.sourceCredibility = 15;
  } else {
    score += 8;
    breakdown.sourceCredibility = 8;
  }

  // 2. Stipend Transparency (+15 points)
  if (opportunity.stipendAmount && opportunity.stipendAmount > 0) {
    score += 15;
    breakdown.stipendTransparency = 15;
  } else if (opportunity.stipend && !opportunity.stipend.toLowerCase().includes('unpaid')) {
    score += 10;
    breakdown.stipendTransparency = 10;
  } else {
    breakdown.stipendTransparency = 0;
  }

  // 3. Duration & Eligibility Detail (+10 points)
  if (opportunity.duration && opportunity.duration.length > 2) {
    score += 5;
    breakdown.durationDefined = 5;
  }
  if (opportunity.eligibility && opportunity.eligibility.length > 10) {
    score += 5;
    breakdown.eligibilityDetailed = 5;
  }

  // 4. Skills & Engineering Alignment (+10 points)
  const skillsCount = Array.isArray(opportunity.skills) ? opportunity.skills.length : 0;
  if (skillsCount >= 4) {
    score += 10;
    breakdown.skillsRichness = 10;
  } else if (skillsCount >= 2) {
    score += 5;
    breakdown.skillsRichness = 5;
  }

  // 5. Freshness (+10 points)
  const postedDate = opportunity.postedDate || opportunity.createdAt;
  if (postedDate) {
    const ageDays = (new Date().getTime() - new Date(postedDate).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays <= 7) {
      score += 10;
      breakdown.freshness = 10;
    } else if (ageDays <= 30) {
      score += 5;
      breakdown.freshness = 5;
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    qualityScore: finalScore,
    breakdown,
    ratingLabel: finalScore >= 90 ? 'Outstanding' : finalScore >= 75 ? 'High Quality' : 'Standard'
  };
}
