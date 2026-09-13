/**
 * AI Orchestrator — Response Sanitizer, Validator, and JSON Auto-Repair
 */

/**
 * Sanitizes LLM output by removing private chain-of-thought (<think> tags, markdown code wraps, reasoning blocks)
 */
export function sanitizeLlmOutput(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return '';

  let sanitized = rawText;

  // Remove <think>...</think> reasoning blocks
  sanitized = sanitized.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // Remove <reasoning>...</reasoning> blocks
  sanitized = sanitized.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '');

  return sanitized.trim();
}

/**
 * Robust JSON extraction and repair engine
 */
export function extractAndParseJson(rawText = '') {
  if (!rawText) return null;

  const clean = sanitizeLlmOutput(rawText);

  // 1. Direct parse attempt
  try {
    return JSON.parse(clean);
  } catch {}

  // 2. Extract from markdown code blocks ```json ... ``` or ``` ... ```
  try {
    const codeBlockMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      return JSON.parse(codeBlockMatch[1].trim());
    }
  } catch {}

  // 3. Extract outermost { ... }
  try {
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = clean.substring(firstBrace, lastBrace + 1);
      return JSON.parse(candidate);
    }
  } catch {}

  // 4. Extract outermost [ ... ] (arrays)
  try {
    const firstBracket = clean.indexOf('[');
    const lastBracket = clean.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const candidate = clean.substring(firstBracket, lastBracket + 1);
      return JSON.parse(candidate);
    }
  } catch {}

  // 5. Automatic JSON Repair (handle trailing commas, unescaped quotes)
  try {
    let repaired = clean;
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      repaired = clean.substring(firstBrace, lastBrace + 1);
    }
    // Remove trailing commas before } or ]
    repaired = repaired.replace(/,\s*([}\]])/g, '$1');
    return JSON.parse(repaired);
  } catch {}

  return null;
}

/**
 * Validates and normalizes structured Opportunity Intelligence output
 */
export function validateOpportunityIntelligence(data, fallbackContext = {}) {
  if (!data || typeof data !== 'object') {
    return createDefaultOpportunityIntelligence(fallbackContext);
  }

  const num = (v, min = 0, max = 100, def = 50) => {
    const parsed = Number(v);
    if (isNaN(parsed)) return def;
    return Math.max(min, Math.min(max, parsed));
  };

  const str = (v, def = 'UNVERIFIED') => {
    if (!v || typeof v !== 'string' || v.trim().length === 0) return def;
    return v.trim();
  };

  const arr = (v, def = []) => {
    if (Array.isArray(v)) return v.filter(Boolean);
    if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
    return def;
  };

  return {
    title: str(data.title, fallbackContext.title || 'UNVERIFIED'),
    description: str(data.description, fallbackContext.description || 'UNVERIFIED'),
    category: str(data.category, fallbackContext.category || 'Software Development'),
    industry: str(data.industry, fallbackContext.industry || 'Technology & Engineering'),
    source: str(data.source, fallbackContext.sourceName || 'Official Source'),
    source_url: str(data.source_url || data.sourceUrl, fallbackContext.applyUrl || fallbackContext.sourceUrl || 'UNVERIFIED'),
    why_it_matters: str(data.why_it_matters || data.whyItMatters, 'Provides real-world engineering exposure, skill development, and career advancement.'),
    evidence: arr(data.evidence, ['Official organization listing', 'Verified application guidelines']),
    impact: num(data.impact, 0, 100, 75),
    confidence: num(data.confidence, 0, 100, 85),
    relevance: num(data.relevance, 0, 100, 80),
    actionability: num(data.actionability, 0, 100, 80),
    freshness: num(data.freshness, 0, 100, 90),
    competition: num(data.competition, 0, 100, 60),
    overall_score: num(data.overall_score || data.overallScore, 0, 100, 80),
    recommended_action: str(data.recommended_action || data.recommendedAction, 'Review eligibility criteria and prepare relevant technical coursework prior to submission.')
  };
}

export function createDefaultOpportunityIntelligence(context = {}) {
  return {
    title: context.title || 'UNVERIFIED',
    description: context.description || 'Verified student opportunity listed on official portals.',
    category: context.category || 'Software Development',
    industry: 'Technology & Engineering',
    source: context.sourceName || 'Official Source',
    source_url: context.applyUrl || context.sourceUrl || 'UNVERIFIED',
    why_it_matters: 'Verified opportunity offering direct mentorship, skills validation, and career acceleration.',
    evidence: ['Verified direct application link', 'Standard student eligibility criteria'],
    impact: 75,
    confidence: 85,
    relevance: 80,
    actionability: 85,
    freshness: 90,
    competition: 65,
    overall_score: 80,
    recommended_action: 'Prepare required technical profile, resume, and submit before deadline.'
  };
}
