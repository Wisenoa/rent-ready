import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Decimal from "decimal.js";

/**
 * POST /api/cron/payments
 *
 * Daily cron job to mark unpaid PENDING transactions as LATE.
 * A transaction becomes LATE when:
 *   - Status is PENDING
 *   - The due date has passed (with configurable grace period)
 *
 * Also creates RENT_DUE reminders for any lease that now has LATE transactions.
 *
 * Should be called once per day (e.g., via an external scheduler like
 * GitHub Actions scheduled workflow or a webhook service like Cronitor).
 *
 * Requires a CRON_SECRET header for authentication:
 *   Authorization: Bearer <CRON_SECRET>
 *
 * Query params:
 *   gracePeriodDays  number   (optional, default: 5) — extra days after dueDate before marking LATE
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const cronSecret = process.env.CRON_SECRET;

  // Validate cron secret if configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const gracePeriodDays = Math.max(
      0,
      parseInt(searchParams.get("gracePeriodDays") ?? "5", 10)
    );

    const now = new Date();
    // A transaction is overdue if: dueDate + gracePeriodDays < now
    const cutoffDate = new Date(now.getTime());
    cutoffDate.setDate(cutoffDate.getDate() - gracePeriodDays);

    // 1. Mark PENDING transactions past the cutoff as LATE
    const overdueTx = await prisma.transaction.updateMany({
      where: {
        status: "PENDING",
        dueDate: { lt: cutoffDate },
      },
      data: {
        status: "LATE",
      },
    });

    // 2. Find all leases that now have LATE transactions
    // (these are candidates for RENT_DUE reminders)
    const leasesWithLateTx = await prisma.lease.findMany({
      where: {
        status: "ACTIVE",
        transactions: {
          some: {
            status: "LATE",
          },
        },
      },
      include: {
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    let remindersCreated = 0;

    for (const lease of leasesWithLateTx) {
      // Get the oldest LATE transaction for this lease
      const oldestLateTx = await prisma.transaction.findFirst({
        where: {
          leaseId: lease.id,
          status: "LATE",
        },
        orderBy: { dueDate: "asc" },
      });

      if (!oldestLateTx) continue;

      // Calculate days overdue from the oldest unpaid transaction
      const daysLate = Math.max(
        0,
        Math.ceil((now.getTime() - oldestLateTx.dueDate.getTime()) / (24 * 60 * 60 * 1000)) -
          gracePeriodDays
      );

      // Check if an active RENT_DUE reminder already exists for this lease
      const existingReminder = await prisma.reminder.findFirst({
        where: {
          leaseId: lease.id,
          type: "RENT_DUE",
          status: "PENDING",
        },
      });

      if (existingReminder) continue;

      // Determine tone based on how late
      const tone: "friendly" | "formal" | "legal" =
        daysLate <= 10
          ? "friendly"
          : daysLate <= 30
            ? "formal"
            : "legal";

      const dueAmount = new Decimal(oldestLateTx.rentPortion)
        .plus(oldestLateTx.chargesPortion)
        .toNumber();

      await prisma.reminder.create({
        data: {
          userId: lease.userId,
          leaseId: lease.id,
          propertyId: lease.propertyId,
          tenantId: lease.tenantId,
          type: "RENT_DUE",
          title: `Loyer impayé — ${lease.tenant.firstName} ${lease.tenant.lastName}`,
          description: `Loyer de ${dueAmount.toFixed(2)} € en retard de ${daysLate} jour${daysLate !== 1 ? "s" : ""} pour ${lease.property.name}.`,
          dueDate: now,
          priority: tone === "legal" ? "HIGH" : tone === "formal" ? "MEDIUM" : "LOW",
          status: "PENDING",
        },
      });
      remindersCreated++;
    }

    return NextResponse.json({
      ok: true,
      markedLate: overdueTx.count,
      remindersCreated,
      message: `Marked ${overdueTx.count} transaction(s) as LATE. Created ${remindersCreated} RENT_DUE reminder(s).`,
    });
  } catch (error) {
    console.error("POST /api/cron/payments error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
