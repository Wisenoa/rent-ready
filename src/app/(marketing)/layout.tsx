import { Suspense } from "react";

/**
 * Marketing pages are ISR, revalidated hourly at the edge.
 *
 * This was declared here all along and overridden by `export const dynamic =
 * "force-dynamic"` on every page below, which made it dead configuration. The
 * override was added when prerendering the content suite exhausted the Node heap
 * during `next build`; `next.config.ts` now caps static-generation workers
 * (`experimental.cpus`), which is the actual fix for that.
 *
 * Why it matters beyond TTFB: in a fully dynamic render, Next streams metadata
 * *after* `</head>` — `<title>` and `<link rel="canonical">` were landing tens of
 * thousands of bytes into the body, past a Suspense boundary. Google tolerates
 * it; secondary crawlers and link previewers that read only the head see no title
 * and no canonical at all. With ISR both are in the initial HTML.
 *
 * Nothing under this layout needs per-request data: it reads local modules
 * (`articles.ts`, `cities.json`, `glossary.json`, `routes.ts`) and no page calls
 * `cookies()`, `headers()` or `useSearchParams`.
 */
export const revalidate = 3600;
import { MarketingShell } from "@/components/marketing/site/MarketingShell";
import { Analytics } from "@/components/analytics";


function AnalyticsWrapper() {
  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingShell>
      {children}
      {/* Page view analytics (unchanged scope: marketing pages only). */}
      <AnalyticsWrapper />
    </MarketingShell>
  );
}
