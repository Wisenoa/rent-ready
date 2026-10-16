import Link from "next/link";
import { Check } from "lucide-react";

import { SurfaceHabitableClient } from "./calculator-client";
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
    title: "Calculateur de Surface Habitable (Loi Boutin) 2026 — Art. R. 156-1 CCH",
    description:
      "Calculez gratuitement la surface habitable (loi Boutin, article R. 156-1 du CCH) pièce par pièce et vérifiez la règle d'écart de 5 % (article 3-1 de la loi du 6 juillet 1989).",
    url: "/outils/calculateur-surface-habitable",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur de surface habitable", href: "/outils/calculateur-surface-habitable" },
];

const REGLES_SURFACE = [
  "Article R. 156-1 du CCH : exclusion de toute partie de pièce dont la hauteur sous plafond est inférieure à 1,80 mètre.",
  "Annexes exclues de la surface habitable : caves, sous-sols, remises, garages, terrasses, loggias, balcons, vérandas et combles non aménagés.",
  "Seuil de décence (décret n° 2002-120 du 30 janvier 2002) : au moins une pièce principale de 9 m² et 2,20 m de hauteur (ou un volume habitable ≥ 20 m³).",
  "Tolérance du vingtième (art. 3-1 loi du 6 juillet 1989) : si la surface réelle est inférieure de plus de 5 % à celle du bail, le locataire peut exiger une baisse proportionnelle du loyer.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quelle est la différence entre la surface habitable (loi Boutin) et la surface loi Carrez ?",
    answer:
      "Toutes deux excluent les surfaces d'une hauteur sous plafond inférieure à 1,80 m, les caves, garages, balcons et terrasses. En revanche, la surface habitable (article R. 156-1 du CCH, obligatoire dans tout bail d'habitation) exclut également les vérandas, les combles non aménagés et les sous-sols, alors que la surface privative loi Carrez (utilisée pour la vente d'un lot de copropriété) inclut les vérandas closes et les combles non aménagés de plus de 1,80 m.",
  },
  {
    question: "Que se passe-t-il si la surface réelle est inférieure de plus de 5 % à celle inscrite dans le bail ?",
    answer:
      "En vertu de l'article 3-1 de la loi n° 89-462 du 6 juillet 1989, lorsque la surface habitable réelle est inférieure de plus d'un vingtième (5 %) à celle exprimée dans le contrat de location, le bailleur supporte, à la demande du locataire, une diminution du loyer proportionnelle à l'écart constaté.",
  },
  {
    question: "Quels sont les délais légaux de l'action en diminution de loyer (article 3-1) ?",
    answer:
      "Le locataire peut demander au bailleur à tout moment la diminution du loyer. À défaut d'accord du bailleur ou à défaut de réponse dans un délai de 2 mois à compter de la demande en diminution, le juge peut être saisi dans le délai de 4 mois à compter de cette même demande. Si la demande du locataire intervient moins de 6 mois après la prise d'effet du bail, la baisse de loyer rétroagit à la date de prise d'effet du contrat ; au-delà de 6 mois, elle prend effet à la date de la demande.",
  },
  {
    question: "Les placards intégrés comptent-ils dans la surface habitable ?",
    answer:
      "Oui, à condition que la hauteur sous plafond à l'intérieur du placard soit au moins égale à 1,80 mètre et qu'il ne s'agisse pas d'une embrasure de porte ou d'une gaine technique.",
  },
];

function CalculateurSurfaceHabitableJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Calculateur de surface habitable", url: "https://lokna.fr/outils/calculateur-surface-habitable" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Surface Habitable (Loi Boutin)",
      description:
        "Calculez la surface habitable d'un logement pièce par pièce selon l'article R. 156-1 du CCH et vérifiez l'écart de 5 % prévu à l'article 3-1 de la loi du 6 juillet 1989.",
      url: "/outils/calculateur-surface-habitable",
    }),
    buildHowToSchema({
      name: "Comment calculer la surface habitable loi Boutin d'un logement",
      description:
        "Additionnez les pièces habitables après déduction des parties sous 1,80 m et des annexes exclues.",
      url: "/outils/calculateur-surface-habitable",
      steps: [
        {
          name: "Ajoutez chaque pièce et qualifiez-la",
          text: "Distinguez les pièces habitables des annexes exclues (cave, balcon, terrasse, véranda, garage).",
        },
        {
          name: "Renseignez la surface au sol et la partie sous 1,80 m",
          text: "Indiquez la surface de plancher et la fraction éventuelle dont la hauteur sous plafond est inférieure à 1,80 m.",
        },
        {
          name: "Vérifiez l'écart éventuel avec le bail",
          text: "Comparez la surface habitable totale à celle inscrite au contrat de location pour contrôler le seuil légal de 5 %.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function CalculateurSurfaceHabitablePage() {
  return (
    <>
      <CalculateurSurfaceHabitableJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Calculateur de surface habitable (loi Boutin)"
            intro="Calculez pièce par pièce la surface habitable exacte à mentionner dans votre bail d'habitation (article R. 156-1 du CCH) et vérifiez si un écart supérieur à 5 % ouvre droit à une réduction proportionnelle du loyer."
            facts={[
              { label: "Définition", value: "Art. R. 156-1 du CCH (h ≥ 1,80 m)" },
              { label: "Décence", value: "Min. 9 m² (décret du 30 janv. 2002)" },
              { label: "Tolérance bail", value: "5 % (art. 3-1 loi du 6 juil. 1989)" },
            ]}
          />

          <div className="mt-10">
            <SurfaceHabitableClient />
          </div>

          <section aria-labelledby="regles-surface-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="regles-surface-title" className="text-[17px] font-semibold text-ink">
              Les 4 règles légales de mesurage de la surface habitable
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {REGLES_SURFACE.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043819065"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Légifrance — Article R. 156-1 du Code de la construction et de l&apos;habitation
              </a>{" "}
              et{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F32083"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr — Surface habitable d&apos;un logement (F32083)
              </a>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-surface" title="Pourquoi le mesurage exact de la surface habitable est indispensable dans un bail ?">
              <p>
                L&apos;article 3 de la loi n° 89-462 du 6 juillet 1989 rend obligatoire la mention de la{" "}
                <Link href="/glossaire-immobilier/surface-habitable">surface habitable</Link> de la chose louée dans tout contrat
                de bail d&apos;habitation à usage de résidence principale (vide ou meublé).
              </p>
              <h3>1. Ce qui entre et ce qui n&apos;entre pas dans la surface habitable</h3>
              <p>
                Selon l&apos;article R. 156-1 du Code de la construction et de l&apos;habitation (ancien article R. 111-2), la
                surface habitable comprend les pièces de vie (séjour, chambres, bureau), la cuisine, les couloirs, entrées, salles
                de bains, WC et rangements intérieurs dès lors que leur hauteur sous plafond atteint au moins{" "}
                <strong>1,80 mètre</strong>. Sont en revanche exclus : l&apos;épaisseur des murs et cloisons, les marches et cages
                d&apos;escaliers, les gaines, les embrasures de portes et de fenêtres, ainsi que la totalité des caves, sous-sols,
                remises, garages, terrasses, loggias, balcons, séchoirs extérieurs, <strong>vérandas</strong> et combles non
                aménagés.
              </p>
              <h3>2. Conséquence d&apos;une erreur supérieure à 5 % (article 3-1)</h3>
              <p>
                Si la surface mentionnée dans le{" "}
                <Link href="/templates/bail-vide">contrat de bail de location vide</Link> ou{" "}
                <Link href="/templates/bail-meuble">meublée</Link> surestime la surface habitable réelle de plus de 5 % (1/20e), le
                locataire est en droit d&apos;exiger une baisse proportionnelle de son{" "}
                <Link href="/outils/calculateur-loyer">loyer hors charges</Link>. Dans les communes soumises à l&apos;encadrement
                des loyers au m², une erreur de surface fausse également le calcul du plafond préfectoral majoré.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur la surface habitable (loi Boutin)" />
          </div>

          <div className="mt-16">
            <ToolCta title="Renseignez vos biens et vos baux dans Lokna">
              Enregistrez la surface habitable, le loyer et les charges de chacun de vos logements et retrouvez tous vos documents
              locatifs dans un seul espace.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
