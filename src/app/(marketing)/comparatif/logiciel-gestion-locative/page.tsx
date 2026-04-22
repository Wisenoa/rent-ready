import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Minus } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Comparatif logiciel gestion locative 2026 — RentReady vs la concurrence",
    description:
      "Comparez RentReady, Gestions, Apfer, Tecoo et les autres logiciels de gestion locative. Tarifs, fonctionnalités, conformité loi Alur — trouvez le meilleur choix pour votre parc.",
    url: "/comparatif/logiciel-gestion-locative",
    ogType: "website",
  });
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "Comparatif logiciel gestion locative 2026",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quel est le meilleur logiciel de gestion locative en 2026 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le meilleur dépend de votre parc. RentReady offre le meilleur rapport prix-fonctionnalités pour les propriétaires de 1 à 10 biens, à 15 €/mois sans commission. Pour les agences ou grands parcs, des solutions comme Gestions.net ou Tecoo offrent plus de modules comptables mais à des tarifs plus élevés.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte un logiciel de gestion locative ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les tarifs varient de 0 € (tableur) à plus de 100 €/mois pour les agences. Un propietario indépendant paie généralement entre 10 et 30 €/mois. Attention aux offres à bas coût qui facturent des modules essentiels (quittances, relances) en option.",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il un logiciel ou un tableur Excel suffit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour un bien, un tableur peut suffire. Dès 3 biens ou plus, un logiciel devient indispensable : automatisation des quittances, détection des paiements, calcul IRL, conformité légale évolutive. Le temps économisé justifie largement le coût mensuel.",
      },
    },
    {
      "@type": "Question",
      name: "Les logiciels de gestion locative sont-ils conformes à la loi Alur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les principaux logiciels (RentReady, Gestions.net, Apfer) intègrent la conformité loi Alur : mentions obligatoires sur les quittances, grille de loyer en zone tendue, délai de restitution du dépôt de garantie. Vérifiez que le logiciel met à jour ses modèles à chaque modification légale.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on changer de logiciel de gestion locative facilement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La migration dépend du logiciel source et cible. L'essentiel de vos données (baux, quittances, historique) doit pouvoir s'exporter. Privilégiez un logiciel qui stocke vos documents de manière standard (PDF) et non dans un format propriétaire.",
      },
    },
  ],
};

const alternatives = [
  {
    name: "RentReady",
    price: "15 €/mois",
    priceDetail: "tout inclus jusqu'à 10 biens",
    pros: [
      "Quittances légales全自动",
      "Détection paiements via Open Banking",
      "Révision IRL connectée INSEE",
      "Portail locataire inclus",
      "Pas de commission sur les loyers",
      "Essai gratuit 14 jours sans CB",
    ],
    cons: ["Pas de module de comptabilité avancé"],
    bestFor: "Propriétaires de 1 à 10 biens",
    url: "/register",
    highlight: true,
  },
  {
    name: "Gestions.net",
    price: "29 €/mois",
    priceDetail: "ou 250 €/an",
    pros: [
      "Comptabilité complète intégrée",
      "ModuleFiscalité développé",
      "Historique long",
      "Support téléphonique",
    ],
    cons: [
      "Interface vieillissante",
      "Pas de détection automatique des paiements",
      "Coût additionnel pour le portail locataire",
    ],
    bestFor: "Propriétaires avec comptabilité complexe",
    url: "#",
    highlight: false,
  },
  {
    name: "Apfer",
    price: "19 €/mois",
    priceDetail: "jusqu'à 5 lots",
    pros: ["Cumulable avec expertise-comptable", "Déclaration fiscale automatisée"],
    cons: [
      "Limité à 5 lots sur l'offre de base",
      "Pas de portail locataire intégré",
      "Quittances en option payante",
    ],
    bestFor: "Landlords with accountant already",
    url: "#",
    highlight: false,
  },
  {
    name: "Tecoo",
    price: "35 €/mois",
    priceDetail: "fonctionnalités complètes",
    pros: ["Interface moderne", "Application mobile", "Multi-utilisateurs"],
    cons: [
      "Tarif plus élevé",
      "Surplus pour les alertes SMS",
      "Complexe pour un usage simple",
    ],
    bestFor: "Property managers with multiple staff",
    url: "#",
    highlight: false,
  },
  {
    name: "Tableur Excel",
    price: "Gratuit",
    priceDetail: "à 0 €",
    pros: ["Gratuit", "Totalement personnalisable"],
    cons: [
      "Pas d'automatisation",
      "Risque d'erreurs",
      "Pas de conformité garantie",
      "Pas de detection des paiements",
    ],
    bestFor: "Un seul bien, usage temporaire",
    url: "#",
    highlight: false,
  },
];

const criteria = [
  "Quittances légales",
  "Détection paiements",
  "Révision IRL",
  "Portail locataire",
  "Sans commission",
  "Essai gratuit",
  "Prix-transparent",
];

