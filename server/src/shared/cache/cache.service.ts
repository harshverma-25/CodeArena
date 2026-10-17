import { getRedisClient } from '../../config/redis.js';
import { logger } from '../../config/logger.js';

export interface CacheOptions {
  timeoutMs?: number;
}

export class CacheService {
  private readonly defaultTimeoutMs = 1500;
  private readonly prefix = 'quizzy:';
  private lastErrorLogTime = 0;
  private readonly errorLogCooldownMs = 60000; // 1 minute cooldown between error warnings

  // In-memory fallback cache (Tier 2) when Redis is unconfigured or unreachable
  private memoryCache = new Map<string, { data: any; expiresAt: number }>();
  private readonly maxMemoryEntries = 500;

  // Non-sensitive telemetry metrics
  private metrics = {
    hits: 0,
    misses: 0,
    redisErrors: 0,
    sets: 0,
    deletes: 0,
  };

  /**
   * Safe with-timeout wrapper for Redis operations.
   */
  private async withTimeout<T>(promise: Promise<T>, timeoutMs = this.defaultTimeoutMs): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Redis operation timed out after ${timeoutMs}ms`)), timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timer!);
    }
  }

  /**
   * Log Redis warnings with rate limiting to prevent log flooding during outages.
   */
  private logRedisWarning(action: string, error: any): void {
    this.metrics.redisErrors++;
    const now = Date.now();
    if (now - this.lastErrorLogTime > this.errorLogCooldownMs) {
      this.lastErrorLogTime = now;
      logger.warn(
        { action, error: error?.message || 'Redis communication failure' },
        '⚠️ Redis cache unavailable or timed out; falling back to secondary cache/MongoDB'
      );
    }
  }

  /**
   * Build namespaced cache key.
   */
  public buildKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Retrieve cached value from Redis or in-memory fallback.
   */
  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    const fullKey = this.buildKey(key);
    const client = getRedisClient();

    // 1. Attempt Upstash Redis if configured
    if (client) {
      try {
        const raw = await this.withTimeout(client.get<T>(fullKey), options?.timeoutMs);
        if (raw !== null && raw !== undefined) {
          this.metrics.hits++;
          // Sync with local memory cache for ultra-low latency fallback
          this.setMemory(fullKey, raw, 60);
          return raw;
        }
      } catch (err) {
        this.logRedisWarning(`get(${key})`, err);
      }
    }

    // 2. Fall back to local in-memory cache
    const mem = this.getMemory<T>(fullKey);
    if (mem !== null) {
      this.metrics.hits++;
      return mem;
    }

    this.metrics.misses++;
    return null;
  }

  /**
   * Store value in Redis with a TTL in seconds and update local memory cache.
  /**
   * Helper to extract the namespace prefix from a cache key (e.g. 'categories:' from 'categories:all').
   */
  private getNamespacePrefix(key: string): string | null {
    const idx = key.indexOf(':');
    return idx !== -1 ? key.slice(0, idx + 1) : null;
  }

  /**
   * Store value in Redis with a TTL in seconds and update local memory cache.
   */
  async set<T>(key: string, value: T, ttlSeconds: number, options?: CacheOptions): Promise<boolean> {
    if (value === null || value === undefined) {
      return false;
    }

    const fullKey = this.buildKey(key);
    this.metrics.sets++;

    // Always update local memory cache for resilience
    this.setMemory(fullKey, value, ttlSeconds);

    const client = getRedisClient();
    if (!client) {
      return true;
    }

    try {
      await this.withTimeout(client.set(fullKey, value, { ex: ttlSeconds }), options?.timeoutMs);

      // Track the key in its targeted namespace set for fast O(K) prefix invalidation
      const ns = this.getNamespacePrefix(key);
      if (ns) {
        const nsKey = this.buildKey(`_ns:${ns}`);
        // Maintain 24h TTL on namespace tracking set to prevent unbounded growth
        client.sadd(nsKey, fullKey).catch(() => {});
        client.expire(nsKey, 86400).catch(() => {});
      }

      return true;
    } catch (err) {
      this.logRedisWarning(`set(${key})`, err);
      return false;
    }
  }

  /**
   * Delete one or more keys from Redis and local memory cache.
   */
  async del(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    this.metrics.deletes++;

    const fullKeys = keys.map((k) => this.buildKey(k));
    for (const fk of fullKeys) {
      this.memoryCache.delete(fk);
    }

    const client = getRedisClient();
    if (!client) return keys.length;

    try {
      const count = await this.withTimeout(client.del(...fullKeys));

      // Remove keys from their namespace tracking set
      for (const k of keys) {
        const ns = this.getNamespacePrefix(k);
        if (ns) {
          const nsKey = this.buildKey(`_ns:${ns}`);
          client.srem(nsKey, this.buildKey(k)).catch(() => {});
        }
      }

      return typeof count === 'number' ? count : keys.length;
    } catch (err) {
      this.logRedisWarning(`del(${keys.join(',')})`, err);
      return 0;
    }
  }

  /**
   * Delete all keys matching a specific prefix (e.g. 'categories:' or 'popular:').
   * Employs targeted namespace tracking sets to achieve fast O(K) invalidation without
   * triggering an expensive, blocking O(N) KEYS scan across Upstash Redis.
   */
  async delByPrefix(prefix: string): Promise<number> {
    const rawPrefix = prefix.endsWith(':') ? prefix : `${prefix}:`;
    const fullPrefix = this.buildKey(prefix);

    // 1. Clear matching keys in local memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(fullPrefix)) {
        this.memoryCache.delete(key);
      }
    }

    const client = getRedisClient();
    if (!client) return 0;

    try {
      const nsKey = this.buildKey(`_ns:${rawPrefix}`);

      // 2. Fetch targeted keys tracked under this namespace set
      const trackedKeys: string[] = await this.withTimeout(client.smembers(nsKey)).catch(() => []);

      let totalDeleted = 0;

      if (Array.isArray(trackedKeys) && trackedKeys.length > 0) {
        // Delete all tracked keys + the tracking set itself in a single targeted command
        const deleted = await this.withTimeout(client.del(...trackedKeys, nsKey));
        totalDeleted = typeof deleted === 'number' ? deleted : trackedKeys.length;
      } else {
        // Fallback: If no tracked set exists, use cursor-based non-blocking SCAN instead of blocking KEYS
        let cursor = 0;
        const searchPattern = `${fullPrefix}*`;
        let iterations = 0;
        const maxIterations = 5;

        do {
          const [nextCursor, keys] = await this.withTimeout(
            client.scan(cursor, { match: searchPattern, count: 50 })
          );
          cursor = Number(nextCursor);
          if (Array.isArray(keys) && keys.length > 0) {
            const count = await this.withTimeout(client.del(...keys));
            totalDeleted += typeof count === 'number' ? count : keys.length;
          }
          iterations++;
        } while (cursor !== 0 && iterations < maxIterations);

        // Also clean up the tracking set key if it existed
        client.del(nsKey).catch(() => {});
      }

      return totalDeleted;
    } catch (err) {
      this.logRedisWarning(`delByPrefix(${prefix})`, err);
      return 0;
    }
  }

  /**
   * Read-through cache-aside pattern:
   * 1. Try to read from cache (Redis/Memory).
   * 2. On hit, return data immediately.
   * 3. On miss or Redis failure, invoke fetchFn() and cache the result.
   * 4. Errors in fetchFn() are never cached.
   */
  async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key, options);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    // Execute authoritative MongoDB query or calculation
    const data = await fetchFn();

    // Cache the successful result asynchronously (do not block client response)
    if (data !== null && data !== undefined) {
      this.set(key, data, ttlSeconds, options).catch(() => {});
    }

    return data;
  }

  /**
   * In-memory cache helper.
   */
  private getMemory<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.data as T;
  }

  private setMemory<T>(key: string, data: T, ttlSeconds: number): void {
    if (this.memoryCache.size >= this.maxMemoryEntries) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) this.memoryCache.delete(oldestKey);
    }
    this.memoryCache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Clear all keys in memory (useful for tests).
   */
  public clearMemory(): void {
    this.memoryCache.clear();
  }

  /**
   * Non-sensitive telemetry summary.
   */
  public getMetrics() {
    return {
      ...this.metrics,
      memoryEntries: this.memoryCache.size,
      isRedisConfigured: Boolean(getRedisClient()),
    };
  }
}

export const cacheService = new CacheService();
export default cacheService;
