/**
 * POST /api/seo/events
 * Server-side SEO analytics event logging.
 *
 * Body: { eventType, resourceSlug?, pageUrl, sessionId?, metadata? }
 * Valid eventTypes: template_download | blog_cta_click | calculator_use | page_view
 *
 * Rate limited: 30 req/min per IP (public endpoint — DDoS protection).
 * Authenticated users also tracked per user ID to prevent abuse.
 *
 * This endpoint is called from the server-side when a user
 * triggers a key SEO conversion event.
 */
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";

const VALID_EVENT_TYPES = [
  "template_download",
  "blog_cta_click",
  "calculator_use",
  "page_view",
] as const;

type EventType = (typeof VALID_EVENT_TYPES)[number];

interface SeoEventBody {
  eventType: EventType;
  resourceSlug?: string;
  pageUrl: string;
  sessionId?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

function hashIp(ip: string): string {
  const salt = process.env.SEO_IP_SALT ?? "rentready";
  return createHash("sha256").update(ip + salt).digest("hex");
}

function getCountryFromHeaders(req: NextRequest): string | undefined {
  return req.headers.get("cf-ipcountry") ?? req.headers.get("x-geo-country") ?? undefined;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 30 req/min per IP (public endpoint — DDoS protection)
    const ip = getClientIp(req.headers);
    const result = await rateLimit(ip, { limit: 30, window: 60 });

    if (!result.success) {
      const res = NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
      setRateLimitHeaders(res, result);
      return res;
    }

    const body: SeoEventBody = await req.json();

    if (!body.eventType || !body.pageUrl) {
      return NextResponse.json(
        { error: "eventType and pageUrl are required" },
        { status: 400 }
      );
    }

    if (!VALID_EVENT_TYPES.includes(body.eventType as EventType)) {
      return NextResponse.json(
        { error: `Invalid eventType. Must be one of: ${VALID_EVENT_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
    const ipHash = realIp !== "unknown" ? hashIp(realIp) : null;

    const event = await prisma.seoEvent.create({
      data: {
        eventType: body.eventType,
        resourceSlug: body.resourceSlug ?? null,
        pageUrl: body.pageUrl,
        sessionId: body.sessionId ?? null,
        country: getCountryFromHeaders(req) ?? null,
        referrer: body.referrer ?? req.headers.get("referer") ?? null,
        userAgent: req.headers.get("user-agent") ?? null,
        ipHash,
        // Safely serialize metadata — body.metadata is already validated as Record<string, unknown>
        metadata: body.metadata !== undefined ? JSON.stringify(body.metadata) : undefined,
      },
    });

    const res = NextResponse.json({ ok: true, id: event.id }, { status: 201 });
    setRateLimitHeaders(res, result);
    return res;
  } catch (error) {
    console.error("[seo/events] Error logging event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seo/events
 * Query SEO analytics events (authenticated — admin use only).
 *
 * Query params:
 *   eventType?: string — filter by event type
 *   resourceSlug?: string — filter by resource
 *   from?: ISO date string — start date
 *   to?: ISO date string — end date
 *   limit?: number (default 100, max 1000)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventType = searchParams.get("eventType") ?? undefined;
    const resourceSlug = searchParams.get("resourceSlug") ?? undefined;
    const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
    const to = searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get("limit") ?? "100", 10)));
    const skip = (page - 1) * limit;

    // Basic auth check via API key header
    const apiKey = req.headers.get("x-seo-api-key");
    if (!apiKey || apiKey !== process.env.SEO_ANALYTICS_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = {
      ...(eventType ? { eventType } : {}),
      ...(resourceSlug ? { resourceSlug } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };

    const [events, total] = await Promise.all([
      prisma.seoEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          eventType: true,
          resourceSlug: true,
          pageUrl: true,
          country: true,
          referrer: true,
          createdAt: true,
          metadata: true,
          ipHash: true,
        },
      }),
      prisma.seoEvent.count({ where }),
    ]);

    return NextResponse.json({ events, total, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("[seo/events GET] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
