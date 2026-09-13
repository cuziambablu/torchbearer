/**
 * AI Orchestrator — Provider Abstraction Layer
 * Supports OpenRouter, TokenRouter, and extensible Custom Providers.
 */

export class BaseAIProvider {
  constructor(name, baseUrl, apiKey) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  async sendChatCompletion(payload, options = {}) {
    throw new Error('sendChatCompletion must be implemented by subclass');
  }
}

export class OpenRouterProvider extends BaseAIProvider {
  constructor(baseUrl, apiKey) {
    super('OpenRouter', baseUrl || 'https://openrouter.ai/api/v1', apiKey);
  }

  async sendChatCompletion(payload, options = {}) {
    const { timeoutMs = 25000, signal } = options;

    const controller = new AbortController();
    let timeoutId = null;

    if (timeoutMs > 0) {
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }

    const abortSignal = signal || controller.signal;

    try {
      const headers = {
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://torchbearer.ai',
        'X-Title': 'Torchbearer AI'
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: abortSignal
      });

      if (!response.ok) {
        const errorText = await response.text();
        const err = new Error(`OpenRouter error [${response.status}]: ${errorText}`);
        err.status = response.status;
        err.provider = this.name;
        throw err;
      }

      return await response.json();
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
}

export class TokenRouterProvider extends BaseAIProvider {
  constructor(baseUrl, apiKey) {
    super('TokenRouter', baseUrl || 'https://api.tokenrouter.com/v1', apiKey);
  }

  async sendChatCompletion(payload, options = {}) {
    const { timeoutMs = 25000, signal } = options;

    const controller = new AbortController();
    let timeoutId = null;

    if (timeoutMs > 0) {
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }

    const abortSignal = signal || controller.signal;

    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: abortSignal
      });

      if (!response.ok) {
        const errorText = await response.text();
        const err = new Error(`TokenRouter error [${response.status}]: ${errorText}`);
        err.status = response.status;
        err.provider = this.name;
        throw err;
      }

      return await response.json();
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
}
