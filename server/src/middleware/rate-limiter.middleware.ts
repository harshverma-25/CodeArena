import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/errors/api-error.js';

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 500; // Limit each IP to 500 requests per window

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  // Bypassing rate limiting for static documentation routes
  if (req.path.startsWith('/api/docs') || req.path.startsWith('/api/swagger.json')) {
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
