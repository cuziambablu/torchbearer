/**
 * Headless 24/7 Autonomous Opportunity Agent Runner
 * Executes on fixed 6-hour cron intervals to:
 * 1. Discover authentic opportunities from verified feeds
 * 2. Deduplicate, score, and enrich with AI
 * 3. Audit existing catalog deadlines and mark expired listings
 * 4. Update data files for production deployment
 */

import { OpportunityAgentPipeline } from '../src/services/opportunityAgent/pipeline.js';
import { REAL_VERIFIED_OPPORTUNITIES } from '../src/data/realVerifiedOpportunities.js';
import { auditCatalogFreshness } from '../src/services/opportunityAgent/freshnessEngine.js';
import fs from 'fs';
import path from 'path';

async function runAutonomousWorker() {
  console.log('===========================================================');
  console.log('🤖 TORCHBEARER AI — 24/7 AUTONOMOUS 6-HOUR OPPORTUNITY WORKER');
  console.log('===========================================================\n');
  console.log(`Execution Timestamp: ${new Date().toISOString()}`);

  try {
    const pipeline = new OpportunityAgentPipeline({
      minVerificationScore: 75,
      autoPublishThreshold: 80,
      autoPublish: true
    });

    // 1. Audit Freshness of Existing Catalog
    console.log('👉 [1/3] Auditing existing catalog freshness & deadlines...');
    const { updatedOpportunities, newlyExpiredCount } = auditCatalogFreshness(REAL_VERIFIED_OPPORTUNITIES);
    console.log(`   • Freshness scan complete. ${newlyExpiredCount} listings expired.\n`);

    // 2. Run Discovery & Ingestion Pipeline
    console.log('👉 [2/3] Running multi-source AI discovery and verification pipeline...');
    const result = await pipeline.run({
      existingCatalog: updatedOpportunities,
      onProgress: ({ stage, percent, log }) => {
        if (percent % 25 === 0 || stage === 'PUBLISH' || stage === 'DISCOVER') {
          console.log(`   [${stage}] ${percent}%: ${log?.message || 'Processing...'}`);
        }
      }
    });

    console.log('\n👉 [3/3] Ingestion results:');
    console.log(`   • Discovered: ${result.stats.discovered}`);
    console.log(`   • Verified: ${result.stats.verified}`);
    console.log(`   • Duplicates Filtered: ${result.stats.duplicatesRemoved}`);
    console.log(`   • Published: ${result.stats.published}`);

    const finalCatalog = result.allUpdatedOpportunities || updatedOpportunities;

    // 3. Persist Updated Catalog to realVerifiedOpportunities.js
    const catalogPath = path.resolve(process.cwd(), 'src/data/realVerifiedOpportunities.js');
    const fileContent = `/**
 * 100% Verified Real Opportunities Dataset for Torchbearer AI
 * Autonomously curated, verified, and audited on a 6-hour cron schedule.
 * Last Automated Agent Sync: ${new Date().toISOString()}
 */

export const REAL_VERIFIED_OPPORTUNITIES = ${JSON.stringify(finalCatalog, null, 2)};
`;

    fs.writeFileSync(catalogPath, fileContent, 'utf-8');
    console.log(`\n✅ Saved ${finalCatalog.length} verified opportunities to ${catalogPath}`);
    console.log('===========================================================');
    console.log('🎉 6-HOUR AUTONOMOUS AGENT RUN COMPLETED SUCCESSFULLY!');
    console.log('===========================================================');
  } catch (err) {
    console.error('❌ Autonomous worker encountered an error:', err);
    process.exit(1);
  }
}

runAutonomousWorker();
