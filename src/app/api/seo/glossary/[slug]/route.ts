/**
 * GET /api/seo/glossary/[slug]/schema
 *
 * Returns JSON-LD schema.org for an individual glossary term page:
 *   - BreadcrumbList schema
 *   - WebPage schema
 *
 * Slugs: quittance-loyer, bail-location, caution-locative, garant-loyer,
 *        etat-des-lieux, irl-indice-reference-loyers, loyer-nu, charges-recuperables,
 *        conge-location, preavis-loyer, depot-garantie, visale, colocation, location-vide,
 *        location-meuble, bail-mobilite, encadrement-loyer, loyer-ccai, revision-loyer,
 *        apport-personnel, rendement-locatif, vacance-locative, surface-habitable,
 *        loi-carrez, declaration-impot, taxe-fonciere, gerance-immobiliere,
 *        maintenance-locative, impaye-loyer, relance-loyer
 *
 * Cache: public, max-age=86400, stale-while-revalidate=604800
 * Response: < 50ms
 */
import { NextRequest, NextResponse } from "next/server";

const VALID_SLUGS = [
  "quittance-loyer", "bail-location", "caution-locative", "garant-loyer",
  "etat-des-lieux", "irl-indice-reference-loyers", "loyer-nu", "charges-recuperables",
  "conge-location", "preavis-loyer", "depot-garantie", "visale", "colocation",
  "location-vide", "location-meuble", "bail-mobilite", "encadrement-loyer",
  "loyer-ccai", "revision-loyer", "apport-personnel", "rendement-locatif",
  "vacance-locative", "surface-habitable", "loi-carrez", "declaration-impot",
  "taxe-fonciere", "gerance-immobiliere", "maintenance-locative", "impaye-loyer",
  "relance-loyer",
] as const;

