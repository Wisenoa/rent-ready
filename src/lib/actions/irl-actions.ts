"use server";

import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateRentRevision,
  getLatestIrl,
  getAvailableQuarters,
  type RentRevisionResult,
} from "@/lib/irl-calculator";
import type { ActionResult } from "./property-actions";

export async function computeRentRevision(
  leaseId: string,
  newIrlQuarter: string
): Promise<ActionResult & { data?: { revision: RentRevisionResult } }> {
  try {
    const userId = await getCurrentUserId();

    const lease = await prisma.lease.findUnique({ where: { id: leaseId } });
    if (!lease || lease.userId !== userId) {
      return { success: false, error: "Bail introuvable ou accès non autorisé." };
    }

    if (!lease.irlReferenceQuarter || !lease.irlReferenceValue) {
      return {
        success: false,
        error: "Ce bail n'a pas d'IRL de référence configuré. Veuillez d'abord renseigner l'IRL à la signature du bail.",
      };
    }

    const revision = calculateRentRevision({
      currentRent: lease.rentAmount,
      referenceIrlQuarter: lease.irlReferenceQuarter,
      newIrlQuarter,
    });

    return { success: true, data: { revision } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors du calcul de la révision." };
  }
}

export async function applyRentRevision(
  leaseId: string,
  newRent: number,
  newIrlQuarter: string,
  newIrlValue: number
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const lease = await prisma.lease.findUnique({ where: { id: leaseId } });
    if (!lease || lease.userId !== userId) {
      return { success: false, error: "Bail introuvable ou accès non autorisé." };
    }

    await prisma.lease.update({
      where: { id: leaseId },
      data: {
        rentAmount: newRent,
        irlReferenceQuarter: newIrlQuarter,
        irlReferenceValue: newIrlValue,
        revisionDate: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("applyRentRevision error:", error);
    return { success: false, error: "Impossible d'appliquer la révision." };
  }
}

export async function getIrlInfo() {
  return {
    latestIrl: getLatestIrl(),
    availableQuarters: getAvailableQuarters(),
  };
}
