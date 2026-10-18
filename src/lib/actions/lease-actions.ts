"use server";

import { withFinancialTransaction } from "@/lib/services/financial-transaction";

import { recordProductEvent } from "@/lib/analytics/product-events";
import { SubscriptionRequiredError } from "@/lib/subscription-access";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { leaseSchema } from "@/lib/validations/lease";
import type { ActionResult } from "./property-actions";
import { generateAndUploadBailPdf } from "./bail-pdf-server";
import {
  generateRentPeriodsForLease,
  rerateUnpaidRentPeriods,
} from "@/lib/domain/generate-rent-periods";
import { isRevisable, nextRevisionDate } from "@/lib/domain/lease-revision";

export async function createLease(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId({ requireSubscription: true });

    const raw = Object.fromEntries(formData.entries());

    // Both relations are mandatory in the domain model.
    const parsed = leaseSchema.safeParse(raw);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const data = parsed.data;

    // Verify property belongs to user (if provided)
    if (data.propertyId) {
      const property = await prisma.property.findFirst({ where: { id: data.propertyId, userId, deletedAt: null } });
      if (!property || property.userId !== userId) {
        return { success: false, error: "Bien introuvable ou accès non autorisé." };
      }
    }

    // Verify tenant belongs to user (if provided)
    if (data.tenantId) {
      const tenant = await prisma.tenant.findFirst({ where: { id: data.tenantId, userId } });
      if (!tenant || tenant.userId !== userId) {
        return { success: false, error: "Locataire introuvable ou accès non autorisé." };
      }
    }

     
    const leaseData = {
      propertyId: data.propertyId,
      tenantId: data.tenantId,
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

    const lease = await prisma.$transaction(async (tx) => {
      const created = await tx.lease.create({
        data: {
          ...leaseData,
          // The NEXT revision date, not "now": the lease page, the revision page,
          // the preview route and the tenant portal all read this forward, and
          // /api/cron/revision-check selects on it being in the future. Leaving it
          // null at creation is what made that cron match nothing until a
          // landlord applied a revision by hand — see `@/lib/domain/lease-revision`.
          revisionDate: isRevisable(leaseData)
            ? nextRevisionDate(leaseData.startDate, new Date(), leaseData.endDate ?? null)
            : null,
        },
      });
      await generateRentPeriodsForLease(created.id, new Date(), tx);
      return created;
    });

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
    revalidatePath("/leases");
    revalidatePath("/dashboard");
    revalidatePath("/billing");
    await recordProductEvent(userId, "lease_created");
    return { success: true, data: { id: lease.id, propertyId: data.propertyId } };
  } catch (error) {
    if (error instanceof SubscriptionRequiredError) return { success: false, error: error.message };
    console.error("createLease error:", error);
    return { success: false, error: "Impossible de créer le bail." };
  }
}

export async function updateLease(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId({ requireSubscription: true });

    const raw = Object.fromEntries(formData.entries());
    const parsed = leaseSchema.safeParse(raw);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const existing = await prisma.lease.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false, error: "Bail introuvable ou accès non autorisé." };
    }

    // A database failure must roll back both the amendment and its expectations.
    await withFinancialTransaction(async tx => {
      await tx.lease.update({
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

      await rerateUnpaidRentPeriods(id, tx);
      await generateRentPeriodsForLease(id, new Date(), tx);
    });

    revalidatePath("/leases");
    revalidatePath("/leases/" + id);
    revalidatePath("/properties");
    revalidatePath("/tenants");
    revalidatePath("/billing");
    return { success: true };
  } catch (error) {
    if (error instanceof SubscriptionRequiredError) return { success: false, error: error.message };
    console.error("updateLease error:", error);
    return { success: false, error: "Impossible de mettre à jour le bail." };
  }
}

export async function terminateLease(id: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId({ requireSubscription: true });

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
    if (error instanceof SubscriptionRequiredError) return { success: false, error: error.message };
    console.error("terminateLease error:", error);
    return { success: false, error: "Impossible de résilier le bail." };
  }
}
