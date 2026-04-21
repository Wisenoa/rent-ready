/**
 * RentReady Rate Limiter
 *
 * Uses Upstash Redis for production (multi-instance, persistent across restarts).
 * Falls back to an in-memory sliding window store when Redis is not configured.
 *
 * Usage in API routes:
 *   import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";
 *   const { success, remaining, resetAt } = await rateLimit(ip, { limit: 100, window: 60 });
 *   if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── Types ────────────────────────────────────────────────────────────────────

interface RateLimitOptions {
  /** Max requests allowed per window */
  limit: number;
  /** Window size in seconds */
  window: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  resetAt: number; // Unix timestamp when the window resets
}

// ── Upstash Redis-backed rate limiter ────────────────────────────────────────

/**
 * Creates a Redis-backed Ratelimit instance.
 * Only instantiated when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
 */
function createRedisRatelimit(options: {
  limit: number;
  window: number;
}): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const redis = new Redis({ url, token });

  return new Ratelimit({
    redis,
    // Use sliding window for accurate rate limiting across distributed instances
    limiter: Ratelimit.slidingWindow(options.limit, `${options.window}s`),
    analytics: true,
    /**
     * Identifier: extract IP from headers.
     * In production behind a proxy (Fly.io, Vercel, etc.), X-Forwarded-For is set
     * by the proxy and is more reliable than X-Real-IP.
     */
    identifier: (req: Request) => {
      const forwarded = req.headers.get("x-forwarded-for");
      if (forwarded) return forwarded.split(",")[0].trim();
      const realIp = req.headers.get("x-real-ip");
      if (realIp) return realIp;
      return "unknown";
    },
    /**
     * Rate limit headers — included in every response so the client knows
     * how close they are to the limit.
     */
    resultsQueued: false,
  });
}

// ── In-memory fallback store ─────────────────────────────────────────────────

interface InMemoryStore {
  count: number;
  resetAt: number;
}

const inMemoryStore = new Map<string, InMemoryStore>();

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startInMemoryCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of inMemoryStore.entries()) {
      if (entry.resetAt <= now) {
        inMemoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * In-memory rate limit check (fallback when Redis is not configured).
 * NOTE: This resets on server restart and does NOT work across multiple instances.
 */
async function inMemoryRateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  startInMemoryCleanup();

  const { limit, window } = options;
  const now = Date.now();
  const windowMs = window * 1000;
  const resetAt = now + windowMs;

  const entry = inMemoryStore.get(identifier);

  if (!entry || entry.resetAt <= now) {
    inMemoryStore.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, limit, resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, limit, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, limit, resetAt };
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Extract client IP from a Next.js Headers object.
 * Handles X-Forwarded-For (proxy/fly.io) and Next.js/Vercel conventions.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  const vercelIp = headers.get("x-vercel-forwarded-ip");
  if (vercelIp) return vercelIp;
  return "unknown";
}

/**
 * Cache the ratelimit instance per (limit, window) combination so we don't
 * recreate it on every request.
 */
const ratelimitCache = new Map<string, Ratelimit | null>();

function getRatelimit(limit: number, window: number): Ratelimit | null {
  const key = `${limit}:${window}`;
  if (!ratelimitCache.has(key)) {
    ratelimitCache.set(key, createRedisRatelimit({ limit, window }));
  }
  return ratelimitCache.get(key) ?? null;
}

/**
 * Rate limit a request.
 *
 * Uses Redis (Upstash) when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * are set in the environment. Falls back to the in-memory store otherwise.
 *
 * @param identifier  Typically the client IP address
 * @param options      { limit: max reqs, window: seconds }
 */
export async function rateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { limit, window } = options;

  const ratelimit = getRatelimit(limit, window);

  if (ratelimit) {
    // Upstash Redis path
    const result = await ratelimit.limit(identifier);

    return {
      success: result.success,
      remaining: result.remaining,
      limit: result.limit,
      resetAt: Date.now() + (result.reset ?? window * 1000),
    };
  }

  // In-memory fallback
  return inMemoryRateLimit(identifier, options);
}

/**
 * Add standard rate-limit headers to any Response/NextResponse.
 */
export function setRateLimitHeaders(
  res: Response,
  result: RateLimitResult
): void {
  res.headers.set("X-RateLimit-Limit", String(result.limit));
  res.headers.set("X-RateLimit-Remaining", String(Math.max(0, result.remaining)));
  res.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
}

// ── Pre-configured rate limiters for common use-cases ────────────────────────

/**
 * Public API routes — 100 req/min per IP
 * Heavy public endpoints (e.g., /api/lead/demo) should use the stricter limiter below.
 */
export const publicApiLimiter = {
  limit: 100,
  window: 60,
} as const;

/**
 * Auth routes — 10 req/min per IP (sign-in, sign-up, password reset)
 */
export const authLimiter = {
  limit: 10,
  window: 60,
} as const;

/**
 * Lead capture / demo request — 5 req/hour per IP (prevent lead-form spam)
 */
export const leadLimiter = {
  limit: 5,
  window: 3600,
} as const;

/**
 * AI routes — 20 req/min per IP (expensive, metered by OpenAI cost)
 */
export const aiLimiter = {
  limit: 20,
  window: 60,
} as const;
