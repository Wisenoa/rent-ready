import type { Metadata } from "next";
import { PreavisCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Calculateur de Préavis Locataire — Gratuit | RentReady",
  description:
    "Calculez la durée de préavis légale pour votre départ de location selon la zone géographique, le type de bail, et votre situation. Outil gratuit — base légale 2025.",
  keywords: [
    "calculateur préavis locataire",
    "préavis location",
    "durée préavis bail",
    "préavis zone tendue",
    "résiliation bail locataire",
    "délai préavis location",
  ],
  openGraph: {
    title: "Calculateur de Préavis Locataire | RentReady",
    description:
      "Calculez votre durée de préavis en fonction de votre zone et situation. Gratuit — mis à jour 2025.",
    type: "website",
    url: "https://www.rentready.fr/outils/calculateur-preavis",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur de Préavis Locataire | RentReady",
    description: "Calculez votre durée de préavis légale. Gratuit et instantané.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-preavis",
  },
};

export default function CalculateurPreavisPage() {
  return <PreavisCalculatorClient />;
}