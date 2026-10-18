import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { processStripeEvent } from "@/lib/services/stripe-webhooks";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  try {
    const status = await processStripeEvent(event);
    return NextResponse.json({ received: true, status });
  } catch (error) {
    console.error("[stripe-webhook] processing failed", { eventId: event.id, eventType: event.type, error });
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
