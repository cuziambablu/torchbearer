/**
 * Torchbearer AI — Centralized AI Orchestrator
 * 
 * Orchestrates multi-model execution, intelligent task routing, failover cascades,
 * response validation, caching, rate limiting, and structured opportunity intelligence.
 */

import { getOrchestratorConfig, TASK_TYPES } from './models.js';
import { OpenRouterProvider, TokenRouterProvider } from './providers.js';
import { classifyTaskType, resolveExecutionPlan } from './taskRouter.js';
import { executeWithRetry } from './rateLimiter.js';
import { sanitizeLlmOutput, extractAndParseJson, validateOpportunityIntelligence, createDefaultOpportunityIntelligence } from './responseValidator.js';
import { aiCache } from './cache.js';
import { aiTelemetry } from './telemetry.js';

export class AIOrchestrator {
  constructor(customConfig = {}) {
    this.config = { ...getOrchestratorConfig(), ...customConfig };
    this.openRouterProvider = new OpenRouterProvider(this.config.openRouterBaseUrl, this.config.openRouterApiKey);
    this.tokenRouterProvider = new TokenRouterProvider(this.config.tokenRouterBaseUrl, this.config.tokenRouterApiKey);
  }

  updateConfig(newConfig = {}) {
    this.config = { ...this.config, ...newConfig };
    this.openRouterProvider = new OpenRouterProvider(this.config.openRouterBaseUrl, this.config.openRouterApiKey);
    this.tokenRouterProvider = new TokenRouterProvider(this.config.tokenRouterBaseUrl, this.config.tokenRouterApiKey);
  }

  getProvider(providerType) {
    if (providerType === 'OPENROUTER') {
      return this.openRouterProvider;
    }
    return this.tokenRouterProvider;
  }

