"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";
import { settlePeriod } from "@/lib/domain/rent-periods";
import { getCurrentUserId } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations/transaction";
import { generateQuittance } from "@/lib/actions/quittance-actions";
import { describeQuittanceOutcome } from "@/lib/domain/quittance-outcome";
import { generateRentFollowUpDraft } from "@/lib/ai/lease-analyzer";
import { resend, fromEmail } from "@/lib/email";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ActionResult } from "./property-actions";
import { toNumber, round2, toDecimal } from "@/lib/decimal";
import {
  findUnpaidPeriod,
  settleRentPeriod,
} from "@/lib/domain/generate-rent-periods";
import Decimal from "decimal.js";
import type { PaymentMethod, Prisma } from "@prisma/client";
import { resolveDuePeriod } from "@/lib/queries/due-periods";

/** Money in a user-facing error message, without importing a client formatter. */
function formatEuros(value: Decimal): string {
  return `${value.toDecimalPlaces(2).toFixed(2)} €`;
}

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

    const amountNum = parsed.data.amount; // already a number from z.coerce
    const paidAt = parsed.data.paidAt ? new Date(parsed.data.paidAt) : new Date();

    // A landlord picks the period to settle instead of typing dates, so the
    // period's identity comes from the database, not from the form: the id is
    // resolved scoped to this lease and must still be unpaid. The dates then
    // come from that row, which also closes the door on a form that posts
    // another lease's period dates.
    const duePeriodId = parsed.data.duePeriodId;
    let periodStart = new Date(parsed.data.periodStart);
    let periodEnd = new Date(parsed.data.periodEnd);
    let dueDate = new Date(parsed.data.dueDate);
    let duePeriodAmount: Prisma.Decimal | null = null;
    if (duePeriodId) {
      const period = await resolveDuePeriod(userId, lease.id, duePeriodId);
      if (!period) {
        return {
          success: false,
          error: "Cette période de loyer n'est plus à encaisser pour ce bail.",
        };
      }
      periodStart = period.periodStart;
      periodEnd = period.periodEnd;
      dueDate = period.dueDate;
      duePeriodAmount = period.amount;
    }

    // Judge the PERIOD, not this payment: a tenant paying in instalments was
    // previously recorded PARTIAL forever. Single source of truth in
    // src/lib/domain/period-settlement.ts.
    const priorPayments = await prisma.transaction.findMany({
      where: { leaseId: lease.id, periodStart, periodEnd, paidAt: { not: null } },
      select: { amount: true, paidAt: true, createdAt: true },
    });

    // A period row holds the OBLIGATION, so what is still collectable is that
    // amount minus everything already received for the month. This is the
    // ceiling the dialog enforces with `max`, and it is re-derived here on
    // purpose: the browser is not the boundary (AGENTS.md 6). Without it a
    // hand-crafted POST books 1000 EUR against a 970.55 EUR month and the ledger
    // claims more rent than the lease ever asked for.
    if (duePeriodAmount) {
      const received = priorPayments.reduce(
        (sum, r) => sum.plus(new Decimal(r.amount)),
        new Decimal(0)
      );
      const remaining = settlePeriod(
        new Decimal(duePeriodAmount),
        received,
        dueDate,
        paidAt
      ).outstanding;
      if (new Decimal(amountNum).gt(remaining)) {
        return {
          success: false,
          error: `Le montant dépasse le reste à payer pour cette période (${formatEuros(remaining)}).`,
        };
      }
    }

    const settlement = settlePeriodPayments({
      rentAmount: lease.rentAmount,
      chargesAmount: lease.chargesAmount,
      payments: [
        ...priorPayments.map((r) => ({ amount: r.amount, paidAt: r.paidAt, createdAt: r.createdAt })),
        { amount: amountNum, paidAt, createdAt: new Date() },
      ],
      currentAmount: amountNum,
    });
    const rentPortionDecimal = settlement.rentPortion;
    const chargesPortionDecimal = settlement.chargesPortion;
    const isFullPayment = settlement.isFullPayment;
    const receiptType = settlement.receiptType;
    const status = settlement.status;
    /** True when this payment discharges the month, so the period row closes. */
    const clearsPeriod = settlement.outstanding.lte(0);
    // What was still owed just before this payment landed.
    const outstandingBefore = settlement.outstanding.plus(new Decimal(amountNum));

    // A generated rent period is settled rather than duplicated: the month must
    // not be counted twice (once as owed, once as received).
    //
    // When the dialog sent a period id, that row IS the period. settleRentPeriod
    // closes it only if this payment clears the balance; otherwise it leaves the
    // obligation unpaid on purpose and the payment is inserted as its own row
    // below, which is what keeps the remaining balance collectable.
    const period: { id: string } | null = duePeriodId
      ? { id: duePeriodId }
      : await findUnpaidPeriod(parsed.data.leaseId, periodStart);
    if (period) {
      const settled = await settleRentPeriod(period.id, {
        amount: parsed.data.amount,
        rentPortion: rentPortionDecimal,
        chargesPortion: chargesPortionDecimal,
        paidAt,
        ...(parsed.data.paymentMethod
          ? { paymentMethod: parsed.data.paymentMethod as PaymentMethod }
          : {}),
        status,
        isFullPayment,
        outstandingBefore,
      });
      if (settled && clearsPeriod) {
        revalidatePath("/billing");
        revalidatePath("/dashboard");
        revalidatePath("/leases");
        return { success: true, data: { id: period.id, receiptType } };
      }
      // A partial payment returns settled=true WITHOUT closing the period (see
      // settleRentPeriod): falling through inserts the receipt row, and the
      // obligation stays unpaid so the balance remains collectable.
      if (!settled && duePeriodId) {
        return {
          success: false,
          error: "Cette période de loyer vient déjà d'être encaissée.",
        };
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        leaseId: parsed.data.leaseId,
        amount: toDecimal(parsed.data.amount),
        rentPortion: rentPortionDecimal,
        chargesPortion: chargesPortionDecimal,
        periodStart,
        periodEnd,
        dueDate,
        paidAt,
        paymentMethod: parsed.data.paymentMethod ?? null,
        status,
        isFullPayment,
        receiptType,
        notes: parsed.data.notes || null,
      },
    });

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    revalidatePath("/leases");
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
    const when = paidAt ? new Date(paidAt) : new Date();

    // Same period-level rule as every other write path.
    const priorPayments = await prisma.transaction.findMany({
      where: {
        leaseId: transaction.leaseId,
        periodStart: transaction.periodStart,
        periodEnd: transaction.periodEnd,
        paidAt: { not: null },
        id: { not: transaction.id },
      },
      select: { amount: true, paidAt: true, createdAt: true },
    });
    const settlement = settlePeriodPayments({
      rentAmount: lease.rentAmount,
      chargesAmount: lease.chargesAmount,
      payments: [
        ...priorPayments.map((r) => ({ amount: r.amount, paidAt: r.paidAt, createdAt: r.createdAt })),
        { amount, paidAt: when, createdAt: transaction.createdAt },
      ],
      currentAmount: amount,
    });
    const rentPortionDecimal = settlement.rentPortion;
    const chargesPortionDecimal = settlement.chargesPortion;
    const isFullPayment = settlement.isFullPayment;
    const receiptType = settlement.receiptType;

    await prisma.transaction.update({
      where: { id },
      data: {
        amount: toDecimal(amount),
        rentPortion: rentPortionDecimal,
        chargesPortion: chargesPortionDecimal,
        status: settlement.status,
        isFullPayment,
        receiptType,
        paidAt: when,
      },
    });

    // Auto-generate PDF quittance after marking as paid.
    //
    // The payment IS recorded at this point, so a receipt failure must not fail
    // the action — but it must not be silent either. generateQuittance refuses
    // when the landlord's own address is incomplete, which is the default state
    // of every account created before the profile page existed. Reporting plain
    // success there would claim a receipt was issued when none was, so the
    // reason travels back as `quittanceError` (AGENTS.md §21, §37).
    const outcome = describeQuittanceOutcome(await generateQuittance(id));

    if (outcome.warning) {
      console.error("markTransactionPaid: quittance not generated:", outcome.warning);
    }

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return {
      success: true,
      data: {
        receiptType,
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
      import("../../emails/payment-reminder"),
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
