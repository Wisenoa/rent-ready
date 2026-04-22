import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Assurance loyer impayé (GLI) : comparatif 2026 — Est-ce rentable ?",
    description:
      "Garantie des Loyers Impayés (GLI) vs Protection Juridique vs auto-assurance : comparatif des solutions contre les impayés. Coût, couverture, conditions — notre analyse.",
    url: "/comparatif/assurance-loyer-impaye",
    ogType: "website",
  });
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "Assurance loyer impayé comparatif 2026",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu'est-ce que la Garantie des Loyers Impayés (GLI) ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La GLI est une assurance qui rembourse le bailleur en cas de loyers impayés par le locataire. Elle couvre généralement le montant des loyers et charges impayés (dans la limite d'un plafond), les frais de procédure d'expulsion, et parfois les dégradations. C'est la solution la plus complète contre les impayés.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte une assurance loyer impayé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une GLI coûte généralement entre 2 % et 4 % du montant annuel du loyer charges comprises. Par exemple, pour un loyer de 1 000 €/mois, comptez 240 € à 480 €/an. Certaines agences facturent aussi des frais de dossier. Le coût total peut vite dépasser le risque réel pour les bons payeurs.",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il une GLI ou une assurance protection juridique suffit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. La protection juridique prend en charge les frais d'avocat et de procédure en cas de litige, mais elle ne rembourse pas les loyers impayés. Pour couvrir réellement le risque d'impayés, la GLI est indispensable. Les deux ne sont pas substituables.",
      },
    },
    {
      "@type": "Question",
      name: "L'auto-assurance est-elle une bonne option ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'auto-assurance (constituer une réserve financière pour couvrir les impayés) peut être pertinente si vous avez plusieurs biens et une trésorerie solide. Elle demande deprovisionner 3 à 6 mois de loyer par bien. Pour un seul bien ou une trésorerie limitée, la GLI reste plus sûre.",
      },
    },
    {
      "@type": "Question",
      name: "La GLI couvre-t-elle les dégradations du logement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cela dépend des contrats. Les GLI standards remboursent surtout les loyers impayés. Certains contrats premium incluent une garantie dégradations allant jusqu'à 1 à 2 mois de loyer. Pour une couverture complète, vérifiez attentivement les conditions générales du contrat.",
      },
    },
  ],
};

const solutions = [
  {
    name: "Garantie des Loyers Impayés (GLI)",
    verdict: "Recommandé pour les propriétaires",
    icon: "🛡️",
    colorClass: "border-green-200 bg-green-50",
    iconColor: "text-green-700",
    pros: [
      "Remboursement loyers impayés (jusqu'à 90 % du montant)",
      "Prise en charge des frais d'expulsion",
      "Dégradations parfois incluses",
      "Garantie en cas de locataire de bonne foi (perte d'emploi, divorce)",
      "Couverture immédiate après délai de carence",
    ],
    cons: [
      "Coût élevé : 2 à 4 % du loyer annuel",
      "Délai de carence (souvent 1 à 3 mois)",
      "Franchise sur chaque sinistre (souvent 1 mois)",
      "Exclusion si le locataire était déjà en difficulté à la signature",
      "Dossier de souscription strict (CDI, revenus minimums)",
    ],
    cost: "2 à 4 % du loyer annuel",
    bestFor: "Propriétaires avec bien en zone tendue ou locataire à profil risque",
  },
  {
    name: "Assurance Protection Juridique",
    verdict: "Utile mais insuffisant seul",
    icon: "⚖️",
    colorClass: "border-stone-200 bg-white",
    iconColor: "text-stone-600",
    pros: [
      "Prise en charge des frais d'avocat",
      "Accompagnement procedure en cas de litige",
      "Coût modéré (10 à 30 €/mois)",
      "Couverture large (litiges contractuels, voisins, etc.)",
      "Aide à la prescription des等级的",
    ],
    cons: [
      "Ne rembourse PAS les loyers impayés",
      "Frais de procedure uniquement",
      "Plafonds de prise en charge bas (5 000 à 10 000 €)",
      "Délai d'attente avant activation (3 mois)",
      "Ne couvre pas l'expulsion",
    ],
    cost: "10 à 30 €/mois",
    bestFor: "Complément à la GLI ou propriétaires avec bonne sélection locataire",
  },
  {
    name: "Auto-assurance / Réserve financière",
    verdict: "Viable avec une bonne trésorerie",
    icon: "🏦",
    colorClass: "border-stone-200 bg-white",
    iconColor: "text-stone-600",
    pros: [
      "Pas de prime d'assurance mensuelle",
      "Flexibilité totale : vous gérez vous-même",
      "Capital mobilisable immédiatement",
      "Pas de conditions de souscription",
      "Pas de délai de carence",
    ],
    cons: [
      "Il fautprovisionner 3 à 6 mois de loyer par bien",
      "Exposition au risque si plusieurs impayés simultanés",
      "Gestion active et discipline financière requise",
      "Pas d'accompagnement procedure en cas de litige",
      "Risque de perte sèche en cas d'impayé prolongé",
    ],
    cost: "0 € de prime, mais capital à constituer",
    bestFor: "Propriétaires multi-biens avec trésorerie solide et sélection rigoureuse",
  },
  {
    name: "Aucune protection",
    verdict: "Risque maximal — non recommandé",
    icon: "⚠️",
    colorClass: "border-red-200 bg-red-50",
    iconColor: "text-red-700",
    pros: [
      "Pas de coût direct",
    ],
    cons: [
      "Exposition totale au risque d'impayé",
      "Frais de procédure 100 % à votre charge",
      "Pas de prise en charge de l'expulsion",
      "Risque de durée d'impayé de 3 à 12 mois",
      "Impact majeur sur la trésorerie familiale",
    ],
    cost: "Gratuit en apparence, mais risque de plusieurs milliers d'euros",
    bestFor: "Aucun — toujours préférable de s'assurer ou provisionner",
  },
];

