"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { leaseSchema, standaloneLeaseSchema } from "@/lib/validations/lease";
import type { ActionResult } from "./property-actions";
import { generateAndUploadBailPdf } from "./bail-pdf-server";
import { generateRentPeriodsForLease } from "@/lib/domain/generate-rent-periods";

export async function createLease(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const raw = Object.fromEntries(formData.entries());

    // Try strict schema first (both propertyId + tenantId required)
    let parsed = leaseSchema.safeParse(raw);

    // Fall back to relaxed schema (propertyId OR tenantId is fine)
    if (!parsed.success) {
      parsed = standaloneLeaseSchema.safeParse(raw) as typeof parsed;
    }

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const data = parsed.data;

    // Verify property belongs to user (if provided)
    if (data.propertyId) {
      const property = await prisma.property.findUnique({ where: { id: data.propertyId } });
      if (!property || property.userId !== userId) {
        return { success: false, error: "Bien introuvable ou accès non autorisé." };
      }
    }

    // Verify tenant belongs to user (if provided)
    if (data.tenantId) {
      const tenant = await prisma.tenant.findUnique({ where: { id: data.tenantId } });
      if (!tenant || tenant.userId !== userId) {
        return { success: false, error: "Locataire introuvable ou accès non autorisé." };
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leaseData: any = {
      userId,
      rentAmount: data.rentAmount,
      chargesAmount: data.chargesAmount,
      depositAmount: data.depositAmount,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      paymentDay: data.paymentDay,
      paymentMethod: data.paymentMethod,
      leaseType: data.leaseType,
      irlReferenceQuarter: data.irlReferenceQuarter || null,
      irlReferenceValue: data.irlReferenceValue ?? null,
    };

    if (data.propertyId) {
      leaseData.propertyId = data.propertyId;
    }
    if (data.tenantId) {
      leaseData.tenantId = data.tenantId;
    }

    const lease = await prisma.lease.create({
      data: leaseData,
    });

    // Generate the rent periods owed from the lease start through the current
    // month. Without this nothing records what is owed, so arrears detection and
    // the relance flow had no data to work from.
    try {
      await generateRentPeriodsForLease(lease.id);
    } catch (error) {
      // The lease exists and is usable; generation can be retried by the cron job.
      console.error("generateRentPeriodsForLease error:", error);
    }

    // Generate and upload bail PDF — best-effort (non-blocking)
    if (data.propertyId && data.tenantId) {
      const documentUrl = await generateAndUploadBailPdf(
        lease.id,
        userId,
        data.propertyId,
        data.tenantId,
        leaseData
      );

      if (documentUrl) {
        await prisma.lease.update({
          where: { id: lease.id },
          data: { documentUrl },
        });
      }
    }

    revalidatePath("/properties");
    revalidatePath("/tenants");
    revalidatePath("/billing");
    return { success: true, data: { id: lease.id } };
  } catch (error) {
    console.error("createLease error:", error);
    return { success: false, error: "Impossible de créer le bail." };
  }
}

export async function updateLease(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const raw = Object.fromEntries(formData.entries());
    const parsed = leaseSchema.safeParse(raw);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const existing = await prisma.lease.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Bail introuvable ou accès non autorisé." };
    }

    await prisma.lease.update({
      where: { id },
      data: {
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

    // A rent change only affects periods that are still unpaid; settled history
    // must keep the amounts that were actually invoiced.
    const rentChanged =
      existing.rentAmount.toString() !== String(parsed.data.rentAmount) ||
      existing.chargesAmount.toString() !== String(parsed.data.chargesAmount);

    if (rentChanged) {
      try {
        await prisma.transaction.deleteMany({
          where: { leaseId: id, paidAt: null },
        });
        await generateRentPeriodsForLease(id);
      } catch (error) {
        console.error("regenerateRentPeriods error:", error);
      }
    }

    revalidatePath("/leases");
    revalidatePath("/leases/" + id);
    revalidatePath("/properties");
    revalidatePath("/tenants");
    revalidatePath("/billing");
    return { success: true };
  } catch (error) {
    console.error("updateLease error:", error);
    return { success: false, error: "Impossible de mettre à jour le bail." };
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
