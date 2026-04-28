import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { baseMetadata } from "@/lib/seo/metadata";
import glossaryData from "@/data/glossary.json";
import { articles } from "@/data/articles";
import { Calendar, Clock } from "lucide-react";

// ISR: glossary term pages are static reference content — revalidate weekly
export const revalidate = 604800;

/* ─── Types ─── */

/** Map glossary term slugs to related blog article slugs */
const GLOSSARY_TO_ARTICLES: Record<string, string[]> = {
  "quittance-loyer": ["quittance-loyer-pdf-gratuit", "quittance-loyer-mentions-obligatoires", "comment-gerer-loyers-impayes"],
  "bail-location": ["bail-location-vide-2026", "bail-location-meuble-2026", "bail-colocation-modele-clauses"],
  "caution-locative": ["garant-caution-solidaire", "assurance-loyer-impaye-gli"],
  "garant-loyer": ["garant-caution-solidaire", "assurance-loyer-impaye-gli"],
  "etat-des-lieux": ["etat-des-lieux-entree-sortie", "etat-des-lieux-proprietaire-modele", "depot-garantie-regles-essentielles"],
  "depot-garantie": ["depot-garantie-regles-essentielles", "etat-des-lieux-entree-sortie"],
  "charges-recuperables": ["charges-locatives-decompte-annualise", "quittance-loyer-mentions-obligatoires"],
  "loyer-nu": ["bail-location-vide-2026", "revision-loyer-irl-guide-complet", "optimiser-fiscalite-loyers"],
  "irl-indice-reference-loyers": ["revision-loyer-irl-guide-complet"],
  "revision-loyer": ["revision-loyer-irl-guide-complet"],
  "encadrement-loyer": ["loi-alur-proprietaire-bailleur", "revision-loyer-irl-guide-complet"],
  "impaye-loyer": ["comment-gerer-loyers-impayes", "lettre-relance-loyer-impaye-modele", "assurance-loyer-impaye-gli"],
  "relance-loyer": ["lettre-relance-loyer-impaye-modele", "comment-gerer-loyers-impayes"],
  "loyer-ccai": ["charges-locatives-decompte-annualise"],
  "rendement-locatif": ["calculer-rendement-locatif-brut-net", "optimiser-fiscalite-loyers"],
  "taxe-fonciere": ["optimiser-fiscalite-loyers", "calculer-rendement-locatif-brut-net"],
  "location-meuble": ["bail-location-meuble-2026", "optimiser-fiscalite-loyers"],
  "bail-mobilite": ["bail-location-meuble-2026"],
  "colocation": ["bail-colocation-modele-clauses"],
  "preavis-loyer": ["preavis-depart-locataire", "notice-conge-locataire"],
  "conge-location": ["notice-conge-locataire", "preavis-depart-locataire"],
  "vacance-locative": ["calculer-rendement-locatif-brut-net"],
  "visale": ["garant-caution-solidaire"],
  "declaration-impot": ["optimiser-fiscalite-loyers"],
  "maintenance-locative": [],
  "gerance-immobiliere": [],
  "apport-personnel": [],
  "loi-carrez": [],
};

type GlossaryEntry = (typeof glossaryData)[number];

type Props = {
  params: Promise<{ slug: string }>;
};

/* ─── Static generation ─── */

export function generateStaticParams() {
  return glossaryData.map((entry) => ({ slug: entry.slug }));
}

/* ─── Helpers ─── */

/** Find a glossary entry by slug, with fallback for aliases */
function findGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return glossaryData.find(
    (e) =>
      e.slug === slug ||
      e.term.toLowerCase().replace(/\s+/g, "-") === slug
  );
}

/** Resolve a related term slug to its display term */
function resolveRelatedTerm(slugOrTerm: string): { slug: string; label: string } {
  const entry = findGlossaryEntry(slugOrTerm);
  if (entry) return { slug: entry.slug, label: entry.term };
  // Fallback: treat as-is with human-readable formatting
  const label = slugOrTerm
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { slug: slugOrTerm, label };
}

/* ─── Metadata ─── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = findGlossaryEntry(slug);
  if (!entry) return {};

  return baseMetadata({
    title: `${entry.term} — Définition complète | RentReady`,
    description: `${entry.shortDefinition} En savoir plus sur ${entry.term} dans le glossaire immobilier RentReady.`,
    url: `/glossaire-immobilier/${entry.slug}`,
    ogType: "article",
  });
}

/* ─── Schema ─── */

