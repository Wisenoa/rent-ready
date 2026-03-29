"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations/transaction";
import { determineReceiptType } from "@/lib/quittance-generator";
import type { ActionResult } from "./property-actions";

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
    const totalDue = lease.rentAmount + lease.chargesAmount;
    const isFullPayment = parsed.data.amount >= totalDue;
    const receiptType = determineReceiptType(parsed.data.amount, lease.rentAmount, lease.chargesAmount);

    // Calculate rent/charges portions proportionally
    const rentPortion = isFullPayment
      ? lease.rentAmount
      : Math.round((parsed.data.amount * lease.rentAmount / totalDue) * 100) / 100;
    const chargesPortion = isFullPayment
      ? lease.chargesAmount
      : Math.round((parsed.data.amount - rentPortion) * 100) / 100;

    const status = isFullPayment ? "PAID" : "PARTIAL";

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        leaseId: parsed.data.leaseId,
        amount: parsed.data.amount,
        rentPortion,
        chargesPortion,
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
    const totalDue = lease.rentAmount + lease.chargesAmount;
    const isFullPayment = amount >= totalDue;
    const receiptType = determineReceiptType(amount, lease.rentAmount, lease.chargesAmount);

    const rentPortion = isFullPayment
      ? lease.rentAmount
      : Math.round((amount * lease.rentAmount / totalDue) * 100) / 100;
    const chargesPortion = isFullPayment
      ? lease.chargesAmount
      : Math.round((amount - rentPortion) * 100) / 100;

    await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        rentPortion,
        chargesPortion,
        status: isFullPayment ? "PAID" : "PARTIAL",
        isFullPayment,
        receiptType,
        paidAt: paidAt ? new Date(paidAt) : new Date(),
      },
    });

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { success: true, data: { receiptType } };
  } catch (error) {
    console.error("markTransactionPaid error:", error);
    return { success: false, error: "Impossible de valider le paiement." };
  }
}
