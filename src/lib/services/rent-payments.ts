/**
 * The one and only door for writing rent money.
 *
 * There used to be six ways to write into `Transaction` — the payment form, the
 * « Marquer payé » button, `POST /api/payments`, `POST /api/transactions`, and the
 * two `PATCH /api/[payments|transactions]/[id]` routes — and each of them
 * re-implemented "is this period paid?" on its own. Two of them could write a
 * status with no money behind it at all: `PATCH` took `status` straight from the
 * body, so a hand-crafted request could mark a 970.55 EUR month PAID while the
 * month's receipts summed to zero. The dashboard then showed a settled month
 * nobody had paid.
 *
 * Everything now comes through `recordRentPayment`:
 *
 *   - ownership comes from the session `userId`, never from the request body;
 *   - the period is resolved from the DATABASE (an id scoped to the lease and the
 *     landlord, or the materialised unpaid period for the month), and its dates
 *     replace whatever was posted;
 *   - the settlement is derived by `settlePeriodPayments`, the single rule
 *     (AGENTS.md 11);
 *   - the collectable balance is re-derived server-side and a payment above it is
 *     refused: the browser's `max` is ergonomics, not an invariant (AGENTS.md 6);
 *   - the write happens in one `prisma.$transaction`.
 *
 * `cancelRentPayment` is the correction path: a wrong receipt is CANCELLED (the
 * row keeps its amount, date and bank reference for the audit trail, but stops
 * counting as a receipt) and the balance it represented goes back to being
 * collectable through the « Enregistrer un paiement » dialog.
 */

