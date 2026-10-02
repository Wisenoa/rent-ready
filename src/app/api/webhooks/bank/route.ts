import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import Decimal from "decimal.js";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { matchTransferToPeriod } from "@/lib/domain/bank-reconciliation";
import { buildDedupeKey } from "@/lib/domain/bank-webhook-event-key";
import { settleRentPeriod } from "@/lib/domain/generate-rent-periods";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";

/**
 * Open Banking Webhook Handler — Bridge API / Powens (DSP2)
 *
 * On `transaction.created`:
 *   1. Record the event (idempotently — see `dedupeKey` below);
 *   2. pick the rent period this transfer settles, by its own value date and by the
 *      balance actually still owed on that period;
 *   3. settle that period with the SAME code as the manual payment paths, and
 *      record the transfer as its own payment row.
 *
 * WHAT THIS HANDLER MUST NOT DO
 *
 * It used to overwrite the period row's `amount` with the incoming amount and set
 * `paidAt` on both branches. For a payment that clears the month that is
 * harmless; for a partial payment it destroys the obligation. A €970.55 month
 * receiving €400 became a €400 row with `paidAt` set, and since
 * `computeDuePeriods` reads unpaid rows, the month stopped being offered and the
 * remaining €570.55 became uncollectable through any path in the UI. That is the
 * invariant `settleRentPeriod` exists to hold, so this handler now calls it
 * instead of reimplementing the rule: a payment that clears the balance closes
 * the period, a payment that does not leaves it unpaid with the balance reduced
 * and records the money in a separate row.
 *
 * REPLAY AND CONCURRENCY
 *
 * The event is keyed by a stable identity — the provider's transaction id, or a
 * hash of the raw body — carried by a UNIQUE column. Replay protection previously
 * compared the payload's `timestamp`, which is optional: an event without one was
 * reprocessed in full on every redelivery. The transfer itself is additionally
 * guarded by the existing UNIQUE on `Transaction.bankTransactionId`, checked
 * before writing, so two concurrent deliveries of the same transfer cannot both
 * book it.
 *
 * NO RECEIPT IS CLAIMED HERE
 *
 * The handler allocates no receipt number and writes no `receiptType`: a quittance
 * is a legal document (loi du 6 juillet 1989, art. 21) and this route produces no
 * PDF, so writing `QUITTANCE` here made /billing advertise a receipt that did not
 * exist and could not be downloaded. Document generation is the job of
 * `generateQuittance`, which persists a `Document` and returns a `receiptUrl`;
 * the payment row this handler writes is picked up by that path. The `receiptUrl`
 * / email remain out of scope here and are deliberately NOT faked.
 *
 * A transfer that cannot be attributed with confidence (no matching period,
 * overpayment, tiny unrelated credit) is recorded as an event with an `error` and
 * nothing is written on `Transaction`: it surfaces for human confirmation rather
 * than becoming a false amount (AGENTS.md §13).
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

/** Postgres unique-violation. The dedupe key and `bankTransactionId` rely on it. */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
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

  // Find the connection
  const connection = payload.item_id
    ? await prisma.bankConnection.findFirst({
        where: { providerItemId: payload.item_id },
        include: { user: true },
      })
    : null;

  // Record the event, keyed by its stable identity. The UNIQUE constraint is what
  // makes replay safe: the second delivery of the same event loses here instead of
  // applying its financial effects a second time.
  let event: { id: string };
  try {
    event = await prisma.bankWebhookEvent.create({
      data: {
        connectionId: connection?.id ?? null,
        provider: "bridge",
        eventType: payload.event_type,
        dedupeKey: buildDedupeKey(payload, rawBody),
        payload: payload as unknown as Prisma.InputJsonValue,
      },
      select: { id: true },
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ received: true, deduplicated: true });
    }
    console.error("Failed to log bank webhook event:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  /** Mark THIS event as processed — by its own id, not "the last one in the table". */
  const markProcessed = async (note?: string) => {
    try {
      await prisma.bankWebhookEvent.update({
        where: { id: event.id },
        data: {
          processedAt: new Date(),
          ...(note ? { error: note } : {}),
        },
      });
    } catch (err) {
      console.error(`[Bank] Failed to mark event ${event.id} processed:`, err);
    }
  };

  try {
    switch (payload.event_type) {
      case "transaction.created": {
        if (!payload.transaction || !connection) {
          await markProcessed("no transaction payload or unknown bank connection");
          break;
        }

        const tx = payload.transaction;
        // Only process incoming (credit) transactions in EUR
        if (tx.amount <= 0 || tx.currency_code !== "EUR") {
          await markProcessed("not an incoming EUR credit");
          break;
        }

        const paidAt = new Date(tx.date);
        if (Number.isNaN(paidAt.getTime())) {
          await markProcessed(`unparseable transaction date: ${tx.date}`);
          break;
        }

        // The transfer may already be booked: a redelivery that raced past the
        // event dedupe, or a transfer recorded manually before the webhook landed.
        // `bankTransactionId` is UNIQUE, so this is a lock, not a heuristic.
        const alreadyBooked = await prisma.transaction.findUnique({
          where: { bankTransactionId: tx.id },
          select: { id: true },
        });
        if (alreadyBooked) {
          await markProcessed();
          return NextResponse.json({ received: true, deduplicated: true });
        }

        // Every open period of this landlord, with what is still owed on it. The
        // balance is the row's own `amount`: money already received for a month
        // lives in sibling rows, so a part-paid month shows its remainder here.
        // Bounded and ordered oldest first, which is also the preference order the
        // matcher applies.
        const candidates = await prisma.transaction.findMany({
          where: {
            userId: connection.userId,
            paidAt: null,
            amount: { gt: 0 },
            status: { in: ["PENDING", "LATE", "PARTIAL"] },
          },
          select: {
            id: true,
            amount: true,
            dueDate: true,
            periodStart: true,
            periodEnd: true,
            leaseId: true,
            lease: {
              select: { rentAmount: true, chargesAmount: true },
            },
          },
          orderBy: { dueDate: "asc" },
          take: 200,
        });

        const match = matchTransferToPeriod(
          { amount: tx.amount, date: paidAt },
          candidates.map((c) => ({
            id: c.id,
            remaining: c.amount,
            dueDate: c.dueDate,
            periodStart: c.periodStart,
            periodEnd: c.periodEnd,
            leaseId: c.leaseId,
          }))
        );

        if (!match) {
          // No confident attribution — including overpayments, which must be
          // confirmed by a human rather than auto-allocated. Nothing is written on
          // Transaction; the event stays visible for review.
          console.warn(
            `[Bank] No period matched transfer ${tx.id} of ${tx.amount}€ received ${tx.date} — left for human review`
          );
          await markProcessed(`no rent period matched ${tx.amount} received ${tx.date}`);
          break;
        }

        const period = candidates.find((c) => c.id === match.id);
        if (!period) {
          await markProcessed("matched period disappeared before settlement");
          break;
        }

        const incoming = new Decimal(tx.amount).toDecimalPlaces(2);

        // The same code the manual paths use, and the same guarantees: it reads the
        // period, judges the PERIOD (not this transfer), writes under a
        // compare-and-set on the balance it read, and returns the settlement it
        // applied. It also re-reads and re-derives if another transfer moved the
        // balance first, which is how two distinct transfers on the same month no
        // longer each write `outstanding - amount` from the same stale 970.55.
        const settled = await settleRentPeriod(period.id, {
          amount: incoming,
          paidAt,
          // The bank reference rides in the same write that closes the period:
          // `bankTransactionId` is UNIQUE, so it is the lock that stops this exact
          // transfer from being booked twice.
          bank: {
            transactionId: tx.id,
            matchedAt: new Date(),
            rawData: tx as unknown as Prisma.InputJsonValue,
          },
        });

        if (settled.applied && settled.closed) {
          await markProcessed();
          console.log(
            `[Bank] Transfer ${tx.id} of ${tx.amount}€ settled period ${period.periodStart.toISOString().slice(0, 10)}`
          );
          break;
        }

        // Either the transfer is short of the balance, or the month was closed by a
        // concurrent request. Record the money as its own row so it is never lost,
        // and carry the bank reference on it — which is also what makes this write
        // idempotent under a concurrent redelivery of the same transfer.
        const settlement = settled.applied
          ? settled.settlement
          : // Nothing could be written (the month closed under us on every retry).
            // The money still arrived, so it is recorded against the period it was
            // matched to rather than dropped.
            settlePeriodPayments({
              rentAmount: period.lease.rentAmount,
              chargesAmount: period.lease.chargesAmount,
              payments: [{ amount: incoming, paidAt, createdAt: new Date() }],
            });

        try {
          await prisma.transaction.create({
            data: {
              userId: connection.userId,
              leaseId: period.leaseId,
              amount: incoming.toNumber(),
              rentPortion: settlement.rentPortion.toNumber(),
              chargesPortion: settlement.chargesPortion.toNumber(),
              periodStart: period.periodStart,
              periodEnd: period.periodEnd,
              dueDate: period.dueDate,
              paidAt,
              status: settled.applied ? settlement.status : "PARTIAL",
              isFullPayment: false,
              bankTransactionId: tx.id,
              bankMatchedAt: new Date(),
              bankRawData: tx as unknown as Prisma.InputJsonValue,
              // No receiptType / receiptNumber: this handler produces no document.
              // See the note at the top of this file.
            },
          });
        } catch (err) {
          if (isUniqueViolation(err)) {
            // A concurrent delivery booked this exact transfer. Its money is
            // already recorded; doing it again would double-count it.
            await markProcessed("transfer already recorded by a concurrent delivery");
            return NextResponse.json({ received: true, deduplicated: true });
          }
          throw err;
        }

        await markProcessed();
        // Three outcomes reach here: a partial transfer (settleRentPeriod reduced
        // the balance and left the month open), or a period another request closed
        // while this one was running — the transfer is recorded either way, so the
        // money received is never lost.
        console.log(
          settled.applied
            ? `[Bank] Transfer ${tx.id} of ${tx.amount}€ partial: ${settled.remaining.toFixed(2)}€ still owed`
            : `[Bank] Transfer ${tx.id} of ${tx.amount}€ recorded; period closed concurrently`
        );
        break;
      }

      case "item.refreshed": {
        if (connection) {
          await prisma.bankConnection.update({
            where: { id: connection.id },
            data: { lastSyncAt: new Date() },
          });
        }
        await markProcessed();
        break;
      }

      case "item.error": {
        if (connection) {
          await prisma.bankConnection.update({
            where: { id: connection.id },
            data: { status: "ERROR" },
          });
        }
        await markProcessed();
        break;
      }

      default:
        await markProcessed();
        break;
    }
  } catch (err) {
    console.error("Error processing bank webhook:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}