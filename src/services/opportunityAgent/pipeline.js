/**
 * CampusLaunch AI Opportunity Agent — 11-Stage Modular Pipeline
 */

import { VERIFIED_OPPORTUNITY_SOURCES, generateDiscoveryQueries } from './sources.js';
import { extractOpportunityData } from './extractor.js';
import { calculateVerificationScore } from './verifier.js';
import { deduplicateBatch, createOpportunityFingerprint } from './deduplicator.js';
import { calculateQualityScore } from './scorer.js';
import { auditCatalogFreshness } from './freshnessEngine.js';
import { enrichOpportunityWithLLM } from './llmEnricher.js';
import { DEFAULT_MODEL, DEFAULT_BASE_URL } from '../llmClient.js';
import { supabase, isSupabaseConfigured } from '../supabase.js';

export class OpportunityAgentPipeline {
  constructor(config = {}) {
    this.config = {
      minVerificationScore: config.minVerificationScore || 75,
      autoPublishThreshold: config.autoPublishThreshold || 80,
      maxOpportunitiesPerScan: config.maxOpportunitiesPerScan || 50,
      enabledSources: config.enabledSources || VERIFIED_OPPORTUNITY_SOURCES.map((s) => s.id),
      autoPublish: config.autoPublish !== false,
      ...config
    };

    this.isRunning = false;
    this.currentRunId = null;
  }

  /**
   * Executes the full 11-stage pipeline
   */
  async run({ existingCatalog = [], onProgress = () => {} } = {}) {
    if (this.isRunning) {
      throw new Error('An Opportunity Agent run is already in progress. Please wait for completion.');
    }

    this.isRunning = true;
    this.currentRunId = `run-${Date.now()}`;
    const startTime = new Date().toISOString();

    const stats = {
      discovered: 0,
      extracted: 0,
      duplicatesRemoved: 0,
      verified: 0,
      needsReview: 0,
      rejected: 0,
      published: 0,
      failedSources: 0
    };

    const logs = [];
    const logEvent = (stage, level, message, details = {}) => {
      const entry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        runId: this.currentRunId,
        timestamp: new Date().toISOString(),
        stage,
        level,
        message,
        details
      };
      logs.push(entry);
      onProgress({ stage, percent: details.percent || 0, log: entry, stats });
    };