const TERM_DATA: Record<(typeof VALID_SLUGS)[number], { name: string; description: string }> = {
  "quittance-loyer": {
    name: "Quittance de loyer",
    description: "Document officiel remis par le bailleur au locataire lors du paiement du loyer, attestant du montant versé et des charges.",
  },
  "bail-location": {
    name: "Bail de location",
    description: "Contrat écrit qui encadre la location d'un bien immobilier entre un bailleur et un locataire.",
  },
  "caution-locative": {
    name: "Caution locative",
    description: "Personne physique ou organisme qui se porte garant des obligations du locataire envers le bailleur.",
  },
  "garant-loyer": {
    name: "Garant de loyer",
    description: "Personne qui s'engage à payer les loyers et charges en cas de défaillance du locataire.",
  },
  "etat-des-lieux": {
    name: "État des lieux",
    description: "Document décrivant l'état d'un logement à l'entrée et à la sortie du locataire.",
  },
  "irl-indice-reference-loyers": {
    name: "IRL - Indice de référence des loyers",
    description: "Indice publié par l'INSEE servant de base pour la révision des loyers d'habitation.",
  },
  "loyer-nu": {
    name: "Loyer nu",
    description: "Loyer d'un bien immobilier non meublé, c'est-à-dire sans équipements ni mobilier.",
  },
  "charges-recuperables": {
    name: "Charges récupérables",
    description: "Charges dont le bailleur peut demander le remboursement au locataire, listées par décret.",
  },
  "conge-location": {
    name: "Congé de location",
    description: "Notification par laquelle le bailleur ou le locataire met fin au contrat de location.",
  },
  "preavis-loyer": {
    name: "Préavis de loyer",
    description: "Délai de notification que le locataire doit respecter avant de quitter le logement.",
  },
  "depot-garantie": {
    name: "Dépôt de garantie",
    description: "Somme versée par le locataire au bailleur lors de l'entrée dans le logement, restituée en fin de bail.",
  },
  "visale": {
    name: "Visale",
    description: "Dispositif государственного garant pour les loyers impayés à destination des jeunes de moins de 30 ans.",
  },
  "colocation": {
    name: "Colocation",
    description: "Location d'un même logement par plusieurs locataires, chacun ayant un bail individuel.",
  },
  "location-vide": {
    name: "Location vide",
    description: "Location d'un bien immobilier sans meuble, soumis à la loi du 6 juillet 1989.",
  },
  "location-meuble": {
    name: "Location meublée",
    description: "Location d'un bien équipé de meubles et d'équipements, avec des règles spécifiques.",
  },
  "bail-mobilite": {
    name: "Bail de mobilité",
    description: "Contrat de location meublée de 1 à 10 mois, réservé aux personnes en mobilité professionnelle.",
  },
  "encadrement-loyer": {
    name: "Encadrement des loyers",
    description: "Réglementation qui limite les loyers dans certaines zones tendues, lors d'une relocation ou d'un renouvellement.",
  },
  "loyer-ccai": {
    name: "Loyer CC/AI",
    description: "Loyer de référence appliqué dans les zones d'encadrement des loyers (conventionnement ANAH ou constat de livrable).",
  },
  "revision-loyer": {
    name: "Révision de loyer",
    description: "Possibilité pour le bailleur de réviser annuellement le loyer selon l'évolution de l'IRL.",
  },
  "apport-personnel": {
    name: "Apport personnel",
    description: "Somme d'argent que l'emprunteur investit lui-même dans un projet immobilier.",
  },
  "rendement-locatif": {
    name: "Rendement locatif",
    description: "Ratio entre les revenus locatifs annuels et le prix d'achat d'un bien immobilier.",
  },
  "vacance-locative": {
    name: "Vacance locative",
    description: "Période pendant laquelle un bien immobilier reste inoccupé entre deux locataires.",
  },
  "surface-habitable": {
    name: "Surface habitable",
    description: "Surface de plancher construite après déduction des murs, cloisons, marches, cages d'escaliers etgainages.",
  },
  "loi-carrez": {
    name: "Loi Carrez",
    description: "Loi qui impose la mention de la surface privative dans les contrats de vente de lots de copropriété.",
  },
  "declaration-impot": {
    name: "Déclaration d'impôt",
    description: "Obligation pour le propriétaire bailleur de déclarer les revenus locatifs aux impôts.",
  },
  "taxe-fonciere": {
    name: "Taxe foncière",
    description: "Impôt local annuel dû par le propriétaire d'un bien immobilier bâtit.",
  },
  "gerance-immobiliere": {
    name: "Gérance immobilière",
    description: "Mission confiée à un professionnel pour gérer un ou plusieurs biens immobiliers pour le compte d'un propriétaire.",
  },
  "maintenance-locative": {
    name: "Maintenance locative",
    description: "Ensemble des travaux d'entretien et de réparation nécessaires au maintien en état d'un bien loué.",
  },
  "impaye-loyer": {
    name: "Impaye de loyer",
    description: "Loyer qui n'est pas réglé à la date prévue, entrainant une procédure de recouvrement.",
  },
  "relance-loyer": {
    name: "Relance de loyer",
    description: "Courrier ou email envoyé au locataire en cas de retard de paiement du loyer.",
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug as (typeof VALID_SLUGS)[number])) {
    return NextResponse.json(
      { error: `Unknown glossary term slug: ${slug}` },
      { status: 404 }
    );
  }

  const term = TERM_DATA[slug as (typeof VALID_SLUGS)[number]];

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: "https://www.rentready.fr",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Glossaire immobilier",
          item: "https://www.rentready.fr/glossaire-immobilier",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: term.name,
          item: `https://www.rentready.fr/glossaire-immobilier/${slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${term.name} — Définition | Glossaire RentReady`,
      description: term.description,
      url: `https://www.rentready.fr/glossaire-immobilier/${slug}`,
      isPartOf: {
        "@type": "WebSite",
        name: "RentReady",
        url: "https://www.rentready.fr",
      },
    },
  ];

  return NextResponse.json(
    { schemas },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