function buildGlossarySchema(entry: GlossaryEntry) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
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
            name: "Glossaire Immobilier",
            item: "https://www.rentready.fr/glossaire-immobilier",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: entry.term,
            item: `https://www.rentready.fr/glossaire-immobilier/${entry.slug}`,
          },
        ],
      },
      {
        "@type": "DefinitionPage",
        name: entry.term,
        description: entry.shortDefinition,
        mainEntity: {
          "@type": "DefinedTerm",
          name: entry.term,
          definition: entry.fullDefinition,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "Glossaire Immobilier RentReady",
            url: "https://www.rentready.fr/glossaire-immobilier",
          },
        },
      },
    ],
  };
}

/* ─── Component ─── */

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const entry = findGlossaryEntry(slug);
  if (!entry) notFound();

  const resolvedRelated = (entry.relatedTerms ?? []).map(resolveRelatedTerm);
  const seeFurtherLinks = entry.seeFurtherLinks ?? [];

  // Related articles for this glossary term
  const relatedArticleSlugs = GLOSSARY_TO_ARTICLES[slug] ?? [];
  const relatedArticles = relatedArticleSlugs
    .map((aSlug) => articles.find((a) => a.slug === aSlug))
    .filter(Boolean)
    .slice(0, 3) as typeof articles;

  const breadcrumbItems = [
    { label: "Accueil", href: "https://www.rentready.fr" },
    {
      label: "Glossaire Immobilier",
      href: "https://www.rentready.fr/glossaire-immobilier",
    },
    { label: entry.term, href: `https://www.rentready.fr/glossaire-immobilier/${entry.slug}` },
  ];

  return (
    <>
      <SchemaMarkup data={buildGlossarySchema(entry)} />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Back navigation */}
        <Link
          href="/glossaire-immobilier"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Glossaire immobilier
        </Link>

        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="size-5 text-blue-600" />
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
              Glossaire Immobilier
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {entry.term}
          </h1>
          <p className="mt-4 text-lg font-medium text-stone-700">
            {entry.shortDefinition}
          </p>
        </header>

        {/* E-E-A-T badge */}
        <div className="mb-8">
          <ContentReviewBadge updatedAt={entry.updatedAt} category="glossary" />
        </div>

        {/* Main definition */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">
            Définition complète
          </h2>
          <div className="prose prose-stone max-w-none">
            <p className="leading-relaxed text-stone-700">{entry.fullDefinition}</p>
          </div>
        </div>

        {/* Related terms */}
        {resolvedRelated.length > 0 && (
          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500">
              Termes liés
            </h3>
            <div className="flex flex-wrap gap-2">
              {resolvedRelated.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/glossaire-immobilier/${rel.slug}`}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                >
                  {rel.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related articles from the blog */}
        {relatedArticles.length > 0 && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Articles du blog
            </h3>
            <div className="space-y-4">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex items-start gap-3 rounded-lg p-2 hover:bg-blue-100/60 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-stone-600">
                      {article.category}
                    </div>
                    <h4 className="text-sm font-semibold text-blue-900 group-hover:text-blue-700 line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-blue-600">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(article.date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs text-blue-700">
              <Link href="/blog" className="underline hover:text-blue-900">
                Voir tous les articles du blog
              </Link>
            </p>
          </div>
        )}

        {/* See further links */}
        {seeFurtherLinks.length > 0 && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Aller plus loin
            </h3>
            <div className="flex flex-wrap gap-3">
              {seeFurtherLinks.map((href) => {
                const label = href
                  .replace(/\/templates\//, "Modèle ")
                  .replace(/\/outils\//, "Outil ")
                  .replace(/\/glossaire-immobilier/, "Glossaire")
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-100"
                  >
                    {label}
                    <ExternalLink className="size-3" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100/50 p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-stone-900">
            Maîtrisez votre gestion locative
          </h3>
          <p className="mb-4 text-sm text-stone-600">
            RentReady automatise quittances, révisions de loyer et suivi des échéances.
            Essai gratuit 14 jours.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Commencer l'essai gratuit
          </Link>
        </div>
      </article>
    </>
  );
}
