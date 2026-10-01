import type { ChecklistItem } from "@/lib/checklist-generator";

// Reference data, not a server action. Lives outside "use server" modules because
// Next.js only permits async function exports from those files.
// Default inspection items grouped by category
export const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  // Entrée / Salon
  { category: "Séjour", label: "Peintures et murs", condition: "GOOD" },
  { category: "Séjour", label: "Sols (parquet, carrelage, moquette)", condition: "GOOD" },
  { category: "Séjour", label: "Fenêtres et vitrages", condition: "GOOD" },
  { category: "Séjour", label: "Volets / stores", condition: "GOOD" },
  { category: "Séjour", label: "Plinthes et finitions", condition: "GOOD" },
  { category: "Séjour", label: "Éclairage (spots, lustres)", condition: "GOOD" },
  { category: "Séjour", label: "Prises électriques et interrupteurs", condition: "GOOD" },
  // Cuisine
  { category: "Cuisine", label: "Meubles de cuisine", condition: "GOOD" },
  { category: "Cuisine", label: "Plan de travail", condition: "GOOD" },
  { category: "Cuisine", label: "Évier et robineterie", condition: "GOOD" },
  { category: "Cuisine", label: "Plaques de cuisson", condition: "GOOD" },
  { category: "Cuisine", label: "Four / four micro-ondes", condition: "GOOD" },
  { category: "Cuisine", label: "Réfrigérateur / freezer", condition: "GOOD" },
  { category: "Cuisine", label: "Hotte aspirante", condition: "GOOD" },
  // Salle de bain
  { category: "Salle de bain", label: "Sanitaires (wc, lavabo, douche/baignoire)", condition: "GOOD" },
  { category: "Salle de bain", label: "Robineterie (mitigeurs, flexibles)", condition: "GOOD" },
  { category: "Salle de bain", label: "Carrelage et joints", condition: "GOOD" },
  { category: "Salle de bain", label: "Miroir et éclairage", condition: "GOOD" },
  { category: "Salle de bain", label: "Ventilation / VMC", condition: "GOOD" },
  { category: "Salle de bain", label: "Porte de salle de bain", condition: "GOOD" },
  // Chambres
  { category: "Chambres", label: "Peintures et murs", condition: "GOOD" },
  { category: "Chambres", label: "Sols", condition: "GOOD" },
  { category: "Chambres", label: "Fenêtres et vitrages", condition: "GOOD" },
  { category: "Chambres", label: "Volets / stores", condition: "GOOD" },
  { category: "Chambres", label: "Armoires intégrées", condition: "GOOD" },
  // WC
  { category: "WC", label: "Cuvette et flush", condition: "GOOD" },
  { category: "WC", label: "Robinet d'arrêt", condition: "GOOD" },
  { category: "WC", label: "Sol et murs", condition: "GOOD" },
  // Parties communes / extérieur
  { category: "Extérieur", label: "Balcon / terrasse", condition: "GOOD" },
  { category: "Extérieur", label: "Parking / garage", condition: "GOOD" },
  { category: "Extérieur", label: "Cave / grenier", condition: "GOOD" },
  { category: "Extérieur", label: "Espaces communs (entrée, escalier)", condition: "GOOD" },
  // Équipement / confort
  { category: "Équipement", label: "Chauffage / radiateurs", condition: "GOOD" },
  { category: "Équipement", label: "Climatisation / climatisation réversible", condition: "GOOD" },
  { category: "Équipement", label: "Ballon d'eau chaude", condition: "GOOD" },
  { category: "Équipement", label: "Compteur électrique", condition: "GOOD" },
  { category: "Équipement", label: "Compteur d'eau", condition: "GOOD" },
  { category: "Équipement", label: "Porte d'entrée et serrure", condition: "GOOD" },
  { category: "Équipement", label: "Interphone / digicode", condition: "GOOD" },
  { category: "Équipement", label: " Détecteur de fumée", condition: "GOOD" },
];
