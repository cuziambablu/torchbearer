/**
 * AI Orchestrator — Multi-Model Definitions & Configuration
 * 
 * Configures the Multi-Tier Model Architecture:
 * - Primary Reasoning: nvidia/nemotron-3-ultra-550b-a55b:free (OpenRouter)
 * - Primary Long-Context / Fallback: z-ai/glm-5.2:free (OpenRouter)
 * - Secondary Fallback: z-ai/glm-5.3-free (TokenRouter)
 * - Fast / Lightweight: meta-llama/llama-3.2-3b-instruct:free (OpenRouter) / z-ai/glm-5.3-free
 */

export const PROVIDER_TYPES = {
  OPENROUTER: 'OPENROUTER',
  TOKENROUTER: 'TOKENROUTER',
  CUSTOM: 'CUSTOM'
};

export const TASK_TYPES = {
  DEEP_RESEARCH: 'DEEP_RESEARCH',
  COMPLEX_OPPORTUNITY_ANALYSIS: 'COMPLEX_OPPORTUNITY_ANALYSIS',
  STRATEGIC_REASONING: 'STRATEGIC_REASONING',
  LONG_CONTEXT_ANALYSIS: 'LONG_CONTEXT_ANALYSIS',
  GENERAL_ANALYSIS: 'GENERAL_ANALYSIS',
  OPPORTUNITY_DISCOVERY: 'OPPORTUNITY_DISCOVERY',
  OPPORTUNITY_RANKING: 'OPPORTUNITY_RANKING',
  DATA_EXTRACTION: 'DATA_EXTRACTION',
  SUMMARIZATION: 'SUMMARIZATION',
  SIMPLE_CLASSIFICATION: 'SIMPLE_CLASSIFICATION',
  FORMATTING: 'FORMATTING',
  DEDUPLICATION: 'DEDUPLICATION'
};

export const DEFAULT_CONFIG = {
  // Endpoints
  openRouterBaseUrl: 'https://openrouter.ai/api/v1',
  tokenRouterBaseUrl: 'https://api.tokenrouter.com/v1',

  // Fallback production keys (overridden by env variables)
  tokenRouterFallbackKey: 'sk-CVqw7jlQPzG8DlW8k26HXl89cNixf9XLbM9shyBkobGuzD3R',
  openRouterFallbackKey: '',

  // Multi-tier Models
  primaryModel: 'nvidia/nemotron-3-ultra-550b-a55b:free',
  fallbackModel: 'z-ai/glm-5.2:free',
  secondaryModel: 'z-ai/glm-5.3-free',
  fastModel: 'meta-llama/llama-3.2-3b-instruct:free',

  // Resilience & Execution
  defaultTimeoutMs: 25000,
  maxRetries: 3,
  retryInitialDelayMs: 600,
  cacheTtlMs: 1000 * 60 * 30 // 30 minutes
};

/**
 * Resolves configuration from process.env (Node/SSR) or import.meta.env (Vite/Browser)
 */
export function getOrchestratorConfig() {
  const getEnv = (key) => {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env[key]) return import.meta.env[key];
      if (import.meta.env[`VITE_${key}`]) return import.meta.env[`VITE_${key}`];
    }
    return null;
  };

  const openRouterApiKey = getEnv('OPENROUTER_API_KEY') || DEFAULT_CONFIG.openRouterFallbackKey;
  const tokenRouterApiKey = getEnv('TOKENROUTER_API_KEY') || getEnv('EXPLABS_API_KEY') || DEFAULT_CONFIG.tokenRouterFallbackKey;

  const openRouterBaseUrl = getEnv('OPENROUTER_BASE_URL') || DEFAULT_CONFIG.openRouterBaseUrl;
  const tokenRouterBaseUrl = getEnv('TOKENROUTER_BASE_URL') || getEnv('LLM_BASE_URL') || DEFAULT_CONFIG.tokenRouterBaseUrl;

  const primaryModel = getEnv('AI_PRIMARY_MODEL') || DEFAULT_CONFIG.primaryModel;
  const fallbackModel = getEnv('AI_FALLBACK_MODEL') || DEFAULT_CONFIG.fallbackModel;
  const secondaryModel = getEnv('AI_SECONDARY_MODEL') || getEnv('LLM_MODEL') || DEFAULT_CONFIG.secondaryModel;
  const fastModel = getEnv('AI_FAST_MODEL') || DEFAULT_CONFIG.fastModel;

  return {
    openRouterApiKey,
    tokenRouterApiKey,
    openRouterBaseUrl,
    tokenRouterBaseUrl,
    primaryModel,
    fallbackModel,
    secondaryModel,
    fastModel,
    defaultTimeoutMs: DEFAULT_CONFIG.defaultTimeoutMs,
    maxRetries: DEFAULT_CONFIG.maxRetries,
    cacheTtlMs: DEFAULT_CONFIG.cacheTtlMs
  };
}
