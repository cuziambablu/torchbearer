/**
 * Torchbearer AI — Opportunity Agent LLM Enricher
 * 
 * Powered by the multi-model AI Orchestrator.
 * Generates structured opportunity intelligence, actionable preparation roadmaps,
 * verified technical key tags, and student match insights.
 */

import { globalAIOrchestrator } from '../aiOrchestrator/index.js';
import { TASK_TYPES } from '../aiOrchestrator/models.js';

/**
 * Enriches an opportunity with AI-powered structured intelligence and strategic reasoning
 */
export async function enrichOpportunityWithLLM(opportunity) {
  if (!opportunity || !opportunity.title) return opportunity;

  try {
    const intelligence = await globalAIOrchestrator.analyzeOpportunityWithDeepReasoning(opportunity);

    return {
      ...opportunity,
      aiSummary: intelligence.description || opportunity.description,
      whyItMatters: intelligence.why_it_matters,
      evidence: intelligence.evidence,
      recommendedAction: intelligence.recommended_action,
      preparationTips: [
        intelligence.recommended_action,
        `Target core requirements: ${(opportunity.skills || ['Technical Foundations']).slice(0, 3).join(', ')}`,
        'Verify official application guidelines before the posted deadline.'
      ],
      aiTags: Array.isArray(opportunity.skills) && opportunity.skills.length > 0
        ? Array.from(new Set([opportunity.category || 'Engineering', ...opportunity.skills.slice(0, 4)]))
        : [opportunity.category || 'Software Development', 'Verified', 'Student Opportunity'],
      aiEnriched: true,
      aiScores: {
        impact: intelligence.impact,
        confidence: intelligence.confidence,
        relevance: intelligence.relevance,
        actionability: intelligence.actionability,
        freshness: intelligence.freshness,
        competition: intelligence.competition,
        overall: intelligence.overall_score
      }
    };
  } catch (err) {
    console.warn(`[LLM Enricher] Failed to enrich opportunity "${opportunity.title}":`, err.message);
    return opportunity;
  }
}

/**
 * Generates an AI-powered personalized match explanation for a student profile
 */
export async function generateStudentMatchInsight(opportunity, studentProfile = {}) {
  if (!opportunity) return null;

  try {
    const systemPrompt = `You are the Lead Student Career Coach at Torchbearer AI.
Mission: "Light the way to your future."
Explain in 2 direct, encouraging, high-impact sentences why this opportunity fits the student's profile.
Highlight 1-2 overlapping technical skills or career milestone benefits.
Keep response under 50 words.`;

    const userPrompt = `Opportunity: ${opportunity.title} at ${opportunity.organization || opportunity.company} (${opportunity.type || 'Internship'})
Required Skills: ${(opportunity.skills || []).join(', ')}

Student:
Branch: ${studentProfile.branch || 'Engineering'}
Year: ${studentProfile.year || '3rd Year'}
Student Skills: ${(studentProfile.skills || []).join(', ')}
Interests: ${(studentProfile.interests || []).join(', ')}`;

    const response = await globalAIOrchestrator.executeChatCompletion({
      taskType: TASK_TYPES.STRATEGIC_REASONING,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 300
    });

    const content = response?.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch (err) {
    console.warn('[LLM Match Insight] Error:', err.message);
    return null;
  }
}
