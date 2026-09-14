import { REAL_VERIFIED_OPPORTUNITIES } from '../src/data/realVerifiedOpportunities.js';
import { resolveOrganizationIdentity } from '../src/utils/organizationUtils.js';
import fs from 'fs';
import path from 'path';

console.log('--- Enriching Real Verified Opportunities with Official Organization Identities & Logos ---');

const enriched = REAL_VERIFIED_OPPORTUNITIES.map((opp) => {
  const orgIdentity = resolveOrganizationIdentity(
    opp.organization || opp.company,
    opp.applyUrl || opp.sourceUrl,
    opp.organizationLogo || opp.companyLogo
  );

  return {
    ...opp,
    organization: orgIdentity.name,
    organizationName: orgIdentity.name,
    organizationDomain: orgIdentity.domain,
    organizationWebsite: orgIdentity.website,
    organizationLogo: orgIdentity.logoUrl,
    companyLogo: orgIdentity.logoUrl
  };
});

const outputPath = path.resolve(process.cwd(), 'src/data/realVerifiedOpportunities.js');
const fileContent = `/**
 * 100% Verified Real Opportunities Dataset for Torchbearer AI
 * ZERO Placeholder URLs — All links point to official programs, foundations, and government initiatives.
 * Enriched with Official Organization Identities, Verified Domains & Logos.
 */

export const REAL_VERIFIED_OPPORTUNITIES = ${JSON.stringify(enriched, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`✅ Successfully enriched ${enriched.length} opportunities with official branding & logos!`);
