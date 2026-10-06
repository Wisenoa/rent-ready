"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ReminderResult = {
  success: boolean;
  error?: string;
  created?: number;
};

/**
 * Auto-creates LEASE_RENEWAL reminders for all active leases expiring within the
 * next 90 days that don't already have a renewal reminder for that milestone.
 * Called by a daily cron job (e.g., /api/cron/reminders).
 *
 * Creates reminders at:
 *   - 90 days before expiry
 *   - 60 days before expiry
 *   - 30 days before expiry
 *
 * @param targetUserId - If provided, only process leases for this user.
 *                      Omit to process all users (e.g., from a cron job).
 */
export async function createUpcomingLeaseRenewalReminders(
  targetUserId?: string
): Promise<ReminderResult> {
  try {
    const now = new Date();

    // Build user filter — omit for cross-user cron jobs
    const userFilter = targetUserId ? { userId: targetUserId } : {};

    // Find all active leases expiring within 90 days
    const upcomingLeases = await prisma.lease.findMany({
      where: {
        ...userFilter,
        status: "ACTIVE",
        endDate: {
          gt: now,
          lte: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        tenant: { select: { firstName: true, lastName: true } },
        property: { select: { name: true } },
        reminders: {
          where: {
            type: "LEASE_RENEWAL",
            status: { in: ["PENDING", "COMPLETED"] },
          },
          select: { dueDate: true, status: true },
        },
      },
    });

    const DAY = 24 * 60 * 60 * 1000;
    const milestones = [90, 60, 30];
    let created = 0;

    for (const lease of upcomingLeases) {
      const daysUntilExpiry = Math.ceil(
        (lease.endDate.getTime() - now.getTime()) / DAY
      );

      for (const milestone of milestones) {
        const reminderDueDate = new Date(
          lease.endDate.getTime() - milestone * DAY
        );

        // Skip if reminder date is in the past
        if (reminderDueDate <= now) continue;

        // Skip if a reminder for this milestone already exists
        const existingReminder = lease.reminders.find(
          (r) =>
            Math.abs(
              Math.ceil((r.dueDate.getTime() - reminderDueDate.getTime()) / DAY)
            ) <= 3 // within 3 days tolerance
        );

        if (existingReminder) continue;

        await prisma.reminder.create({
          data: {
            userId: lease.userId,
            leaseId: lease.id,
            propertyId: lease.propertyId,
            tenantId: lease.tenantId,
            type: "LEASE_RENEWAL",
            title: `Renouvellement du bail — ${lease.tenant.firstName} ${lease.tenant.lastName}`,
            description: `Le bail pour ${lease.tenant.firstName} ${lease.tenant.lastName} au bien « ${lease.property.name} » arrive à échéance dans ${milestone} jour${milestone > 1 ? "s" : ""} (fin le ${lease.endDate.toLocaleDateString("fr-FR")}).`,
            dueDate: reminderDueDate,
            priority: milestone <= 30 ? "HIGH" : "MEDIUM",
            status: "PENDING",
          },
        });
        created++;
      }
    }

    revalidatePath("/dashboard");
    return { success: true, created };
  } catch (error) {
    console.error("createUpcomingLeaseRenewalReminders error:", error);
    return { success: false, error: "Impossible de créer les rappels." };
  }
}
