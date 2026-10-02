import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import Decimal from "decimal.js";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { allocateReceiptNumber } from "@/lib/receipt-number";
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

/**
 * A bank webhook body is untrusted input. It was previously read with
 * `payload = JSON.parse(rawBody)` and then asserted to `BankWebhookPayload`, so
 * `payload.transaction.amount` was trusted to be a number before it was used to
 * decide that rent had been paid. These validate rather than assert.
 */
const BridgeTransactionSchema = z.object({
  id: z.string().min(1),
  // positive = credit (incoming), per the provider's convention
  amount: z.number().finite(),
  currency_code: z.string().min(1),
  description: z.string().default(""),
  date: z.string().min(1),
  account_id: z.string().default(""),
  category_id: z.number().optional(),
  is_future: z.boolean().default(false),
});

const BankWebhookSchema = z.object({
  event_type: z.string().min(1),
  item_id: z.string().optional(),
  account_id: z.string().optional(),
  transaction: BridgeTransactionSchema.optional(),
  timestamp: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

type BankWebhookPayload = z.infer<typeof BankWebhookSchema>;


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

  // Validated, not asserted: a valid signature proves the provider sent the body,
  // not that it matches this shape.
  let payload: BankWebhookPayload;

  try {
    payload = BankWebhookSchema.parse(JSON.parse(rawBody));
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
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
        payload: payload as unknown as Prisma.InputJsonValue,
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

        // Find the pending transaction this payment actually corresponds to.
        //
        // The comment here claimed "matching this amount", but the query never
        // referenced incomingAmount: it returned the earliest pending transaction
        // for the user and whatever followed. Because a payment smaller than the
        // total took the PARTIAL branch, a €12 grocery transfer was written onto
        // whichever rent invoice sorted first — marking it part-paid and issuing a
        // receipt for it.
        //
        // Candidates are now gathered with their lease total and filtered in
        // memory, because rent + charges is a sum of two Decimal columns and Prisma
        // cannot compare a cross-column sum against a scalar in `where`. Narrowed
        // to at most a handful by the dueDate ordering, so this stays bounded.
        const candidates = await prisma.transaction.findMany({
          where: {
            userId: bankConn.userId,
            paidAt: null,
            lease: { rentAmount: { gte: 0 } },
          },
          select: {
            id: true,
            rentPortion: true,
            chargesPortion: true,
            amount: true,
            dueDate: true,
            lease: {
              select: {
                id: true,
                rentAmount: true,
                chargesAmount: true,
                property: true,
                tenant: true,
              },
            },
          },
          orderBy: { dueDate: "asc" },
          take: 20,
        });

        const incomingDecimal = new Decimal(incomingAmount);
        // A payment matches a pending transaction when it covers it exactly, or is
        // a partial of it. Overpayments are not matched — they need confirmation.
        const matchingCandidate = candidates.find((c) => {
          const due = new Decimal(c.lease.rentAmount).plus(c.lease.chargesAmount);
          const slack = new Decimal("0.01");
          // Only an exact cover (within a cent) is auto-applied. An overpayment is
          // deliberately not matched: recording €1500 against a €900 invoice would
          // write an amount the tenant never agreed to, and a mismatch like that
          // should reach a human rather than a receipt.
          return incomingDecimal.gte(due.minus(slack)) && incomingDecimal.lte(due.plus(slack));
        });

        const matchingTransaction = matchingCandidate
          ? { ...matchingCandidate, lease: matchingCandidate.lease, user: { id: bankConn.userId } }
          : null;

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
          // Atomic allocation; this was count()+1, which handed two receipts
          // generated in the same second the same number.
          const receiptNumber = await allocateReceiptNumber(
            bankConn.userId,
            receiptType,
            new Date()
          );
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
              bankRawData: tx as unknown as Prisma.InputJsonValue,
            },
          });
          console.log(`[Bank] Partial payment matched: ${incomingAmount}€ for lease ${lease.id}`);
        } else {
          // Full payment → Quittance
          const receiptType = "QUITTANCE" as const;
          // Atomic allocation; this was count()+1, which handed two receipts
          // generated in the same second the same number.
          const receiptNumber = await allocateReceiptNumber(
            bankConn.userId,
            receiptType,
            new Date()
          );

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
              bankRawData: tx as unknown as Prisma.InputJsonValue,
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
