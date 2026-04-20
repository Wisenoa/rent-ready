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

          // Store the one-time purchase in StripeWebhookEvent for record-keeping
          // (the primary side-effect: unlock the product for the user)
          // We record it with a composite key so we can query it later if needed.
          console.log(
            `[Stripe] One-time payment completed for user ${userId}: ` +
            `${productType}${productId ? ` (${productId})` : ""} — ` +
            `intent: ${session.payment_intent}`
          );

          // TODO (post-mvp): here you would call a service to:
          //   1. Create a UserProductPurchase / UserUnlock record
          //   2. Send a confirmation email with the download link
          //   3. Log analytics event
          //
          // Example (uncomment when UserProductPurchase model exists):
          // await prisma.userProductPurchase.create({
          //   data: {
          //     userId,
          //     productType,
          //     productId,
          //     stripePaymentIntentId: session.payment_intent as string,
          //     amountTotal: session.amount_total ?? 0,
          //     currency: session.currency ?? "eur",
          //   },
          // });

          // For now, log the purchase clearly so operators can manually fulfill
          console.log(
            `[Stripe] MANUAL FULFILLMENT NEEDED: user=${userId}, ` +
            `productType=${productType}, productId=${productId}, ` +
            `amount=${session.amount_total}, currency=${session.currency}`
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
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
