"use server";

import { revalidatePath } from "next/cache";
import Decimal from "decimal.js";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { type QuittanceData } from "@/lib/quittance-generator";
import {
  settlePeriodPayments,
  paymentsBefore,
} from "@/lib/domain/period-settlement";
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
 *
 * IDEMPOTENT. One payment has at most one receipt document, enforced by the
 * UNIQUE index on `Document.transactionId`. It used to allocate a new number and
 * create a new `Document` on every call, so a double click, a retry or two open
 * tabs produced N documents and N references for one payment, and the earlier
 * ones were orphaned with their number burned. Now the winner's document is
 * returned to every later caller.
 *
 * REPRODUCIBLE. The amounts printed are the ones FROZEN on the payment when it
 * was recorded (`receiptRentAmount` / `receiptChargesAmount`), not the lease's
 * current ones: a receipt states what a payment was made against, and an IRL
 * revision between the payment and the download used to print the new rent for
 * money received at the old one (AGENTS.md 14).
 *
 * NOT SENT BY EMAIL. Issuing a receipt here does not email it to the tenant.
 * That is deliberate for the beta: the landlord downloads it from the billing
 * screen and forwards it. Wiring an outbound mail to this action would make a
 * legal document leave the system without the landlord ever asking for it, and
 * there is no tenant-facing preference yet to justify it. If that changes, this
 * function is where the send belongs — as an explicit, separately reported step,
 * not folded silently into generation.
 */

