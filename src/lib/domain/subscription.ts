import type { SubscriptionStatus } from "@prisma/client";

export const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000;

export function trialEndAtCreation(now = new Date()): Date {
  return new Date(now.getTime() + TRIAL_DURATION_MS);
}

export function isTrialExpired(trialEndsAt: Date | null, now = new Date()): boolean {
  // Legacy accounts retain their rights pending an explicit policy decision.
  // New accounts always receive a date in Better Auth's creation hook.
  return trialEndsAt !== null && trialEndsAt.getTime() <= now.getTime();
}

export function isAccessBlocked(status: string, trialEndsAt: Date | null, now = new Date()): boolean {
  if (status === "ACTIVE") return false;
  if (status === "TRIAL") {
    return trialEndsAt !== null && (!Number.isFinite(trialEndsAt.getTime()) || isTrialExpired(trialEndsAt, now));
  }
  return true;
}

export function stripeSubscriptionStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active": return "ACTIVE";
    case "trialing": return "TRIAL";
    case "past_due":
    case "unpaid":
    case "incomplete": return "PAST_DUE";
    case "canceled": return "CANCELLED";
    default: return "EXPIRED";
  }
}
