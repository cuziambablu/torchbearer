// Opportunity Ingestion, Normalization, Deduplication & CSV Import Engine

import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Generates a normalized duplicate detection fingerprint
 */
export function generateFingerprint(opp) {
  const normOrg = (opp.organization || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const normTitle = (opp.title || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const normDeadline = opp.deadline ? new Date(opp.deadline).toISOString().split('T')[0] : 'nodeadline';
  return `${normOrg}__${normTitle}__${normDeadline}`;
}

/**
 * Validates mandatory opportunity fields and returns errors if any
 */
export function validateOpportunity(opp) {
  const errors = [];

  if (!opp.title || opp.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  if (!opp.organization || opp.organization.trim().length < 2) {
    errors.push('Organization name is required');
  }
  if (!opp.type) {
    errors.push('Opportunity type is required');
  }
  if (!opp.applyUrl || !opp.applyUrl.startsWith('http')) {
    errors.push('A valid official application URL (http:// or https://) is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Normalizes raw opportunity object
 */
export function normalizeOpportunity(raw, sourceName = 'Official Source', sourceId = null) {
  const skillsArray = Array.isArray(raw.skills)
    ? raw.skills
    : typeof raw.skills === 'string'
    ? raw.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const branchesArray = Array.isArray(raw.targetBranches)
    ? raw.targetBranches
    : typeof raw.targetBranches === 'string'
    ? raw.targetBranches.split(',').map((b) => b.trim()).filter(Boolean)
    : ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'];

  const yearsArray = Array.isArray(raw.targetYears)
    ? raw.targetYears
    : typeof raw.targetYears === 'string'
    ? raw.targetYears.split(',').map((y) => y.trim()).filter(Boolean)
    : ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const deadlineIso = raw.deadline
    ? raw.deadline.includes('T')
      ? raw.deadline
      : `${raw.deadline}T23:59:59Z`
    : null;

  const fingerprint = generateFingerprint({
    organization: raw.organization,
    title: raw.title,
    deadline: deadlineIso
  });

  return {
    id: raw.id || 'opp-' + Date.now() + Math.random().toString(36).substring(2, 6),
    title: raw.title.trim(),
    organization: raw.organization.trim(),
    type: raw.type || 'Internship',
    location: raw.location || 'Remote',
    mode: raw.mode || 'Remote',
    stipend: raw.stipend || null,
    prize: raw.prize || null,
    eligibility: raw.eligibility || 'All undergraduate college students',
    targetBranches: branchesArray,
    targetYears: yearsArray,
    skills: skillsArray,
    description: raw.description || '',
    responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
    requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
    benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
    applicationProcess: raw.applicationProcess || 'Direct official portal application',
    deadline: deadlineIso,
    applyUrl: raw.applyUrl.trim(),
    sourceUrl: raw.sourceUrl ? raw.sourceUrl.trim() : raw.applyUrl.trim(),
    sourceName: raw.sourceName || sourceName,
    sourceId: raw.sourceId || sourceId,
    status: raw.status || 'published',
    verificationStatus: raw.verificationStatus || 'verified',
    verifiedAt: new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    featured: Boolean(raw.featured),
    isCollegeExclusive: Boolean(raw.isCollegeExclusive),
    isOfficialCollege: Boolean(raw.isOfficialCollege),
    collegeName: raw.collegeName || null,
    views: raw.views || 0,
    fingerprint,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Parses and validates CSV string for opportunity import
 */
export function parseAndValidateCsv(csvText, existingFingerprints = new Set()) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return { error: 'CSV file is empty or missing data rows', validRows: [], invalidRows: [] };
  }

  // Parse header
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
  const getCol = (row, name) => {
    const idx = headers.indexOf(name);
    return idx !== -1 && row[idx] ? row[idx].trim().replace(/^["']|["']$/g, '') : '';
  };

  const validRows = [];
  const invalidRows = [];
  const seenFingerprints = new Set(existingFingerprints);

  for (let i = 1; i < lines.length; i++) {
    // Basic CSV line splitter respecting simple quotes
    const row = lines[i].split(',').map((cell) => cell.trim());
    if (row.length < 3) continue;

    const rawOpp = {
      title: getCol(row, 'title'),
      organization: getCol(row, 'organization') || getCol(row, 'company'),
      type: getCol(row, 'type') || 'Internship',
      description: getCol(row, 'description'),
      location: getCol(row, 'location') || 'Remote',
      mode: getCol(row, 'mode') || 'Remote',
      eligibility: getCol(row, 'eligibility'),
      skills: getCol(row, 'skills'),
      stipend: getCol(row, 'stipend'),
      prize: getCol(row, 'prize'),
      deadline: getCol(row, 'deadline'),
      applyUrl: getCol(row, 'apply_url') || getCol(row, 'applyurl') || getCol(row, 'url'),
      sourceUrl: getCol(row, 'source_url') || getCol(row, 'sourceurl'),
      sourceName: getCol(row, 'source_name') || 'Admin CSV Import'
    };

    const validation = validateOpportunity(rawOpp);
    const fingerprint = generateFingerprint(rawOpp);

    if (!validation.isValid) {
      invalidRows.push({ rowNumber: i + 1, data: rawOpp, errors: validation.errors });
    } else if (seenFingerprints.has(fingerprint)) {
      invalidRows.push({
        rowNumber: i + 1,
        data: rawOpp,
        errors: ['Duplicate detected: this opportunity already exists']
      });
    } else {
      seenFingerprints.add(fingerprint);
      validRows.push(normalizeOpportunity(rawOpp, 'Admin CSV Import'));
    }
  }

  return { validRows, invalidRows };
}

/**
 * Ingests and persists an array of opportunities to Supabase
 */
export async function ingestOpportunities(opportunities) {
  if (!opportunities || !opportunities.length) return [];

  if (isSupabaseConfigured && supabase) {
    try {
      const recordsToInsert = opportunities.map((opp) => ({
        title: opp.title,
        organization: opp.organization,
        type: opp.type,
        location: opp.location,
        mode: opp.mode,
        stipend: opp.stipend,
        prize: opp.prize,
        eligibility: opp.eligibility,
        target_branches: opp.targetBranches,
        target_years: opp.targetYears,
        skills: opp.skills,
        description: opp.description,
        responsibilities: opp.responsibilities,
        requirements: opp.requirements,
        benefits: opp.benefits,
        application_process: opp.applicationProcess,
        deadline: opp.deadline,
        apply_url: opp.applyUrl,
        source_url: opp.sourceUrl,
        source_name: opp.sourceName,
        status: opp.status,
        verification_status: opp.verificationStatus,
        verified_at: opp.verifiedAt,
        last_verified_at: opp.lastVerifiedAt,
        featured: opp.featured,
        is_college_exclusive: opp.isCollegeExclusive,
        is_official_college: opp.isOfficialCollege,
        fingerprint: opp.fingerprint,
        views: opp.views || 0
      }));

      const { data, error } = await supabase
        .from('opportunities')
        .upsert(recordsToInsert, { onConflict: 'fingerprint' })
        .select();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('Ingestion cloud sync error:', e);
    }
  }

  return opportunities;
}
