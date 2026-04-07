import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, FileText, Download, CheckCircle } from "lucide-react";
import { SchemaMarkup, webApplicationSchema } from "@/components/seo/schema-markup";

export const metadata: Metadata = {
  title: "Modèle de Bail de Location — Contrat de Location Vide ou Meublé",
  description:
    "Téléchargez gratuitement notre modèle de bail de location conforme à la loi française. Contrat de location vide ou meublé, clause de révision IRL, état des lieux, dépôt de garantie.",
  alternates: {
    canonical: "https://www.rentready.fr/outils/modele-bail-location",
  },
  openGraph: {
    title: "Modèle de Bail de Location — Contrat de Location Vide ou Meublé",
    description:
      "Téléchargez gratuitement notre modèle de bail de location conforme à la loi française. Contrat de location vide ou meublé, clause de révision IRL, état des lieux.",
    url: "https://www.rentready.fr/outils/modele-bail-location",
    type: "website",
  },
};

const faqs = [
  {
    question: "Qu'est-ce qu'un bail de location ?",
    answer:
      "Le bail de location (ou contrat de location) est un document legal qui regit la relation entre un proprietaire bailleur et un locataire. Il definit les droits et obligations de chaque partie: montant du loyer, duree du bail, conditions de resililiation, depot de garantie, etc. En France, le bail doit respecter les dispositions de la loi du 6 juillet 1989.",
  },
  {
    question: "Quelle est la dureelegale d'un bail de location ?",
    answer:
      "Pour une location vide (non meublee), la duree minimale legale est de 3 ans lorsque le proprietaire est une personne physique, et de 6 ans lorsqu'il s'agit d'une personne morale. Pour une location meublee, la duree est de 1 an minimum, renouvelable par tacite reconduction.",
  },
  {
    question: "Quelles informations doivent figurer dans un bail de location ?",
    answer:
      "Le bail doit obligatoirement contenir: l'identite des parties (proprietaire et locataire), la description du logement (surface, adresse), la destination du logement (habitation ou mixte), le montant du loyer et des charges, le montant du depot de garantie, la date de debut et la duree du bail, la clause de revision du loyer (IRL), et les obligatoires annexes (DPE, risque, plomb, etc.).",
  },
  {
    question: "Comment calculer le depot de garantie ?",
    answer:
      "Le depot de garantie (caution) est limite a 1 mois de loyer hors charges pour une location vide, et 2 mois de loyer hors charges pour une location meublee. Il doit etre restitue dans un delai de 1 mois (ou 2 mois si l'etat des lieux d'entree et de sortie sont differents) apres le depart du locataire.",
  },
  {
    question: "Peut-on modifier un bail de location en cours ?",
    answer:
      "Le bail ne peut etre modifie qu'avec l'accord des deux parties. Toutefois, certaines modifications s'operent automatiquement: la revision annuelle du loyer (si prevue dans le bail), l'application des nouvelles normes legales, ou l'augmentation des charges recuperees justifiees.",
  },
];

const sections = [
  {
    title: "Informations generales",
    content:
      "Identification des parties, description du bien, destination du logement.",
  },
  {
    title: "Duree et conditions",
    content:
      "Date de prise d'effet, duree du bail, conditions de renouvellement et de resililiation.",
  },
  {
    title: "Loyer et charges",
    content:
      "Montant du loyer, provisions sur charges, modalites de paiement.",
  },
  {
    title: "Depot de garantie",
    content:
      'Montant de la caution, conditions de restitution, delais legaux.',
  },
  {
    title: "Revision du loyer",
    content:
      "Clause de revision IRL, formule de calcul, date anniversaire.",
  },
  {
    title: "Travaux et obligations",
    content:
      "Travaux du proprietaire, entretien du locataire, petites reparations.",
  },
];

