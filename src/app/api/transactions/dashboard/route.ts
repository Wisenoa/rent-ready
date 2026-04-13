import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
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
      status: { in: ["PAID", "PARTIAL", "PENDING", "LATE"] },
      dueDate: { gte: rangeStart, lte: rangeEnd },
    };

    const transactions = await prisma.transaction.findMany({
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
    });

    // ── Monthly breakdown ──────────────────────────────────
    const monthlyData: Record<
      string,
      {
        label: string;
        start: string;
        end: string;
        totalCollected: number;
        totalExpected: number;
        totalOutstanding: number;
        collectionRate: number; // percentage 0-100
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
        totalCollected: 0,
        totalExpected: 0,
        totalOutstanding: 0,
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

      const expected = tx.lease.rentAmount + tx.lease.chargesAmount;

      if (tx.status === "PAID" || tx.status === "PARTIAL") {
        monthlyData[periodKey].totalCollected += tx.amount;
      }
      monthlyData[periodKey].totalExpected += expected;

      if (tx.status === "PAID") {
        monthlyData[periodKey].paidCount++;
      } else if (tx.status === "PARTIAL") {
        monthlyData[periodKey].partialCount++;
      } else if (tx.status === "LATE") {
        monthlyData[periodKey].lateCount++;
        monthlyData[periodKey].totalOutstanding += expected;
      } else if (tx.status === "PENDING") {
        monthlyData[periodKey].pendingCount++;
        monthlyData[periodKey].totalOutstanding += expected;
      }
    }

    // Compute collection rates and round
    const monthlyBreakdown = Object.values(monthlyData).map((m) => ({
      ...m,
      totalCollected: Math.round(m.totalCollected * 100) / 100,
      totalExpected: Math.round(m.totalExpected * 100) / 100,
      totalOutstanding: Math.round(m.totalOutstanding * 100) / 100,
      collectionRate:
        m.totalExpected > 0
          ? Math.round((m.totalCollected / m.totalExpected) * 10000) / 100
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
    const propertyMap: Record<
      string,
      {
        propertyId: string;
        propertyName: string;
        totalCollected: number;
        totalOutstanding: number;
        activeLeases: number;
      }
    > = {};

    const activeLeases = await prisma.lease.findMany({
      where: { userId: session.user.id, status: "ACTIVE" },
      select: {
        id: true,
        property: { select: { id: true, name: true } },
        rentAmount: true,
        chargesAmount: true,
      },
    });

    for (const lease of activeLeases) {
      const pid = lease.property.id;
      if (!propertyMap[pid]) {
        propertyMap[pid] = {
          propertyId: pid,
          propertyName: lease.property.name,
          totalCollected: 0,
          totalOutstanding: 0,
          activeLeases: 0,
        };
      }
      propertyMap[pid].activeLeases++;
    }

    for (const tx of transactions) {
      if (tx.status === "PAID" || tx.status === "PARTIAL") {
        const pid = tx.lease.property.id;
        if (propertyMap[pid]) {
          propertyMap[pid].totalCollected += tx.amount;
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
