import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer, utm_source, utm_medium, utm_campaign } = body;

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") ?? "unknown";
    const ip =
      headersList.get("x-forwarded-for") ??
      headersList.get("x-real-ip") ??
      "unknown";

    // Log page view (extend to write to DB, Redis, or external service)
    console.log(
      JSON.stringify({
        type: "pageview",
        path,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        userAgent,
        ip,
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
