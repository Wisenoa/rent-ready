import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Acte de Caution Gratuite 2026 — Caution Solidaire PDF",
  description:
    "Modèle d'acte de caution gratuite. Téléchargez en PDF, faites signer par votre garant. Caution solidaire conforme. Mise à jour 2026.",
  keywords: [
    "acte caution",
    "modele caution",
    "caution solidaire",
    "garant location",
    "acte caution gratuite",
    "cautionnement bail",
  ],
  openGraph: {
    title: "Acte de Caution Solidaire 2026 — RentReady",
    description:
      "Acte de caution solidaire gratuit pour location. Téléchargeable en PDF, personnalisable. Mise à jour 2026.",
    type: "website",
    url: "https://www.rentready.fr/templates/lease/acte-caution",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/lease/acte-caution",
  },
};

const features = [
  {
    title: "Caution solidaire",
    description:
      "En cas de défaillance du locataire, le bailleur peut réclamer l'intégralité des sommes dues à la caution.",
    icon: "🤝",
  },
  {
    title: "Clause manuscrite",
    description:
      "La caution solidaire doit signer une clause manuscrite (selon l'article 22-1 de la loi de 1989) pour être valable.",
    icon: "✍️",
  },
  {
    title: "Bail principal lié",
    description:
      "L'acte de caution est inseparable du bail principal. Il ne peut pas être utilisé seul.",
    icon: "🔗",
  },
  {
    title: "Engagement limité dans le temps",
    description:
      "La caution peut être limitée à la durée du bail ou prorogée. Sans précision, elle couvre toute la durée.",
    icon: "⏱️",
  },
  {
    title: "Bénéfice de discussion",
    description:
      "Par défaut, la caution est solidaire (bailleur peut réclamer tout à la caution). La clause 'bénéfice de discussion' est rarissime.",
    icon: "⚖️",
  },
  {
    title: "Mentions obligatoires",
    description:
      "Le nom du débiteur principal, le montant de l'engagement, la durée de l'engagement, et la signature manuscrite.",
    icon: "📋",
  },
];

const mentions = [
  "Nom et adresse de la caution (garant)",
  "Nom et adresse du locataire (débiteur principal)",
  "Référence au bail (date et adresse du bien)",
  "Montant maximal garanti (loyer + charges)",
  "Durée de l'engagement de caution",
  "Signature manuscrite de la caution",
  "Clause de solidarité ou de simples guarantees (selon choix)",
  "Éventuellement : clause de tacite reconduction",
];

const obligations = [
  {
    title: "Pour le locataire",
    items: [
      "Fournir le coordonnées d'une caution solvable",
      "Informer la caution de ses obligations",
      "Joindre l'acte signé au dossier de location",
    ],
  },
  {
    title: "Pour le bailleur",
    items: [
      "Vérifier la solvabilité de la caution",
      "Faire signer l'acte avant ou lors de la signature du bail",
      "Conserver l'acte pendant toute la durée + 5 ans",
      "Informer la caution en cas d'impayés",
    ],
  },
];

const faqData = [
  {
    question: "Qu'est-ce que l'acte de caution pour un bail ?",
    answer:
      "L'acte de caution est un document par lequel une tierce personne (le garant) s'engage à payer les sommes dues par le locataire en cas de défaillance de ce dernier. Il existe deux types : la caution simple (le bailleur doit d'abord poursuivre le locataire) et la caution solidaire (le bailleur peut s'adresser directement à la caution). En pratique, la caution solidaire est la plus courante car plus protectrice pour le bailleur.",
  },
  {
    question: "La clause manuscrite est-elle obligatoire ?",
    answer:
      "Oui. Pour que l'acte de caution soit valable, la caution doit écrire et signer de sa main une clause par laquelle elle reconnait son engagement (article 22-1 de la loi du 6 juillet 1989). Cette clause doit être datée et signée. Une caution tapée ou sans signature manuscrite n'a aucune valeur juridique.",
  },
  {
    question: "La caution peut-elle se désengager ?",
    answer:
      "La caution peut mettre fin à son engagement à chaque échéance du bail en informant le bailleur par lettre recommandée avec accusé de réception au moins un mois avant l'échéance. Si le bail est reconduit tacitement, la caution reste engagée sauf si elle a expressesement limité son engagement à la durée initiale. La caution ne peut pas se retirer en cours de bail sauf accord du bailleur.",
  },
  {
    question: "Que couvre exactement la caution ?",
    answer:
      "La caution couvre les sommes dues par le locataire : loyer principal, charges, dépôt de garantie (en cas de dégradations), et éventuelles indemnités d'occupation en cas de départ irrégulier. Elle ne couvre pas les frais de procédure ou honoraires d'huissier, sauf clause contraire.",
  },
  {
    question: "Peut-on refuser une caution ?",
    answer:
      "Le bailleur est libre d'accepter ou de refuser une caution. En pratique, il exige souvent que les revenus de la caution représentent au minimum 3 à 4 fois le montant du loyer. Certains bailleurs refusent les gens en situation de fragilité (auto-entrepreneurs, CDD) ou les propriétaires en SCI peuvent exiger que la caution soit associée à la société.",
  },
];

function ActeCautionJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Acte de Caution Solidaire 2026 — RentReady",
        description:
          "Modèle d'acte de caution solidaire gratuit pour bail de location. Téléchargeable en PDF.",
        url: "https://www.rent-ready.fr/templates/lease/acte-caution",
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Acte de Caution",
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

export default function ActeCautionPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <ActeCautionJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-medium text-rose-700">
            ✍️ Acte de caution solidaire
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle d&apos;Acte de Caution
            <br />
            <span className="text-rose-600">Gratuit &amp; Conforme 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Acte de caution solidaire pour garant de location. Téléchargez en
            PDF, faites signer manuellement par votre garant.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
            >
              Télécharger le modèle PDF
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-rose-700 shadow-sm border border-rose-200 transition-colors hover:bg-rose-50"
            >
              Générer automatiquement →
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

        {/* Mentions */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Mentions obligatoires de l&apos;acte de caution
          </h2>
          <p className="mb-6 text-stone-600">
            Pour être valable juridiquement, l&apos;acte de caution doit contenir
            un certain nombre de mentions. Notre modèle les intègre automatiquement.
          </p>
          <div className="space-y-3">
            {mentions.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-rose-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800">
              <strong>Important :</strong> La signature de l&apos;acte de caution
              doit être <strong>manuscrite</strong>. Une signature électronique
              n&apos;est pas acceptée pour les baux d&apos;habitation. Imprimez,
              signez à la main, puis.scannez.
            </p>
          </div>
        </section>

        {/* Obligations */}
        <section className="mb-20 rounded-2xl bg-stone-100 p-8 sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Obligations de chaque partie
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {obligations.map((ob) => (
              <div key={ob.title} className="rounded-xl bg-white p-6">
                <h3 className="mb-4 text-base font-semibold text-stone-900">
                  {ob.title}
                </h3>
                <div className="space-y-2">
                  {ob.items.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-3 shrink-0 text-rose-600" />
                      <span className="text-sm text-stone-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Automatisez la gestion des cautions
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Avec RentReady, générez l&apos;acte de caution automatiquement,
            envoyez-la pour signature et alertez le garant en cas d&apos;impayés.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-rose-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-rose-700"
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
              { href: "/templates/bail-vide", label: "Modèle de bail vide →" },
              { href: "/templates/bail-meuble", label: "Modèle de bail meublé →" },
              { href: "/templates/lease/bail-etudiant", label: "Bail étudiant (VISALE) →" },
              { href: "/glossaire-immobilier", label: "Glossaire de la location →" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-rose-600 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/lease/bail-etudiant" className="text-rose-600 hover:underline">
            Bail étudiant →
          </Link>
          <Link href="/templates/lease/bail-parking" className="text-rose-600 hover:underline">
            Bail parking →
          </Link>
          <Link href="/templates/lease/bail-saisonnier" className="text-rose-600 hover:underline">
            Bail saisonnier →
          </Link>
          <Link href="/templates/lease" className="text-blue-600 hover:underline">
            ← Tous les baux de location
          </Link>
        </nav>
      </article>
    </div>
  );
}
