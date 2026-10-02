/**
 * Persisting rent periods.
 *
 * The domain rules live in `./rent-periods` (pure, tested). This module is the
 * only place that writes them, so generation is idempotent and the arrears view
 * has one source of truth.
 *
 * A period is materialised as a `PENDING` `Transaction` with `amount` set to the
 * amount owed and `paidAt` null. Settling it is what records money: a payment
 * flips the row to PAID/PARTIAL. Keeping one table avoids a second source of
 * truth for "what was owed" while leaving the derivation in one place.
 */

import { prisma } from "@/lib/prisma";
import type { PaymentMethod, Prisma } from "@prisma/client";
import { enumerateRentPeriods, settlePeriod } from "@/lib/domain/rent-periods";
import { settlePeriodPayments, type Settlement } from "@/lib/domain/period-settlement";
import Decimal from "decimal.js";

export interface GenerationResult {
  created: number;
  skipped: number;
  periods: Array<{ periodStart: Date; totalDue: string }>;
}

/**
 * The slice of Prisma these functions use. Accepting it lets a caller pass the
 * client of an open `prisma.$transaction`, so writing a payment and closing its
 * period is one atomic operation instead of two that can interleave. Defaulting
 * to the shared client keeps the single-operation call sites unchanged.
 */
type Db = Pick<typeof prisma, "transaction">;

/**
 * Create the missing rent periods for one lease, from the lease start up to and
 * including the current month.
 *
 * Idempotent: periods that already exist are skipped, so this is safe to call on
 * lease creation, from a cron job, and again after a lease amendment.
 */
export async function generateRentPeriodsForLease(
  leaseId: string,
  now: Date = new Date()
): Promise<GenerationResult> {
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    select: {
      id: true,
      userId: true,
      rentAmount: true,
      chargesAmount: true,
      startDate: true,
      endDate: true,
      paymentDay: true,
      status: true,
    },
  });

  if (!lease || lease.status === "TERMINATED" || lease.status === "EXPIRED") {
    return { created: 0, skipped: 0, periods: [] };
  }

  // Generate up to the current month: a landlord is owed rent for months that
  // have begun, not for months still to come.
  const periods = enumerateRentPeriods(lease, lease.startDate, now);
  if (periods.length === 0) {
    return { created: 0, skipped: 0, periods: [] };
  }

  const existing = await prisma.transaction.findMany({
    where: {
      leaseId: lease.id,
      periodStart: { gte: periods[0].periodStart },
    },
    select: { periodStart: true },
  });
  const taken = new Set(
    existing.map((t) => t.periodStart.toISOString().slice(0, 10))
  );

  const missing = periods.filter(
    (p) => !taken.has(p.periodStart.toISOString().slice(0, 10))
  );

  if (missing.length === 0) {
    return {
      created: 0,
      skipped: periods.length,
      periods: periods.map((p) => ({
        periodStart: p.periodStart,
        totalDue: p.totalDue.toString(),
      })),
    };
  }

  await prisma.transaction.createMany({
    data: missing.map((p) => ({
      userId: lease.userId,
      leaseId: lease.id,
      amount: p.totalDue.toNumber(),
      rentPortion: p.rentDue.toNumber(),
      chargesPortion: p.chargesDue.toNumber(),
      periodStart: p.periodStart,
      periodEnd: p.periodEnd,
      dueDate: p.dueDate,
      status: "PENDING" as const,
      isFullPayment: false,
      paidAt: null,
    })),
    skipDuplicates: true,
  });

  return {
    created: missing.length,
    skipped: periods.length - missing.length,
    periods: periods.map((p) => ({
      periodStart: p.periodStart,
      totalDue: p.totalDue.toString(),
    })),
  };
}

/** Generate periods for every active lease of a user (or all users when omitted). */
export async function generateRentPeriodsForAllLeases(
  userId?: string,
  now: Date = new Date()
): Promise<{ leases: number; created: number }> {
  const leases = await prisma.lease.findMany({
    where: {
      status: "ACTIVE",
      ...(userId ? { userId } : {}),
    },
    select: { id: true },
  });

  let created = 0;
  for (const lease of leases) {
    const result = await generateRentPeriodsForLease(lease.id, now);
    created += result.created;
  }
  return { leases: leases.length, created };
}

/**
 * Recompute arrears for a lease: which owed periods are unpaid or overdue.
 * Read-only — it derives status from the payments already recorded.
 */
export async function getLeaseArrears(
  leaseId: string,
  now: Date = new Date()
): Promise<
  Array<{
    transactionId: string;
    periodStart: Date;
    dueDate: Date;
    totalDue: string;
    outstanding: string;
    status: string;
    daysLate: number;
  }>
