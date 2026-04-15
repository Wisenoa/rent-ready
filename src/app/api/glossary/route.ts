/**
 * GET /api/glossary
 * Returns all glossary terms for the SEO glossary page.
 */
import { NextResponse } from "next/server";
import glossaryData from "@/data/glossary.json";

export async function GET() {
  const terms = glossaryData.map(({ slug, term, shortDefinition }) => ({
    slug,
    term,
    shortDefinition,
  }));

  return NextResponse.json(
    {
      terms,
      total: terms.length,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
