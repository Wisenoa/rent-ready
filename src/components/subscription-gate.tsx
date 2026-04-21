/**
 * SubscriptionGate — server component
 *
 * Protects dashboard routes from users whose subscription has expired,
 * been cancelled, or is past-due.
 *
 * Users with ACTIVE or valid TRIAL are let through.
 * All other states redirect to /billing with a paywall message.
 */
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED";

const BLOCKED_STATUSES: SubscriptionStatus[] = [
  "PAST_DUE",
  "CANCELLED",
  "EXPIRED",
];

function isTrialExpired(trialEndsAt: Date | null): boolean {
  if (!trialEndsAt) return true; // treat null as expired
  return trialEndsAt < new Date();
}

/**
 * Returns true if the subscription status blocks dashboard access.
 * TRIAL users are only blocked once their trial has expired.
 */
function isAccessBlocked(
  status: SubscriptionStatus,
  trialEndsAt: Date | null
): boolean {
  if (BLOCKED_STATUSES.includes(status)) return true;
  if (status === "TRIAL" && isTrialExpired(trialEndsAt)) return true;
  return false;
}

/**
 * Server-side subscription gate.
 * Call this at the top of dashboard page Server Components.
 *
 * Usage in a page:
 *   import { SubscriptionGate } from "@/components/subscription-gate";
 *   export default async function MyPage() {
 *     await SubscriptionGate();
 *     return <div>...</div>;
 *   }
 */
export async function SubscriptionGate(): Promise<void> {
  try {
    const session = await auth.api.getSession();

    if (!session?.user?.id) {
      // Not logged in — let NextAuth handle redirect
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionStatus: true,
        trialEndsAt: true,
      },
    });

    if (!user) return;

    const status = (user.subscriptionStatus ?? "TRIAL") as SubscriptionStatus;

    if (isAccessBlocked(status, user.trialEndsAt)) {
      redirect(
        "/billing?paywall=expired&status=" +
          encodeURIComponent(status)
      );
    }
  } catch (error: unknown) {
    // Let Next.js redirects propagate
    if (
      error instanceof Error &&
      error.message === "NEXT_REDIRECT"
    ) {
      throw error;
    }
    // Non-redirect errors: log and let the user through (don't hard-block on errors)
    console.error("[SubscriptionGate] Error checking subscription:", error);
  }
}
