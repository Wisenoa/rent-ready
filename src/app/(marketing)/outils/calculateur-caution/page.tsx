import type { Metadata } from "next";
import { DepositCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Calculateur Caution de Loyer — Zone Tendue & Non Tendue | RentReady",
  description: "Calculez le dépôt de garantie maximum légal pour votre location en France. Outil gratuit respectant les plafonds selon la zone géographique.",
  keywords: [
    "calculateur caution loyer",
    "dépôt de garantie location",
    "zone tendue loyer",
    "garantie locative",
    "caution logement",
    "dépôt garantie bail",
  ],
  openGraph: {
    title: "Calculateur Caution de Loyer | RentReady",
    description:
      "Calculez le montant maximum de caution légal pour votre location.",
    type: "website",
    url: "https://www.rentready.fr/outils/calculateur-caution",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur Caution de Loyer | RentReady",
    description: "Calculez le montant maximum de caution légal pour votre location.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-caution",
  },
};

export { DepositCalculatorClient as default } from "./calculator-client";