> {
  const rows = await prisma.transaction.findMany({
    where: { leaseId, paidAt: null },
    orderBy: { dueDate: "asc" },
  });

  return rows
    .map((row) => {
      const totalDue = new Decimal(row.amount);
      const settlement = settlePeriod(totalDue, new Decimal(0), row.dueDate, now);
      const daysLate = Math.max(
        0,
        Math.floor((now.getTime() - row.dueDate.getTime()) / 86_400_000)
      );
      return {
        transactionId: row.id,
        periodStart: row.periodStart,
        dueDate: row.dueDate,
        totalDue: totalDue.toString(),
        outstanding: settlement.outstanding.toString(),
        status: settlement.status,
        daysLate,
      };
    })
    .filter((r) => r.status === "OVERDUE");
}

/**
 * How many times a lost race is re-read and retried before giving up. The
 * contention is other payments landing on the same month, so the window is tiny;
 * the bound exists so a pathological storm cannot spin forever.
 */
const SETTLE_ATTEMPTS = 5;

/** Returned when nothing could be written, so the shape stays total. */
const EMPTY_SETTLEMENT: Settlement = settlePeriodPayments({
  rentAmount: 0,
  chargesAmount: 0,
  payments: [],
});

/**
 * What `settleRentPeriod` did, derived from the state it actually wrote.
 *
 * `settlement` is returned rather than recomputed by the caller: the callers used
 * to derive it from a read taken BEFORE the write, so under concurrency it
 * described a balance that no longer existed. Whoever records the receipt row
 * must use these figures, not its own stale ones.
 */
export interface SettleRentPeriodResult {
  /** False when the period was no longer collectable; nothing was written. */
  applied: boolean;
  /** True when this payment discharged the month's balance and closed the row. */
  closed: boolean;
  /** The month's settlement including this payment. */
  settlement: Settlement;
  /** What the period row carries now: the balance still owed, or 0 once closed. */
  remaining: Decimal;
  /**
   * True when the payment was above the caller's `maxCollectable`, so nothing was
   * written. Distinct from a plain `applied: false` (which means the period was
   * gone or the race was lost): the caller can tell the landlord the amount is
   * too high instead of retrying against a balance that has not moved.
   */
  aboveCeiling?: boolean;
}

/**
 * Record a payment against a generated rent period.
 *
 * The period row stays the OBLIGATION and is never overwritten by the payment.
 * It holds the balance still owed for the month; each payment is recorded as its
 * own row sharing the same `periodStart`/`periodEnd`, so the month's receipts sum
 * to what was received and the month's obligation is still derivable.
 *
 * This used to overwrite `amount` with the payment and set `paidAt`, which is
 * only harmless for a payment that clears the month. A PARTIAL payment rewrote
 * 970.55 EUR as 400 EUR and closed the period: the obligation was gone from the
 * database, `computeDuePeriods` (which reads unpaid rows) stopped offering the
 * month, and the remaining 570.55 EUR could not be collected through any UI.
 *
 * `paidAt` is therefore set only when the payment clears the balance. While the
 * month is short the period stays unpaid and still collectable, and
 * `computeDuePeriods` derives the remaining balance from the payment rows.
 *
 * THE WHOLE READ-DERIVE-WRITE BELONGS HERE
 *
 * Both callers used to read the balance, derive the settlement, and then write
 * `outstanding - amount` guarded only by `paidAt: null`. Two transfers of 300 EUR
 * on the same 970.55 EUR month therefore each saw 970.55 owed and each wrote
 * 670.55: the month ended up owing 970.55 while 600 EUR had been received, and
 * 300 EUR of rent silently disappeared from the ledger. The guard now carries the
 * balance that was read (`amount: <read value>`), so a concurrent write loses the
 * update instead of overwriting it, and the whole thing is re-read and retried.
 * Under Postgres READ COMMITTED the row lock is taken before the predicate is
 * re-evaluated, so the compare-and-set is genuine rather than best-effort.
 *
 * The derived rent/charges split comes from the payments actually recorded, in
 * payment order, so the closing instalment takes the REMAINDER rather than the
 * month's full contractual rent. Leaving the obligation's portions on the closed
 * row double-counted the earlier instalment (~350 EUR of phantom rent on the 2577
 * fiscal report for a month paid 400 + 570.55).
 *
 * Returns `applied: false` when the period is not collectable (already settled,
 * or the id belongs to nobody) so callers can refuse rather than double-book.
 */
