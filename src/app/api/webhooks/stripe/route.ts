import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: skip if we've already processed this event
  // Use Stripe's event ID as the idempotency key stored in the DB
  try {
    const existing = await prisma.stripeWebhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });
    if (existing) {
      // Already processed — Stripe webhooks can be retried; safe to return 200
      return NextResponse.json({ received: true, status: "already_processed" });
    }
  } catch {
    // If the table doesn't exist yet, proceed (migration may be pending)
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) break;

        // ── Subscription checkout (recurring) ───────────────────────────
        if (session.mode === "subscription" && session.customer && session.subscription) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: "ACTIVE",
            },
          });
          console.log(`[Stripe] User ${userId} subscribed (subscription: ${session.subscription})`);
          break;
        }

        // ── One-time payment checkout (premium templates / tools) ─────────
        if (session.mode === "payment" && session.customer && session.payment_intent) {
          const productType = session.metadata?.productType ?? "premium_template";
          const productId = session.metadata?.productId ?? null;

          // ── Rent payment from tenant portal ─────────────────────────────
          if (session.metadata?.type === "rent_payment" && session.metadata?.transactionId) {
            const transactionId = session.metadata.transactionId;
            const tenantId = session.metadata.tenantId;

            try {
              const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
              if (tx && tx.status !== "PAID") {
                await prisma.transaction.update({
                  where: { id: transactionId },
                  data: {
                    status: "PAID",
                    paidAt: new Date(),
                    receiptType: "QUITTANCE",
                    receiptNumber: `Q-${Date.now().toString(36).toUpperCase()}`,
                  },
                });

                // Create receipt number shorthand
                await prisma.transaction.update({
                  where: { id: transactionId },
                  data: {
                    receiptNumber: `Q-${tx.id.slice(-6).toUpperCase()}`,
                  },
                });

                console.log(
                  `[Stripe] Rent payment recorded: tx=${transactionId}, ` +
                    `tenant=${tenantId}, intent=${session.payment_intent}`
                );
              }
            } catch (err) {
              console.error("[Stripe] Failed to record rent payment:", err);
            }
            break;
          }

          try {
            await prisma.userProductPurchase.upsert({
              where: { stripePaymentIntentId: session.payment_intent as string },
              create: {
                userId,
                productType,
                productId,
                stripePaymentIntentId: session.payment_intent as string,
                stripeCheckoutSessionId: session.id,
                amountTotal: session.amount_total ?? 0,
                currency: session.currency ?? "eur",
              },
              update: {},
            });
            console.log(
              `[Stripe] One-time purchase recorded for user ${userId}: ` +
                `${productType}${productId ? ` (${productId})` : ""} — ` +
                `intent: ${session.payment_intent}`
            );
          } catch (err) {
            console.error("[Stripe] Failed to record UserProductPurchase:", err);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        // Primary: userId stored in subscription metadata
        let userId = subscription.metadata?.userId;
        // Fallback: look up user by stripeSubscriptionId in case metadata was not set
        if (!userId) {
          const user = await prisma.user.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          });
          userId = user?.id;
        }
        if (userId) {
          const statusMap: Record<string, "ACTIVE" | "PAST_DUE" | "CANCELLED" | "TRIAL" | "EXPIRED"> = {
            active: "ACTIVE",
            past_due: "PAST_DUE",
            canceled: "CANCELLED",
            unpaid: "PAST_DUE",
            trialing: "TRIAL",
            incomplete: "PAST_DUE",
            incomplete_expired: "EXPIRED",
            paused: "EXPIRED",
          };
          const newStatus = statusMap[subscription.status] ?? "ACTIVE";
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionStatus: newStatus },
          });
          // Sync organization-level subscription status for org-owned resources
          // Find all organizations where this user is a member and update their status
          const orgMemberships = await prisma.organizationMember.findMany({
            where: { userId },
            select: { organizationId: true },
          });
          const orgIds = orgMemberships.map((m) => m.organizationId);
          if (orgIds.length > 0) {
            await prisma.organization.updateMany({
              where: { id: { in: orgIds } },
              data: { subscriptionStatus: newStatus },
            });
          }
          console.log(`[Stripe] User ${userId} subscription → ${newStatus}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: "CANCELLED",
              stripeSubscriptionId: null,
            },
          });
          console.log(`[Stripe] User ${userId} subscription cancelled`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionDetails = invoice.parent?.subscription_details;
        const subscriptionId =
          typeof subscriptionDetails?.subscription === "string"
            ? subscriptionDetails.subscription
            : subscriptionDetails?.subscription?.id;
        if (subscriptionId) {
          const user = await prisma.user.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
          });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { subscriptionStatus: "PAST_DUE" },
            });
            console.log(`[Stripe] User ${user.id} payment failed → PAST_DUE`);
          }
        }
        break;
      }

      default:
        break;
    }

    // Record processed event for idempotency
    try {
      await prisma.stripeWebhookEvent.upsert({
        where: { stripeEventId: event.id },
        create: { stripeEventId: event.id, eventType: event.type },
        update: {},
      });
    } catch {
      // Non-fatal: if the table doesn't exist, log and continue
      console.warn("[Stripe] Could not record webhook event — table may need migration");
    }
  } catch (err) {
    console.error(`Error processing Stripe event ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
