/**
 * The exceptions a landlord has to act on today.
 *
 * `getDashboardStats` already aggregates arrears — `revenue.late` is the sum of
 * unpaid rows past their due date — but nothing ever showed the owner WHICH
 * months, and the figure itself was never displayed. A landlord with two months
 * overdue saw a dashboard of totals and no exception.
 *
 * The query below selects the rows by exactly the predicate `revenue.late` sums
 * (`paidAt: null, dueDate < now`, scoped to the owner), so the list and the
 * counter cannot drift: the sum of `remaining` here IS `revenue.late`, row for
 * row and to the cent. Reusing the derived presentation primitives
 * (`settlePeriod` for status, `daysLate` for lateness) keeps the label honest —
 * nothing in the codebase writes a `LATE` status, so switching on `status`
 * reported overdue rent as merely pending (verified: 3,200 EUR overdue rendered
 * as "En attente" on /billing).
 *
 * The period row carries the balance STILL OWED — a partial payment reduces it
 * and leaves `paidAt` null, so the obligation survives and keeps being
 * collectable. `totalDue` and `alreadyPaid` are recovered from the sibling
 * receipt rows, exactly as `computeDuePeriods` does, which is what lets the UI
 * say "570,55 / 970,55" instead of an unexplained balance.
 */

import Decimal from "decimal.js";
import { prisma } from "@/lib/prisma";
import { settlePeriod, type RentPeriodStatus } from "@/lib/domain/rent-periods";
import { daysLate as daysPastDue } from "@/lib/domain/period-presentation";

export interface RentException {
  /** The `Transaction` row materialising the unpaid period. */
  transactionId: string;
  leaseId: string;
  periodStart: Date;
  dueDate: Date;
  /** Rent + charges owed for the month, decimal string. */
  totalDue: string;
  /** Already received against this month, decimal string. */
  alreadyPaid: string;
  /**
   * What is left to collect, decimal string.
   *
   * Taken from the row itself rather than re-derived: `revenue.late` sums that
   * same column, so reading it here is what makes the dashboard's counter and
   * this list agree to the cent.
   */
  remaining: string;
  /** Whole days past the due date. Never negative. */
  daysLate: number;
  status: RentPeriodStatus;
  tenant: { firstName: string; lastName: string };
  property: { name: string };
}

const PERIOD_SELECT = {
  id: true,
  leaseId: true,
  periodStart: true,
  periodEnd: true,
  dueDate: true,
  amount: true,
  paidAt: true,
  status: true,
} as const;

/** `2026-10-01T00:00:00.000Z` -> `2026-10`, the key receipts are grouped by. */
function monthKey(periodStart: Date): string {
  return periodStart.toISOString().slice(0, 7);
}

/**
 * Unpaid, past-due rent periods for one landlord, most overdue first.
 *
 * `userId` is part of the query, not a check afterwards (AGENTS.md 7-8): a period
 * belonging to somebody else yields nothing rather than another landlord's
 * balance.
 *
 * Two queries rather than one per exception: a landlord with fifty overdue
 * months should not cost fifty round-trips on every dashboard render.
 */
export async function getRentExceptions(
  userId: string,
  now: Date = new Date()
): Promise<RentException[]> {
  // The same predicate `getDashboardStats` sums for `revenue.late`. Changing one
  // without the other is what would put two different arrears totals on two
  // screens, so it is written once, here, and read by both.
  const open = await prisma.transaction.findMany({
    where: { userId, paidAt: null, dueDate: { lt: now } },
    select: {
      ...PERIOD_SELECT,
      lease: {
        select: {
          property: { select: { name: true } },
          tenant: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  if (open.length === 0) return [];

  // Money already received for those months. A CANCELLED receipt keeps its
  // amount for the audit trail but is not money received, so it is excluded here
  // rather than filtered out of the ledger.
  const receipts = await prisma.transaction.findMany({
    where: {
      userId,
      leaseId: { in: open.map((row) => row.leaseId) },
      paidAt: { not: null },
      status: { not: "CANCELLED" },
    },
    select: { leaseId: true, periodStart: true, amount: true },
  });

  const receivedByMonth = new Map<string, Decimal>();
  for (const receipt of receipts) {
    const key = `${receipt.leaseId}|${monthKey(receipt.periodStart)}`;
    const previous = receivedByMonth.get(key) ?? new Decimal(0);
    receivedByMonth.set(key, previous.plus(new Decimal(receipt.amount)));
  }

  return open
    .map((row) => {
      const remaining = new Decimal(row.amount).toDecimalPlaces(2);
      const alreadyPaid = (
        receivedByMonth.get(`${row.leaseId}|${monthKey(row.periodStart)}`) ??
        new Decimal(0)
      ).toDecimalPlaces(2);
      const totalDue = remaining.plus(alreadyPaid);
      // Derived, never read from the stored status: nothing writes `LATE`, so a
      // switch on `status` called every overdue month "En attente".
      const settlement = settlePeriod(totalDue, alreadyPaid, row.dueDate, now);

      return {
        transactionId: row.id,
        leaseId: row.leaseId,
        periodStart: row.periodStart,
        dueDate: row.dueDate,
        totalDue: totalDue.toFixed(2),
        alreadyPaid: alreadyPaid.toFixed(2),
        remaining: remaining.toFixed(2),
        daysLate: daysPastDue(row.dueDate, now),
        status: settlement.status,
        tenant: row.lease.tenant,
        property: row.lease.property,
      };
    })
    // A row at zero has nothing to collect, so it is not an exception asking for
    // an action. It would still be counted in `revenue.late` as 0.00, which is
    // why dropping it here cannot change the total the two screens display.
    .filter((exception) => new Decimal(exception.remaining).gt(0));
}