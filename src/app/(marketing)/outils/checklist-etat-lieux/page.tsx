import type { Metadata } from "next";
import { ChecklistEDLClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Checklist État des Lieux — Interactive | RentReady",
    description: "Checklist interactive pour réaliser un état des lieux entrée ou sortie conforme à la loi. Parcourez chaque pièce, cochez les éléments, et généréz un réc...",
    url: "/outils/checklist-etat-lieux",
    ogType: "outil",
  });
}
;

export default function ChecklistEDLPage() {
  return <ChecklistEDLClient />;
}