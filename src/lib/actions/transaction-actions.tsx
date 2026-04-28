"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations/transaction";
import { determineReceiptType } from "@/lib/quittance-generator";
import { generateQuittance } from "@/lib/actions/quittance-actions";
import { generateRentFollowUpDraft } from "@/lib/ai/lease-analyzer";
import { resend, fromEmail } from "@/lib/email";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ActionResult } from "./property-actions";
import { toNumber, round2, toDecimal } from "@/lib/decimal";
import Decimal from "decimal.js";

export async function createTransaction(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const raw = Object.fromEntries(formData.entries());
    const parsed = transactionSchema.safeParse(raw);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    // Verify lease belongs to user
    const lease = await prisma.lease.findUnique({ where: { id: parsed.data.leaseId } });
    if (!lease || lease.userId !== userId) {
      return { success: false, error: "Bail introuvable ou accès non autorisé." };
    }

    // Determine receipt type based on payment amount vs expected
    // Use Decimal.js for precise financial arithmetic
    const rentNum = toNumber(lease.rentAmount);
    const chargesNum = toNumber(lease.chargesAmount);
    const amountNum = parsed.data.amount; // already a number from z.coerce
    const totalDue = new Decimal(rentNum).plus(chargesNum);
    const isFullPayment = amountNum >= totalDue.toNumber();
    const receiptType = determineReceiptType(amountNum, rentNum, chargesNum);

    // Calculate rent/charges portions proportionally using Decimal.js
    const rentPortionDecimal = isFullPayment
      ? new Decimal(rentNum)
      : new Decimal(amountNum).times(rentNum).dividedBy(totalDue).toDecimalPlaces(2);
    const chargesPortionDecimal = isFullPayment
      ? new Decimal(chargesNum)
      : new Decimal(amountNum).minus(rentPortionDecimal).toDecimalPlaces(2);

    const status = isFullPayment ? "PAID" : "PARTIAL";

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        leaseId: parsed.data.leaseId,
        amount: toDecimal(parsed.data.amount),
        rentPortion: rentPortionDecimal,
        chargesPortion: chargesPortionDecimal,
        periodStart: new Date(parsed.data.periodStart),
        periodEnd: new Date(parsed.data.periodEnd),
        dueDate: new Date(parsed.data.dueDate),
        paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : new Date(),
        paymentMethod: parsed.data.paymentMethod ?? null,
        status,
        isFullPayment,
        receiptType,
        notes: parsed.data.notes || null,
      },
    });

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { success: true, data: { id: transaction.id, receiptType } };
  } catch (error) {
    console.error("createTransaction error:", error);
    return { success: false, error: "Impossible d'enregistrer le paiement." };
  }
}

export async function markTransactionPaid(
  id: string,
  amount: number,
  paidAt?: string
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { lease: true },
    });

    if (!transaction || transaction.userId !== userId) {
      return { success: false, error: "Transaction introuvable ou accès non autorisé." };
    }

    const lease = transaction.lease;
    const rentNum = toNumber(lease.rentAmount);
    const chargesNum = toNumber(lease.chargesAmount);
    const totalDue = new Decimal(rentNum).plus(chargesNum);
    const isFullPayment = amount >= totalDue.toNumber();
    const receiptType = determineReceiptType(amount, rentNum, chargesNum);

    const rentPortionDecimal = isFullPayment
      ? new Decimal(rentNum)
      : new Decimal(amount).times(rentNum).dividedBy(totalDue).toDecimalPlaces(2);
    const chargesPortionDecimal = isFullPayment
      ? new Decimal(chargesNum)
      : new Decimal(amount).minus(rentPortionDecimal).toDecimalPlaces(2);

    await prisma.transaction.update({
      where: { id },
      data: {
        amount: toDecimal(amount),
        rentPortion: rentPortionDecimal,
        chargesPortion: chargesPortionDecimal,
        status: isFullPayment ? "PAID" : "PARTIAL",
        isFullPayment,
        receiptType,
        paidAt: paidAt ? new Date(paidAt) : new Date(),
      },
    });

    // Auto-generate PDF quittance after marking as paid
    const quittanceResult = await generateQuittance(id);

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return {
      success: true,
      data: {
        receiptType,
        receiptUrl: quittanceResult.success ? (quittanceResult.data as { receiptUrl?: string })?.receiptUrl : undefined,
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

    if (transaction.status !== "LATE" && transaction.status !== "PENDING") {
      return { success: false, error: "Cette transaction n'est pas en retard." };
    }

    const { lease, user } = transaction;
    const { property, tenant } = lease;
    const daysLate = Math.floor(
      (Date.now() - transaction.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );

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
        toNumber(transaction.amount),
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
      import("../../../emails/payment-reminder"),
    ]);

    const emailHtml = await renderToBuffer(
      <PaymentReminderEmail
        tenantFirstName={tenant.firstName}
        landlordFirstName={user.firstName}
        landlordLastName={user.lastName}
        propertyAddress={`${property.addressLine1}, ${property.postalCode} ${property.city}`}
        amountDue={toNumber(transaction.amount)}
        dueDate={transaction.dueDate}
        daysLate={daysLate}
        tone={tone}
        letterUrl={letterUrl}
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
      return { success: false, error: "Échec de l'envoi de l'email de relanc." };
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
        body: `Relance ${tone} envoyée à ${tenant.firstName} ${tenant.lastName} pour ${toNumber(transaction.amount)} €`,
      },
    });

    revalidatePath("/billing");
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
    return { success: false, error: "Impossible d'envoyer la relanc." };
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
      status: { in: ["LATE", "PENDING"] },
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
