import Decimal from "decimal.js";
import { prisma } from "@/lib/prisma";

/**
 * The 2577 preparation for one tax year: rent and charges actually received, per
 * property, against the expenses of that same year.
 *
 * THE LINE IS SELECTED BY DECLARATION PERIOD, NOT BY CURRENT STATUS
 *
 * The query behind this used to be `leases: { where: { status: "ACTIVE" } }`,
 * which reads a tax declaration as "what is rented today". Those are different
 * questions, and the difference is worth money to the landlord:
 *
 * A lease that ran through 2025 and ended on 31/12/2025 was taxable for the whole
 * of 2025. Once it stops being current, that filter drops it — and the year
 * declares zero for rent that was received and is taxable. Measured on this
 * database: a 2025 lease with six 800 EUR payments, then a cron run in January
 * 2026, produced a 2577 line of 0.00 against 4 800.00 collected. Under-declaring
 * is the worst direction for a tax figure to be wrong in.
 *
 * The status filter was inert until `generateRentPeriodsForAllLeases` started
 * writing `EXPIRED` (nothing else ever did), so the clause could not exclude
 * anything and read as harmless. It was a latent under-declaration, not a
 * working rule. Writing the lease's real status is correct — a lease that ended
 * is not active — and the declaration has to stop depending on it.
 *
 * So the selection is: every lease whose TERM OVERLAPS the declared year
 * (started before it closed, and not finished before it opened), whatever its
 * status today. ACTIVE, TERMINATED and EXPIRED all appear, each for the months
 * it actually covered. A lease that starts in 2026 declares nothing in 2025.
 *
 * EVERY such lease is summed, not the first one. A property re-let mid-year
 * carries two leases over the same twelve months, and the second was silently
 * absent from the declaration — the same under-declaration, with no expiry
 * involved.
 *
 * One implementation, consumed by both the API route and the dashboard page: the
 * logic used to be duplicated verbatim, which is how a single wrong predicate
 * ended up maintained in two places.
 */

export type FiscalTransactionRow = {
  id: string;
  leaseId: string;
  amount: Decimal;
  rentPortion: Decimal;
  chargesPortion: Decimal;
  paidAt: Date | null;
  periodStart: Date;
  tenantName: string;
};

export type FiscalLeaseRef = {
  id: string;
  tenantName: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
};

export type FiscalPropertyReport = {
  propertyId: string;
  propertyName: string;
  addressLine1: string;
  postalCode: string;
  city: string;
  cadastralRef: string | null;
  /** Every lease covering any part of the declared year, oldest first. */
  leases: FiscalLeaseRef[];
  totalRentReceived: number;
  totalChargesReceived: number;
  totalReceived: number;
  expensesByCategory: Record<string, number>;
  totalExpenses: number;
  netIncome: number;
  /**
   * Months of the declared year that carried a payment, counted on the month
   * INVOICED (`periodStart`), not on the day the money arrived. A December rent
   * paid on 5 January belongs to December: counting it by `paidAt` moved it into
   * the following year's tally and left December looking empty.
   */
  occupancyMonths: number;
  transactionDetails: FiscalTransactionRow[];
  expenseDetails: Array<{
    id: string;
    amount: Decimal;
    category: string;
    description: string | null;
    vendorName: string | null;
    date: Date;
  }>;
};

export type FiscalDeclaration = {
  year: number;
  periodStart: Date;
  periodEnd: Date;
  properties: FiscalPropertyReport[];
  summary: {
    propertyCount: number;
    globalTotalRent: number;
    globalTotalExpenses: number;
    globalNetIncome: number;
    globalExpensesByCategory: Record<string, number>;
  };
};

export function isValidFiscalYear(year: number): boolean {
  return Number.isInteger(year) && year >= 2000 && year <= 2050;
}

