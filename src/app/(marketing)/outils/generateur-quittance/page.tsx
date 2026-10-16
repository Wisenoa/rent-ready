import Link from "next/link";
import { Check } from "lucide-react";

import { GenerateurQuittanceClient } from "./calculator-client";
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
    title: "Générateur de Quittance de Loyer 2026 — PDF Conforme",
    description:
      "Générez gratuitement une quittance de loyer PDF ou un reçu de paiement partiel conforme à la loi du 6 juillet 1989. Aperçu en direct, prorata et téléchargement sans inscription.",
    url: "/outils/generateur-quittance",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Générateur de quittance", href: "/outils/generateur-quittance" },
];

const MENTIONS_OBLIGATOIRES = [
  "Identité et adresse du propriétaire bailleur (ou de la SCI).",
  "Identité du locataire et adresse précise du logement loué.",
  "Période de location acquittée (mois complet ou prorata temporis d'entrée/sortie).",
  "Séparation obligatoire entre le loyer hors charges et la provision ou le forfait de charges (art. 21 loi du 6 juillet 1989).",
  "Date et mode du règlement, ainsi que le solde restant dû s'il s'agit d'un reçu de paiement partiel.",
  "Remise strictement gratuite au locataire qui en fait la demande : aucuns frais d'édition ou d'envoi ne peuvent être facturés.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quand faut-il remettre un reçu plutôt qu'une quittance de loyer ?",
    answer:
      "La quittance de loyer atteste que le locataire a réglé l'intégralité du loyer et des charges de la période : elle a un effet libératoire. Si le locataire ne règle qu'une partie de l'échéance, l'article 21 de la loi n° 89-462 du 6 juillet 1989 impose de délivrer un reçu de paiement partiel indiquant la somme encaissée et le solde restant dû, afin de préserver vos droits sur l'impayé.",
  },
  {
    question: "Comment calculer une quittance en cas d'entrée ou de sortie en cours de mois ?",
    answer:
      "Lorsqu'un bail débute ou prend fin en cours de mois, le loyer et les charges sont calculés au prorata du nombre réel de jours d'occupation rapporté au nombre total de jours du mois (28, 29, 30 ou 31 jours). Activez l'option « Prorata » dans l'étape 2 pour calculer automatiquement les montants exacts.",
  },
  {
    question: "Peut-on transmettre la quittance de loyer par e-mail au format PDF ?",
    answer:
      "Oui, depuis la loi ALUR du 24 mars 2014 modifiant l'article 21 de la loi du 6 juillet 1989, le bailleur peut transmettre la quittance par voie dématérialisée (PDF joint à un e-mail) dès lors que le locataire a donné son accord exprès, souvent formalisé par une clause dans le bail.",
  },
  {
    question: "Le bailleur peut-il facturer des frais d'établissement ou d'affranchissement ?",
    answer:
      "Non. L'article 21 de la loi du 6 juillet 1989 dispose qu'aucuns frais liés à la gestion de l'avis d'échéance ou de la quittance ne peuvent être facturés au locataire. Toute clause contraire inscrite dans le bail est réputée non écrite (article 4 p de la même loi).",
  },
  {
    question: "Pendant combien de temps conserver ses quittances de loyer ?",
    answer:
      "Toutes les actions dérivant d'un contrat de bail sont soumises à un délai de prescription de trois ans (article 7-1 de la loi du 6 juillet 1989). Il est recommandé au bailleur comme au locataire de conserver les quittances et reçus pendant au moins trois ans après la fin du bail.",
  },
];

function GenerateurQuittanceJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Générateur de quittance", url: "https://lokna.fr/outils/generateur-quittance" },
    ]),
    buildWebApplicationSchema({
      name: "Générateur de Quittance de Loyer PDF",
      description:
        "Générez gratuitement une quittance de loyer PDF ou un reçu de paiement partiel conforme à l'article 21 de la loi du 6 juillet 1989.",
      url: "/outils/generateur-quittance",
    }),
    buildHowToSchema({
      name: "Comment générer une quittance de loyer PDF conforme",
      description:
        "Établissez une quittance de loyer ou un reçu de paiement partiel au format PDF avec séparation du loyer hors charges et des charges.",
      url: "/outils/generateur-quittance",
      steps: [
        {
          name: "Renseignez le bailleur et le locataire",
          text: "Indiquez les noms et adresses du propriétaire bailleur et du locataire, ainsi que l'adresse du logement loué.",
        },
        {
          name: "Saisissez le loyer nu et les charges de la période",
          text: "Choisissez le mois, activez le prorata si nécessaire, et distinguez le loyer hors charges des provisions ou du forfait de charges.",
        },
        {
          name: "Précisez le règlement reçu",
          text: "Sélectionnez paiement intégral (quittance) ou paiement partiel (reçu avec solde restant dû), puis téléchargez le PDF.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function GenerateurQuittancePage() {
  return (
    <>
      <GenerateurQuittanceJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Générateur de quittance de loyer PDF"
            intro="Établissez en direct une quittance de loyer conforme à l'article 21 de la loi du 6 juillet 1989 — ou un reçu de paiement partiel lorsque l'échéance n'est pas intégralement réglée — et téléchargez le PDF sans laisser d'adresse e-mail."
            facts={[
              { label: "Cadre légal", value: "Loi n° 89-462 · art. 21" },
              { label: "Cas gérés", value: "Mois complet, prorata, reçu partiel" },
              { label: "Export", value: "PDF immédiat + copie texte" },
            ]}
          />

          <div className="mt-10">
            <GenerateurQuittanceClient />
          </div>

          <section aria-labelledby="mentions-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="mentions-title" className="text-[17px] font-semibold text-ink">
              Les 6 règles de conformité vérifiées par le générateur
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {MENTIONS_OBLIGATOIRES.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000028806698"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Légifrance — article 21 de la loi n° 89-462 du 6 juillet 1989
              </a>{" "}
              et{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F31699"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr (F31699)
              </a>
              . Consultez aussi notre{" "}
              <Link
                href="/guides/quittance-loyer"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
              >
                guide complet de la quittance de loyer
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-quittance" title="Comment établir une quittance de loyer sans erreur juridique ?">
              <p>
                En location vide comme en location meublée à usage de résidence principale, la{" "}
                <strong>quittance de loyer</strong> est l&apos;acte écrit par lequel le propriétaire bailleur reconnaît avoir reçu
                du locataire l&apos;intégralité des sommes appelées au titre du loyer et des charges pour une échéance donnée. Sa
                délivrance est encadrée par l&apos;article 21 de la loi n° 89-462 du 6 juillet 1989.
              </p>
              <h3>Pourquoi ne faut-il jamais émettre une quittance en cas de paiement partiel ?</h3>
              <p>
                Remettre une quittance alors qu&apos;une partie du loyer ou des charges reste impayée crée une présomption de
                libération au profit du locataire. Si le locataire verse 500 € sur un loyer charges comprises de 850 €, la loi
                prévoit que le bailleur délivre un <strong>reçu de paiement partiel</strong> qui constate l&apos;encaissement des
                500 € et réserve expressément le recouvrement du solde de 350 €. En cas de retard persistant, vous pouvez ensuite
                utiliser notre{" "}
                <Link href="/outils/lettre-relance-loyer">générateur de lettre de relance de loyer</Link>.
              </p>
              <h3>Pourquoi distinguer le loyer nu et les provisions sur charges ?</h3>
              <p>
                L&apos;article 21 impose que la quittance porte le détail des sommes versées par le locataire en distinguant le
                loyer et les charges. Cette séparation permet, d&apos;une part, au locataire de justifier de son loyer hors
                charges auprès de la CAF ou de la MSA, et d&apos;autre part, au bailleur d&apos;additionner les provisions versées
                tout au long de l&apos;année lors de la{" "}
                <Link href="/outils/calculateur-charges-locatives">régularisation annuelle des charges locatives</Link>.
              </p>
              <h3>Vous cherchez la structure commentée du document ?</h3>
              <p>
                Si vous souhaitez consulter le détail clause par clause des mentions obligatoires ou préparer un exemplaire vierge,
                rendez-vous sur notre page dédiée au{" "}
                <Link href="/outils/modele-quittance-loyer-pdf">modèle de quittance de loyer PDF</Link> ou sur notre{" "}
                <Link href="/templates/recu-loyer">modèle de reçu de paiement partiel</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur la quittance de loyer" />
          </div>

          <div className="mt-16">
            <ToolCta title="Vous éditez plusieurs quittances chaque mois ?">
              Dans Lokna, vos biens, vos locataires et vos montants de loyer sont déjà enregistrés : dès que vous validez le
              paiement complet d&apos;une échéance, la quittance PDF est prête à télécharger — ou le reçu partiel si un solde
              reste à régler.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
