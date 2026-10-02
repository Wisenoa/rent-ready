"use server";

import { revalidatePath } from "next/cache";
import Decimal from "decimal.js";
import { prisma } from "@/lib/prisma";
import {
  displayStatus,
  daysLate as daysPastDue,
} from "@/lib/domain/period-presentation";
import { recordRentPayment, cancelRentPayment } from "@/lib/services/rent-payments";
import { getCurrentUserId } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations/transaction";
import { generateQuittance } from "@/lib/actions/quittance-actions";
import { describeQuittanceOutcome } from "@/lib/domain/quittance-outcome";
import { generateRentFollowUpDraft } from "@/lib/ai/lease-analyzer";
import { resend, fromEmail } from "@/lib/email";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ActionResult } from "./property-actions";
import { toNumber } from "@/lib/decimal";

export async function createTransaction(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const raw = Object.fromEntries(formData.entries());
    const parsed = transactionSchema.safeParse(raw);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    // Every write goes through the one door (src/lib/services/rent-payments.ts):
    // it resolves the period from the database, derives the settlement and caps
    // the amount at what is still collectable. This action only validates and
    // revalidates — it holds no version of the rule of its own.
    const result = await recordRentPayment({
      userId,
      leaseId: parsed.data.leaseId,
      duePeriodId: parsed.data.duePeriodId || null,
      periodStart: new Date(parsed.data.periodStart),
      periodEnd: new Date(parsed.data.periodEnd),
      dueDate: new Date(parsed.data.dueDate),
      amount: parsed.data.amount,
      paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : new Date(),
      paymentMethod: parsed.data.paymentMethod ?? null,
      notes: parsed.data.notes || null,
    });

    if (!result.ok) {
      return { success: false, error: result.error };
    }

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    revalidatePath("/leases");
    return { success: true, data: { id: result.transactionId, receiptType: result.receiptType } };
  } catch (error) {
    console.error("createTransaction error:", error);
    return { success: false, error: "Impossible d'enregistrer le paiement." };
  }
}

/**
 * Cancel a receipt that was recorded in error (wrong amount, wrong lease, money
 * that came back). The month becomes collectable again.
 */
export async function cancelTransaction(id: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    const result = await cancelRentPayment({ userId, transactionId: id });

    if (!result.ok) {
      return { success: false, error: result.error };
    }

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    revalidatePath("/leases");
    return {
      success: true,
      data: { id, collectable: result.collectable, reopenedPeriodId: result.reopenedPeriodId },
    };
  } catch (error) {
    console.error("cancelTransaction error:", error);
    return { success: false, error: "Impossible d'annuler ce paiement." };
  }
}

/**
 * « Marquer payé » on a period row.
 *
 * The `amount` argument used to be written straight onto the row, straight from
 * the browser, with no ceiling and no relation to the period: a crafted call
 * marked a 970.55 EUR month paid for 0.01 EUR, and the dashboard then showed a
 * settled month whose receipts summed to nothing.
 *
 * The amount is therefore no longer the browser's to choose. What is settled is
 * the row's REAL balance; a `amount` argument is still accepted for the button's
 * signature but only as a claim, validated against that balance — a different
 * value is refused rather than silently overwriting the ledger.
 */
export async function markTransactionPaid(
  id: string,
  amount?: number,
  paidAt?: string
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      select: { id: true, leaseId: true, amount: true },
    });

    if (!transaction) {
      return { success: false, error: "Transaction introuvable ou accès non autorisé." };
    }

    const result = await recordRentPayment({
      userId,
      leaseId: transaction.leaseId,
      duePeriodId: id,
      paidAt: paidAt ? new Date(paidAt) : new Date(),
      ...(amount === undefined ? {} : { amount }),
    });

    if (!result.ok) {
      return { success: false, error: result.error };
    }

    // Auto-generate PDF quittance after marking as paid.
    //
    // The payment IS recorded at this point, so a receipt failure must not fail
    // the action — but it must not be silent either. generateQuittance refuses
    // when the landlord's own address is incomplete, which is the default state
    // of every account created before the profile page existed. Reporting plain
    // success there would claim a receipt was issued when none was, so the
    // reason travels back as `quittanceError` (AGENTS.md §21, §37).
    const outcome = describeQuittanceOutcome(
      await generateQuittance(result.transactionId)
    );

    if (outcome.warning) {
      console.error("markTransactionPaid: quittance not generated:", outcome.warning);
    }

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return {
      success: true,
      data: {
        receiptType: result.receiptType,
        receiptUrl: outcome.receiptUrl,
        ...(outcome.warning ? { quittanceError: outcome.warning } : {}),
      },
    };
  } catch (error) {
    console.error("markTransactionPaid error:", error);
    return { success: false, error: "Impossible de valider le paiement." };
  }
}

