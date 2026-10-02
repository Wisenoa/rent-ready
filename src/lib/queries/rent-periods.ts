import { revalidatePath } from "next/cache";
import { generateRentPeriodsForAllLeases } from "@/lib/domain/generate-rent-periods";

/**
 * Read-path backstop for rent period generation.
 *
 * `generateRentPeriodsForAllLeases` is the only place a period is written, but it
 * had no caller beyond lease creation/amendment, so a lease went silent from its
 * second month: the dashboard, the payments page and the arrears totals had
 * nothing left to count. The cron endpoint (`/api/cron/rent-periods`) fixes that
 * on a schedule; this fixes it the moment a landlord opens the app, because a cron
 * that is not configured is a cron that does not run.
 *
 * Never throws. A dashboard that fails to render because a backfill missed is
 * worse than the missing backfill itself, and the pages below are the ones the
 * landlord opens every day.
 */
export async function ensureRentPeriods(userId: string): Promise<{ created: number }> {
  try {
    const result = await generateRentPeriodsForAllLeases(userId);
    if (result.created > 0) {
      // Kept separate from the generation above: revalidatePath needs a Next
      // request/store context, and this runs during a page render. When it is
      // unavailable it throws, and that must not be reported as a failed
      // backfill. The page being rendered reads the rows directly anyway, so the
      // cache only matters for other consumers of the same data.
      try {
        revalidatePath("/dashboard");
        revalidatePath("/billing");
      } catch (error) {
        console.warn("revalidatePath after rent period backfill failed", error);
      }
    }
    return { created: result.created };
  } catch (error) {
    console.error("ensureRentPeriods failed for user", userId, error);
    return { created: 0 };
  }
}
