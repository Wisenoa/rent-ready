/**
 * RentReady Production Homepage (B.3 Architecture).
 *
 * Modern French Atelier design direction.
 * Lean Server Component architecture with selective Client Component hydration
 * for interactive widgets (HomeDemo, HomePricing, HomeFaq).
 *
 * Product Truth:
 * - 14-day free trial, no credit card required
 * - Art. 21 quittance vs partial receipt
 * - Art. 17-1 INSEE IRL revision
 * - Transparent 9 € / 15 € pricing
 * - Zero unverified claims (no Factur-X, no tax simulators, no auto-reconciliation guarantees)
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
  HomeProductMoments,
  HomeTrust,
  HomeTools,
  HomePricing,
  HomeFaq,
  HomeFinalCTA,
  HomeFooter,
  HOME_FAQ_ITEMS,
} from "@/components/marketing/home";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Logiciel de gestion locative pour propriétaires bailleurs | RentReady",
    description:
      "Gérez vos locations sans tableur. Suivi des encaissements, quittances et reçus conformes à la loi de 1989, rappels de révision de loyer IRL. Essai gratuit 14 jours.",
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
      <main id="main-content">
        <HomeHero />
        <HomeProductMoments />
        <HomeTrust />
        <HomeTools />
        <HomePricing />
        <HomeFaq />
        <HomeFinalCTA />
      </main>
      <HomeFooter />
    </div>
  );
}
