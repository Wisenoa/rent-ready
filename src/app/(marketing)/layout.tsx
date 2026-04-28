import { Suspense } from "react";

// ISR: revalidate marketing pages every hour at the CDN edge
// This dramatically improves TTFB (cache hit at Vercel Edge) while
// keeping content fresh. Googlebot sees cached HTML = faster crawl budget.
export const revalidate = 3600;
import { GlassNav } from "@/components/landing/glass-nav";
import { MarketingFooter } from "@/components/landing/marketing-footer";
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
    <div className="flex min-h-screen flex-col bg-[#f8f7f4] font-[family-name:var(--font-sans)]">
      {/* Use GlassNav with full navigation links */}
      <GlassNav />
      {/* spacer so content isn't hidden under fixed nav */}
      <div className="h-16" />

      {/* Skip to main content — accessibility WCAG 2.1 AA */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[#1a1a2e] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
      >
        Aller au contenu principal
      </a>

      {/* Main — id required for skip-to-content link target */}
      <main id="main" className="flex-1">{children}</main>

      {/* Page view analytics */}
      <AnalyticsWrapper />

      {/* Comprehensive footer */}
      <MarketingFooter />
    </div>
  );
}
