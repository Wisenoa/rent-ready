"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { leaseSchema } from "@/lib/validations/lease";
import type { ActionResult } from "./property-actions";

export async function createLease(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const raw = Object.fromEntries(formData.entries());
    const parsed = leaseSchema.safeParse(raw);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    // Verify property and tenant belong to user
    const [property, tenant] = await Promise.all([
      prisma.property.findUnique({ where: { id: parsed.data.propertyId } }),
      prisma.tenant.findUnique({ where: { id: parsed.data.tenantId } }),
    ]);

    if (!property || property.userId !== userId) {
      return { success: false, error: "Bien introuvable ou accès non autorisé." };
    }
    if (!tenant || tenant.userId !== userId) {
      return { success: false, error: "Locataire introuvable ou accès non autorisé." };
    }

    const lease = await prisma.lease.create({
      data: {
        userId,
        propertyId: parsed.data.propertyId,
        tenantId: parsed.data.tenantId,
        rentAmount: parsed.data.rentAmount,
        chargesAmount: parsed.data.chargesAmount,
        depositAmount: parsed.data.depositAmount,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        paymentDay: parsed.data.paymentDay,
        paymentMethod: parsed.data.paymentMethod,
        leaseType: parsed.data.leaseType,
        irlReferenceQuarter: parsed.data.irlReferenceQuarter || null,
        irlReferenceValue: parsed.data.irlReferenceValue ?? null,
      },
    });

    revalidatePath("/properties");
    revalidatePath("/tenants");
    revalidatePath("/billing");
    return { success: true, data: { id: lease.id } };
  } catch (error) {
    console.error("createLease error:", error);
    return { success: false, error: "Impossible de créer le bail." };
  }
}

export async function terminateLease(id: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const existing = await prisma.lease.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Bail introuvable ou accès non autorisé." };
    }

    await prisma.lease.update({
      where: { id },
      data: { status: "TERMINATED", endDate: new Date() },
    });

    revalidatePath("/properties");
    revalidatePath("/tenants");
    return { success: true };
  } catch (error) {
    console.error("terminateLease error:", error);
    return { success: false, error: "Impossible de résilier le bail." };
  }
}