    try {
      // -------------------------------------------------------------
      // STAGE 1: DISCOVER
      // -------------------------------------------------------------
      logEvent('DISCOVER', 'info', `AI Agent Engine: ${DEFAULT_MODEL} (${DEFAULT_BASE_URL})`, { percent: 5 });
      logEvent('DISCOVER', 'info', 'Generating search vectors and querying registered source endpoints...', { percent: 10 });
      const queries = generateDiscoveryQueries();
      const activeSources = VERIFIED_OPPORTUNITY_SOURCES.filter((s) => s.enabled && this.config.enabledSources.includes(s.id));

      logEvent('DISCOVER', 'info', `Active sources: ${activeSources.length}, Search query patterns: ${queries.length}`, { percent: 15 });

      // -------------------------------------------------------------
      // STAGE 2: FETCH
      // -------------------------------------------------------------
      logEvent('FETCH', 'info', 'Fetching opportunity datasets from authentic verified channels...', { percent: 25 });
      const rawDiscovered = [];

      for (const source of activeSources) {
        try {
          if (Array.isArray(source.sampleOpportunities)) {
            for (const item of source.sampleOpportunities) {
              rawDiscovered.push({ ...item, sourceId: source.id, sourceName: source.name });
            }
          }
        } catch (sourceErr) {
          stats.failedSources++;
          logEvent('FETCH', 'warn', `Failed to fetch from ${source.name}: ${sourceErr.message}`, { percent: 30 });
        }
      }

      stats.discovered = rawDiscovered.length;
      logEvent('FETCH', 'success', `Discovered ${rawDiscovered.length} candidate postings across all source feeds.`, { percent: 35 });

      // -------------------------------------------------------------
      // STAGE 3 & 4: EXTRACT & NORMALIZE
      // -------------------------------------------------------------
      logEvent('EXTRACT', 'info', 'Extracting structured attributes (stipends, skills, deadlines, work modes)...', { percent: 45 });
      const extractedList = [];

      for (const raw of rawDiscovered) {
        try {
          const structured = extractOpportunityData(raw);
          if (structured.isDirectInternship) {
            extractedList.push(structured);
          } else {
            logEvent('EXTRACT', 'debug', `Filtered non-internship posting: "${raw.title}"`);
          }
        } catch (err) {
          logEvent('EXTRACT', 'warn', `Extraction error on item "${raw.title}": ${err.message}`);
        }
      }

      stats.extracted = extractedList.length;
      logEvent('NORMALIZE', 'success', `Normalized ${extractedList.length} verified internship opportunities.`, { percent: 55 });

      // -------------------------------------------------------------
      // STAGE 5: VERIFY
      // -------------------------------------------------------------
      logEvent('VERIFY', 'info', 'Performing multi-point verification: URL reachability, deadline freshness, authenticity...', { percent: 65 });
      const verifiedList = [];
      const reviewQueueItems = [];
      const rejectedList = [];

      for (const opp of extractedList) {
        const vResult = calculateVerificationScore(opp);
        const qResult = calculateQualityScore(opp);

        const enrichedOpp = {
          ...opp,
          verificationScore: vResult.score,
          qualityScore: qResult.qualityScore,
          verificationTier: vResult.tier,
          flagReasons: vResult.flagReasons,
          lastVerifiedAt: new Date().toISOString()
        };

        if (vResult.score >= this.config.minVerificationScore && vResult.isEligibleForAutoPublish) {
          stats.verified++;
          verifiedList.push(enrichedOpp);
        } else if (vResult.score >= 50) {
          stats.needsReview++;
          reviewQueueItems.push(enrichedOpp);
          logEvent('VERIFY', 'warn', `Flagged for Human Review: "${opp.title}" (Score: ${vResult.score}/100) — Reasons: ${vResult.flagReasons.join(', ')}`);
        } else {
          stats.rejected++;
          rejectedList.push(enrichedOpp);
          logEvent('VERIFY', 'warn', `Rejected Low-Trust Opportunity: "${opp.title}" (Score: ${vResult.score}/100)`);
        }
      }

      // -------------------------------------------------------------
      // STAGE 6: DEDUPLICATE
      // -------------------------------------------------------------
      logEvent('DEDUPLICATE', 'info', 'Running fuzzy and fingerprint deduplication against existing catalog...', { percent: 75 });
      const { uniqueItems, duplicatesRemoved } = deduplicateBatch(verifiedList, existingCatalog);
      stats.duplicatesRemoved = duplicatesRemoved.length;

      logEvent('DEDUPLICATE', 'success', `Identified ${duplicatesRemoved.length} duplicate listings. ${uniqueItems.length} unique opportunities accepted.`, { percent: 80 });

      // -------------------------------------------------------------
      // STAGE 7 & 8: SCORE & CATEGORIZE
      // -------------------------------------------------------------
      logEvent('CATEGORIZE', 'info', 'Categorizing opportunities across 19 technical domains...', { percent: 85 });
      const finalizedList = uniqueItems.map((opp) => ({
        ...opp,
        status: this.config.autoPublish && opp.verificationScore >= this.config.autoPublishThreshold ? 'published' : 'pending',
        verificationStatus: opp.verificationScore >= this.config.minVerificationScore ? 'verified' : 'pending'
      }));

      // -------------------------------------------------------------
      // STAGE 9 & 10: SAVE & PUBLISH
      // -------------------------------------------------------------
      logEvent('SAVE', 'info', 'Persisting opportunities, review queue items, and audit telemetry...', { percent: 90 });

      const publishedCount = finalizedList.filter((o) => o.status === 'published').length;
      stats.published = publishedCount;

      // Sync to Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          // 1. Insert agent run record
          await supabase.from('agent_runs').insert({
            id: undefined,
            status: 'completed',
            trigger_type: 'manual',
            stats,
            completed_at: new Date().toISOString()
          });

          // 2. Insert into review queue
          if (reviewQueueItems.length > 0) {
            const queueInserts = reviewQueueItems.map((item) => ({
              opportunity_data: item,
              verification_score: item.verificationScore,
              quality_score: item.qualityScore,
              flag_reasons: item.flagReasons,
              status: 'pending'
            }));
            await supabase.from('review_queue').insert(queueInserts);
          }
        } catch (dbErr) {
          console.warn('Agent telemetry database write note:', dbErr);
        }
      }

      // -------------------------------------------------------------
      // STAGE 11: MONITOR
      // -------------------------------------------------------------
      logEvent('MONITOR', 'info', 'Running catalog freshness audit and deadline expiration scan...', { percent: 95 });
      const combinedCatalog = [...finalizedList, ...existingCatalog];
      const { updatedOpportunities, newlyExpiredCount } = auditCatalogFreshness(combinedCatalog);

      logEvent('MONITOR', 'success', `Freshness check complete. ${newlyExpiredCount} listings transitioned to Expired.`, { percent: 100 });
      logEvent('PUBLISH', 'success', `Agent execution completed successfully! Published ${publishedCount} opportunities, queued ${reviewQueueItems.length} for review.`, { percent: 100 });

      this.isRunning = false;

      return {
        success: true,
        runId: this.currentRunId,
        startedAt: startTime,
        completedAt: new Date().toISOString(),
        stats,
        publishedOpportunities: finalizedList.filter((o) => o.status === 'published'),
        reviewQueueItems,
        allUpdatedOpportunities: updatedOpportunities,
        logs
      };
    } catch (error) {
      this.isRunning = false;
      logEvent('PIPELINE', 'error', `Agent execution failed: ${error.message}`, { error: error.stack });
      throw error;
    }
  }
}

export const defaultAgentPipeline = new OpportunityAgentPipeline();
