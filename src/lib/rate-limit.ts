/**
 * Simple in-memory rate limiter for API routes.
 *
 * Uses a sliding window approach with per-IP tracking.
 *
 * NOTE: In production (multi-instance deployment), replace with Redis-backed
 * rate limiting using Upstash Redis or similar. The interface is designed
 * to make this swap straightforward — just replace the store.
 *
 * Usage in API routes:
 *   import { rateLimit } from "@/lib/rate-limit";
 *   const { success, remaining, resetAt } = await rateLimit(ip, { limit: 10, window: 60 });
 *   if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

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

/** In-memory store — reset on server restart. Replace with Redis in production. */
const store = new Map<string, { count: number; resetAt: number }>();

/** Clean up expired entries every 5 minutes to prevent memory leaks. */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

/**
 * Extract client IP from a Next.js Headers object.
 * Handles X-Forwarded-For (proxy/fly.io) and Next.js conventions.
 */
export function getClientIp(headers: Headers): string {
  // Fly.io / proxy headers
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  // Vercel
  const vercelIp = headers.get("x-vercel-forwarded-ip");
  if (vercelIp) {
    return vercelIp;
  }
  return "unknown";
}

/**
 * Rate limit check for a given identifier (typically client IP).
 *
 * Returns { success, remaining, limit, resetAt }.
 * Caller should return 429 if !success.
 */
export async function rateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  startCleanup();

  const { limit, window } = options;
  const now = Date.now();
  const windowMs = window * 1000;
  const resetAt = now + windowMs;

  const entry = store.get(identifier);

  if (!entry || entry.resetAt <= now) {
    // New or expired window
    store.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, limit, resetAt };
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return { success: false, remaining: 0, limit, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, limit, resetAt };
}

/**
 * Add rate limit headers to a NextResponse.
 */
export function setRateLimitHeaders(
  res: Response,
  result: RateLimitResult
): void {
  res.headers.set("X-RateLimit-Limit", String(result.limit));
  res.headers.set("X-RateLimit-Remaining", String(Math.max(0, result.remaining)));
  res.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
}
