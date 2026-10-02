/**
 * Which rent periods a landlord can actually collect right now.
 *
 * The payment dialog used to ask for two dates. A landlord typing today's month
 * by default paid September's rent into October's period, which produced a
 * quittance for the wrong month and left the real September balance showing as
 * unpaid. Dates are not a landlord's decision — the obligations already exist as
 * `PENDING` `Transaction` rows (see `./generate-rent-periods`), so this derives
 * what is due instead of asking.
 *
 * Pure and database-free: the caller fetches rows, this decides. The settlement
 * maths is delegated to `settlePeriod`, the single source of truth (AGENTS.md 11).
 *
 * WHAT A ROW MEANS. A generated period row carries the balance still OWED for its
 * month: the full obligation while untouched, then whatever is left after each
 * payment. Money actually received lives in separate payment rows sharing the
 * month. Settling a period therefore never overwrites the obligation with the
 * payment — an earlier version did, and a 400 EUR payment on a 970.55 EUR month
 * destroyed the obligation outright, leaving 570.55 EUR that nothing could ever
 * collect again. So `remaining` is the row itself and the sibling receipts are
 * added back to recover what the month was worth.
 */

import Decimal from "decimal.js";
import type { Prisma } from "@prisma/client";
import { settlePeriod, type RentPeriodStatus } from "@/lib/domain/rent-periods";

export interface DuePeriodRow {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  amount: Prisma.Decimal | Decimal | number | string;
  paidAt: Date | null;
}

/** A rent period with money left on it, serialisable for a client component. */
export interface DuePeriod {
  /** The `Transaction` row materialising the period. */
  transactionId: string;
  /** ISO day, e.g. `2026-10-01`. */
  periodStart: string;
  /** ISO day, e.g. `2026-10-31`. */
  periodEnd: string;
  /** ISO day, e.g. `2026-10-03`. */
  dueDate: string;
  /** Rent + charges owed, decimal string. */
  totalDue: string;
  /** Already received against this period, decimal string. */
  alreadyPaid: string;
  /** What is left to collect, decimal string. Never negative. */
  remaining: string;
  status: RentPeriodStatus;
}

const ISO_DAY_LENGTH = 10;
const MONTH_KEY_LENGTH = 7;

/** `2026-10-31T23:59:59.999Z` -> `2026-10-31`. */
export function toIsoDay(date: Date): string {
  return date.toISOString().slice(0, ISO_DAY_LENGTH);
}

function monthKey(date: Date): string {
  return date.toISOString().slice(0, MONTH_KEY_LENGTH);
}

/** First day of the current UTC month: periods starting later are not due yet. */
function currentMonthStart(now: Date): number {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
}

/**
 * Reduce raw period rows to the collectable periods, oldest first.
 *
 * A period row holds the balance still owed (`paidAt` null). Amounts already
 * received against the same month live in sibling rows with `paidAt` set — a
 * partial payment leaves the period unpaid and records the money separately, so
 * the obligation survives and the month keeps being offered.
 *
 * Periods with nothing left are dropped: there is no payment to record against a
 * settled period, and offering it would let the dialog book money twice.
 */
export function computeDuePeriods(
  rows: DuePeriodRow[],
  now: Date = new Date()
): DuePeriod[] {
  const unpaid = rows.filter((row) => row.paidAt === null);
  if (unpaid.length === 0) return [];

  const paidByMonth = new Map<string, Decimal>();
  for (const row of rows) {
    if (row.paidAt === null) continue;
    const key = monthKey(row.periodStart);
    paidByMonth.set(key, (paidByMonth.get(key) ?? new Decimal(0)).plus(row.amount));
  }

  const horizon = currentMonthStart(now);
  const due: DuePeriod[] = [];

  for (const row of unpaid) {
    // Generation stops at the current month, but a hand-inserted future period
    // is not owed yet: it must not be collectable.
    if (row.periodStart.getTime() > horizon) continue;

    // The row is the balance still owed; the siblings say how much of the month
    // has already arrived. `settlePeriod` derives the status from the two.
    const remaining = new Decimal(row.amount);
    const alreadyPaid = paidByMonth.get(monthKey(row.periodStart)) ?? new Decimal(0);
    const totalDue = remaining.plus(alreadyPaid);
    const settlement = settlePeriod(totalDue, alreadyPaid, row.dueDate, now);
    if (settlement.outstanding.lte(0)) continue;

    due.push({
      transactionId: row.id,
      periodStart: toIsoDay(row.periodStart),
      periodEnd: toIsoDay(row.periodEnd),
      dueDate: toIsoDay(row.dueDate),
      totalDue: totalDue.toDecimalPlaces(2).toString(),
      alreadyPaid: alreadyPaid.toDecimalPlaces(2).toString(),
      remaining: settlement.outstanding.toDecimalPlaces(2).toString(),
      status: settlement.status,
    });
  }

  return due.sort((a, b) => a.periodStart.localeCompare(b.periodStart));
}

/** French month label, e.g. `Octobre 2026`. Falls back to the ISO day. */
export function formatPeriodLabel(periodStart: string): string {
  const date = new Date(`${periodStart}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return periodStart;
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return periodStart;
  }
}