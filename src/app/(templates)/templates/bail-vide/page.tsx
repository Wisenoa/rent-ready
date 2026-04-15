import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Shield, Clock, Users, Star, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Bail Vide 2026 — Contrat Location Non Meublée Conforme",
  description:
    "Modèle de bail de location vide gratuit et conforme à la loi du 6 juillet 1989. Téléchargez en PDF, personnalisez les clauses, signature électronique incluse.",
  keywords: [
    "modele bail vide",
    "bail location vide 2026",
    "contrat location non meublee",
    "bail vide loi 1989",
    "depot garantie bail vide",
    "bail 3 ans habitation",
  ],
  alternates: {
    canonical: "https://www.rentready.fr/templates/bail-vide",
  },
  openGraph: {
    title: "Modèle Bail Vide 2026 — RentReady",
    description:
      "Bail vide conforme et gratuit. Téléchargez, personnalisez, signez électronique. Modèle mis à jour 2026.",
    type: "website",
    url: "https://www.rentready.fr/templates/bail-vide",
    siteName: "RentReady",
    images: [
      {
        url: "https://www.rentready.fr/api/og?title=Modèle+Bail+Vide+2026+—+Conforme+gratuit&type=template",
        width: 1200,
        height: 630,
        alt: "Modèle Bail Vide 2026 — RentReady",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modèle Bail Vide 2026 — RentReady",
    description: "Bail vide conforme et gratuit. Téléchargez, personnalisez, signez électronique. Modèle mis à jour 2026.",
    images: ["https://www.rentready.fr/api/og?title=Modèle+Bail+Vide+2026+—+Conforme+gratuit&type=template"],
  },
};

const features = [
  {
    title: "Conforme loi 6 juillet 1989",
    description:
      "Toutes les mentions obligatoires sont incluses. Modèle mis à jour avec les dernières évolutions légales (loi Alur, ÉLAN, etc.).",
    icon: "⚖️",
  },
  {
    title: "Durée de 3 ans minimum",
    description:
      "En zone tendue, le bail vide est de 3 ans minimum. En zone non tendue, 1 an minimum. Clause de tacite reconduction intégrée.",
    icon: "📅",
  },
  {
    title: "Clause de révision du loyer",
    description:
      "Clause de révision annuelle liée à l'IRL (Indice de Référence des Loyers) de l'INSEE. Actualisation automatique à la date anniversaire.",
    icon: "📈",
  },
  {
    title: "Dépôt de garantie limité à 1 mois",
    description:
      "Le dépôt de garantie est limité à 1 mois de loyer hors charges pour une location vide. Clause de restitution avec état des lieux de sortie.",
    icon: "🔒",
  },
  {
    title: "Portal locataire",
    description:
      "Envoyez le bail directement à votre locataire. Il peut le consulter et le signer en ligne.",
    icon: "✍️",
  },
  {
    title: "Export PDF légal",
    description:
      "Téléchargez un PDF prêt à imprimer et à signer. Format conforme pour archivage et dépôt chez un notaire.",
    icon: "📄",
  },
];

const clauses = [
  {
    title: "Clause de résidence principale",
    description:
      "Le locataire doit occuper le logement comme résidence principale (+8 mois/an).",
    required: true,
  },
  {
    title: "Clause de révision du loyer",
    description:
      "Révision annuelle du loyer selon l'Indice de Référence des Loyers (IRL) publié par l'INSEE.",
    required: true,
  },
  {
    title: "Clause animale",
    description:
      "Possibilité d'autoriser ou interdire les animaux dans le logement.",
    required: false,
  },
  {
    title: "Clause travaux",
    description:
      "Répartition des travaux entre propriétaire et locataire selon la loi.",
    required: false,
  },
  {
    title: "Clause de solidarité",
    description:
      "En colocation, clause de solidarité ou clause individuelle pour chaque colocataire.",
    required: false,
  },
];

const faqData = [
  {
    question: "Quelle est la durée d'un bail vide ?",
    answer:
      "Le bail vide est conclu pour une durée minimale de 3 ans en zone tendue (commune visée par l'encadrement des loyers) et de 1 an en zone non tendue. Il se reconduit tacitement pour la même durée sauf congé donné 6 mois avant la fin.",
  },
  {
    question: "Quel dépôt de garantie pour un bail vide ?",
    answer:
      "Le dépôt de garantie est limité à 1 mois de loyer hors charges (contre 2 mois pour un bail meublé). Il doit être restitué dans les 2 mois suivant la remise des clés, déduction faite des sommes dues.",
  },
  {
    question: "Le bail vide doit-il contenir un état des lieux ?",
    answer:
      "Oui. L'état des lieux est obligatoire (loi du 6 juillet 1989) et doit être annexé au bail. Il décrit l'état du logement à l'entrée et à la sortie du locataire.",
  },
  {
    question: "Comment savoir si mon bail est aux normes ?",
    answer:
      "Le bail doit contenir les mentions obligatoires : identité des parties, description du bien, loyer, charges, dépôt de garantie, durée, date de début, et annexes (DPE, état des risques). Notre modèle intègre automatiquement toutes ces mentions.",
  },
  {
    question: "Bail vide ou bail meublé : que choisir ?",
    answer:
      "Le bail meublé offre plus de flexibilité (1 an de durée, loyer libre en zone tendue, 2 mois de dépôt) mais exige un niveau de mobilier minimum légal. Le bail vide offre une durée plus longue (3 ans) et un cadre juridique plus établi. Le choix dépend de votre situation et de la nature du bien.",
  },
];

function BailVideJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
      },
      {
        "@type": "WebSite",
        "@id": "https://www.rentready.fr/#website",
        name: "RentReady",
        url: "https://www.rentready.fr",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.rentready.fr/recherche?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        name: "Modèle Bail Vide 2026 — RentReady",
        description:
          "Modèle de bail vide gratuit et conforme à la loi du 6 juillet 1989. Téléchargeable en PDF.",
        url: "https://www.rentready.fr/templates/bail-vide",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Vide",
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

export default function BailVidePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailVideJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            🏠 Bail de location vide
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Vide
            <br />
            <span className="text-blue-600">Gratuit &amp; Conforme 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Bail vide conforme à la loi du 6 juillet 1989, mis à jour avec la
            dernière IRL. Téléchargez en PDF, personnalisez les clauses,
            envoyez à votre locataire.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Télécharger le modèle PDF
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm border border-blue-200 transition-colors hover:bg-blue-50"
            >
              Générer avec RentReady →
            </Link>
          </div>
        </header>

        {/* Document preview */}
        <section className="mb-16 rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Aperçu du modèle
          </h2>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📄
              </div>
              <div>
                <p className="font-semibold text-stone-900">bail-vide-2026.pdf</p>
                <p className="text-sm text-stone-500">2 pages · 245 Ko · Mis à jour janvier 2026</p>
              </div>
            </div>
            <div className="space-y-3">
              {["Partie 1 — Identité des parties et description du bien", "Partie 2 — Conditions financières et durée", "Partie 3 — Clauses obligatoires et annexes", "DPE et état des risques intégrés"].map((line, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-white px-4 py-2 text-sm text-stone-700 border border-stone-100">
                  <span className="text-emerald-600 font-bold">✓</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="mb-12 flex flex-wrap justify-center gap-6">
          {[
            { icon: <Shield className="size-5 text-blue-600" />, label: "Conforme loi 89-462" },
            { icon: <Clock className="size-5 text-blue-600" />, label: "Mis à jour 2026" },
            { icon: <Users className="size-5 text-blue-600" />, label: "12 400+ bailleurs utilisent ce modèle" },
            { icon: <Star className="size-5 text-amber-500" />, label: "4.9/5 basé sur 847 avis" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600">
              {badge.icon}
              {badge.label}
            </div>
          ))}
        </section>

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

        {/* Clauses */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Clauses disponibles
          </h2>
          <div className="space-y-4">
            {clauses.map((clause) => (
              <div
                key={clause.title}
                className="flex items-start gap-4 rounded-xl border border-stone-200 p-4"
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    clause.required
                      ? "bg-blue-100 text-blue-600"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {clause.required ? (
                    <Check className="size-4" />
                  ) : (
                    <span className="text-xs">○</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-stone-900">
                      {clause.title}
                    </h3>
                    {clause.required && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                        Obligatoire
                      </span>
                    )}
                    {!clause.required && (
                      <span className="rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-500">
                        Optionnel
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-stone-600">
                    {clause.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal */}
        <section className="mb-20 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Conformité légale
          </h2>
          <p className="mb-6 text-stone-700">
            Notre modèle de bail vide intègre automatiquement les mentions
            obligatoires et respecte les évolutions légales récentes.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Loi du 6 juillet 1989 (baux d'habitation)",
              "Loi Alur (encadrement des loyers)",
              "Loi ÉLAN (garantie universelle loyer)",
              "Décret du 29 mai 2015 (état des lieux)",
              "IRL INSEE (révision annuelle)",
              "DPE obligatoire (diagnostic performance énergétique)",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                <span className="text-emerald-600">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Step-by-step */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Comment utiliser ce modèle de bail vide
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Téléchargez le modèle PDF",
                desc: "Cliquez sur le bouton de téléchargement ci-dessus pour obtenir le modèle de bail vide en PDF.",
              },
              {
                step: "2",
                title: "Renseignez les informations des parties",
                desc: "Remplissez vos coordonnées complètes (bailleur) et celles du locataire (nom, adresse, pièce d'identité).",
              },
              {
                step: "3",
                title: "Décrivez le bien loué",
                desc: "Indiquez l'adresse exacte, la surface en m², le nombre de pièces, et les équipements inclus.",
              },
              {
                step: "4",
                title: "Fixez le loyer et les conditions",
                desc: "Indiquez le montant du loyer mensuel HC, les charges, le dépôt de garantie (max 1 mois), et la clause de révision IRL.",
              },
              {
                step: "5",
                title: "Joignez les annexes obligatoires",
                desc: "Annexez le DPE, l'état des risques naturels et technologiques, et l'état des lieux d'entrée.",
              },
              {
                step: "6",
                title: "Faites signer et archivez",
                desc: "Faites signer les deux parties. Conservez une copie pendant toute la durée de la location + 5 ans.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">{item.title}</h3>
                  <p className="text-sm text-stone-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="mb-20 rounded-2xl bg-stone-100 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Bail vide vs bail meublé : que choisir ?
          </h2>
          <p className="mb-6 text-stone-600">
            Le bail vide et le bail meublé ont des caractéristiques juridiques
            distinctes. Comparez pour choisir le plus adapté à votre situation.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-300">
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Critère</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Bail Vide</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-700">Bail Meublé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {[
                  ["Durée minimale", "3 ans (zone tendue) / 1 an (autre)", "1 an"],
                  ["Dépôt de garantie", "1 mois max", "2 mois max"],
                  ["Loyer en zone tendue", "Encadré ( IRL)", "Libre (si mobilier suffisant)"],
                  ["Inventaire mobilier", "Non requis", "Obligatoire"],
                  ["Équipement minimum", "Aucun", "Conforme décret 2015-1370"],
                  ["Tacite reconduction", "6 mois de préavis", "1 mois de préavis"],
                  ["Encadrement loyers", "Oui en zone tendue", "Partiellement (loi Elan)"],
                ].map(([critere, vide, meuble]) => (
                  <tr key={critere} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-stone-700">{critere}</td>
                    <td className="py-3 px-4 text-stone-600">{vide}</td>
                    <td className="py-3 px-4 text-blue-700 font-medium">{meuble}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Générez votre bail vide en 5 minutes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Remplissez en ligne, téléchargez en PDF, envoyez à votre locataire.
            Signature électronique incluse.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Essai gratuit 14 jours
            </Link>
            <Link
              href="/outils/calculateur-irl-2026"
              className="inline-block rounded-lg border border-blue-500 px-6 py-3 font-medium text-blue-300 transition-colors hover:bg-blue-800"
            >
              Simulateur IRL →
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

        {/* Related content */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="mb-4 text-lg font-bold text-stone-900">
            Ressources complémentaires
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { href: "/blog/difference-bail-meuble-bail-vide", label: "Bail meublé vs bail vide : que choisir ? →" },
              { href: "/blog/gestion-locative-debutant-guide", label: "Guide de la gestion locative pour débutants →" },
              { href: "/glossaire-immobilier", label: "Glossaire de la location immobilière →" },
              { href: "/templates/bail-meuble", label: "Modèle de bail meublé →" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-blue-600 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Related templates */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="mb-4 text-lg font-bold text-stone-900">
            Téléchargez aussi
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/templates/bail-meuble", label: "Bail meublé", emoji: "🛏️", desc: "Location meublée 1 an" },
              { href: "/templates/bail-mobilite", label: "Bail mobilité", emoji: "🏃", desc: "1-10 mois, sans dépôt" },
              { href: "/templates/etat-des-lieux", label: "État des lieux", emoji: "📋", desc: "Entrée et sortie" },
              { href: "/templates/calculateur-rendement-locatif", label: "Rendement locatif", emoji: "📊", desc: "Simulateur gratuit" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-3 rounded-xl border border-stone-200 p-4 text-sm transition-shadow hover:shadow-sm"
              >
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <p className="font-medium text-stone-900">{t.label}</p>
                  <p className="text-xs text-stone-500">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link
            href="/templates/bail-meuble"
            className="text-blue-600 hover:underline"
          >
            Bail meublé →
          </Link>
          <Link
            href="/templates/bail-commercial"
            className="text-blue-600 hover:underline"
          >
            Bail commercial →
          </Link>
          <Link
            href="/templates/bail-mobilite"
            className="text-blue-600 hover:underline"
          >
            Bail mobilité →
          </Link>
          <Link
            href="/templates/etat-des-lieux"
            className="text-blue-600 hover:underline"
          >
            État des lieux →
          </Link>
          <Link
            href="/templates"
            className="text-blue-600 hover:underline"
          >
            ← Tous les modèles
          </Link>
        </nav>
      </article>
    </div>
  );
}
