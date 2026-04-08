import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ========================================
// Onboarding Analytics Event Tracking
// ========================================
// Records onboarding step completions, skips, and drop-offs.
// All events are stored in AuditLog with entityType ONBOARDING.

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { event, metadata } = body;

  if (!event || typeof event !== "string") {
    return NextResponse.json({ error: "event is required" }, { status: 400 });
  }

  // Map onboarding event to a meaningful entityId for tracking
  const entityIdMap: Record<string, string> = {
    onboarding_started: "wizard_opened",
    onboarding_step_1_completed: `property:${metadata?.propertyId ?? "unknown"}`,
    onboarding_step_1_skipped: "property_skipped",
    onboarding_step_2_completed: `tenant:${metadata?.tenantId ?? "unknown"}`,
    onboarding_step_2_skipped: "tenant_skipped",
    onboarding_lease_completed: `lease:${metadata?.propertyId ?? "unknown"}:${metadata?.tenantId ?? "unknown"}`,
    onboarding_completed: "wizard_completed",
    onboarding_abandoned: `abandoned_step_${metadata?.step ?? "unknown"}`,
  };

  const entityId = entityIdMap[event] ?? event;

  // Infer drop-off: if wizard_completed never fires, last seen step = drop-off
  // Server-side we just log the event; funnel analysis is done in queries.

  try {
    await prisma.auditLog.create({
      data: {
        userId,
        entityType: "ONBOARDING",
        entityId,
        action: "CREATE", // reusing enum — here means "event logged"
        changes: {
          event,
          metadata,
          userAgent: req.headers.get("user-agent"),
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[onboarding/track]", err);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
