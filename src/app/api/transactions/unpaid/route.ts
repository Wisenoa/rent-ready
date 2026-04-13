import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

const DEFAULT_GRACE_PERIOD_DAYS = 5;

// ============================================================
// GET /api/transactions/unpaid
//
// Detect unpaid rent across all active leases.
// For each active lease, checks whether the most recent PAID transaction
// covers the expected period. Uses a grace period (default: 5 days)
// after the payment due date.
//
// Query params:
//   gracePeriodDays  number   (optional, default: 5)
//   propertyId       string   (optional filter)
//   tenantId         string   (optional filter)
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gracePeriodDays = Math.max(
      0,
      parseInt(searchParams.get("gracePeriodDays") ?? String(DEFAULT_GRACE_PERIOD_DAYS), 10)
    );
    const propertyId = searchParams.get("propertyId");
    const tenantId = searchParams.get("tenantId");

    // Build cutoff: today - grace period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - gracePeriodDays);

    // Get all active leases for the user
    const leaseWhere: Record<string, unknown> = {
      userId: session.user.id,
      status: "ACTIVE",
    };
    if (propertyId) leaseWhere.propertyId = propertyId;
    if (tenantId) leaseWhere.tenantId = tenantId;

    const leases = await prisma.lease.findMany({
      where: leaseWhere,
      include: {
        property: {
          select: { id: true, name: true, addressLine1: true, postalCode: true, city: true },
        },
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        transactions: {
          where: { status: { in: ["PAID", "PARTIAL"] } },
          orderBy: { paidAt: "desc" },
        },
      },
      orderBy: { property: { name: "asc" } },
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Build expected payment period for the current month
    const expectedPeriodStart = new Date(currentYear, currentMonth, 1);
    const expectedPeriodEnd = new Date(currentYear, currentMonth + 1, 0); // last day of month

    // Payment due date = paymentDay of current month (or previous month if we're past the 1st)
    const paymentDay = Math.min(now.getDate(), 28); // cap at 28 to avoid month overflow
    const expectedDueDate = new Date(currentYear, currentMonth, paymentDay);

    const unpaidItems: Array<{
      leaseId: string;
      property: { id: string; name: string; address: string };
      tenant: { id: string; name: string; email: string | null };
      expectedAmount: number;
      expectedDueDate: string;
      gracePeriodDays: number;
      cutoffDate: string;
      lastPaidAt: string | null;
      lastPaidPeriod: string | null;
      monthsOutstanding: number;
    }> = [];

    for (const lease of leases) {
      const expectedAmount = lease.rentAmount + lease.chargesAmount;

      // Find the most recent PAID/PARTIAL transaction for the current period
      const lastPaid = lease.transactions.find((tx) => {
        const periodStart = new Date(tx.periodStart);
        return (
          periodStart.getFullYear() === currentYear &&
          periodStart.getMonth() === currentMonth
        );
      });

      // If no payment for current period and due date + grace period has passed → unpaid
      const isUnpaid =
        !lastPaid &&
        expectedDueDate < cutoffDate;

      if (isUnpaid) {
        // Count how many consecutive months are outstanding
        let monthsOutstanding = 0;
        const sortedTx = [...lease.transactions].sort(
          (a, b) => b.periodStart.getTime() - a.periodStart.getTime()
        );

        // Walk backwards from last month
        let checkYear = currentYear;
        let checkMonth = currentMonth - 1; // start from last complete month

        if (checkMonth < 0) {
          checkMonth = 11;
          checkYear -= 1;
        }

        while (true) {
          const periodStart = new Date(checkYear, checkMonth, 1);
          const periodEnd = new Date(checkYear, checkMonth + 1, 0);

          const paidForPeriod = sortedTx.find((tx) => {
            const txStart = new Date(tx.periodStart);
            const txEnd = new Date(tx.periodEnd);
            return (
              txStart.getFullYear() === checkYear &&
              txStart.getMonth() === checkMonth &&
              tx.status === "PAID"
            );
          });

          if (!paidForPeriod) {
            monthsOutstanding++;
            // Move to previous month
            checkMonth--;
            if (checkMonth < 0) {
              checkMonth = 11;
              checkYear--;
            }
            // Safety cap at 24 months
            if (monthsOutstanding >= 24) break;
          } else {
            break;
          }
        }

        // Add current month if still unpaid
        if (!lastPaid) {
          monthsOutstanding++;
        }

        const lastPaidTx = lease.transactions[0]; // already sorted desc by paidAt
        const lastPaidPeriod = lastPaidTx
          ? `${lastPaidTx.periodStart.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`
          : null;

        unpaidItems.push({
          leaseId: lease.id,
          property: {
            id: lease.property.id,
            name: lease.property.name,
            address: `${lease.property.addressLine1}, ${lease.property.postalCode} ${lease.property.city}`,
          },
          tenant: {
            id: lease.tenant.id,
            name: `${lease.tenant.firstName} ${lease.tenant.lastName}`.trim(),
            email: lease.tenant.email ?? null,
          },
          expectedAmount,
          expectedDueDate: expectedDueDate.toISOString(),
          gracePeriodDays,
          cutoffDate: cutoffDate.toISOString(),
          lastPaidAt: lastPaidTx?.paidAt?.toISOString() ?? null,
          lastPaidPeriod,
          monthsOutstanding,
        });
      }
    }

    // Sort by months outstanding desc, then by expected amount desc
    unpaidItems.sort((a, b) => {
      if (b.monthsOutstanding !== a.monthsOutstanding) {
        return b.monthsOutstanding - a.monthsOutstanding;
      }
      return b.expectedAmount - a.expectedAmount;
    });

    const totalOutstanding = unpaidItems.reduce(
      (sum, item) => sum + item.expectedAmount * item.monthsOutstanding,
      0
    );

    return NextResponse.json({
      data: {
        unpaidItems,
        summary: {
          count: unpaidItems.length,
          totalOutstanding: Math.round(totalOutstanding * 100) / 100,
          gracePeriodDays,
          evaluatedAt: now.toISOString(),
          periodLabel: `${expectedPeriodStart.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/transactions/unpaid error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
