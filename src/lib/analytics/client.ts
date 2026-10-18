import { analyticsPayloadSchema, safeAnalyticsPath, type browserEventSchema } from "./privacy";
import type { z } from "zod";

export function analyticsConsentMaxAge(): number {
  if (typeof window === "undefined") return 0;
  try {
    const decision = localStorage.getItem("lokna_cookie_consent");
    const recordedAt = Number(localStorage.getItem("lokna_cookie_consent_at"));
    const age = Date.now() - recordedAt;
    return decision === "accepted" && recordedAt > 0 && age >= 0
      ? Math.max(0, Math.floor((180 * 24 * 60 * 60 * 1000 - age) / 1000)) : 0;
  } catch { return 0; }
}

export function hasAnalyticsConsent(): boolean { return analyticsConsentMaxAge() > 0; }

export function trackBrowserEvent(event: z.infer<typeof browserEventSchema>, tool?: string) {
  if (!hasAnalyticsConsent()) return;
  const path = safeAnalyticsPath(window.location.pathname);
  if (!path) return;
  const payload = analyticsPayloadSchema.safeParse({ event, path, tool });
  if (!payload.success) return;
  // One destination. Never dispatch another automatic pageview to a third party.
  void fetch("/api/analytics/page-view", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.data), keepalive: true,
  }).catch(() => {});
}
