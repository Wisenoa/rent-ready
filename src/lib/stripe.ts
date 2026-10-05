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
  /**
   * Starter exists because the pricing page sells it. Before this entry, `PLANS`
   * held Pro only, so there was no way to express "the Starter plan" anywhere:
   * `createSubscriptionCheckout` picked `MONTHLY` or `ANNUAL` by interval, and
   * both were Pro. The Starter CTA therefore created a Pro checkout — a visitor
   * who clicked "9 €/mois" was charged 15 €/mois, and "89 €/an" was charged
   * 149 €/an. On /pricing and the homepage, the two most visited commercial
   * pages.
   *
   * The amounts below MUST equal what the pricing page promises, for the reason
   * the ANNUAL entry already documents: checkout charges from the Stripe Price,
   * so the two can silently disagree.
   */
  STARTER_MONTHLY: {
    name: "RentReady Starter",
    price: 900, // 9.00 € in cents
    currency: "eur",
    interval: "month" as const,
    priceIdEnv: "STRIPE_STARTER_MONTHLY_PRICE_ID",
    description: "Pour commencer à gérer ses loyers",
    features: ["Jusqu'à 3 biens", "Quittances de loyer", "Suivi des échéances"],
  },
  STARTER_ANNUAL: {
    name: "RentReady Starter Annuel",
    price: 8900, // 89 €/an
    currency: "eur",
    interval: "year" as const,
    priceIdEnv: "STRIPE_STARTER_ANNUAL_PRICE_ID",
    description: "Facturé annuellement",
    pricePerMonth: 742,
    features: ["Jusqu'à 3 biens", "Quittances de loyer", "Suivi des échéances"],
  },
  MONTHLY: {
    name: "RentReady Pro",
    price: 1500, // 15.00 € in cents
    currency: "eur",
    interval: "month" as const,
    priceIdEnv: "STRIPE_PRO_MONTHLY_PRICE_ID",
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
  ANNUAL: {
    name: "RentReady Pro Annuel",
    // 149 €/an — 2 mois offerts sur 12 × 15 €. This matched the pricing page.
    // It read 144,00 € before, which is what happens when the number is edited
    // on the marketing page and not here. Checkout never charges from this
    // field (it uses `priceId` from the environment); the real amount must
    // equal what the pricing page promises or the landlord is charged a
    // different sum than the one they agreed to.
    price: 14900,
    currency: "eur",
    interval: "year" as const,
    priceIdEnv: "STRIPE_PRO_ANNUAL_PRICE_ID",
    description: "Gestion locative complète — facturé annuellement, 2 mois offerts",
    pricePerMonth: 1241, // effective monthly cost in cents (14900/12)
    savings: "2 mois offerts",
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

/**
 * Which plan a checkout is for, by the id the pricing page advertises.
 *
 * "starter" / "pro" rather than the amount: the amount is money, and money is
 * not a good way to say which product was chosen.
 */
export type PlanKey = "starter" | "pro";

/** Resolve a plan key and its interval to the entry that names the right price. */
export function resolvePlan(key: PlanKey, interval: "month" | "year") {
  if (key === "starter") {
    return interval === "year" ? PLANS.STARTER_ANNUAL : PLANS.STARTER_MONTHLY;
  }
  return interval === "year" ? PLANS.ANNUAL : PLANS.MONTHLY;
}

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
