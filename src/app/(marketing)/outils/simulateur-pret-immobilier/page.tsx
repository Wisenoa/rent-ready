import Link from "next/link";
import { Check } from "lucide-react";

import { SimulateurPretClient } from "./calculator-client";
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
    title: "Simulateur de Prêt Immobilier 2026 — Mensualité & Amortissement",
    description:
      "Calculez gratuitement votre mensualité de prêt immobilier, le coût total des intérêts et de l'assurance emprunteur, avec tableau d'amortissement annuel complet.",
    url: "/outils/simulateur-pret-immobilier",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Simulateur de prêt immobilier", href: "/outils/simulateur-pret-immobilier" },
];

const REPERES_FINANCEMENT = [
  "Règle HCSF : le taux d'endettement maximal est fixé à 35 % des revenus nets avant impôt (assurance emprunteur comprise).",
  "Durée maximale : 25 ans dans le cas général (jusqu'à 27 ans en VEFA ou en cas de travaux représentant au moins 25 % du coût total).",
  "Intérêts déductibles : en investissement locatif au régime réel (foncier ou LMNP), les intérêts et frais d'assurance réduisent votre base imposable.",
  "Tableau d'amortissement exact : la dernière échéance solde le centime résiduel pour un capital restant dû nul en fin de prêt.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Comment est calculée la mensualité d'un prêt immobilier à taux fixe ?",
    answer:
      "Pour un crédit amortissable à échéances constantes, la mensualité hors assurance est calculée selon la formule actuarielle M = C × r ÷ (1 − (1 + r)^(-n)), où C est le capital emprunté, r le taux nominal mensuel (taux annuel divisé par 12) et n le nombre total de mois. S'y ajoute la cotisation mensuelle d'assurance emprunteur.",
  },
  {
    question: "Pourquoi les intérêts annuels sont-ils importants pour un propriétaire bailleur ?",
    answer:
      "Lorsque vous déclarez vos loyers au régime réel (revenus fonciers en location vide ou BIC au régime réel en location meublée LMNP), les intérêts d'emprunt et les primes d'assurance payés chaque année sont déductibles de vos recettes locatives. Le tableau d'amortissement ci-dessus vous indique la part exacte d'intérêts payée année par année.",
  },
  {
    question: "Quel apport personnel prévoir pour un investissement locatif ?",
    answer:
      "Les banques demandent le plus souvent que l'apport personnel couvre au minimum les frais d'acquisition (frais de notaire et frais de garantie bancaire), soit environ 8 % à 10 % du prix d'achat dans l'ancien.",
  },
  {
    question: "Peut-on changer d'assurance emprunteur en cours de crédit ?",
    answer:
      "Oui. Depuis la loi Lemoine du 28 février 2022, tout emprunteur peut résilier et remplacer son contrat d'assurance de prêt immobilier à tout moment, sans frais, à condition que le nouveau contrat présente des garanties au moins équivalentes.",
  },
];

function SimulateurPretJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Simulateur de prêt immobilier", url: "https://lokna.fr/outils/simulateur-pret-immobilier" },
    ]),
    buildWebApplicationSchema({
      name: "Simulateur de Prêt Immobilier et Tableau d'Amortissement",
      description:
        "Calculez vos mensualités de crédit immobilier, le coût des intérêts et de l'assurance emprunteur, et consultez l'échéancier annuel d'amortissement.",
      url: "/outils/simulateur-pret-immobilier",
    }),
    buildHowToSchema({
      name: "Comment simuler un prêt immobilier locatif",
      description:
        "Estimez la mensualité de votre financement immobilier et le montant des intérêts déductibles année par année.",
      url: "/outils/simulateur-pret-immobilier",
      steps: [
        {
          name: "Renseignez le coût du projet et votre apport",
          text: "Indiquez le budget total à financer et le montant de votre apport personnel.",
        },
        {
          name: "Ajustez la durée et les taux",
          text: "Choisissez une durée de 7 à 27 ans et saisissez le taux nominal annuel ainsi que le taux d'assurance emprunteur.",
        },
        {
          name: "Consultez la mensualité et le tableau d'amortissement",
          text: "Visualisez immédiatement la mensualité totale, le coût du crédit et la répartition annuelle entre capital amorti et intérêts.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function SimulateurPretImmobilierPage() {
  return (
    <>
      <SimulateurPretJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Simulateur de prêt immobilier et tableau d'amortissement"
            intro="Calculez votre mensualité de crédit immobilier (capital, intérêts et assurance emprunteur) et consultez l'échéancier annuel complet pour préparer votre investissement locatif."
            facts={[
              { label: "Durées", value: "De 7 à 27 ans" },
              { label: "Échéancier", value: "Amortissement annuel détaillé" },
              { label: "Fiscalité", value: "Intérêts annuels isolés" },
            ]}
          />

          <div className="mt-10">
            <SimulateurPretClient />
          </div>

          <section aria-labelledby="reperes-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="reperes-title" className="text-[17px] font-semibold text-ink">
              Repères de financement pour un projet locatif
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {REPERES_FINANCEMENT.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Consultez aussi notre fiche sur l&apos;{" "}
              <Link
                href="/glossaire-immobilier/apport-personnel"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
              >
                apport personnel en investissement immobilier
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-pret" title="Comment articuler prêt immobilier, rendement et fiscalité locative ?">
              <p>
                Dans un projet d&apos;investissement locatif financé à crédit, la mensualité bancaire comporte trois composantes
                aux effets économiques bien distincts : le <strong>capital amorti</strong> (qui enrichit votre patrimoine net mois
                après mois), les <strong>intérêts d&apos;emprunt</strong> et l&apos;<strong>assurance emprunteur</strong>.
              </p>
              <h3>1. Effort d&apos;épargne et rendement locatif</h3>
              <p>
                Comparez la mensualité totale obtenue ici avec le revenu locatif net calculé sur notre{" "}
                <Link href="/outils/calculateur-rendement">calculateur de rentabilité locative</Link>. L&apos;écart entre le loyer
                net de charges encaissé et la mensualité de crédit détermine votre effort d&apos;épargne mensuel (ou votre
                excédent de trésorerie avant impôt).
              </p>
              <h3>2. Déduction des intérêts d&apos;emprunt en LMNP ou en revenus fonciers</h3>
              <p>
                Les premières années d&apos;un prêt amortissable sont celles où la part d&apos;intérêts dans la mensualité est la
                plus élevée. Reportez le montant des intérêts de l&apos;année 1 affiché dans le tableau d&apos;amortissement
                ci-dessus directement dans notre{" "}
                <Link href="/outils/simulateur-fiscalite-lmnp">simulateur de fiscalité LMNP</Link> pour mesurer l&apos;économie
                d&apos;impôt générée au régime réel.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur le prêt immobilier" />
          </div>

          <div className="mt-16">
            <ToolCta title="Suivez vos biens, vos baux et vos loyers avec Lokna">
              Une fois votre acquisition signée, gérez vos locataires, vos échéances de loyer et vos quittances PDF dans une
              interface claire pensée pour les propriétaires bailleurs.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
