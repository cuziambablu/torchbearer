/**
 * AI Orchestrator — Intelligent Multi-Tier Response Cache
 * In-memory LRU-like Map + LocalStorage fallback with TTL support
 */

class AIResponseCache {
  constructor(defaultTtlMs = 1000 * 60 * 30) { // 30 mins
    this.memoryCache = new Map();
    this.defaultTtlMs = defaultTtlMs;
    this.maxMemoryEntries = 200;
  }

  createKey(prefix, data) {
    const raw = typeof data === 'string' ? data : JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `${prefix}:${Math.abs(hash)}`;
  }

  get(key) {
    const now = Date.now();

    // 1. Check memory cache
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key);
      if (entry.expiresAt > now) {
        return entry.value;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check localStorage in browser
    if (typeof localStorage !== 'undefined') {
      try {
        const itemStr = localStorage.getItem(`tb_ai_cache_${key}`);
        if (itemStr) {
          const entry = JSON.parse(itemStr);
          if (entry.expiresAt > now) {
            this.memoryCache.set(key, entry);
            return entry.value;
          }
          localStorage.removeItem(`tb_ai_cache_${key}`);
        }
      } catch {}
    }

    return null;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    const now = Date.now();
    const entry = {
      value,
      expiresAt: now + ttlMs,
      savedAt: now
    };

    // Trim memory if exceeding max size
    if (this.memoryCache.size >= this.maxMemoryEntries) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }

    this.memoryCache.set(key, entry);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`tb_ai_cache_${key}`, JSON.stringify(entry));
      } catch {}
    }
  }

  clear() {
    this.memoryCache.clear();
    if (typeof localStorage !== 'undefined') {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('tb_ai_cache_')) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } catch {}
    }
  }
}

export const aiCache = new AIResponseCache();
