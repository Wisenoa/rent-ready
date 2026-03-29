"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { tenantSchema } from "@/lib/validations/tenant";
import type { ActionResult } from "./property-actions";

export async function createTenant(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    
    const raw = Object.fromEntries(formData.entries());
    const parsed = tenantSchema.safeParse(raw);
    
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const tenant = await prisma.tenant.create({
      data: {
        userId,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2 || null,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
        placeOfBirth: parsed.data.placeOfBirth || null,
        emergencyName: parsed.data.emergencyName || null,
        emergencyPhone: parsed.data.emergencyPhone || null,
      },
    });

    revalidatePath("/tenants");
    return { success: true, data: { id: tenant.id } };
  } catch (error) {
    console.error("createTenant error:", error);
    return { success: false, error: "Impossible de créer le locataire." };
  }
}

export async function updateTenant(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    
    const existing = await prisma.tenant.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Locataire introuvable ou accès non autorisé." };
    }

    const raw = Object.fromEntries(formData.entries());
    const parsed = tenantSchema.safeParse(raw);
    
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    await prisma.tenant.update({
      where: { id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2 || null,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
        placeOfBirth: parsed.data.placeOfBirth || null,
        emergencyName: parsed.data.emergencyName || null,
        emergencyPhone: parsed.data.emergencyPhone || null,
      },
    });

    revalidatePath("/tenants");
    return { success: true };
  } catch (error) {
    console.error("updateTenant error:", error);
    return { success: false, error: "Impossible de modifier le locataire." };
  }
}

export async function deleteTenant(id: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    
    const existing = await prisma.tenant.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Locataire introuvable ou accès non autorisé." };
    }

    await prisma.tenant.delete({ where: { id } });
    revalidatePath("/tenants");
    return { success: true };
  } catch (error) {
    console.error("deleteTenant error:", error);
    return { success: false, error: "Impossible de supprimer le locataire." };
  }
}
