import { NextRequest, NextResponse } from "next/server";
import { articles } from "@/data/articles";

const BASE_URL = "https://www.rentready.fr";
const SITE_TITLE = "Blog RentReady — Gestion Locative & Investissement";
const SITE_DESCRIPTION =
  "Conseils et guides pour propriétaires bailleurs: gestion locative, quittances, révision IRL, législation immobilière.";
const SITE_LANGUAGE = "fr-FR";

/**
 * GET /api/rss
 *
 * Returns an RSS 2.0 XML feed of all blog posts.
 * Includes proper XML declaration, channel metadata,
 * and per-item elements (title, link, description, pubDate, category).
 *
 * Supports conditional GET via If-Modified-Since header to avoid
 * unnecessary bandwidth on unchanged content.
 */
export async function GET(request: NextRequest) {
  // Conditional GET — return 304 if nothing changed since last build
  const ifModifiedSince = request.headers.get("If-Modified-Since");
  if (ifModifiedSince) {
    const sinceDate = new Date(ifModifiedSince);
    const latestArticle = articles[0];
    if (latestArticle) {
      const latestDate = new Date(latestArticle.date);
      if (latestDate <= sinceDate) {
        return new NextResponse(null, { status: 304 });
      }
    }
  }

  const now = new Date().toUTCString();
  const buildDate = new Date().toUTCString();

  const itemsXml = articles
    .slice(0, 50) // Cap at 50 most recent posts
    .map((article) => {
      const link = `${BASE_URL}/blog/${article.slug}`;
      const pubDate = new Date(article.date).toUTCString();
      const description = escapeXml(article.excerpt);

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.category)}</category>
      <author>blog@rentready.fr (RentReady)</author>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${BASE_URL}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <managingEditor>blog@rentready.fr (RentReady)</managingEditor>
    <webMaster>tech@rentready.fr (RentReady)</webMaster>
    <atom:link href="${BASE_URL}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/og-image.png</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${BASE_URL}/blog</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
