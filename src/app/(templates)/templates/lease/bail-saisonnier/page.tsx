import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Bail Saisonnier Gratuit 2026 — Location de Vacances Conforme",
  description:
    "Modèle de bail saisonnier gratuit pour location de vacances. Meublé de tourisme classé obligatoire. Téléchargez en PDF. Mise à jour 2026.",
  keywords: [
    "modele bail saisonnier",
    "location vacances",
    "bail meublé tourisme",
    "location courte durée",
    "meublé tourisme classé",
    "bail saisonnier gratuit",
  ],
  openGraph: {
    title: "Modèle Bail Saisonnier 2026 — RentReady",
    description:
      "Bail saisonnier pour location de vacances. Gratuit, conforme, téléchargeable en PDF. Mise à jour 2026.",
    type: "website",
    url: "https://www.rentready.fr/templates/lease/bail-saisonnier",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/lease/bail-saisonnier",
  },
};

const features = [
  {
    title: "Meublé de tourisme classé",
    description:
      "Le logement doit être classé en meublé de tourisme (1 à 5 étoiles) pour une location saisonnière légale.",
    icon: "🏠",
  },
  {
    title: "Durée limitée",
    description:
      "Pas de durée minimale légale, mais en pratique courte durée (une à plusieurs semaines). Tacite reconduction interdite.",
    icon: "📅",
  },
  {
    title: "Loyer libre",
    description:
      "Pas d'encadrement des loyers pour les locations saisonnières. Le propriétaire fixe librement le tarif.",
    icon: "💶",
  },
  {
    title: "Pas de droit au bail",
    description:
      "Le locataire saisonnier n'acquiert aucun droit au maintien dans les lieux. Vacances terminées = départ obligatoire.",
    icon: "🚫",
  },
  {
    title: "Obligations fiscales",
    description:
      "Les revenus de locations saisonnières sont imposés en BIC. Déclaration auprès des Impôts obligatoire.",
    icon: "📋",
  },
  {
    title: "Résidence principale du locataire",
    description:
      "Le locataire doit avoir une résidence principale elsewhere. La location saisonnière ne peut pas être sa résidence principale.",
    icon: "🏖️",
  },
];

const etoiles = [
  { etoile: "⭐", titre: "1 étoile", desc: "Équipement de base" },
  { etoile: "⭐⭐", titre: "2 étoiles", desc: "Équipement confort" },
  { etoile: "⭐⭐⭐", titre: "3 étoiles", desc: "Bon niveau d'équipement" },
  { etoile: "⭐⭐⭐⭐", titre: "4 étoiles", desc: "Haut standing" },
  { etoile: "⭐⭐⭐⭐⭐", titre: "5 étoiles", desc: "Luxe exceptionnel" },
];

