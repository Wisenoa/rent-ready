
import type { Metadata } from "next";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { CommandPaletteProvider, CommandPaletteTrigger } from "@/components/command-palette";
import { UserMenu } from "@/components/user-menu";
import { SubscriptionGate } from "@/components/subscription-gate";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Every dashboard route requires a session: the layout calls SubscriptionGate,
 * which reads the cookie via better-auth, and the pages query Prisma scoped to
 * the signed-in user. Without this, `next build` tries to prerender them at
 * build time with no request context. That fails non-deterministically —
 * depending on which page's worker loses the race first — as
 * "Cannot read properties of undefined (reading 'call')" in webpack-runtime, or
 * as an "Headers is required" APIError from better-auth. Prerendering an
 * authenticated page is also wrong regardless of the crash: the HTML would be
 * one user's dashboard, cached and served to whoever requests the URL.
 */
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Block expired / cancelled / past-due users from all dashboard routes.
  // TRIAL users are blocked only after their trial expires.
  await SubscriptionGate();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <CommandPaletteProvider>
          {/* Skip to main content — accessibility WCAG 2.1 AA */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[#1a1a2e] focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
          >
            Aller au contenu principal
          </a>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-card/50 backdrop-blur-sm px-6">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="mr-2 !h-5" />
            <CommandPaletteTrigger />
            <div className="flex-1" />
            <UserMenu />
          </header>
          <main id="main" className="flex-1 p-6">
            {children}
          </main>
        </CommandPaletteProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
