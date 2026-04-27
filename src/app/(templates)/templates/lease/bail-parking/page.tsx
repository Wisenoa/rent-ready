import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buildHreflang } from "@/lib/seo/metadata";


export const metadata: Metadata = {
  title: "Modèle Bail Parking Gratuit 2026 — Garage, Box, Place de Parking",
  description:
    "Modèle de bail de parking, garage ou box gratuit. Téléchargez en PDF, personnalisez la durée et les charges. Conforme au droit français. Mise à jour 2026.",
  keywords: [
    "modele bail parking",
    "bail garage",
    "bail place parking",
    "location parking gratuit",
    "bail box",
    "contrat parking",
  ],
  openGraph: {
    title: "Modèle Bail Parking 2026 — RentReady",
    description:
      "Bail de parking/garage gratuit et conforme. Téléchargeable en PDF, personnalisable. Mise à jour 2026.",
    type: "website",
    url: "https://www.rentready.fr/templates/lease/bail-parking",
    siteName: "RentReady",
  },
  alternates: buildHreflang("/templates/lease/bail-parking"),
};

const features = [
  {
    title: "Tous types de stationnement",
    description:
      "Parking aérien, souterrain, garage box, place de parking ouverte. Adaptable à toute configuration.",
    icon: "🚗",
  },
  {
    title: "Clause de révision",
    description:
      "Clause de révision annuelle du loyer liée à l'IRL ou à un indice convenu entre les parties.",
    icon: "📈",
  },
  {
    title: "Charges récupérables",
    description:
      "Provision pour charges (électricité, nettoyage, maintenance). Modalités de régularisation détaillées.",
    icon: "⚡",
  },
  {
    title: "Durée modulable",
    description:
      "Durée libre (souvent 1 mois tacitement reconductible) ou durée ferme. Clause de résiliation adaptée.",
    icon: "📅",
  },
  {
    title: "Usage exclusif",
    description:
      "Clause d'usage exclusif mentionnant la place réservée au locataire. Interdiction de sous-location.",
    icon: "🔒",
  },
  {
    title: "Export PDF",
    description:
      "Téléchargez un PDF prêt à imprimer et à signer. Format conforme pour archivage.",
    icon: "📄",
  },
];

const obligations = [
  "Nom et adresse du bailleur (propriétaire du bien)",
  "Nom et adresse du locataire",
  "Désignation précise de la place (numéro, étage, bâtiment, adresse)",
  "Nature du stationnement (couvert, découvert, box)",
  "Montant du loyer mensuel et modalités de paiement",
  "Provision pour charges et régularisation annuelle",
  "Date de début et durée du bail",
  "Clause de révision du loyer (si applicable)",
  "Conditions de résiliation par chaque partie",
  "Indexation ou mode de révision",
];

const faqData = [
  {
    question: "Le bail de parking est-il encadré par la loi de 1989 ?",
    answer:
      "Non. La loi du 6 juillet 1989 sur les baux d'habitation ne s'applique pas aux locations de places de parking ou garages à usage exclusif. Ces bails sont dits 'hors champ' de la loi de 1989 et sont donc librement régis par le Code civil. Cela signifie que les conditions (loyer, durée, dépôt de garantie) sont librement fixées entre les parties, sauf dispositions locales (encadrement de certains loyer en zone tendue).",
  },
  {
    question: "Peut-on demander un dépôt de garantie pour un parking ?",
    answer:
      "Oui. Contrairement aux baux d'habitation où le dépôt est limité, le bail de parking n'est pas soumis à ces restrictions légales. Le dépôt de garantie est librement fixé entre les parties (souvent l'équivalent de 1 à 3 mois de loyer). Il doit être restitué à la fin du bail déduction faite des éventuelles dégradations.",
  },
  {
    question: "Quelle durée pour un bail de parking ?",
    answer:
      "La durée est libre. En pratique, les bails de parking sont souvent conclus pour 1 mois avec tacite reconduction, permettant une résiliation à tout moment avec un préavis de 1 à 3 mois. Pour un box fermé ou un garage, une durée annuelle peut être préférable. La tacite reconduction est autorisée sauf stipulation contraire.",
  },
  {
    question: "Le propriétaire peut-il augmenter librement le loyer ?",
    answer:
      "En zone tendue (encadrement des loyers), certaines communes peuvent limiter les loyers des parkings liés à un bien habitable. En zone non tendue, le loyer est librement fixé. Une clause de révision (IRL ou autre indice) est recommandée pour anticiper les évolutions.",
  },
  {
    question: "Le locataire peut-il sous-louer sa place de parking ?",
    answer:
      "Sauf clause contraire dans le bail, le locataire d'une place de parking n'a pas le droit de sous-louer ou de céder son droit d'utilisation à un tiers. Une clause d'usage exclusif est généralement prévue.",
  },
];

