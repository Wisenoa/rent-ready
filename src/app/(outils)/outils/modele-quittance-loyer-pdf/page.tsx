import Link from "next/link";
import { Check } from "lucide-react";

import { QuittanceTool } from "@/components/marketing/tools/QuittanceTool";
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
    title: "Modèle de Quittance de Loyer PDF Gratuit 2026 — Loi de 1989",
    description:
      "Modèle de quittance de loyer PDF gratuit et conforme à l'article 21 de la loi du 6 juillet 1989. Mentions obligatoires commentées, distinction loyer/charges et téléchargement immédiat.",
    url: "/outils/modele-quittance-loyer-pdf",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Modèle de quittance PDF", href: "/outils/modele-quittance-loyer-pdf" },
];

const CLAUSES_MODELE = [
  "En-tête explicite : « Quittance de loyer » (si règlement intégral) ou « Reçu de paiement partiel » (si solde impayé).",
  "Identification complète des parties : nom et adresse du bailleur (ou dénomination de la SCI) et du locataire.",
  "Désignation de l'adresse exacte du logement loué et de la période d'échéance quittancée.",
  "Ventilation réglementaire : montant du loyer hors charges séparé des provisions ou du forfait pour charges.",
  "Formule de quittancement datée (« dont quittance, sous réserve de tous mes droits ») et signature du bailleur.",
  "Gratuité absolue de la délivrance conformément à l'article 21 de la loi n° 89-462 du 6 juillet 1989.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Une quittance de loyer est-elle obligatoire chaque mois ?",
    answer:
      "L'article 21 de la loi n° 89-462 du 6 juillet 1989 oblige le bailleur à transmettre gratuitement une quittance au locataire qui en fait la demande, dès lors que le loyer et des charges de la période ont été intégralement payés. En pratique, de nombreux bailleurs la remettent après chaque règlement mensuel.",
  },
  {
    question: "Quelles mentions obligatoires doivent figurer sur un modèle de quittance de loyer ?",
    answer:
      "Le modèle doit comporter : les coordonnées du bailleur et du locataire, l'adresse du bien loué, la période concernée, la ventilation entre le loyer nu (hors charges) et la provision ou le forfait de charges, la somme totale reçue, ainsi que la date et le lieu d'émission.",
  },
  {
    question: "Quelle différence entre ce modèle de quittance et un avis d'échéance ?",
    answer:
      "L'avis d'échéance (ou appel de loyer) est envoyé avant le paiement pour rappeler le montant à régler. La quittance de loyer n'est délivrée qu'après encaissement effectif de la totalité de l'échéance et vaut preuve de paiement pour le locataire.",
  },
  {
    question: "Ce modèle convient-il à une location vide, meublée ou en SCI ?",
    answer:
      "Oui. L'article 21 de la loi du 6 juillet 1989 s'applique aussi bien aux locations vides qu'aux locations meublées à usage de résidence principale (par renvoi de l'article 25-3). Pour une SCI, indiquez simplement la dénomination sociale et le nom du gérant signataire dans le champ Bailleur.",
  },
  {
    question: "Comment générer les quittances de plusieurs biens sans ressaisir le modèle ?",
    answer:
      "Dans Lokna, les coordonnées du bailleur, des locataires et les montants de loyer et de charges sont conservés sur chaque bail. Lorsque vous enregistrez le paiement qui solde l'échéance, vous téléchargez la quittance PDF prête à transmettre à votre locataire.",
  },
];

function ModeleQuittanceJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Modèle de quittance PDF", url: "https://lokna.fr/outils/modele-quittance-loyer-pdf" },
    ]),
    buildWebApplicationSchema({
      name: "Modèle de Quittance de Loyer PDF Gratuit",
      description:
        "Modèle de quittance de loyer PDF gratuit conforme à l'article 21 de la loi n° 89-462 du 6 juillet 1989, avec personnalisation en ligne et téléchargement immédiat.",
      url: "/outils/modele-quittance-loyer-pdf",
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function ModeleQuittanceLoyerPdfPage() {
  return (
    <>
      <ModeleQuittanceJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Modèle officiel · PDF gratuit"
            title="Modèle de quittance de loyer PDF gratuit (conforme loi de 1989)"
            intro="Consultez la structure réglementaire d'une quittance de loyer conforme à l'article 21 de la loi du 6 juillet 1989, personnalisez les champs ci-dessous et téléchargez directement votre exemplaire au format PDF."
            facts={[
              { label: "Texte de référence", value: "Art. 21 loi du 6 juillet 1989" },
              { label: "Locations couvertes", value: "Vide, meublée, SCI" },
              { label: "Format", value: "PDF A4 prêt à imprimer ou envoyer" },
            ]}
          />

          <div className="mt-10">
            <QuittanceTool formLabel="Personnaliser le modèle de quittance de loyer PDF" />
          </div>

          <section aria-labelledby="clauses-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="clauses-title" className="text-[17px] font-semibold text-ink">
              Structure légale du modèle de quittance
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {CLAUSES_MODELE.map((clause) => (
                <li key={clause} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {clause}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources officielles :{" "}
              <a
                href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000028806698"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Légifrance (article 21 de la loi n° 89-462)
              </a>{" "}
              et{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F31699"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr — Quittance de loyer
              </a>
              . Retrouvez toutes les règles détaillées dans notre{" "}
              <Link
                href="/guides/quittance-loyer"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
              >
                guide de la quittance de loyer
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="anatomie-modele" title="Anatomie d'un modèle de quittance de loyer valable">
              <p>
                Un <strong>modèle de quittance de loyer</strong> sert à la fois de preuve de règlement pour le locataire (notamment
                comme justificatif de domicile ou pour ses démarches auprès de la CAF) et de pièce comptable pour le propriétaire
                bailleur. Pour être irréprochable au regard de la loi du 6 juillet 1989, il doit respecter trois principes
                essentiels.
              </p>
              <h3>1. La ventilation entre loyer nu et charges</h3>
              <p>
                Une quittance mentionnant uniquement une somme globale « charges comprises » est irrégulière. Le document doit
                isoler sur deux lignes distinctes le <strong>loyer hors charges</strong> et la{" "}
                <strong>provision sur charges</strong> (ou le forfait de charges en location meublée ou colocation). Lors de la
                clôture annuelle des comptes de copropriété, reportez les provisions appelées dans notre{" "}
                <Link href="/outils/calculateur-charges-locatives">calculateur de régularisation des charges locatives</Link>.
              </p>
              <h3>2. La réserve « sous réserve de tous mes droits »</h3>
              <p>
                La formule finale de quittancement précise que la quittance porte uniquement sur la période désignée, « sous
                réserve de tous mes droits » et sans présumer du paiement des échéances antérieures ni d&apos;une éventuelle{" "}
                <Link href="/outils/calculateur-irl">révision annuelle du loyer selon l&apos;IRL</Link>.
              </p>
              <h3>3. Que faire si le loyer n&apos;est payé que partiellement ?</h3>
              <p>
                Ne remettez jamais une quittance de loyer pour un règlement incomplet : basculez l&apos;outil ci-dessus sur{" "}
                <strong>« Paiement partiel »</strong> afin d&apos;éditer un reçu mentionnant le solde restant dû, ou consultez
                notre <Link href="/templates/recu-loyer">modèle de reçu de paiement de loyer</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur le modèle de quittance PDF" />
          </div>

          <div className="mt-16">
            <ToolCta title="Conservez vos quittances et vos loyers au même endroit">
              Avec Lokna, chaque bien et chaque bail conservent l&apos;historique des échéances : vous téléchargez la quittance PDF
              dès que le loyer complet est enregistré, ou un reçu en cas de règlement partiel.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
