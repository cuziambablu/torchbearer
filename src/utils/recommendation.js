// Rule-based Opportunity Recommendation Engine

export function getRecommendedOpportunities(opportunities, studentProfile, limit = 6) {
  if (!studentProfile || !opportunities || !opportunities.length) return [];

  const studentSkills = (studentProfile.skills || []).map(s => s.toLowerCase());
  const studentInterests = (studentProfile.interests || []).map(i => i.toLowerCase());
  const studentBranch = (studentProfile.branch || '').toLowerCase();
  const studentYear = (studentProfile.year || '').toLowerCase();

  const scoredOpportunities = opportunities
    .filter(opp => opp.status === 'published')
    .map(opp => {
      let score = 0;
      const reasons = [];

      // 1. Target Branch Match (Weight: 30)
      if (opp.targetBranches && opp.targetBranches.length > 0) {
        const matchesBranch = opp.targetBranches.some(
          b => b.toLowerCase() === studentBranch || b.toLowerCase() === 'other'
        );
        if (matchesBranch) {
          score += 30;
          reasons.push(`Matches your ${studentProfile.branch} branch`);
        }
      }

      // 2. Target Year Match (Weight: 20)
      if (opp.targetYears && opp.targetYears.length > 0) {
        const matchesYear = opp.targetYears.some(
          y => y.toLowerCase() === studentYear
        );
        if (matchesYear) {
          score += 20;
          reasons.push(`Open for ${studentProfile.year} students`);
        }
      }

      // 3. Skill Overlap (Weight: 15 per matching skill, up to 45 max)
      if (opp.skills && opp.skills.length > 0 && studentSkills.length > 0) {
        let skillMatches = 0;
        const matchedSkillNames = [];

        opp.skills.forEach(skill => {
          const skillLower = skill.toLowerCase();
          if (studentSkills.some(s => s.includes(skillLower) || skillLower.includes(s))) {
            skillMatches++;
            matchedSkillNames.push(skill);
          }
        });

        if (skillMatches > 0) {
          const skillPoints = Math.min(skillMatches * 15, 45);
          score += skillPoints;
          reasons.push(`Matches skills: ${matchedSkillNames.slice(0, 2).join(', ')}`);
        }
      }

      // 4. Interest / Type Overlap (Weight: 15)
      const oppType = (opp.type || '').toLowerCase();
      const matchesInterest = studentInterests.some(
        interest => interest.includes(oppType) || oppType.includes(interest) ||
                    opp.title.toLowerCase().includes(interest) ||
                    opp.description.toLowerCase().includes(interest)
      );
      if (matchesInterest) {
        score += 15;
        reasons.push(`Aligns with your interests`);
      }

      // 5. Featured boost (Weight: 10)
      if (opp.featured) {
        score += 10;
      }

      return {
        ...opp,
        matchScore: Math.min(Math.round((score / 100) * 100), 99), // Percentage 0-99
        matchReasons: reasons.slice(0, 2)
      };
    });

  // Sort by highest match score descending
  return scoredOpportunities
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
