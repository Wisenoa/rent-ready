import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Minus } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "RentReady vs Immotop : comparatif logiciel gestion locative 2026",
    description:
      "Comparez RentReady et Immotop : tarifs, fonctionnalités, conformité loi Alur, ease of use. Quel logiciel de gestion locative choisir pour votre parc en 2026 ?",
    url: "/comparatif/rentready-vs-immotop",
    ogType: "website",
  });
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "RentReady vs Immotop comparatif",
  mainEntity: [
    {
      "@type": "Question",
      name: "Immotop est-il gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Immotop propose une offre gratuite limitée à 1 lot. Pour gérer plusieurs biens, un abonnement payant est requis, généralement entre 15 et 35 €/mois selon les fonctionnalités activées.",
      },
    },
    {
      "@type": "Question",
      name: "RentReady est-il plus complet qu'Immotop ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour la gestion quotidienne (quittances, relances, détection paiements), RentReady est plus automatisé. Immotop offre davantage de modules comptable et fiscal, adaptés aux propriétaires avec une comptabilité complexe.",
      },
    },
    {
      "@type": "Question",
      name: "Les deux logiciels proposent-ils la révision IRL ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Les deux plateformes intègrent le calcul de révision de loyer basé sur l'IRL de l'INSEE. RentReady met à jour automatiquement l'IRL via une connexion à l'INSEE ; Immotop nécessite une saisie manuelle du nouvel indice.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on essayer Immotop avant de payer ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Immotop propose un essai gratuit de 7 jours sur demande. RentReady offre un essai gratuit de 14 jours sans carte bancaire, plus long et plus simple à activer.",
      },
    },
    {
      "@type": "Question",
      name: "Quel logiciel est le mieux pour les agencies ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Immotop est davantage orienté gestion d'agence avec des fonctionnalités multi-utilisateurs et un module comptable intégré. RentReady est optimisé pour le propriétaire indépendant de 1 à 20 biens.",
      },
    },
  ],
};

const criteria = [
  "Quittances légales",
  "Détection paiements",
  "Révision IRL",
  "Portail locataire",
  "Sans commission",
  "Essai gratuit",
  "Prix transparent",
  "Multi-utilisateurs",
];

function getScore(software: string, criterion: string): "check" | "cross" | "minus" {
  const scores: Record<string, Record<string, "check" | "cross" | "minus">> = {
    RentReady: {
      "Quittances légales": "check",
      "Détection paiements": "check",
      "Révision IRL": "check",
      "Portail locataire": "check",
      "Sans commission": "check",
      "Essai gratuit": "check",
      "Prix transparent": "check",
      "Multi-utilisateurs": "cross",
    },
    Immotop: {
      "Quittances légales": "check",
      "Détection paiements": "cross",
      "Révision IRL": "check",
      "Portail locataire": "check",
      "Sans commission": "check",
      "Essai gratuit": "minus",
      "Prix transparent": "minus",
      "Multi-utilisateurs": "check",
    },
  };
  return scores[software]?.[criterion] ?? "cross";
}

export default function RentReadyVsImmotop() {
  const softwareList = ["RentReady", "Immotop"];

  return (
    <>
      <SchemaMarkup data={faqSchema} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs", href: "/comparatif" },
          { label: "RentReady vs Immotop", href: "/comparatif/rentready-vs-immotop", isCurrentPage: true },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
            Comparatif — Logiciels de gestion locative
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            RentReady vs Immotop : quel logiciel choisir en 2026 ?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Comparaison détaillée entre RentReady et Immotop : tarifs réels, fonctionnalités,
            conformité légale et适合性. Trouvez la solution adaptée à votre parc locatif.
          </p>
        </header>

        <section className="mb-16 overflow-x-auto">
          <div className="min-w-[560px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-3 pr-4 text-left font-semibold text-stone-900 w-44">Critère</th>
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
                  <td className="py-3 pr-4 text-stone-900">Prix</td>
                  <td className="py-3 px-4 text-center text-stone-900">15 €/mois</td>
                  <td className="py-3 px-4 text-center text-stone-900">15-35 €/mois</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-stone-400 text-center">
              ✓ Inclus &nbsp; ✗ Non disponible &nbsp; − Partiellement
            </p>
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-stone-900">RentReady</h3>
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                  Notre recommandation
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-stone-700">
                15 €/mois <span className="font-normal text-stone-400">tout compris jusqu'à 10 biens</span>
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">Avantages</p>
                  <ul className="space-y-1">
                    {["Détection automatique des paiements", "IRL mis à jour automatiquement", "Essai gratuit 14 jours sans CB", "Interface simple et moderne"].map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-stone-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-700">Limitations</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2 text-sm text-stone-600">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                      Pas de module multi-utilisateurs
                    </li>
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
              <h3 className="text-lg font-bold text-stone-900">Immotop</h3>
              <p className="mt-1 text-sm font-medium text-stone-700">
                15-35 €/mois <span className="font-normal text-stone-400">selon les modules</span>
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">Avantages</p>
                  <ul className="space-y-1">
                    {["Module comptable intégré", "Multi-utilisateurs", "Portail locataire inclus"].map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-stone-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-700">Inconvénients</p>
                  <ul className="space-y-1">
                    {["Détection paiements absente", "Prix variable selon modules", "Pas d'essai gratuit facile"].map((con) => (
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
                Consulter le site →
              </span>
            </div>
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-[#f8f7f4] p-8">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Questions fréquentes : RentReady vs Immotop</h2>
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
          <h2 className="text-2xl font-bold sm:text-3xl">Essayez RentReady gratuitement 14 jours</h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-300">
            Aucune carte bancaire. Aucune commission. Accès complet à toutes les fonctionnalités.
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
