'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analyticsConsentMaxAge, hasAnalyticsConsent, trackBrowserEvent } from "@/lib/analytics/client";
import { toolSlugSchema } from "@/lib/analytics/privacy";

export function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    const tool = toolSlugSchema.safeParse(pathname?.replace(/^\/outils\//, ""));
    let viewed = false;
    let started = false;
    let completed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const view = () => {
      // Navigation must never restart the consent lifetime on the server.
      const maxAge = analyticsConsentMaxAge();
      document.cookie = `lokna_cookie_consent=${maxAge > 0 ? "accepted" : "rejected"}; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
      if (maxAge === 0) document.cookie = "lokna_source_tool=; Path=/; SameSite=Lax; Max-Age=0";
      if (!viewed && hasAnalyticsConsent()) {
        viewed = true;
        trackBrowserEvent("pageview");
        if (tool.success) trackBrowserEvent("tool_viewed", tool.data);
      }
    };
    view();
    const interact = (event: Event) => {
      if (!tool.success || !hasAnalyticsConsent() || !(event.target instanceof Element) || !event.target.closest("form")) return;
      if (!started) { started = true; trackBrowserEvent("tool_started", tool.data); }
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!completed && document.querySelector('[data-tool-result="ready"]') && !document.querySelector('[aria-invalid="true"]')) {
          completed = true; trackBrowserEvent("tool_completed", tool.data);
        }
      }, 600);
    };
    const click = (event: MouseEvent) => {
      if (!tool.success || !(event.target instanceof Element)) return;
      const link = event.target.closest('a[href^="/register"]');
      if (link && hasAnalyticsConsent()) {
        document.cookie = `lokna_source_tool=${tool.data}; Path=/; SameSite=Lax; Max-Age=2592000`;
        trackBrowserEvent("tool_cta_clicked", tool.data);
      }
    };
    window.addEventListener("lokna-consent-change", view);
    document.addEventListener("input", interact);
    document.addEventListener("change", interact);
    document.addEventListener("click", click);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("lokna-consent-change", view);
      document.removeEventListener("input", interact);
      document.removeEventListener("change", interact);
      document.removeEventListener("click", click);
    };
  }, [pathname]);
  return null;
}
