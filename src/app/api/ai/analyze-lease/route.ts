import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { analyzeLeaseClauses } from "@/lib/ai/lease-analyzer";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimit, getClientIp, setRateLimitHeaders } from "@/lib/rate-limit";

const requestSchema = z.object({
  documentId: z.string().optional(),
  leaseText: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Rate limit: 20 req/min per IP for unauthenticated, 1000 for authenticated
  const ip = getClientIp(request.headers);
  const userId = await getAuthenticatedUserId().catch(() => null);
  const limit = userId ? 1000 : 20;
  const result = await rateLimit(ip, { limit, window: 60 });

  if (!result.success) {
    const res = NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter avant de réessayer." },
      { status: 429 }
    );
    setRateLimitHeaders(res, result);
    return res;
  }

  try {
    const authUserId = await getAuthenticatedUserId();
    const body = await request.json();
    const { documentId, leaseText } = requestSchema.parse(body);

    let textToAnalyze = leaseText;

    if (documentId && !leaseText) {
      const document = await prisma.document.findFirst({
        where: { id: documentId, userId: authUserId },
        select: { extractedData: true },
      });

      if (!document) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }

      if (document.extractedData && typeof document.extractedData === "object") {
        const extracted = document.extractedData as Record<string, unknown>;
        textToAnalyze = extracted.ocrText as string;
      }
    }

    if (!textToAnalyze) {
      return NextResponse.json(
        { error: "No lease text provided or found" },
        { status: 400 }
      );
    }

    const analysis = await analyzeLeaseClauses(textToAnalyze);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Lease analysis error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze lease" },
      { status: 500 }
    );
  }
}