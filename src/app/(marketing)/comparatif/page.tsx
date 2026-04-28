import type { Metadata } from "next";
import Link from "next/link";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Comparatif Gestion Locative 2026 — Logiciels, Outils & Prix | RentReady",
    description:
      "Comparez les meilleurs logiciels de gestion locative, outils et services pour propriétaires bailleurs en 2026. Tarifs, fonctionnalités, avis — faites le bon choix.",
    url: "/comparatif",
    ogType: "website",
  });
}

const comparatifs = [
  {
    title: "Logiciels de gestion locative",
    description:
      "Comparez RentReady, Gestions.net, Apfer, Tecoo et Excel : tarifs, fonctionnalités, conformité loi Alur.",
    href: "/comparatif/logiciel-gestion-locative",
    badge: "Populaire",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "RentReady vs Gerclegeo",
    description:
      "Comparatif détaillé : tarifs, fonctionnalités, conformité loi Alur. Quel logiciel choisir pour votre parc locatif ?",
    href: "/comparatif/rentready-vs-gerclegeo",
    badge: "Nouveau",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    title: "RentReady vs Immotop",
    description:
      "Comparez RentReady et Immotop : détection paiements, quittances automatiques, révision IRL, tarifs réels.",
    href: "/comparatif/rentready-vs-immotop",
    badge: "Nouveau",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    title: "RentReady vs LegalPlace",
    description:
      "Gestion locative vs services juridiques : comment utiliser les deux ensemble pour vos locations.",
    href: "/comparatif/rentready-vs-legalplace",
    badge: "Nouveau",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    title: "Quittance de loyer vs attestation de paiement",
    description:
      "Quelle est la différence légale entre une quittance et une attestation ? La quittance est obligatoire — voici pourquoi.",
    href: "/comparatif/quittance-de-loyer-vs-attestation",
    badge: "Juridique",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    title: "Bail électronique vs bail papier",
    description:
      "Le bail électronique a la même valeur juridique qu'un bail papier depuis 2017. Comparez les avantages pratiques.",
    href: "/comparatif/bail-electronique-vs-papier",
    badge: "Pratique",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    title: "Assurance loyer impayé (GLI)",
    description:
      "GLI, protection juridique ou auto-assurance : comparatif des solutions contre les loyers impayés.",
    href: "/comparatif/assurance-loyer-impaye",
    badge: "Financier",
    badgeColor: "bg-amber-100 text-amber-700",
  },
];

function ComparatifIndexJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Comparatifs", url: "https://www.rentready.fr/comparatif" },
    ]),
    buildItemListSchema({
      name: "Comparatifs pour propriétaires bailleurs",
      description:
        "Guides comparatifs pour analyser les solutions de gestion locative, quittances, assurances et outils.",
      url: "https://www.rentready.fr/comparatif",
      items: comparatifs.map((comp) => ({
        name: comp.title,
        description: comp.description,
        url: `https://www.rentready.fr${comp.href}`,
      })),
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function ComparatifIndex() {
  return (
    <>
      <ComparatifIndexJsonLd />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-12 text-center">
        <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
          Guides comparatifs
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Comparatifs pour propriétaires bailleurs
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
          Analysez les différentes solutions, outils et stratégies de gestion locative
          avant de prendre vos décisions. Des guides objectifs pour investir sereinement.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {comparatifs.map((comp) => (
          <Link
            key={comp.href}
            href={comp.href}
            className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-stone-900 group-hover:text-blue-700">
                {comp.title}
              </h2>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${comp.badgeColor}`}>
                {comp.badge}
              </span>
            </div>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              {comp.description}
            </p>
            <p className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-700">
              Voir le comparatif →
            </p>
          </Link>
        ))}
      </section>

      <div className="mt-12 rounded-xl border border-stone-200 bg-[#f8f7f4] p-6 text-center">
        <p className="text-sm text-stone-600">
          Besoin d'un outil spécifique ?{' '}
          <Link href="/outils" className="font-medium text-blue-600 hover:text-blue-700">
            Explorez nos calculateurs et outils gratuits →
          </Link>
        </p>
      </div>
    </main>
    </>
  );
}
