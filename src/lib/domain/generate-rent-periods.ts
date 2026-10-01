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
import Decimal from "decimal.js";

export interface GenerationResult {
  created: number;
  skipped: number;
  periods: Array<{ periodStart: Date; totalDue: string }>;
}

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
 * Settle a generated rent period with a payment.
 *
 * The period and the payment are the SAME row: a generated period holds what is
 * owed, and recording a payment converts it to what was received. Creating a
 * second row instead double-counted the period (summing `amount` across the month
 * returned owed + paid).
 *
 * Returns the updated row, or null when the period does not exist (a payment
 * recorded for a month that was never generated, which the payment endpoint
 * handles by inserting).
 */
export async function settleRentPeriod(
  periodTransactionId: string,
  payment: {
    amount: Prisma.Decimal | Decimal | number;
    rentPortion: Prisma.Decimal | Decimal | number;
    chargesPortion: Prisma.Decimal | Decimal | number;
    paidAt: Date;
    paymentMethod?: string;
    status: "PAID" | "PARTIAL";
    isFullPayment: boolean;
  }
): Promise<boolean> {
  const data: Prisma.TransactionUpdateManyMutationInput = {
    amount: new Decimal(payment.amount).toNumber(),
    rentPortion: new Decimal(payment.rentPortion).toNumber(),
    chargesPortion: new Decimal(payment.chargesPortion).toNumber(),
    paidAt: payment.paidAt,
    status: payment.status,
    isFullPayment: payment.isFullPayment,
  };
  if (payment.paymentMethod) {
    data.paymentMethod = payment.paymentMethod as PaymentMethod;
  }

  const result = await prisma.transaction.updateMany({
    where: { id: periodTransactionId, paidAt: null },
    data,
  });
  return result.count > 0;
}

/**
 * Find the unpaid rent period covering a payment's period, if any.
 * Matching is by calendar month so a payment lands on its obligation.
 */
export async function findUnpaidPeriod(
  leaseId: string,
  periodStart: Date
): Promise<{ id: string; amount: Prisma.Decimal } | null> {
  const month = periodStart.toISOString().slice(0, 7);
  const candidate = await prisma.transaction.findFirst({
    where: { leaseId, paidAt: null, status: { in: ["PENDING", "LATE", "PARTIAL"] } },
    orderBy: { periodStart: "asc" },
    select: { id: true, amount: true, periodStart: true },
  });
  if (!candidate) return null;
  return candidate.periodStart.toISOString().slice(0, 7) === month
    ? { id: candidate.id, amount: candidate.amount }
    : null;
}
