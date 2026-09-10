/**
 * CampusLaunch AI Opportunity Agent — Comprehensive Test Suite
 */

import { extractOpportunityData, classifyOpportunityType, classifyCategory } from '../extractor.js';
import { verifyUrl, verifyDeadline, calculateVerificationScore } from '../verifier.js';
import { isDuplicate, deduplicateBatch, createOpportunityFingerprint } from '../deduplicator.js';
import { calculateQualityScore } from '../scorer.js';
import { auditCatalogFreshness } from '../freshnessEngine.js';
import { OpportunityAgentPipeline } from '../pipeline.js';

export function runAgentTestSuite() {
  const results = [];
  const assert = (name, condition, details = '') => {
    results.push({
      name,
      passed: Boolean(condition),
      details: condition ? 'PASSED' : `FAILED: ${details}`
    });
  };

  // -------------------------------------------------------------
  // Test 1: Opportunity Classification & Extraction
  // -------------------------------------------------------------
  const type1 = classifyOpportunityType('Frontend Developer Intern (Summer 2026)');
  assert('Classify Internship correctly', type1 === 'Internship', `Got ${type1}`);

  const type2 = classifyOpportunityType('Lead Principal Architect (10+ Yrs Exp)');
  assert('Filter Senior Full-Time roles', type2.includes('Non-Internship'), `Got ${type2}`);

  const cat1 = classifyCategory('Machine Learning Research Intern', 'Deep learning & neural networks', ['PyTorch', 'Python']);
  assert('Classify AI/ML Category correctly', cat1 === 'AI / ML', `Got ${cat1}`);

  const extracted = extractOpportunityData({
    title: 'Cloud DevOps Intern',
    company: 'Alpha Corp',
    stipend: '₹40,000 / month',
    deadline: '2026-12-31',
    applyUrl: 'https://alphacorp.com/careers/intern'
  });
  assert('Extract structured fields (stipend amount, currency)', extracted.stipendAmount === 40000 && extracted.currency === 'INR');
  assert('Extract work mode defaults', extracted.workMode === 'Remote' || extracted.workMode === 'On-site');

  // -------------------------------------------------------------
  // Test 2: URL & Deadline Verification
  // -------------------------------------------------------------
  const validUrl = verifyUrl('https://careers.google.com/jobs/results/12345');
  assert('Validate legitimate HTTPS URL', validUrl.isValid === true);

  const invalidUrl = verifyUrl('ftp://invalid-link');
  assert('Reject invalid protocol', invalidUrl.isValid === false);

  const expiredDeadline = verifyDeadline('2020-01-01T00:00:00Z');
  assert('Flag expired deadline correctly', expiredDeadline.isExpired === true);

  const activeDeadline = verifyDeadline('2028-01-01T00:00:00Z');
  assert('Recognize future active deadline', activeDeadline.isExpired === false && activeDeadline.daysRemaining > 0);

  // -------------------------------------------------------------
  // Test 3: Multi-Factor Verification Scoring
  // -------------------------------------------------------------
  const highQualityOpp = {
    title: 'Software Engineering Summer Intern',
    company: 'Google',
    description: 'Work with the Chrome team on high performance browser engine features.',
    applyUrl: 'https://careers.google.com/internships',
    deadline: '2027-06-30T23:59:59Z',
    skills: ['C++', 'Python', 'Algorithms'],
    eligibility: 'Enrolled B.Tech students in 3rd or 4th year'
  };
  const vScore = calculateVerificationScore(highQualityOpp);
  assert('High quality opportunity scores >= 85', vScore.score >= 85, `Got ${vScore.score}`);
  assert('Auto-publish eligibility is true for high quality', vScore.isEligibleForAutoPublish === true);

  const lowQualityOpp = {
    title: 'Job',
    company: '',
    applyUrl: 'invalid',
    deadline: '2020-01-01'
  };
  const lowVScore = calculateVerificationScore(lowQualityOpp);
  assert('Low quality opportunity rejected or sent to review', lowVScore.score < 50, `Got ${lowVScore.score}`);

  // -------------------------------------------------------------
  // Test 4: Deduplication & Fingerprinting
  // -------------------------------------------------------------
  const oppA = {
    title: 'Backend Engineering Intern',
    company: 'Stripe',
    applyUrl: 'https://stripe.com/jobs/intern',
    deadline: '2026-11-30'
  };
  const oppB = {
    title: 'Backend Engineering Intern',
    company: 'Stripe',
    applyUrl: 'https://stripe.com/jobs/intern',
    deadline: '2026-11-30'
  };
  assert('Detect exact duplicate listing', isDuplicate(oppA, oppB) === true);

  const batchResult = deduplicateBatch([oppA, oppB], []);
  assert('Deduplicate batch removes 1 duplicate and keeps 1 unique', batchResult.uniqueItems.length === 1 && batchResult.duplicatesRemoved.length === 1);

  // -------------------------------------------------------------
  // Test 5: Freshness & Expiry Engine
  // -------------------------------------------------------------
  const catalog = [
    { id: '1', title: 'Active Listing', deadline: '2028-01-01', status: 'published' },
    { id: '2', title: 'Expired Listing', deadline: '2021-01-01', status: 'published' }
  ];
  const freshnessAudit = auditCatalogFreshness(catalog);
  assert('Freshness monitor transitions past deadline item to expired', freshnessAudit.newlyExpiredCount === 1);
  const expiredItem = freshnessAudit.updatedOpportunities.find((o) => o.id === '2');
  assert('Expired item has status=expired', expiredItem && expiredItem.status === 'expired');

  // Summary
  const allPassed = results.every((r) => r.passed);
  return {
    success: allPassed,
    totalTests: results.length,
    passedCount: results.filter((r) => r.passed).length,
    failedCount: results.filter((r) => !r.passed).length,
    results
  };
}