import Decimal from "decimal.js";
import type { PaymentMethod, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";
import { settlePeriod } from "@/lib/domain/rent-periods";
import { findUnpaidPeriod, settleRentPeriod } from "@/lib/domain/generate-rent-periods";

export interface RecordRentPaymentInput {
  /** The authenticated landlord. Every read and write is scoped by it. */
  userId: string;
  leaseId: string;
  /**
   * Id of the materialised rent period this payment settles. Untrusted: it is
   * resolved scoped to `leaseId` AND `userId`, and must still be unpaid.
   */
  duePeriodId?: string | null;
  /**
   * Fallback dates, used only when the month has no materialised period row.
   * Once a period row is found, ITS dates are used and these are ignored.
   */
  periodStart?: Date | null;
  periodEnd?: Date | null;
  dueDate?: Date | null;
  /**
   * Money received. Omit to settle the line's real balance — which is what
   * « Marquer payé » does, so the browser can no longer decide the amount.
   */
  amount?: number | Decimal | string | null;
  paidAt?: Date | null;
  paymentMethod?: PaymentMethod | null;
  notes?: string | null;
}

export interface RecordRentPaymentSuccess {
  ok: true;
  /** The row holding the money: the closed period, or the new receipt row. */
  transactionId: string;
  /** The period row involved, when the month had one. */
  periodId: string | null;
  receiptType: "QUITTANCE" | "RECU";
  /** True when this payment discharged the month. */
  settled: boolean;
  /** What was actually recorded, as a decimal string. */
  amount: string;
}

/**
 * Why the door refused. Callers branch on this, never on the message: a substring
 * test on a translated sentence turns a reword into a wrong HTTP status, which on
 * an ownership refusal means answering 400 instead of 404 and telling a caller
 * that its own request was malformed when the real answer is "not yours".
 */
export type RecordRentPaymentErrorCode =
  /** The lease does not exist, or belongs to somebody else. */
  | "LEASE_NOT_FOUND"
  /** The posted period id is not this lease's, or is no longer collectable. */
  | "PERIOD_NOT_COLLECTABLE"
  /** The month could not be resolved to a set of dates. */
  | "INVALID_PERIOD"
  | "AMOUNT_NOT_POSITIVE"
  /** Above what the month can still absorb. */
  | "AMOUNT_ABOVE_BALANCE"
  /** Somebody closed the month concurrently. */
  | "PERIOD_ALREADY_SETTLED";

export interface RecordRentPaymentFailure {
  ok: false;
  code: RecordRentPaymentErrorCode;
  error: string;
}

function refuse(
  code: RecordRentPaymentErrorCode,
  error: string
): RecordRentPaymentFailure {
  return { ok: false, code, error };
}

export type RecordRentPaymentResult = RecordRentPaymentSuccess | RecordRentPaymentFailure;

/**
 * How many times the door re-reads and re-decides when somebody else moved the
 * month's balance first. Each retry is decided on the state that won the
 * compare-and-set, so a payment that fits the current balance always lands; this
 * only bounds a pathological pile-up.
 */
const CAP_ATTEMPTS = 5;

const PERIOD_SELECT = {
  id: true,
  periodStart: true,
  periodEnd: true,
  dueDate: true,
  amount: true,
} as const;

/** Money in a user-facing error message, without importing a client formatter. */
function formatEuros(value: Decimal): string {
  return `${value.toDecimalPlaces(2).toFixed(2)} €`;
}

function totalDueOf(lease: {
  rentAmount: Prisma.Decimal | Decimal | number | string;
  chargesAmount: Prisma.Decimal | Decimal | number | string | null;
}): Decimal {
  return new Decimal(lease.rentAmount).plus(new Decimal(lease.chargesAmount ?? 0)).toDecimalPlaces(2);
}

/**
 * Record money received against one rent period of one lease.
 *
 * The amount is capped by the collectable balance, which is re-derived here: a
 * period row carries what is still OWED for its month (money already received
 * lives in sibling receipt rows), so that row's own `amount` is the ceiling.
 */
export async function recordRentPayment(
  input: RecordRentPaymentInput
): Promise<RecordRentPaymentResult> {
  const lease = await prisma.lease.findFirst({
    where: { id: input.leaseId, userId: input.userId },
    select: { id: true, rentAmount: true, chargesAmount: true },
  });
  if (!lease) {
    return refuse("LEASE_NOT_FOUND", "Bail introuvable ou accès non autorisé.");
  }

  const paidAt = input.paidAt ?? new Date();

  // Everything that decides the outcome — the period's own row, the month's
  // receipts, the ceiling and the write — happens INSIDE this transaction, and
  // the ceiling is re-derived on every attempt.
  //
  // It used to be derived once, before the transaction. That made it a TOCTOU:
  // two requests for the same month both read the same balance, both passed the
  // cap, and both wrote. 2 × 600 EUR on a 970.55 EUR month booked 1200.55 EUR
  // received against a 970.55 EUR debt, closed the month, and answered `ok` to
  // both callers. Postgres READ COMMITTED gives each statement a fresh snapshot,
  // so a check inside the transaction that follows a blocking write by someone
  // else would still have read a stale balance; what actually serialises is the
  // compare-and-set inside `settleRentPeriod` (`where: { amount: <read> }`), which
  // takes the row lock and re-evaluates its predicate afterwards. So the loop
  // below treats that CAS as the point of truth: the loser updates nothing, comes
  // back here, re-reads the month and re-decides — which on the 970.55 example
  // means refusing AMOUNT_ABOVE_BALANCE instead of over-collecting.
  return prisma.$transaction(async (tx) => {
    for (let attempt = 0; attempt < CAP_ATTEMPTS; attempt += 1) {
      // Resolve the period from the database. A posted period id is resolved
      // scoped to this lease and this landlord and must still be unpaid;
      // otherwise the month's materialised period is found from the posted month.
      // Either way the dates below come from the row, which closes the door on a
      // payload that names one month's id with another month's dates.
      let period: {
        id: string;
        periodStart: Date;
        periodEnd: Date;
        dueDate: Date;
        amount: Prisma.Decimal;
      } | null = null;
      if (input.duePeriodId) {
        const resolved = await tx.transaction.findFirst({
          where: {
            id: input.duePeriodId,
            leaseId: lease.id,
            userId: input.userId,
            paidAt: null,
          },
          select: PERIOD_SELECT,
        });
        if (!resolved) {
          return refuse(
            "PERIOD_NOT_COLLECTABLE",
            "Cette période de loyer n'est plus à encaisser pour ce bail."
          );
        }
        period = resolved;
      } else if (input.periodStart) {
        period = await findUnpaidPeriod(lease.id, input.periodStart, input.userId, tx);
      }

      const periodStart = period?.periodStart ?? input.periodStart ?? null;
      const periodEnd = period?.periodEnd ?? input.periodEnd ?? null;
      const dueDate = period?.dueDate ?? input.dueDate ?? null;
      if (!periodStart || !periodEnd || !dueDate) {
        return refuse("INVALID_PERIOD", "Période de loyer invalide.");
      }

      // Everything already received for this month. CANCELLED rows keep their
      // amount for the audit trail but are not receipts, so they are excluded here
      // rather than filtered out of the ledger.
      const priorPayments = await tx.transaction.findMany({
        where: {
          leaseId: lease.id,
          periodStart,
          periodEnd,
          paidAt: { not: null },
          status: { not: "CANCELLED" },
        },
        select: { amount: true, paidAt: true, createdAt: true },
      });
      const received = priorPayments
        .reduce((sum, p) => sum.plus(new Decimal(p.amount)), new Decimal(0))
        .toDecimalPlaces(2);

      // What the month still owes, from the lease's own contractual rent and
      // charges. This is the authority on the ceiling, NOT the period row's
      // amount: a row written before `settleRentPeriod` started reducing it still
      // carries the FULL month next to a sibling receipt, so trusting it would
      // accept 970.55 on top of 400 already received and book 1370.55 against a
      // 970.55 debt.
      const contractualTotal = totalDueOf(lease);
      const owedAfterReceipts = Decimal.max(
        contractualTotal.minus(received),
        new Decimal(0)
      ).toDecimalPlaces(2);

      // The period row's amount is the ceiling only when it agrees with that.
      // Taking the smaller of the two keeps a row that is already reduced (the
      // normal shape) authoritative while a legacy or otherwise stale row can
      // never inflate it.
      const remaining = period
        ? Decimal.min(new Decimal(period.amount).toDecimalPlaces(2), owedAfterReceipts)
        : owedAfterReceipts;

      const requested =
        input.amount === null || input.amount === undefined
          ? remaining
          : new Decimal(input.amount).toDecimalPlaces(2);

      if (remaining.lte(0)) {
        return refuse(
          "PERIOD_NOT_COLLECTABLE",
          "Cette période de loyer est déjà entièrement encaissée."
        );
      }
      if (requested.lte(0)) {
        return refuse("AMOUNT_NOT_POSITIVE", "Le montant doit être positif.");
      }
      if (requested.gt(remaining)) {
        return refuse(
          "AMOUNT_ABOVE_BALANCE",
          `Le montant dépasse le reste à payer pour cette période (${formatEuros(remaining)}).`
        );
      }

      // The settlement of this payment against this month. When there is no
      // materialised period row it is derived here from the lease's contractual
      // total; when there is one, `settleRentPeriod` derives it from the rows it
      // actually read and writes, and returns it — the figures below then describe
      // the state that was persisted rather than the one read before the write.
      let settlement = settlePeriodPayments({
        rentAmount: lease.rentAmount,
        chargesAmount: lease.chargesAmount,
        payments: [
          ...priorPayments.map((p) => ({
            amount: p.amount,
            paidAt: p.paidAt,
            createdAt: p.createdAt,
          })),
          { amount: requested, paidAt, createdAt: new Date() },
        ],
      });

      if (period) {
        // A period row written before `settleRentPeriod` reduced it carries the
        // FULL month even though sibling receipts already exist, so
        // `settleRentPeriod` would subtract this payment from 970.55 instead of
        // from the 570.55 that is really left and leave the month open forever.
        // Repair the row to the balance the receipts prove — downward only,
        // compare-and-set on the value just read — so the settle below and every
        // later read agree.
        const staleRow = new Decimal(period.amount).gt(remaining);
        if (staleRow) {
          const repaired = await tx.transaction.updateMany({
            where: { id: period.id, paidAt: null, amount: period.amount },
            data: { amount: remaining.toNumber(), status: "PENDING", isFullPayment: false },
          });
          // Lost the race: re-read on the next attempt rather than booking off a
          // balance somebody else has already moved.
          if (repaired.count === 0) continue;
        }

        // The period is SETTLED, never duplicated: a second row for the same month
        // would count it once as owed and once as received.
        const settled = await settleRentPeriod(
          period.id,
          {
            amount: requested,
            paidAt,
            // The ceiling is re-derived by `settleRentPeriod` from the rows it
            // reads while winning the compare-and-set. See `capToBalance`.
            capToBalance: true,
            ...(input.paymentMethod ? { paymentMethod: input.paymentMethod } : {}),
          },
          tx
        );

        // The payment lost the race for the balance: it is above what the month can
        // now absorb, decided on the state that won. `settled.remaining` IS that
        // ceiling, so the message quotes the real figure rather than the stale one
        // the caller would have refused with.
        if (settled.aboveCeiling) {
          return refuse(
            "AMOUNT_ABOVE_BALANCE",
            `Le montant dépasse le reste à payer pour cette période (${formatEuros(
              settled.remaining
            )}).`
          );
        }

        // applied=false means this attempt's CAS was lost, or the month is no
        // longer collectable. Re-read and re-decide; refusing straight away would
        // turn a payment that fits the CURRENT balance into an error.
        if (!settled.applied) continue;

        // closed=true means this payment discharged the balance: the period row now
        // IS the receipt for it, and no separate row is written.
        if (settled.closed) {
          return {
            ok: true,
            transactionId: period.id,
            periodId: period.id,
            receiptType: settled.settlement.receiptType,
            settled: true,
            amount: requested.toFixed(2),
          };
        }

        // Still short: the period row keeps the reduced balance and stays open, and
        // the payment is recorded below so `computeDuePeriods` still offers the month.
        settlement = settled.settlement;
      }

      const receipt = await tx.transaction.create({
        data: {
          userId: input.userId,
          leaseId: lease.id,
          amount: requested.toNumber(),
          rentPortion: settlement.rentPortion.toNumber(),
          chargesPortion: settlement.chargesPortion.toNumber(),
          periodStart,
          periodEnd,
          dueDate,
          paidAt,
          paymentMethod: input.paymentMethod ?? null,
          status: settlement.status,
          isFullPayment: settlement.isFullPayment,
          receiptType: settlement.receiptType,
          notes: input.notes || null,
        },
      });

      return {
        ok: true,
        transactionId: receipt.id,
        periodId: period?.id ?? null,
        receiptType: settlement.receiptType,
        settled: false,
        amount: requested.toFixed(2),
      };
    }

    // The balance moved under us on every attempt. Refuse rather than book a month
    // twice: the caller can retry against a fresh read.
    return refuse(
      "PERIOD_ALREADY_SETTLED",
      "Cette période de loyer vient déjà d'être encaissée."
    );
  });
}

export type CancelRentPaymentErrorCode =
  /** The receipt does not exist, or belongs to somebody else. */
  | "PAYMENT_NOT_FOUND"
  /** An unpaid period row: there is no receipt to cancel. */
  | "NOTHING_TO_CANCEL"
  | "ALREADY_CANCELLED";

export type CancelRentPaymentResult =
  | { ok: true; collectable: string; reopenedPeriodId: string | null }
  | { ok: false; code: CancelRentPaymentErrorCode; error: string };

function refuseCancel(
  code: CancelRentPaymentErrorCode,
  error: string
): { ok: false; code: CancelRentPaymentErrorCode; error: string } {
  return { ok: false, code, error };
}

/**
 * Cancel a wrongly recorded receipt: the money went back, so the month is owed
 * again.
 *
 * The row is not deleted — a financial ledger keeps what happened. It is marked
 * CANCELLED, which takes it out of every receipt sum (they filter on PAID /
 * PARTIAL, and `paidAt` stays set so the arrears queries, which read
 * `paidAt: null`, do not offer it either) and out of the settlement rule.
 *
 * The balance it represented becomes collectable again, which is the actual
 * point: the « Enregistrer un paiement » dialog offers the month again, for the
 * right amount. Two shapes, because a receipt is either a sibling of the month's
 * period row or that row itself.
 */
export async function cancelRentPayment(input: {
  userId: string;
  transactionId: string;
}): Promise<CancelRentPaymentResult> {
  const row = await prisma.transaction.findFirst({
    where: { id: input.transactionId, userId: input.userId },
    select: {
      id: true,
      leaseId: true,
      userId: true,
      amount: true,
      paidAt: true,
      status: true,
      periodStart: true,
      periodEnd: true,
      dueDate: true,
      lease: { select: { rentAmount: true, chargesAmount: true } },
    },
  });

  if (!row) {
    return refuseCancel(
      "PAYMENT_NOT_FOUND",
      "Paiement introuvable ou accès non autorisé."
    );
  }
  if (!row.paidAt) {
    return refuseCancel(
      "NOTHING_TO_CANCEL",
      "Cette ligne n'a reçu aucun paiement : il n'y a rien à annuler."
    );
  }
  if (row.status === "CANCELLED") {
    return refuseCancel("ALREADY_CANCELLED", "Ce paiement est déjà annulé.");
  }

  const amount = new Decimal(row.amount).toDecimalPlaces(2);
  const totalDue = totalDueOf(row.lease);

  // What the month still holds from the OTHER receipts, so reopening it does not
  // forget the instalments that really did arrive.
  const siblings = await prisma.transaction.findMany({
    where: {
      leaseId: row.leaseId,
      periodStart: row.periodStart,
      periodEnd: row.periodEnd,
      paidAt: { not: null },
      status: { not: "CANCELLED" },
      id: { not: row.id },
    },
    select: { amount: true },
  });
  const receivedFromSiblings = siblings
    .reduce((sum, p) => sum.plus(new Decimal(p.amount)), new Decimal(0))
    .toDecimalPlaces(2);
  const outstanding = Decimal.max(totalDue.minus(receivedFromSiblings), new Decimal(0));

  return prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: row.id },
      data: { status: "CANCELLED", isFullPayment: false, receiptType: null },
    });

    // The month's period row, if the cancelled receipt was a sibling of it.
    const openPeriod = await tx.transaction.findFirst({
      where: {
        leaseId: row.leaseId,
        periodStart: row.periodStart,
        periodEnd: row.periodEnd,
        paidAt: null,
        status: { not: "CANCELLED" },
      },
      select: { id: true, amount: true },
    });

    if (openPeriod) {
      // A period row carries the balance still owed, so returning this receipt
      // means giving its amount back to that row.
      const restored = Decimal.min(
        new Decimal(openPeriod.amount).plus(amount).toDecimalPlaces(2),
        totalDue
      );
      await tx.transaction.update({
        where: { id: openPeriod.id },
        data: { amount: restored.toNumber(), status: "PENDING", isFullPayment: false },
      });
      return { ok: true, collectable: restored.toFixed(2), reopenedPeriodId: openPeriod.id };
    }

    // The cancelled row WAS the month (a full payment closes the period row
    // itself), so the month has to be re-materialised as its own open row.
    if (outstanding.gt(0)) {
      const rent = new Decimal(row.lease.rentAmount).toDecimalPlaces(2);
      const charges = new Decimal(row.lease.chargesAmount ?? 0).toDecimalPlaces(2);
      const reopened = await tx.transaction.create({
        data: {
          userId: row.userId,
          leaseId: row.leaseId,
          amount: outstanding.toNumber(),
          rentPortion: Decimal.min(rent, outstanding).toNumber(),
          chargesPortion: Decimal.max(Decimal.min(charges, Decimal.max(outstanding.minus(rent), new Decimal(0))), new Decimal(0)).toNumber(),
          periodStart: row.periodStart,
          periodEnd: row.periodEnd,
          dueDate: row.dueDate,
          paidAt: null,
          status: "PENDING",
          isFullPayment: false,
        },
      });
      return { ok: true, collectable: outstanding.toFixed(2), reopenedPeriodId: reopened.id };
    }

    return { ok: true, collectable: "0.00", reopenedPeriodId: null };
  });
}