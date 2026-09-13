/**
 * AI Orchestrator — Rate Limiting, Exponential Backoff & Circuit Breaker
 */

class CircuitBreaker {
  constructor({ failureThreshold = 3, cooldownPeriodMs = 60000 } = {}) {
    this.failureThreshold = failureThreshold;
    this.cooldownPeriodMs = cooldownPeriodMs;
    this.providerStates = new Map();
  }

  getState(providerKey) {
    if (!this.providerStates.has(providerKey)) {
      this.providerStates.set(providerKey, {
        consecutiveFailures: 0,
        state: 'CLOSED', // 'CLOSED' (healthy), 'OPEN' (tripped/cooling down), 'HALF_OPEN'
        lastFailureTime: 0
      });
    }
    const record = this.providerStates.get(providerKey);

    // Check if cooldown expired
    if (record.state === 'OPEN') {
      const elapsed = Date.now() - record.lastFailureTime;
      if (elapsed > this.cooldownPeriodMs) {
        record.state = 'HALF_OPEN';
      }
    }

    return record;
  }

  isAvailable(providerKey) {
    const record = this.getState(providerKey);
    return record.state !== 'OPEN';
  }

  recordSuccess(providerKey) {
    const record = this.getState(providerKey);
    record.consecutiveFailures = 0;
    record.state = 'CLOSED';
  }

  recordFailure(providerKey) {
    const record = this.getState(providerKey);
    record.consecutiveFailures += 1;
    record.lastFailureTime = Date.now();

    if (record.consecutiveFailures >= this.failureThreshold) {
      record.state = 'OPEN';
      console.warn(`[CircuitBreaker] Provider ${providerKey} tripped OPEN for ${this.cooldownPeriodMs / 1000}s`);
    }
  }
}

export const circuitBreaker = new CircuitBreaker();

/**
 * Executes an async function with exponential backoff retries and rate limit protection
 */
export async function executeWithRetry(fn, options = {}) {
  const {
    maxRetries = 2,
    initialDelayMs = 500,
    backoffFactor = 2,
    providerKey = 'default',
    shouldRetry = (err) => {
      // Retry on network errors, timeouts, 429 rate limits, 502/503/504 server errors
      if (!err) return false;
      const status = err.status || 0;
      return status === 429 || status >= 500 || err.name === 'AbortError' || err.message?.includes('fetch');
    }
  } = options;

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt <= maxRetries) {
    try {
      if (!circuitBreaker.isAvailable(providerKey)) {
        throw new Error(`Circuit breaker open for provider ${providerKey}`);
      }

      const result = await fn(attempt);
      circuitBreaker.recordSuccess(providerKey);
      return result;
    } catch (err) {
      attempt++;
      circuitBreaker.recordFailure(providerKey);

      if (attempt > maxRetries || !shouldRetry(err)) {
        throw err;
      }

      // Add jitter to delay
      const jitter = Math.random() * 200;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
      delay *= backoffFactor;
    }
  }
}
