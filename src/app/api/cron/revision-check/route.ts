import { NextRequest, NextResponse } from "next/server";
import Decimal from "decimal.js";
import { prisma } from "@/lib/prisma";
import {
  calculateRentRevision,
  findIrlIndex,
  getLatestIrl,
} from "@/lib/irl-calculator";

/**
 * GET /api/cron/revision-check
 *
 * Cron endpoint to check leases approaching their IRL revision date.
 * Notify landlords 30 days before their lease's annual revision date.
 *
 * Intended to be called daily by an external cron (e.g., GitHub Actions, Vercel Cron).
 * In production, secure this with a secret header check.
 *
 * Query params:
 *   - daysAhead (optional): How many days ahead to check. Default: 30
 *   - dryRun (optional): If "true", returns what would be done without making changes
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const daysAhead = parseInt(url.searchParams.get("daysAhead") || "30", 10);
  const dryRun = url.searchParams.get("dryRun") === "true";

  // CRON_SECRET is required in production — refuse to run without it
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: "Cron endpoint not configured — set CRON_SECRET env var" },
      { status: 500 }
    );
  }
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    // Find leases approaching their revision date
    // Revision date = anniversary of lease start date, 30 days before告知
    const approachingLeases = await prisma.lease.findMany({
      where: {
        status: "ACTIVE",
        revisionDate: {
          gte: now,
          lte: futureDate,
        },
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const results: Array<{
      leaseId: string;
      propertyName: string;
      tenantName: string;
      revisionDate: Date;
      daysUntil: number;
      notificationCreated: boolean;
      preview: {
        currentRent: number;
        newRent: number;
        difference: number;
        percentageChange: number;
        referenceIrl: string;
        newIrl: string;
      } | null;
      error: string | null;
    }> = [];

    for (const lease of approachingLeases) {
      try {
        if (!lease.irlReferenceQuarter || lease.irlReferenceValue === null) {
          results.push({
            leaseId: lease.id,
            propertyName: lease.property.name,
            tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
            revisionDate: lease.revisionDate!,
            daysUntil: Math.ceil(
              (lease.revisionDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ),
            notificationCreated: false,
            preview: null,
            error: "Missing IRL reference data",
          });
          continue;
        }

        // Calculate revision preview
        const latestIrl = getLatestIrl();
        const revision = calculateRentRevision({
          currentRent: lease.rentAmount,
          referenceIrlQuarter: lease.irlReferenceQuarter,
          newIrlQuarter: latestIrl.quarter,
        });

        const revisionPreview = {
          currentRent: revision.currentRent,
          newRent: revision.newRent,
          difference: revision.difference,
          percentageChange: revision.percentageChange,
          referenceIrl: lease.irlReferenceQuarter,
          newIrl: latestIrl.quarter,
        };

        if (dryRun) {
          results.push({
            leaseId: lease.id,
            propertyName: lease.property.name,
            tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
            revisionDate: lease.revisionDate!,
            daysUntil: Math.ceil(
              (lease.revisionDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ),
            notificationCreated: false,
            preview: revisionPreview,
            error: null,
          });
          continue;
        }

        // Check if we already sent a notification for this revision period
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: lease.userId,
            type: "RENT_REMINDER",
            propertyId: lease.property.id,
            createdAt: {
              gte: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), // Within last 25 days
            },
          },
        });

        if (existingNotification) {
          results.push({
            leaseId: lease.id,
            propertyName: lease.property.name,
            tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
            revisionDate: lease.revisionDate!,
            daysUntil: Math.ceil(
              (lease.revisionDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ),
            notificationCreated: false,
            preview: revisionPreview,
            error: "Notification already sent recently",
          });
          continue;
        }

        // Calculate legal cap
        const revisionCap = 0.05;
        const isCapped = revision.percentageChange > revisionCap * 100;
        const rentAmountNum = Decimal.isDecimal(lease.rentAmount)
          ? lease.rentAmount.toNumber()
          : lease.rentAmount;
        const cappedNewRent = isCapped
          ? new Decimal(rentAmountNum).times(1 + revisionCap).toDecimalPlaces(2).toNumber()
          : revision.newRent;

        // Build notification body
        const daysUntil = Math.ceil(
          (lease.revisionDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        const rentChange = revision.newRent > rentAmountNum ? "hausse" : "baisse";
        const body = `Votre loyer pour le bien "${lease.property.name}" (locataire : ${lease.tenant.firstName} ${lease.tenant.lastName}) sera révisé le ${lease.revisionDate!.toLocaleDateString("fr-FR")} (dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""}). ` +
          `Loyer actuel : ${revision.currentRent.toFixed(2)} € → Nouveau loyer : ${cappedNewRent.toFixed(2)} € ` +
          `(${rentChange} de ${Math.abs(revision.percentageChange).toFixed(2)}%). ` +
          `Base : IRL ${lease.irlReferenceQuarter} → ${latestIrl.quarter}. ` +
          (isCapped ? "Variation plafonnée à 5% (Article 17-1 de la loi de 1989)." : "");

        // Create notification
        await prisma.notification.create({
          data: {
            userId: lease.userId,
            propertyId: lease.property.id,
            tenantId: lease.tenant.id,
            type: "RENT_REMINDER",
            title: `Révision de loyer dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""} — ${lease.property.name}`,
            body,
            data: {
              leaseId: lease.id,
              propertyId: lease.property.id,
              tenantId: lease.tenant.id,
              revisionDate: lease.revisionDate!.toISOString(),
              currentRent: lease.rentAmount,
              newRent: cappedNewRent,
              difference: new Decimal(cappedNewRent).minus(rentAmountNum).toDecimalPlaces(2).toNumber(),
              percentageChange: revision.percentageChange,
              referenceIrl: lease.irlReferenceQuarter,
              newIrl: latestIrl.quarter,
              isCapped,
              notificationType: "IRL_REVISION_DUE",
            },
          },
        });

        results.push({
          leaseId: lease.id,
          propertyName: lease.property.name,
          tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
          revisionDate: lease.revisionDate!,
          daysUntil,
          notificationCreated: true,
          preview: revisionPreview,
          error: null,
        });
      } catch (err) {
        results.push({
          leaseId: lease.id,
          propertyName: lease.property.name,
          tenantName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
          revisionDate: lease.revisionDate!,
          daysUntil: Math.ceil(
            (lease.revisionDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          ),
          notificationCreated: false,
          preview: null,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      dryRun,
      daysAhead,
      checkedAt: now.toISOString(),
      totalChecked: approachingLeases.length,
      notificationsSent: results.filter((r) => r.notificationCreated).length,
      results,
    });
  } catch (error) {
    console.error("Revision check cron error:", error);
    return NextResponse.json(
      { error: "Failed to run revision check" },
      { status: 500 }
    );
  }
}