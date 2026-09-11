// Intelligent Recommendation & Skill Gap Analysis Engine for CampusLaunch

/**
 * Calculates student profile completeness percentage & gives actionable suggestions
 */
export function calculateProfileCompleteness(user) {
  if (!user) return { score: 0, missingFields: [], tips: [] };

  const fields = [
    { name: 'name', weight: 10, label: 'Full Name' },
    { name: 'college', weight: 15, label: 'College / University' },
    { name: 'branch', weight: 15, label: 'Branch / Major' },
    { name: 'year', weight: 10, label: 'Graduation Year' },
    { name: 'skills', weight: 20, label: 'Skills (at least 3)', isArray: true, minLen: 3 },
    { name: 'interests', weight: 10, label: 'Domain Interests', isArray: true, minLen: 1 },
    { name: 'bio', weight: 5, label: 'Short Bio' },
    { name: 'github', weight: 5, label: 'GitHub Profile' },
    { name: 'linkedin', weight: 5, label: 'LinkedIn Profile' },
    { name: 'portfolio', weight: 5, label: 'Portfolio Website' }
  ];

  let currentScore = 0;
  const missingFields = [];
  const tips = [];

  fields.forEach((field) => {
    const val = user[field.name];
    let isFilled = false;

    if (field.isArray) {
      isFilled = Array.isArray(val) && val.length >= (field.minLen || 1);
    } else {
      isFilled = typeof val === 'string' && val.trim().length > 0;
    }

    if (isFilled) {
      currentScore += field.weight;
    } else {
      missingFields.push(field.label);
      if (field.name === 'skills') {
        tips.push('Add your core programming languages & frameworks to unlock accurate opportunity matching.');
      } else if (field.name === 'github') {
        tips.push('Add your GitHub profile to showcase open-source contributions to recruiters.');
      } else if (field.name === 'linkedin') {
        tips.push('Connect your LinkedIn profile for quick professional verification.');
      }
    }
  });

  if (tips.length === 0 && currentScore < 100) {
    tips.push('Your profile is in great shape! Keep your skills updated each semester.');
  }

  return {
    score: Math.min(currentScore, 100),
    missingFields,
    tips
  };
}

/**
 * Calculates detailed match breakdown and skill gaps between a student and an opportunity
 */
