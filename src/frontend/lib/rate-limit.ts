/**
 * Simple In-Memory Rate Limiter
 *
 * For production, consider upgrading to:
 * - Upstash Redis (@upstash/ratelimit) for distributed rate limiting
 * - next-rate-limit for more advanced features
 *
 * This implementation uses LRU cache and is suitable for:
 * - Single-instance deployments
 * - Development and testing
 * - Low to medium traffic
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private cache: Map<string, RateLimitEntry>;
  private maxSize: number;
  private windowMs: number;
  private maxRequests: number;

  constructor(options: {
    windowMs?: number;
    maxRequests?: number;
    maxSize?: number;
  } = {}) {
    this.cache = new Map();
    this.windowMs = options.windowMs || 60 * 1000; // 1 minute default
    this.maxRequests = options.maxRequests || 100; // 100 requests per window
    this.maxSize = options.maxSize || 10000; // Max 10k unique IPs in cache
  }

  /**
   * Check if request should be rate limited
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @returns Object with success status and remaining requests
   */
  check(identifier: string): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  } {
    const now = Date.now();
    const entry = this.cache.get(identifier);

    // Clean up old entry
    if (entry && now > entry.resetTime) {
      this.cache.delete(identifier);
    }

    // Get or create entry
    const current = this.cache.get(identifier) || {
      count: 0,
      resetTime: now + this.windowMs,
    };

    // Increment count
    current.count++;

    // LRU eviction if cache is too large
    if (this.cache.size >= this.maxSize && !this.cache.has(identifier)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    // Update cache
    this.cache.set(identifier, current);

    const success = current.count <= this.maxRequests;
    const remaining = Math.max(0, this.maxRequests - current.count);
    const reset = Math.ceil(current.resetTime / 1000);

    return {
      success,
      limit: this.maxRequests,
      remaining,
      reset,
    };
  }

  /**
   * Reset rate limit for a specific identifier
   * @param identifier - Unique identifier to reset
   */
  reset(identifier: string): void {
    this.cache.delete(identifier);
  }

  /**
   * Clear all rate limit entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Export singleton instances for different rate limit tiers

/**
 * Strict rate limiter - 10 requests per minute
 * Use for: Authentication, password reset, account operations
 */
export const strictLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
});

/**
 * Moderate rate limiter - 60 requests per minute
 * Use for: API routes, data mutations, write operations
 */
export const moderateLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
});

/**
 * Lenient rate limiter - 300 requests per minute
 * Use for: Public reads, search, browse operations
 */
export const lenientLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 300,
});

/**
 * Get client identifier from request
 * Uses IP address or custom header
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';

  // For authenticated users, you could also use user ID
  // const userId = request.headers.get('x-user-id');
  // return userId ? `user-${userId}` : `ip-${ip}`;

  return `ip-${ip.trim()}`;
}

/**
 * Apply rate limit to a request
 * Returns Response with 429 status if rate limit exceeded
 */
export function applyRateLimit(
  request: Request,
  limiter: RateLimiter = moderateLimiter
): Response | null {
  const identifier = getClientIdentifier(request);
  const { success, limit, remaining: _remaining, reset } = limiter.check(identifier);

  if (!success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        limit,
        remaining: 0,
        reset,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset * 1000 - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: Response,
  limiter: RateLimiter,
  identifier: string
): Response {
  const result = limiter.check(identifier);

  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.reset.toString());

  return response;
}
