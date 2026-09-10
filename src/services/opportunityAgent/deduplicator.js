/**
 * CampusLaunch AI Opportunity Agent — Duplicate Detection & Merging Engine
 */

/**
 * Normalizes text for comparison
 */
function cleanStr(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Generates a normalized primary fingerprint
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
 * Calculates token overlap similarity (0 to 1)
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
 * Checks if two opportunity objects represent the same listing
 */
export function isDuplicate(opp1 = {}, opp2 = {}) {
  // 1. Exact Fingerprint match
  const fp1 = createOpportunityFingerprint(opp1);
  const fp2 = createOpportunityFingerprint(opp2);
  if (fp1 === fp2) return true;

  // 2. Exact Application URL match
  const url1 = (opp1.applyUrl || opp1.applicationUrl || '').toLowerCase().trim();
  const url2 = (opp2.applyUrl || opp2.applicationUrl || '').toLowerCase().trim();
  if (url1 && url2 && url1 === url2) return true;

  // 3. Fuzzy match: Same company AND high title similarity
  const comp1 = cleanStr(opp1.company || opp1.organization);
  const comp2 = cleanStr(opp2.company || opp2.organization);
  if (comp1 && comp2 && (comp1 === comp2 || comp1.includes(comp2) || comp2.includes(comp1))) {
    const titleSim = calculateTokenSimilarity(opp1.title || '', opp2.title || '');
    if (titleSim >= 0.75) {
      return true;
    }
  }

  return false;
}

/**
 * Deduplicates a batch of newly discovered opportunities against existing catalog
 */
export function deduplicateBatch(incomingList = [], existingList = []) {
  const uniqueItems = [];
  const duplicatesRemoved = [];

  const existingFingerprints = new Set(existingList.map(createOpportunityFingerprint));
  const existingUrls = new Set(
    existingList
      .map((o) => (o.applyUrl || o.applicationUrl || '').toLowerCase().trim())
      .filter(Boolean)
  );

  for (const item of incomingList) {
    const fp = createOpportunityFingerprint(item);
    const url = (item.applyUrl || item.applicationUrl || '').toLowerCase().trim();

    // Check against existing catalog
    if (existingFingerprints.has(fp) || (url && existingUrls.has(url))) {
      duplicatesRemoved.push({ item, reason: 'Already present in live catalog' });
      continue;
    }

    // Check against items already accepted in current incoming batch
    const matchInCurrentBatch = uniqueItems.find((existing) => isDuplicate(existing, item));
    if (matchInCurrentBatch) {
      duplicatesRemoved.push({ item, reason: 'Duplicate found within current ingestion batch' });
      continue;
    }

    // Mark as seen and accept
    existingFingerprints.add(fp);
    if (url) existingUrls.add(url);
    uniqueItems.push(item);
  }

  return {
    uniqueItems,
    duplicatesRemoved
  };
}