/** A Postgres unique violation, whatever shape the driver throws it in. */
function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const code = (error as { code?: unknown }).code;
  return code === "P2002" || code === "23505";
}

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
        receiptDocument: true,
      },
    });

    if (!transaction || transaction.userId !== userId) {
      return { success: false, error: "Transaction introuvable ou accès non autorisé." };
    }

    if (!transaction.paidAt) {
      return { success: false, error: "Le paiement n'a pas encore été enregistré." };
    }

    // A CANCELLED row keeps its amount and its paidAt for the audit trail, so the
    // only thing that distinguishes it from real money is the status. Issuing a
    // receipt for it would attest that money arrived when it went back.
    if (transaction.status === "CANCELLED") {
      return {
        success: false,
        error: "Ce paiement a été annulé : il n'y a rien à receipter.",
      };
    }

    // Already receipted: return that document rather than minting a second one.
    // This is the cheap path (one indexed read); the UNIQUE index below is what
    // makes it correct when two calls arrive together and both find nothing.
    if (transaction.receiptDocument) {
      return {
        success: true,
        data: {
          receiptType: transaction.receiptType,
          receiptNumber: transaction.receiptNumber,
          receiptUrl: transaction.receiptUrl ?? transaction.receiptDocument.fileUrl,
          documentId: transaction.receiptDocument.id,
          existing: true,
        },
      };
    }

    const { lease, user } = transaction;
    const { property, tenant } = lease;

    // A quittance is a legal document (loi du 6 juillet 1989, art. 21) and must
    // carry the landlord's full address. The User columns default to "", and
    // nothing used to let a landlord fill them, so this used to render an empty
    // "bailleur" block: an unusable document. Refuse it instead, and say what to
    // do about it. This also fires before allocateReceiptNumber, so a refused
    // generation does not burn a receipt number.
    if (!user.addressLine1.trim() || !user.city.trim() || !user.postalCode.trim()) {
      return {
        success: false,
        error:
          "Complétez votre adresse de propriétaire dans Mon profil pour pouvoir générer une quittance.",
      };
    }

    // What the period OWED at the moment this payment was recorded. Frozen on the
    // row by `recordRentPayment`, `settleRentPeriod` and the bank webhook. Rows
    // written before that (and nothing else) fall back to the lease, which is what
    // every receipt before this change described.
    const periodRent = transaction.receiptRentAmount ?? lease.rentAmount;
    const periodCharges = transaction.receiptChargesAmount ?? lease.chargesAmount;

    // Judge the PERIOD, not this payment — and take BOTH answers (QUITTANCE or
    // RECU, and the balance left) from the one rule, `settlePeriodPayments`.
    //
    // A tenant who settles 700 EUR of rent in two instalments must obtain a
    // quittance on the payment that completes it; looking only at that payment's
    // amount denied it, which is a legal problem under loi du 6 juillet 1989
    // art. 21. But the type is only half the question: `determineReceiptType
    // Cumulative` decided that half here while the PDF derived the OTHER half
    // itself, from this payment alone. A 970,55 month paid 300 + 300 was
    // receipted as a RECU announcing 670,55 owed instead of 370,55 — and that
    // contradicted the `remainingDue` GET /api/transactions/[id]/receipt reports
    // for the very same payment. Same inputs, same function, one figure: that is
    // what stops the archive, the JSON view and the UI from disagreeing.
    //
    // Only what had been received by this payment's own date counts. Without that
    // bound this summed LATER instalments too, so receipting the first of two
    // payments saw the second and issued a quittance for a balance that was still
    // outstanding.
    //
    // `status: { not: "CANCELLED" }` is the SAME filter the door, the settlement,
    // `dashboard-stats`, /billing and the payments summary use. Without it a
    // cancelled receipt counted as money received before this payment: cancel a
    // month's 970,55 EUR, record 300 EUR as an instalment, and the sum still
    // carried the 970,55 — so this 300 EUR payment was receipted as a QUITTANCE DE
    // SOLDE (a QUI- number) for a month with 670,55 EUR still owed. A legal
    // document attesting to a settled month that is not settled.
    const periodPayments = await prisma.transaction.findMany({
      where: {
        leaseId: transaction.leaseId,
        paidAt: { not: null },
        status: { not: "CANCELLED" },
        periodStart: transaction.periodStart,
        periodEnd: transaction.periodEnd,
      },
      select: { id: true, amount: true, paidAt: true, createdAt: true },
      orderBy: [{ paidAt: "asc" }, { createdAt: "asc" }],
    });

    // `paymentsBefore` keeps what was received strictly before this payment,
    // ordered by paidAt with createdAt breaking the same-day tie. Two instalments
    // recorded the same day share paidAt, so a paidAt comparison alone would let a
    // later payment leak into an earlier receipt — and comparing (paidAt, createdAt)
    // lexicographically is not expressible in one Prisma where-clause.
    const asOf = paymentsBefore(periodPayments, transaction);

    const current = {
      id: transaction.id,
      amount: transaction.amount,
      paidAt: transaction.paidAt,
      createdAt: transaction.createdAt,
    };

    const settlement = settlePeriodPayments({
      rentAmount: periodRent,
      chargesAmount: periodCharges,
      payments: [...asOf, current],
      current,
    });

    // A stored type is the type the ISSUED document must carry.
    //
    // Recomputing it here silently rewrote history: `asOf` holds the payments of
    // the month BEFORE this one, so on the row that settled a month paid in
    // instalments it saw 500 against 900 owed, decided « Reçu », and line 285
    // wrote that verdict back over the correct « Quittance » the settlement had
    // recorded. The landlord then downloaded a "Reçu de paiement partiel" for a
    // month they had fully paid, and the type stayed wrong for every later read.
    //
    // The domain already decided this once, when the money actually moved; the
    // document follows the transaction, not a second opinion computed at
    // download time. Falling back to the derivation only covers a payment that
    // predates the stored type.
    const receiptType = transaction.receiptType ?? settlement.receiptType;
    // What the tenant still owes for the month AFTER this payment, floored at 0
    // and rounded once, in Decimal: an overpayment must never print as a credit
    // invented by the document.
    const remainingAmount = settlement.outstanding.toDecimalPlaces(2);

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
      rentAmount: new Decimal(periodRent),
      chargesAmount: new Decimal(periodCharges ?? 0),
      totalAmount: transaction.amount,
      // The balance the settlement just decided, not a figure this document
      // works out for itself. Same `settlePeriodPayments` call as the receipt
      // route, so the PDF and the JSON view cannot print different numbers for
      // one payment.
      remainingAmount,
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
    let documentId: string;
    try {
      const result = await generateAndUploadQuittancePdf(
        transactionId,
        quittanceData,
        receiptNumber,
        userId
      );
      // A missing document id means the bytes could not be persisted, so there is
      // nothing to download: report it instead of claiming a receipt.
      if (!result?.documentId) {
        return {
          success: false,
          error: "La quittance n'a pas pu être enregistrée. Réessayez.",
        };
      }
      receiptUrl = result.url;
      documentId = result.documentId;
    } catch (error) {
      // A unique violation on `Document.transactionId` is not a generation
      // failure: it means a concurrent call already produced this receipt. Let it
      // reach the handler below, which answers with that document instead of
      // telling the landlord a receipt exists when it does not.
      if (isUniqueViolation(error)) throw error;
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

    // `revalidatePath` needs a request context. This action is also reached from
    // a route handler and from a background caller, where there is none, and
    // Next throws rather than no-op — which turned a successful generation into
    // an error the landlord sees as a failed download. The receipt is already
    // persisted and downloadable at this point; the cache refresh is an
    // optimisation, not the work.
    try {
      revalidatePath("/billing");
    } catch (revalidationError) {
      console.warn("revalidatePath(/billing) skipped:", revalidationError);
    }
    return {
      success: true,
      data: {
        receiptType,
        receiptNumber,
        receiptUrl,
        documentId,
        existing: false,
        // Kept for callers that render the figures (the GET receipt route's
        // tests, the mark-paid flow). The client no longer re-renders the PDF from
        // this: it downloads the archived document.
        quittanceData: JSON.parse(JSON.stringify(quittanceData)),
      },
    };
  } catch (error) {
    // Two calls that raced both reached the document insert; the UNIQUE index on
    // `Document.transactionId` rejected the loser. That is the index doing its
    // job, not a failure: the winner's document is the receipt for this payment,
    // so hand it back rather than reporting an error the landlord cannot act on.
    if (isUniqueViolation(error)) {
      const userId = await getCurrentUserId();
      const winner = await prisma.transaction.findFirst({
        where: { id: transactionId, userId },
        include: { receiptDocument: true },
      });
      if (winner?.receiptDocument) {
        return {
          success: true,
          data: {
            receiptType: winner.receiptType,
            receiptNumber: winner.receiptNumber,
            receiptUrl: winner.receiptUrl ?? winner.receiptDocument.fileUrl,
            documentId: winner.receiptDocument.id,
            existing: true,
          },
        };
      }
    }
    console.error("generateQuittance error:", error);
    return { success: false, error: "Impossible de générer la quittance." };
  }
}