export function calculateOpportunityMatch(arg1, arg2) {
  // Support both (opp, profile) and (profile, opp)
  let opp = arg1;
  let studentProfile = arg2;

  if (arg1 && !arg1.title && !arg1.organization && (arg2?.title || arg2?.organization)) {
    opp = arg2;
    studentProfile = arg1;
  }

  if (!opp) {
    return {
      score: 0,
      matchScore: 0,
      reasons: [],
      matchReasons: [],
      matchedSkills: [],
      missingSkills: [],
      skillMatchRatio: '0/0'
    };
  }

  const studentSkills = Array.isArray(studentProfile?.skills)
    ? studentProfile.skills.map((s) => String(s).trim().toLowerCase())
    : typeof studentProfile?.skills === 'string'
    ? studentProfile.skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  const studentInterests = Array.isArray(studentProfile?.interests)
    ? studentProfile.interests.map((i) => String(i).trim().toLowerCase())
    : typeof studentProfile?.interests === 'string'
    ? studentProfile.interests.split(',').map((i) => i.trim().toLowerCase()).filter(Boolean)
    : [];

  const studentBranch = (studentProfile?.branch || '').trim().toLowerCase();
  const studentYear = (studentProfile?.year || '').trim().toLowerCase();

  let score = 0;
  const reasons = [];
  const oppSkills = Array.isArray(opp.skills)
    ? opp.skills
    : typeof opp.skills === 'string'
    ? opp.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const oppTargetBranches = Array.isArray(opp.targetBranches)
    ? opp.targetBranches
    : typeof opp.targetBranches === 'string'
    ? opp.targetBranches.split(',').map((b) => b.trim()).filter(Boolean)
    : [];

  const oppTargetYears = Array.isArray(opp.targetYears)
    ? opp.targetYears
    : typeof opp.targetYears === 'string'
    ? opp.targetYears.split(',').map((y) => y.trim()).filter(Boolean)
    : [];

  // 1. Target Branch Match (Weight: 25)
  if (oppTargetBranches.length > 0) {
    const matchesBranch = oppTargetBranches.some((b) => {
      const bLow = b.trim().toLowerCase();
      if (!studentBranch || bLow === 'other' || bLow === 'all' || bLow.includes('other engineering')) return true;
      if (bLow === studentBranch) return true;
      if (studentBranch.includes(bLow) || bLow.includes(studentBranch)) return true;
      const bAcronym = (b.match(/\(([^)]+)\)/) || [])[1]?.toLowerCase();
      const sAcronym = (studentProfile?.branch?.match(/\(([^)]+)\)/) || [])[1]?.toLowerCase();
      if (bAcronym && (bAcronym === studentBranch || sAcronym === bAcronym)) return true;
      if (sAcronym && (bLow.includes(sAcronym) || sAcronym === bLow)) return true;
      return false;
    });
    if (matchesBranch) {
      score += 25;
      reasons.push(`Eligible for ${studentProfile?.branch || 'your'} branch`);
    }
  } else {
    score += 25;
  }

  // 2. Target Year Match (Weight: 20)
  if (oppTargetYears.length > 0) {
    const matchesYear = oppTargetYears.some(
      (y) => y.toLowerCase() === studentYear || y.toLowerCase() === 'all'
    );
    if (matchesYear) {
      score += 20;
      reasons.push(`Open for ${studentProfile?.year || 'your'} year`);
    }
  } else {
    score += 20;
  }

  // 3. Technical Skill Matching & Skill Gap Analysis (Weight: 35 max)
  const matchedSkills = [];
  const missingSkills = [];

  oppSkills.forEach((skill) => {
    const skillNorm = String(skill).trim().toLowerCase();
    const isMatched = studentSkills.some(
      (s) => s === skillNorm || s.includes(skillNorm) || skillNorm.includes(s)
    );

    if (isMatched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  if (oppSkills.length > 0) {
    const skillRatio = matchedSkills.length / oppSkills.length;
    score += Math.round(skillRatio * 35);
    if (matchedSkills.length > 0) {
      reasons.push(`Matches skills: ${matchedSkills.slice(0, 3).join(', ')}`);
    }
  } else {
    score += 35;
  }

  // 4. Domain & Opportunity Type Match (Weight: 10)
  const oppType = (opp.type || '').toLowerCase();
  const matchesInterest = studentInterests.some(
    (interest) =>
      interest.includes(oppType) ||
      oppType.includes(interest) ||
      (opp.title || '').toLowerCase().includes(interest) ||
      (opp.description || '').toLowerCase().includes(interest)
  );

  if (matchesInterest) {
    score += 10;
    reasons.push(`Aligns with your domain interests`);
  }

  // 5. Work Mode Alignment (Weight: 10)
  const oppMode = opp.workMode || opp.mode;
  if (studentProfile?.preferredMode) {
    if (oppMode?.toLowerCase() === studentProfile.preferredMode.toLowerCase()) {
      score += 10;
      reasons.push(`Matches preferred ${oppMode} mode`);
    }
  } else {
    score += 10;
  }

  const finalScore = Math.min(Math.max(score, 10), 99);

  return {
    score: finalScore,
    matchScore: finalScore,
    matchedSkills,
    missingSkills,
    reasons: reasons.slice(0, 2),
    matchReasons: reasons.slice(0, 2),
    skillMatchRatio: `${matchedSkills.length}/${oppSkills.length || 0}`
  };
}

/**
 * Returns top recommended opportunities for a student with calculated match breakdowns
 */
export function getRecommendedOpportunities(opportunities, studentProfile, limit = 6) {
  if (!opportunities || !opportunities.length) return [];

  const now = new Date();
  const scored = opportunities
    .filter((opp) => {
      if (opp.status !== 'published') return false;
      if (opp.deadline && new Date(opp.deadline) < now) return false;
      return true;
    })
    .map((opp) => {
      const match = calculateOpportunityMatch(opp, studentProfile);
      return {
        ...opp,
        ...match
      };
    });

  return scored
    .sort((a, b) => b.matchScore - a.matchScore || (b.views || 0) - (a.views || 0))
    .slice(0, limit);
}
