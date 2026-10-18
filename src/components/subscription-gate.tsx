import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { isAccessBlocked } from "@/lib/domain/subscription";

export { isAccessBlocked, isTrialExpired } from "@/lib/domain/subscription";
export type { SubscriptionStatus } from "@prisma/client";

/** Errors propagate to Next's error boundary; redirects are outside any catch. */
export async function SubscriptionGate(): Promise<void> {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionStatus: true, trialEndsAt: true },
  });
  if (!user) redirect("/login");
  // Overwritten by middleware. Referrers/query strings cannot bypass the gate.
  // Billing must remain reachable to subscribe.
  if (reqHeaders.get("x-pathname") === "/billing") return;
  if (isAccessBlocked(user.subscriptionStatus, user.trialEndsAt)) {
    redirect(`/billing?paywall=expired&status=${encodeURIComponent(user.subscriptionStatus)}`);
  }
}
