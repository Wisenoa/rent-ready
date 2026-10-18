import { NextRequest, NextResponse } from "next/server";
import { analyticsPayloadSchema, safeAnalyticsPath } from "@/lib/analytics/privacy";

export async function POST(req: NextRequest) {
  if (req.cookies.get("lokna_cookie_consent")?.value !== "accepted") {
    return new NextResponse(null, { status: 204 });
  }
  const body: unknown = await req.json().catch(() => null);
  const parsed = analyticsPayloadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Événement invalide" }, { status: 400 });
  const path = safeAnalyticsPath(parsed.data.path);
  if (!path) return new NextResponse(null, { status: 204 });
  console.info(JSON.stringify({ type: "analytics", event: parsed.data.event, path,
    ...(parsed.data.tool ? { tool: parsed.data.tool } : {}), timestamp: new Date().toISOString() }));
  return NextResponse.json({ ok: true });
}
