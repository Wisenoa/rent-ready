import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { getFiscalDeclaration, isValidFiscalYear } from "@/lib/queries/fiscal-prepare";

/**
 * GET /api/fiscal/prepare
 *
 * Prepares 2577 declaration data: revenue and expense report per property
 * for a given tax year. Groups by property for the owner to fill in the
 * form 2577 (déclaration des revenus fonciers) easily.
 *
 * The selection rule (which leases a declared year covers, and why the
 * current lease status must not decide it) lives in `getFiscalDeclaration` —
 * the same implementation renders the dashboard page, so the two cannot drift
 * apart on a figure that goes on a tax form.
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

  if (isNaN(year) || !isValidFiscalYear(year)) {
    return NextResponse.json(
      { error: "Année invalide." },
      { status: 400 }
    );
  }

  const declaration = await getFiscalDeclaration(userId, year);

  return NextResponse.json({
    year: declaration.year,
    declarant: {
      userId,
      // Name and address would be enriched from user profile if available
    },
    summary: declaration.summary,
    properties: declaration.properties.map((report) => ({
      ...report,
      // Serialised for JSON: Prisma Decimals are not plain numbers.
      transactionDetails: report.transactionDetails.map((tx) => ({
        id: tx.id,
        leaseId: tx.leaseId,
        amount: tx.amount.toNumber(),
        rentPortion: tx.rentPortion.toNumber(),
        chargesPortion: tx.chargesPortion.toNumber(),
        paidAt: tx.paidAt,
        periodStart: tx.periodStart,
        tenantName: tx.tenantName,
      })),
      expenseDetails: report.expenseDetails.map((exp) => ({
        id: exp.id,
        amount: exp.amount.toNumber(),
        category: exp.category,
        description: exp.description,
        vendorName: exp.vendorName,
        date: exp.date,
      })),
      leases: report.leases.map((lease) => ({
        id: lease.id,
        tenantName: lease.tenantName,
        status: lease.status,
        startDate: lease.startDate,
        endDate: lease.endDate,
      })),
    })),
  });
}
