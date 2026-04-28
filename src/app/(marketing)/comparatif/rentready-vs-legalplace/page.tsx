import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Minus } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "RentReady vs LegalPlace : comparatif gestion locative et juridique 2026",
    description:
      "Comparez RentReady et LegalPlace : logiciels de gestion locative, services juridiques en ligne, conformité bail, tarifs. Quelle solution pour les propriétaires bailleurs en 2026 ?",
    url: "/comparatif/rentready-vs-legalplace",
    ogType: "website",
  });
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "RentReady vs LegalPlace comparatif",
  mainEntity: [
    {
      "@type": "Question",
      name: "LegalPlace est-il un logiciel de gestion locative ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LegalPlace est principalement un service juridique en ligne : rédaction de contrats, consultation d'avocats, formalités administratives. Il propose des outils de rédaction de bail mais pas de gestion locative au quotidien (suivi des paiements, quittances automatiques, relances).",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il choisir entre RentReady et LegalPlace ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, les deux sont complémentaires. LegalPlace aide à rédiger un bail conforme ; RentReady gère le suivi quotidien de la location (paiements, relances, quittances, révision de loyer). Many propriétaires utilisent les deux.",
      },
    },
    {
      "@type": "Question",
      name: "LegalPlace est-il moins cher qu'un avocat ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. LegalPlace propose des consultations et rédactions de documents à partir de quelques dizaines d'euros, contre plusieurs centaines d'euros chez un avocat. Pour les bachelors standards, c'est une alternative économique.",
      },
    },
    {
      "@type": "Question",
      name: "RentReady intègre-t-il des conseils juridiques ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RentReady inclut des modèles de bail conformes à la loi Alur et des informations juridiques dans ses guides. Pour des conseils juridiques personnalisés (litige, contentieux), une consultation LegalPlace ou avocat reste recommandée.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on utiliser LegalPlace pour le bail et RentReady pour la gestion ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolument. C'est même une combinaison intelligente : vous rédigez vos baux sur LegalPlace avec les bonnes clauses, puis vous gérez vos locations au quotidien sur RentReady (suivi des paiements, génération des quittances, alertes IRL).",
      },
    },
  ],
};

const criteria = [
  "Rédaction de bail",
  "Quittances automatiques",
  "Détection paiements",
  "Révision IRL",
  "Portail locataire",
  "Relance impayé",
  "Suivi quotidien",
  "Conseil juridique",
];

function getScore(software: string, criterion: string): "check" | "cross" | "minus" {
  const scores: Record<string, Record<string, "check" | "cross" | "minus">> = {
    RentReady: {
      "Rédaction de bail": "minus",
      "Quittances automatiques": "check",
      "Détection paiements": "check",
      "Révision IRL": "check",
      "Portail locataire": "check",
      "Relance impayé": "check",
      "Suivi quotidien": "check",
      "Conseil juridique": "cross",
    },
    LegalPlace: {
      "Rédaction de bail": "check",
      "Quittances automatiques": "cross",
      "Détection paiements": "cross",
      "Révision IRL": "cross",
      "Portail locataire": "cross",
      "Relance impayé": "cross",
      "Suivi quotidien": "cross",
      "Conseil juridique": "check",
    },
  };
  return scores[software]?.[criterion] ?? "cross";
}

