/**
 * AI Orchestrator — Observability & Safe Telemetry Logger
 * Tracks model metrics, latency, retry counts, and provider fallbacks without exposing sensitive credentials.
 */

class TelemetryLogger {
  constructor() {
    this.history = [];
    this.maxHistory = 150;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      fallbackEvents: 0,
      cachedHits: 0,
      modelUsage: {}
    };
  }

  recordEvent(event = {}) {
    const entry = {
      id: `tel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      taskType: event.taskType || 'GENERAL_ANALYSIS',
      provider: event.provider || 'UNKNOWN',
      model: event.model || 'UNKNOWN',
      durationMs: event.durationMs || 0,
      success: Boolean(event.success),
      fallbackUsed: Boolean(event.fallbackUsed),
      fallbackTier: event.fallbackTier || null,
      cached: Boolean(event.cached),
      retries: event.retries || 0,
      error: event.error ? event.error.message || String(event.error) : null
    };

    this.history.unshift(entry);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    // Update aggregate stats
    this.stats.totalRequests++;
    if (entry.success) this.stats.successfulRequests++;
    if (!entry.success) this.stats.failedRequests++;
    if (entry.fallbackUsed) this.stats.fallbackEvents++;
    if (entry.cached) this.stats.cachedHits++;

    if (entry.model) {
      this.stats.modelUsage[entry.model] = (this.stats.modelUsage[entry.model] || 0) + 1;
    }

    return entry;
  }

  getStats() {
    return { ...this.stats, recentLogs: this.history.slice(0, 25) };
  }

  clear() {
    this.history = [];
  }
}

export const aiTelemetry = new TelemetryLogger();
