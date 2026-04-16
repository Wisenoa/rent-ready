import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { TrustLogos } from "@/components/seo/TrustLogos";
import { InlineCTA } from "@/components/seo/InlineCTA";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import type { Metadata } from "next";

export interface SeoCalculatorPageProps {
  /** Page metadata */
  metadata: Metadata;
  /** Tool name (shown as H1) */
  title: string;
  /** Short description shown below H1 */
  description: string;
  /** ISO date string of last content review */
  updatedAt: string;
  /** Schema.org WebApplication name */
  slug: string;
  /** Breadcrumb items */
  breadcrumbs?: { name: string; href?: string }[];
  /** Trust signal: regulatory compliance */
  complianceBadge?: string;
  /** JSON-LD schema (HowTo + WebApplication) */
  jsonLd?: Record<string, unknown>;
  children: React.ReactNode;
}

/**
 * Reusable SEO-optimized calculator/tool page layout.
 *
 * Usage:
 * ```tsx
 * <SeoCalculatorPage
 *   title="Calculateur d'IRL"
 *   description="Calculez automatiquement la revision de votre loyer..."
 *   updatedAt="2026-04-10"
 *   slug="calculateur-irl"
 *   breadcrumbs={[{ name: "Outils" }]}
 *   complianceBadge="Conforme INSEE 2026"
 *   jsonLd={irlSchema}
 * >
 *   {calculatorWidget}
 *   {resultsExplanation}
 * </SeoCalculatorPage>
 * ```
 */
export function SeoCalculatorPage({
  metadata,
  title,
  description,
  updatedAt,
  slug,
  breadcrumbs = [],
  complianceBadge,
  jsonLd,
  children,
}: SeoCalculatorPageProps) {
  const schema = jsonLd ?? {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  return (
    <>
      {jsonLd && <SchemaMarkup data={schema} />}

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { name: "Accueil", href: "/" },
            { name: "Outils", href: "/outils" },
            ...breadcrumbs,
            { name: title },
          ]}
        />

        {/* Hero Header */}
        <header className="mb-10 text-center">
          {complianceBadge && (
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {complianceBadge}
            </div>
          )}

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">{title}</h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">{description}</p>
        </header>

        {/* Calculator Widget + children */}
        {children}

        {/* Trust Strip */}
        <div className="my-12 border-y border-stone-200 py-8">
          <TrustLogos variant="certifications-only" />
        </div>

        {/* Content Review Badge */}
        <ContentReviewBadge updatedAt={updatedAt} category="tool" />

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-stone-200 bg-stone-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-stone-900">Utilisez ce resultat dans RentReady</h2>
          <p className="mt-2 text-stone-600">Genererez automatiquement vos documents avec ces calculs. Essai gratuit 14 jours.</p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-block rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow transition-colors hover:bg-blue-700"
            >
              Essai gratuit
            </Link>
            <Link
              href="/outils"
              className="inline-block rounded-xl border border-stone-300 bg-white px-8 py-3.5 font-semibold text-stone-700 transition-colors hover:bg-stone-50"
            >
              Autres outils
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
