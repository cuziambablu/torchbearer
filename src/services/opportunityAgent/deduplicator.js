/**
 * Torchbearer AI — Semantic & Deterministic Opportunity Deduplicator
 * 
 * Prevents showing duplicate opportunities through multi-layered matching:
 * 1. Exact Fingerprint (Company + Title + Deadline)
 * 2. Canonical Application URL normalizer
 * 3. Token-level Jaccard similarity
 * 4. Levenshtein edit distance for titles & descriptions
 * 5. Smart merge logic preserving highest quality evidence and official URLs.
 */

/**
 * Normalizes text for robust comparison
 */
function cleanStr(str = '') {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Normalizes URL by stripping UTM parameters, trailing slashes, and protocol variances
 */
export function normalizeUrl(rawUrl = '') {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    const urlObj = new URL(rawUrl.trim());
    // Strip common tracking parameters
    const searchParams = new URLSearchParams(urlObj.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'stkn'].forEach((p) =>
      searchParams.delete(p)
    );
    const cleanSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return `${urlObj.hostname.toLowerCase().replace(/^www\./, '')}${urlObj.pathname.replace(/\/+$/, '')}${cleanSearch}`;
  } catch {
    return rawUrl.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
  }
}

/**
 * Generates deterministic composite fingerprint
 */
export function createOpportunityFingerprint(opp = {}) {
  const company = cleanStr(opp.company || opp.organization);
  const title = cleanStr(opp.title);
  const deadline = opp.deadline || opp.applicationDeadline
    ? new Date(opp.deadline || opp.applicationDeadline).toISOString().split('T')[0]
    : 'open';

  return `${company}___${title}___${deadline}`;
}

/**
 * Calculates Token Jaccard Similarity (0 to 1)
 */
export function calculateTokenSimilarity(str1 = '', str2 = '') {
  const set1 = new Set(str1.toLowerCase().split(/\s+/).filter(Boolean));
  const set2 = new Set(str2.toLowerCase().split(/\s+/).filter(Boolean));

  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Calculates Levenshtein Distance for fuzzy string matching
 */
export function levenshteinDistance(s1 = '', s2 = '') {
  const a = s1.toLowerCase();
  const b = s2.toLowerCase();
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - matrix[b.length][a.length] / maxLen;
}

/**
 * Determines if two opportunities represent essentially the same listing
 */
export function isDuplicate(opp1 = {}, opp2 = {}) {
  if (!opp1 || !opp2) return false;

  // 1. Exact Fingerprint match
  const fp1 = createOpportunityFingerprint(opp1);
  const fp2 = createOpportunityFingerprint(opp2);
  if (fp1 && fp2 && fp1 === fp2) return true;

  // 2. Canonical URL match
  const url1 = normalizeUrl(opp1.applyUrl || opp1.applicationUrl);
  const url2 = normalizeUrl(opp2.applyUrl || opp2.applicationUrl);
  if (url1 && url2 && url1 === url2) return true;

  // 3. Same Company + High Title Similarity
  const comp1 = cleanStr(opp1.company || opp1.organization);
  const comp2 = cleanStr(opp2.company || opp2.organization);
  if (comp1 && comp2) {
    const compTokenSim = calculateTokenSimilarity(opp1.company || opp1.organization || '', opp2.company || opp2.organization || '');
    const isSameCompany = comp1 === comp2 || compTokenSim >= 0.85;

    if (isSameCompany) {
      const tokenSim = calculateTokenSimilarity(opp1.title || '', opp2.title || '');
      if (tokenSim >= 0.75) return true;

      const levenSim = levenshteinDistance(opp1.title || '', opp2.title || '');
      if (levenSim >= 0.85) return true;
    }
  }

  return false;
}

/**
 * Merges duplicate opportunities keeping the highest quality data, evidence, and official links
 */
export function mergeDuplicateOpportunities(primaryOpp = {}, duplicateOpp = {}) {
  const mergedSkills = Array.from(
    new Set([...(primaryOpp.skills || []), ...(duplicateOpp.skills || [])])
  );

  const bestScore = Math.max(
    primaryOpp.verificationScore || 0,
    duplicateOpp.verificationScore || 0
  );

  const bestQuality = Math.max(
    primaryOpp.qualityScore || 0,
    duplicateOpp.qualityScore || 0
  );

  return {
    ...duplicateOpp,
    ...primaryOpp,
    skills: mergedSkills,
    verificationScore: bestScore,
    qualityScore: bestQuality,
    description: primaryOpp.description?.length >= (duplicateOpp.description?.length || 0)
      ? primaryOpp.description
      : duplicateOpp.description,
    sourceUrl: primaryOpp.sourceUrl || duplicateOpp.sourceUrl,
    applyUrl: primaryOpp.applyUrl || duplicateOpp.applyUrl
  };
}

/**
 * Deduplicates a batch of opportunities against an existing catalog with semantic merging
 */
export function deduplicateBatch(incomingList = [], existingList = []) {
  const uniqueItems = [];
  const duplicatesRemoved = [];

  const existingFingerprints = new Set(existingList.map(createOpportunityFingerprint));
  const existingUrls = new Set(
    existingList.map((o) => normalizeUrl(o.applyUrl || o.applicationUrl)).filter(Boolean)
  );

  for (const item of incomingList) {
    const fp = createOpportunityFingerprint(item);
    const url = normalizeUrl(item.applyUrl || item.applicationUrl);

    // 1. Check against existing catalog
    if (existingFingerprints.has(fp) || (url && existingUrls.has(url))) {
      duplicatesRemoved.push({ item, reason: 'Already present in live catalog' });
      continue;
    }

    // 2. Check for duplicate within the current batch
    const matchIdx = uniqueItems.findIndex((existing) => isDuplicate(existing, item));
    if (matchIdx !== -1) {
      // Merge into the existing item to keep best evidence
      uniqueItems[matchIdx] = mergeDuplicateOpportunities(uniqueItems[matchIdx], item);
      duplicatesRemoved.push({ item, reason: 'Merged with duplicate in current batch' });
      continue;
    }

    // 3. Mark seen and add to unique items
    existingFingerprints.add(fp);
    if (url) existingUrls.add(url);
    uniqueItems.push(item);
  }

  return {
    uniqueItems,
    duplicatesRemoved
  };
}
