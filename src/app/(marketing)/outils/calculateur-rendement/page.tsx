import type { Metadata } from "next";
import { YieldCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Calculateur Rendement Locatif — NET & BRUT 2026 | RentReady",
  description: "Calculez votre rendement locatif NET et BRUT en quelques clics. Outil gratuit pour investisseurs immobiliers avec indicateurs détaillés.",
  keywords: [
    "calculateur rendement locatif",
    "rendement locatif NET",
    "rendement locatif Brut",
    "calculateur investissement immobilier",
    "rentabilité location",
    "rendement immobilier France",
  ],
  openGraph: {
    title: "Calculateur Rendement Locatif NET & BRUT | RentReady",
    description:
      "Calculez votre rendement locatif NET et BRUT avec benchmarks Paris vs Province. Estimate your real estate investment profitability in seconds.",
    type: "website",
    url: "https://www.rentready.fr/outils/calculateur-rendement",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur Rendement Locatif NET & BRUT | RentReady",
    description: "Calculez votre rendement locatif NET et BRUT avec benchmarks Paris vs Province. Estimate your real estate investment profitability in seconds.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-rendement",
  },
};

export { YieldCalculatorClient as default } from "./calculator-client";
