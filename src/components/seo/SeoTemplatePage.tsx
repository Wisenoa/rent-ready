import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { TrustLogos } from "@/components/seo/TrustLogos";
import { InlineCTA } from "@/components/seo/InlineCTA";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import type { Metadata } from "next";

export interface SeoTemplatePageProps {
  /** Page metadata */
  metadata: Metadata;
  /** Template name (shown as H1) */
  title: string;
  /** Short description shown below H1 */
  description: string;
  /** ISO date string of last content review */
  updatedAt: string;
  /** Category for ContentReviewBadge display style */
  badgeCategory?: "template" | "tool" | "article";
  /** Slug for badge icon variant */
  slug: string;
  /** Breadcrumb items (excluding Home and final item) */
  breadcrumbs?: { name: string; href?: string }[];
  /** Trust signal: how many times downloaded */
  downloadCount?: number;
  /** Trust signal: which law/regulation this template follows */
  legalReference?: string;
  /** Related template links shown at bottom */
  relatedTemplates?: { title: string; href: string; description: string }[];
  /** FAQ items (rendered with FAQPage schema) */
  faqs?: { question: string; answer: string }[];
  /** JSON-LD schema data */
  jsonLd?: Record<string, unknown>;
  children: React.ReactNode;
}

/**
 * Reusable SEO-optimized template page layout.
 *
 * Usage:
 * ```tsx
 * <SeoTemplatePage
 *   title="Quittance de Loyer"
 *   description="Generated compliant rent receipts in seconds..."
 *   updatedAt="2026-04-10"
 *   slug="quittance-de-loyer"
 *   breadcrumbs={[{ name: "Modeles", href: "/modeles" }]}
 *   downloadCount={12400}
 *   legalReference="Article 21 de la loi du 6 juillet 1989"
 *   relatedTemplates={[...]}
 *   faqs={[{ question: "...", answer: "..." }]}
 *   jsonLd={quittanceSchema}
 * >
 *   {heroCtas}
 *   {documentPreview}
 *   {seoContent}
 * </SeoTemplatePage>
 * ```
 */
export function SeoTemplatePage({
  metadata,
  title,
  description,
  updatedAt,
  badgeCategory = "template",
  slug,
  breadcrumbs = [],
  downloadCount,
  legalReference,
  relatedTemplates = [],
  faqs = [],
  jsonLd,
  children,
}: SeoTemplatePageProps) {
  const schema = jsonLd ?? {
    "@context": "https://schema.org",
    "@type": "Article",
    name: title,
    description,
    dateModified: updatedAt,
    publisher: { "@type": "Organization", name: "RentReady", url: "https://www.rentready.fr" },
  };

  return (
    <>
      {jsonLd && <SchemaMarkup data={schema} />}

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { name: "Accueil", href: "/" },
            { name: "Modeles", href: "/modeles" },
            ...breadcrumbs,
            { name: title },
          ]}
        />

        {/* Hero Header */}
        <header className="mt-8 mb-10 text-center">
          {/* "Gratuit" badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            100% Gratuit
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">{title}</h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">{description}</p>

          {/* Trust signals row */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-stone-500">
            {downloadCount && (
              <span className="flex items-center gap-1">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Telecharge {downloadCount.toLocaleString("fr-FR")} fois
              </span>
            )}
            {legalReference && (
              <span className="flex items-center gap-1">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {legalReference}
              </span>
            )}
          </div>
        </header>

        {/* Page content (hero CTAs, document preview, etc.) */}
        {children}

        {/* Trust Strip */}
        <div className="my-12 border-y border-stone-200 py-8">
          <TrustLogos variant="certifications-only" />
        </div>

        {/* Content Review Badge */}
        <ContentReviewBadge updatedAt={updatedAt} category={badgeCategory} />

        {/* Related Templates */}
        {relatedTemplates.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-semibold text-stone-900">Modeles associes</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedTemplates.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group rounded-xl border border-stone-200 bg-white p-5 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <h3 className="font-medium text-stone-900 group-hover:text-blue-700">{t.title}</h3>
                  <p className="mt-1 text-sm text-stone-500">{t.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-semibold text-stone-900">Questions frequentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group rounded-xl border border-stone-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium text-stone-900 list-none">
                    {faq.question}
                    <svg className="size-5 shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-stone-600">
                    <p>{faq.answer}</p>
                    <div className="mt-3">
                      <InlineCTA
                        href={`/${slug}?utm_content=${slug}-faq-${i}`}
                        text="Essayer ce modele"
                        variant="link"
                        showArrow
                      />
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="mt-12 rounded-2xl bg-blue-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Pret a commencer ?</h2>
          <p className="mt-2 text-blue-100">Generer ce document gratuitement en 2 minutes. Aucune carte requise.</p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-block rounded-xl bg-white px-8 py-3.5 font-semibold text-blue-700 shadow transition-colors hover:bg-blue-50"
            >
              Generer maintenant
            </Link>
            <Link
              href="/blog"
              className="inline-block rounded-xl border border-blue-400 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Lire nos guides
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
