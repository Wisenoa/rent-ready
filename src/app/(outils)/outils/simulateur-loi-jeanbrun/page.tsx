import Link from "next/link";
import { Check } from "lucide-react";

import { JeanbrunSimulator } from "./jeanbrun-simulator";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildFAQPageSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { ToolHeader } from "@/components/marketing/tools/ToolHeader";
import { ToolCta, ToolExplainer, ToolFaq, type FaqItem } from "@/components/marketing/tools/ToolContent";

export const revalidate = 3600;

export async function generateMetadata() {
  return baseMetadata({
    title: "Simulateur Loi Jeanbrun 2026 — Amortissement Locatif vs LMNP",
    description:
      "Simulez gratuitement l'impact d'un amortissement dégressif sur 9 ans (dispositif Jeanbrun : 5,5 %, 4,5 %, 3,5 %) face au Micro-BIC et au LMNP Réel linéaire.",
    url: "/outils/simulateur-loi-jeanbrun",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Simulateur loi Jeanbrun", href: "/outils/simulateur-loi-jeanbrun" },
];

const HYPOTHESES_SIMULATION = [
  "Base amortissable fixée à 80 % du prix d'acquisition (exclusion forfaitaire de 20 % correspondant à la quote-part du foncier).",
  "Profil dégressif sur 9 ans : 5,5 % par an les années 1 à 3, 4,5 % par an les années 4 à 6, et 3,5 % par an les années 7 à 9 (soit 40,5 % de la base bâtie sur 9 ans).",
  "Comparaison directe avec les deux régimes de droit commun du CGI : le Micro-BIC (abattement de 50 %, art. 50-0) et le LMNP Réel linéaire (art. 39 C).",
  "Plafonnement de l'amortissement au résultat locatif avant amortissement (pas de création de déficit fiscal imputable sur le revenu global).",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Que modélise ce simulateur de loi Jeanbrun ?",
    answer:
      "Ce simulateur compare, sur une période d'engagement de 9 ans, un barème d'amortissement dégressif du bâti (5,5 % les trois premières années, 4,5 % les trois suivantes et 3,5 % les trois dernières, sur 80 % du prix du bien) avec les deux régimes fiscaux de référence en vigueur : le Micro-BIC (abattement forfaitaire de 50 %) et le régime LMNP Réel linéaire.",
  },
  {
    question: "Pourquoi exclut-on 20 % du prix d'acquisition pour le calcul de l'amortissement ?",
    answer:
      "En fiscalité immobilière française, un terrain ne subit pas de dépréciation irréversible liée au temps et n'est donc jamais amortissable. Seule la part correspondant à la construction (généralement retenue entre 80 % et 85 % du prix total hors terrain) peut faire l'objet d'une dotation annuelle aux amortissements.",
  },
  {
    question: "Quelle est la différence entre un amortissement dégressif sur 9 ans et le LMNP Réel classique ?",
    answer:
      "En LMNP Réel classique, la construction est amortie de manière linéaire par composants sur une durée longue (souvent 25 à 35 ans, soit environ 2,8 % à 3,3 % par an). Un profil dégressif concentre une dotation plus élevée au cours des six premières années (5,5 % puis 4,5 %), ce qui absorbe des recettes locatives plus importantes en début de détention.",
  },
  {
    question: "Comment simuler plus finement mes amortissements de mobilier et mes intérêts d'emprunt ?",
    answer:
      "Pour détailler séparément vos intérêts d'emprunt, vos charges de copropriété et l'amortissement sur 7 ans de vos meubles, utilisez notre simulateur dédié à la fiscalité LMNP au régime réel.",
  },
];

function SimulateurJeanbrunJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Simulateur loi Jeanbrun", url: "https://lokna.fr/outils/simulateur-loi-jeanbrun" },
    ]),
    buildWebApplicationSchema({
      name: "Simulateur Loi Jeanbrun — Amortissement Dégressif vs LMNP",
      description:
        "Comparez sur 9 ans un barème d'amortissement locatif dégressif (5,5 % / 4,5 % / 3,5 %) avec le régime Micro-BIC et le LMNP Réel linéaire.",
      url: "/outils/simulateur-loi-jeanbrun",
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function SimulateurLoiJeanbrunPage() {
  return (
    <>
      <SimulateurJeanbrunJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Simulateur comparatif · 9 ans"
            title="Simulateur loi Jeanbrun : amortissement dégressif sur 9 ans vs LMNP"
            intro="Comparez sur 9 ans l'impact d'un profil d'amortissement dégressif (5,5 %, 4,5 % puis 3,5 % sur 80 % de la valeur du bien) face au régime Micro-BIC et au LMNP Réel linéaire."
            facts={[
              { label: "Horizon", value: "Projection sur 9 ans" },
              { label: "Base bâtie", value: "80 % du prix hors terrain" },
              { label: "Comparatif", value: "Micro-BIC, LMNP linéaire, Dégressif" },
            ]}
          />

          <div className="mt-10">
            <JeanbrunSimulator />
          </div>

          <section aria-labelledby="hypotheses-jeanbrun-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="hypotheses-jeanbrun-title" className="text-[17px] font-semibold text-ink">
              Hypothèses de calcul retenues dans le comparateur
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {HYPOTHESES_SIMULATION.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-jeanbrun" title="Comprendre l'effet d'un amortissement dégressif sur la fiscalité locative">
              <p>
                Lorsqu&apos;un propriétaire bailleur investit dans un logement locatif, le poids de l&apos;impôt sur le revenu
                (selon sa tranche marginale d&apos;imposition de 0 % à 45 %) additionné aux prélèvements sociaux (17,2 %) dépend
                directement du mode de détermination de l&apos;assiette imposable.
              </p>
              <h3>1. Amortissement dégressif sur 9 ans vs amortissement linéaire</h3>
              <p>
                Dans un schéma d&apos;amortissement dégressif en trois paliers triennaux (5,5 % par an les années 1 à 3, 4,5 % les
                années 4 à 6, puis 3,5 % les années 7 à 9 sur 80 % du prix d&apos;achat), le propriétaire amortit{" "}
                <strong>40,5 % de la valeur de la construction</strong> en neuf ans (soit 32,4 % du prix total terrain inclus). À
                titre de comparaison, un amortissement linéaire sur 30 ans en{" "}
                <Link href="/outils/simulateur-fiscalite-lmnp">LMNP au régime réel</Link> représente 30 % de la base bâtie sur la
                même période de neuf ans.
              </p>
              <h3>2. Quand les deux régimes produisent-ils le même impôt ?</h3>
              <p>
                Tant que le résultat locatif (loyers moins charges déductibles) est inférieur à la dotation d&apos;amortissement
                linéaire, la base imposable est déjà ramenée à 0 € dans les deux cas en application du plafonnement de
                l&apos;article 39 C du CGI. L&apos;écart fiscal apparaît lorsque le rendement locatif est élevé ou que les charges
                et <Link href="/outils/simulateur-pret-immobilier">intérêts d&apos;emprunt</Link> diminuent : la dotation
                dégressive plus forte permet alors de continuer à gommer le bénéfice imposable.
              </p>
              <p>
                Pour évaluer la rentabilité globale de votre acquisition avant impôt, complétez votre analyse avec notre{" "}
                <Link href="/outils/calculateur-rendement">calculateur de rentabilité locative</Link> et notre{" "}
                <Link href="/outils/calculateur-plus-value">calculateur de plus-value immobilière</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur la simulation d'amortissement sur 9 ans" />
          </div>

          <div className="mt-16">
            <ToolCta title="Pilotez vos locations au quotidien avec Lokna">
              Centralisez vos biens, vos baux, le suivi de vos loyers et l&apos;édition de vos quittances PDF dans un seul espace
              clair et sans engagement.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
