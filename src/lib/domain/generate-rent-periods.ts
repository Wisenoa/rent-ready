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
 *
 * WHEN DOES A RENT REVISION APPLY?
 *
 * This is the rule, stated here because the answer was previously implicit and
 * the code could be read either way. Generation never rewrites a period that
 * already exists — that is what the `taken` filter below does.
 *
 *   A revision applies to the months that HAVE NOT BEEN MATERIALISED YET. Every
 *   period already written keeps the amount it was created with.
 *
 * Each consequence is a decision, not an oversight:
 *
 *   - The month IN PROGRESS keeps its amount if anything has already been paid
 *     on it. The tenant was asked for a specific balance and paid part of it;
 *     re-rating it would change what they legitimately owe. When NOTHING has
 *     been paid, a manual amendment DOES reach it: `rerateUnpaidRentPeriods`
 *     exists for that, and `updateLease` calls it. A revision applied through
 *     the IRL path (`applyRentRevision`) does not, because an IRL revision is a
 *     change of the contract going forward, not a correction of a figure the
 *     landlord typed wrong. Both behaviours are deliberate and they differ.
 *
 *   - A month already PAID keeps its amount, and its receipt keeps the figures
 *     it was issued against (`receiptRentAmount` / `receiptChargesAmount`, frozen
 *     at payment time, AGENTS.md 14). Financial history is append-oriented: it
 *     is never silently rewritten to match a later decision.
 *
 *   - Every month AFTER the revision takes the new amount, because it is
 *     materialised after the revision was applied and reads the lease's current
 *     `rentAmount` / `chargesAmount`.
 *
 * `month-rollover.db.test.ts` and `rent-revision.db.test.ts` execute both halves
 * of this against the real database.
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

/**
 * Re-rate a lease's UNPAID periods after its rent or charges changed.
 *
 * This is what a manual amendment (`updateLease`) calls, and it replaces a
 * `deleteMany({ paidAt: null })` followed by a regeneration. That deletion was
 * destroying the balance of any month that had taken a PARTIAL payment: the
 * obligation row was dropped while the receipt beside it survived, so the month
 * was left with money received and nothing owed, and `findUnpaidPeriod` — the
 * only thing that offers a month for collection — returned nothing. Verified on
 * the real database: a February paid 300 of 800 became uncollectable for the
 * remaining 500 EUR after an unrelated rent correction, with no way to reach it
 * through any screen.
 *
 * WHAT IS RE-RATED, AND WHY
 *
 *   - Periods with NO payment recorded against them are re-rated to the lease's
 *     new figures. Nothing was invoiced or collected at the old amount, so
 *     there is no history to contradict.
 *   - Periods that already took a payment keep their figures. The tenant was
 *     asked for a specific balance and paid part of it; changing the number
 *     under them mid-month would alter what they legitimately owe. Their
 *     balance simply stays what it was.
 *
 * The month in progress is therefore re-rated when nothing has been paid on it
 * and left alone as soon as something has — which is the same rule generation
 * applies to a revision, expressed on the rows rather than on their absence.
 *
 * Settled history is untouched: a PAID row keeps its amount and the frozen
 * `receiptRentAmount` / `receiptChargesAmount` its receipt was issued against
 * (AGENTS.md 11, 14).
 *
 * Returns how many periods were re-rated, so a caller can tell a rent change
 * that reached nothing from one that did not run.
 */
export async function rerateUnpaidRentPeriods(leaseId: string): Promise<number> {
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    select: { id: true, rentAmount: true, chargesAmount: true },
  });
  if (!lease) return 0;

  const rent = new Decimal(lease.rentAmount).toDecimalPlaces(2);
  const charges = new Decimal(lease.chargesAmount ?? 0).toDecimalPlaces(2);
  const total = rent.plus(charges).toDecimalPlaces(2);

  const openPeriods = await prisma.transaction.findMany({
    where: { leaseId, paidAt: null, status: { not: "CANCELLED" } },
    select: { id: true, periodStart: true, periodEnd: true },
  });

  let rerated = 0;
  for (const period of openPeriods) {
    // A month that took any payment keeps its figures — see the note above.
    const received = await prisma.transaction.findFirst({
      where: {
        leaseId,
        periodStart: period.periodStart,
        periodEnd: period.periodEnd,
        paidAt: { not: null },
        status: { not: "CANCELLED" },
      },
      select: { id: true },
    });
    if (received) continue;

    await prisma.transaction.update({
      where: { id: period.id },
      data: {
        amount: total.toNumber(),
        rentPortion: rent.toNumber(),
        chargesPortion: charges.toNumber(),
      },
    });
    rerated += 1;
  }
  return rerated;
}

