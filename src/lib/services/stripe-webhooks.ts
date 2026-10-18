import type Stripe from "stripe";
import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { stripeSubscriptionStatus } from "@/lib/domain/subscription";
import { recordRentPayment } from "@/lib/services/rent-payments";

function idOf(value: string | { id: string } | null | undefined): string | null {
  return typeof value === "string" ? value : value?.id ?? null;
}

async function syncSubscription(tx: Prisma.TransactionClient, subscriptionId: string, metadataUserId?: string) {
  const stripe = getStripe();
  const initial = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = metadataUserId || initial.metadata.userId;
  const user = await tx.user.findFirst({
    where: userId ? { id: userId } : { stripeSubscriptionId: subscriptionId },
  });
  if (!user) throw new Error("Subscription owner not found");

  // Serialize by landlord, then read CURRENT provider state. Reordered events
  // cannot restore an older state. A provider failure rolls back the event too.
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${user.id}, 0))`;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = idOf(subscription.customer);
  if (!customerId || (user.stripeCustomerId && user.stripeCustomerId !== customerId)) {
    throw new Error("Subscription customer mismatch");
  }
  const current = await tx.user.findUniqueOrThrow({ where: { id: user.id } });
  // A late event about a previous subscription must not cancel its replacement.
  if (current.stripeSubscriptionId && current.stripeSubscriptionId !== subscriptionId) return;
  await tx.user.update({
    where: { id: user.id },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.status === "canceled" ? null : subscriptionId,
      subscriptionStatus: stripeSubscriptionStatus(subscription.status),
      // The account trial is immutable; Stripe cannot extend it.
    },
  });
}

async function checkoutPaid(tx: Prisma.TransactionClient, session: Stripe.Checkout.Session) {
  if (session.mode === "subscription") {
    const subscriptionId = idOf(session.subscription);
    if (!subscriptionId) throw new Error("Missing subscription");
    await syncSubscription(tx, subscriptionId, session.metadata?.userId);
    return;
  }
  // completed alone is not proof of payment (asynchronous methods).
  if (session.mode !== "payment" || session.payment_status !== "paid") return;
  const intentId = idOf(session.payment_intent);
  if (!intentId || session.currency !== "eur" || !Number.isSafeInteger(session.amount_total) || session.amount_total! <= 0) {
    throw new Error("Invalid payment evidence");
  }
  if (session.metadata?.type === "rent_payment") {
    const transactionId = session.metadata.transactionId;
    const tenantId = session.metadata.tenantId;
    if (!transactionId || !tenantId) throw new Error("Missing rent payment context");
    const reference = `stripe:${intentId}`;
    if (await tx.transaction.findUnique({ where: { bankTransactionId: reference } })) return;
    const period = await tx.transaction.findFirst({
      where: { id: transactionId, paidAt: null, lease: { tenantId } },
    });
    if (!period) throw new Error("Rent period no longer collectable; manual reconciliation required");
    const amount = new Decimal(session.amount_total!).div(100);
    const result = await recordRentPayment({
      userId: period.userId,
      leaseId: period.leaseId,
      duePeriodId: period.id,
      amount,
      paidAt: new Date(),
      bankTransactionId: reference,
    }, tx);
    if (!result.ok) throw new Error(`Rent payment refused: ${result.code}`);
    return;
  }
  const userId = session.metadata?.userId;
  if (!userId) throw new Error("Missing purchase owner");
  await tx.userProductPurchase.upsert({
    where: { stripePaymentIntentId: intentId },
    create: {
      userId,
      productType: session.metadata?.productType ?? "premium_template",
      productId: session.metadata?.productId ?? null,
      stripePaymentIntentId: intentId,
      stripeCheckoutSessionId: session.id,
      amountTotal: session.amount_total!,
      currency: session.currency,
    },
    update: {},
  });
}

/** Event claim and domain writes commit together, or all roll back for retry. */
export async function processStripeEvent(event: Stripe.Event): Promise<"processed" | "already_processed"> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${event.id}, 1))`;
    if (await tx.stripeWebhookEvent.findUnique({ where: { stripeEventId: event.id } })) return "already_processed";
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await checkoutPaid(tx, event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(tx, event.data.object.id, event.data.object.metadata.userId);
        break;
      case "invoice.payment_failed":
      case "invoice.paid": {
        const subscriptionId = idOf(event.data.object.parent?.subscription_details?.subscription);
        if (subscriptionId) await syncSubscription(tx, subscriptionId);
        break;
      }
    }
    await tx.stripeWebhookEvent.create({ data: { stripeEventId: event.id, eventType: event.type } });
    return "processed";
  }, { timeout: 30_000 });
}
