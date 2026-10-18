import { trackBrowserEvent } from "./client";
/**
 * Homepage Conversion & Interaction Event Tracker.
 *
 * Privacy-first: strictly zero PII, zero banking details, zero sensitive attributes.
 * Uses the shared consent-gated, sanitized internal collector.
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
  trackBrowserEvent(event.name);
}
