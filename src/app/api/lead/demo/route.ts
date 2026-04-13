import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, properties, message, utm_source, utm_medium, utm_campaign } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") ?? "unknown";

    // Log lead (extend to store in DB, send email notification, etc.)
    console.log(
      JSON.stringify({
        type: "demo_request",
        name,
        email,
        properties,
        message,
        utm_source,
        utm_medium,
        utm_campaign,
        userAgent,
        timestamp: new Date().toISOString(),
      }),
    );

    // TODO: Send email notification to sales team
    // TODO: Store lead in database

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
