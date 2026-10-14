import type { Metadata } from "next";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import React from "react";

import { TrustLogos } from "@/components/seo/TrustLogos";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { baseMetadata } from "@/lib/seo/metadata";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { SocialProof } from "@/components/landing/social-proof";

// Dynamic import: FinalCta uses framer-motion (heavy, below-fold)
// → code-split so it doesn't block initial JS bundle or INP
const FinalCta = dynamicImport(
  () => import("@/components/landing/final-cta").then((mod) => mod.FinalCta),
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

// Dynamic import: interactive pricing (uses client state — framer-motion)
const PricingSectionWrapper = dynamicImport(
  () =>
    import("@/components/landing/pricing-section-wrapper").then(
      (mod) => mod.PricingSectionWrapper
    ),
  {
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="skeleton rounded-[2rem] border border-stone-200/30 bg-white/40"
            style={{ height: 520 }}
          />
        ))}
      </div>
    ),
  }
);

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Tarifs Lokna 2026 — à partir de 9 €/mois, essai gratuit sans engagement",
    description:
      "Plans dès 9 €/mois — Starter (3 biens), Pro (10 biens), Agency. Quittances conformes, suivi des loyers, révision IRL. Essai gratuit sans engagement.",
    url: "/pricing",
    ogType: "pricing",
  });
}

/* ─── JSON-LD: BreadcrumbList + Organization + WebPage + SoftwareApplication + FAQPage ─── */
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildWebPageSchema,
  buildSoftwareAppSchema,
  buildFAQPageSchema,
  buildBreadcrumbSchema,
  buildGraphSchema,
} from "@/lib/seo/structured-data";
import { SITE_URL, formatEntryPrice, formatProPrice } from "@/data/entity";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

const pricingFaqs = [
  {
    question: "Combien coûte Lokna et y a-t-il un engagement ?",
    answer: "Lokna propose 3 plans : Starter à 9 €/mois, Pro à 15 €/mois, et Agency sur devis. Sans engagement sur les plans mensuels. Le tarif annuel offre 2 mois gratuits (89 €/an Starter, 149 €/an Pro). Essai gratuit sans carte bancaire.",
  },
  {
    question: "Que se passe-t-il si je dépasse la limite de biens ?",
    answer: "Le plan Starter couvre jusqu'à 3 biens, le plan Pro jusqu'à 10 biens. Si vous dépassez cette limite, vous pouvez migrer vers le plan Agency (sur devis) ou contacter notre équipe pour un abonnement adapté à votre portfolio. Aucun frais caché.",
  },
  {
    question: "Puis-je résilier à tout moment ?",
    answer: "Oui, vous pouvez résilier en un clic depuis votre espace, sans préavis ni pénalité. Vous conservez l'accès à vos données pendant 30 jours après la résiliation.",
  },
  {
    question: "Le prix inclut-il les mises à jour légales ?",
    answer: "Oui. Les mises à jour du logiciel, dont celles liées aux évolutions légales qu'il prend en charge (indices IRL publiés par l'INSEE, contenu des quittances et des reçus), sont incluses dans votre abonnement, sans frais supplémentaires.",
  },
  {
    question: "Y a-t-il des frais d'installation ou de mise en service ?",
    answer: "Non, il n'y a aucun frais d'installation. Vous créez votre compte, ajoutez votre logement, votre locataire et le bail, et votre espace de gestion est opérationnel en quelques minutes. Aucune connexion bancaire n'est nécessaire.",
  },
  {
    question: "Quelle est la différence entre Starter et Pro ?",
    answer: "Les deux formules donnent accès aux fonctionnalités de gestion locative actuellement disponibles dans Lokna. La principale différence concerne le nombre de logements : Starter permet de gérer jusqu'à 3 logements, contre 10 avec Pro. Vous pouvez choisir la formule adaptée à votre patrimoine locatif.",
  },
  {
    question: "À qui s'adresse le plan Agency ?",
    answer: "Aux propriétaires qui gèrent plus de 10 logements. Il donne accès aux mêmes fonctionnalités que Starter et Pro ; son tarif est établi sur devis selon le nombre de logements. Contactez-nous pour en discuter.",
  },
];

function PricingJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: SITE_URL },
      { name: "Tarifs", url: `${SITE_URL}/pricing` },
    ]),
    buildOrganizationSchema({ "@id": `${SITE_URL}/#organization` }),
    buildWebPageSchema({
      name: "Tarifs Lokna",
      description:
        "À partir de 9 €/mois. Gestion locative en ligne : quittances conformes, suivi des loyers et des retards, révision IRL.",
      url: `${SITE_URL}/pricing`,
    }),
    buildSoftwareAppSchema({
      name: "Lokna",
      description:
        "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France (1 à 10+ biens).",
      applicationCategory: "BusinessApplication",
      offers: [
        {
          name: "Essai gratuit",
          description: "Essai gratuit sans carte bancaire",
          price: "0.00",
          priceCurrency: "EUR",
        },
        {
          name: "Starter mensuel",
          description: "9 €/mois — jusqu'à 3 biens, gestion locative complète",
          price: "9.00",
          priceCurrency: "EUR",
        },
        {
          name: "Starter annuel",
          description: "89 €/an — 2 mois offerts",
          price: "89.00",
          priceCurrency: "EUR",
        },
        {
          name: "Pro mensuel",
          description:
            "15 €/mois — jusqu'à 10 biens, mêmes fonctionnalités que Starter",
          price: "15.00",
          priceCurrency: "EUR",
        },
        {
          name: "Pro annuel",
          description: "149 €/an — 2 mois offerts",
          price: "149.00",
          priceCurrency: "EUR",
        },
      ],
      features: [
        "Quittances de loyer conformes à la loi du 6 juillet 1989",
        "Reçu en cas de paiement partiel",
        "Suivi des loyers attendus, payés et du reste dû",
        "Révision IRL calculée avec l'indice INSEE",
        "Dépenses par logement",
        "Export CSV des paiements",
      ],
    }),
    buildFAQPageSchema(pricingFaqs)
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Starter, Pro and Agency share every feature; only the number of properties
// differs. The previous table showed OCR, Factur-X, accounting export and
// automatic reminders as Pro-only: nothing in the product is gated by plan, OCR
// has no AI provider configured in production, and reminders are sent by hand.
// A feature appears here once it is available to the landlord, not before.
const comparisonData = [
  {
    feature: "Nombre de biens",
    starter: "Jusqu'à 3",
    pro: "Jusqu'à 10",
    agency: "Plus de 10",
  },
  {
    feature: "Quittances et reçus conformes loi 1989",
    starter: "✅ Inclus",
    pro: "✅ Inclus",
    agency: "✅ Inclus",
  },
  {
    feature: "Suivi des loyers et du reste dû",
    starter: "✅ Inclus",
    pro: "✅ Inclus",
    agency: "✅ Inclus",
  },
  {
    feature: "Révision IRL (indice INSEE)",
    starter: "✅ Inclus",
    pro: "✅ Inclus",
    agency: "✅ Inclus",
  },
  {
    feature: "Dépenses par logement",
    starter: "✅ Incluses",
    pro: "✅ Incluses",
    agency: "✅ Incluses",
  },
  {
    feature: "Export CSV des paiements",
    starter: "✅ Inclus",
    pro: "✅ Inclus",
    agency: "✅ Inclus",
  },
  {
    feature: "Tarif",
    starter: formatEntryPrice(),
    pro: formatProPrice(),
    agency: "Sur devis",
  },
];

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <PricingJsonLd />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl text-balance">
            Un tarif transparent.
            <br />
            Zéro surprise.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Tout ce dont vous avez besoin pour gérer vos locations, au prix
            d&apos;un café par jour. Essai gratuit, sans engagement.
          </p>

          {/* E-E-A-T: content review badge */}
          <div className="mt-6">
            <ContentReviewBadge updatedAt="2026-04-25" category="article" />
          </div>
        </header>

        {/* ── Social proof stats ──────────────────────────────── */}
        <div className="mb-12">
          <SocialProof />
        </div>

        {/* ── Trust signals ────────────────────────────────────── */}
        <div className="mb-16">
          <TrustLogos variant="full" showMedia={false} />
        </div>

        {/* ── Pricing section with toggle ─────────────────────── */}
        <section aria-label="Plans tarifaires">
          <PricingSectionWrapper />
        </section>

        {/* ── Comparison table ────────────────────────────────── */}
        <section className="mt-20" aria-label="Comparaison des plans">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            Tous les plans en un coup d&apos;œil
          </h2>
          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-stone-900">
                    Fonctionnalité
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-blue-600">
                    Starter
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-emerald-700">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-amber-700">
                    Agency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="hover:bg-stone-50/50">
                    <td className="px-6 py-4 text-stone-700">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-blue-600">
                      {row.starter}
                    </td>
                    <td className="px-6 py-4 text-center text-emerald-700">
                      {row.pro}
                    </td>
                    <td className="px-6 py-4 text-center text-amber-700">
                      {row.agency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center text-sm text-stone-600">
            Vous hésitez entre un logiciel, un tableur et une agence ?{" "}
            <Link
              href="/comparatif/logiciel-gestion-locative"
              className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800"
            >
              Comparer les modes de gestion locative
            </Link>{" "}
            ou{" "}
            <Link
              href="/comparatif"
              className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800"
            >
              voir tous nos comparatifs
            </Link>
            .
          </p>
        </section>

        {/* ── Testimonials ─────────────────────────────────────── */}
        <section className="mt-20" aria-label="Témoignages clients">
          <TestimonialsSection />
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section className="mt-20" aria-label="Questions fréquentes">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            Questions fréquentes
          </h2>
          <dl className="mx-auto max-w-2xl space-y-6">
            {pricingFaqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-base font-semibold text-stone-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-stone-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>

      <FinalCta />
    </div>
  );
}
