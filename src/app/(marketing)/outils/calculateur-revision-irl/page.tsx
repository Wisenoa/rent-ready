import type { Metadata } from "next";
import { IRLCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Calculateur Révision de Loyer IRL 2026 — Gratuit | RentReady",
  description:
    "Calculez automatiquement la nouvelle révision de loyer selon l'IRL 2026. Formule légale, historique INSEE, date d'application. Outil gratuit et instantané.",
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
  },
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-revision-irl",
  },
};

export { IRLCalculatorClient as default } from "./calculator-client";
