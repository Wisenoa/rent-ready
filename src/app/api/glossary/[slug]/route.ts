/**
 * GET /api/glossary/[slug]
 * Returns a single glossary term with full definition, related terms, and links.
 */
import { NextRequest, NextResponse } from "next/server";
import glossaryData from "@/data/glossary.json";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const term = glossaryData.find((t) => t.slug === slug);

  if (!term) {
    return NextResponse.json(
      { error: `Glossary term not found: ${slug}` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      ...term,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
