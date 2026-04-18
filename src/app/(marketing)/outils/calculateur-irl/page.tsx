import type { Metadata } from "next";
import { IRLCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Calculateur IRL 2025 — Indice de Référence des Loyers | RentReady",
  description:
    "Consultez l'historique des IRL et la variation annuelle. Outil gratuit pour propriétaires et locataires. Mis à jour Avril 2025 — Source INSEE.",
  keywords: [
    "calculateur IRL",
    "indice référence loyer",
    "IRL 2025",
    "historique IRL",
    "valeur IRL",
    "révision loyer INSEE",
  ],
  openGraph: {
    title: "Calculateur IRL 2025 — Historique des Indices | RentReady",
    description:
      "Consultez tous les IRL depuis 2022. Variation annuelle, date de publication, et lien vers le calculateur de révision.",
    type: "website",
    url: "https://www.rentready.fr/outils/calculateur-irl",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur IRL 2025 | RentReady",
    description: "Historique des Indices de Référence des Loyers. Consultation gratuite — mis à jour Avril 2025.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-irl",
  },
};

export default function CalculateurIRLPage() {
  return <IRLCalculatorClient />;
}