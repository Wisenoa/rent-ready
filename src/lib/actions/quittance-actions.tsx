"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import {
  determineReceiptType,
  generateReceiptNumber,
  type QuittanceData,
} from "@/lib/quittance-generator";
import { generateAndUploadQuittancePdf } from "./quittance-pdf-server";
import type { ActionResult } from "./property-actions";

/**
 * Generate a quittance/reçu for a transaction.
 * This is the main entry point for PDF generation.
 *
 * Business rules (loi du 6 juillet 1989, article 21):
 * - Full payment → "Quittance de loyer"
 * - Partial payment → "Reçu de paiement partiel" with remaining balance
 * - Must separate "Loyer de base" and "Provisions pour charges"
 * - Must include full addresses of landlord and tenant
 */
export async function generateQuittance(transactionId: string): Promise<ActionResult> {
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

    if (!transaction.paidAt) {
      return { success: false, error: "Le paiement n'a pas encore été enregistré." };
    }

    const { lease, user } = transaction;
    const { property, tenant } = lease;

    const receiptType = determineReceiptType(
      transaction.amount,
      lease.rentAmount,
      lease.chargesAmount
    );

    const currentCount = await prisma.transaction.count({
      where: {
        userId,
        receiptNumber: { not: null },
      },
    });
    const receiptNumber = generateReceiptNumber(
      receiptType,
      transaction.paidAt,
      currentCount + 1
    );

    const quittanceData: QuittanceData = {
      landlord: {
        firstName: user.firstName,
        lastName: user.lastName,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2 ?? undefined,
        city: user.city,
        postalCode: user.postalCode,
      },
      tenant: {
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        addressLine1: tenant.addressLine1,
        addressLine2: tenant.addressLine2 ?? undefined,
        city: tenant.city,
        postalCode: tenant.postalCode,
      },
      propertyAddress: [
        property.addressLine1,
        property.addressLine2,
        `${property.postalCode} ${property.city}`,
      ]
        .filter(Boolean)
        .join(", "),
      rentAmount: lease.rentAmount,
      chargesAmount: lease.chargesAmount,
      totalAmount: transaction.amount,
      periodStart: transaction.periodStart,
      periodEnd: transaction.periodEnd,
      paidAt: transaction.paidAt,
      receiptNumber,
      isFullPayment: receiptType === "QUITTANCE",
    };

    // Delegate PDF generation to the dedicated server module (avoids duplicate renderToBuffer + embedFacturX logic)
    const receiptUrl = await generateAndUploadQuittancePdf(
      transactionId,
      quittanceData,
      receiptNumber,
      userId
    );

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        receiptType,
        receiptNumber,
        receiptUrl: receiptUrl || null,
      },
    });

    revalidatePath("/billing");
    return {
      success: true,
      data: {
        receiptType,
        receiptNumber,
        receiptUrl: receiptUrl || "",
        quittanceData: JSON.parse(JSON.stringify(quittanceData)),
      },
    };
  } catch (error) {
    console.error("generateQuittance error:", error);
    return { success: false, error: "Impossible de générer la quittance." };
  }
}