const orgSchema = {
  "@type": "Organization",
  "@id": "https://www.rentready.fr/#organization",
  name: "RentReady",
  url: "https://www.rentready.fr",
  logo: "https://www.rentready.fr/logo.png",
  description:
    "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France.",
  sameAs: [
    "https://twitter.com/rentready_fr",
    "https://www.linkedin.com/company/rentready",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "contact@rentready.fr",
    availableLanguage: "French",
  },
};
const webSiteSchema = {
  "@type": "WebSite",
  "@id": "https://www.rentready.fr/#website",
  name: "RentReady",
  url: "https://www.rentready.fr",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.rentready.fr/recherche?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

function BailParkingJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      orgSchema,
      webSiteSchema,
      {
        "@type": "WebPage",
        name: "Modèle Bail Parking 2026 — RentReady",
        description:
          "Modèle de bail de parking/garage gratuit et conforme. Téléchargeable en PDF.",
        url: "https://www.rentready.fr/templates/lease/bail-parking",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Parking",
        mainEntity: faqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function BailParkingPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailParkingJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            🚗 Bail de parking / garage / box
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Parking
            <br />
            <span className="text-emerald-600">Gratuit &amp; Conforme 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Bail de parking, garage ou box conforme au Code civil. Téléchargez
            en PDF, personnalisez les clauses, envoyez à votre locataire.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Télécharger le modèle PDF
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm border border-emerald-200 transition-colors hover:bg-emerald-50"
            >
              Générer avec RentReady →
            </Link>
          </div>
        </header>

        {/* Features */}
        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Ce que contient le modèle
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-stone-200/50 bg-white/60 p-6 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Obligations */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Mentions à inclure dans le bail de parking
          </h2>
          <p className="mb-6 text-stone-600">
            Bien que le bail de parking ne soit pas soumis à la loi de 1989, il
            doit contenir certaines mentions essentielles pour être valable et
            protéger les deux parties.
          </p>
          <div className="space-y-3">
            {obligations.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="mb-20 rounded-2xl bg-stone-100 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Bail parking : location indépendante vs liée au logement
          </h2>
          <p className="mb-6 text-stone-600">
            Louer une place de parking peut se faire de manière indépendante du
            bail d'habitation ou en annexe d'un bail de logement.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-300">
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Critère</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Parking indépendant</th>
                  <th className="text-left py-3 px-4 font-semibold text-emerald-700">Parking lié au logement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {[
                  ["Bail séparé", "Oui, bail autonome", "Non, annexé au bail d'habitation"],
                  ["Durée", "Libre (souvent mensuel)", "Identique au bail principal"],
                  ["Résiliation", "1-3 mois de préavis", "Cote à cote avec le bail principal"],
                  ["Loyer", "Libre (zone non tendue)", "Souvent Inferieur en pratique"],
                  ["Encadrement", "Non en zone non tendue", "Same as bail principal"],
                  ["Dépôt de garantie", "Libre", "Souvent interdit (loi 1989)"],
                ].map(([critere, independant, lie]) => (
                  <tr key={critere} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-stone-700">{critere}</td>
                    <td className="py-3 px-4 text-stone-600">{independant}</td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">{lie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Legal disclaimer */}
        <section className="mb-20 rounded-2xl bg-amber-50 border border-amber-200 p-8">
          <h2 className="mb-3 text-lg font-bold text-stone-900">
            ⚠️ Cadre juridique applicable
          </h2>
          <p className="text-sm text-stone-700">
            Le bail de parking n&apos;est pas soumis à la loi du 6 juillet 1989
            (qui concerne uniquement leslocations à usage d&apos;habitation principale).
            Il relève du Code civil et de la liberté contractuelle. En zone tendue
            (encadrement des loyers), des règles locales peuvent s&apos;appliquer.
            Consultez votre commune ou un professionnel pour vérifier la réglementation
            applicable à votre situation.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Louez votre parking en toute sérénité
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Créez un bail de parking conforme, gérez vos locataires et vos paiements
            en ligne.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-emerald-700"
            >
              Essai gratuit 14 jours
            </Link>
            <Link
              href="/templates/lease"
              className="inline-block rounded-lg border border-stone-600 px-6 py-3 font-medium text-stone-300 transition-colors hover:bg-stone-800"
            >
              ← Modèles de bail
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            Questions fréquentes
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqData.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-stone-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-stone-900 list-none">
                  {item.question}
                  <span className="ml-4 text-stone-400 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-4 text-sm leading-relaxed text-stone-600">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="mb-4 text-lg font-bold text-stone-900">
            Ressources complémentaires
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { href: "/templates/bail-vide", label: "Modèle de bail vide →" },
              { href: "/templates/bail-meuble", label: "Modèle de bail meublé →" },
              { href: "/glossaire-immobilier", label: "Glossaire de l'immobilier →" },
              { href: "/templates", label: "Tous nos modèles de documents →" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-emerald-600 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/lease/bail-saisonnier" className="text-emerald-600 hover:underline">
            Bail saisonnier →
          </Link>
          <Link href="/templates/lease/bail-etudiant" className="text-emerald-600 hover:underline">
            Bail étudiant →
          </Link>
          <Link href="/templates/lease/acte-caution" className="text-emerald-600 hover:underline">
            Acte de caution →
          </Link>
          <Link href="/templates/lease" className="text-blue-600 hover:underline">
            ← Tous les baux de location
          </Link>
        </nav>
      </article>
    </div>
  );
}
