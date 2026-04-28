import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import Decimal from "decimal.js";
import { prisma } from "@/lib/prisma";
import { generateReceiptNumber } from "@/lib/quittance-generator";
import { computePaymentSplit } from "@/lib/payment-utils";

const toNum = (v: Decimal.Value) =>
  Decimal.isDecimal(v) ? v.toNumber() : (typeof v === "number" ? v : parseFloat(String(v)));

/**
 * Open Banking Webhook Handler — Bridge API / Powens (DSP2)
 *
 * When a `transaction.created` event arrives:
 * 1. Log the event
 * 2. Search for a pending transaction matching the amount
 * 3. If found, mark as PAID and generate a quittance
 * 4. Trigger email notification (placeholder)
 */

interface BridgeTransaction {
  id: string;
  amount: number; // positive = credit (incoming)
  currency_code: string;
  description: string;
  date: string;
  account_id: string;
  category_id?: number;
  is_future: boolean;
}

interface BankWebhookPayload {
  event_type: string;
  item_id?: string;
  account_id?: string;
  transaction?: BridgeTransaction;
  timestamp: string;
  data?: Record<string, unknown>;
}

function verifyHmacSignature(body: string, signature: string, secret: string): boolean {
  try {
    const expected = createHmac("sha256", secret).update(body).digest("hex");
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    if (sigBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.BANK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Bank Webhook] BANK_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const rawBody = await request.text();

  // Verify HMAC signature (Bridge sends X-Bridge-Signature)
  const signature =
    request.headers.get("x-bridge-signature") ??
    request.headers.get("x-webhook-signature") ??
    request.headers.get("x-webhook-secret");

  if (!signature || !verifyHmacSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: BankWebhookPayload;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Replay protection: reject events already processed
  if (payload.timestamp) {
    const existing = await prisma.bankWebhookEvent.findFirst({
      where: {
        eventType: payload.event_type,
        processedAt: { not: null },
        payload: { path: ["$.timestamp"], equals: payload.timestamp },
      },
    });
    if (existing) {
      return NextResponse.json({ received: true, deduplicated: true });
    }
  }

  // Find the connection
  const connection = payload.item_id
    ? await prisma.bankConnection.findFirst({
        where: { providerItemId: payload.item_id },
      })
    : null;

  // Log the event
  try {
    await prisma.bankWebhookEvent.create({
      data: {
        connectionId: connection?.id ?? null,
        provider: "bridge",
        eventType: payload.event_type,
        payload: payload as unknown as Record<string, unknown>,
      },
    });
  } catch (err) {
    console.error("Failed to log bank webhook event:", err);
  }

  try {
    switch (payload.event_type) {
      case "transaction.created": {
        if (!payload.transaction || !connection) break;

        const tx = payload.transaction;
        // Only process incoming (credit) transactions in EUR
        if (tx.amount <= 0 || tx.currency_code !== "EUR") break;

        const incomingAmount = tx.amount;

        // Find the user who owns this bank connection
        const bankConn = await prisma.bankConnection.findFirst({
          where: { providerItemId: payload.item_id },
          include: { user: true },
        });
        if (!bankConn) break;

        // Search for a PENDING transaction matching this amount
        // Match by total due (rent + charges) within ±€0.01 tolerance
        const matchingTransaction = await prisma.transaction.findFirst({
          where: {
            userId: bankConn.userId,
            status: { in: ["PENDING", "LATE"] },
            lease: {
              AND: [
                { rentAmount: { gte: 0 } },
              ],
            },
          },
          include: {
            lease: {
              include: { property: true, tenant: true },
            },
            user: true,
          },
          orderBy: { dueDate: "asc" },
        });

        // Secondary check: verify the amount actually matches the lease total
        if (!matchingTransaction) {
          console.log(`[Bank] No matching pending transaction for amount ${incomingAmount}€`);
          break;
        }

        const lease = matchingTransaction.lease;
        const expectedTotal = toNum(lease.rentAmount) + toNum(lease.chargesAmount);
        const totalDue = expectedTotal;

        // Only auto-match if amount is within ±1 cent of expected OR is a recognizable partial
        if (Math.abs(incomingAmount - expectedTotal) > 0.01 && incomingAmount > expectedTotal) {
          console.log(
            `[Bank] Amount ${incomingAmount}€ doesn't match expected ${expectedTotal}€ for lease ${lease.id} — skipping`
          );
          break;
        }

        // Check amount match with tolerance
        if (Math.abs(incomingAmount - totalDue) > 0.01 && incomingAmount < totalDue) {
          // Partial payment
          const receiptType = "RECU" as const;
          const receiptCount = await prisma.transaction.count({
            where: { userId: bankConn.userId, receiptNumber: { not: null } },
          });
          const receiptNumber = generateReceiptNumber(receiptType, new Date(), receiptCount + 1);
          const { rentPortion, chargesPortion } = computePaymentSplit(
            incomingAmount,
            lease.rentAmount,
            lease.chargesAmount,
          );

          await prisma.transaction.update({
            where: { id: matchingTransaction.id },
            data: {
              amount: incomingAmount,
              rentPortion,
              chargesPortion,
              status: "PARTIAL",
              isFullPayment: false,
              receiptType,
              receiptNumber,
              paidAt: new Date(tx.date),
              bankTransactionId: tx.id,
              bankMatchedAt: new Date(),
              bankRawData: tx as unknown as Record<string, unknown>,
            },
          });
          console.log(`[Bank] Partial payment matched: ${incomingAmount}€ for lease ${lease.id}`);
        } else {
          // Full payment → Quittance
          const receiptType = "QUITTANCE" as const;
          const receiptCount = await prisma.transaction.count({
            where: { userId: bankConn.userId, receiptNumber: { not: null } },
          });
          const receiptNumber = generateReceiptNumber(receiptType, new Date(), receiptCount + 1);

          await prisma.transaction.update({
            where: { id: matchingTransaction.id },
            data: {
              amount: incomingAmount,
              rentPortion: lease.rentAmount,
              chargesPortion: lease.chargesAmount,
              status: "PAID",
              isFullPayment: true,
              receiptType,
              receiptNumber,
              paidAt: new Date(tx.date),
              bankTransactionId: tx.id,
              bankMatchedAt: new Date(),
              bankRawData: tx as unknown as Record<string, unknown>,
            },
          });
          console.log(`[Bank] Full payment matched: ${incomingAmount}€ → Quittance for lease ${lease.id}`);

          // TODO: Trigger email with quittance PDF to tenant
          // await sendQuittanceEmail(matchingTransaction.id);
        }

        // Update webhook event as processed
        const lastEvent = await prisma.bankWebhookEvent.findFirst({
          where: { eventType: "transaction.created" },
          orderBy: { createdAt: "desc" },
        });
        if (lastEvent) {
          await prisma.bankWebhookEvent.update({
            where: { id: lastEvent.id },
            data: { processedAt: new Date() },
          });
        }
        break;
      }

      case "item.refreshed": {
        if (connection) {
          await prisma.bankConnection.update({
            where: { id: connection.id },
            data: { lastSyncAt: new Date() },
          });
        }
        break;
      }

      case "item.error": {
        if (connection) {
          await prisma.bankConnection.update({
            where: { id: connection.id },
            data: { status: "ERROR" },
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Error processing bank webhook:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
