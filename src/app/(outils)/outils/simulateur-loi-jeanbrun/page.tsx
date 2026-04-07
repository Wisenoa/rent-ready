import { Metadata } from "next";
export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  SchemaMarkup,
  webApplicationSchema,
} from "@/components/seo/schema-markup";
import { JeanbrunSimulator } from "./jeanbrun-simulator";

export const metadata: Metadata = {
  title: "Simulateur Loi Jeanbrun 2026 — LMNP vs Jeanbrun",
  description:
    "Comparez le LMNP classique et le nouveau dispositif Jeanbrun 2026 : amortissement, fiscalité, rentabilité. Simulateur gratuit en ligne.",
  alternates: {
    canonical: "https://www.rentready.fr/outils/simulateur-loi-jeanbrun",
  },
};

const faqs = [
  {
    question: "Qui peut bénéficier du dispositif Jeanbrun ?",
    answer:
      "Tout contribuable français investissant dans un bien immobilier locatif neuf ou rénové, situé dans une zone éligible (zones A, A bis et B1 notamment). Le dispositif est ouvert aux particuliers comme aux SCI soumises à l'IR.",
  },
  {
    question: "Peut-on cumuler le LMNP et le dispositif Jeanbrun ?",
    answer:
      "Non, les deux dispositifs sont exclusifs l'un de l'autre. Le propriétaire doit choisir entre le régime LMNP (micro-BIC ou réel) et le dispositif Jeanbrun lors de sa déclaration fiscale. Il est donc essentiel de simuler les deux options avant de s'engager.",
  },
  {
    question: "Quel est le taux d'amortissement Jeanbrun par année ?",
    answer:
      "Le dispositif Jeanbrun prévoit un amortissement dégressif sur 9 ans : 5,5 % de la valeur du bien (hors terrain) les années 1 à 3, 4,5 % les années 4 à 6, et 3,5 % les années 7 à 9. Cela représente un avantage significatif par rapport aux 2 % du régime réel classique.",
  },
  {
    question:
      "Le dispositif Jeanbrun est-il plus avantageux que le LMNP réel ?",
    answer:
      "Cela dépend de la valeur du bien, de votre tranche marginale d'imposition et de vos charges déductibles. En règle générale, le dispositif Jeanbrun est plus avantageux pour les biens de valeur moyenne à élevée et les TMI supérieures à 30 %. Utilisez notre simulateur pour comparer.",
  },
  {
    question:
      "Quelles sont les conditions pour bénéficier de la loi Jeanbrun ?",
    answer:
      "Les principales conditions sont : un engagement de location de 9 ans minimum, le respect des plafonds de loyer dans les zones tendues, un bien neuf ou rénové conforme aux normes énergétiques, et la location à titre de résidence principale du locataire.",
  },
];

export default function SimulateurJeanbrunPage() {
  return (
    <>
      <SchemaMarkup
        data={webApplicationSchema(
          "Simulateur Loi Jeanbrun 2026",
          "/outils/simulateur-loi-jeanbrun",
          "Comparez le LMNP classique et le nouveau dispositif Jeanbrun 2026 : amortissement, fiscalité, rentabilité.",
          faqs
        )}
      />

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
            Grâce à un <strong>amortissement</strong> accéléré et dégressif, ce
            dispositif offre une alternative au <strong>LMNP</strong> classique.
            Utilisez notre simulateur gratuit pour comparer les trois régimes
            fiscaux et identifier la solution la plus avantageuse pour votre
            investissement.
          </p>
        </section>

        {/* ── Interactive simulator ── */}
        <JeanbrunSimulator />

        {/* ── Qu'est-ce que le dispositif Jeanbrun 2026 ? ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-stone-900">
            Qu&apos;est-ce que le dispositif Jeanbrun 2026&nbsp;?
          </h2>
          <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
            <p>
              Le dispositif Jeanbrun est un nouveau mécanisme d&apos;incitation
              fiscale destiné à remplacer le dispositif Pinel, arrivé à
              échéance fin 2024. Il vise à stimuler l&apos;offre de logements
              dans les zones tendues en offrant aux investisseurs un
              amortissement accéléré et dégressif sur 9 ans.
            </p>
            <p>
              Concrètement, le taux d&apos;amortissement passe de 5,5&nbsp;% de
              la valeur du bien (hors foncier) durant les trois premières
              années, à 4,5&nbsp;% pour les années 4 à 6, puis 3,5&nbsp;% pour
              les années 7 à 9. Ce mécanisme récompense l&apos;engagement de
              longue durée tout en offrant un avantage fiscal immédiat
              supérieur au régime réel classique.
            </p>
            <p>
              Le dispositif est ouvert aux locations meublées comme non
              meublées, sous réserve d&apos;un engagement de location de 9 ans
              minimum et du respect des plafonds de loyer applicables dans les
              zones éligibles.
            </p>
          </div>
        </section>

        {/* ── Tableau comparatif statique ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-stone-900">
            LMNP vs Jeanbrun&nbsp;: tableau comparatif
          </h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-stone-50 text-stone-700">
                  <th className="px-4 py-3 font-semibold">Critère</th>
                  <th className="px-4 py-3 font-semibold">LMNP Micro-BIC</th>
                  <th className="px-4 py-3 font-semibold">LMNP Réel</th>
                  <th className="px-4 py-3 font-semibold">Jeanbrun 2026</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-stone-700">
                    Abattement / Amortissement
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    50&nbsp;% forfaitaire
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    ~2&nbsp;% (40&nbsp;ans)
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    3,5&nbsp;% à 5,5&nbsp;% (9&nbsp;ans)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-stone-700">
                    Durée d&apos;engagement
                  </td>
                  <td className="px-4 py-3 text-stone-600">Aucune</td>
                  <td className="px-4 py-3 text-stone-600">Aucune</td>
                  <td className="px-4 py-3 text-stone-600">
                    9&nbsp;ans minimum
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-stone-700">
                    Prélèvements sociaux
                  </td>
                  <td className="px-4 py-3 text-stone-600">17,2&nbsp;%</td>
                  <td className="px-4 py-3 text-stone-600">17,2&nbsp;%</td>
                  <td className="px-4 py-3 text-stone-600">17,2&nbsp;%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-stone-700">
                    Plafond de loyer
                  </td>
                  <td className="px-4 py-3 text-stone-600">Non</td>
                  <td className="px-4 py-3 text-stone-600">Non</td>
                  <td className="px-4 py-3 text-stone-600">
                    Oui (zones tendues)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-stone-700">
                    Avantage principal
                  </td>
                  <td className="px-4 py-3 text-stone-600">Simplicité</td>
                  <td className="px-4 py-3 text-stone-600">
                    Déficit reportable
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    Amortissement accéléré
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-stone-900">
            Questions fréquentes sur la loi Jeanbrun
          </h2>
          <dl className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-base font-medium text-stone-800">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-stone-600 leading-relaxed">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── CTA Banner ── */}
        <section className="mt-16 rounded-2xl bg-blue-600 px-6 py-10 text-center text-white shadow-lg sm:px-10">
          <h2 className="text-2xl font-bold">
            Optimisez votre fiscalité locative avec RentReady
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Simulateur fiscal intégré, suivi des amortissements et préparation
            au e-reporting 2027. Essai gratuit 14&nbsp;jours.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-white px-6 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
          >
            Essayer gratuitement
          </Link>
        </section>
      </div>
    </>
  );
}
