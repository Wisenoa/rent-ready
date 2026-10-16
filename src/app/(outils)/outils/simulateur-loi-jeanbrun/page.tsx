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
    title: "Simulateur Loi Jeanbrun 2026 — Statut du Bailleur Privé (Amortissement)",
    description:
      "Simulez l'amortissement fiscal sur 9 ans (3,5 %, 4,5 %, 5,5 %) du statut du bailleur privé en location nue (loi de finances 2026) face au régime foncier classique.",
    url: "/outils/simulateur-loi-jeanbrun",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Simulateur statut bailleur privé", href: "/outils/simulateur-loi-jeanbrun" },
];

const HYPOTHESES_SIMULATION = [
  "Régime applicable à la location nue (revenus fonciers, loi n° 2026-103 du 19 février 2026 de finances pour 2026).",
  "Base amortissable égale à 80 % du prix d'acquisition (la quote-part de 20 % pour le terrain est exclue).",
  "Taux d'amortissement annuel sur 9 ans selon le loyer conventionné : 3,5 % (intermédiaire), 4,5 % (social) ou 5,5 % (très social).",
  "Plafonds annuels de déduction par foyer fiscal : 8 000 € (intermédiaire), 10 000 € (social), 12 000 € (très social). L'excédent n'est pas reportable.",
  "Déficit foncier imputable sur le revenu global dans la limite de 10 700 € / an (hors intérêts d'emprunt), l'excédent étant reportable sur 10 ans sur les revenus fonciers.",
  "Éligibilité : logements en immeuble collectif (neuf ou ancien avec travaux ≥ 30 % du prix total), location nue en résidence principale pendant 9 ans.",
  "Règle de sortie à la revente : les amortissements fiscalement déduits minorent le prix d'achat retenu pour le calcul de la plus-value.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Qu'est-ce que le statut du bailleur privé (dispositif Jeanbrun) ?",
    answer:
      "Instauré par la loi de finances pour 2026, le statut du bailleur privé permet aux propriétaires qui louent un logement nu en résidence principale pendant au moins 9 ans de déduire de leurs revenus fonciers un amortissement annuel du bien calculé sur 80 % du prix d'acquisition, en contrepartie d'un engagement de loyer modéré.",
  },
  {
    question: "Quels sont les taux d'amortissement et les plafonds applicables ?",
    answer:
      "Le taux annuel dépend du niveau de conventionnement choisi : 3,5 % par an en loyer intermédiaire (plafonné à 8 000 € / an par foyer fiscal), 4,5 % en loyer social (plafonné à 10 000 € / an, décote d'environ 15 % par rapport au marché) et 5,5 % en loyer très social (plafonné à 12 000 € / an, décote d'environ 30 %). L'excédent éventuel au-delà du plafond annuel n'est pas reportable. Cet amortissement n'est pas soumis au plafonnement global des niches fiscales de 10 000 €.",
  },
  {
    question: "Quels types de logements sont éligibles au dispositif ?",
    answer:
      "Le dispositif est réservé aux logements situés dans des immeubles collectifs (les maisons individuelles sont exclues). Il s'applique aux logements neufs (VEFA) ou aux logements anciens faisant l'objet de travaux de rénovation et d'amélioration représentant au moins 30 % du coût total d'acquisition.",
  },
  {
    question: "Peut-on louer à un membre de sa famille avec le statut Jeanbrun ?",
    answer:
      "Non. La loi interdit expressément de louer le bien à un membre de son foyer fiscal, à un ascendant ou à un descendant, contrairement à certains dispositifs fiscaux antérieurs.",
  },
  {
    question: "Comment sont traités les amortissements lors de la revente du bien ?",
    answer:
      "À la différence du régime LMNP historique, la loi prévoit que les amortissements déduits sous le statut du bailleur privé sont déduits du prix d'acquisition pour le calcul de la plus-value immobilière des particuliers. L'avantage fiscal perçu durant la location est ainsi pris en compte lors de la cession, même si les abattements pour durée de détention restent applicables.",
  },
];

function SimulateurJeanbrunJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Simulateur statut bailleur privé", url: "https://lokna.fr/outils/simulateur-loi-jeanbrun" },
    ]),
    buildWebApplicationSchema({
      name: "Simulateur Statut du Bailleur Privé (Loi Jeanbrun 2026)",
      description:
        "Calculez l'amortissement fiscal sur 9 ans (3,5 % à 5,5 %) du statut du bailleur privé en location nue et comparez avec le régime foncier classique.",
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
            eyebrow="Statut du bailleur privé · Loi de finances 2026"
            title="Simulateur loi Jeanbrun : statut du bailleur privé (amortissement sur 9 ans)"
            intro="Calculez la déduction d'amortissement fiscal sur 9 ans (3,5 % à 5,5 % sur 80 % du bien) pour un investissement en location nue, comparez avec le régime foncier réel classique et estimez l'imputation sur votre revenu global."
            facts={[
              { label: "Régime", value: "Location nue (revenus fonciers)" },
              { label: "Base amortissable", value: "80 % du prix hors terrain" },
              { label: "Taux annuel", value: "3,5 % à 5,5 % selon loyer" },
            ]}
          />

          <div className="mt-10">
            <JeanbrunSimulator />
          </div>

          <section aria-labelledby="hypotheses-jeanbrun-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="hypotheses-jeanbrun-title" className="text-[17px] font-semibold text-ink">
              Conditions et règles juridico-fiscales du Statut du Bailleur Privé
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
            <ToolExplainer id="explications-jeanbrun" title="Comprendre le fonctionnement fiscal du Statut du Bailleur Privé">
              <p>
                Issu de la loi de finances pour 2026 (loi n° 2026-103 du 19 février 2026), le <strong>statut du bailleur privé</strong> (souvent désigné sous le nom de son rapporteur Vincent Jeanbrun) marque un changement structurel de la politique du logement en France : il remplace les réductions d&apos;impôt ponctuelles de type Pinel par un <strong>amortissement comptable pérenne en location nue</strong>.
              </p>
              <h3>1. Pourquoi un amortissement sur les revenus fonciers ?</h3>
              <p>
                Jusqu&apos;alors, seuls les loueurs en meublé (LMNP au régime réel) pouvaient déduire l&apos;amortissement de leur bien. En location nue, le propriétaire ne pouvait déduire que ses charges réelles et ses intérêts d&apos;emprunt, subissant une imposition souvent lourde (TMI de 30 % ou 41 % + 17,2 % de prélèvements sociaux) dès que le crédit était remboursé. Le statut Jeanbrun ouvre cette faculté d&apos;amortir la construction aux bailleurs louant des logements non meublés.
              </p>
              <h3>2. Les 3 taux selon la modération des loyers</h3>
              <p>
                L&apos;amortissement annuel s&apos;applique sur une durée minimale d&apos;engagement de location de 9 ans sur 80 % de la valeur d&apos;acquisition (le terrain représentant forfaitairement 20 % de foncier non amortissable) :
              </p>
              <ul>
                <li><strong>Secteur intermédiaire (3,5 % par an)</strong> : pour les logements dont le loyer respecte les plafonds intermédiaires de zone.</li>
                <li><strong>Secteur social (4,5 % par an)</strong> : pour les logements loués avec une décote d&apos;environ 15 % par rapport aux loyers de marché.</li>
                <li><strong>Secteur très social (5,5 % par an)</strong> : pour les logements loués avec une décote d&apos;environ 30 % à des ménages aux ressources modestes.</li>
              </ul>
              <h3>3. Déficit foncier et réintégration à la revente</h3>
              <p>
                Lorsque les charges déductibles et l&apos;amortissement excèdent les loyers perçus, le déficit foncier ainsi créé (hors intérêts d&apos;emprunt) s&apos;impute sur le revenu global du foyer fiscal dans la limite de <strong>10 700 € par an</strong>, procurant une économie d&apos;impôt sur le revenu immédiate. L&apos;excédent éventuel est reportable pendant 10 ans sur les revenus fonciers futurs.
              </p>
              <p>
                <strong>Attention à la revente :</strong> Contrairement au régime historique du LMNP, les amortissements déduits sous le statut du bailleur privé viennent diminuer le prix d&apos;achat retenu pour le calcul de la plus-value lors de la cession ultérieure du logement.
              </p>
              <p>
                Pour comparer ce dispositif avec les autres options d&apos;investissement, explorez notre{" "}
                <Link href="/outils/simulateur-fiscalite-lmnp">simulateur de fiscalité LMNP</Link>, notre{" "}
                <Link href="/outils/calculateur-rendement">calculateur de rendement locatif</Link> et notre{" "}
                <Link href="/outils/calculateur-plus-value">calculateur de plus-value immobilière</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur le Statut du Bailleur Privé (Loi Jeanbrun)" />
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
