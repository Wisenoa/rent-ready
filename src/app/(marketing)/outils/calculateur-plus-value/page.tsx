import Link from "next/link";
import { Check } from "lucide-react";

import { PlusValueClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
  buildFAQPageSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { ToolHeader } from "@/components/marketing/tools/ToolHeader";
import { ToolCta, ToolExplainer, ToolFaq, type FaqItem } from "@/components/marketing/tools/ToolContent";

export const revalidate = 3600;

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur de Plus-Value Immobilière 2026 — Abattements & Impôt",
    description:
      "Calculez gratuitement votre plus-value immobilière imposable et l'impôt dû (19 % IR, 17,2 % prélèvements sociaux, forfaits 7,5 % et 15 %, abattements sur 22 et 30 ans, surtaxe).",
    url: "/outils/calculateur-plus-value",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur de plus-value immobilière", href: "/outils/calculateur-plus-value" },
];

const REGLES_FISCALES = [
  "Forfait frais d'acquisition de 7,5 % du prix d'achat (ou frais réels sur justificatifs, art. 150 VB II-3° CGI).",
  "Forfait travaux de 15 % du prix d'achat dès 5 années pleines de détention, sans avoir à fournir de factures (art. 150 VB II-4° CGI).",
  "Exonération totale d'impôt sur le revenu (19 %) au bout de 22 ans de détention et de prélèvements sociaux (17,2 %) au bout de 30 ans.",
  "Surtaxe progressive de 2 % à 6 % applicable uniquement lorsque la plus-value nette imposable à l'IR dépasse 50 000 € (art. 1609 nonies G CGI).",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Comment fonctionnent les abattements pour durée de détention sur la plus-value immobilière ?",
    answer:
      "Conformément à l'article 150 VC du Code général des impôts, l'abattement se calcule par année pleine révolue au-delà de la 5e année. Pour l'impôt sur le revenu (19 %), l'abattement est de 6 % par an de la 6e à la 21e année, puis de 4 % la 22e année (soit 100 % après 22 ans). Pour les prélèvements sociaux (17,2 %), il est de 1,65 % par an de la 6e à la 21e année, de 1,60 % la 22e année, puis de 9 % par an de la 23e à la 30e année (soit 100 % après 30 ans).",
  },
  {
    question: "Puis-je appliquer le forfait travaux de 15 % si je n'ai fait aucuns travaux ?",
    answer:
      "Oui. Pour un bien bâti détenu depuis plus de 5 ans, l'article 150 VB II-4° du CGI autorise le vendeur à majorer son prix d'acquisition d'un forfait de 15 %, sans avoir à produire de factures ni à démontrer la réalité des travaux.",
  },
  {
    question: "Dans quels cas la vente d'un bien immobilier est-elle exonérée de plus-value ?",
    answer:
      "Les principaux cas d'exonération prévus à l'article 150 U II du CGI sont : la cession de la résidence principale du vendeur au jour de la vente, toute cession dont le prix est inférieur ou égal à 15 000 €, la détention du bien depuis au moins 30 ans, et — sous conditions de remploi — la première cession d'un logement autre que la résidence principale lorsque le vendeur n'a pas été propriétaire de sa résidence principale au cours des 4 années précédentes.",
  },
  {
    question: "Quand s'applique la surtaxe sur les plus-values immobilières élevées ?",
    answer:
      "Prévue par l'article 1609 nonies G du CGI, la taxe supplémentaire s'applique aux cessions de biens bâtis lorsque la plus-value nette imposable à l'impôt sur le revenu (après abattement pour durée de détention) est strictement supérieure à 50 000 €. Son taux progresse par paliers lissés de 2 % à 6 %.",
  },
];

function CalculateurPlusValueJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Calculateur de plus-value immobilière", url: "https://lokna.fr/outils/calculateur-plus-value" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Plus-Value Immobilière",
      description:
        "Calculez gratuitement la plus-value immobilière brute et nette, les abattements pour durée de détention (22 et 30 ans), l'impôt sur le revenu (19 %), les prélèvements sociaux (17,2 %) et la surtaxe éventuelle.",
      url: "/outils/calculateur-plus-value",
    }),
    buildHowToSchema({
      name: "Comment calculer l'impôt sur la plus-value immobilière",
      description:
        "Estimez l'impôt prélevé par le notaire lors de la revente d'un bien locatif ou d'une résidence secondaire.",
      url: "/outils/calculateur-plus-value",
      steps: [
        {
          name: "Indiquez les prix d'achat, de vente et la durée de détention",
          text: "Renseignez le prix d'acquisition initial, le prix de cession net vendeur et le nombre d'années pleines de détention.",
        },
        {
          name: "Choisissez les forfaits ou frais réels",
          text: "Appliquez le forfait légal de 7,5 % pour les frais d'acquisition et de 15 % pour les travaux (après 5 ans), ou vos montants réels.",
        },
        {
          name: "Consultez le détail de l'impôt et le net vendeur",
          text: "Vérifiez la plus-value nette après abattements, l'impôt sur le revenu (19 %), les prélèvements sociaux (17,2 %) et la surtaxe.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function CalculateurPlusValuePage() {
  return (
    <>
      <CalculateurPlusValueJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Calculateur de plus-value immobilière"
            intro="Estimez l'impôt sur le revenu (19 %), les prélèvements sociaux (17,2 %) et l'éventuelle surtaxe prélevés lors de la revente d'un bien locatif ou d'une résidence secondaire, en intégrant les forfaits légaux de 7,5 % et 15 %."
            facts={[
              { label: "Exonération IR", value: "22 ans de détention" },
              { label: "Exonération PS", value: "30 ans de détention" },
              { label: "Références", value: "CGI art. 150 U à 150 VH" },
            ]}
          />

          <div className="mt-10">
            <PlusValueClient />
          </div>

          <section aria-labelledby="regles-pv-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="regles-pv-title" className="text-[17px] font-semibold text-ink">
              Règles du Code général des impôts appliquées
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {REGLES_FISCALES.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F10864"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr — Plus-value immobilière (F10864)
              </a>{" "}
              et{" "}
              <a
                href="https://www.impots.gouv.fr/particulier/plus-values-immobilieres"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                impots.gouv.fr
              </a>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-plus-value" title="Comment est calculé l'impôt sur la plus-value immobilière ?">
              <p>
                Lors de la vente d&apos;un bien immobilier détenu par un particulier (ou à travers une SCI relevant de l&apos;impôt
                sur le revenu), le notaire calcule et prélève directement l&apos;impôt sur la plus-value immobilière sur le prix
                de cession. Ce calcul suit trois étapes successives définies aux articles 150 VB et 150 VC du CGI.
              </p>
              <h3>1. Détermination de la plus-value brute</h3>
              <p>
                La plus-value brute est la différence entre le prix de cession et le prix d&apos;acquisition corrigé. Même sans
                justificatifs, un propriétaire qui a acheté son bien à titre onéreux depuis plus de cinq ans peut majorer son prix
                d&apos;achat de <strong>22,5 % au total</strong> : 7,5 % au titre du forfait de frais d&apos;acquisition et 15 % au
                titre du forfait de travaux.
              </p>
              <h3>2. Deux rythmes d&apos;abattement distincts (22 ans et 30 ans)</h3>
              <p>
                Les cinq premières années de détention n&apos;ouvrent droit à aucun abattement. À compter de la 6e année pleine :
              </p>
              <ul>
                <li>
                  <strong>Impôt sur le revenu (19 %)</strong> : abattement de 6 % par an de la 6e à la 21e année, puis 4 % la 22e
                  année, soit une exonération totale au bout de <strong>22 ans</strong>.
                </li>
                <li>
                  <strong>Prélèvements sociaux (17,2 %)</strong> : abattement de 1,65 % par an de la 6e à la 21e année, 1,60 % la
                  22e année, puis 9 % par an de la 23e à la 30e année, soit une exonération totale au bout de{" "}
                  <strong>30 ans</strong>.
                </li>
              </ul>
              <p>
                Si vous vendez un logement actuellement loué libre de toute occupation, vérifiez les délais de préavis avec notre{" "}
                <Link href="/outils/generateur-conge-vente">générateur de congé pour vente</Link>. Pour mesurer la rentabilité
                annuelle avant cession, utilisez notre{" "}
                <Link href="/outils/calculateur-rendement">calculateur de rendement locatif</Link> et notre{" "}
                <Link href="/outils/simulateur-fiscalite-lmnp">simulateur de fiscalité LMNP</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur la plus-value immobilière" />
          </div>

          <div className="mt-16">
            <ToolCta title="Conservez l'historique de vos biens et de vos baux dans Lokna">
              Centralisez vos contrats de location, vos états des lieux et vos quittances tout au long de la détention de votre
              patrimoine locatif.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
