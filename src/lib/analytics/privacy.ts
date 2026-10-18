import { z } from "zod";

export const TOOL_SLUGS = [
  "generateur-quittance", "modele-quittance-loyer-pdf", "calculateur-irl",
  "calculateur-charges-locatives", "lettre-relance-loyer", "generateur-conge-vente",
  "calculateur-loyer", "calculateur-depot-garantie", "calculateur-preavis",
  "checklist-etat-lieux", "calculateur-surface-habitable", "calculateur-rendement",
  "simulateur-pret-immobilier", "calculateur-plus-value", "simulateur-fiscalite-lmnp",
  "simulateur-loi-jeanbrun",
] as const;
export const toolSlugSchema = z.enum(TOOL_SLUGS);
export const productEventSchema = z.enum([
  "signup_completed", "property_created", "tenant_created", "lease_created",
  "payment_recorded", "receipt_generated",
]);
export type ProductEvent = z.infer<typeof productEventSchema>;
export const browserEventSchema = z.enum([
  "pageview", "tool_viewed", "tool_started", "tool_completed",
  "tool_document_downloaded", "tool_cta_clicked",
  "homepage_view", "homepage_hero_cta_click", "homepage_demo_interaction",
  "homepage_demo_resolved", "homepage_tool_click", "homepage_pricing_click", "homepage_final_cta_click",
]);
export const analyticsPayloadSchema = z.object({
  event: browserEventSchema.default("pageview"),
  path: z.string().max(2048),
  tool: toolSlugSchema.optional(),
});

/** No query parameters are collected. Dynamic/private identifiers are never retained. */
export function safeAnalyticsPath(raw: string): string | null {
  let path: string;
  try { path = new URL(raw, "https://lokna.fr").pathname; } catch { return null; }
  if (["/", "/pricing", "/gestion-locative", "/outils", "/register", "/login"].includes(path)) return path;
  const tool = toolSlugSchema.safeParse(path.replace(/^\/outils\//, ""));
  if (path.startsWith("/outils/") && tool.success) return `/outils/${tool.data}`;
  if (/^\/(bail|villes|locations|blog|guides|templates|comparatif)\/[^/]+$/.test(path)) {
    return `/${path.split("/")[1]}/[slug]`;
  }
  return null;
}
