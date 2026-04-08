import { Metadata } from "next";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import {
  SchemaMarkup,
  webApplicationSchema,
} from "@/components/seo/schema-markup";
import { JeanbrunSimulator } from "./jeanbrun-simulator";

export const metadata: Metadata = {
  title: "Simulateur Loi Jeanbrun 2026 — LMNP vs Jeanbrun",
  description:
    "Comparez le LMNP classique et le nouveau dispositif Jeanbrun 2026 : amortissement, fiscalité, rentabilité. Simulateur gratuit en ligne.",
  keywords: [
    "simulateur loi Jeanbrun 2026",
    "LMNP vs Jeanbrun",
    "amortissement Jeanbrun",
    "dispositif fiscal immobilier 2026",
    "investissement locatif France",
    "comparateur LMNP",
  ],
  alternates: {
    canonical: "https://www.rentready.fr/outils/simulateur-loi-jeanbrun",
  },
};

const faqs = [
  {
    question: "Qui peut bénéficier du dispositif Jeanbrun ?",
    answer:
      "Tout contribuable français investissant dans un bien immobilier locatif neuf ou rénové, situé dans une zone éligible (zones A, A bis et B1 notamment). Le dispositif est ouvert aux particuliers comme aux SCI soumises à l&apos;IR. Les étrangers résidant en France peuvent également en bénéficier sous conditions.",
  },
  {
    question: "Peut-on cumuler le LMNP et le dispositif Jeanbrun ?",
    answer:
      "Non, les deux dispositifs sont exclusifs l&apos;un de l&apos;autre. Le propriétaire doit choisir entre le régime LMNP (micro-BIC ou réel) et le dispositif Jeanbrun lors de sa déclaration fiscale. Il est donc essentiel de simuler les deux options avant de s&apos;engager pour identifier le régime le plus avantageux.",
  },
  {
    question: "Quel est le taux d'amortissement Jeanbrun par année ?",
    answer:
      "Le dispositif Jeanbrun prévoit un amortissement dégressif sur 9 ans : 5,5 % de la valeur du bien (hors terrain) les années 1 à 3, 4,5 % les années 4 à 6, et 3,5 % les années 7 à 9. Cela représente un avantage significatif par rapport aux 2 % du régime réel classique du LMNP.",
  },
  {
    question: "Le dispositif Jeanbrun est-il plus avantageux que le LMNP réel ?",
    answer:
      "Cela dépend de la valeur du bien, de votre tranche marginale d&apos;imposition et de vos charges déductibles. En règle générale, le dispositif Jeanbrun est plus avantageux pour les biens de valeur moyenne à élevée et les TMI supérieures à 30 %. Utilisez notre simulateur pour comparer.",
  },
  {
    question: "Quelles sont les conditions pour bénéficier de la loi Jeanbrun ?",
    answer:
      "Les principales conditions sont : un engagement de location de 9 ans minimum, le respect des plafonds de loyer dans les zones tendues, un bien neuf ou rénové conforme aux normes énergétiques (re quieter-minimum), et la location à titre de résidence principale du locataire.",
  },
  {
    question: "Qu'est-ce qui change par rapport au LMNP classique ?",
    answer:
      "Le LMNP classique permet de déduire les charges réelles et d&apos;amortir le bien (généralement 2 % par an). Le dispositif Jeanbrun remplace le système de réduction d&apos;impôt par un amortissement majoré (jusqu'à 5,5 % par an), offrant un avantage fiscal plus important et plus prévisible, notamment pour les investisseurs dans les zones tendues.",
  },
];

// ── HowTo structured data ──────────────────────────────────────────────────
const howtoSteps = [
  {
    name: "Saisissez les paramètres de votre investissement",
    text: "Entrez le prix d'achat du bien, le montant du crédit, le taux d'intérêt, votre tranche marginale d'imposition et la durée de location envisagée.",
  },
  {
    name: "Comparez LMNP micro-BIC, LMNP réel et dispositif Jeanbrun",
    text: "Le simulateur affiche côte à côte les résultats des trois régimes fiscaux : économie d'impôt, flux de trésorerie net, rentabilité nette après fiscalisation.",
  },
  {
    name: "Analysez le tableau d'amortissement",
    text: "Visualisez année par année l'amortissement déductible, le revenu foncier imposable et l'économie d'impôt générée sous chaque régime.",
  },
  {
    name: "Choisissez le régime le plus adapté",
    text: "Comparez la rentabilité nette après impôt de chaque dispositif. Le simulateur vous indique quel régime est optimal selon votre situation fiscale et la durée de détention prévue.",
  },
];

const jeanbrunJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "Comment comparer LMNP et dispositif Jeanbrun 2026",
      description:
        "Guide pour utiliser le simulateur et choisir le meilleur régime fiscal pour votre investissement locatif : LMNP classique ou nouveau dispositif Jeanbrun.",
      step: howtoSteps,
    },
    {
      "@type": "FAQPage",
      name: "FAQ — Simulateur Loi Jeanbrun 2026",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@type": "WebApplication",
      name: "Simulateur Loi Jeanbrun 2026 — RentReady",
      url: "https://www.rentready.fr/outils/simulateur-loi-jeanbrun",
      description:
        "Comparez le LMNP classique et le nouveau dispositif Jeanbrun 2026 : amortissement, fiscalité, rentabilité. Simulateur gratuit.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
    },
  ],
};

function LegalBasis() {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
      <p className="flex items-start gap-2 text-sm text-blue-800">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          <strong>Basis légale :</strong> Loi de finances 2025 (dispositif
          Jeanbrun). Article 199 sexicies du Code général des impôts (CGI).
          Amortissement prévu sur 9 ans selon le profil dégressif : 5,5 % (années
          1-3), 4,5 % (années 4-6), 3,5 % (années 7-9). Plafonds de loyer et
          ressources du locataire selon zonage (arrêté du 29 avril 2024).
        </span>
      </p>
    </div>
  );
}

function CommonMistakes() {
  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
      <h4 className="mb-3 font-semibold text-amber-900">
        Erreurs fréquentes à éviter
      </h4>
      <ul className="space-y-2 text-sm text-amber-800">
        <li className="flex items-start gap-2">
          <span className="font-medium">✗</span>
          <span>
            <strong>Choisir Jeanbrun sans simulation préalable</strong> : ce
            dispositif n&apos;est pas toujours optimal. Un bien avec peu de
            charges ou une TMI basse peut être mieux servi par le LMNP réel
            classique.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-medium">✗</span>
          <span>
            <strong>Inclure le terrain dans l amortissement</strong> : seul le
            prix du bâti (hors terrain) est amortissable. Inclure le terrain
            donne uneBase exagérée et un avantage irreel.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-medium">✗</span>
          <span>
            <strong>Négliger les plafonds de loyer</strong> : en zone tendue,
            le loyer est plafonné. Un loyer réel supérieur au plafond ne
            génère pas de déficit déductible supplémentaire.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-medium">✗</span>
          <span>
            <strong>Sous-estimer la durée d&apos;engagement</strong> : le
            dispositif Jeanbrun impose 9 ans de location. En cas de vente
            anticipée, l&apos;amortissement non utilisé est requalifié.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-medium">✓</span>
          <span>
            <strong>Consulter un expert-comptable fiscaliste</strong> : pour les
            investissements supérieurs à 300 000 €, un conseil personnalisé est
            recommandé avant de trancher entre les régimes.
          </span>
        </li>
      </ul>
    </div>
  );
}