/**
 * Generate periods for every active lease of a user (or all users when omitted),
 * and move leases whose term has run out to EXPIRED.
 *
 * WHY THE STATUS IS CORRECTED HERE
 *
 * `LeaseStatus` carries EXPIRED and nothing ever set it: the only writers were
 * `createLease` (ACTIVE) and `terminateLease` (TERMINATED). So a fixed-term lease
 * whose `endDate` passed kept reading ACTIVE forever — shown as active on the
 * leases list, reported as an active lease by the tenant portal, and re-scanned
 * by this job every single day for the rest of its life.
 *
 * The financial side was already right, which is why this was easy to miss:
 * `buildRentPeriod` bounds the range by `endDate`, so generation stopped at the
 * last month of the term and no rent was ever owed past it. Verified on the real
 * database — a three-year lease read two months past its `endDate` had generated
 * exactly its 36 contractual months and nothing more. What was wrong was the
 * LANDLORD'S PICTURE of the lease, not the ledger.
 *
 * This is the natural place for it: the job already reads every active lease
 * every day, so the correction costs one comparison on rows it has in hand, and
 * it needs no scheduler of its own. It is deliberately not a read-time
 * derivation, because the status is what the UI filters and the portal reports —
 * a value that is only correct when someone happens to look would still be
 * wrong in every export and every query that reads the column directly.
 *
 * A month-granular comparison, matching `buildRentPeriod`: a lease ending the
 * 31st is not EXPIRED until the following month begins, because rent for its
 * final month is still owed and still collectable.
 */
