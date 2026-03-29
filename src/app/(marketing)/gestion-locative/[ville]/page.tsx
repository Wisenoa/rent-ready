import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import cities from "@/data/cities.json";

/* ---------- Types ---------- */

type City = (typeof cities)[number];

type Props = {
  params: Promise<{ ville: string }>;
};

/* ---------- Static generation ---------- */

export function generateStaticParams() {
  return cities.map((city) => ({ ville: city.slug }));
}

/* ---------- Metadata ---------- */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) return {};

  const title = `Gestion Locative ${city.name} — Logiciel pour Propriétaires | RentReady`;
  const description = `Simplifiez la gestion de vos biens locatifs à ${city.name} (${city.department}). Quittances automatiques, suivi des loyers, conformité légale 2026. Essai gratuit 14 jours.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/gestion-locative/${city.slug}`,
      siteName: "RentReady",
    },
    alternates: { canonical: `/gestion-locative/${city.slug}` },
  };
}

/* ---------- Helpers ---------- */

function formatPopulation(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function getFeatures(city: City) {
  return [
    {
      icon: "📄",
      title: "Quittances automatiques",
      description: `Générez et envoyez les quittances de loyer à vos locataires à ${city.name} en un clic. Conformes à la législation française.`,
    },
    {
      icon: "💶",
      title: "Suivi des loyers",
      description: `Suivez les paiements, détectez les retards et relancez automatiquement vos locataires dans le ${city.department}.`,
    },
    {
      icon: "🔍",
      title: "OCR factures",
      description:
        "Scannez vos factures de charges et travaux. L'intelligence artificielle extrait les données pour vous.",
    },
    {
      icon: "📊",
      title: "Conformité Factur-X",
      description:
        "Générez des factures électroniques conformes à la norme Factur-X, obligatoire dès 2026 pour les professionnels.",
    },
    {
      icon: "🏠",
      title: "Portail locataire",
      description: `Offrez à vos locataires à ${city.name} un espace personnel pour consulter leurs documents et signaler des incidents.`,
    },
    {
      icon: "📈",
      title: "Analyse fiscale",
      description:
        "Visualisez vos revenus fonciers, charges déductibles et optimisez votre déclaration d'impôts en toute simplicité.",
    },
  ];
}

function getFaqs(city: City) {
  return [
    {
      question: `Pourquoi utiliser un logiciel de gestion locative à ${city.name} ?`,
      answer: `Gérer des biens locatifs à ${city.name} implique de respecter la législation française (quittances, diagnostics, encadrement des loyers dans certaines zones). RentReady automatise ces tâches pour vous faire gagner du temps et rester en conformité.`,
    },
    {
      question: `RentReady est-il adapté au marché locatif de ${city.name} ?`,
      answer: `Oui. RentReady est conçu pour les propriétaires bailleurs en France, que vous possédiez un studio ou plusieurs immeubles à ${city.name} (${city.region}). Les fonctionnalités s'adaptent à tous les types de biens.`,
    },
    {
      question: "Combien coûte RentReady ?",
      answer:
        "RentReady propose un essai gratuit de 14 jours, puis un abonnement à partir de 15 € par mois. Aucun engagement, annulable à tout moment.",
    },
    {
      question: `Comment démarrer la gestion locative de mes biens à ${city.name} ?`,
      answer: `Créez votre compte gratuitement, ajoutez vos biens situés à ${city.name} et vos locataires, et RentReady s'occupe du reste : quittances, suivi des paiements, relances et documents fiscaux.`,
    },
  ];
}

/* ---------- Structured data ---------- */

function SoftwareSchema({ city }: { city: City }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RentReady",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "15.00",
      priceCurrency: "EUR",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: city.region,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function FaqSchema({ city }: { city: City }) {
  const faqs = getFaqs(city);
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ---------- Page ---------- */

export default async function GestionLocativeVille({ params }: Props) {
  const { ville } = await params;
  const city = cities.find((c) => c.slug === ville);
  if (!city) notFound();

  const features = getFeatures(city);
  const faqs = getFaqs(city);

  return (
    <>
      <SoftwareSchema city={city} />
      <FaqSchema city={city} />

      <article>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-[#f8f7f4] to-white px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
              Gestion locative
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Gestion locative à&nbsp;{city.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600">
              Simplifiez la gestion de vos biens locatifs à {city.name} ({city.region}).
              Quittances automatiques, suivi des loyers et outils intelligents pour les
              propriétaires bailleurs.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
              >
                Essai gratuit 14&nbsp;jours
              </Link>
              <Link
                href="/gestion-locative"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-700"
              >
                Voir toutes les villes&nbsp;→
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Tout ce qu'il vous faut pour gérer vos locations à&nbsp;{city.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-stone-200/80 bg-[#f8f7f4] p-6 shadow-sm"
                >
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {f.icon}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-stone-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Local context ── */}
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-stone-900 sm:text-3xl">
              Le marché locatif à&nbsp;{city.name}
            </h2>
            <div className="space-y-4 text-stone-700 leading-relaxed">
              <p>
                Avec une population de{" "}
                <strong>{formatPopulation(city.population)}&nbsp;habitants</strong>,{" "}
                {city.name} est l'une des villes les plus dynamiques de la région{" "}
                <strong>{city.region}</strong> (département&nbsp;{city.department}). Le marché
                locatif y est actif, porté par une demande constante de logements.
              </p>
              <p>
                Que vous soyez propriétaire d'un appartement en centre-ville ou d'une maison
                en périphérie de {city.name}, une gestion locative rigoureuse est essentielle.
                RentReady vous aide à automatiser les quittances, suivre les paiements et
                rester conforme à la législation française en vigueur.
              </p>
              <p>
                La réglementation évolue rapidement — obligation de facturation électronique
                Factur-X dès 2026, encadrement des loyers dans certaines zones. RentReady
                intègre ces évolutions pour que vous n'ayez pas à vous en soucier.
              </p>
            </div>

            {/* Key stats */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Population", value: formatPopulation(city.population) },
                { label: "Département", value: city.department },
                { label: "Région", value: city.region },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-stone-200/80 bg-white p-5 text-center shadow-sm"
                >
                  <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              Questions fréquentes
            </h2>
            <div className="divide-y divide-stone-200">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-stone-900">
                    {faq.question}
                    <span className="ml-4 shrink-0 text-stone-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-stone-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#f8f7f4] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Commencez votre essai gratuit
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-stone-300">
              Rejoignez les propriétaires qui simplifient leur gestion locative à{" "}
              {city.name} avec RentReady.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Créer mon compte gratuitement
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
