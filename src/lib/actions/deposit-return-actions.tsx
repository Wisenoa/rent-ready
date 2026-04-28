"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { uploadBuffer } from "@/lib/storage";
import { addDays } from "date-fns";
import { toNumber } from "@/lib/decimal";
import type { ActionResult } from "./property-actions";
import type { DepositReturnData, DepositReturnItem } from "@/lib/deposit-return-generator";

function generateDepositRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DG-${year}-${rand}`;
}

/**
 * Generate a deposit return / settlement form (Décompte de Dépôt de Garantie).
 * Called when a lease ends and the deposit needs to be returned (with possible deductions).
 */
export async function generateDepositReturn(
  leaseId: string,
  deductions: DepositReturnItem[]
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const lease = await prisma.lease.findFirst({
      where: { id: leaseId, userId },
      include: {
        property: true,
        tenant: true,
        user: true,
      },
    });

    if (!lease) {
      return { success: false, error: "Bail introuvable ou accès non autorisé." };
    }

    const { user, property, tenant } = lease;

    // Determine move-out date from lease end or use current date
    const leaseEndDate = lease.endDate || new Date();
    const moveOutDate = lease.endDate || new Date();

    // Deadline: 2 months after move-out (article 22, loi du 6 juillet 1989)
    const returnDeadline = addDays(moveOutDate, 60);

    const depositAmount = toNumber(lease.depositAmount) || 0;
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const amountToReturn = Math.max(0, depositAmount - totalDeductions);
    const referenceNumber = generateDepositRef();

    const depositData: DepositReturnData = {
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
      leaseStartDate: lease.startDate,
      leaseEndDate,
      moveOutDate,
      depositAmount,
      deductions,
      totalDeductions,
      amountToReturn,
      returnDeadline,
      generatedAt: new Date(),
      referenceNumber,
    };

    // Generate PDF server-side
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { DepositReturnPDF } = await import("@/lib/deposit-return-generator");

    const pdfBuffer = await renderToBuffer(<DepositReturnPDF data={depositData} />);

    const objectName = `deposits/${userId}/${leaseId}/${referenceNumber}.pdf`;
    const uploadResult = await uploadBuffer(
      Buffer.from(pdfBuffer),
      objectName,
      "application/pdf"
    );

    // Store Document record
    // Note: DEPOSIT_RETURN type requires schema enum update — using OTHER for now
    await prisma.document.create({
      data: {
        userId,
        type: "OTHER", // TODO: add DEPOSIT_RETURN to DocumentType enum in schema.prisma
        fileName: `${referenceNumber}.pdf`,
        fileUrl: uploadResult.url,
        mimeType: "application/pdf",
        fileSize: pdfBuffer.length,
      },
    });

    revalidatePath("/leases");
    revalidatePath("/documents");

    return {
      success: true,
      data: {
        referenceNumber,
        depositAmount,
        totalDeductions,
        amountToReturn,
        returnDeadline: returnDeadline.toISOString(),
        downloadUrl: uploadResult.url,
        deductionCount: deductions.length,
      },
    };
  } catch (error) {
    console.error("generateDepositReturn error:", error);
    return { success: false, error: "Impossible de générer le décompte de garantie." };
  }
}
