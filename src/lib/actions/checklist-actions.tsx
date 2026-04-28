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

function generateChecklistRef(type: ChecklistType): string {
  const year = new Date().getFullYear();
  const prefix = type === "ENTRY" ? "EL" : "ES";
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}-${rand}`;
}

// Default inspection items grouped by category
export const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  // Entrée / Salon
  { category: "Séjour", label: "Peintures et murs", condition: "GOOD" },
  { category: "Séjour", label: "Sols (parquet, carrelage, moquette)", condition: "GOOD" },
  { category: "Séjour", label: "Fenêtres et vitrages", condition: "GOOD" },
  { category: "Séjour", label: "Volets / stores", condition: "GOOD" },
  { category: "Séjour", label: "Plinthes et finitions", condition: "GOOD" },
  { category: "Séjour", label: "Éclairage (spots, lustres)", condition: "GOOD" },
  { category: "Séjour", label: "Prises électriques et interrupteurs", condition: "GOOD" },
  // Cuisine
  { category: "Cuisine", label: "Meubles de cuisine", condition: "GOOD" },
  { category: "Cuisine", label: "Plan de travail", condition: "GOOD" },
  { category: "Cuisine", label: "Évier et robineterie", condition: "GOOD" },
  { category: "Cuisine", label: "Plaques de cuisson", condition: "GOOD" },
  { category: "Cuisine", label: "Four / four micro-ondes", condition: "GOOD" },
  { category: "Cuisine", label: "Réfrigérateur / freezer", condition: "GOOD" },
  { category: "Cuisine", label: "Hotte aspirante", condition: "GOOD" },
  // Salle de bain
  { category: "Salle de bain", label: "Sanitaires (wc, lavabo, douche/baignoire)", condition: "GOOD" },
  { category: "Salle de bain", label: "Robineterie (mitigeurs, flexibles)", condition: "GOOD" },
  { category: "Salle de bain", label: "Carrelage et joints", condition: "GOOD" },
  { category: "Salle de bain", label: "Miroir et éclairage", condition: "GOOD" },
  { category: "Salle de bain", label: "Ventilation / VMC", condition: "GOOD" },
  { category: "Salle de bain", label: "Porte de salle de bain", condition: "GOOD" },
  // Chambres
  { category: "Chambres", label: "Peintures et murs", condition: "GOOD" },
  { category: "Chambres", label: "Sols", condition: "GOOD" },
  { category: "Chambres", label: "Fenêtres et vitrages", condition: "GOOD" },
  { category: "Chambres", label: "Volets / stores", condition: "GOOD" },
  { category: "Chambres", label: "Armoires intégrées", condition: "GOOD" },
  // WC
  { category: "WC", label: "Cuvette et flush", condition: "GOOD" },
  { category: "WC", label: "Robinet d'arrêt", condition: "GOOD" },
  { category: "WC", label: "Sol et murs", condition: "GOOD" },
  // Parties communes / extérieur
  { category: "Extérieur", label: "Balcon / terrasse", condition: "GOOD" },
  { category: "Extérieur", label: "Parking / garage", condition: "GOOD" },
  { category: "Extérieur", label: "Cave / grenier", condition: "GOOD" },
  { category: "Extérieur", label: "Espaces communs (entrée, escalier)", condition: "GOOD" },
  // Équipement / confort
  { category: "Équipement", label: "Chauffage / radiateurs", condition: "GOOD" },
  { category: "Équipement", label: "Climatisation / climatisation réversible", condition: "GOOD" },
  { category: "Équipement", label: "Ballon d'eau chaude", condition: "GOOD" },
  { category: "Équipement", label: "Compteur électrique", condition: "GOOD" },
  { category: "Équipement", label: "Compteur d'eau", condition: "GOOD" },
  { category: "Équipement", label: "Porte d'entrée et serrure", condition: "GOOD" },
  { category: "Équipement", label: "Interphone / digicode", condition: "GOOD" },
  { category: "Équipement", label: " Détecteur de fumée", condition: "GOOD" },
];

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
