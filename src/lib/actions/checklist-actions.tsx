"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { uploadBuffer } from "@/lib/storage";
import type { ActionResult } from "./property-actions";
import type {
  ChecklistData,
  ChecklistItem,
  ChecklistType,
} from "@/lib/checklist-generator";
import { DEFAULT_CHECKLIST_ITEMS } from "@/lib/checklist-default-items";

function generateChecklistRef(type: ChecklistType): string {
  const year = new Date().getFullYear();
  const prefix = type === "ENTRY" ? "EL" : "ES";
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}-${rand}`;
}


/**
 * Generate a move-in or move-out checklist (État des Lieux).
 */
export async function generateChecklist(
  leaseId: string,
  type: ChecklistType,
  items?: ChecklistItem[],
  inspectionDate?: Date,
  generalComment?: string
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

    const referenceNumber = generateChecklistRef(type);
    const effectiveDate = inspectionDate || new Date();
    const checklistItems = items || DEFAULT_CHECKLIST_ITEMS.map((item) => ({ ...item }));

    const checklistData: ChecklistData = {
      type,
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
      property: {
        addressLine1: property.addressLine1,
        addressLine2: property.addressLine2 ?? undefined,
        city: property.city,
        postalCode: property.postalCode,
        surface: property.surface ?? undefined,
        type: property.type ?? undefined,
        rooms: property.rooms ?? undefined,
      },
      inspectionDate: effectiveDate,
      items: checklistItems,
      generalComment,
      referenceNumber,
      generatedAt: new Date(),
    };

    // Generate PDF server-side
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { ChecklistPDF } = await import("@/lib/checklist-generator");

    const pdfBuffer = await renderToBuffer(<ChecklistPDF data={checklistData} />);

    // Note: CHECKLIST_IN/CHECKLIST_OUT types require schema enum update — using OTHER for now
    const documentType = "OTHER" as const; // TODO: add CHECKLIST_IN, CHECKLIST_OUT to DocumentType enum
    const objectName = `checklists/${userId}/${leaseId}/${referenceNumber}.pdf`;
    const uploadResult = await uploadBuffer(
      Buffer.from(pdfBuffer),
      objectName,
      "application/pdf"
    );

    // Store Document record
    await prisma.document.create({
      data: {
        userId,
        type: documentType,
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
        type,
        itemCount: checklistItems.length,
        downloadUrl: uploadResult.url,
      },
    };
  } catch (error) {
    console.error("generateChecklist error:", error);
    return { success: false, error: "Impossible de générer l'état des lieux." };
  }
}
