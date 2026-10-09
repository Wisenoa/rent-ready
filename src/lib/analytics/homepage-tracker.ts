/**
 * Homepage Conversion & Interaction Event Tracker.
 *
 * Privacy-first: strictly zero PII, zero banking details, zero sensitive attributes.
 * Dispatches to window.plausible (GDPR cookie-exempt) and non-blocking beacon logger.
 */

export type HomepageEvent =
  | { name: "homepage_view"; properties?: Record<string, string | number> }
  | { name: "homepage_hero_cta_click"; properties?: { position?: string } }
  | { name: "homepage_demo_interaction"; properties: { action: "regularisation" | "relance" } }
  | { name: "homepage_demo_resolved"; properties?: { duration_ms?: number } }
  | { name: "homepage_tool_click"; properties: { tool: "irl" | "quittance_pdf" } }
  | { name: "homepage_pricing_click"; properties: { plan: "starter" | "pro"; billing: "monthly" | "annual" } }
  | { name: "homepage_final_cta_click"; properties?: { position?: string } };

export function trackHomepageEvent(event: HomepageEvent) {
  if (typeof window === "undefined") return;

  // 1. Plausible Analytics custom event
  if (window.plausible) {
    try {
      window.plausible(event.name, { props: event.properties as Record<string, string | number | boolean> });
    } catch {
      // Ignore analytics dispatch failure
    }
  }

  // 2. Non-blocking beacon for local observability
  try {
    if (navigator.sendBeacon) {
      const payload = JSON.stringify({
        event: event.name,
        properties: event.properties,
        timestamp: Date.now(),
        path: window.location.pathname,
      });
      navigator.sendBeacon("/api/analytics/page-view", payload);
    }
  } catch {
    // Fail silently
  }
}