function getScore(alternative: string, criterion: string): "check" | "cross" | "minus" {
  const scores: Record<string, Record<string, "check" | "cross" | "minus">> = {
    RentReady: {
      "Quittances légales": "check",
      "Détection paiements": "check",
      "Révision IRL": "check",
      "Portail locataire": "check",
      "Sans commission": "check",
      "Essai gratuit": "check",
      "Prix-transparent": "check",
    },
    "Gestions.net": {
      "Quittances légales": "check",
      "Détection paiements": "cross",
      "Révision IRL": "check",
      "Portail locataire": "minus",
      "Sans commission": "check",
      "Essai gratuit": "cross",
      "Prix-transparent": "check",
    },
    Apfer: {
      "Quittances légales": "check",
      "Détection paiements": "cross",
      "Révision IRL": "minus",
      "Portail locataire": "cross",
      "Sans commission": "check",
      "Essai gratuit": "cross",
      "Prix-transparent": "minus",
    },
    Tecoo: {
      "Quittances légales": "check",
      "Détection paiements": "cross",
      "Révision IRL": "check",
      "Portail locataire": "check",
      "Sans commission": "check",
      "Essai gratuit": "cross",
      "Prix-transparent": "check",
    },
    "Tableur Excel": {
      "Quittances légales": "cross",
      "Détection paiements": "cross",
      "Révision IRL": "cross",
      "Portail locataire": "cross",
      "Sans commission": "check",
      "Essai gratuit": "check",
      "Prix-transparent": "check",
    },
  };
  return scores[alternative]?.[criterion] ?? "cross";
}

export default function ComparatifLogicielGestionLocative() {
  return (
    <>
      <SchemaMarkup data={faqSchema} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs", href: "/comparatif" },
          { label: "Logiciels gestion locative", href: "/comparatif/logiciel-gestion-locative", isCurrentPage: true },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <header className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
            Comparatif — Outils de gestion
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Logiciel gestion locative : le comparatif 2026
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Comparez RentReady, Gestions.net, Apfer, Tecoo et Excel pour gérer vos
            locations. Tarifs réels, fonctionnalités, conformité — tout pour choisir en
            connaissance de cause.
          </p>
        </header>

        {/* Comparison table */}
        <section className="mb-16 overflow-x-auto">
          <div className="min-w-[640px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-3 pr-4 text-left font-semibold text-stone-900 w-40">
                    Critère
                  </th>
                  {alternatives.map((alt) => (
                    <th
                      key={alt.name}
                      className={`py-3 px-3 text-center font-semibold ${
                        alt.highlight ? "text-blue-600" : "text-stone-700"
                      }`}
                    >
                      {alt.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {criteria.map((criterion) => (
                  <tr key={criterion} className="hover:bg-stone-50">
                    <td className="py-3 pr-4 font-medium text-stone-700">{criterion}</td>
                    {alternatives.map((alt) => {
                      const score = getScore(alt.name, criterion);
                      return (
                        <td key={alt.name} className="py-3 px-3 text-center">
                          {score === "check" && (
                            <Check className="mx-auto h-5 w-5 text-green-600" />
                          )}
                          {score === "cross" && (
                            <X className="mx-auto h-5 w-5 text-red-400" />
                          )}
                          {score === "minus" && (
                            <Minus className="mx-auto h-5 w-5 text-amber-400" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t-2 border-stone-200 font-semibold">
                  <td className="py-3 pr-4 text-stone-900">Prix mensuel</td>
                  {alternatives.map((alt) => (
                    <td key={alt.name} className="py-3 px-3 text-center text-stone-900">
                      {alt.price}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-stone-400 text-center">
              ✓ Inclus &nbsp; ✗ Non disponible &nbsp; − Partiellement
            </p>
          </div>
        </section>

        {/* Detailed alternatives */}
        <section className="mb-16 space-y-8">
          {alternatives.map((alt) => (
            <div
              key={alt.name}
              className={`rounded-xl border p-6 ${
                alt.highlight
                  ? "border-blue-200 bg-blue-50 shadow-sm"
                  : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-stone-900">{alt.name}</h3>
                    {alt.highlight && (
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                        Notre recommandation
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-stone-700">
                    {alt.price} <span className="font-normal text-stone-400">— {alt.priceDetail}</span>
                  </p>
                  <p className="mt-1 text-sm text-stone-500">Recommandé pour : {alt.bestFor}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">
                        Avantages
                      </p>
                      <ul className="space-y-1">
                        {alt.pros.map((pro) => (
                          <li key={pro} className="flex items-start gap-2 text-sm text-stone-600">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-1">
                        Inconvénients
                      </p>
                      <ul className="space-y-1">
                        {alt.cons.map((con) => (
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
                  {alt.highlight ? (
                    <Link
                      href={alt.url}
                      className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
                    >
                      Essai gratuit →
                    </Link>
                  ) : (
                    <span className="inline-block rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm text-stone-400 cursor-not-allowed">
                      Voir le site →
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section className="mb-16 bg-[#f8f7f4] rounded-2xl p-8">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur les logiciels de gestion locative
          </h2>
          <div className="divide-y divide-stone-200">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-stone-900">
                  {faq.name}
                  <span className="ml-4 shrink-0 text-stone-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-stone-600 leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
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
            Aucune carte bancaire. Aucune commission. Accès complet à toutes les fonctionnalités
            pendant 14 jours, puis 15 €/mois pour tout votre parc.
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
