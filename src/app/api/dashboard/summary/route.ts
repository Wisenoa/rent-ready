import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

// ============================================================
// GET /api/dashboard/summary
//
// Returns a high-level summary for the authenticated user's
// rental property portfolio.
//
// Response:
//   total_properties     — number of properties owned
//   total_tenants        — number of active tenants
//   total_outstanding    — total unpaid rent (EUR)
//   collection_rate      — percentage of rent collected (0–100)
//   total_properties_rented  — properties with at least one active lease
//   total_active_leases      — number of currently active leases
//   total_collected_this_month — rent collected in the current calendar month
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // ── Counts ────────────────────────────────────────────
    const [totalProperties, totalTenants, activeLeases, allProperties] =
      await Promise.all([
        prisma.property.count({ where: { userId, deletedAt: null } }),
        prisma.tenant.count({ where: { userId } }),
        prisma.lease.findMany({
          where: { userId, status: "ACTIVE" },
          select: {
            id: true,
            rentAmount: true,
            chargesAmount: true,
            propertyId: true,
          },
        }),
        prisma.property.findMany({
          where: { userId, deletedAt: null },
          select: { id: true },
        }),
      ]);

    const totalActiveLeases = activeLeases.length;
    const rentedPropertyIds = new Set(activeLeases.map((l) => l.propertyId));
    const totalPropertiesRented = rentedPropertyIds.size;

    // ── Current month collection ───────────────────────────
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const paidThisMonth = await prisma.transaction.findMany({
      where: {
        userId,
        status: { in: ["PAID", "PARTIAL"] },
        paidAt: { gte: monthStart, lte: monthEnd },
      },
      select: { amount: true },
    });

    const totalCollectedThisMonth = paidThisMonth.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    // ── Outstanding ───────────────────────────────────────
    // Sum expected rent for active leases minus what was paid this month
    const expectedThisMonth = activeLeases.reduce(
      (sum, l) => sum + l.rentAmount + l.chargesAmount,
      0
    );
    const totalOutstanding = Math.max(
      0,
      expectedThisMonth - totalCollectedThisMonth
    );

    // ── Collection rate (current month) ─────────────────────
    const collectionRate =
      expectedThisMonth > 0
        ? Math.round((totalCollectedThisMonth / expectedThisMonth) * 10000) / 100
        : 100;

    return NextResponse.json({
      data: {
        total_properties: totalProperties,
        total_properties_rented: totalPropertiesRented,
        total_tenants: totalTenants,
        total_active_leases: totalActiveLeases,
        total_outstanding: Math.round(totalOutstanding * 100) / 100,
        collection_rate: collectionRate,
        total_collected_this_month: Math.round(totalCollectedThisMonth * 100) / 100,
        currency: "EUR",
        period: {
          month: now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
          generated_at: now.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("GET /api/dashboard/summary error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
