import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getStripe, PLANS } from "@/lib/stripe";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";
import type { PlanId } from "@/lib/stripe";

/**
 * POST /api/stripe/subscription/checkout
 *
 * Creates a Stripe Checkout session for subscription plans.
 * Supports all 3 tiers: starter, pro, business
 * Supports both monthly and annual billing.
 *
 * Rate limited: 20 checkouts/min per authenticated user.
 *
 * Body: { planId?: "starter" | "pro" | "business", interval?: "month" | "year" }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 20 checkout sessions/min per authenticated user
    const result = await rateLimit(session.user.id, { limit: 20, window: 60 });
    if (!result.success) {
      const res = NextResponse.json(
        { error: "Too many checkout attempts. Please wait before trying again." },
        { status: 429 }
      );
      setRateLimitHeaders(res, result);
      return res;
    }

    const body = await request.json().catch(() => ({}));
    const planId: PlanId = body.planId ?? "pro";
    const interval: "month" | "year" = body.interval ?? "month";

    // Validate planId
    if (!["starter", "pro", "business"].includes(planId)) {
      return NextResponse.json({ error: "Invalid planId" }, { status: 400 });
    }
    if (!["month", "year"].includes(interval)) {
      return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
    }

    const plans = interval === "year" ? PLANS.ANNUAL : PLANS.MONTHLY;
    const plan = plans[planId];
    const priceId = process.env[plan.priceIdEnv];

    if (!priceId) {
      return NextResponse.json(
        { error: "Ce plan n'est pas configuré. Contactez le support." },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Get or create Stripe customer
    let customerId = session.user.stripeCustomerId;
    if (!customerId) {
      const stripe = getStripe();
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?subscription_success=true&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?cancelled=true`,
      metadata: { userId: session.user.id, planId, interval },
      subscription_data: {
        metadata: { userId: session.user.id, planId, interval },
        trial_period_days: 14,
      },
      locale: "fr",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    console.error("POST /api/stripe/subscription/checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
