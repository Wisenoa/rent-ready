import type { Metadata } from "next";
import { ImpayesLoyerClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Calculateur Loyer Impayé — Gratuit | RentReady",
    description:
      "Évaluez le montant total des loyers impayés et les démarches à suivre pour le recouvrement. Estimez les indemnités et la procédure d'expulsion en cas d'impayés de loyer.",
    url: "/outils/calculateur-impayes-loyer",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Loyer Impayé", href: "/outils/calculateur-impayes-loyer" },
];

function ImpayesLoyerJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Loyer Impayé", url: "https://www.rentready.fr/outils/calculateur-impayes-loyer" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Loyer Impayé",
      description:
        "Estimez le montant total des loyers impayés avec les pénalités et découvrez la procédure de recouvrement. Outil gratuit pour propriétaires bailleurs.",
      url: "/outils/calculateur-impayes-loyer",
    }),
    buildHowToSchema({
      name: "Comment recouvrer un loyer impayé",
      description:
        "Conocez les étapes legales pour recouvrer un loyer impayé : la relance, la mise en demeure, la procédure de conciliation, et eventuellement l'expulsion.",
      url: "/outils/calculateur-impayes-loyer",
      steps: [
        {
          name: "Envoyez une lettre de relance",
          text: "Dans les premiers jours d'impayé, envoyez un courrier de relance simple rappelant l'obligation de payer et la date limite.",
        },
        {
          name: "Envoyez une mise en demeure",
          text: "Après 15 jours, envoyez une mise en demeure avec accusé de réception fixant un délai de paiement de 8 jours minimum.",
        },
        {
          name: "Engagez la procédure de recouvrement",
          text: "Sans réponse, saisissez la commission de conciliation ou engagez une procédure d'expulsion devant le tribunal.",
        },
        {
          name: "Calculez les indemnités",
          text: "Le bailleur peut réclamer des intérêts de retard (3%x an en général) et des dommages et intérêts pour trouble de jouissance.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function ImpayesLoyerPage() {
  return (
    <>
      <ImpayesLoyerJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>⚠️</span> Outil d'information
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Loyer Impayé
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez le montant total des loyers impayés, les pénalités applicables et les indemnités de procédure. Cet outil est à titre informatif.
            </p>
          </div>
          <ImpayesLoyerClient />
        </div>
      </div>
    </>
  );
}