export async function generateRentPeriodsForAllLeases(
  userId?: string,
  now: Date = new Date()
): Promise<{ leases: number; created: number; expired: number }> {
  const leases = await prisma.lease.findMany({
    where: {
      status: "ACTIVE",
      ...(userId ? { userId } : {}),
    },
    select: { id: true, endDate: true },
  });

  // Anything whose final month has closed. Compared on the calendar month so a
  // lease ending on the 31st survives until the 1st of the next month.
  const lastCollectableMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );
  const ended = leases.filter(
    (l) => l.endDate && l.endDate.getTime() < lastCollectableMonth.getTime()
  );

  let expired = 0;
  if (ended.length > 0) {
    const result = await prisma.lease.updateMany({
      where: { id: { in: ended.map((l) => l.id) }, status: "ACTIVE" },
      data: { status: "EXPIRED" },
    });
    expired = result.count;
  }

  let created = 0;
  for (const lease of leases) {
    // A lease that just expired has had its final month generated by earlier
    // runs; generating again is a harmless no-op, and `generateRentPeriodsForLease`
    // returns 0 for it now that the status is EXPIRED.
    const result = await generateRentPeriodsForLease(lease.id, now);
    created += result.created;
  }
  return { leases: leases.length, created, expired };
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
        // What the MONTH was invoiced at, as distinct from what the lease says
        // today. See the note on the freeze below.
        rentPortion: true,
        chargesPortion: true,
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

    // What the MONTH owes, which is not always what the lease says TODAY.
    //
    // A month that took a payment keeps the figures it was invoiced at when the
    // rent is revised (see `rerateUnpaidRentPeriods`), so `lease.rentAmount` is
    // the wrong source for it: it described a February invoiced at 800 as owing
    // 900, and the receipt froze 900 for a month whose first instalment had been
    // issued against 800. The period row carries the month's own split —
    // `rentPortion` + `chargesPortion` are written at generation and left alone
    // while the month stays open, so together they are what was invoiced.
    //
    // The lease remains the fallback for a row that predates that split, which is
    // the only case where the two can disagree and the row has nothing to say.
    // The row's split is trusted only when it ADDS UP to what the lease says the
    // month owes. A row written before the split existed carries the whole
    // obligation in `rentPortion` with `chargesPortion` at zero, and believing that
    // would move 120.05 EUR of charges into the rent column on the 2577 report.
    // The lease stays the fallback for those, and for any row whose figures
    // disagree with it — which is precisely the case where the row is not
    // describing the month's obligation.
    //
    // Everything is wrapped before use: a caller may pass a Prisma client or a
    // stand-in whose Decimals arrive as plain strings.
    const leaseCharges = new Decimal(period.lease.chargesAmount ?? 0);
    const rowCharges = new Decimal(period.chargesPortion ?? 0);
    // The charges column is the discriminator. Checking only that the row's two
    // columns add up to the month's total is not enough: a row that carries the
    // WHOLE obligation in `rentPortion` with `chargesPortion` at zero still sums
    // correctly, and believing it moves every euro of charges into the rent
    // column — which is the 2577 fiscal line. When the row's charges agree with the
    // lease's, the row is describing the month's split and is authoritative even
    // when the lease has since been revised; when they disagree, the row predates
    // the split and the lease is the only source there is.
    const rowIsAuthoritative = rowCharges.eq(leaseCharges);
    const invoicedCharges = rowIsAuthoritative ? rowCharges : leaseCharges;
    const invoicedRent = rowIsAuthoritative
      ? new Decimal(period.rentPortion)
      : new Decimal(period.lease.rentAmount);

    const settlement = settlePeriodPayments({
      rentAmount: invoicedRent,
      chargesAmount: invoicedCharges,
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
    // The month's own invoiced figures, not the lease's current ones — same
    // reason as the settlement above, and it is what keeps the ceiling equal to
    // the balance a revised-but-already-paid month was left at.
    const owedAfterReceipts = Decimal.max(
      invoicedRent.plus(invoicedCharges).minus(received),
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
          // one (AGENTS.md 14). These are the SAME `invoicedRent` /
          // `invoicedCharges` the settlement above was derived from, so the
          // receipt and the ledger cannot disagree.
          receiptRentAmount: invoicedRent.toDecimalPlaces(2).toNumber(),
          receiptChargesAmount: invoicedCharges.toDecimalPlaces(2).toNumber(),
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
  /** What the month was invoiced at, so the caller settles it at those figures. */
  rentPortion: Prisma.Decimal;
  chargesPortion: Prisma.Decimal;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
} | null> {
  const month = periodStart.toISOString().slice(0, 7);
  // Match the month IN THE QUERY, not by comparing the row afterwards.
  //
  // It used to fetch the lease's oldest unpaid period whatever the caller asked
  // for, then return null when that row was not the requested month. So a lease
  // with January and March both unpaid could only ever collect January by date:
  // asking for March returned null, and the payment door fell through to a path
  // with no materialised period, which derives the month's obligation from the
  // CURRENT lease rent and re-invoices an arrears month that had a payment
  // recorded against it. On a lease where the rent was revised after March's
  // partial payment, that meant demanding 900 EUR of a month the tenant had been
  // asked for 800 and had already paid 400 of.
  //
  // The month comparison is not a filter this can be relaxed on: it is what stops
  // a payload naming one month's id or dates with another's, and it is why the
  // row's own dates replace whatever was posted (AGENTS.md 8).
  const candidate = await db.transaction.findFirst({
    where: {
      leaseId,
      paidAt: null,
      status: { in: ["PENDING", "LATE", "PARTIAL"] },
      // Same instant as the first day of the requested month. `periodStart` is
      // always stored as the first of the month (see `buildRentPeriod`), so this
      // is an equality, not a range.
      periodStart: new Date(`${month}-01T00:00:00.000Z`),
      ...(userId ? { userId } : {}),
    },
    orderBy: { periodStart: "asc" },
    select: {
      id: true,
      amount: true,
      rentPortion: true,
      chargesPortion: true,
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
        rentPortion: candidate.rentPortion,
        chargesPortion: candidate.chargesPortion,
        periodStart: candidate.periodStart,
        periodEnd: candidate.periodEnd,
        dueDate: candidate.dueDate,
      }
    : null;
}
