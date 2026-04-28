/**
 * GET /api/seo/tools/[slug]/schema
 *
 * Returns HowTo schema.org JSON-LD for a tool page (calculators, generators, simulators).
 * Each tool gets a tailored HowTo with realistic steps specific to that tool's function.
 *
 * Slugs: calculateur-irl-2026, calculateur-depot-garantie, lettre-relance-loyer,
 *        modele-bail-location, modele-quittance-loyer-pdf, simulateur-loi-jeanbrun,
 *        calculateur-rendement-locatif, calculateur-revision-irl, calculateur-rendement,
 *        calculateur-caution, generateur-quittance, calculateur-charges-locatives,
 *        calculateur-loyer, calculateur-preavis, checklist-etat-lieux,
 *        calculateur-plus-value, calculateur-surface-habitable,
 *        generateur-conge-vente, simulateur-fiscalite-lmnp, simulateur-pret-immobilier
 *
 * Cache: public, max-age=3600, stale-while-revalidate=86400
 * Response: < 50ms
 */
import { NextRequest, NextResponse } from "next/server";

const VALID_TOOLS = [
  "calculateur-irl-2026",
  "calculateur-depot-garantie",
  "lettre-relance-loyer",
  "modele-bail-location",
  "modele-quittance-loyer-pdf",
  "simulateur-loi-jeanbrun",
  "calculateur-rendement-locatif",
  "calculateur-revision-irl",
  "calculateur-rendement",
  "calculateur-caution",
  "generateur-quittance",
  "calculateur-charges-locatives",
  "calculateur-loyer",
  "calculateur-preavis",
  "checklist-etat-lieux",
  "calculateur-plus-value",
  "calculateur-surface-habitable",
  "generateur-conge-vente",
  "simulateur-fiscalite-lmnp",
  "simulateur-pret-immobilier",
] as const;

type ToolSlug = (typeof VALID_TOOLS)[number];

interface ToolHowTo {
  name: string;
  description: string;
  url: string;
  steps: Array<{ name: string; text: string }>;
  totalTime: string;
}

