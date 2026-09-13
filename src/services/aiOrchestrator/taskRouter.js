/**
 * AI Orchestrator — Intelligent Task Classifier & Model Router
 * 
 * Determines the optimal model tier and failover cascade for each task.
 */

import { TASK_TYPES } from './models.js';

/**
 * Automatically infers task type from prompt content, messages, or explicitly passed options
 */
export function classifyTaskType(options = {}) {
  if (options.taskType && TASK_TYPES[options.taskType]) {
    return options.taskType;
  }

  const messages = options.messages || [];
  const fullText = messages.map(m => m.content || '').join(' ').toLowerCase();

  // 1. Deep Research & Strategic Reasoning
  if (
    fullText.includes('market analysis') ||
    fullText.includes('strategic reasoning') ||
    fullText.includes('deep research') ||
    fullText.includes('macro trend') ||
    fullText.includes('competitive landscape')
  ) {
    return TASK_TYPES.DEEP_RESEARCH;
  }

  // 2. Complex Opportunity Analysis & Ranking
  if (
    fullText.includes('analyze this student opportunity') ||
    fullText.includes('opportunity intelligence') ||
    fullText.includes('potential impact') ||
    fullText.includes('actionability score') ||
    fullText.includes('rank opportunity')
  ) {
    return TASK_TYPES.COMPLEX_OPPORTUNITY_ANALYSIS;
  }

  // 3. Long Context / Discovery
  if (
    fullText.includes('catalog context') ||
    fullText.includes('ground your recommendations') ||
    fullText.includes('discover opportunities') ||
    fullText.length > 2500
  ) {
    return TASK_TYPES.LONG_CONTEXT_ANALYSIS;
  }

  // 4. Summarization / Extraction
  if (
    fullText.includes('extract structured attributes') ||
    fullText.includes('parse raw listing') ||
    fullText.includes('extract stipend')
  ) {
    return TASK_TYPES.DATA_EXTRACTION;
  }

  if (
    fullText.includes('summarize in 2 sentences') ||
    fullText.includes('concise summary')
  ) {
    return TASK_TYPES.SUMMARIZATION;
  }

  // 5. Fast / Simple Classification & Formatting
  if (
    fullText.includes('classify category') ||
    fullText.includes('format json') ||
    fullText.includes('deduplicate') ||
    fullText.includes('is duplicate')
  ) {
    return TASK_TYPES.SIMPLE_CLASSIFICATION;
  }

  return TASK_TYPES.GENERAL_ANALYSIS;
}

/**
 * Resolves the primary execution plan and ordered failover chain based on task type
 */
export function resolveExecutionPlan(taskType, config) {
  const { primaryModel, fallbackModel, secondaryModel, fastModel } = config;

  switch (taskType) {
    case TASK_TYPES.DEEP_RESEARCH:
    case TASK_TYPES.COMPLEX_OPPORTUNITY_ANALYSIS:
    case TASK_TYPES.STRATEGIC_REASONING:
    case TASK_TYPES.OPPORTUNITY_RANKING:
      return [
        { providerType: 'OPENROUTER', model: primaryModel, tier: 'PRIMARY_REASONING', temperature: 0.2 },
        { providerType: 'OPENROUTER', model: fallbackModel, tier: 'PRIMARY_FALLBACK', temperature: 0.3 },
        { providerType: 'TOKENROUTER', model: secondaryModel, tier: 'SECONDARY_FALLBACK', temperature: 0.3 }
      ];

    case TASK_TYPES.LONG_CONTEXT_ANALYSIS:
    case TASK_TYPES.OPPORTUNITY_DISCOVERY:
    case TASK_TYPES.GENERAL_ANALYSIS:
      return [
        { providerType: 'OPENROUTER', model: fallbackModel, tier: 'PRIMARY_FALLBACK', temperature: 0.4 },
        { providerType: 'TOKENROUTER', model: secondaryModel, tier: 'SECONDARY_FALLBACK', temperature: 0.4 },
        { providerType: 'OPENROUTER', model: primaryModel, tier: 'PRIMARY_REASONING', temperature: 0.3 }
      ];

    case TASK_TYPES.DATA_EXTRACTION:
    case TASK_TYPES.SUMMARIZATION:
      return [
        { providerType: 'OPENROUTER', model: fallbackModel, tier: 'PRIMARY_FALLBACK', temperature: 0.2 },
        { providerType: 'TOKENROUTER', model: secondaryModel, tier: 'SECONDARY_FALLBACK', temperature: 0.2 },
        { providerType: 'OPENROUTER', model: fastModel, tier: 'FAST_MODEL', temperature: 0.2 }
      ];

    case TASK_TYPES.SIMPLE_CLASSIFICATION:
    case TASK_TYPES.FORMATTING:
    case TASK_TYPES.DEDUPLICATION:
    default:
      return [
        { providerType: 'OPENROUTER', model: fastModel, tier: 'FAST_MODEL', temperature: 0.1 },
        { providerType: 'TOKENROUTER', model: secondaryModel, tier: 'SECONDARY_FALLBACK', temperature: 0.2 },
        { providerType: 'OPENROUTER', model: fallbackModel, tier: 'PRIMARY_FALLBACK', temperature: 0.2 }
      ];
  }
}
