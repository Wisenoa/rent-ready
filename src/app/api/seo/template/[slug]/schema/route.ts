/**
 * GET /api/seo/template/[slug]/schema
 * Returns HowTo schema.org JSON-LD for template pages.
 *
 * Slugs: bail-vide, bail-meuble, bail-mobilite, bail-commercial,
 *        colocation, etat-des-lieux, conge-locataire, conge-proprietaire,
 *        recu-loyer, lease
 *
 * Cache: public, max-age=3600, stale-while-revalidate=86400
 * Response: < 50ms
 */
import { NextRequest, NextResponse } from "next/server";

const VALID_TEMPLATES = [
  "bail-vide",
  "bail-meuble",
  "bail-mobilite",
  "bail-commercial",
  "colocation",
  "etat-des-lieux",
  "conge-locataire",
  "conge-proprietaire",
  "recu-loyer",
  "lease",
] as const;

type TemplateSlug = (typeof VALID_TEMPLATES)[number];

interface TemplateHowTo {
  name: string;
  description: string;
  url: string;
  steps: Array<{ name: string; text: string }>;
  toolList: string[];
  totalTime: string;
}

const TEMPLATE_DATA: Record<TemplateSlug, TemplateHowTo> = {
  "bail-vide": {
    name: "Modèle Bail de Location Vide — Téléchargement et Personnalisation",
    description:
      "Téléchargez un modèle de bail de location vide conforme à la loi du 6 juillet 1989. Personnalisez les clauses, téléchargez en PDF, et signez électronique.",
    url: "/templates/bail-vide",
    steps: [
      {
        name: "Remplissez les informations du bailleur et du locataire",
        text: "Entrez les noms, adresses, dates de naissance du bailleur et du locataire. Ces informations sont obligatoires pour la conformité légale.",
      },
      {
        name: "Décrivez le bien immobilier",
        text: "Indiquez l'adresse complète du logement, sa surface en m², le nombre de pièces, et les équipements inclus.",
      },
      {
        name: "Fixez le loyer et les conditions",
        text: "Saisissez le montant du loyer mensuel, les charges, le dépôt de garantie (max 1 mois hors charges), et la date de début du bail.",
      },
      {
        name: "Téléchargez et signez",
        text: "Générez le PDF conforme, téléchargez-le, et envoyez-le pour signature électronique au locataire.",
      },
    ],
    toolList: [
      "Éditeur de document PDF",
      "Signature électronique",
      "Stockage sécurisé",
    ],
    totalTime: "PT15M",
  },
  "bail-meuble": {
    name: "Modèle Bail de Location Meublée — Téléchargement Conforme 2026",
    description:
      "Modèle gratuit de bail meublé conforme à la loi Alur et loi Elan. Téléchargement PDF, personnalisation facile, signature électronique intégrée.",
    url: "/templates/bail-meuble",
    steps: [
      {
        name: "Saisissez les informations du bailleur et du locataire",
        text: "Entrez les coordonnées complètes du bailleur et du locataire, y compris les pièces d'identité.",
      },
      {
        name: "Décrivez le mobilier inclus",
        text: "Listez tous les équipements meublant le logement : électroménager, mobilier, literie, ustensiles de cuisine.",
      },
      {
        name: "Fixez le loyer meublé",
        text: "Le loyer d'un meublé peut être supérieur à un vide. Définissez le montant, les charges, et le dépôt de garantie (max 2 mois).",
      },
      {
        name: "Générez le PDF et signez",
        text: "Produisez un PDF juridiquement valide et faites-le signer par les deux parties.",
      },
    ],
    toolList: ["PDF conforme", "Liste inventaire mobilier", "Signature électronique"],
    totalTime: "PT20M",
  },
  "bail-mobilite": {
    name: "Modèle Bail de Mobilité — Résolution Citoyen",
    description:
      "Bail de mobilité pour étudiants, mutations professionnelles, missions temporaires. Conforme à la loi Elan 2019. Téléchargement gratuit.",
    url: "/templates/bail-mobilite",
    steps: [
      {
        name: "Vérifiez l'éligibilité du locataire",
        text: "Le locataire doit justifier d'une mutation professionnelle, d'un CDD, d'une formation ou d'un stage.",
      },
      {
        name: "Complétez les informations du logement",
        text: "Adresse, surface, description du mobilier pour un bail meublé de mobilité.",
      },
      {
        name: "Définissez la durée",
        text: "Le bail de mobilité dure de 1 à 10 mois, sans tacite reconduction possible.",
      },
      {
        name: "Produisez le document",
        text: "Générez le PDF prêt à signer pour les deux parties.",
      },
    ],
    toolList: ["Vérification éligibilité", "PDF bail", "Signature électronique"],
    totalTime: "PT10M",
  },
  "bail-commercial": {
    name: "Modèle Bail Commercial — Location de Fonds de Commerce",
    description:
      "Modèle de bail commercial conforme au Code de Commerce. Pour commerçants, artisans, libéraux. Téléchargement PDF professionnel.",
    url: "/templates/bail-commercial",
    steps: [
      {
        name: "Identifiez les parties",
        text: "Bailleur (propriétaire) et preneur (exploitant du fonds de commerce).",
      },
      {
        name: "Décrivez le local commercial",
        text: "Adresse, surface commerciale, destination (boutique, bureau, entrepôt).",
      },
      {
        name: "Fixez les conditions financières",
        text: "Loyer annuel, charges, dépôt de garantie, indexation, clause de révision.",
      },
      {
        name: "Générez le document officiel",
        text: "PDF prêt pour signature et éventuel enregistrement fiscal.",
      },
    ],
    toolList: ["Bail PDF", "Calculettes commerciales", "Clause personnalisable"],
    totalTime: "PT30M",
  },
  colocation: {
    name: "Modèle Contrat de Colocation — Bail Multiple",
    description:
      "Contrat de colocation conforme avec ou sans clause de solidité. Pour 2 à 10 colocataires. Téléchargement gratuit et mise à jour 2026.",
    url: "/templates/colocation",
    steps: [
      {
        name: "Identifiez tous les colocataires",
        text: "Renseignez les noms et coordonnées de chaque occupant du logement.",
      },
      {
        name: "Choisissez le type de colocation",
        text: "Colocation avec clause de solidarité (tous responsables) ou sans (chaque locataire gère sa part).",
      },
      {
        name: "Définissez les modalités financières",
        text: "Répartition du loyer et des charges entre colocataires, dépôt de garantie global.",
      },
      {
        name: "Générez le contrat",
        text: "PDF multi-signataires pour signature de tous les colocataires.",
      },
    ],
    toolList: ["Répartition loyer", "Clause solidarité", "Multi-signatures PDF"],
    totalTime: "PT15M",
  },
  "etat-des-lieux": {
    name: "Modèle État des Lieux — Entrée et Sortie",
    description:
      "Checklist état des lieux de sortie conforme à la loi du 6 juillet 1989. Téléchargement PDF gratuit. Comparez entrée et sortie automatiquement.",
    url: "/templates/etat-des-lieux",
    steps: [
      {
        name: "Effectuez l'état des lieux d'entrée",
        text: "Parcourez toutes les pièces et notez l'état de chaque élément : murs, sols, fenêtres, équipements.",
      },
      {
        name: "Prenez des photos datées",
        text: "Photographiez chaque pièce et tous équipements. Les photos horodatées constituent une preuve légale.",
      },
      {
        name: "Comparez à la sortie",
        text: "Refaites le même parcours à la sortie et comparez automatiquement les différences.",
      },
      {
        name: "Calculez les éventuelles retenues",
        text: "Le dépôt de garantie ne peut être retenu que pour des dégradations dues au locataire.",
      },
    ],
    toolList: ["Checklist interactive", "Comparaison entrée/sortie", "Photos datées"],
    totalTime: "PT45M",
  },
  "conge-locataire": {
    name: "Modèle Congé Locataire — Donné par le Locataire",
    description:
      "Lettre de congé donnée par le locataire au bailleur. Conforme loi du 6 juillet 1989. Préavis de 3 mois (1 mois pour zone tendue). Téléchargement gratuit.",
    url: "/templates/conge-locataire",
    steps: [
      {
        name: "Vérifiez votre délai de préavis",
        text: "Le préavis standard est de 3 mois. En zone tendue, il est réduit à 1 mois sur demande.",
      },
      {
        name: "Rédigez la lettre de congé",
        text: "La lettre doit mentionner le motif (fin de bail, reprise, vente), la date de départ, et être envoyée en recommandé avec AR.",
      },
      {
        name: "Envoyez en recommandé avec AR",
        text: "L'envoi en recommandé avec accusé de réception est obligatoire pour prouver la date d'envoi.",
      },
      {
        name: "Conservez une preuve",
        text: "Gardez l'accusé de réception et une copie de la lettre pendant 5 ans.",
      },
    ],
    toolList: ["Lettre type PDF", "Mise à jour rappel", "Modèles de motifs"],
    totalTime: "PT5M",
  },
  "conge-proprietaire": {
    name: "Modèle Congé Donné par le Bailleur — Motifs Valables",
    description:
      "Congé donné par le bailleur pour reprise, vente ou motif légitime et sérieux. Conforme à la loi du 6 juillet 1989. Lettres types incluses.",
    url: "/templates/conge-proprietaire",
    steps: [
      {
        name: "Vérifiez que votre motif est valide",
        text: "Seuls trois motifs sont légaux : reprise pour habiter, vente du bien, motif légitime et sérieux (ex: impayés, troubles de voisinage).",
      },
      {
        name: "Respectez le délai de préavis",
        text: "Le congé doit être donné 6 mois avant la fin du bail (3 mois en zone tendue pour le motif d'habitation).",
      },
      {
        name: "Envoyez le congé",
        text: "Le congé doit être notifié par acte extrajudiciaire (huissier) ou lettre recommandée avec AR.",
      },
      {
        name: "Indemnité de mobilité",
        text: "Si vous donnez congé pour vente, vous devez proposer une indemnité de mobilité de 1 mois de loyer au locataire.",
      },
    ],
    toolList: ["Acte huissier", "Indemnité calcul", "Lettres types multiples"],
    totalTime: "PT20M",
  },
  "recu-loyer": {
    name: "Modèle Reçu de Loyer — Quittance Conforme",
    description:
      "Quittance de loyer téléchargeable gratuitement. Conforme à la loi du 6 juillet 1989. Modèle PDF personnalisable avec mentions obligatoires.",
    url: "/templates/recu-loyer",
    steps: [
      {
        name: "Saisissez les informations du bail",
        text: "Nom du bailleur, adresse du bien, nom du locataire, période de location concernée.",
      },
      {
        name: "Indiquez le montant versé",
        text: "Loyer hors charges, provisions charges, total versé, et mode de paiement.",
      },
      {
        name: "Générez la quittance PDF",
        text: "Le reçu est automatiquement généré avec les mentions légales obligatoires.",
      },
      {
        name: "Envoyez au locataire",
        text: "Le bailleur est obligé de fournir une quittance dans le mois suivant la demande du locataire.",
      },
    ],
    toolList: ["Quittance PDF", "Mentions légales auto", "Archive mensuelle"],
    totalTime: "PT2M",
  },
  lease: {
    name: "Lease Agreement Template — English / International",
    description:
      "English-language residential lease template for international use. Conforms to standard common law rental agreements. Downloadable PDF.",
    url: "/templates/lease",
    steps: [
      {
        name: "Enter landlord and tenant details",
        text: "Full legal names, addresses, contact information for both parties.",
      },
      {
        name: "Describe the property",
        text: "Full address, property type, number of bedrooms, bathrooms, and included amenities.",
      },
      {
        name: "Set rental terms",
        text: "Monthly rent, security deposit (typically 1 month's rent), lease start and end dates.",
      },
      {
        name: "Generate and sign",
        text: "Download the PDF and obtain signatures from all parties.",
      },
    ],
    toolList: ["PDF document", "Digital signature", "Multi-language fields"],
    totalTime: "PT15M",
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!VALID_TEMPLATES.includes(slug as TemplateSlug)) {
    return NextResponse.json(
      { error: `Unknown template slug: ${slug}` },
      { status: 404 }
    );
  }

  const template = TEMPLATE_DATA[slug as TemplateSlug];
  const stepIndex = template.steps.map((s) => s.name).indexOf(template.steps[0].name);

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: template.name,
    description: template.description,
    url: `https://www.rentready.fr${template.url}`,
    step: template.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
    tool: template.toolList.map((tool) => ({
      "@type": "HowToTool",
      name: tool,
    })),
    totalTime: template.totalTime,
    isPartOf: {
      "@type": "WebSite",
      name: "RentReady",
      url: "https://www.rentready.fr",
    },
  };

  return NextResponse.json(schema, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
