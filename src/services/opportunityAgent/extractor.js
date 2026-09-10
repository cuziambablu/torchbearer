/**
 * CampusLaunch AI Opportunity Agent — Structured Data Extractor
 */

import { OPPORTUNITY_CATEGORIES, WORK_MODES } from './sources.js';

/**
 * Validates if the raw posting describes an internship or fellowship
 */
export function classifyOpportunityType(text = '') {
  const lower = text.toLowerCase();
  if (lower.includes('intern') || lower.includes('internship') || lower.includes('trainee') || lower.includes('apprentice')) {
    return 'Internship';
  }
  if (lower.includes('fellow') || lower.includes('fellowship')) {
    return 'Fellowship';
  }
  if (lower.includes('hackathon') || lower.includes('challenge') || lower.includes('competition')) {
    return 'Hackathon';
  }
  if (lower.includes('scholarship') || lower.includes('grant')) {
    return 'Scholarship';
  }
  if (lower.includes('senior') || lower.includes('lead engineer') || lower.includes('manager') || lower.includes('principal')) {
    return 'Full-Time Senior Job (Non-Internship)';
  }
  return 'Internship';
}

/**
 * Classifies category based on title, description, and skills
 */
export function classifyCategory(title = '', description = '', skills = []) {
  const combined = `${title} ${description} ${skills.join(' ')}`.toLowerCase();

  if (combined.includes('ai') || combined.includes('machine learning') || combined.includes('deep learning') || combined.includes('llm') || combined.includes('nlp')) {
    return 'AI / ML';
  }
  if (combined.includes('data science') || combined.includes('data analyst') || combined.includes('analytics') || combined.includes('bi')) {
    return 'Data Science';
  }
  if (combined.includes('cloud') || combined.includes('aws') || combined.includes('azure') || combined.includes('gcp') || combined.includes('kubernetes') || combined.includes('docker') || combined.includes('devops')) {
    return 'Cloud';
  }
  if (combined.includes('security') || combined.includes('cyber') || combined.includes('infosec') || combined.includes('penetration') || combined.includes('ctf')) {
    return 'Cybersecurity';
  }
  if (combined.includes('web') || combined.includes('frontend') || combined.includes('backend') || combined.includes('full stack') || combined.includes('react') || combined.includes('node')) {
    return 'Web Development';
  }
  if (combined.includes('android') || combined.includes('ios') || combined.includes('flutter') || combined.includes('react native') || combined.includes('mobile app')) {
    return 'App Development';
  }
  if (combined.includes('vlsi') || combined.includes('embedded') || combined.includes('iot') || combined.includes('microcontroller') || combined.includes('electronics')) {
    return 'Electronics';
  }
  if (combined.includes('mechanical') || combined.includes('cad') || combined.includes('solidworks') || combined.includes('ansys') || combined.includes('thermodynamics')) {
    return 'Mechanical';
  }
  if (combined.includes('civil') || combined.includes('structural') || combined.includes('autocad') || combined.includes('gis')) {
    return 'Civil';
  }
  if (combined.includes('ui') || combined.includes('ux') || combined.includes('design') || combined.includes('figma')) {
    return 'Design';
  }
  if (combined.includes('research') || combined.includes('fellow') || combined.includes('laboratory') || combined.includes('cern')) {
    return 'Research';
  }
  if (combined.includes('marketing') || combined.includes('growth') || combined.includes('seo') || combined.includes('social media')) {
    return 'Marketing';
  }
  if (combined.includes('finance') || combined.includes('fintech') || combined.includes('accounting') || combined.includes('investment')) {
    return 'Finance';
  }

  return 'Software Development';
}

/**
 * Extracts work mode from text
 */
export function extractWorkMode(text = '') {
  const lower = text.toLowerCase();
  if (lower.includes('remote') || lower.includes('work from home') || lower.includes('virtual') || lower.includes('wfh')) {
    return 'Remote';
  }
  if (lower.includes('hybrid') || lower.includes('flexible')) {
    return 'Hybrid';
  }
  return 'On-site';
}

/**
 * Extracts structured stipend amounts
 */
export function extractStipendDetails(stipendStr = '') {
  if (!stipendStr) return { stipend: 'Unpaid / Certificate', amount: 0, currency: 'INR' };

  const clean = stipendStr.replace(/,/g, '');
  const match = clean.match(/(\d[\d\s]*)/);
  const amount = match ? parseInt(match[0].replace(/\s/g, ''), 10) : 0;
  const currency = stipendStr.includes('$') || stipendStr.includes('USD') ? 'USD' : stipendStr.includes('CHF') ? 'CHF' : 'INR';

  return {
    stipend: stipendStr,
    amount,
    currency
  };
}

