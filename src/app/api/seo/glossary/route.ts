/**
 * GET /api/seo/glossary
 *
 * Returns JSON-LD schema.org for the glossary listing page:
 *   - ItemList schema (all 30 glossary terms)
 *   - BreadcrumbList schema
 *
 * Cache: public, max-age=86400, stale-while-revalidate=604800
 * Response: < 50ms
 */
import { NextResponse } from "next/server";

const GLOSSARY_TERMS = [
  { slug: "quittance-loyer", term: "Quittance de loyer" },
  { slug: "bail-location", term: "Bail de location" },
  { slug: "caution-locative", term: "Caution locative" },
  { slug: "garant-loyer", term: "Garant de loyer" },
  { slug: "etat-des-lieux", term: "État des lieux" },
  { slug: "irl-indice-reference-loyers", term: "IRL - Indice de référence des loyers" },
  { slug: "loyer-nu", term: "Loyer nu" },
  { slug: "charges-recuperables", term: "Charges récupérables" },
  { slug: "conge-location", term: "Congé de location" },
  { slug: "preavis-loyer", term: "Préavis de loyer" },
  { slug: "depot-garantie", term: "Dépôt de garantie" },
  { slug: "visale", term: "Visale" },
  { slug: "colocation", term: "Colocation" },
  { slug: "location-vide", term: "Location vide" },
  { slug: "location-meuble", term: "Location meublée" },
  { slug: "bail-mobilite", term: "Bail de mobilité" },
  { slug: "encadrement-loyer", term: "Encadrement des loyers" },
  { slug: "loyer-ccai", term: "Loyer CC/AI" },
  { slug: "revision-loyer", term: "Révision de loyer" },
  { slug: "apport-personnel", term: "Apport personnel" },
  { slug: "rendement-locatif", term: "Rendement locatif" },
  { slug: "vacance-locative", term: "Vacance locative" },
  { slug: "surface-habitable", term: "Surface habitable" },
  { slug: "loi-carrez", term: "Loi Carrez" },
  { slug: "declaration-impot", term: "Déclaration d'impôt" },
  { slug: "taxe-fonciere", term: "Taxe foncière" },
  { slug: "gerance-immobiliere", term: "Gérance immobilière" },
  { slug: "maintenance-locative", term: "Maintenance locative" },
  { slug: "impaye-loyer", term: "Impaye de loyer" },
  { slug: "relance-loyer", term: "Relance de loyer" },
];

export async function GET() {
  const itemListElements = GLOSSARY_TERMS.map((term, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: term.term,
    url: `https://www.rentready.fr/glossaire-immobilier/${term.slug}`,
  }));

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Glossaire immobilier RentReady",
      description:
        "30 termes essentiels de la gestion locative expliqués simplement : quittance de loyer, bail de location, dépôt de garantie, IRL, charges récupérables, et bien plus.",
      url: "https://www.rentready.fr/glossaire-immobilier",
      numberOfItems: GLOSSARY_TERMS.length,
      itemListElement: itemListElements,
    },
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
      ],
    },
  ];

  return NextResponse.json(
    { schemas, meta: { totalTerms: GLOSSARY_TERMS.length } },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
