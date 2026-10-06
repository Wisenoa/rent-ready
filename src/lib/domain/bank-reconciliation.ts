/**
 * Choosing the rent period a bank transfer belongs to.
 *
 * The Bridge webhook used to pick a period by comparing the incoming amount with
 * `lease.rentAmount + lease.chargesAmount` over an unfiltered `take: 20` of the
 * user's pending rows. That is not the rent period model the rest of the
 * application uses: a period row carries the BALANCE STILL OWED, which changes
 * with every payment, and money received lives in sibling rows. Matching on the
 * lease's contractual total therefore matched nothing after the first payment and
 * could settle the wrong month, because nothing looked at the transfer's date.
 *
 * So this module answers one question, purely, from real state: which open
 * period (if any) does this incoming transfer settle?
 *
 * Rules, in order:
 *
 *   1. Only periods with a balance still owed (> 0) are eligible. A closed month
 *      is not reopened by a transfer.
 *   2. An exact cover of the balance (within one cent) wins, oldest due date
 *      first. This is the case that must never be missed: rent paid in full.
 *   3. Otherwise a partial is accepted only for the period covering the
 *      TRANSFER'S OWN MONTH, and only above MIN_AUTO_PARTIAL. A €12 grocery
 *      transfer received in October must not be written onto October's €900
 *      balance; below the floor the transfer is as likely to be unrelated money
 *      as rent, so it goes to human confirmation instead (AGENTS.md §13).
 *   4. An amount ABOVE the balance is never auto-applied — an overpayment has to
 *      be confirmed by a human, never silently allocated.
 *
 * Anything that does not match returns null and the caller writes nothing. Money
 * that cannot be attributed with confidence stays visible as a pending case
 * rather than becoming a false amount.
 */

import Decimal from "decimal.js";

/** Amounts within a cent of each other are the same amount. */
export const AUTO_MATCH_TOLERANCE = new Decimal("0.01");

/**
 * Floor below which a short transfer is not auto-applied to a period.
 *
 * A bank feed carries every incoming movement. Without this floor any unrelated
 * credit (a refund, a transfer between the landlord's own accounts) would be
 * booked as rent. Below the floor the case is recorded and left for a human.
 */
export const MIN_AUTO_PARTIAL = new Decimal("50");

export interface ReconcilablePeriod {
  id: string;
  /** Balance still owed on the period row (what the transfer would settle). */
  remaining: Decimal.Value;
  dueDate: Date;
  periodStart: Date;
  periodEnd: Date;
  leaseId?: string;
}

export interface IncomingTransfer {
  amount: Decimal.Value;
  /** The provider's value date: decides which month a payment belongs to. */
  date: Date;
}

function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/** Open periods with something left to collect, oldest due date first. */
function openPeriods(periods: ReconcilablePeriod[]): ReconcilablePeriod[] {
  return periods
    .filter((p) => new Decimal(p.remaining).gt(0))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

/**
 * The period this transfer settles, or null when nothing can be attributed with
 * confidence.
 */
export function matchTransferToPeriod(
  transfer: IncomingTransfer,
  periods: ReconcilablePeriod[]
): ReconcilablePeriod | null {
  const amount = new Decimal(transfer.amount);
  if (!amount.isFinite() || amount.lte(0)) return null;

  const open = openPeriods(periods);
  if (open.length === 0) return null;

  // 1. Exact cover of the balance still owed.
  const exact = open.find((p) =>
    new Decimal(p.remaining).minus(amount).abs().lte(AUTO_MATCH_TOLERANCE)
  );
  if (exact) return exact;

  // 2. Partial, but only against the month the transfer was received in, and only
  //    above the floor. An overpayment is excluded here on purpose.
  const key = monthKey(transfer.date);
  const partial = open.find((p) => {
    const remaining = new Decimal(p.remaining);
    return (
      monthKey(p.periodStart) === key &&
      amount.gte(MIN_AUTO_PARTIAL) &&
      amount.lt(remaining)
    );
  });

  return partial ?? null;
}