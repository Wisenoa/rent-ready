"use server";

import { recordProductEvent } from "@/lib/analytics/product-events";
import { registrationSchema } from "@/lib/validations/registration";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "./property-actions";
import { registerErrorMessage } from "@/lib/register-error";

export interface RegisterResult extends ActionResult {
  userId?: string;
}


/**
 * Register a new user via better-auth (handles password hashing internally)
 * Stripe creates the customer only when checkout is requested.
 */
export async function registerWithStripeCustomer(input: {
  firstName: string; lastName: string; email: string; password: string;
}): Promise<RegisterResult> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  const { firstName, lastName, email, password } = parsed.data;
  try {
    // Check if user already exists via better-auth
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Un compte avec cet email existe déjà." };
    }

    // Use better-auth's server-side signUp to properly hash the password
    // The server-side endpoint is `signUpEmail`, not `signUp.email`. `signUp` is
    // undefined on the server API, so every registration threw
    // "Cannot read properties of undefined (reading 'email')" and the form showed
    // nothing. Verified in the browser against a running server, and against this
    // version's own route types.
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
        // The app's own user model carries these; Better Auth's body type is a
        // ZodRecord intersection, so additional fields are accepted.
        firstName,
        lastName,
      },
    });

    if (result.user) {
      await recordProductEvent(result.user.id, "signup_completed");
      return { success: true, userId: result.user.id };
    }

    return { success: false, error: "La création du compte n’a pas abouti. Réessayez." };
  } catch (error: unknown) {
    // The full error stays in the server log.
    console.error("[register] Error:", error);
    return { success: false, error: registerErrorMessage(error) };
  }
}
