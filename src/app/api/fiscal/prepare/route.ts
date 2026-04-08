import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";

/**
 * GET /api/fiscal/prepare
 *
 * Prepares 2577 declaration data: revenue and expense report per property
 * for a given tax year. Groups by property for the owner to fill in the
 * form 2577 (déclaration des revenus fonciers) easily.
 *
 * Query params:
 *   year  — tax year (default: current year - 1)
 */
export async function GET(request: NextRequest) {
  const userId = await getAuthenticatedUserId();
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const defaultYear = now.getFullYear() - 1;
  const year = parseInt(searchParams.get("year") ?? String(defaultYear), 10);

  if (isNaN(year) || year < 2000 || year > 2050) {
    return NextResponse.json(
      { error: "Année invalide." },
      { status: 400 }
    );
  }

  const periodStart = new Date(year, 0, 1);
  const periodEnd = new Date(year + 1, 0, 1);

  // Fetch all properties for user
  const properties = await prisma.property.findMany({
    where: { userId },
    include: {
      leases: {
        where: { status: "ACTIVE" },
        include: {
          transactions: {
            where: {
              status: { in: ["PAID", "PARTIAL"] },
              periodStart: { gte: periodStart, lt: periodEnd },
            },
            select: {
              id: true,
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

  const propertyReports = properties.map((property) => {
    const activeLease = property.leases[0];
    const txList = activeLease?.transactions ?? [];

    // Revenue
    const totalRentReceived = txList.reduce((sum, tx) => sum + tx.rentPortion, 0);
    const totalChargesReceived = txList.reduce(
      (sum, tx) => sum + tx.chargesPortion,
      0
    );
    const totalReceived = totalRentReceived + totalChargesReceived;

    // Expenses by category
    const expensesByCategory: Record<string, number> = {};
    for (const exp of property.expenses) {
      expensesByCategory[exp.category] =
        (expensesByCategory[exp.category] ?? 0) + exp.amount;
    }
    const totalExpenses = Object.values(expensesByCategory).reduce(
      (s, v) => s + v,
      0
    );

    // Net income
    const netIncome = totalRentReceived - totalExpenses;

    // Occupancy
    const monthsWithPayment = new Set(
      txList
        .filter((tx) => tx.paidAt)
        .map((tx) => {
          const d = new Date(tx.paidAt!);
          return `${d.getFullYear()}-${d.getMonth()}`;
        })
    ).size;
    const occupancyMonths = monthsWithPayment;

    return {
      propertyId: property.id,
      propertyName: property.name,
      addressLine1: property.addressLine1,
      postalCode: property.postalCode,
      city: property.city,
      cadastralRef: property.cadastralRef,
      // Active lease info
      activeLeaseId: activeLease?.id ?? null,
      tenantName: activeLease
        ? `${activeLease.tenant.firstName} ${activeLease.tenant.lastName}`
        : null,
      // Revenue
      totalRentReceived,
      totalChargesReceived,
      totalReceived,
      // Expenses
      expensesByCategory,
      totalExpenses,
      // Net
      netIncome,
      // Occupancy
      occupancyMonths,
      // Detail
      transactionDetails: txList.map((tx) => ({
        id: tx.id,
        amount: tx.amount,
        rentPortion: tx.rentPortion,
        chargesPortion: tx.chargesPortion,
        paidAt: tx.paidAt,
        periodStart: tx.periodStart,
      })),
      expenseDetails: property.expenses.map((exp) => ({
        id: exp.id,
        amount: exp.amount,
        category: exp.category,
        description: exp.description,
        vendorName: exp.vendorName,
        date: exp.date,
      })),
    };
  });

  // Global totals across all properties
  const globalTotalRent = propertyReports.reduce(
    (s, p) => s + p.totalRentReceived,
    0
  );
  const globalTotalExpenses = propertyReports.reduce(
    (s, p) => s + p.totalExpenses,
    0
  );
  const globalNetIncome = globalTotalRent - globalTotalExpenses;

  // Aggregate expenses across all properties
  const globalExpensesByCategory: Record<string, number> = {};
  for (const prop of propertyReports) {
    for (const [cat, amt] of Object.entries(prop.expensesByCategory)) {
      globalExpensesByCategory[cat] = (globalExpensesByCategory[cat] ?? 0) + amt;
    }
  }

  return NextResponse.json({
    year,
    declarant: {
      userId,
      // Name and address would be enriched from user profile if available
    },
    summary: {
      propertyCount: properties.length,
      globalTotalRent: globalTotalRent,
      globalTotalExpenses: globalTotalExpenses,
      globalNetIncome: globalNetIncome,
      globalExpensesByCategory,
    },
    properties: propertyReports,
  });
}
