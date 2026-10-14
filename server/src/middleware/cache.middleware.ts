import { Request, Response, NextFunction } from 'express';

interface CacheOptions {
  maxAge?: number;
  staleWhileRevalidate?: number;
}

/**
 * Public Cache-Control middleware for static or slowly-changing catalog endpoints.
 * Automatically safeguards against caching authenticated or personalized responses.
 *
 * @param options.maxAge Freshness duration in seconds (client & shared caches)
 * @param options.staleWhileRevalidate Grace period in seconds to serve stale data while revalidating
 */
export function publicCache(options: CacheOptions = {}) {
  const { maxAge = 120, staleWhileRevalidate = 300 } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache safe, idempotent read requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }

    // Safety guard: if an authorization header, auth cookie, or authenticated user is present,
    // NEVER mark the response as publicly cacheable.
    const hasAuthHeader = Boolean(req.headers.authorization);
    const hasAuthCookie = Boolean(req.cookies?.token || req.cookies?.refreshToken);
    const hasUser = Boolean((req as any).user);

    if (hasAuthHeader || hasAuthCookie || hasUser) {
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      return next();
    }

    // Public catalog response with stale-while-revalidate for seamless edge revalidation
    res.setHeader(
      'Cache-Control',
      `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
    );

    next();
  };
}

/**
 * Strict no-cache middleware for authenticated, sensitive, admin, or real-time battle endpoints.
 */
export function noCache(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}
