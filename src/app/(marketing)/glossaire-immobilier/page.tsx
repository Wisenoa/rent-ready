import type { Metadata } from "next";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  buildItemListSchema,
  buildFAQPageSchema,
  buildGraphSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";
import { GlossarySidebar } from "@/components/seo/blog/GlossarySidebar";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { baseMetadata } from "@/lib/seo/metadata";
import glossaryData from "@/data/glossary.json";

interface GlossaryHubTerm {
  term: string;
  definition: string;
  /** Present because every term rendered here has a page. */
  slug: string;
}

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Glossaire Immobilier 2026 — Définitions Location & Gestion",
    description:
      "Glossaire immobilier complet 2026 : tous les termes de location, gestion locative, bail, quittance, charges et entretien. Définitions claires pour propriétaires.",
    url: "/glossaire-immobilier",
    ogType: "website",
  });
}
/**
 * The glossary hub renders the terms that actually have a page.
 *
 * It used to carry its own hardcoded array of 437 terms. That array was the
 * single worst content defect found in this project:
 *
 *   - only 5 of the 437 matched a real `/glossaire-immobilier/<slug>` page;
 *   - the hub contained exactly one `<Link>`, to `/register` — it pointed at
 *     none of its 30 glossary pages, so all 30 were orphaned from the hub;
 *   - the leftovers included machine-generated English that had been translated
 *     or invented: `Depositdang`, `Fallaitrice`, `Frameworthiness`,
 *     `Change of roommate`;
 *   - all 437 were emitted as ItemList JSON-LD and the first 20 as FAQPage, so
 *     the garbage was also being asserted as structured data.
 *
 * The array is deleted. `glossary.json` is the single source, the same one the
 * 30 pages read, and every term here now links to its page — which is what makes
 * those pages reachable from their own hub.
 */
const glossaryTerms: GlossaryHubTerm[] = glossaryData
  .map((entry) => ({
    term: entry.term,
    definition: entry.shortDefinition,
    slug: entry.slug,
  }))
  .sort((a, b) => a.term.localeCompare(b.term, "fr"));

const alphabetGroups = glossaryTerms.reduce(
  (acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  },
  {} as Record<string, typeof glossaryTerms>,
);

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

export default function GlossaireImmobilierPage() {
  const schema = buildGraphSchema(
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Glossaire Immobilier", url: "https://www.rentready.fr/glossaire-immobilier" },
    ]),
    buildWebPageSchema({
      name: "Glossaire Immobilier — Définitions Location et Investissement",
      description:
        "Glossaire complet de l'immobilier en France: définitions des termes de location, gestion locative, investissement immobilier.",
      url: "https://www.rentready.fr/glossaire-immobilier",
    }),
    buildItemListSchema({
      name: "Glossaire Immobilier",
      description:
        "Liste des définitions immobilières pour propriétaires bailleurs et investisseurs en France.",
      items: glossaryTerms.map((term) => ({
        name: term.term,
        description: term.definition,
      })),
    }),
    buildFAQPageSchema(
      glossaryTerms.slice(0, 20).map((term) => ({
        question: term.term,
        answer: term.definition,
      }))
    )
  );

  return (
    <>
      <SchemaMarkup data={schema} />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <BookOpen className="size-4" />
            lexique immobilier français
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Glossaire Immobilier — Définitions Location et Investissement
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
            Retrouvez toutes les définitions des termes de l'immobilier en France:{" "}
            <strong>IRL</strong>, <strong>DPE</strong>, <strong>dépôt de
            garantie</strong>, <strong>état des lieux</strong>, et bien plus
            encore.
          </p>

          {/* E-E-A-T: content review date — signals glossary is actively maintained */}
          <div className="mt-6">
            <ContentReviewBadge updatedAt="2026-04-01" category="glossary" />
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Main column */}
          <div>
            <nav className="mb-8 rounded-xl border border-stone-200/60 bg-white p-4">
              <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(alphabetGroups).map((letter) => (
                  <a
                    key={letter}
                    href={`#${letter}`}
                    className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </nav>

            <section className="space-y-12">
              {Object.entries(alphabetGroups).map(([letter, terms]) => (
                <div key={letter} id={letter}>
                  <h2 className="mb-6 border-b-2 border-blue-600 pb-2 text-2xl font-bold text-stone-900">
                    {letter}
                  </h2>
                  <dl className="space-y-6">
                    {terms.map((item) => (
                      <div key={item.term}>
                        <dt className="mb-2 text-lg font-semibold text-stone-800">
                          {/* Every term here has a page, so every term links to it.
                              The hub used to link to none of them, which is what
                              left all 30 glossary pages orphaned. */}
                          <Link
                            href={`/glossaire-immobilier/${item.slug}`}
                            className="hover:text-blue-700 hover:underline"
                          >
                            {item.term}
                          </Link>
                        </dt>
                        <dd className="text-stone-600">
                          <p className="mb-3">{item.definition}</p>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </section>

            <section className="mt-16 rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10">
              <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
                Simplifiez votre gestion locative
              </h2>
              <p className="mx-auto mb-6 max-w-lg text-stone-600">
                RentReady vous accompagne dans la compréhension et l'application de
                ces termes: quittances automatiques, calcul IRL, suivi des loyers.
                Essai gratuit 14 jours.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Commencer l'essai gratuit
                <ArrowRight className="size-4" />
              </Link>
            </section>
          </div>

          {/* Sticky sidebar */}
          <GlossarySidebar />
        </div>
      </div>
    </>
  );
}