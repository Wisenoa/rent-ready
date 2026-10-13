/**
 * Lokna homepage.
 *
 * Product-first: a dark forest hero showing the month as Lokna keeps it, then
 * the shift from spreadsheet chores, the signature "Un mois avec Lokna" story
 * (the month moves forward as the visitor scrolls), the other jobs of the month,
 * who it is for, prices, questions and a final call to action.
 *
 * Every figure on the page is computed by the product's own rules
 * (`settlePeriodPayments`, `calculateRentRevision`); prices come from PLANS.
 * Client JavaScript is limited to the story, the feature tabs and scroll
 * reveals.
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
import {
  HomeNavbar,
  HomeHero,
  HomeShift,
  HomeMonth,
  HomeFeatures,
  HomeForWho,
  HomePricing,
  HomeFaq,
  HomeFinalCTA,
  HomeFooter,
  HOME_FAQ_ITEMS,
} from "@/components/marketing/home";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Logiciel de gestion locative pour propriétaires bailleurs | Lokna",
    description:
      "Gérez vos locations sans tableur. Suivi des encaissements, quittances et reçus conformes à la loi de 1989, rappels de révision de loyer IRL. Essai gratuit sans engagement.",
    url: "",
    ogType: "default",
  });
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
      <HomeNavbar />
      <main id="main">
        <HomeHero />
        <HomeShift />
        <HomeMonth />
        <HomeFeatures />
        <HomeForWho />
        <HomePricing />
        <HomeFaq />
        <HomeFinalCTA />
      </main>
      <HomeFooter />
    </div>
  );
}
