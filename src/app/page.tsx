/**
 * Lokna homepage.
 *
 * Search intent: "gestion locative en ligne" for owners who let their own
 * homes. The head term "logiciel de gestion locative" belongs to
 * /gestion-locative, which this page links to with that anchor, so the two do
 * not compete for the same query.
 *
 * Product-first and animated: the hero plays October's payments landing, the
 * "Un mois avec Lokna" story follows the scroll, the feature tabs and photos
 * move. Every figure is computed by the product's own rules
 * (`settlePeriodPayments`, `calculateRentRevision`); prices come from PLANS.
 * Editorial content is rendered on the server; client islands only animate it,
 * and the animation runtime loads after hydration (MotionRoot).
 */

import React from "react";
import type { Metadata } from "next";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildFAQPageSchema,
  buildGraphSchema,
} from "@/lib/seo/structured-data";
import { MotionRoot } from "@/components/marketing/home/MotionRoot";
import { SiteFooter } from "@/components/marketing/site/SiteFooter";
import { SiteHeader } from "@/components/marketing/site/SiteHeader";
import {
  HomeHero,
  HomeShift,
  HomeMonth,
  HomeFeatures,
  HomeForWho,
  HomePricing,
  HomeFaq,
  HomeFinalCTA,
  HOME_FAQ_ITEMS,
} from "@/components/marketing/home";

export const revalidate = 3600;

const TITLE = "Gestion locative en ligne pour particuliers | Lokna";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = baseMetadata({
    title: TITLE,
    description:
      "Loyers suivis, quittances et reçus prêts, retards et révision IRL : Lokna, la gestion locative en ligne des propriétaires qui louent seuls. Essai 14 jours.",
    url: "",
    ogType: "default",
  });
  // The root layout's "%s | Lokna" template does not apply to the root page
  // itself, so the brand is written out and kept with `absolute`.
  return { ...metadata, title: { absolute: TITLE } };
}

export default function HomePage() {
  const structuredData = buildGraphSchema(
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildFAQPageSchema(HOME_FAQ_ITEMS)
  );

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#15241F] font-sans antialiased selection:bg-[#1E3A2F] selection:text-[#F5F3EF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <SiteHeader />
      <main id="main">
        <MotionRoot>
          <HomeHero />
          <HomeShift />
          <HomeMonth />
          <HomeFeatures />
          <HomeForWho />
          <HomePricing />
          <HomeFaq />
          <HomeFinalCTA />
        </MotionRoot>
      </main>
      <SiteFooter />
    </div>
  );
}
