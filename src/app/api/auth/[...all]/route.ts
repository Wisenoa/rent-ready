import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { toNextJsHandler } from "better-auth/next-js";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";

const { GET, POST: authPOST } = toNextJsHandler(auth);

// ============================================================
// GET — passthrough (no rate limiting needed)
// ============================================================
export { GET };

// ============================================================
// POST — rate-limited auth actions
// ============================================================

/**
 * Map of auth actions that require rate limiting.
 * Key is the last path segment (case-insensitive).
 */
const RATE_LIMITED_ACTIONS: Record<string, { limit: number; window: number }> = {
  "sign-in": { limit: 10, window: 60 },
  "signin": { limit: 10, window: 60 },
  "sign-up": { limit: 10, window: 60 },
  "signup": { limit: 10, window: 60 },
  "sign-in-with-oauth": { limit: 10, window: 60 },
  "signin-with-oauth": { limit: 10, window: 60 },
  "oauth-callback": { limit: 10, window: 60 },
  "oauthcallback": { limit: 10, window: 60 },
  "reset-password": { limit: 5, window: 300 },
  "resetpassword": { limit: 5, window: 300 },
  "forget-password": { limit: 5, window: 300 },
  "forgetpassword": { limit: 5, window: 300 },
  "change-password": { limit: 5, window: 300 },
  "changepassword": { limit: 5, window: 300 },
};

/**
 * GET /api/auth/[...all] — passthrough
 */
export async function POST(request: NextRequest) {
  // Extract the action from the URL path
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const action = (segments[segments.length - 1] ?? "").toLowerCase();

  const rateLimitConfig = RATE_LIMITED_ACTIONS[action];

  if (rateLimitConfig) {
    const ip = getClientIp(request.headers);
    const result = await rateLimit(ip, rateLimitConfig);

    if (!result.success) {
      const res = NextResponse.json(
        {
          error: "Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.",
        },
        { status: 429 }
      );
      setRateLimitHeaders(res, result);
      return res;
    }

    const res = await authPOST(request);
    setRateLimitHeaders(res, result);
    return res;
  }

  // Passthrough for non-rate-limited actions (list session, etc.)
  return authPOST(request);
}
