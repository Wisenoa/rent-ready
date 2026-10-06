/**
 * Reading the rent periods a landlord can collect right now.
 *
 * Ownership is part of the query, not a check afterwards: a lease id coming from
 * a client component is never trusted on its own (AGENTS.md 7-8).
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { computeDuePeriods, type DuePeriod } from "@/lib/domain/due-periods";

/** Every row of a lease that carries period information, paid or not. */
const PERIOD_SELECT = {
  id: true,
  periodStart: true,
  periodEnd: true,
  dueDate: true,
  amount: true,
  paidAt: true,
  // `computeDuePeriods` needs it to leave CANCELLED rows out of both the
  // obligation and the receipts: a cancelled payment must make the month
  // collectable again, not disappear from the ledger's totals.
  status: true,
} as const;

/**
 * Collectable periods for one lease, oldest first.
 *
 * Scoped by `userId`: a lease belonging to somebody else yields an empty list
 * rather than an error, and never another landlord's money.
 */
export async function getDuePeriodsForLease(
  userId: string,
  leaseId: string
): Promise<DuePeriod[]> {
  const rows = await prisma.transaction.findMany({
    where: { userId, leaseId },
    select: PERIOD_SELECT,
    orderBy: { periodStart: "asc" },
  });
  return computeDuePeriods(rows);
}

/**
 * Resolve the rent period a payment settles.
 *
 * The id comes from the browser, so it is untrusted: it is looked up scoped to
 * the authenticated landlord AND to the lease named in the same submission, and
 * it must still be unpaid. Returns null when no such period exists, which the
 * caller must treat as a refusal rather than a fallback to the posted dates —
 * otherwise a hand-crafted POST settles somebody else's rent period.
 *
 * `amount` is returned so the caller can re-derive the collectable balance
 * server-side. The browser is not a trust boundary (AGENTS.md 6): the dialog's
 * `max` attribute is ergonomics, not an invariant.
 */
export async function resolveDuePeriod(
  userId: string,
  leaseId: string,
  duePeriodId: string
): Promise<{
  id: string;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  amount: Prisma.Decimal;
} | null> {
  return prisma.transaction.findFirst({
    where: { id: duePeriodId, leaseId, userId, paidAt: null },
    select: {
      id: true,
      periodStart: true,
      periodEnd: true,
      dueDate: true,
      amount: true,
    },
  });
}

/**
 * Collectable periods for every lease of a landlord, keyed by lease id.
 *
 * One query rather than one per lease: the billing page needs all of them to feed
 * the payment dialog, and a landlord with fifty leases should not cost fifty
 * round-trips on every page render.
 */
export async function getDuePeriodsByLease(
  userId: string,
  leaseIds: string[]
): Promise<Record<string, DuePeriod[]>> {
  if (leaseIds.length === 0) return {};

  const rows = await prisma.transaction.findMany({
    where: { userId, leaseId: { in: leaseIds } },
    select: { ...PERIOD_SELECT, leaseId: true },
    orderBy: { periodStart: "asc" },
  });

  const byLease = new Map<string, typeof rows>();
  for (const row of rows) {
    const bucket = byLease.get(row.leaseId);
    if (bucket) bucket.push(row);
    else byLease.set(row.leaseId, [row]);
  }

  const result: Record<string, DuePeriod[]> = {};
  for (const leaseId of leaseIds) {
    const leaseRows = byLease.get(leaseId);
    if (!leaseRows) continue;
    const periods = computeDuePeriods(leaseRows);
    if (periods.length > 0) result[leaseId] = periods;
  }
  return result;
}