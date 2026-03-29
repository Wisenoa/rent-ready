"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { propertySchema } from "@/lib/validations/property";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
};

export async function createProperty(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    
    const raw = Object.fromEntries(formData.entries());
    const parsed = propertySchema.safeParse(raw);
    
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const property = await prisma.property.create({
      data: {
        userId,
        name: parsed.data.name,
        type: parsed.data.type,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2 || null,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        surface: parsed.data.surface || null,
        rooms: parsed.data.rooms || null,
        description: parsed.data.description || null,
        cadastralRef: parsed.data.cadastralRef || null,
        taxRef: parsed.data.taxRef || null,
      },
    });

    revalidatePath("/properties");
    return { success: true, data: { id: property.id } };
  } catch (error) {
    console.error("createProperty error:", error);
    return { success: false, error: "Impossible de créer le bien. Veuillez réessayer." };
  }
}

export async function updateProperty(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    
    // Verify ownership
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Bien introuvable ou accès non autorisé." };
    }

    const raw = Object.fromEntries(formData.entries());
    const parsed = propertySchema.safeParse(raw);
    
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    await prisma.property.update({
      where: { id },
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2 || null,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        surface: parsed.data.surface || null,
        rooms: parsed.data.rooms || null,
        description: parsed.data.description || null,
        cadastralRef: parsed.data.cadastralRef || null,
        taxRef: parsed.data.taxRef || null,
      },
    });

    revalidatePath("/properties");
    return { success: true };
  } catch (error) {
    console.error("updateProperty error:", error);
    return { success: false, error: "Impossible de modifier le bien." };
  }
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Bien introuvable ou accès non autorisé." };
    }

    await prisma.property.delete({ where: { id } });
    revalidatePath("/properties");
    return { success: true };
  } catch (error) {
    console.error("deleteProperty error:", error);
    return { success: false, error: "Impossible de supprimer le bien." };
  }
}
