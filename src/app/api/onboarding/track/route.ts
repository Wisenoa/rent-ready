import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const payloadSchema = z.object({
  event: z.enum(["onboarding_started", "onboarding_step_1_completed", "onboarding_step_1_skipped", "onboarding_step_2_completed", "onboarding_step_2_skipped", "onboarding_lease_completed", "onboarding_completed", "onboarding_abandoned"]),
  metadata: z.object({
    variant: z.enum(["A", "B", "C"]).optional(),
    step: z.number().int().min(1).max(4).optional(),
    duration_seconds: z.number().int().min(0).max(86400).optional(),
    propertySkipped: z.boolean().optional(), tenantSkipped: z.boolean().optional(),
  }).default({}),
});

export async function POST(req: NextRequest) {
  if (req.cookies.get("lokna_cookie_consent")?.value !== "accepted") return new NextResponse(null, { status: 204 });
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const parsed = payloadSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Événement invalide" }, { status: 400 });
    await prisma.auditLog.create({ data: {
      userId: session.user.id, entityType: "ONBOARDING", entityId: parsed.data.event,
      action: "CREATE", changes: parsed.data,
    } });
    return NextResponse.json({ ok: true });
  } catch {
    console.error("[onboarding/track] event persistence failed");
    return NextResponse.json({ error: "Mesure indisponible" }, { status: 500 });
  }
}
