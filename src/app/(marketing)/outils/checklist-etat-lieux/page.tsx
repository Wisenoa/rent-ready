import type { Metadata } from "next";
import { ChecklistEDLClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Checklist État des Lieux — Interactive | RentReady",
  description:
    "Checklist interactive pour réaliser un état des lieux entrée ou sortie conforme à la loi. Parcourez chaque pièce, cochez les éléments, et généréz un récapitulatif.",
  keywords: [
    "checklist état des lieux",
    "état des lieux interactive",
    "checklist EDL",
    "état des lieux sortie",
    "état des lieux entrée",
    "checklist location",
  ],
  openGraph: {
    title: "Checklist État des Lieux Interactive | RentReady",
    description:
      "Checklist complète et interactive pour faire un état des lieux conforme. Par pièce, avec notes et signatures.",
    type: "website",
    url: "https://www.rentready.fr/outils/checklist-etat-lieux",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checklist État des Lieux | RentReady",
    description: "Checklist interactive pour réaliser un état des lieux conforme. Gratuit.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.rentready.fr/outils/checklist-etat-lieux",
  },
};

export default function ChecklistEDLPage() {
  return <ChecklistEDLClient />;
}