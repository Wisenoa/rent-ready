import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Minus } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { formatEntryPrice } from "@/data/entity";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Logiciel, Tableur ou Agence : le comparatif de gestion locative 2026",
    description:
      "Comparez les 3 modes de gestion locative : logiciel dédié, tableur Excel ou agence immobilière. Coûts, temps passé et conformité légale analysés en détail.",
    url: "/comparatif/logiciel-gestion-locative",
    ogType: "website",
  });
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "Comparatif gestion locative 2026 : Logiciel, Tableur ou Agence",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quel est le meilleur mode de gestion locative pour un propriétaire indépendant ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Pour 1 à 10 logements, un logiciel spécialisé comme Locelio offre le meilleur équilibre : il automatise les tâches chronophages (quittances, détection des paiements, révision IRL) dès ${formatEntryPrice()}, sans les honoraires élevés d'une agence (7 à 10 % des loyers) ni la charge mentale d'un tableur Excel manuel.`,
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte la gestion locative pour un propriétaire particulier ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un tableur ne coûte rien en licence mais demande plusieurs heures de travail par mois. Une agence immobilière facture généralement entre 6 % et 10 % TTC des loyers encaissés, plus les frais de mise en location. Un logiciel de gestion locative démarre dès 9 €/mois tout compris.",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il un logiciel ou un tableur Excel suffit-il ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour un bien unique avec un locataire stable, un tableur peut suffire au départ. Dès 2 ou 3 biens, la gestion manuelle devient source d'erreurs : conformité légale des quittances (loi de 1989), calcul des révisions annuelles INSEE et risque de retard sur les relances. Un logiciel automatisé élimine ces frictions.",
      },
    },
    {
      "@type": "Question",
      name: "Les logiciels de gestion locative sont-ils conformes à la loi Alur et à la loi de 1989 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, un logiciel comme Locelio intègre nativement les mentions légales obligatoires : distinction loyer et charges, encadrement des loyers en zone tendue, calcul exact de l'IRL et modèle d'état des lieux conforme au décret de 2016.",
      },
    },
  ],
};

interface Alternative {
  name: string;
  price: string;
  priceDetail: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  url: string;
  highlight: boolean;
}

const alternatives: Alternative[] = [
  {
    name: "Locelio (Logiciel en ligne)",
    price: formatEntryPrice(),
    priceDetail: "sans commission, essai gratuit sans CB",
    pros: [
      "Quittances automatiques loi du 6 juillet 1989",
      "Détection des virements par synchronisation bancaire",
      "Calcul automatique de la révision IRL (indices INSEE)",
      "Alertes immédiates en cas d'impayé ou de retard",
      "Portail locataire et historique sécurisé",
      "Gestion calme par exception : le système veille en arrière-plan",
    ],
    cons: ["Conçu pour 1 à 10 lots, pas adapté aux syndics de copropriété"],
    bestFor: "Propriétaires particuliers qui gèrent eux-mêmes",
    url: "/register",
    highlight: true,
  },
  {
    name: "Tableur (Excel ou Google Sheets)",
    price: "0 €",
    priceDetail: "gratuit en licence",
    pros: [
      "Gratuit et accessible immédiatement",
      "Personnalisable selon ses propres formules",
    ],
    cons: [
      "Zéro automatisation : tout doit être saisi à la main",
      "Quittances à créer, convertir en PDF et envoyer manuellement",
      "Risque d'erreurs dans les formules et d'oubli de relance",
      "Aucune mise à jour automatique des indices légaux INSEE",
      "Chronophage (2 à 4 heures par mois dès plusieurs lots)",
    ],
    bestFor: "Un seul bien avec peu de mouvements",
    url: "#",
    highlight: false,
  },
  {
    name: "Agence immobilière (Gestion déléguée)",
    price: "6 % à 10 % TTC",
    priceDetail: "du montant des loyers + frais de relocation",
    pros: [
      "Délégation complète des visites et états des lieux",
      "Gestion des réparations courantes par des artisans partenaires",
      "Interlocuteur physique pour le locataire",
    ],
    cons: [
      "Coût très élevé : 600 € à 1 500 € par an et par logement",
      "Frais supplémentaires à chaque changement de locataire",
      "Reversement des loyers souvent différé à la fin du mois",
      "Perte de visibilité directe sur la relation locataire",
    ],
    bestFor: "Propriétaires éloignés géographiquement ou sans temps libre",
    url: "#",
    highlight: false,
  },
];

const criteria = [
  "Quittances conformes loi 1989",
  "Détection automatique des paiements",
  "Révision annuelle IRL automatique",
  "Alertes impayé en temps réel",
  "Portail locataire inclus",
  "Sans commission sur les loyers",
  "Temps de gestion mensuel estimé",
];

function getScore(alternativeName: string, criterion: string): "check" | "cross" | "minus" {
  if (alternativeName.startsWith("Locelio")) {
    return "check";
  }
  if (alternativeName.startsWith("Tableur")) {
    if (criterion === "Sans commission sur les loyers") return "check";
    return "cross";
  }
  if (alternativeName.startsWith("Agence")) {
    if (criterion === "Quittances conformes loi 1989") return "check";
    if (criterion === "Révision annuelle IRL automatique") return "check";
    if (criterion === "Sans commission sur les loyers") return "cross";
    if (criterion === "Temps de gestion mensuel estimé") return "check";
    return "minus";
  }
  return "cross";
}

function getCriteriaNote(alternativeName: string, criterion: string): string | null {
  if (criterion === "Temps de gestion mensuel estimé") {
    if (alternativeName.startsWith("Locelio")) return "~10 min/mois";
    if (alternativeName.startsWith("Tableur")) return "2 à 4 h/mois";
    if (alternativeName.startsWith("Agence")) return "0 min/mois";
  }
  return null;
}

export default function ComparatifLogicielGestionLocative() {
  return (
    <>
      <SchemaMarkup data={faqSchema} breadcrumbRenderedByComponent />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs", href: "/comparatif" },
          { label: "Logiciel vs Tableur vs Agence", href: "/comparatif/logiciel-gestion-locative", isCurrentPage: true },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <header className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-800 uppercase">
            Guide comparatif 2026
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Gestion locative : Logiciel en ligne, Tableur Excel ou Agence ?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Comparez objectivement les trois solutions pour gérer vos logements en location. Coûts réels, temps passé et conformité légale analysés en toute transparence.
          </p>
        </header>

        {/* Comparison table */}
        <section className="mb-16 overflow-x-auto">
          <div className="min-w-[640px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-3 pr-4 text-left font-semibold text-stone-900 w-52">
                    Critère
                  </th>
                  {alternatives.map((alt) => (
                    <th
                      key={alt.name}
                      className={`py-3 px-3 text-center font-semibold ${
                        alt.highlight ? "text-emerald-800" : "text-stone-700"
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
                      const note = getCriteriaNote(alt.name, criterion);
                      return (
                        <td key={alt.name} className="py-3 px-3 text-center">
                          {note ? (
                            <span className="font-medium text-stone-800">{note}</span>
                          ) : (
                            <>
                              {score === "check" && (
                                <Check className="mx-auto h-5 w-5 text-emerald-600" />
                              )}
                              {score === "cross" && (
                                <X className="mx-auto h-5 w-5 text-stone-300" />
                              )}
                              {score === "minus" && (
                                <Minus className="mx-auto h-5 w-5 text-amber-500" />
                              )}
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t-2 border-stone-200 font-semibold">
                  <td className="py-3 pr-4 text-stone-900">Coût estimé</td>
                  {alternatives.map((alt) => (
                    <td key={alt.name} className="py-3 px-3 text-center text-stone-900">
                      {alt.price}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <p className="mt-3 text-xs text-stone-500 text-center">
              ✓ Inclus &nbsp; ✗ Non disponible &nbsp; − Partiel ou payant en option
            </p>
          </div>
        </section>

        {/* Detailed alternatives */}
        <section className="mb-16 space-y-8">
          {alternatives.map((alt) => (
            <div
              key={alt.name}
              className={`rounded-2xl border p-6 md:p-8 ${
                alt.highlight
                  ? "border-emerald-200 bg-emerald-50/40 shadow-sm"
                  : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-stone-900">{alt.name}</h2>
                    {alt.highlight && (
                      <span className="rounded-full bg-emerald-800 px-2.5 py-0.5 text-xs font-semibold text-white">
                        Recommandé pour bailleurs autonomes
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-stone-800">
                    {alt.price} <span className="font-normal text-stone-600">— {alt.priceDetail}</span>
                  </p>
                  <p className="mt-1 text-sm text-stone-600">Recommandé pour : {alt.bestFor}</p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
                        Avantages
                      </p>
                      <ul className="space-y-1.5">
                        {alt.pros.map((pro) => (
                          <li key={pro} className="flex items-start gap-2 text-sm text-stone-700">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                        Inconvénients
                      </p>
                      <ul className="space-y-1.5">
                        {alt.cons.map((con) => (
                          <li key={con} className="flex items-start gap-2 text-sm text-stone-600">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pt-2 sm:pt-0">
                  {alt.highlight ? (
                    <Link
                      href={alt.url}
                      className="inline-block rounded-xl bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900"
                    >
                      Essai gratuit 14 jours →
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section className="mb-16 bg-[#fbfbfa] rounded-2xl border border-stone-200/60 p-8">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes
          </h2>
          <div className="divide-y divide-stone-200">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-stone-900">
                  {faq.name}
                  <span className="ml-4 shrink-0 text-stone-500 transition-transform group-open:rotate-45">
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
            Passez du tableur à la gestion sereine
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-300">
            Créez votre compte en 2 minutes. 14 jours d'essai gratuit sans carte bancaire, puis {formatEntryPrice()} par mois sans engagement.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-emerald-800 px-8 py-3.5 font-semibold text-white shadow transition-colors hover:bg-emerald-700"
          >
            Commencer mon essai gratuit
          </Link>
        </section>
      </main>
    </>
  );
}