const TOOL_DATA: Record<ToolSlug, ToolHowTo> = {
  "calculateur-irl-2026": {
    name: "Calculateur IRL 2026 — Révision de Loyer",
    description:
      "Calculez la révision de votre loyer avec l'IRL du 4e trimestre 2025. Formule légale appliquée automatiquement.",
    url: "/outils/calculateur-irl-2026",
    steps: [
      {
        name: "Saisissez votre loyer actuel",
        text: "Entrez le montant actuel de votre loyer hors charges en euros.",
      },
      {
        name: "Indiquez la date de révision",
        text: "Précisez la date à laquelle la révision doit s'appliquer (anniversaire du bail ou date légale).",
      },
      {
        name: "Consulter le résultat",
        text: "Obtenez immédiatement le nouveau loyer révisé selon la formule légale : Loyer révisé = Loyer actuel × (IRL nouveau / IRL ancien).",
      },
    ],
    totalTime: "PT1M",
  },
  "calculateur-depot-garantie": {
    name: "Calculateur Dépôt de Garantie — Location",
    description:
      "Calculez le dépôt de garantie maximum légal pour votre location, qu'elle soit vide ou meublée.",
    url: "/outils/calculateur-depot-garantie",
    steps: [
      {
        name: "Sélectionnez le type de location",
        text: "Choisissez entre location vide (max 1 mois hors charges) ou location meublée (max 2 mois hors charges).",
      },
      {
        name: "Saisissez le montant du loyer",
        text: "Entrez le montant de votre loyer mensuel hors charges.",
      },
      {
        name: "Obtenez le maximum légal",
        text: "Le calculateur affiche directement le dépôt de garantie maximum autorisé par la loi.",
      },
    ],
    totalTime: "PT1M",
  },
  "lettre-relance-loyer": {
    name: "Modèle Lettre de Relance Loyer Impayé",
    description:
      "Générez une lettre de relance pour loyer impayé, gratuite et personnalisable. Conforme à la procédure amiable.",
    url: "/outils/lettre-relance-loyer",
    steps: [
      {
        name: "Renseignez les informations du bail",
        text: "Nom du bailleur, adresse du bien, nom du locataire, période concernée.",
      },
      {
        name: "Précisez le montant de l'impayé",
        text: "Indiquez le montant total dû, incluant les pénalités si prévues au bail.",
      },
      {
        name: "Générez et envoyez",
        text: "Téléchargez la lettre en PDF et envoyez-la en recommandé avec accusé de réception.",
      },
    ],
    totalTime: "PT5M",
  },
  "modele-bail-location": {
    name: "Modèle Bail de Location — Contrat Conforme 2026",
    description:
      "Téléchargez un modèle de bail de location conforme à la loi du 6 juillet 1989. Personnalisable et imprimable.",
    url: "/outils/modele-bail-location",
    steps: [
      {
        name: "Complétez les informations du bailleur et du locataire",
        text: "Noms, adresses, dates de naissance des deux parties.",
      },
      {
        name: "Décrivez le bien immobilier",
        text: "Adresse complète, surface, nombre de pièces, équipements inclus.",
      },
      {
        name: "Fixez les conditions financières",
        text: "Loyer, charges, dépôt de garantie, date de début du bail.",
      },
      {
        name: "Générez et signez",
        text: "Produisez un PDF juridiquement valide et faites-le signer.",
      },
    ],
    totalTime: "PT15M",
  },
  "modele-quittance-loyer-pdf": {
    name: "Modèle Quittance de Loyer PDF",
    description:
      "Générez une quittance de loyer PDF conforme à la loi du 6 juillet 1989. Mentions obligatoires incluses.",
    url: "/outils/modele-quittance-loyer-pdf",
    steps: [
      {
        name: "Saisissez les informations du bailleur et du locataire",
        text: "Nom, adresse, références du bail.",
      },
      {
        name: "Indiquez le montant versé",
        text: "Loyer hors charges, provisions pour charges, total versé.",
      },
      {
        name: "Générez la quittance",
        text: "Le PDF conforme est généré automatiquement avec les mentions légales.",
      },
    ],
    totalTime: "PT2M",
  },
  "simulateur-loi-jeanbrun": {
    name: "Simulateur Loi Jean-Louis Bourlanges — Encadrement des Loyers",
    description:
      "Vérifiez si votre loyer respecte l'encadrement des loyers dans les zones tendues.",
    url: "/outils/simulateur-loi-jeanbrun",
    steps: [
      {
        name: "Sélectionnez la commune",
        text: "Indiquez la ville où se situe votre bien pour appliquer le loyer de référence.",
      },
      {
        name: "Saisissez les caractéristiques du logement",
        text: "Type, surface, nombre de pièces, époque de construction.",
      },
      {
        name: "Comparez votre loyer",
        text: "Obtenez la conformité de votre loyer par rapport au loyer de référence.",
      },
    ],
    totalTime: "PT3M",
  },
  "calculateur-rendement-locatif": {
    name: "Calculateur Rendement Locatif",
    description:
      "Calculez le rendement brut et net de votre investissement locatif, avec prise en compte des charges et fiscalite.",
    url: "/templates/calculateur-rendement-locatif",
    steps: [
      {
        name: "Entrez le prix d'achat du bien",
        text: "Prix net vendeur, frais de notaire estimés.",
      },
      {
        name: "Saisissez les revenus locatifs",
        text: "Loyer mensuel multiplié par 12, taux d'occupation prévisionnel.",
      },
      {
        name: "Indiquez les charges",
        text: "Taxe foncière, charges de copropriété, frais de gestion, assurance.",
      },
      {
        name: "Analysez le résultat",
        text: "Obtenez le rendement brut, net et net-net, avec comparaison au taux du PEL.",
      },
    ],
    totalTime: "PT5M",
  },
  "calculateur-revision-irl": {
    name: "Calculateur Révision de Loyer IRL",
    description:
      "Calculez automatiquement la révision de votre loyer selon l'indice INSEE le plus récent.",
    url: "/outils/calculateur-revision-irl",
    steps: [
      {
        name: "Saisissez le loyer actuel",
        text: "Loyer hors charges en euros.",
      },
      {
        name: "Indiquez l'indice IRL de référence",
        text: "L'indice de révision est automatiquement proposé selon la date de révision.",
      },
      {
        name: "Obtenez le nouveau loyer",
        text: "Le calcul est effectué selon la formule légale.",
      },
    ],
    totalTime: "PT1M",
  },
  "calculateur-rendement": {
    name: "Calculateur de Rendement Locatif",
    description:
      "Évaluez la rentabilité de votre investissement immobilier locatif en quelques clics.",
    url: "/outils/calculateur-rendement",
    steps: [
      {
        name: "Saisissez les données du bien",
        text: "Prix d'achat, loyer mensuel, charges estimées.",
      },
      {
        name: "Obtenez le rendement",
        text: "Rendement brut et net affiché instantanément.",
      },
    ],
    totalTime: "PT2M",
  },
  "calculateur-caution": {
    name: "Calculateur de Caution Immobilière",
    description:
      "Estimez le montant maximum de la garantie demandée à un garant ou à une caution.",
    url: "/outils/calculateur-caution",
    steps: [
      {
        name: "Sélectionnez le type de location",
        text: "Vide ou meublée.",
      },
      {
        name: "Saisissez le loyer",
        text: "Montant du loyer mensuel hors charges.",
      },
      {
        name: "Obtenez le montant de la garantie",
        text: "Le maximum légal est calculé automatiquement.",
      },
    ],
    totalTime: "PT1M",
  },
  "generateur-quittance": {
    name: "Générateur de Quittance de Loyer",
    description:
      "Créez une quittance de loyer PDF conforme avec toutes les mentions obligatoires.",
    url: "/outils/generateur-quittance",
    steps: [
      {
        name: "Entrez les informations du bail",
        text: "Noms, adresse, références du bail.",
      },
      {
        name: "Indiquez le montant payé",
        text: "Loyer, charges, moyen de paiement.",
      },
      {
        name: "Téléchargez la quittance",
        text: "PDF prêt à remettre au locataire.",
      },
    ],
    totalTime: "PT2M",
  },
  "calculateur-charges-locatives": {
    name: "Calculateur de Charges Locatives",
    description:
      "Estimez et regularisez les charges locatives entre bailleur et locataire.",
    url: "/outils/calculateur-charges-locatives",
    steps: [
      {
        name: "Saisissez les provisions charges",
        text: "Montant des provisions mensuelles charges.",
      },
      {
        name: "Indiquez les charges réelles annuelles",
        text: "Montant réel des charges sur l'année.",
      },
      {
        name: "Obtenez la régularisation",
        text: "Soit à payer, soit à restituer au locataire.",
      },
    ],
    totalTime: "PT3M",
  },
  "calculateur-loyer": {
    name: "Calculateur de Loyer",
    description:
      "Estimez le loyer adapté à votre bien selon le marché et la réglementation.",
    url: "/outils/calculateur-loyer",
    steps: [
      {
        name: "Décrivez le bien",
        text: "Ville, surface, nombre de pièces, type.",
      },
      {
        name: "Obtenez une estimation",
        text: "Fourchette de loyer recommandée pour votre bien.",
      },
    ],
    totalTime: "PT1M",
  },
  "calculateur-preavis": {
    name: "Calculateur de Préavis de Loyer",
    description:
      "Connaissez la durée de préavis applicable à votre location selon votre situation.",
    url: "/outils/calculateur-preavis",
    steps: [
      {
        name: "Sélectionnez votre situation",
        text: "Zone tendue ou non, motif du départ.",
      },
      {
        name: "Obtenez la durée du préavis",
        text: "1 mois ou 3 mois selon la réglementation.",
      },
    ],
    totalTime: "PT1M",
  },
  "checklist-etat-lieux": {
    name: "Checklist État des Lieux",
    description:
      "Préparez votre état des lieux d'entrée ou de sortie avec une checklist interactive.",
    url: "/outils/checklist-etat-lieux",
    steps: [
      {
        name: "Parcourez les pièces",
        text: "Pièce par pièce, notez l'état de chaque élément.",
      },
      {
        name: "Ajoutez des photos",
        text: "Photographiez les éléments concernés.",
      },
      {
        name: "Générez le document",
        text: "PDF prêt pour signature.",
      },
    ],
    totalTime: "PT30M",
  },
  "calculateur-plus-value": {
    name: "Calculateur de Plus-Value Immobilière",
    description:
      "Estimez la plus-value et l'impôt potentiel lors d'une vente immobilière.",
    url: "/outils/calculateur-plus-value",
    steps: [
      {
        name: "Saisissez le prix d'achat",
        text: "Prix d'acquisition et date d'achat.",
      },
      {
        name: "Indiquez le prix de vente",
        text: "Prix de vente estimé ou réel.",
      },
      {
        name: "Obtenez la simulation",
        text: "Plus-value brute, nette fiscale, et impot estimé.",
      },
    ],
    totalTime: "PT3M",
  },
  "calculateur-surface-habitable": {
    name: "Calculateur de Surface Habitable",
    description:
      "Calculez la surface habitable d'un logement selon la méthode légale (loi Carrez et décret).",
    url: "/outils/calculateur-surface-habitable",
    steps: [
      {
        name: "Entrez les dimensions",
        text: "Longueur et largeur de chaque pièce.",
      },
      {
        name: "Obtenez la surface",
        text: "Surface habitable totale après déductions réglementaires.",
      },
    ],
    totalTime: "PT5M",
  },
  "generateur-conge-vente": {
    name: "Générateur de Congé pour Vente",
    description:
      "Créez une lettre de congé pour vente destinée au locataire, conforme à la loi.",
    url: "/outils/generateur-conge-vente",
    steps: [
      {
        name: "Renseignez les informations",
        text: "Noms, adresse du bien.",
      },
      {
        name: "Précisez les conditions",
        text: "Date d'effet, offre de prix si nécessaire.",
      },
      {
        name: "Générez la lettre",
        text: "PDF prêt pour envoi en recommandée.",
      },
    ],
    totalTime: "PT5M",
  },
  "simulateur-fiscalite-lmnp": {
    name: "Simulateur Fiscalité LMNP",
    description:
      "Estimez votre fiscalite en location meublée non professionnelle (LMNP) et le Bénéfice RC.",
    url: "/outils/simulateur-fiscalite-lmnp",
    steps: [
      {
        name: "Saisissez vos revenus",
        text: "Loyers mensuels et charges.",
      },
      {
        name: "Indiquez le régime",
        text: "Micro-BIC ou réel simplifié.",
      },
      {
        name: "Obtenez votre bénéfice imposable",
        text: "Estimation du Résultat Courant Non professionnel.",
      },
    ],
    totalTime: "PT5M",
  },
  "simulateur-pret-immobilier": {
    name: "Simulateur de Prêt Immobilier",
    description:
      "Estimez votre capacité d'emprunt et le montant de vos mensualités pour un prêt immobilier.",
    url: "/outils/simulateur-pret-immobilier",
    steps: [
      {
        name: "Saisissez vos revenus",
        text: "Salaire net, autres revenus, charges.",
      },
      {
        name: "Indiquez l'apport",
        text: "Apport personnel disponible.",
      },
      {
        name: "Obtenez une simulation",
        text: "Capacité d'emprunt, mensualités, taux estimés.",
      },
    ],
    totalTime: "PT5M",
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!VALID_TOOLS.includes(slug as ToolSlug)) {
    return NextResponse.json(
      { error: `Unknown tool slug: ${slug}` },
      { status: 404 }
    );
  }

  const tool = TOOL_DATA[slug as ToolSlug];

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tool.name,
    description: tool.description,
    url: `https://www.rentready.fr${tool.url}`,
    steps: tool.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    totalTime: tool.totalTime,
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