export async function settleRentPeriod(
  periodTransactionId: string,
  payment: {
    amount: Prisma.Decimal | Decimal | number | string;
    paidAt: Date;
    paymentMethod?: string;
    /**
     * Bank reference for the payment. Written in the SAME update that closes the
     * period: `Transaction.bankTransactionId` is UNIQUE and is what makes booking
     * this transfer idempotent, so a separate follow-up write would leave a closed
     * period with no bank reference if the process died in between, and a
     * redelivery could then book the same transfer a second time.
     */
    bank?: {
      transactionId: string;
      matchedAt: Date;
      rawData: Prisma.InputJsonValue;
    };
    /**
     * Cap the payment at what the month can still absorb, instead of closing it
     * with whatever was posted.
     *
     * The retry loop below is what serialises concurrent payments on one month:
     * the loser of the compare-and-set re-reads and re-derives, and closes the
     * month whenever `amount >= outstanding`. That is right for a bank transfer
     * (the money that arrived is the money that is booked) but wrong for a
     * landlord entering a figure by hand: two 600 EUR payments on a 970.55 EUR
     * month each re-read, each closed the month with 600 EUR, and the month's
     * receipts summed to 1200.00 against a 970.55 debt.
     *
     * `recordRentPayment` sets this, and the ceiling is recomputed HERE rather
     * than passed in: `outstanding` and `received` are the figures this
     * iteration read, and this iteration is the one that wins the
     * compare-and-set, so they are the only balance that is not stale. A ceiling
     * computed by the caller before the loop is exactly the value that loses the
     * race — on 2 × 600 it was still 970.55 when the second call reached here.
     *
     * The ceiling is `min(periodRow, owed − received)`: the period row carries
     * the balance still owed, but a row written before this module started
     * reducing it still carries the FULL month next to a sibling receipt, and
     * trusting that row alone would accept 970.55 on top of 400 already
     * received.
     *
     * The webhook deliberately does NOT set this: an incoming transfer is
     * evidence of money moved, not a claim about a balance.
     */
    capToBalance?: boolean;
  },
  db: Db = prisma
): Promise<SettleRentPeriodResult> {
  const amount = new Decimal(payment.amount).toDecimalPlaces(2);

  for (let attempt = 0; attempt < SETTLE_ATTEMPTS; attempt += 1) {
    const period = await db.transaction.findFirst({
      where: { id: periodTransactionId, paidAt: null },
      select: {
        id: true,
        leaseId: true,
        amount: true,
        periodStart: true,
        periodEnd: true,
        lease: { select: { rentAmount: true, chargesAmount: true } },
      },
    });

    if (!period) {
      return {
        applied: false,
        closed: false,
        settlement: EMPTY_SETTLEMENT,
        remaining: new Decimal(0),
      };
    }

    // Everything already received for this month, in the rows' own order. The
    // period row itself is excluded by `paidAt: null` above; CANCELLED receipts
    // keep their amount for the audit trail but are not money received.
    const priorPayments = await db.transaction.findMany({
      where: {
        leaseId: period.leaseId,
        periodStart: period.periodStart,
        periodEnd: period.periodEnd,
        paidAt: { not: null },
        status: { not: "CANCELLED" },
      },
      select: { amount: true, paidAt: true, createdAt: true },
      orderBy: [{ paidAt: "asc" }, { createdAt: "asc" }],
    });

    const current = {
      amount,
      paidAt: payment.paidAt,
      createdAt: payment.paidAt,
    };

    const settlement = settlePeriodPayments({
      rentAmount: period.lease.rentAmount,
      chargesAmount: period.lease.chargesAmount,
      payments: [
        ...priorPayments.map((p) => ({
          amount: new Decimal(p.amount).toDecimalPlaces(2),
          paidAt: p.paidAt,
          createdAt: p.createdAt,
        })),
        current,
      ],
      current,
    });

    // The row's own `amount` is the balance still owed, which is what the dialog
    // offers and what the collectable ceiling is. The settlement above is derived
    // from the lease's contractual total, so it is the authority on status and on
    // the rent/charges split; the row is the authority on what is left to collect.
    const outstanding = new Decimal(period.amount).toDecimalPlaces(2);
    // The ceiling, derived from the rows THIS iteration read. It belongs here,
    // not before the loop: this iteration is the one that wins the
    // compare-and-set, so these are the only figures that are not stale.
    // `priorPayments` above is the month's receipts, the period row is the
    // balance it still carries, and the lease's own rent + charges are what the
    // month owes in the first place.
    const received = priorPayments.reduce(
      (sum, p) => sum.plus(new Decimal(p.amount)),
      new Decimal(0)
    );
    const owedAfterReceipts = Decimal.max(
      new Decimal(period.lease.rentAmount)
        .plus(new Decimal(period.lease.chargesAmount ?? 0))
        .minus(received),
      new Decimal(0)
    ).toDecimalPlaces(2);
    const ceiling = Decimal.min(outstanding, owedAfterReceipts);
    if (payment.capToBalance && amount.gt(ceiling)) {
      return {
        applied: false,
        closed: false,
        settlement,
        remaining: ceiling,
        aboveCeiling: true,
      };
    }
    const remaining = outstanding.minus(amount);
    const closed = remaining.lte(0);

    const data: Prisma.TransactionUpdateManyMutationInput = closed
      ? {
          // The obligation is discharged: the row becomes the receipt for the
          // payment that settled it, carrying THAT payment's rent/charges share.
          paidAt: payment.paidAt,
          status: settlement.status,
          isFullPayment: settlement.isFullPayment,
          amount: amount.toNumber(),
          rentPortion: settlement.rentPortion.toNumber(),
          chargesPortion: settlement.chargesPortion.toNumber(),
          // Freeze what the month OWED on the figures this settlement was decided
          // on. A receipt generated later must print these, not whatever the lease
          // says by then: an IRL revision between the payment and the download
          // used to print the new rent on a receipt for money received at the old
          // one (AGENTS.md 14). `period.lease` is the same source the settlement
          // above was derived from, so the receipt and the ledger cannot disagree.
          receiptRentAmount: new Decimal(period.lease.rentAmount).toDecimalPlaces(2).toNumber(),
          receiptChargesAmount: new Decimal(period.lease.chargesAmount ?? 0).toDecimalPlaces(2).toNumber(),
        }
      : {
          // Still short: the month stays unpaid and collectable, its balance drops
          // to what is owed. The caller records the payment as its own row.
          amount: remaining.toNumber(),
          status: "PENDING",
          isFullPayment: false,
        };

    if (payment.paymentMethod) {
      data.paymentMethod = payment.paymentMethod as PaymentMethod;
    }
    if (payment.bank && closed) {
      data.bankTransactionId = payment.bank.transactionId;
      data.bankMatchedAt = payment.bank.matchedAt;
      data.bankRawData = payment.bank.rawData;
    }

    // Compare-and-set on the balance that was read. `paidAt: null` alone let two
    // transfers each believe they were the first; adding the amount means the
    // loser updates nothing and re-reads instead of clobbering the winner.
    const result = await db.transaction.updateMany({
      where: { id: period.id, paidAt: null, amount: period.amount },
      data,
    });

    if (result.count > 0) {
      return {
        applied: true,
        closed,
        settlement,
        remaining: closed ? new Decimal(0) : remaining,
      };
    }
    // Lost the race: another payment moved the balance. Re-read and re-derive.
  }

  return {
    applied: false,
    closed: false,
    settlement: EMPTY_SETTLEMENT,
    remaining: new Decimal(0),
  };
}

