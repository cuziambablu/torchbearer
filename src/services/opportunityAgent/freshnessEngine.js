/**
 * CampusLaunch AI Opportunity Agent — Expiry & Freshness Monitor
 */

/**
 * Returns human-readable relative verification time
 */
export function formatRelativeVerificationTime(isoDateStr) {
  if (!isoDateStr) return 'Verified recently';

  try {
    const timestamp = new Date(isoDateStr).getTime();
    if (isNaN(timestamp)) return 'Verified recently';

    const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);

    if (diffSeconds < 60) return 'Verified just now';
    if (diffSeconds < 3600) return `Verified ${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `Verified ${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 172800) return 'Verified yesterday';
    return `Verified ${Math.floor(diffSeconds / 86400)}d ago`;
  } catch {
    return 'Verified recently';
  }
}

/**
 * Scans opportunity catalog and identifies expired opportunities
 */
export function auditCatalogFreshness(opportunities = []) {
  const now = new Date().getTime();
  const updatedOpportunities = [];
  const newlyExpired = [];

  for (const opp of opportunities) {
    let currentStatus = opp.status;
    let deadlinePassed = false;

    if (opp.deadline || opp.applicationDeadline) {
      const deadlineTime = new Date(opp.deadline || opp.applicationDeadline).getTime();
      if (!isNaN(deadlineTime) && deadlineTime < now) {
        deadlinePassed = true;
      }
    }

    if (deadlinePassed && currentStatus !== 'expired') {
      const expiredOpp = {
        ...opp,
        status: 'expired',
        lastVerifiedAt: new Date().toISOString()
      };
      updatedOpportunities.push(expiredOpp);
      newlyExpired.push(expiredOpp);
    } else {
      updatedOpportunities.push({
        ...opp,
        lastVerifiedAt: opp.lastVerifiedAt || new Date().toISOString()
      });
    }
  }

  return {
    updatedOpportunities,
    newlyExpiredCount: newlyExpired.length,
    newlyExpired
  };
}
