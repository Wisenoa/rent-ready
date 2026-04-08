import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateRentRevision,
  findIrlIndex,
  getLatestIrl,
  type RentRevisionResult,
} from "@/lib/irl-calculator";

/**
 * GET /api/leases/[id]/revision-preview
 *
 * Preview the IRL-based rent revision for a lease.
 * Returns current rent, proposed new rent, and the delta.
 *
 * Query params:
 *   - newIrlQuarter (optional): Override the IRL quarter to calculate against.
 *     Defaults to the latest known IRL if not provided.
 *
 * Reference: Article 17-1 de la loi n°89-462 du 6 juillet 1989
 * Formula: New Rent = Current Rent × (New IRL / Reference IRL)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    const { id } = await params;

    const url = new URL(request.url);
    const newIrlQuarterParam = url.searchParams.get("newIrlQuarter");

    // Fetch the lease — must belong to the authenticated user
    const lease = await prisma.lease.findFirst({
      where: {
        id,
        userId,
        status: "ACTIVE",
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
      },
    });

    if (!lease) {
      return NextResponse.json(
        { error: "Lease not found or access denied" },
        { status: 404 }
      );
    }

    // Determine the reference IRL (stored at lease signing)
    if (!lease.irlReferenceQuarter || lease.irlReferenceValue === null) {
      return NextResponse.json(
        {
          error:
            "Lease is missing IRL reference data. " +
            "Cannot calculate revision without irlReferenceQuarter.",
          code: "IRL_REFERENCE_MISSING",
        },
        { status: 422 }
      );
    }

    // Determine the new IRL to use
    const latestIrl = getLatestIrl();
    const newIrlQuarter = newIrlQuarterParam || latestIrl.quarter;

    const referenceIrlEntry = findIrlIndex(lease.irlReferenceQuarter);
    const newIrlEntry = findIrlIndex(newIrlQuarter);

    if (!referenceIrlEntry) {
      return NextResponse.json(
        {
          error: `Reference IRL quarter "${lease.irlReferenceQuarter}" not found in database.`,
          code: "IRL_REFERENCE_NOT_FOUND",
        },
        { status: 422 }
      );
    }

    if (!newIrlEntry) {
      return NextResponse.json(
        {
          error: `Requested IRL quarter "${newIrlQuarter}" not found.`,
          code: "IRL_NEW_NOT_FOUND",
          availableQuarters: ["T1-2023", "T2-2023", "T3-2023", "T4-2023", "T1-2024", "T2-2024", "T3-2024", "T4-2024", "T1-2025", "T2-2025", "T3-2025", "T4-2025"],
        },
        { status: 422 }
      );
    }

    // Calculate the revision
    const revision: RentRevisionResult = calculateRentRevision({
      currentRent: lease.rentAmount,
      referenceIrlQuarter: lease.irlReferenceQuarter,
      newIrlQuarter: newIrlQuarter,
    });

    // Determine if revision is even allowed (legal caps apply)
    const revisionCap = 0.05; // 5% annual cap per Article 17-1
    const cappedPercentage = Math.min(revision.percentageChange, revisionCap * 100);
    const cappedNewRent =
      Math.round(lease.rentAmount * (1 + cappedPercentage / 100) * 100) / 100;
    const isCapped = revision.percentageChange > revisionCap * 100;

    // Determine the next revision date
    const nextRevisionDate = lease.revisionDate
      ? new Date(lease.revisionDate)
      : null;

    // Days until next revision
    let daysUntilRevision: number | null = null;
    if (nextRevisionDate) {
      const now = new Date();
      daysUntilRevision = Math.ceil(
        (nextRevisionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    return NextResponse.json({
      leaseId: lease.id,
      property: {
        id: lease.property.id,
        name: lease.property.name,
        type: lease.property.type,
      },
      tenant: {
        id: lease.tenant.id,
        firstName: lease.tenant.firstName,
        lastName: lease.tenant.lastName,
      },
      currentRent: lease.rentAmount,
      chargesAmount: lease.chargesAmount,
      revision: {
        referenceIrl: {
          quarter: revision.referenceIrl.quarter,
          year: revision.referenceIrl.year,
          trimester: revision.referenceIrl.trimester,
          value: revision.referenceIrl.value,
        },
        newIrl: {
          quarter: revision.newIrl.quarter,
          year: revision.newIrl.year,
          trimester: revision.newIrl.trimester,
          value: revision.newIrl.value,
        },
        currentRent: revision.currentRent,
        newRent: revision.newRent,
        difference: revision.difference,
        percentageChange: revision.percentageChange,
        formula: revision.formula,
      },
      legalCap: {
        applied: isCapped,
        capPercentage: revisionCap * 100,
        cappedNewRent,
        cappedDifference: Math.round((cappedNewRent - lease.rentAmount) * 100) / 100,
        explanation:
          "According to Article 17-1 of the 1989 law, annual rent increases cannot exceed 5% in mainland France. " +
          (isCapped
            ? `Your calculated increase of ${revision.percentageChange.toFixed(2)}% exceeds this cap. The capped rent has been applied.`
            : "Your calculated increase is within the legal limit."),
      },
      nextRevisionDate,
      daysUntilRevision,
      irlReferenceQuarter: lease.irlReferenceQuarter,
      irlReferenceValue: lease.irlReferenceValue,
    });
  } catch (error) {
    console.error("Revision preview error:", error);

    if (error instanceof Error && error.message.includes("IRL")) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    return NextResponse.json(
      { error: "Failed to compute revision preview" },
      { status: 500 }
    );
  }
}