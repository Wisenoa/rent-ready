"use server";

import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateRentRevision,
  getLatestIrl,
  getAvailableQuarters,
  type RentRevisionResult,
} from "@/lib/irl-calculator";
import { nextRevisionDate } from "@/lib/domain/lease-revision";
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

/**
 * Apply a rent revision to a lease.
 *
 * `revisionDate` is NOT "now". Every consumer reads it as the NEXT revision
 * date — the lease page prints it as « Date de révision IRL », the revision page
 * counts the days until it, the preview route reports `daysUntilRevision`, and
 * the tenant portal calls it `renewalDate`. It used to be set to `new Date()`,
 * the moment the button was clicked, so `daysUntilRevision` was negative on
 * every lease and `/api/cron/revision-check` (which selects `revisionDate >=
 * now`) could not match a single row: the only writer stored a date that had
 * already passed by the time anything read it.
 *
 * `nextRevisionDate` returns the anniversary AFTER the moment of application, so
 * applying a revision on its own date advances the lease a full year rather than
 * leaving it due again today.
 *
 * Periods are NOT regenerated here, and that is the rule rather than an omission:
 * a revision applies to the months not yet materialised, and the month in
 * progress keeps what the tenant was already asked for. See the note on
 * `generateRentPeriodsForLease`.
 */
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

    const now = new Date();
    await prisma.lease.update({
      where: { id: leaseId },
      data: {
        rentAmount: newRent,
        irlReferenceQuarter: newIrlQuarter,
        irlReferenceValue: newIrlValue,
        revisionDate: nextRevisionDate(lease.startDate, now, lease.endDate),
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
