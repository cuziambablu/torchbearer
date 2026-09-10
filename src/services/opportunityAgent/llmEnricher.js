/**
 * Opportunity Agent LLM Enricher
 * Uses z-ai/glm-5.3-free via TokenRouter for AI-powered opportunity discovery,
 * data parsing, smart categorization, and student application insights.
 */

import { createChatCompletion } from '../llmClient.js';

/**
 * Safely parses a JSON string or extracts the first valid JSON object from text.
 */
function safeJsonParse(rawText) {
  if (!rawText) return null;
  const clean = rawText.trim();
  
  // Try direct parse
  try {
    return JSON.parse(clean);
  } catch {}

  // Strip markdown code fences
  try {
    const codeBlockMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      return JSON.parse(codeBlockMatch[1].trim());
    }
  } catch {}

  // Extract first { ... } block
  try {
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(clean.substring(firstBrace, lastBrace + 1));
    }
  } catch {}

  return null;
}

/**
 * Enriches an opportunity with AI-generated summary, key skills, and student preparation tips.
 */
export async function enrichOpportunityWithLLM(opportunity) {
  if (!opportunity || !opportunity.title) return opportunity;

  try {
    const prompt = `Analyze this student opportunity and return a JSON object with keys:
- "aiSummary": A 2-sentence summary for college students.
- "recommendedPrep": Array of 2-3 specific technical preparation bullet points.
- "keyTags": Array of 3-5 technical keywords.

Details:
Title: ${opportunity.title}
Organization: ${opportunity.organization}
Type: ${opportunity.type}
Description: ${opportunity.description || 'N/A'}
Skills: ${(opportunity.skills || []).join(', ')}

Return raw JSON only:`;

    const response = await createChatCompletion({
      messages: [
        { role: 'system', content: 'You are an expert college career advisor and opportunity analyst. Output valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const content = response?.choices?.[0]?.message?.content?.trim();
    if (!content) return opportunity;

    const parsed = safeJsonParse(content);
    if (!parsed) return opportunity;

    return {
      ...opportunity,
      aiSummary: parsed.aiSummary || opportunity.description,
      preparationTips: Array.isArray(parsed.recommendedPrep) ? parsed.recommendedPrep : [],
      aiTags: Array.isArray(parsed.keyTags) ? parsed.keyTags : opportunity.skills || [],
      aiEnriched: true,
      aiModel: 'z-ai/glm-5.3-free'
    };
  } catch (err) {
    console.warn(`[LLM Enricher] Failed to enrich opportunity "${opportunity.title}":`, err.message);
    return opportunity;
  }
}

/**
 * Generates an AI-powered personalized match explanation for a student profile
 */
export async function generateStudentMatchInsight(opportunity, studentProfile) {
  try {
    const prompt = `Explain in 2 friendly, concise sentences why this opportunity is a great match for this student:

Opportunity: ${opportunity.title} at ${opportunity.organization} (${opportunity.type})
Required Skills: ${(opportunity.skills || []).join(', ')}

Student:
Branch: ${studentProfile.branch || 'Engineering'}
Year: ${studentProfile.year || '3rd Year'}
Student Skills: ${(studentProfile.skills || []).join(', ')}
Interests: ${(studentProfile.interests || []).join(', ')}

Respond in 2 concise sentences directly addressing the student.`;

    const response = await createChatCompletion({
      messages: [
        { role: 'system', content: 'You are a warm, supportive college mentor giving concise application encouragement.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 400
    });

    return response?.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.warn('[LLM Match Insight] Error:', err.message);
    return null;
  }
}
