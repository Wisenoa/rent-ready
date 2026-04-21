import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { getStripe } from "@/lib/stripe";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";

/**
 * POST /api/stripe/portal
 *
 * Creates a Stripe customer portal session for managing
 * subscriptions and billing details.
 *
 * Rate limited: 10 portal sessions/min per user (prevent portal enumeration).
 *
 * Body: { returnUrl?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 10 portal sessions/min per user (prevent portal enumeration)
    const result = await rateLimit(session.user.id, { limit: 10, window: 60 });

    if (!result.success) {
      const res = NextResponse.json(
        { error: "Too many portal requests. Please wait before trying again." },
        { status: 429 }
      );
      setRateLimitHeaders(res, result);
      return res;
    }

    const user = session.user;

    if (!user.stripeCustomerId) {
      const res = NextResponse.json(
        { error: "No Stripe customer found. Please subscribe first." },
        { status: 400 }
      );
      setRateLimitHeaders(res, result);
      return res;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    const res = NextResponse.json({ url: portalSession.url });
    setRateLimitHeaders(res, result);
    return res;
  } catch (error) {
    console.error("POST /api/stripe/portal error:", error);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
