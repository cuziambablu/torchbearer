/**
 * CampusLaunch AI Opportunity Agent — Multi-Factor Verification Engine
 */

/**
 * Validates whether an application URL format and domain are legitimate
 */
export function verifyUrl(url = '') {
  if (!url || typeof url !== 'string') {
    return { isValid: false, reason: 'URL is missing or invalid' };
  }

  const clean = url.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    return { isValid: false, reason: 'URL does not use HTTP or HTTPS protocol' };
  }

  try {
    const parsed = new URL(clean);
    if (!parsed.hostname || parsed.hostname.length < 4 || !parsed.hostname.includes('.')) {
      return { isValid: false, reason: 'URL hostname is incomplete' };
    }

    // Check for placeholder domains (example.com, test.com, etc.)
    const blockedDomains = ['example.com', 'example.org', 'example.net', 'localhost', '127.0.0.1', 'test.com', 'placeholder.com'];
    if (blockedDomains.some((d) => parsed.hostname.toLowerCase().includes(d))) {
      return { isValid: false, reason: 'Placeholder or disallowed test domain detected', isPlaceholder: true };
    }

    // Check for suspicious domains / url shorteners with obfuscation
    const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'shorte.st', 'adf.ly'];
    if (suspiciousDomains.some((d) => parsed.hostname.includes(d))) {
      return { isValid: false, reason: 'Obfuscated or shortened URL detected', isSuspicious: true };
    }

    return { isValid: true, protocol: parsed.protocol, hostname: parsed.hostname };
  } catch (e) {
    return { isValid: false, reason: 'Invalid URL syntax' };
  }
}

/**
 * Verifies application deadline freshness
 */
export function verifyDeadline(deadlineStr = '') {
  if (!deadlineStr) {
    return { status: 'NO_DEADLINE', isExpired: false, daysRemaining: null };
  }

  try {
    const deadlineDate = new Date(deadlineStr);
    if (isNaN(deadlineDate.getTime())) {
      return { status: 'INVALID_DATE', isExpired: false, daysRemaining: null };
    }

    const now = new Date();
    const diffMs = deadlineDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs <= 0) {
      return { status: 'EXPIRED', isExpired: true, daysRemaining: 0 };
    }

    return { status: 'ACTIVE', isExpired: false, daysRemaining };
  } catch {
    return { status: 'INVALID_DATE', isExpired: false, daysRemaining: null };
  }
}

/**
 * Calculates the multi-factor Verification Score (0-100)
 */
export function calculateVerificationScore(opportunity) {
  let score = 0;
  const flagReasons = [];
  const checks = {};

  // 1. Mandatory Core Attributes (up to 30 points)
  if (opportunity.title && opportunity.title.length >= 5) {
    score += 10;
    checks.titleValid = true;
  } else {
    flagReasons.push('Title is too short or missing');
  }

  if (opportunity.company && opportunity.company.length >= 2) {
    score += 10;
    checks.companyValid = true;
  } else {
    flagReasons.push('Company name is missing');
  }

  if (opportunity.description && opportunity.description.length >= 20) {
    score += 10;
    checks.descriptionValid = true;
  } else {
    flagReasons.push('Description lacks sufficient detail');
  }

  // 2. Application URL Verification (up to 30 points)
  const urlCheck = verifyUrl(opportunity.applyUrl || opportunity.applicationUrl);
  checks.urlCheck = urlCheck;
  if (urlCheck.isValid) {
    score += 30;
    if (urlCheck.protocol === 'https:') {
      score += 5; // Bonus for HTTPS
    }
  } else {
    flagReasons.push(`Application link issue: ${urlCheck.reason}`);
  }

  // 3. Deadline Verification (up to 20 points)
  const deadlineCheck = verifyDeadline(opportunity.deadline || opportunity.applicationDeadline);
  checks.deadlineCheck = deadlineCheck;
  if (deadlineCheck.isExpired) {
    score -= 40;
    flagReasons.push('Application deadline has already passed (Expired)');
  } else if (deadlineCheck.status === 'ACTIVE') {
    score += 20;
  } else {
    score += 5; // Rolling or no deadline
  }

  // 4. Skills & Eligibility Clarity (up to 15 points)
  if (Array.isArray(opportunity.skills) && opportunity.skills.length >= 2) {
    score += 10;
    checks.skillsProvided = true;
  } else {
    flagReasons.push('No technical skills tagged');
  }

  if (opportunity.eligibility && opportunity.eligibility.length > 5) {
    score += 5;
    checks.eligibilityProvided = true;
  }

  // Cap between 0 and 100
  const finalScore = Math.max(0, Math.min(100, score));

  // Determine Verification Tier
  let verificationStatus = 'verified';
  let tier = 'Verified';

  if (finalScore >= 90) {
    tier = 'Highly Verified';
    verificationStatus = 'verified';
  } else if (finalScore >= 75) {
    tier = 'Verified';
    verificationStatus = 'verified';
  } else if (finalScore >= 50) {
    tier = 'Needs Review';
    verificationStatus = 'pending';
  } else {
    tier = 'Reject';
    verificationStatus = 'rejected';
  }

  return {
    score: finalScore,
    tier,
    verificationStatus,
    flagReasons,
    checks,
    isEligibleForAutoPublish: finalScore >= 75 && !deadlineCheck.isExpired && urlCheck.isValid
  };
}
