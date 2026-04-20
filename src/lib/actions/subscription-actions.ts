"use server";

import { getCurrentUser } from "@/lib/auth";
import { createCheckoutSession, createPortalSession } from "@/lib/stripe";
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
 * Create a Stripe Checkout session for subscription.
 */
export async function createSubscriptionCheckout(): Promise<ActionResult & { data?: { url: string } }> {
  try {
    const user = await getCurrentUser();

    if (!process.env.STRIPE_PRICE_ID_MONTHLY && !process.env.STRIPE_PRICE_ID) {
      return { success: false, error: "Configuration Stripe incomplète." };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await createCheckoutSession({
      customerId: user.stripeCustomerId ?? undefined,
      customerEmail: user.stripeCustomerId ? undefined : user.email,
      priceId: process.env.STRIPE_PRICE_ID_MONTHLY ?? process.env.STRIPE_PRICE_ID!,
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
