import type { Metadata } from "next";
import { LoyerCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Calculateur de Loyer au m² — Gratuit | RentReady",
  description:
    "Estimez le loyer de votre bien selon la surface et le prix au m². Applicable en zone tendue et non tendue. Outil gratuit — mis à jour 2025.",
  keywords: [
    "calculateur loyer",
    "loyer au m²",
    "estimation loyer",
    "zone tendue loyer",
    "calcul loyer location",
    "prix au m² location",
  ],
  openGraph: {
    title: "Calculateur de Loyer au m² | RentReady",
    description:
      "Estimez le loyer de votre bien selon la surface habitable. Zones tendues et non tendues. Gratuit.",
    type: "website",
    url: "https://www.rentready.fr/outils/calculateur-loyer",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur de Loyer au m² | RentReady",
    description: "Estimez le loyer de votre bien selon la surface et le prix au m². Gratuit.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-loyer",
  },
};

export default function CalculateurLoyerPage() {
  return <LoyerCalculatorClient />;
}