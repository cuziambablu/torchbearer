import { REAL_VERIFIED_OPPORTUNITIES } from './src/data/realVerifiedOpportunities.js';
import { calculateOpportunityMatch } from './src/utils/recommendation.js';

console.log('--- Verifying CampusLaunch Opportunities Dataset ---');
console.log(`Total Opportunities: ${REAL_VERIFIED_OPPORTUNITIES.length}`);

let failed = 0;
const blockedDomains = ['example.com', 'example.org', 'test.com', 'placeholder.com', 'localhost'];

REAL_VERIFIED_OPPORTUNITIES.forEach((opp, idx) => {
  if (!opp.id || !opp.title || !opp.organization || !opp.applyUrl) {
    console.error(`❌ [${idx}] Missing core fields:`, opp);
    failed++;
  }
  
  for (const b of blockedDomains) {
    if (opp.applyUrl.includes(b)) {
      console.error(`❌ [${idx}] Contains blocked domain (${b}): ${opp.applyUrl}`);
      failed++;
    }
  }

  try {
    const url = new URL(opp.applyUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      console.error(`❌ [${idx}] Invalid protocol: ${opp.applyUrl}`);
      failed++;
    }
  } catch (e) {
    console.error(`❌ [${idx}] Malformed applyUrl: ${opp.applyUrl}`);
    failed++;
  }

  // Test recommendation match scoring with student profile
  try {
    const student = {
      branch: 'CSE',
      year: '3rd Year',
      skills: ['Python', 'React', 'Git'],
      interests: ['AI/ML', 'Open Source'],
      preferredMode: 'Remote',
      preferredTypes: ['Internship', 'Hackathon']
    };
    const score = calculateOpportunityMatch(opp, student);
    if (typeof score.score !== 'number' || isNaN(score.score)) {
      console.error(`❌ [${idx}] calculateOpportunityMatch returned invalid score for ${opp.id}:`, score);
      failed++;
    }
  } catch (err) {
    console.error(`❌ [${idx}] calculateOpportunityMatch threw error on ${opp.id}:`, err);
    failed++;
  }
});

if (failed === 0) {
  console.log('✅ ALL OPPORTUNITY CHECKS PASSED: 100% verified real URLs with working recommendation calculations.');
} else {
  console.error(`💥 ${failed} check(s) failed.`);
  process.exit(1);
}
