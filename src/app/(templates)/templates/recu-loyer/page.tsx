import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SchemaMarkup } from "@/components/seo/schema-markup";

export const metadata: Metadata = {
  title: "Modèle Quittance de Loyer Gratuit 2026 — Format Légal",
  description:
    "Modèle de quittance de loyer gratuit et conforme. Mentionne le montant, la période, le solde. Générez en PDF en ligne.",
  keywords: [
    "quittance loyer",
    "recu loyer",
    "modele quittance",
    "quittance de loyer gratuite",
  ],
  openGraph: {
    title: "Modèle Quittance de Loyer 2026 — RentReady",
    description:
      "Quittance de loyer gratuite et conforme. PDF généré automatiquement avec montant, période et solde.",
    type: "website",
    url: "https://www.rentready.fr/templates/recu-loyer",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/recu-loyer",
  },
};


/* ─── JSON-LD: FAQPage + BreadcrumbList ─── */
function RecuLoyerJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        name: "Modèle Quittance de Loyer — FAQ",
        description: "Questions fréquentes sur le modèle de quittance de loyer gratuit et conforme de RentReady.",
        url: "https://www.rentready.fr/templates/recu-loyer",
        mainEntity: [
          { "@type": "Question", name: "La quittance de loyer est-elle obligatoire ?", acceptedAnswer: { "@type": "Answer", text: "Non, la quittance n'est pas obligatoire. Cependant, elle l'est sur demande du locataire (loi du 6 juillet 1989)." } },
          { "@type": "Question", name: "Que doit contenir une quittance de loyer ?", acceptedAnswer: { "@type": "Answer", text: "Une quittance doit mentionner: le nom du propriétaire, l'identité du locataire, l'adresse du bien, le montant du loyer, la période concernée, et la signature du propriétaire." } },
          { "@type": "Question", name: "Faut-il payer pour une quittance de loyer ?", acceptedAnswer: { "@type": "Answer", text: "Non. La délivrance d'une quittance de loyer est gratuite. Le propriétaire ne peut pas facturer de frais, même via un logiciel de gestion locative." } },
          { "@type": "Question", name: "Une quittance protège-t-elle le locataire ?", acceptedAnswer: { "@type": "Answer", text: "Oui. La quittance prouve que le loyer a été payé. En cas de litige, elle constitue une preuve de paiement." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/templates" },
          { "@type": "ListItem", position: 3, name: "Quittance de Loyer", item: "https://www.rentready.fr/templates/recu-loyer" },
        ],
      },
    ],
  };
  return <SchemaMarkup data={data} />;
}

const faqData = [
  {
    question: "La quittance de loyer est-elle obligatoire ?",
    answer:
      "Non, la quittance de loyer n'est pas obligatoire pour le propriétaire. Cependant, elle l'est sur demande du locataire (loi du 6 juillet 1989). Le propriétaire doit la délivrer dans les meilleurs délais si le locataire la demande.",
  },
  {
    question: "Que doit contenir une quittance de loyer ?",
    answer:
      "Une quittance doit mentionner: le nom du propriétaire, l'identité du locataire, l'adresse du bien, le montant du loyer, la période concerné, et la signature du propriétaire. Elle peut aussi mentionner le solde de tout compte. Téléchargez notre modèle gratuit pour être sûr de ne rien oublier.",
  },
  {
    question: "Faut-il payer pour une quittance de loyer ?",
    answer:
      "Non. La délivrance d'une quittance de loyer est gratuite. Le propriétaire ne peut pas facturer de frais pour la produire, même via un logiciel de gestion locative. Notre modèle de quittance est lui aussi 100% gratuit.",
  },
  {
    question: "Une quittance de loyer protège-t-elle le locataire ?",
    answer:
      "Oui. La quittance prouve que le loyer a été payé. En cas de litige, elle constitue une preuve de paiement. Elle permet aussi au locataire de justifier de ses charges locatives auprès des administrations (CAF, impôts).",
  },
];

export default function RecuLoyerPage() {
  return (
    <>
      <RecuLoyerJsonLd />
      <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            🧾 Quittance de loyer
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Quittance de Loyer
            <br />
            <span className="text-blue-600">Gratuite &amp; Conforme</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez votre quittance de loyer en PDF. Conforme à la loi du 6
            juillet 1989. Modèle gratuit, aucun compte requis.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Générer ma quittance
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              Voir tous les modèles
            </Link>
          </div>
        </header>

        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Ce que contient le modèle
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Informations obligatoires",
                desc: "Nom propriétaire, identité locataire, adresse, montant, période. Tout y est.",
                icon: "📋",
              },
              {
                title: "Détaillant des sommes",
                desc: "Loyer, charges, total. Mention du solde de tout compte en fin de bail.",
                icon: "💶",
              },
              {
                title: "Paiement & mode",
                desc: "Mention du mode de paiement utilisé (virement, chèque, etc.).",
                icon: "💳",
              },
              {
                title: "Solde de tout compte",
                desc: "En fin de bail, mentionne le solde entre le dépôt de garantie et les éventuelles réparations.",
                icon: "📊",
              },
              {
                title: "PDF téléchargeable",
                desc: "Document prêt à imprimer et à remettre au locataire.",
                icon: "📄",
              },
              {
                title: "Sans inscription",
                desc: "Générez votre quittance gratuitement, sans créer de compte.",
                icon: "🔓",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-2 text-2xl">{item.icon}</div>
                <h3 className="mb-1 text-sm font-semibold text-stone-900">{item.title}</h3>
                <p className="text-xs text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Quand délivrer une quittance de loyer ?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "À chaque paiement de loyer (mensuel)",
              "Sur demande du locataire (gratuit)",
              "En fin de bail avec solde du dépôt",
              "Lors de la révision du loyer (IRL)",
              "Après un augmentation de charges",
              "Lors de la relocation (avec état des lieux)",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-5 text-blue-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Gérez vos quittances automatiquement
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            With RentReady, générez automatiquement une quittance à chaque paiement deloyer. Plus besoin de s'en occuper manuellement.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
          </Link>
        </section>

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
              { href: "/guides/quittance-loyer", label: "Guide : quittance de loyer →" },
              { href: "/blog/gestion-locative-debutant-guide", label: "Guide de la gestion locative pour débutants →" },
              { href: "/glossaire-immobilier", label: "Glossaire de la location immobilière →" },
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

        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/bail-meuble" className="text-blue-600 hover:underline">
            Bail meublé →
          </Link>
          <Link href="/templates/etat-des-lieux" className="text-blue-600 hover:underline">
            État des lieux →
          </Link>
          <Link href="/templates" className="text-blue-600 hover:underline">
            ← Tous les modèles
          </Link>
        </nav>
      </article>
      </div>
    </>
  );
}
