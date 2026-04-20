import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return _stripe;
}

/** @deprecated Use getStripe() for lazy initialization */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// ─── Subscription Plans ────────────────────────────────────────────────────────

export const PLANS = {
  MONTHLY: {
    name: "RentReady Pro",
    price: 1500, // 15.00 € in cents
    currency: "eur",
    interval: "month" as const,
    description: "Gestion locative complète pour les propriétaires bailleurs",
    features: [
      "Jusqu'à 10 biens",
      "Quittances automatiques illimitées",
      "Assistant IA pour extraction de baux",
      "Calcul automatique des révisions IRL",
      "Export comptable",
      "Support prioritaire",
    ],
  },
} as const;

// ─── One-Time Payment Products ─────────────────────────────────────────────────
// These correspond to Stripe Products with pricing type = "one-time".
// Add price IDs to .env when created in the Stripe Dashboard.

export const PREMIUM_PRODUCTS = {
  QUITTANCE: {
    name: "Quittance de loyer Premium",
    priceIdEnv: "STRIPE_PRICE_ID_QUITTANCE",
    description: "Accès illimité aux quittances de loyer PDF conformes",
    // priceAmount is read from env at runtime via getPremiumProductPrice()
  },
  BAIL_TEMPLATE: {
    name: "Modèle de bail premium",
    priceIdEnv: "STRIPE_PRICE_ID_BAIL_TEMPLATE",
    description: "Accès à tous les modèles de bail avanzada avec annotations",
  },
  PREMIUM_TEMPLATE: {
    name: "Pack templates premium",
    priceIdEnv: "STRIPE_PRICE_ID_PREMIUM_TEMPLATE",
    description: "Accès au pack complet de templates contractuels premium",
  },
} as const;

/** Price IDs for one-time products — read from env at runtime */
export function getPremiumProductPriceId(productKey: keyof typeof PREMIUM_PRODUCTS): string | null {
  const envVar = PREMIUM_PRODUCTS[productKey].priceIdEnv;
  return process.env[envVar] ?? null;
}

// ─── Helper Functions ───

/**
 * Create a Stripe Checkout session for a new subscription
 */
export async function createCheckoutSession(params: {
  customerId?: string;
  customerEmail?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  userId: string;
}) {
  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: params.customerId || undefined,
    customer_email: params.customerId ? undefined : params.customerEmail,
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { userId: params.userId },
    subscription_data: {
      metadata: { userId: params.userId },
      trial_period_days: 14,
    },
    locale: "fr",
    allow_promotion_codes: true,
  });
}

/**
 * Create a Stripe Customer Portal session for managing subscriptions
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

/**
 * Get a customer's active subscription
 */
export async function getActiveSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });
  return subscriptions.data[0] || null;
}