export async function getFiscalDeclaration(
  userId: string,
  year: number
): Promise<FiscalDeclaration> {
  const periodStart = new Date(year, 0, 1);
  const periodEnd = new Date(year + 1, 0, 1);

  const properties = await prisma.property.findMany({
    where: { userId },
    include: {
      leases: {
        // Term overlapping the declared year — see the header. Not the status.
        where: {
          startDate: { lt: periodEnd },
          OR: [{ endDate: null }, { endDate: { gte: periodStart } }],
        },
        orderBy: { startDate: "asc" },
        include: {
          transactions: {
            where: {
              status: { in: ["PAID", "PARTIAL"] },
              periodStart: { gte: periodStart, lt: periodEnd },
            },
            select: {
              id: true,
              leaseId: true,
              amount: true,
              rentPortion: true,
              chargesPortion: true,
              paidAt: true,
              periodStart: true,
            },
          },
          tenant: { select: { firstName: true, lastName: true } },
        },
      },
      expenses: {
        where: { date: { gte: periodStart, lt: periodEnd } },
        select: {
          id: true,
          amount: true,
          category: true,
          description: true,
          vendorName: true,
          date: true,
        },
      },
    },
  });

  const reports: FiscalPropertyReport[] = properties.map((property) => {
    const leases: FiscalLeaseRef[] = property.leases.map((lease) => ({
      id: lease.id,
      tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
      status: lease.status,
      startDate: lease.startDate,
      endDate: lease.endDate,
    }));

    // Every lease of the year, not `leases[0]`: a re-let mid-year has two.
    const txList: FiscalTransactionRow[] = property.leases.flatMap((lease) =>
      lease.transactions.map((tx) => ({
        id: tx.id,
        leaseId: lease.id,
        amount: new Decimal(tx.amount),
        rentPortion: new Decimal(tx.rentPortion),
        chargesPortion: new Decimal(tx.chargesPortion),
        paidAt: tx.paidAt,
        periodStart: tx.periodStart,
        tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
      }))
    );

    // Decimal throughout: twelve months of receipts summed as floats is how a
    // declaration ends up a cent away from the ledger.
    const totalRentReceived = txList
      .reduce((sum, tx) => sum.plus(tx.rentPortion), new Decimal(0))
      .toNumber();
    const totalChargesReceived = txList
      .reduce((sum, tx) => sum.plus(tx.chargesPortion), new Decimal(0))
      .toNumber();

    const expensesByCategory: Record<string, number> = {};
    for (const exp of property.expenses) {
      expensesByCategory[exp.category] = new Decimal(
        expensesByCategory[exp.category] ?? 0
      )
        .plus(exp.amount)
        .toNumber();
    }
    const totalExpenses = Object.values(expensesByCategory).reduce((s, v) => s + v, 0);

    const invoicedMonths = new Set(
      txList
        .filter((tx) => tx.paidAt !== null)
        .map((tx) => {
          const d = tx.periodStart;
          return `${d.getFullYear()}-${d.getMonth()}`;
        })
    );

    return {
      propertyId: property.id,
      propertyName: property.name,
      addressLine1: property.addressLine1,
      postalCode: property.postalCode,
      city: property.city,
      cadastralRef: property.cadastralRef,
      leases,
      totalRentReceived,
      totalChargesReceived,
      totalReceived: totalRentReceived + totalChargesReceived,
      expensesByCategory,
      totalExpenses,
      netIncome: totalRentReceived - totalExpenses,
      occupancyMonths: invoicedMonths.size,
      transactionDetails: txList,
      expenseDetails: property.expenses,
    };
  });

  const globalTotalRent = reports.reduce((s, p) => s + p.totalRentReceived, 0);
  const globalTotalExpenses = reports.reduce((s, p) => s + p.totalExpenses, 0);

  const globalExpensesByCategory: Record<string, number> = {};
  for (const report of reports) {
    for (const [category, amount] of Object.entries(report.expensesByCategory)) {
      globalExpensesByCategory[category] = new Decimal(
        globalExpensesByCategory[category] ?? 0
      )
        .plus(amount)
        .toNumber();
    }
  }

  return {
    year,
    periodStart,
    periodEnd,
    properties: reports,
    summary: {
      propertyCount: reports.length,
      globalTotalRent,
      globalTotalExpenses,
      globalNetIncome: globalTotalRent - globalTotalExpenses,
      globalExpensesByCategory,
    },
  };
}
