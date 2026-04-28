import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Minus } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "RentReady vs Gerclegeo : comparatif logiciel gestion locative 2026",
    description:
      "Comparez RentReady et Gerclegeo : tarifs, fonctionnalités, conformité loi Alur, ease of use. Quel logiciel de gestion locative choisir en 2026 ?",
    url: "/comparatif/rentready-vs-gerclegeo",
    ogType: "website",
  });
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "RentReady vs Gerclegeo comparatif",
  mainEntity: [
    {
      "@type": "Question",
      name: "RentReady est-il moins cher que Gerclegeo ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. RentReady propose un tarif tout compris à 15 €/mois jusqu'à 10 biens, sans frais cachés. Gerclegeo facture généralement entre 20 et 40 €/mois selon les modules, avec des options payantes pour les quittances et le portail locataire.",
      },
    },
    {
      "@type": "Question",
      name: "Gerclegeo propose-t-il un portail locataire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le portail locataire est inclus dans l'offre Gerclegeo mais nécessite une configuration initiale. RentReady active le portail automatiquement pour chaque nouveau bien ajouté.",
      },
    },
    {
      "@type": "Question",
      name: "Quel logiciel est le plus simple à prendre en main ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RentReady a été conçu pour être utilisé sans formation. Son interface est entièrement en ligne, sans installation. Gerclegeo nécessite un temps d'apprentissage plus long pour maîtriser tous les modules.",
      },
    },
    {
      "@type": "Question",
      name: "Les deux logiciels sont-ils conformes à la loi Alur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, les deux软件 intègrent la conformité loi Alur : mentions obligatoires sur les quittances, calcul IRL automatique, délai de restitution du dépôt de garantie. Les deux mettent à jour leurs modèles lors des évolutions légales.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on migrer depuis Gerclegeo vers RentReady ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Exportez vos données depuis Gerclegeo (baux en PDF, historique de paiements) et importez-les manuellement dans RentReady. Le support RentReady peut vous accompagner dans la démarche.",
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
  "Interface moderne",
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
      "Interface moderne": "check",
    },
    Gerclegeo: {
      "Quittances légales": "check",
      "Détection paiements": "cross",
      "Révision IRL": "check",
      "Portail locataire": "check",
      "Sans commission": "check",
      "Essai gratuit": "cross",
      "Prix transparent": "minus",
      "Interface moderne": "minus",
    },
  };
  return scores[software]?.[criterion] ?? "cross";
}

export default function RentReadyVsGerclegeo() {
  const softwareList = ["RentReady", "Gerclegeo"];

  return (
    <>
      <SchemaMarkup data={faqSchema} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs", href: "/comparatif" },
          { label: "RentReady vs Gerclegeo", href: "/comparatif/rentready-vs-gerclegeo", isCurrentPage: true },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <header className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
            Comparatif — Logiciels de gestion locative
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            RentReady vs Gerclegeo : quel logiciel choisir en 2026 ?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Comparaison détaillée entre RentReady et Gerclegeo sur les tarifs, fonctionnalités,
            conformité légale et ease of use. Trouvez la solution adaptée à votre parc.
          </p>
        </header>

        {/* Comparison table */}
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
                  <td className="py-3 px-4 text-center text-stone-900">20-40 €/mois</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-stone-400 text-center">
              ✓ Inclus &nbsp; ✗ Non disponible &nbsp; − Partiellement
            </p>
          </div>
        </section>

        {/* RentReady card */}
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
                    {["Tarif unique, sans surprise", "Détection automatique des paiements", "Mise à jour IRL instantanée", "Essai gratuit 14 jours"].map((pro) => (
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
                      Pas de module comptabilité avancé
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

        {/* Gerclegeo card */}
        <section className="mb-12 rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-stone-900">Gerclegeo</h3>
              <p className="mt-1 text-sm font-medium text-stone-700">
                20-40 €/mois <span className="font-normal text-stone-400">selon les modules</span>
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">Avantages</p>
                  <ul className="space-y-1">
                    {["Portail locataire inclus", "Conformité loi Alur", "Historique long"].map((pro) => (
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
                    {["Détection paiements absente", "Pas d'essai gratuit", "Interface moins moderne"].map((con) => (
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

        {/* FAQ */}
        <section className="mb-16 rounded-2xl bg-[#f8f7f4] p-8">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes : RentReady vs Gerclegeo
          </h2>
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

        {/* CTA */}
        <section className="rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Essayez RentReady gratuitement 14 jours
          </h2>
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
