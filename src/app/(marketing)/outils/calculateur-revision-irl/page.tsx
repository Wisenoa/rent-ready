import type { Metadata } from "next";
import { IRLCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Calculateur Révision de Loyer IRL 2026 — Gratuit | RentReady",
  description: "Calculez la révision de loyer selon lindice IRL. Outil gratuit pour ajuster automatiquement le loyer au Bail de location avec les derniers indices.",
  keywords: [
    "calculateur révision loyer IRL",
    "révision loyer 2026",
    "IRL indice référence loyer",
    "augmentation loyer légale",
    "calcul loyer IRL",
    "indice INSEE loyer",
  ],
  openGraph: {
    title: "Calculateur Révision de Loyer IRL 2026 | RentReady",
    description:
      "Calculez en 30 secondes la nouvelle révision de loyer selon l'IRL 2026. Formule légale, historique INSEE, date d'application. Gratuit.",
    type: "website",
    url: "https://www.rentready.fr/outils/calculateur-revision-irl",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur Révision de Loyer IRL 2026 | RentReady",
    description: "Calculez en 30 secondes la nouvelle révision de loyer selon l'IRL 2026. Formule légale, historique INSEE, date d'application. Gratuit.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-revision-irl",
  },
};

export { IRLCalculatorClient as default } from "./calculator-client";
