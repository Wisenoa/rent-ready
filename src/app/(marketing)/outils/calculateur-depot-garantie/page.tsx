import type { Metadata } from "next";
import { DepotGarantieCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Calculateur de Dépôt de Garantie — Gratuit | RentReady",
  description:
    "Calculez le dépôt de garantie maximum légal pour votre location selon la zone géographique (tendue ou non) et le type de bail. Outil gratuit — base légale 2025.",
  keywords: [
    "calculateur depot garantie",
    "depot garantie location",
    "montant depot garantie",
    "zone tendue depot",
    "depot garantie meuble",
    "loi 1989 depot garantie",
  ],
  openGraph: {
    title: "Calculateur de Dépôt de Garantie | RentReady",
    description:
      "Calculez le dépôt de garantie maximum selon zone tendue et type de bail. Gratuit et instantané.",
    type: "website",
    url: "https://www.rentready.fr/outils/calculateur-depot-garantie",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur de Dépôt de Garantie | RentReady",
    description: "Calculez le dépôt de garantie maximum légal pour votre location. Gratuit.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-depot-garantie",
  },
};

export default function CalculateurDepotGarantiePage() {
  return <DepotGarantieCalculatorClient />;
}