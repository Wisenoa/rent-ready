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

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Page view analytics */}
      <AnalyticsWrapper />

      {/* Comprehensive footer */}
      <MarketingFooter />
    </div>
  );
}
