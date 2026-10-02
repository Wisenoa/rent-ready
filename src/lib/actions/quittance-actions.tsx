"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import {
  determineReceiptTypeCumulative,
  type QuittanceData,
} from "@/lib/quittance-generator";
import { allocateReceiptNumber } from "@/lib/receipt-number";
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

    // Judge the period, not the payment. A tenant who settles 700 EUR of rent in
    // two instalments must obtain a quittance on the payment that completes it;
    // looking only at that payment's amount denied it, which is a legal problem
    // under loi du 6 juillet 1989 art. 21.
    // Count only what had been received by this payment's own date. Without the
    // paidAt bound this summed LATER instalments too, so receipting the first of
    // two payments saw the second and issued a quittance for a balance that was
    // still outstanding.
    const priorPayments = await prisma.transaction.aggregate({
      where: {
        leaseId: transaction.leaseId,
        paidAt: { not: null },
        periodStart: transaction.periodStart,
        periodEnd: transaction.periodEnd,
        id: { not: transaction.id },
        // Strictly "recorded before this payment", which is the only ordering
        // that is reliable: two instalments recorded the same day share paidAt,
        // so a paidAt comparison alone would let a later payment leak into an
        // earlier receipt. Comparing (paidAt, createdAt) lexicographically is
        // not expressible in one Prisma where-clause, so the two are handled as:
        // an earlier paidAt always counts, and a tie falls back to createdAt.
        OR: [
          { paidAt: { lt: transaction.paidAt } },
          {
            paidAt: transaction.paidAt,
            createdAt: { lt: transaction.createdAt },
          },
        ],
      },
      _sum: { amount: true },
    });

    const receiptType = determineReceiptTypeCumulative(
      transaction.amount,
      lease.rentAmount,
      lease.chargesAmount,
      priorPayments._sum.amount ?? 0
    );

    // Atomic per-landlord allocation. This was count()+1, a read followed by a
    // write: two receipts generated in the same second read the same count and
    // were handed the same number, silently. See src/lib/receipt-number.ts.
    const receiptNumber = await allocateReceiptNumber(
      userId,
      receiptType,
      transaction.paidAt
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

    // Delegate PDF generation to the dedicated server module. A failure here must
    // not be reported as success: previously an unconfigured storage backend
    // yielded a placeholder URL and `success: true`, so the UI showed a receipt
    // that could not be downloaded and no document existed.
    let receiptUrl: string;
    try {
      const url = await generateAndUploadQuittancePdf(
        transactionId,
        quittanceData,
        receiptNumber,
        userId
      );
      if (!url) {
        return {
          success: false,
          error: "La quittance n'a pas pu être enregistrée. Réessayez.",
        };
      }
      receiptUrl = url;
    } catch (error) {
      console.error("generateQuittance PDF generation failed:", error);
      return {
        success: false,
        error:
          "Impossible d'enregistrer la quittance. Le paiement reste enregistré, " +
          "mais aucun document n'a été généré.",
      };
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        receiptType,
        receiptNumber,
        receiptUrl,
      },
    });

    revalidatePath("/billing");
    return {
      success: true,
      data: {
        receiptType,
        receiptNumber,
        receiptUrl,
        quittanceData: JSON.parse(JSON.stringify(quittanceData)),
      },
    };
  } catch (error) {
    console.error("generateQuittance error:", error);
    return { success: false, error: "Impossible de générer la quittance." };
  }
}