export default function ModeleBailPage() {
  return (
    <>
      <SchemaMarkup
        data={webApplicationSchema(
          "Modele de Bail de Location",
          "/outils/modele-bail-location",
          "Modele de contrat de location gratuit conforme a la loi francaise. Bail vide ou meuble avec toutes les clauses obligatoires.",
          faqs
        )}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
            <FileText className="size-4" />
            Modèle gratuit et conforme
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Modèle de Bail de Location — Contrat de Location Vide ou Meublé
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Téléchargez notre <strong>modèle de bail de location</strong> conforme
            à la loi française. Ce contrat de location contient toutes les clauses
            obligatoires: révision IRL, état des lieux, dépôt de garantie, et
            obligations des parties.
          </p>
        </header>

        <section className="mb-16">
          <div className="rounded-xl border border-stone-200/60 bg-white p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-stone-900">
              Contenu du modèle de bail
            </h2>
            <ul className="space-y-3">
              {sections.map((section) => (
                <li key={section.title} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                  <div>
                    <strong className="text-stone-800">{section.title}</strong>
                    <p className="text-sm text-stone-600">{section.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Types de baux disponibles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-200/60 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-stone-800">
                Bail location vide
              </h3>
              <ul className="space-y-2 text-sm text-stone-600">
                <li>• Durée minimale: 3 ans (personne physique)</li>
                <li>• Dépôt de garantie: 1 mois de loyer</li>
                <li>• Préavis: 3 mois</li>
                <li>• Charges: provision mensuelle</li>
              </ul>
            </div>
            <div className="rounded-xl border border-stone-200/60 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-stone-800">
                Bail location meublé
              </h3>
              <ul className="space-y-2 text-sm text-stone-600">
                <li>• Durée minimale: 1 an</li>
                <li>• Dépôt de garantie: 2 mois de loyer</li>
                <li>• Préavis: 1 mois</li>
                <li>• Inventaire du mobilier inclus</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Annexes obligatoires
          </h2>
          <div className="space-y-3 text-stone-600">
            <p>
              Le bail doit être accompagné de plusieurs documents obligatoires
              selon la législation française:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>DPE (Diagnostic de Performance Énergétique)</li>
              <li>État des risques et pollutions</li>
              <li>Constat de risque d'exposition au plomb (CREP)</li>
              <li>Dossier amiante (si immeuble construit avant 1997)</li>
              <li>Information sur les bruits aéroportuaires (si applicable)</li>
              <li>Notice informative (loi ALUR)</li>
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur le bail de location
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-stone-200/60 bg-white"
              >
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-stone-800 select-none marker:text-stone-400">
                  {faq.question}
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-stone-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Clauses importantes du bail
          </h2>
          <div className="rounded-xl border border-stone-200/60 bg-white p-6 sm:p-8">
            <div className="prose prose-stone max-w-none text-sm">
              <h3 className="text-lg font-semibold text-stone-800">Clause de révision IRL</h3>
              <p className="text-stone-600">
                La révision annuelle du loyer s'effectue selon la formule:
                <code className="mx-2 rounded bg-stone-100 px-2 py-1">
                  Nouveau loyer = Loyer actuel × (Nouvel IRL ÷ IRL de référence)
                </code>
              </p>

              <h3 className="mt-4 text-lg font-semibold text-stone-800">Clause résolutoire</h3>
              <p className="text-stone-600">
                En cas de non-respect de ses obligations par le locataire, le bail
                peut être résilié de plein droit après mise en demeure restée sans
                effet pendant un délai d'un mois.
              </p>

              <h3 className="mt-4 text-lg font-semibold text-stone-800">Clause de solidarité</h3>
              <p className="text-stone-600">
                En cas de colocation, les colocataires sont solidairement responsables
                du paiement des loyers et des charges pendant toute la durée du bail.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10">
          <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
            Automatisez la gestion de vos baux
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-stone-600">
            RentReady génère automatiquement vos quittances, calcule les révisions
            IRL et suit vos loyers. Essai gratuit 14 jours.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Commencer l'essai gratuit
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}