export default function RentReadyVsLegalPlace() {
  const softwareList = ["RentReady", "LegalPlace"];

  return (
    <>
      <SchemaMarkup data={faqSchema} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs", href: "/comparatif" },
          { label: "RentReady vs LegalPlace", href: "/comparatif/rentready-vs-legalplace", isCurrentPage: true },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
            Comparatif — Gestion locative et services juridiques
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            RentReady vs LegalPlace : quelles différences ?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Deux outils complémentaires pour les propriétaires bailleurs. RentReady gère vos locations au quotidien.
            LegalPlace vous aide sur le juridique et la rédaction de documents. Comparatif 2026.
          </p>
        </header>

        <section className="mb-16 overflow-x-auto">
          <div className="min-w-[560px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-3 pr-4 text-left font-semibold text-stone-900 w-44">Fonctionnalité</th>
                  {softwareList.map((sw) => (
                    <th
                      key={sw}
                      className={`py-3 px-4 text-center font-semibold ${
                        sw === "RentReady" ? "text-blue-600" : "text-stone-700"
                      }`}
                    >
                      {sw}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {criteria.map((criterion) => (
                  <tr key={criterion} className="hover:bg-stone-50">
                    <td className="py-3 pr-4 font-medium text-stone-700">{criterion}</td>
                    {softwareList.map((sw) => {
                      const score = getScore(sw, criterion);
                      return (
                        <td key={sw} className="py-3 px-4 text-center">
                          {score === "check" && <Check className="mx-auto h-5 w-5 text-green-600" />}
                          {score === "cross" && <X className="mx-auto h-5 w-5 text-red-400" />}
                          {score === "minus" && <Minus className="mx-auto h-5 w-5 text-amber-400" />}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t-2 border-stone-200 font-semibold">
                  <td className="py-3 pr-4 text-stone-900">Usage principal</td>
                  <td className="py-3 px-4 text-center text-stone-900">Gestion locative</td>
                  <td className="py-3 px-4 text-center text-stone-900">Services juridiques</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-stone-400 text-center">
              ✓ Inclus &nbsp; ✗ Non disponible &nbsp; − Partiellement
            </p>
          </div>
        </section>

        {/* Use case: LegalPlace for documents, RentReady for management */}
        <section className="mb-12 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-2">La combinaison recommandée</h2>
          <p className="text-sm text-stone-600 mb-4">
            De nombreux propriétaires utilisent <strong>LegalPlace</strong> pour rédiger leurs baux avec les bonnes clauses
            juridiques, puis <strong>RentReady</strong> pour gérer leurs locations au quotidien.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-4 border border-blue-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-2">Avec LegalPlace</p>
              <ul className="space-y-1">
                {["Rédaction du bail de location", "Consultation avocat en ligne", "Formalités de création"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-white p-4 border border-blue-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-2">Avec RentReady</p>
              <ul className="space-y-1">
                {["Suivi des paiements", "Quittances automatiques", "Relance loyer impayé", "Révision IRL"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-stone-900">RentReady</h3>
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                  Gestion locative
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-stone-700">
                15 €/mois <span className="font-normal text-stone-400">tout compris jusqu'à 10 biens</span>
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">Avantages</p>
                  <ul className="space-y-1">
                    {["Quittances légales全自动", "Détection paiements via Open Banking", "Relance automatique impayés", "Portail locataire inclus", "Essai gratuit 14 jours"].map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-stone-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <Link
                href="/register"
                className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
              >
                Essai gratuit 14 jours →
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-stone-900">LegalPlace</h3>
              <p className="mt-1 text-sm font-medium text-stone-700">
                Payant à l'acte <span className="font-normal text-stone-400">consultation et rédaction</span>
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">Avantages</p>
                  <ul className="space-y-1">
                    {["Rédaction de bail conforme", "Consultation avocat en ligne", "Formalités administratives", "Modèles juridiques nombreux"].map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-stone-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-700">Limites</p>
                  <ul className="space-y-1">
                    {["Pas de gestion quotidienne", "Pas de suivi des paiements", "Service ponctuel, pas continu"].map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-stone-600">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-block rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm text-stone-400 cursor-not-allowed">
                Consulter LegalPlace →
              </span>
            </div>
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-[#f8f7f4] p-8">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Questions fréquentes : RentReady vs LegalPlace</h2>
          <div className="divide-y divide-stone-200">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-stone-900">
                  {faq.name}
                  <span className="ml-4 shrink-0 text-stone-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-stone-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">Gérez vos locations au quotidien avec RentReady</h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-300">
            Quittances automatiques, détection des paiements, relances. Gérez vos locations en toute sérénité.
            Essai gratuit 14 jours, sans carte bancaire.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Créer mon compte gratuitement
          </Link>
        </section>
      </main>
    </>
  );
}
