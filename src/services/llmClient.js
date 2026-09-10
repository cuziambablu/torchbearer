/**
 * TokenRouter / Experiential Gateway LLM Client
 * Routes LLM completions through OpenAI-compatible Chat Completions API
 * Configured by default for z-ai/glm-5.3-free on https://api.tokenrouter.com/v1
 */

export const DEFAULT_BASE_URL = 'https://api.tokenrouter.com/v1';
export const DEFAULT_MODEL = 'z-ai/glm-5.3-free';
const DEFAULT_FALLBACK_KEY = 'sk-CVqw7jlQPzG8DlW8k26HXl89cNixf9XLbM9shyBkobGuzD3R';

export function getApiKey() {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.TOKENROUTER_API_KEY) return process.env.TOKENROUTER_API_KEY;
    if (process.env.EXPLABS_API_KEY) return process.env.EXPLABS_API_KEY;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_TOKENROUTER_API_KEY) return import.meta.env.VITE_TOKENROUTER_API_KEY;
    if (import.meta.env.VITE_EXPLABS_API_KEY) return import.meta.env.VITE_EXPLABS_API_KEY;
  }
  return DEFAULT_FALLBACK_KEY;
}

export function getBaseUrl() {
  if (typeof process !== 'undefined' && process.env && process.env.LLM_BASE_URL) {
    return process.env.LLM_BASE_URL;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_LLM_BASE_URL) {
    return import.meta.env.VITE_LLM_BASE_URL;
  }
  return DEFAULT_BASE_URL;
}

export function getModel() {
  if (typeof process !== 'undefined' && process.env && process.env.LLM_MODEL) {
    return process.env.LLM_MODEL;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_LLM_MODEL) {
    return import.meta.env.VITE_LLM_MODEL;
  }
  return DEFAULT_MODEL;
}

export function checkApiKeyConfigured() {
  return Boolean(getApiKey());
}

/**
 * Creates a chat completion request routed through the AI Gateway.
 * Preserves streaming, tool calls, and standard OpenAI chat parameters.
 */
export async function createChatCompletion({
  messages,
  model,
  baseUrl,
  temperature = 0.6,
  max_tokens = 1024,
  stream = false,
  tools,
  tool_choice,
  ...rest
}) {
  const apiKey = getApiKey();
  const targetBaseUrl = baseUrl || getBaseUrl();
  const targetModel = model || getModel();

  if (!apiKey) {
    throw new Error('API key is not configured. Please export TOKENROUTER_API_KEY or EXPLABS_API_KEY.');
  }

  const payload = {
    model: targetModel,
    messages,
    temperature,
    max_tokens,
    stream,
    ...(tools ? { tools } : {}),
    ...(tool_choice ? { tool_choice } : {}),
    ...rest
  };

  const response = await fetch(`${targetBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI Gateway error [${response.status}]: ${errorBody}`);
  }

  if (stream) {
    return response.body;
  }

  return await response.json();
}