export async function sendPaymentReminder(
  transactionId: string,
  tone: "friendly" | "formal" | "legal" = "formal"
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        lease: {
          include: {
            property: true,
            tenant: true,
          },
        },
        user: true,
      },
    });

    if (!transaction || transaction.userId !== userId) {
      return { success: false, error: "Transaction introuvable ou accès non autorisé." };
    }

    // Refuse on the DERIVED state, not the stored status.
    //
    // The guard used to accept only `LATE` and `PENDING`. Nothing in the codebase
    // ever writes `LATE`, and a partially paid month keeps `PARTIAL` — so the one
    // case a relance exists for, a month that is both late AND partially paid,
    // was answered "Cette transaction n'est pas en retard" by a button that had
    // just told the landlord it was 40 days late. Same class of bug as /billing
    // showing overdue rent as "En attente".
    if (transaction.paidAt) {
      return { success: false, error: "Cette période de loyer est déjà réglée." };
    }
    if (displayStatus(transaction) !== "OVERDUE") {
      return {
        success: false,
        error: "Cette période de loyer n'est pas encore échue.",
      };
    }

    const { lease, user } = transaction;
    const { property, tenant } = lease;
    // The row carries the balance still owed, which is below rent+charges once a
    // partial payment has landed. Chasing the month's full rent would demand
    // money the tenant has already paid.
    const amountDue = new Decimal(transaction.amount).toDecimalPlaces(2);
    const daysLate = daysPastDue(transaction.dueDate);

    // Generate AI draft letter for formal/legal tones
    let letterText: string | null = null;
    if (tone === "formal" || tone === "legal") {
      const previousAttempts = await prisma.document.count({
        where: {
          userId,
          type: "OTHER",
          createdAt: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
        },
      });
      const dueDateFormatted = format(transaction.dueDate, "d MMMM yyyy", { locale: fr });
      const draft = await generateRentFollowUpDraft(
        `${tenant.firstName} ${tenant.lastName}`,
        `${property.addressLine1}, ${property.postalCode} ${property.city}`,
        amountDue.toNumber(),
        dueDateFormatted,
        daysLate,
        previousAttempts,
        tone
      );
      letterText = `Objet: ${draft.subject}\n\n${draft.body}`;
    }

    // Build and send email
    const portalBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const letterUrl = letterText
      ? `${portalBaseUrl}/api/reminders/letter?tx=${transactionId}&tone=${tone}`
      : undefined;

    // Dynamic imports to prevent Next.js build analysis of React Email components
    const [{ renderToBuffer }, { PaymentReminderEmail }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("../../emails/payment-reminder"),
    ]);

    const emailHtml = await renderToBuffer(
      <PaymentReminderEmail
        tenantFirstName={tenant.firstName}
        landlordFirstName={user.firstName}
        landlordLastName={user.lastName}
        propertyAddress={`${property.addressLine1}, ${property.postalCode} ${property.city}`}
        amountDue={amountDue.toNumber()}
        dueDate={transaction.dueDate}
        daysLate={daysLate}
        tone={tone}
          letterUrl={letterUrl ?? `${portalBaseUrl}/portal`}
      />
    );

    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: [tenant.email ?? ""],
      subject:
        tone === "legal"
          ? `MISE EN DEMEURE - ${property.addressLine1} - Loyer impayé`
          : tone === "formal"
            ? `Relance pour loyer impayé - ${property.addressLine1}`
            : "Rappel : votre loyer en attente",
      html: emailHtml.toString(),
    });

    if (emailResult.error) {
      console.error("Email send error:", emailResult.error);
      return { success: false, error: "Échec de l'envoi de l'email de relance." };
    }

    // Log reminder sent
    await prisma.notification.create({
      data: {
        userId,
        tenantId: tenant.id,
        type: "RENT_REMINDER",
        title:
          tone === "legal"
            ? "Mise en demeure envoyée"
            : tone === "formal"
              ? "Relance formelle envoyée"
              : "Rappel envoyé",
        body: `Relance ${tone} envoyée à ${tenant.firstName} ${tenant.lastName} pour ${amountDue.toFixed(2)} €`,
      },
    });

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return {
      success: true,
      data: {
        emailId: emailResult.data?.id,
        daysLate,
        tone,
      },
    };
  } catch (error) {
    console.error("sendPaymentReminder error:", error);
    return { success: false, error: "Impossible d'envoyer la relance." };
  }
}

export async function getOverdueTransactions(): Promise<
  Array<{
    id: string;
    amount: number;
    daysLate: number;
    status: string;
    tenant: { firstName: string; lastName: string; email: string };
    property: { name: string; addressLine1: string };
    lease: { id: string };
  }>
> {
  const userId = await getCurrentUserId();

  const now = new Date();
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      // Unpaid and past due. Deriving this from the date matters: no code writes a
      // LATE status, so filtering on it returned an empty relance list every time.
      paidAt: null,
      dueDate: { lt: now },
    },
    include: {
      lease: {
        include: {
          property: { select: { name: true, addressLine1: true } },
          tenant: { select: { firstName: true, lastName: true, email: true } },
        },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  return transactions.map((tx) => ({
    id: tx.id,
    amount: toNumber(tx.amount),
    daysLate: Math.floor((now.getTime() - tx.dueDate.getTime()) / (1000 * 60 * 60 * 24)),
    status: tx.status,
    tenant: { ...tx.lease.tenant, email: tx.lease.tenant.email ?? "" },
    property: tx.lease.property,
    lease: { id: tx.lease.id },
  }));
}
