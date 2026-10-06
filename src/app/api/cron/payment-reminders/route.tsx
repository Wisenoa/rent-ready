import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, fromEmail } from "@/lib/email";
import { sendPaymentReminder } from "@/lib/actions/transaction-actions";
import { toNumber } from "@/lib/format";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * POST /api/cron/payment-reminders
 *
 * Daily cron job to send overdue rent reminders.
 * Called after /api/cron/payments has already marked overdue transactions
 * as LATE and created RENT_DUE reminders.
 *
 * Reminder schedule (per overdue transaction):
 *   7  days late → friendly reminder
 *   14 days late → formal reminder
 *   30 days late → legal notice (mise en demeure)
 *
 * Each reminder is sent at most once per tone per transaction.
 *
 * Requires a CRON_SECRET header for authentication:
 *   Authorization: Bearer ***
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Fetch all pending RENT_DUE reminders
    const reminders = await prisma.reminder.findMany({
      where: {
        type: "RENT_DUE",
        status: "PENDING",
      },
      include: {
        lease: {
          include: {
            tenant: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            property: {
              select: { id: true, name: true, addressLine1: true, postalCode: true, city: true },
            },
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
            transactions: {
              where: { status: "LATE" },
              orderBy: { dueDate: "asc" },
              take: 1,
            },
          },
        },
      },
    });

    const results: Array<{
      reminderId: string;
      transactionId: string | null;
      tone: string;
      status: "sent" | "skipped" | "error";
      error?: string;
    }> = [];

    for (const reminder of reminders) {
      const oldestLateTx = reminder.lease.transactions[0];
      if (!oldestLateTx) {
        results.push({
          reminderId: reminder.id,
          transactionId: null,
          tone: "none",
          status: "skipped",
        });
        continue;
      }

      const daysLate = Math.max(
        0,
        Math.floor((now.getTime() - oldestLateTx.dueDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      // Determine which tone to send based on days late
      let tone: "friendly" | "formal" | "legal";
      if (daysLate < 14) {
        tone = "friendly";
      } else if (daysLate < 30) {
        tone = "formal";
      } else {
        tone = "legal";
      }

      // Skip if we've already sent this tone for this transaction
      // (check Notification table for recent reminder emails)
      const alreadySent = await prisma.notification.findFirst({
        where: {
          userId: reminder.lease.userId,
          tenantId: reminder.lease.tenant.id,
          type: "RENT_REMINDER",
          createdAt: {
            gte: new Date(now.getTime() - 48 * 60 * 60 * 1000), // within last 48h
          },
        },
      });

      if (alreadySent) {
        results.push({
          reminderId: reminder.id,
          transactionId: oldestLateTx.id,
          tone,
          status: "skipped",
        });
        continue;
      }

      // Call the existing sendPaymentReminder action
      // We bypass auth since this is a cron job running as system
      const emailResult = await sendReminderEmail(
        oldestLateTx.id,
        reminder.lease.userId,
        reminder.lease.tenant,
        reminder.lease.property,
        oldestLateTx,
        tone
      );

      if (emailResult.success) {
        results.push({
          reminderId: reminder.id,
          transactionId: oldestLateTx.id,
          tone,
          status: "sent",
        });
      } else {
        results.push({
          reminderId: reminder.id,
          transactionId: oldestLateTx.id,
          tone,
          status: "error",
          error: emailResult.error,
        });
      }
    }

    const sent = results.filter((r) => r.status === "sent").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const errors = results.filter((r) => r.status === "error").length;

    return NextResponse.json({
      ok: true,
      processed: reminders.length,
      sent,
      skipped,
      errors,
      message: `Sent ${sent} reminder(s), skipped ${skipped}, errors ${errors}.`,
      details: results,
    });
  } catch (error) {
    console.error("POST /api/cron/payment-reminders error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// ─── Internal email sending ────────────────────────────────────────────────────

interface ReminderEmailResult {
  success: boolean;
  error?: string;
}

async function sendReminderEmail(
  transactionId: string,
  userId: string,
  tenant: { id: string; firstName: string; lastName: string; email: string | null },
  property: { name: string; addressLine1: string; postalCode: string; city: string },
  transaction: { id: string; amount: unknown; dueDate: Date },
  tone: "friendly" | "formal" | "legal"
): Promise<ReminderEmailResult> {
  try {
    if (!tenant.email) {
      return { success: false, error: "Tenant has no email" };
    }

    const daysLate = Math.max(
      0,
      Math.floor((Date.now() - transaction.dueDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    const dueDateFormatted = format(transaction.dueDate, "d MMMM yyyy", { locale: fr });
    const amountDue = toNumber(transaction.amount);
    const propertyAddress = `${property.addressLine1}, ${property.postalCode} ${property.city}`;

    const subject =
      tone === "legal"
        ? `MISE EN DEMEURE — ${property.addressLine1} — Loyer impayé`
        : tone === "formal"
          ? `Relance pour loyer impayé — ${property.addressLine1}`
          : `Rappel : votre loyer en attente — ${property.addressLine1}`;

    const portalBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const letterUrl = `${portalBaseUrl}/api/reminders/letter?tx=${transactionId}&tone=${tone}`;

    // Dynamic import of React Email template
    const { PaymentReminderEmail } = await import("@/lib/emails/payment-reminder");
    const { renderToBuffer } = await import("@react-pdf/renderer");

    const emailHtml = await renderToBuffer(
      <PaymentReminderEmail
        tenantFirstName={tenant.firstName}
        landlordFirstName="le Bailleur"
        landlordLastName=""
        propertyAddress={propertyAddress}
        amountDue={amountDue}
        dueDate={transaction.dueDate}
        daysLate={daysLate}
        tone={tone}
        letterUrl={letterUrl}
      />
    );

    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: [tenant.email],
      subject,
      html: emailHtml.toString(),
    });

    if (emailResult.error) {
      console.error("Email send error:", emailResult.error);
      return { success: false, error: emailResult.error.message };
    }

    // Log the reminder in the Notification table
    await prisma.notification.create({
      data: {
        userId,
        tenantId: tenant.id,
        propertyId: property.id,
        type: "RENT_REMINDER",
        title:
          tone === "legal"
            ? "Mise en demeure envoyée"
            : tone === "formal"
              ? "Relance formelle envoyée"
              : "Rappel envoyé",
        body: `Relance ${tone} envoyée à ${tenant.firstName} ${tenant.lastName} pour ${amountDue.toFixed(2)} € — ${daysLate} jour${daysLate !== 1 ? "s" : ""} de retard.`,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("sendReminderEmail error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
