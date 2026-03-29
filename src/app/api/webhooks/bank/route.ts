import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Open Banking Webhook Handler
 *
 * Prepared for Bridge API / Powens integration under DSP2.
 * Receives webhook events for:
 * - New transactions detected
 * - Account sync completed
 * - Connection status changes
 *
 * The actual provider integration is deferred to a later phase,
 * but the data architecture and event logging is ready.
 */

interface BankWebhookPayload {
  event_type: string;
  item_id?: string;
  account_id?: string;
  transaction_id?: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  const webhookSecret = request.headers.get("x-webhook-secret");

  if (webhookSecret !== process.env.BANK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: BankWebhookPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Log the webhook event
  try {
    const connection = payload.item_id
      ? await prisma.bankConnection.findFirst({
          where: { providerItemId: payload.item_id },
        })
      : null;

    await prisma.bankWebhookEvent.create({
      data: {
        connectionId: connection?.id || null,
        provider: "bridge", // or detect from headers
        eventType: payload.event_type,
        payload: JSON.parse(JSON.stringify(payload)),
      },
    });

    // Process based on event type
    switch (payload.event_type) {
      case "transaction.created":
        // Future: Auto-match incoming transactions to leases
        // await matchBankTransaction(payload);
        break;

      case "item.refreshed":
        // Future: Update connection sync status
        if (connection) {
          await prisma.bankConnection.update({
            where: { id: connection.id },
            data: { lastSyncAt: new Date() },
          });
        }
        break;

      case "item.error":
        // Future: Mark connection as errored
        if (connection) {
          await prisma.bankConnection.update({
            where: { id: connection.id },
            data: { status: "ERROR" },
          });
        }
        break;

      default:
        break;
    }
  } catch (err) {
    console.error("Error processing bank webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