export default function SimulateurJeanbrunPage() {
  return (
    <>
      <SchemaMarkup data={jeanbrunJsonLd} />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* ── H1 + intro ── */}
        <section className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Simulateur Loi Jeanbrun 2026 : comparez LMNP et nouveau dispositif
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600">
            La <strong>loi Jeanbrun</strong> entre en vigueur en{" "}
            <strong>2026</strong> et propose un nouveau cadre fiscal pour
            l&apos;investissement locatif en remplacement du dispositif Pinel.
            Grâce à un <strong>amortissement</strong> accéléré et dégressif,
            ce dispositif offre une alternative au <strong>LMNP</strong>{" "}
            classique. Utilisez notre simulateur gratuit pour comparer les
            trois régimes fiscaux et identifier la solution la plus avantageuse
            pour votre investissement.
          </p>
        </section>

        {/* ── Interactive simulator ── */}
        <section className="mb-16" aria-label="Simulateur Loi Jeanbrun">
          <JeanbrunSimulator />
        </section>

        {/* ── How-to use ── */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Comment utiliser ce simulateur pour choisir votre régime fiscal
          </h2>
          <div className="rounded-xl border border-stone-200/60 bg-white p-6 sm:p-8">
            <ol className="mb-6 list-inside list-decimal space-y-4 text-stone-600">
              <li>
                <strong className="text-stone-800">
                  Saisissez les paramètres de votre investissement
                </strong>{" "}
                — Entrez le prix d&apos;achat du bien, le montant du crédit, le
                taux d&apos;intérêt, votre tranche marginale d&apos;imposition et
                la durée de location envisagée.
              </li>
              <li>
                <strong className="text-stone-800">
                  Comparez les trois régimes instantanément
                </strong>{" "}
                — Le simulateur affiche côte à côte les résultats : économie
                d&apos;impôt, flux de trésorerie net, rentabilité nette après
                fiscalisation pour LMNP micro-BIC, LMNP réel et Jeanbrun.
              </li>
              <li>
                <strong className="text-stone-800">
                  Analysez le tableau d&apos;amortissement
                </strong>{" "}
                — Visualisez année par année l&apos;amortissement déductible,
                le revenu foncier imposable et l&apos;économie d&apos;impôt
                générée sous chaque régime.
              </li>
              <li>
                <strong className="text-stone-800">
                  Choisissez le régime optimal
                </strong>{" "}
                — Comparez la rentabilité nette après impôt. Le simulateur
                vous indique quel régime est le meilleur selon votre situation
                fiscale et votre horizon de détention.
              </li>
            </ol>
            <CommonMistakes />
          </div>
        </section>

        {/* ── Jeanbrun vs LMNP comparison ── */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Dispositif Jeanbrun vs LMNP : quelle différence ?
          </h2>
          <div className="overflow-hidden rounded-xl border border-stone-200/60">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200/60 bg-stone-100/80">
                  <th className="px-4 py-3 font-semibold text-stone-700">
                    Critère
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-stone-700">
                    LMNP micro-BIC
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-stone-700">
                    LMNP réel
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-stone-700">
                    Dispositif Jeanbrun
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-stone-800">
                    Amortissement
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Non
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    ~2 %/an (叙)
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-green-700">
                    5,5 % puis 4,5 % puis 3,5 %
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">
                    Charges déductibles
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Abattement 50 %
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Oui (réelles)
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Oui (réelles)
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-stone-800">
                    Durée d&apos;engagement
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Aucune
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Aucune
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    9 ans minimum
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">
                    Réduction d&apos;impôt
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Non
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Non
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-green-700">
                    Oui (amortissement majoré)
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-stone-800">
                    Zones éligibles
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Toutes
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Toutes
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    Zones A, A bis, B1
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <LegalBasis />
        </section>

        {/* ── FAQ ── */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur la loi Jeanbrun et le LMNP
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-stone-200/60 bg-white"
              >
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-stone-800 select-none marker:text-stone-400">
                  {faq.question}
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-stone-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Related resources ── */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Ressources complémentaires
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="/blog/loi-jeanbrun-2026-guide-complet"
              className="flex items-center gap-3 rounded-xl border border-stone-200/60 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
            >
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-medium text-stone-800">
                  Guide complet de la loi Jeanbrun 2026
                </p>
                <p className="text-sm text-stone-500">Article de blog</p>
              </div>
            </a>
            <a
              href="/blog/lmnp-reel-vs-micro-bic"
              className="flex items-center gap-3 rounded-xl border border-stone-200/60 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
            >
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-medium text-stone-800">
                  LMNP réel vs micro-BIC : guide comparatif
                </p>
                <p className="text-sm text-stone-500">Article de blog</p>
              </div>
            </a>
            <a
              href="/outils/modele-bail-location"
              className="flex items-center gap-3 rounded-xl border border-stone-200/60 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
            >
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-medium text-stone-800">
                  Modèle de bail de location
                </p>
                <p className="text-sm text-stone-500">Téléchargement gratuit</p>
              </div>
            </a>
            <a
              href="/glossaire-immobilier"
              className="flex items-center gap-3 rounded-xl border border-stone-200/60 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
            >
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-medium text-stone-800">
                  Glossaire de l&apos;investissement locatif
                </p>
                <p className="text-sm text-stone-500">Tous les termes</p>
              </div>
            </a>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section
          className="rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10"
          aria-label="Appel à l'action"
        >
          <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
            Gérez vos investissements locatifs en un seul outil
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-stone-600">
            RentReady centralise vos biens, calcule automatiquement les
            amortissements et génère vos déclarations fiscales. Essai gratuit
            14&nbsp;jours.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Commencer l&apos;essai gratuit
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </>
  );
}
