import { prisma } from "@/lib/prisma";
import { isAccessBlocked } from "@/lib/domain/subscription";

export class SubscriptionRequiredError extends Error {
  constructor() {
    super("Votre abonnement ne permet pas cette opération. Consultez la facturation.");
    this.name = "SubscriptionRequiredError";
  }
}

/** Authentication must already have established this ID. Never pass browser input. */
export async function assertSubscriptionAccess(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true, trialEndsAt: true },
  });
  if (!user || isAccessBlocked(user.subscriptionStatus, user.trialEndsAt)) {
    throw new SubscriptionRequiredError();
  }
}
