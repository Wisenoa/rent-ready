import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit: 5 demo requests per IP per hour (prevent spam/abuse of lead capture)
  const ip = getClientIp(req.headers);
  const result = await rateLimit(ip, { limit: 5, window: 3600 });

  if (!result.success) {
    const res = NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter avant de réessayer." },
      { status: 429 }
    );
    setRateLimitHeaders(res, result);
    return res;
  }
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