/**
 * Find the unpaid rent period covering a payment's period, if any.
 * Matching is by calendar month so a payment lands on its obligation.
 *
 * `userId` is part of the query, not a check afterwards: a lease belonging to
 * somebody else must yield nothing rather than another landlord's period
 * (AGENTS.md 7-8). Optional only for the callers that already proved ownership
 * of the lease in the same request.
 */
export async function findUnpaidPeriod(
  leaseId: string,
  periodStart: Date,
  userId?: string,
  db: Db = prisma
): Promise<{
  id: string;
  amount: Prisma.Decimal;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
} | null> {
  const month = periodStart.toISOString().slice(0, 7);
  const candidate = await db.transaction.findFirst({
    where: {
      leaseId,
      paidAt: null,
      status: { in: ["PENDING", "LATE", "PARTIAL"] },
      ...(userId ? { userId } : {}),
    },
    orderBy: { periodStart: "asc" },
    select: {
      id: true,
      amount: true,
      periodStart: true,
      periodEnd: true,
      dueDate: true,
    },
  });
  if (!candidate) return null;
  // The caller's dates are replaced by the row's own: a payload naming one
  // month's period with another month's dates must book on the row's month.
  return candidate.periodStart.toISOString().slice(0, 7) === month
    ? {
        id: candidate.id,
        amount: candidate.amount,
        periodStart: candidate.periodStart,
        periodEnd: candidate.periodEnd,
        dueDate: candidate.dueDate,
      }
    : null;
}
