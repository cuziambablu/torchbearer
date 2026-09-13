/**
 * Torchbearer AI — Unified LLM Client
 * Routes all requests through the centralized AI Orchestrator with multi-model failover.
 */

import { globalAIOrchestrator } from './aiOrchestrator/index.js';
import { getOrchestratorConfig } from './aiOrchestrator/models.js';

export const DEFAULT_BASE_URL = 'https://api.tokenrouter.com/v1';
export const DEFAULT_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

export function getApiKey() {
  const cfg = getOrchestratorConfig();
  return cfg.openRouterApiKey || cfg.tokenRouterApiKey;
}

export function getBaseUrl() {
  const cfg = getOrchestratorConfig();
  return cfg.openRouterBaseUrl || cfg.tokenRouterBaseUrl;
}

export function getModel() {
  const cfg = getOrchestratorConfig();
  return cfg.primaryModel || cfg.fallbackModel || DEFAULT_MODEL;
}

export function checkApiKeyConfigured() {
  return Boolean(getApiKey());
}

/**
 * Creates a chat completion request routed through the AI Orchestrator.
 * Handles automatic task routing, failover cascades, caching, and response sanitization.
 */
export async function createChatCompletion(options = {}) {
  return await globalAIOrchestrator.executeChatCompletion(options);
}