const faqData = [
  {
    question: "Qu'est-ce qu'un bail saisonnier ?",
    answer:
      "Le bail saisonnier est un contrat de location pour une durée déterminée (saison), utilisé principalement pour les locations de vacances. Il concerne des biens meublés proposés à une clientèle temporaire qui n'y élit pas domicile. Le locataire doit avoir une résidence principale somewhere else. La durée est limitée à la saison (en pratique : quelques jours à quelques mois).",
  },
  {
    question: "Le logement doit-il être classé en meublé de tourisme ?",
    answer:
      "Oui, toute location saisonnière doit être classée en meublé de tourisme auprès de la commune (obligatoire depuis la loi ELAN de 2018). Le classement va de 1 à 5 étoiles et détermine le standing du bien. Ce classement doit être affiché dans l'annonce et sur le bail. Sans classement, la location est considérée comme une location de longue durée et doit respecter la loi de 1989.",
  },
  {
    question: "Peut-on résilier un bail saisonnier avant son terme ?",
    answer:
      "En principe, le bail saisonnier est conclu pour une durée ferme et ne peut pas être rompu anticipativement sauf clause contraire ou accord mutuel. Le non-paiement du loyer ou le non-respect des conditions d'utilisation peuvent justifier une résiliation. En cas de force majeure (catastrophe naturelle, etc.), chaque situation est analysée au cas par cas.",
  },
  {
    question: "Quelles sont les obligations déclaratives du propriétaire ?",
    answer:
      "Le propriétaire doit déclarer sa location saisonnière auprès de la commune (numéro d'enregistrement obligatoire sur les annonces). En zone tendue, une autorisation préalable de changement d'usage peut être requise. Les revenus doivent être déclarés aux impôts (BIC). Si le logement est en copropriété, l'autorisation du syndic peut être nécessaire.",
  },
  {
    question: "Quelle différence entre bail saisonnier et location courte durée type Airbnb ?",
    answer:
      "Techniquement, un bail saisonnier est un contrat écrit entre propriétaire et locataire. Une location courte durée via plateforme (Airbnb, etc.) peut utiliser un bail saisonnier ou être gérée différemment selon la durée. La durée est le critère clé : moins de 90 jours = location de tourisme (réglementée), au-delà = potentiellement un bail classique.",
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

function BailSaisonnierJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      orgSchema,
      webSiteSchema,
      {
        "@type": "WebPage",
        name: "Modèle Bail Saisonnier 2026 — RentReady",
        description:
          "Modèle de bail saisonnier gratuit pour location de vacances. Meublé de tourisme classé.",
        url: "https://www.rentready.fr/templates/lease/bail-saisonnier",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Saisonnier",
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

export default function BailSaisonnierPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailSaisonnierJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-1.5 text-sm font-medium text-cyan-700">
            🌊 Bail de location saisonnière
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Saisonnier
            <br />
            <span className="text-cyan-600">Location de Vacances Conforme 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Bail saisonnier pour meublé de tourisme classé. Téléchargez en PDF,
            personnalisez selon votre bien et votre saison.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
            >
              Télécharger le modèle PDF
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-cyan-700 shadow-sm border border-cyan-200 transition-colors hover:bg-cyan-50"
            >
              Générer avec RentReady →
            </Link>
          </div>
        </header>

        {/* Features */}
        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Caractéristiques du bail saisonnier
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

        {/* Classification */}
        <section className="mb-20 rounded-2xl bg-cyan-50 p-8 sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Classification des meublés de tourisme
          </h2>
          <p className="mb-6 text-stone-700">
            Pour être proposé en location saisonnière, le logement doit être
            classé en meublé de tourisme. Le classement est obligatoire (loi
            ELAN 2018) et doit être demandé auprès de la préfecture ou en ligne.
          </p>
          <div className="grid gap-4 sm:grid-cols-5">
            {etoiles.map((e) => (
              <div
                key={e.titre}
                className="rounded-xl border border-cyan-200 bg-white p-4 text-center"
              >
                <div className="mb-2 text-2xl">{e.etoile}</div>
                <div className="text-sm font-semibold text-stone-900">{e.titre}</div>
                <div className="mt-1 text-xs text-stone-600">{e.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Step by step */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Comment mettre en location saisonnière ?
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Faire classer votre bien",
                desc: "Demandez un classement en meublé de tourisme auprès d'un organisme agréé (Atout France ou organisme certificateur). Le classement est valable 5 ans.",
              },
              {
                step: "2",
                title: "Déclarer auprès de la commune",
                desc: "Obtenez un numéro d'enregistrement auprès de la mairie de votre commune. Ce numéro doit apparaître sur toutes vos annonces.",
              },
              {
                step: "3",
                title: "Rédiger le bail saisonnier",
                desc: "Utilisez notre modèle gratuit. Mentionnez les dates de la saison, le montant du loyer, les charges, et les conditions d'annulation.",
              },
              {
                step: "4",
                title: "Gérer les paiements et la remise des clés",
                desc: "Mettez en place un système de paiement sécurisé. Prévoyez un état des lieux d'entrée et de sortie pour le bien meublé.",
              },
              {
                step: "5",
                title: "Déclarer vos revenus",
                desc: "Les revenus de location saisonnière sont imposés en Bénéfices Industriels et Commerciaux (BIC). Déclarez-les aux Impôts chaque année.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
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

        {/* Legal */}
        <section className="mb-20 rounded-2xl bg-amber-50 border border-amber-200 p-8">
          <h2 className="mb-3 text-lg font-bold text-stone-900">
            ⚠️ Réglementation en zone tendue
          </h2>
          <p className="text-sm text-stone-700">
            Dans certaines communes en zone tendue (Paris, Lyon, Bordeaux, etc.),
            la location saisonnière est soumise à autorisation préalable de changement
            d&apos;usage (décret en Conseil d&apos;État). Le propriétaire doit compenser
            (créer un logement équivalent, demander une autorisation spécifique) ou
            respecter un quota de nuits de location (120 nuits/an maximum sans
            compensation). Vérifiez la réglementation auprès de votre mairie avant
            de mettre votre bien en location.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Louez votre bien en saison en toute sérénité
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Gérez vos locations saisonnières, les états des lieux et la
            facturation en un seul outil.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-cyan-700"
            >
              Essai gratuit 14 jours
            </Link>
            <Link
              href="/templates/lease"
              className="inline-block rounded-lg border border-stone-600 px-6 py-3 font-medium text-stone-300 transition-colors hover:bg-stone-800"
            >
              ← Tous les baux
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
              { href: "/templates/bail-meuble", label: "Modèle de bail meublé →" },
              { href: "/templates/etat-des-lieux", label: "Modèle d'état des lieux →" },
              { href: "/glossaire-immobilier", label: "Glossaire de la location →" },
              { href: "/templates", label: "Tous nos modèles de documents →" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-cyan-600 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/lease/bail-parking" className="text-cyan-600 hover:underline">
            Bail parking →
          </Link>
          <Link href="/templates/lease/bail-precaire" className="text-cyan-600 hover:underline">
            Bail précaire →
          </Link>
          <Link href="/templates/lease/bail-etudiant" className="text-cyan-600 hover:underline">
            Bail étudiant →
          </Link>
          <Link href="/templates/lease" className="text-blue-600 hover:underline">
            ← Tous les baux de location
          </Link>
        </nav>
      </article>
    </div>
  );
}