export default function AssuranceLoyerImpayé() {
  return (
    <>
      <SchemaMarkup data={faqSchema} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs", href: "/comparatif" },
          { label: "Assurance loyer impayé", href: "/comparatif/assurance-loyer-impaye", isCurrentPage: true },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <header className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
            Comparatif — Protection du propriétaire
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Assurance loyer impayé : comparatif des solutions 2026
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            GLI, protection juridique, auto-assurance ou rien — chaque solution a un coût et une
            couverture différents. Voici l'analyse complète pour protéger vos revenus locatifs.
          </p>
        </header>

        {/* Context stat */}
        <div className="mb-12 rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">
          <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">
            Chiffre clé — France 2025
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-900">
            ~2,5 % des loyers sont impayés pendant plus de 2 mois
          </p>
          <p className="mt-1 text-sm text-blue-700">
            Soit en moyenne 1 mois de loyer non recouvré par an pour un propriétaire avec 6 biens
          </p>
        </div>

        {/* Solutions */}
        <section className="mb-16 space-y-6">
          {solutions.map((solution) => (
            <div
              key={solution.name}
              className={`rounded-xl border p-6 ${solution.colorClass}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl" role="img" aria-hidden="true">
                  {solution.icon}
                </span>
                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className={`text-lg font-bold ${solution.iconColor}`}>
                        {solution.name}
                      </h3>
                      <p className="text-sm font-medium text-stone-500">
                        {solution.verdict}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-stone-700">{solution.cost}</p>
                      <p className="text-xs text-stone-400">{solution.bestFor}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">
                        Avantages
                      </p>
                      <ul className="space-y-1">
                        {solution.pros.map((pro) => (
                          <li key={pro} className="flex items-start gap-2 text-sm text-stone-600">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-1">
                        Inconvénients / Limites
                      </p>
                      <ul className="space-y-1">
                        {solution.cons.map((con) => (
                          <li key={con} className="flex items-start gap-2 text-sm text-stone-600">
                            {solution.name === "Aucune protection" ? (
                              <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                            ) : (
                              <X className="mt-0.5 h-4 w-4 shrink-0 text-stone-300" />
                            )}
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Recommendation */}
        <div className="mb-16 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-blue-900">Notre recommandation</h2>
          <p className="mt-2 text-sm text-blue-800 leading-relaxed">
            Pour la majorité des propriétaires, la GLI offre le meilleur équilibre coût/protection,
            surtout en zone tendue où les procédure d'expulsion sont longues et coûteuses. Si vous
            avez plusieurs biens et une bonne sélection de locataires (vérification des revenus,
            fiche de salaire, avis d'imposition), l'auto-assurance peut être pertinente. Dans tous
            les cas, combinez avec une protection juridique pour accompagner les procédures.
          </p>
        </div>

        {/* FAQ */}
        <section className="mb-16 bg-[#f8f7f4] rounded-2xl p-8">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur l'assurance loyer impayé
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
            Protégez vos revenus locatifs avec RentReady
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-300">
            RentReady ne remplace pas une GLI, mais il détecte automatiquement les paiements
            manquants et vous alerte en temps réel. Combinez gestion intelligente et assurance
            pour une protection complète.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours →
          </Link>
        </section>
      </main>
    </>
  );
}
