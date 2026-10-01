import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import Decimal from "decimal.js";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

// ============================================================
// GET /api/transactions/dashboard
//
// Returns a payment dashboard summary for the authenticated user.
//
// Query params:
//   months  number   number of months to include (default: 12, max: 24)
//   year    number   (optional) filter to specific year
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const months = Math.min(24, Math.max(1, parseInt(searchParams.get("months") ?? "12", 10)));
    const yearParam = searchParams.get("year");
    const specificYear = yearParam ? parseInt(yearParam, 10) : null;

    const now = new Date();

    // Build the period range
    const periods: Array<{ label: string; start: Date; end: Date }> = [];
    for (let i = 0; i < months; i++) {
      const d = subMonths(now, i);
      periods.push({
        label: d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" }),
        start: startOfMonth(d),
        end: endOfMonth(d),
      });
    }
    periods.reverse(); // oldest first for the response

    // All transactions for user in the period range
    const rangeStart = periods[0].start;
    const rangeEnd = periods[periods.length - 1].end;

    const where: Record<string, unknown> = {
      userId: session.user.id,
      // Lateness is derived from dueDate; no LATE status is ever stored.
      OR: [
        { status: { in: ["PAID", "PARTIAL"] } },
        { paidAt: null },
      ],
      dueDate: { gte: rangeStart, lte: rangeEnd },
    };

    // ── Parallelize independent queries ───────────────────────
    // Transaction fetch and active leases fetch run simultaneously.
    // By-property summary is computed from already-joined transaction data
    // (no extra query needed — property info is available via lease relation).
    const [transactions, activeLeases] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          lease: {
            select: {
              id: true,
              rentAmount: true,
              chargesAmount: true,
              property: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { dueDate: "asc" },
      }),
      prisma.lease.findMany({
        where: { userId: session.user.id, status: "ACTIVE" },
        select: {
          id: true,
          property: { select: { id: true, name: true } },
          rentAmount: true,
          chargesAmount: true,
        },
      }),
    ]);

    // ── Monthly breakdown ──────────────────────────────────
    const monthlyData: Record<
      string,
      {
        label: string;
        start: string;
        end: string;
        // Decimal until the response is built. These were `number` and summed with
        // `+=`, which string-concatenated the first Decimal into them.
        totalCollected: Decimal;
        totalExpected: Decimal;
        totalOutstanding: Decimal;
        collectionRate: number;
        paidCount: number;
        partialCount: number;
        pendingCount: number;
        lateCount: number;
      }
    > = {};

    for (const p of periods) {
      const key = p.label;
      monthlyData[key] = {
        label: p.label,
        start: p.start.toISOString(),
        end: p.end.toISOString(),
        totalCollected: new Decimal(0),
        totalExpected: new Decimal(0),
        totalOutstanding: new Decimal(0),
        collectionRate: 0,
        paidCount: 0,
        partialCount: 0,
        pendingCount: 0,
        lateCount: 0,
      };
    }

    for (const tx of transactions) {
      const periodKey = tx.dueDate.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      });
      if (!monthlyData[periodKey]) continue;

      const expected = new Decimal(tx.lease.rentAmount).plus(tx.lease.chargesAmount);

      if (tx.status === "PAID" || tx.status === "PARTIAL") {
        monthlyData[periodKey].totalCollected = monthlyData[periodKey].totalCollected.plus(
          tx.amount
        );
      }
      monthlyData[periodKey].totalExpected = monthlyData[periodKey].totalExpected.plus(
        expected
      );

      if (tx.status === "PAID") {
        monthlyData[periodKey].paidCount++;
      } else if (tx.status === "PARTIAL") {
        monthlyData[periodKey].partialCount++;
      } else if (tx.status === "LATE") {
        monthlyData[periodKey].lateCount++;
        monthlyData[periodKey].totalOutstanding = monthlyData[periodKey].totalOutstanding.plus(
          expected
        );
      } else if (tx.status === "PENDING") {
        monthlyData[periodKey].pendingCount++;
        monthlyData[periodKey].totalOutstanding = monthlyData[periodKey].totalOutstanding.plus(
          expected
        );
      }
    }

    // Compute collection rates and round
    const monthlyBreakdown = Object.values(monthlyData).map((m) => ({
      ...m,
      // Reduce once, at the JSON boundary, and round to the cent there.
      totalCollected: m.totalCollected.toDecimalPlaces(2).toNumber(),
      totalExpected: m.totalExpected.toDecimalPlaces(2).toNumber(),
      totalOutstanding: m.totalOutstanding.toDecimalPlaces(2).toNumber(),
      collectionRate: m.totalExpected.gt(0)
        ? m.totalCollected
            .dividedBy(m.totalExpected)
            .times(100)
            .toDecimalPlaces(2)
            .toNumber()
        : 0,
    }));

    // ── Grand totals ──────────────────────────────────────
    const grandTotalCollected = monthlyBreakdown.reduce(
      (s, m) => s + m.totalCollected,
      0
    );
    const grandTotalExpected = monthlyBreakdown.reduce(
      (s, m) => s + m.totalExpected,
      0
    );
    const grandTotalOutstanding = monthlyBreakdown.reduce(
      (s, m) => s + m.totalOutstanding,
      0
    );
    const grandCollectionRate =
      grandTotalExpected > 0
        ? Math.round((grandTotalCollected / grandTotalExpected) * 10000) / 100
        : 0;

    // ── By-property summary ────────────────────────────────
    // Uses the already-fetched activeLeases — no additional DB query needed.
    const propertyMap: Record<
      string,
      {
        propertyId: string;
        propertyName: string;
        // Decimal, like the monthly map: these were `number` and summed with `+=`,
        // which string-concatenated the first Decimal into them.
        totalCollected: Decimal;
        totalOutstanding: Decimal;
        activeLeases: number;
      }
    > = {};

    for (const lease of activeLeases) {
      const pid = lease.property.id;
      if (!propertyMap[pid]) {
        propertyMap[pid] = {
          propertyId: pid,
          propertyName: lease.property.name,
          // Must be Decimal, not 0: the accumulator is added to with .plus(), and
          // tsc checks the declared type, not the literal that was there.
          totalCollected: new Decimal(0),
          totalOutstanding: new Decimal(0),
          activeLeases: 0,
        };
      }
      propertyMap[pid].activeLeases++;
    }

    for (const tx of transactions) {
      if (tx.status === "PAID" || tx.status === "PARTIAL") {
        const pid = tx.lease.property.id;
        if (propertyMap[pid]) {
          propertyMap[pid].totalCollected = propertyMap[pid].totalCollected.plus(
            tx.amount
          );
        }
      }
    }

    const byProperty = Object.values(propertyMap).map((p) => ({
      ...p,
      totalCollected: Math.round(p.totalCollected * 100) / 100,
      totalOutstanding: Math.round(p.totalOutstanding * 100) / 100,
    }));

    // ── Recent transactions ─────────────────────────────────
    const recentTransactions = transactions
      .slice(-10)
      .map((tx) => ({
        id: tx.id,
        amount: tx.amount,
        status: tx.status,
        dueDate: tx.dueDate.toISOString(),
        paidAt: tx.paidAt?.toISOString() ?? null,
        periodStart: tx.periodStart.toISOString(),
        periodEnd: tx.periodEnd.toISOString(),
        propertyName: tx.lease.property.name,
        leaseId: tx.lease.id,
      }));

    return NextResponse.json({
      data: {
        summary: {
          totalCollected: Math.round(grandTotalCollected * 100) / 100,
          totalOutstanding: Math.round(grandTotalOutstanding * 100) / 100,
          totalExpected: Math.round(grandTotalExpected * 100) / 100,
          collectionRate: grandCollectionRate,
          currency: "EUR",
          periodMonths: months,
          generatedAt: new Date().toISOString(),
        },
        monthlyBreakdown,
        byProperty,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("GET /api/transactions/dashboard error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
