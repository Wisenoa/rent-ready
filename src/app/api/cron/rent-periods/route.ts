import { NextRequest, NextResponse } from "next/server";
import { generateRentPeriodsForAllLeases } from "@/lib/domain/generate-rent-periods";

/**
 * GET /api/cron/rent-periods
 *
 * Cron endpoint that materialises the rent periods a landlord is owed, month by
 * month, for every ACTIVE lease.
 *
 * Without this, a lease only ever gets a PENDING period for the month it was
 * created in: generation is triggered on lease creation and amendment, and
 * nothing ran again in month 2+. From the landlord's point of view the product
 * simply went blank.
 *
 * The domain rules stay in `@/lib/domain/generate-rent-periods`; this route only
 * triggers it. Generation is idempotent (`skipDuplicates` + an existing-period
 * lookup), so running it more often than once a day is safe.
 *
 * The read-path backstop (`ensureRentPeriods` in `@/lib/queries/rent-periods`)
 * makes the product correct even when this cron has not run, so this endpoint is
 * about not making every landlord wait for a page load.
 *
 * Query params:
 *   - dryRun (optional): if "true", reports what is missing without writing
 *   - userId (optional): restrict to one user (debugging aid)
 *
 * Env var required:
 *   CRON_SECRET — the bearer token guarding this endpoint
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryRun") === "true";
  const userId = url.searchParams.get("userId") ?? undefined;

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
    if (dryRun) {
      // Count what generation would look at, without writing anything. Counting
      // is not measuring "created", so the field is named for what it is.
      const { prisma } = await import("@/lib/prisma");
      const leases = await prisma.lease.count({
        where: {
          status: "ACTIVE",
          ...(userId ? { userId } : {}),
        },
      });
      return NextResponse.json({
        success: true,
        dryRun: true,
        leases,
        created: null,
      });
    }

    const result = await generateRentPeriodsForAllLeases(userId);

    return NextResponse.json({
      success: true,
      dryRun: false,
      leases: result.leases,
      created: result.created,
    });
  } catch (error) {
    console.error("Rent periods cron error:", error);
    return NextResponse.json(
      { error: "Failed to generate rent periods" },
      { status: 500 }
    );
  }
}
