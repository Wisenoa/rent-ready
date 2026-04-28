'use client';

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getUtmParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
} {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
  };
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    const referrer = document.referrer;
    const utms = getUtmParams();

    // 1. Custom internal pageview log (used for SEO and custom analytics pipeline)
    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, referrer, ...utms }),
    }).catch(() => {
      // Silently ignore failures
    });

    // 2. Plausible Analytics — privacy-first marketing site analytics
    // Plausible is GDPR-compliant and does NOT require cookie consent.
    // It tracks: unique visitors, pageviews, referrers, UTM params, and custom events.
    // The script is loaded via <head> in the marketing layout.
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("pageview", { props: utms });
    }
  }, [pathname, searchParams]);

  return null;
}
