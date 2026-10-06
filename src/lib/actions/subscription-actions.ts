"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  resolvePlan,
  type PlanKey,
  createCheckoutSession,
  createPortalSession,
} from "@/lib/stripe";
import type { ActionResult } from "./property-actions";

/**
 * Check if the current user has an active subscription (isPro).
 */
export async function checkSubscriptionStatus(): Promise<{
  isPro: boolean;
  status: string;
  trialEndsAt: Date | null;
}> {
  const user = await getCurrentUser();

  const isPro =
    user.subscriptionStatus === "ACTIVE" ||
    (user.subscriptionStatus === "TRIAL" &&
      user.trialEndsAt !== null &&
      user.trialEndsAt > new Date());

  return {
    isPro,
    status: user.subscriptionStatus,
    trialEndsAt: user.trialEndsAt,
  };
}

/**
 * Create a Stripe Checkout session for a subscription.
 *
 * @param plan  which plan was clicked. This is a parameter and not a detail
 *              derived from the interval because both Starter and Pro have a
 *              monthly and an annual price, and only one of the four was
 *              reachable: `PLANS` held Pro alone, so a Starter click created a Pro
 *              checkout and the landlord was charged 15 €/mois for the 9 €/mois
 *              they agreed to.
 * @param interval "month" | "year"
 */
export async function createSubscriptionCheckout(
  plan: PlanKey = "pro",
  interval: "month" | "year" = "month"
): Promise<ActionResult & { data?: { url: string } }> {
  try {
    const user = await getCurrentUser();
    const selected = resolvePlan(plan, interval);
    const priceId = process.env[selected.priceIdEnv];

    if (!priceId) {
      // Refuse the sale. Falling back to another plan here would be the exact
      // defect this parameter exists to remove: a visitor who agreed to one sum
      // must never be presented a checkout for another. Better no sale than a
      // wrong one.
      console.error(
        `[subscription] ${selected.priceIdEnv} absent — refusing the ${plan}/${interval} checkout rather than substituting another plan`
      );
      return {
        success: false,
        error: `Le plan ${selected.name} n'est pas encore disponible. Écrivez-nous, nous l'activons.`,
      };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await createCheckoutSession({
      customerId: user.stripeCustomerId ?? undefined,
      customerEmail: user.stripeCustomerId ? undefined : user.email,
      priceId,
      successUrl: `${appUrl}/billing?success=true`,
      cancelUrl: `${appUrl}/billing?cancelled=true`,
      userId: user.id,
    });

    if (!session.url) {
      return { success: false, error: "Impossible de créer la session de paiement." };
    }

    return { success: true, data: { url: session.url } };
  } catch (error) {
    console.error("createSubscriptionCheckout error:", error);
    return { success: false, error: "Erreur lors de la création du paiement." };
  }
}

/**
 * Create a Stripe Checkout session for a one-time premium product purchase.
 * Used for: premium templates, premium tools, etc.
 */
export async function createPremiumTemplateCheckout({
  productId,
  productType,
  productName,
  productDescription,
}: {
  productId: string;
  productType: string;
  productName: string;
  productDescription?: string;
}): Promise<ActionResult & { data?: { url: string } }> {
  try {
    const user = await getCurrentUser();

    if (!process.env.STRIPE_PRICE_ID_PREMIUM_TEMPLATE) {
      return { success: false, error: "Configuration Stripe incomplète." };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await createCheckoutSession({
      customerId: user.stripeCustomerId ?? undefined,
      customerEmail: user.stripeCustomerId ? undefined : user.email,
      priceId: process.env.STRIPE_PRICE_ID_PREMIUM_TEMPLATE!,
      successUrl: `${appUrl}/dashboard?purchase_success=true&productType=${productType}`,
      cancelUrl: `${appUrl}/dashboard?purchase_cancelled=true`,
      userId: user.id,
    });

    if (!session.url) {
      return { success: false, error: "Impossible de créer la session de paiement." };
    }

    return { success: true, data: { url: session.url } };
  } catch (error) {
    console.error("createPremiumTemplateCheckout error:", error);
    return { success: false, error: "Erreur lors du paiement." };
  }
}

/**
 * Create a Stripe Customer Portal session for managing subscription.
 */
export async function createBillingPortal(): Promise<ActionResult & { data?: { url: string } }> {
  try {
    const user = await getCurrentUser();

    if (!user.stripeCustomerId) {
      return { success: false, error: "Aucun abonnement actif." };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await createPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${appUrl}/billing`,
    });

    return { success: true, data: { url: session.url } };
  } catch (error) {
    console.error("createBillingPortal error:", error);
    return { success: false, error: "Erreur lors de l'accès au portail de facturation." };
  }
}
