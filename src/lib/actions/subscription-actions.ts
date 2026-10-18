"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  resolvePlan,
  type PlanKey,
  createCheckoutSession,
  createPortalSession,
  getStripe,
  TrialCheckoutUnavailableError,
} from "@/lib/stripe";
import type { ActionResult } from "./property-actions";
import { z } from "zod";

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
    const choice = z.object({ plan: z.enum(["starter", "pro"]), interval: z.enum(["month", "year"]) }).safeParse({ plan, interval });
    if (!choice.success) return { success: false, error: "Offre invalide." };
    if (user.stripeSubscriptionId) {
      return { success: false, error: "Gérez votre abonnement existant depuis le portail de facturation." };
    }
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
      trialEndsAt: user.trialEndsAt,
    });

    if (!session.url) {
      return { success: false, error: "Impossible de créer la session de paiement." };
    }

    return { success: true, data: { url: session.url } };
  } catch (error) {
    if (error instanceof TrialCheckoutUnavailableError) return { success: false, error: error.message };
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

    const product = z.object({ productId: z.string().max(100), productType: z.enum(["premium_template", "quittance", "bail_template"]) }).safeParse({ productId, productType });
    if (!product.success) return { success: false, error: "Produit invalide." };
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer: user.stripeCustomerId ?? undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PREMIUM_TEMPLATE, quantity: 1 }],
      success_url: `${appUrl}/billing?purchase_success=true`,
      cancel_url: `${appUrl}/billing?purchase_cancelled=true`,
      metadata: { userId: user.id, productType: product.data.productType, productId: product.data.productId },
      locale: "fr",
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