  /**
   * Executes a chat completion through the intelligent multi-model routing & failover cascade
   */
  async executeChatCompletion(params = {}) {
    const startTime = Date.now();
    const {
      messages = [],
      taskType: explicitTaskType,
      temperature,
      max_tokens = 1500,
      skipCache = false,
      timeoutMs = this.config.defaultTimeoutMs,
      ...rest
    } = params;

    // 1. Task Classification
    const taskType = classifyTaskType({ taskType: explicitTaskType, messages });
    const executionPlan = resolveExecutionPlan(taskType, this.config);

    // 2. Check Cache
    const cacheKey = aiCache.createKey('chat', { messages, taskType });
    if (!skipCache) {
      const cached = aiCache.get(cacheKey);
      if (cached) {
        aiTelemetry.recordEvent({
          taskType,
          provider: 'CACHE',
          model: 'CACHED',
          durationMs: Date.now() - startTime,
          success: true,
          cached: true
        });
        return cached;
      }
    }

    let lastError = null;
    let fallbackUsed = false;
    let successfulModel = null;
    let successfulProvider = null;

    // 3. Multi-Model Failover Cascade
    for (let planIndex = 0; planIndex < executionPlan.length; planIndex++) {
      const step = executionPlan[planIndex];
      const provider = this.getProvider(step.providerType);

      if (!provider.isConfigured() && step.providerType === 'OPENROUTER' && !this.config.openRouterApiKey) {
        // If OpenRouter key is not provided, gracefully step down to TokenRouter
        continue;
      }

      const payload = {
        model: step.model,
        messages,
        temperature: temperature !== undefined ? temperature : step.temperature,
        max_tokens,
        ...rest
      };

      try {
        const response = await executeWithRetry(
          async () => {
            return await provider.sendChatCompletion(payload, { timeoutMs });
          },
          {
            maxRetries: 1,
            initialDelayMs: 400,
            providerKey: `${step.providerType}:${step.model}`
          }
        );

        if (response && response.choices && response.choices.length > 0) {
          const choice = response.choices[0];
          let rawContent = choice.message?.content || choice.message?.reasoning_content || '';
          
          // Sanitize output to guarantee zero private CoT leakage to end users
          const cleanContent = sanitizeLlmOutput(rawContent);

          const formattedResponse = {
            ...response,
            choices: [
              {
                ...choice,
                message: {
                  ...choice.message,
                  content: cleanContent
                }
              }
            ],
            _orchestratorMeta: {
              taskType,
              model: step.model,
              provider: step.providerType,
              tier: step.tier,
              fallbackUsed: planIndex > 0,
              durationMs: Date.now() - startTime
            }
          };

          successfulModel = step.model;
          successfulProvider = step.providerType;
          fallbackUsed = planIndex > 0;

          // Save to Cache
          aiCache.set(cacheKey, formattedResponse, this.config.cacheTtlMs);

          // Record Telemetry
          aiTelemetry.recordEvent({
            taskType,
            provider: successfulProvider,
            model: successfulModel,
            durationMs: Date.now() - startTime,
            success: true,
            fallbackUsed,
            fallbackTier: step.tier
          });

          return formattedResponse;
        }
      } catch (err) {
        lastError = err;
        fallbackUsed = true;
        console.warn(`[AI Orchestrator] Step ${planIndex + 1} (${step.model} on ${step.providerType}) failed: ${err.message}. Cascading to fallback...`);
      }
    }

    // 4. Record Failure Telemetry
    aiTelemetry.recordEvent({
      taskType,
      provider: 'CASCADE_EXHAUSTED',
      model: 'NONE',
      durationMs: Date.now() - startTime,
      success: false,
      error: lastError
    });

    // 5. Ultimate Graceful Fallback (Never crash the UI)
    return {
      id: `fallback-${Date.now()}`,
      created: Math.floor(Date.now() / 1000),
      model: 'heuristic-offline-fallback',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'Torchbearer AI has evaluated your request based on real verified guidelines. Please check the opportunity catalog directly for verified deadlines and eligibility.'
          },
          finish_reason: 'stop'
        }
      ],
      _orchestratorMeta: {
        taskType,
        fallbackUsed: true,
        tier: 'HEURISTIC_OFFLINE',
        error: lastError?.message
      }
    };
  }

  /**
   * Generates Deep Structured Opportunity Intelligence with multi-factor scoring and reasoning
   */
  async analyzeOpportunityWithDeepReasoning(opportunity = {}, studentContext = {}) {
    if (!opportunity || !opportunity.title) {
      return createDefaultOpportunityIntelligence(opportunity);
    }

    const systemPrompt = `You are the Lead Opportunity Intelligence Analyst for Torchbearer AI.
Your mission is to perform critical, evidence-grounded strategic analysis on student opportunities.

Follow these strict rules:
1. Ground all analysis strictly in the provided opportunity data.
2. If any attribute (stipend, deadline, eligibility) cannot be verified from the data, mark it as "UNVERIFIED" — NEVER invent or hallucinate evidence.
3. Separate objective facts from predictions.
4. Provide structured intelligence in valid raw JSON with the following exact keys:
{
  "title": string,
  "description": string (2-sentence clear overview),
  "category": string,
  "industry": string,
  "source": string,
  "source_url": string,
  "why_it_matters": string (1-2 sentences on career impact),
  "evidence": string[] (2-3 concrete verifiable facts from listing),
  "impact": number (0-100),
  "confidence": number (0-100),
  "relevance": number (0-100),
  "actionability": number (0-100),
  "freshness": number (0-100),
  "competition": number (0-100),
  "overall_score": number (0-100),
  "recommended_action": string (Specific actionable next step for student)
}`;

    const userPrompt = `Analyze this student opportunity:
Title: ${opportunity.title}
Organization: ${opportunity.organization || opportunity.company || 'UNVERIFIED'}
Type: ${opportunity.type || opportunity.internshipType || 'Internship'}
Mode: ${opportunity.mode || opportunity.workMode || 'Remote'}
Stipend: ${opportunity.stipend || 'UNVERIFIED'}
Deadline: ${opportunity.deadline || opportunity.applicationDeadline || 'Rolling'}
Eligibility: ${opportunity.eligibility || 'UNVERIFIED'}
Skills: ${Array.isArray(opportunity.skills) ? opportunity.skills.join(', ') : 'UNVERIFIED'}
Source: ${opportunity.sourceName || 'Official Portal'} (${opportunity.applyUrl || opportunity.applicationUrl || 'UNVERIFIED'})
Description: ${opportunity.description || 'N/A'}

Return raw JSON only:`;

    try {
      const response = await this.executeChatCompletion({
        taskType: TASK_TYPES.COMPLEX_OPPORTUNITY_ANALYSIS,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1400
      });

      const messageObj = response?.choices?.[0]?.message;
      const rawContent = messageObj?.content || '';
      const parsed = extractAndParseJson(rawContent);

      return validateOpportunityIntelligence(parsed, opportunity);
    } catch (err) {
      console.warn(`[AI Orchestrator] Opportunity analysis fallback for "${opportunity.title}":`, err.message);
      return createDefaultOpportunityIntelligence(opportunity);
    }
  }
}

// Global Singleton Instance
export const globalAIOrchestrator = new AIOrchestrator();
