import { NextRequest, NextResponse } from "next/server";
import { createUpcomingLeaseRenewalReminders } from "@/lib/actions/reminder-actions";

/**
 * POST /api/cron/reminders
 *
 * Daily cron job to auto-create lease renewal reminders.
 * Should be called once per day (e.g., via an external scheduler like
 * GitHub Actions scheduled workflow or a webhook service like Cronitor).
 *
 * Requires a CRON_SECRET header for authentication:
 *   Authorization: Bearer <CRON_SECRET>
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const cronSecret = process.env.CRON_SECRET;

  // Validate cron secret if configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await createUpcomingLeaseRenewalReminders();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      created: result.created ?? 0,
      message: `Created ${result.created} lease renewal reminders.`,
    });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
