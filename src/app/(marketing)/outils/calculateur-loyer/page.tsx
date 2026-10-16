import Link from "next/link";
import { Check } from "lucide-react";

import { LoyerCalculatorClient } from "./calculator-client";
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
    title: "Calculateur de Prorata de Loyer & Loyer au m² 2026",
    description:
      "Calculez gratuitement un prorata de loyer (entrée ou sortie en cours de mois en jours réels ou au trentième) ainsi que le loyer hors charges au m² et le plafond d'encadrement.",
    url: "/outils/calculateur-loyer",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur de loyer & prorata", href: "/outils/calculateur-loyer" },
];

const REGLES_CLES = [
  "Prorata d'entrée ou de sortie : le loyer et les provisions sur charges sont proportionnels au nombre de jours d'occupation dans le mois (jours d'état des lieux inclus).",
  "Convention des jours réels : en février (28 ou 29 jours), en avril (30 jours) ou en mars (31 jours), le diviseur correspond au nombre exact de jours du mois calendaire.",
  "Le prix au m² s'entend toujours hors charges (loyer nu) : les provisions ou le forfait de charges s'ajoutent séparément.",
  "En zone d'encadrement des loyers (art. 140 loi ELAN), le loyer de base hors charges ne peut pas dépasser le loyer de référence majoré (+20 %).",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Comment calculer un prorata de loyer en cas d'entrée ou de départ en cours de mois ?",
    answer:
      "La formule de référence consiste à multiplier le loyer mensuel (et séparément la provision sur charges) par le nombre de jours d'occupation effective dans le mois, puis à diviser le tout par le nombre réel de jours que compte ce mois (28, 29, 30 ou 31 jours). Par exemple, pour une entrée le 12 mars dans un logement loué 840 € HC, le locataire occupe les lieux du 12 au 31 mars inclus, soit 20 jours sur 31 : 840 × 20 ÷ 31 = 541,94 €.",
  },
  {
    question: "Faut-il diviser par 30 jours (trentième) ou par le nombre réel de jours du mois ?",
    answer:
      "À défaut de clause particulière dans le bail, la pratique recommandée par l'ANIL et retenue par les tribunaux est le calcul en jours calendaires réels du mois (28, 29, 30 ou 31 jours), car le loyer mensuel couvre la totalité des jours du mois concerné. Le calcul au trentième (base 30 jours) reste affiché par l'outil à titre de comparaison si les parties ont convenu de cette convention.",
  },
  {
    question: "Le locataire sortant doit-il payer le loyer jusqu'à la fin de son préavis même s'il rend les clés plus tôt ?",
    answer:
      "Oui, conformément à l'article 15 I de la loi du 6 juillet 1989, le locataire qui donne congé reste redevable du loyer et des charges pendant toute la durée de son délai de préavis (1 ou 3 mois), sauf si un nouveau locataire occupe le logement avant l'expiration du préavis avec l'accord du bailleur.",
  },
  {
    question: "Comment fonctionne le loyer de référence majoré en zone d'encadrement des loyers ?",
    answer:
      "Dans les communes qui appliquent le dispositif expérimental d'encadrement du niveau des loyers (article 140 de la loi ELAN : Paris, Lille, Lyon et Villeurbanne, Montpellier, Bordeaux, communes de Plaine Commune, Est Ensemble, Grand-Orly Seine Bièvre, Pays Basque, Grenoble-Alpes Métropole), un arrêté préfectoral fixe un loyer de référence hors charges par m². Le loyer de base ne peut excéder le loyer de référence majoré (égal au loyer de référence + 20 %), sauf complément de loyer justifié pour un logement de classe DPE A à E.",
  },
  {
    question: "Quelle est la surface minimale légale pour louer un logement ?",
    answer:
      "Selon l'article 4 du décret n° 2002-120 du 30 janvier 2002 relatif aux caractéristiques du logement décent, le logement doit disposer d'au moins une pièce principale ayant soit une surface habitable au moins égale à 9 m² et une hauteur sous plafond au moins égale à 2,20 m, soit un volume habitable au moins égal à 20 m³.",
  },
];

function CalculateurLoyerJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Calculateur de loyer & prorata", url: "https://lokna.fr/outils/calculateur-loyer" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Prorata de Loyer et de Loyer au m²",
      description:
        "Outil gratuit pour calculer le prorata de loyer en cas d'entrée ou de sortie en cours de mois, ainsi que le loyer hors charges au m² et le plafond d'encadrement.",
      url: "/outils/calculateur-loyer",
    }),
    buildHowToSchema({
      name: "Comment calculer un prorata de loyer ou un loyer au m²",
      description:
        "Obtenez le montant exact du loyer au prorata du nombre de jours occupés ou vérifiez le loyer au m².",
      url: "/outils/calculateur-loyer",
      steps: [
        {
          name: "Sélectionnez le mode Prorata ou Loyer au m²",
          text: "Choisissez le calcul au prorata pour une arrivée ou un départ en cours de mois, ou le calcul au m² pour fixer le loyer initial.",
        },
        {
          name: "Renseignez les dates ou la surface habitable",
          text: "En mode prorata, indiquez le premier et le dernier jour d'occupation dans le mois. En mode m², indiquez la surface habitable et le prix au m².",
        },
        {
          name: "Consultez le détail loyer nu et charges",
          text: "L'outil affiche séparément le loyer hors charges, les charges et le total charges comprises, prêt à être reporté sur la quittance.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function CalculateurLoyerPage() {
  return (
    <>
      <CalculateurLoyerJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Calculateur de prorata de loyer et de loyer au m²"
            intro="Calculez au centime près le prorata d'un loyer lors d'une entrée ou d'une sortie en cours de mois (en jours réels ou au trentième), ou vérifiez le loyer mensuel au m² et son plafond d'encadrement."
            facts={[
              { label: "Prorata", value: "Jours réels (28 à 31 j.) ou 30e" },
              { label: "Encadrement", value: "Loi ELAN · art. 140 (+20 %)" },
              { label: "Ventilation", value: "Loyer HC + charges séparés" },
            ]}
          />

          <div className="mt-10">
            <LoyerCalculatorClient />
          </div>

          <section aria-labelledby="regles-loyer-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="regles-loyer-title" className="text-[17px] font-semibold text-ink">
              Ce qu&apos;il faut vérifier avant d&apos;appeler le loyer
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {REGLES_CLES.map((regle) => (
                <li key={regle} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {regle}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F1314"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr — Fixation du loyer (F1314)
              </a>{" "}
              et{" "}
              <Link
                href="/glossaire-immobilier/encadrement-loyer"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
              >
                notre fiche sur l&apos;encadrement des loyers
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-loyer-prorata" title="Comment calculer un prorata de loyer et fixer son loyer initial ?">
              <p>
                Deux calculs reviennent à chaque changement de locataire : déterminer la première ou la dernière échéance
                lorsqu&apos;un bail commence ou se termine en cours de mois (<strong>prorata temporis</strong>), et vérifier le{" "}
                <strong>loyer hors charges au m²</strong> lors de la rédaction du nouveau contrat de location.
              </p>
              <h3>1. La formule du prorata de loyer en cours de mois</h3>
              <p>
                Lorsqu&apos;un locataire emménage après le 1er du mois ou que son{" "}
                <Link href="/outils/calculateur-preavis">préavis de départ</Link> s&apos;achève avant le dernier jour du mois, le
                loyer et la provision pour charges sont réduits proportionnellement à la durée d&apos;occupation :
              </p>
              <p className="not-prose rounded-lg bg-white px-4 py-3.5 text-center text-[15px] font-medium text-ink ring-1 ring-line">
                Montant au prorata = Montant mensuel × Nombre de jours occupés ÷ Nombre de jours du mois
              </p>
              <p>
                Une fois le règlement encaissé, vous pouvez éditer directement la quittance correspondante avec l&apos;option
                « Prorata » de notre <Link href="/outils/generateur-quittance">générateur de quittance de loyer PDF</Link>.
              </p>
              <h3>2. Calcul du loyer au m² et encadrement des loyers</h3>
              <p>
                La surface à prendre en compte dans un bail d&apos;habitation est toujours la{" "}
                <Link href="/outils/calculateur-surface-habitable">surface habitable (loi Boutin)</Link> définie à l&apos;article
                R. 156-1 du Code de la construction et de l&apos;habitation. Dans les agglomérations soumises à l&apos;encadrement
                préfectoral des loyers (article 140 de la loi ELAN), le contrat de bail doit mentionner trois valeurs publiées par
                arrêté préfectoral : le <strong>loyer de référence</strong>, le <strong>loyer de référence majoré (+20 %)</strong>{" "}
                et le <strong>loyer de référence minoré (−30 %)</strong>. En cours de bail, l&apos;augmentation annuelle reste
                plafonnée par la variation de l&apos;<Link href="/outils/calculateur-irl">Indice de Référence des Loyers (IRL)</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur le prorata et le calcul de loyer" />
          </div>

          <div className="mt-16">
            <ToolCta title="Gérez vos entrées, sorties et échéances de loyer dans Lokna">
              Enregistrez vos baux, suivez chaque échéance mensuelle ou au prorata et éditez vos quittances PDF conformes depuis
              un seul tableau de bord.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}