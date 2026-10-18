import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PREMIUM_PRODUCTS, getStripe } from "@/lib/stripe";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout session for one-time payments
 * (premium templates, tools, etc.)
 *
 * Rate limited: 20 checkouts/min per authenticated user (prevent card-testing attacks).
 *
 * Body: { priceId: string; productName: string; productDescription?: string; metadata?: Record<string, string> }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 20 checkout sessions/min per authenticated user (prevent card-testing attacks)
    const result = await rateLimit(session.user.id, { limit: 20, window: 60 });

    if (!result.success) {
      const res = NextResponse.json(
        { error: "Too many checkout attempts. Please wait before trying again." },
        { status: 429 }
      );
      setRateLimitHeaders(res, result);
      return res;
    }

    const parsed = z.object({
      priceId: z.string().min(1),
      productName: z.string().max(200),
      productDescription: z.string().max(1000).optional(),
      metadata: z.strictObject({ productType: z.enum(["premium_template", "quittance", "bail_template"]).optional(), productId: z.string().max(100).optional() }).default({}),
    }).safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Produit invalide" }, { status: 400 });
    const { priceId, metadata } = parsed.data;
    const product = Object.entries(PREMIUM_PRODUCTS).find(([, value]) => process.env[value.priceIdEnv] === priceId);
    if (!product) return NextResponse.json({ error: "Prix non disponible" }, { status: 400 });

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: { userId: session.user.id },
      }, { idempotencyKey: `customer:${session.user.id}` });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard?payment_cancelled=true`,
      metadata: {
        productId: metadata.productId ?? "",
        productType: product[0].toLowerCase(),
        userId: session.user.id,
      },
      locale: "fr",
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    console.error("POST /api/stripe/checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