/**
 * Generates an AI summary for students
 */
export function generateAiSummary(opportunity) {
  const company = opportunity.company || 'The hiring organization';
  const role = opportunity.title || 'Internship opportunity';
  const skills = Array.isArray(opportunity.skills) ? opportunity.skills.slice(0, 4).join(', ') : '';
  const branches = Array.isArray(opportunity.branches) ? opportunity.branches.join(', ') : 'All Branches';

  return `${company} is offering a ${opportunity.workMode || 'Remote'} ${role}. Best suited for ${branches} students with proficiency in ${skills || 'foundational engineering concepts'}.`;
}

/**
 * Extracts and normalizes raw opportunity data into the unified schema
 */
export function extractOpportunityData(rawInput = {}) {
  const title = (rawInput.title || '').trim();
  const company = (rawInput.company || rawInput.organization || '').trim();
  const rawText = `${title} ${company} ${rawInput.description || ''} ${rawInput.skills || ''}`;

  const internshipType = classifyOpportunityType(rawText);
  const isDirectInternship = internshipType === 'Internship' || internshipType === 'Fellowship';

  const category = rawInput.category && OPPORTUNITY_CATEGORIES.includes(rawInput.category)
    ? rawInput.category
    : classifyCategory(title, rawInput.description, rawInput.skills);

  const workMode = rawInput.workMode && WORK_MODES.includes(rawInput.workMode)
    ? rawInput.workMode
    : extractWorkMode(rawText);

  const stipendInfo = extractStipendDetails(rawInput.stipend || '');

  const skillsList = Array.isArray(rawInput.skills)
    ? rawInput.skills
    : typeof rawInput.skills === 'string'
    ? rawInput.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : ['Python', 'Problem Solving'];

  const branchesList = Array.isArray(rawInput.branches || rawInput.targetBranches)
    ? (rawInput.branches || rawInput.targetBranches)
    : ['CSE', 'ECE', 'IT', 'All Branches'];

  const deadline = rawInput.applicationDeadline || rawInput.deadline || null;
  const deadlineIso = deadline
    ? deadline.includes('T')
      ? deadline
      : `${deadline}T23:59:59Z`
    : null;

  const extracted = {
    id: rawInput.id || `ai-opp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    company,
    companyLogo: rawInput.companyLogo || rawInput.organization_logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
    companyDescription: rawInput.companyDescription || `${company} student talent and internship initiative.`,
    description: rawInput.description || `${title} at ${company}. Real-world project experience and engineering mentorship.`,
    internshipType,
    isDirectInternship,
    category,
    skills: skillsList,
    location: rawInput.location || (workMode === 'Remote' ? 'Remote (India / Global)' : 'Bangalore, India'),
    workMode,
    country: rawInput.country || 'India',
    stipend: stipendInfo.stipend,
    stipendAmount: stipendInfo.amount,
    currency: stipendInfo.currency,
    duration: rawInput.duration || '3-6 Months',
    eligibility: rawInput.eligibility || 'Enrolled undergraduate or postgraduate college students',
    educationLevel: rawInput.educationLevel || 'Undergraduate / Postgraduate',
    branches: branchesList,
    targetBranches: branchesList,
    graduationYear: rawInput.graduationYear || ['2025', '2026', '2027', '2028'],
    targetYears: rawInput.targetYears || ['2025', '2026', '2027', '2028'],
    experienceRequired: rawInput.experienceRequired || 'None (Students & Freshers)',
    applicationDeadline: deadlineIso,
    deadline: deadlineIso,
    applicationUrl: (rawInput.applicationUrl || rawInput.applyUrl || '').trim(),
    applyUrl: (rawInput.applicationUrl || rawInput.applyUrl || '').trim(),
    sourceUrl: (rawInput.sourceUrl || rawInput.applyUrl || '').trim(),
    sourceName: rawInput.sourceName || 'Official Career Source',
    postedDate: rawInput.postedDate || new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    aiSummary: rawInput.aiSummary || generateAiSummary({ company, title, skills: skillsList, branches: branchesList, workMode }),
    aiTags: rawInput.aiTags || [category, workMode, 'Verified'],
    featured: Boolean(rawInput.featured),
    views: rawInput.views || 0,
    status: rawInput.status || 'published',
    verificationStatus: rawInput.verificationStatus || 'verified'
  };

  return extracted;
}
