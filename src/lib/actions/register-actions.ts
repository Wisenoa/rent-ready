"use server";

import { auth } from "@/lib/auth-server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "./property-actions";

export interface RegisterResult extends ActionResult {
  userId?: string;
}

/**
 * Register a new user via better-auth (handles password hashing internally)
 * and create a Stripe customer in the background (best-effort).
 */
export async function registerWithStripeCustomer({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<RegisterResult> {
  try {
    // Check if user already exists via better-auth
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Un compte avec cet email existe déjà." };
    }

    // Use better-auth's server-side signUp to properly hash the password
    const result = await auth.api.signUp.email({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
      },
    });

    if (result.user) {
      // Create Stripe customer in background (best-effort — don't block signup)
      createStripeCustomerBackground(result.user.id, email, `${firstName} ${lastName}`);
    }

    return { success: true, userId: result.user?.id };
  } catch (error: any) {
    console.error("[register] Error:", error);
    const message = error?.message ?? "Erreur lors de la création du compte.";
    return { success: false, error: message };
  }
}

/**
 * Create Stripe customer asynchronously — fire and forget.
 * If Stripe fails, the user can still use the app (no Stripe features).
 */
async function createStripeCustomerBackground(
  userId: string,
  email: string,
  name: string
) {
  try {
    const stripe = getStripe();
    const stripeCustomer = await stripe.customers.create({
      email,
      name,
      metadata: { rentReadyUserId: userId, source: "rent_ready_signup" },
    });

    // Update user with Stripe customer ID
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: stripeCustomer.id,
        subscriptionStatus: "TRIAL",
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      },
    });

    console.log(`[Stripe] Customer created for user ${userId}: ${stripeCustomer.id}`);
  } catch (err) {
    // Best-effort — log but don't throw
    console.error(`[Stripe] Customer creation failed for user ${userId}:`, err);
  }
}
