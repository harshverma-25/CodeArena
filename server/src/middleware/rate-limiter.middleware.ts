import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/errors/api-error.js';

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * Reusable memory-safe sliding window rate limiter factory with periodic cleanup.
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const store = new Map<string, { count: number; resetTime: number }>();
  const { windowMs, maxRequests, message } = options;

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, Math.min(windowMs, 5 * 60 * 1000));

  if (cleanup.unref) {
    cleanup.unref();
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator
      ? options.keyGenerator(req)
      : (req.ip || req.socket.remoteAddress || 'unknown');
    const now = Date.now();
    const record = store.get(key);

    if (!record) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      throw new ApiError(
        429,
        message || `Too many requests. Please try again after ${Math.ceil(windowMs / 60000)} minutes.`
      );
    }

    next();
  };
}

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 500; // Limit each IP to 500 requests per window

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const normalizedPath = req.path.replace(/\/+$/, '') || '/';

  // Bypass rate limiting for documentation and automated orchestrator health probes
  if (
    normalizedPath === '/health' ||
    normalizedPath === '/api/v1/health' ||
    normalizedPath.startsWith('/api/docs') ||
    normalizedPath.startsWith('/api/swagger.json')
  ) {
    return next();
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = ipRequestCounts.get(ip);

  if (!record) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + WINDOW_SIZE_MS });
    return next();
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + WINDOW_SIZE_MS;
    return next();
  }

  record.count++;
  if (record.count > MAX_REQUESTS) {
    throw new ApiError(429, 'Too many requests, please try again after 15 minutes.');
  }

  next();
}

// Dedicated stricter rate limiter for credential-sensitive endpoints (15 req / 15 min per IP)
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 15,
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
});

// Dedicated stricter rate limiter for expensive AI media generation (10 req / 10 min)
export const mediaGenerationRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many media generation requests. Please wait a few minutes before trying again.',
});

// Periodic cleanup to evict expired IP tracking entries and prevent unbounded memory growth
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestCounts.entries()) {
    if (now > record.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}, CLEANUP_INTERVAL_MS);

if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

/**
 * Exposed for unit tests or manual memory eviction.
 */
export function purgeExpiredRateLimits(): void {
  const now = Date.now();
  for (const [ip, record] of ipRequestCounts.entries()) {
    if (now > record.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}

