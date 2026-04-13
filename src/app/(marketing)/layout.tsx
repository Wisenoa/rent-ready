import { Suspense } from "react";
import { GlassNav } from "@/components/landing/glass-nav";
import { MarketingFooter } from "@/components/landing/marketing-footer";
import { Analytics } from "@/components/analytics";

export const dynamic = "force-dynamic";

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
