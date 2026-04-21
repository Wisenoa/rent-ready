import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";
import { emailService } from "@/lib/email/service";
import { z } from "zod";

const RequestBodySchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("Invalid email address"),
  properties: z.string().optional(),
  message: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

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
    const body = await RequestBodySchema.parse(await req.json());

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") ?? "unknown";

    // Log lead to console (extend to store in DB in future)
    console.log(
      JSON.stringify({
        type: "demo_request",
        name: body.name,
        email: body.email,
        properties: body.properties,
        message: body.message,
        utm_source: body.utm_source,
        utm_medium: body.utm_medium,
        utm_campaign: body.utm_campaign,
        userAgent,
        timestamp: new Date().toISOString(),
      }),
    );

    // Send email notification to the sales team
    const emailResult = await emailService.sendDemoRequestNotification({
      name: body.name,
      email: body.email,
      properties: body.properties,
      message: body.message,
      utmSource: body.utm_source,
      utmMedium: body.utm_medium,
      utmCampaign: body.utm_campaign,
    });

    if (!emailResult.ok) {
      console.error("[lead/demo] Failed to send demo request email:", emailResult.error);
      // Don't fail the request — lead was captured, email is non-critical
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[lead/demo] Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 422 }
      );
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
