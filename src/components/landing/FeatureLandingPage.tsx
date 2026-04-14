"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

interface FeatureLandingPageProps {
  badge?: string;
  badgeEmoji?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  howItWorksTitle?: string;
  howItWorksSteps?: HowItWorksStep[];
  testimonialsTitle?: string;
  testimonials?: Testimonial[];
  faqTitle?: string;
  faqs?: FAQItem[];
  featureListTitle?: string;
  featureList?: { icon: string; title: string; description: string }[];
  finalCTATitle?: string;
  finalCTADescription?: string;
  finalCTAButtonLabel?: string;
  finalCTAButtonHref?: string;
}

export function FeatureLandingPage({
  badge,
  badgeEmoji = "✨",
  title,
  titleAccent,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  howItWorksTitle = "Comment ça marche",
  howItWorksSteps = [],
  testimonialsTitle = "Ils nous font confiance",
  testimonials = [],
  faqTitle = "Questions fréquentes",
  faqs = [],
  featureListTitle = "Fonctionnalités incluses",
  featureList = [],
  finalCTATitle = "Prêt à simplifier votre gestion locative ?",
  finalCTADescription = "Rejoignez les propriétaires qui gèrent leurs locations plus sereinement avec RentReady. Essai gratuit 14 jours.",
  finalCTAButtonLabel = "Commencer l'essai gratuit",
  finalCTAButtonHref = "/register",
}: FeatureLandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {badge && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            {badgeEmoji && <span>{badgeEmoji}</span>}
            {badge}
          </div>
        )}

        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl leading-tight">
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-blue-600">{titleAccent}</span>
            </>
          )}
        </h1>

        {subtitle && (
          <p className="mt-6 text-xl text-stone-600">{subtitle}</p>
        )}

        {description && (
          <p className="mt-4 max-w-2xl text-lg text-stone-600 leading-relaxed">
            {description}
          </p>
        )}

        {(primaryCTA || secondaryCTA) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {primaryCTA && (
              <Link
                href={primaryCTA.href}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                {primaryCTA.label}
                <ArrowRight className="size-4" />
              </Link>
            )}
            {secondaryCTA && (
              <Link
                href={secondaryCTA.href}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm border border-blue-200 transition-colors hover:bg-blue-50"
              >
                {secondaryCTA.label}
              </Link>
            )}
          </div>
        )}
      </section>

      {/* ── Feature list ── */}
      {featureList.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">{featureListTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureList.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-stone-200/50 bg-white/60 p-6 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      {howItWorksSteps.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            {howItWorksTitle}
          </h2>
          <div className="space-y-6">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">
                    {step.step}. {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Social proof / Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            {testimonialsTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-stone-200/50 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex gap-0.5 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-lg">★</span>
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-stone-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t.name}</p>
                  <p className="text-xs text-stone-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ accordion ── */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            {faqTitle}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-stone-200 bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left text-sm font-medium text-stone-900"
                >
                  {faq.question}
                  <ChevronDown
                    className={`size-4 text-stone-400 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm leading-relaxed text-stone-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">{finalCTATitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300 leading-relaxed">
            {finalCTADescription}
          </p>
          <div className="mt-8">
            <Link
              href={finalCTAButtonHref}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow transition-colors hover:bg-blue-700"
            >
              {finalCTAButtonLabel}
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}