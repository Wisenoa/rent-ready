import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/**
 * Header, main and footer shared by every public route group: (marketing),
 * (outils), (templates). The homepage composes the same SiteHeader and
 * SiteFooter around its own sections.
 *
 * No skip link here: the root layout already renders one targeting #main.
 */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream font-sans text-ink">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
