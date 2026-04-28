import type { Metadata } from "next";
export const revalidate = 604800;

import Link from "next/link";
import { ArrowRight, FileText, Download, Check } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Modèle de Bail de Location 2026 — Gratuit & Conforme Loi 1989 | RentReady",
    description:
      "Téléchargez notre modèle de bail de location gratuit et conforme à la loi du 6 juillet 1989. Bail vide, bail meublé, bail mobilité — personnalisez et utilisez immédiatement.",
    url: "/guides/modele-bail",
    ogType: "website",
  });
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment rédiger un bail de location conforme en 2026",
  description:
    "Guide complet pour choisir le bon type de bail, inclure les mentions obligatoires, joindre les documents requis, et réviser le loyer en cours de bail.",
  step: [
    {
      "@type": "HowToStep",
      name: "Choisir le type de bail adapté au logement",
      text: "Bail vide : 3 ans, dépôt max 1 mois hors charges. Bail meublé : 1 an minimum, dépôt max 2 mois. Bail mobilité : 1 à 10 mois, sans dépôt. Bail colocation : 3 ans, avec ou sans solidarité entre colocataires. Un bail mal adapté peut être déclaré nul.",
    },
    {
      "@type": "HowToStep",
      name: "Inclure toutes les mentions obligatoires",
      text: "Le bail doit contenir : identité et adresse du bailleur, situation du bien, destination (habitation principale), date de début et durée, montant du loyer et modalités de révision, dépôt de garantie, superficie habitable (loi Alur), clause de résiliation, inventaire mobilier (meublé), et attestation d'assurance RC habitation du locataire.",
    },
    {
      "@type": "HowToStep",
      name: "Joindre les documents obligatoires",
      text: "Remettez à la signature : état des lieux (entrée et sortie), dossier de diagnostic technique (DDT : DPE, ERNMT, superficie Carrez/Boutin), attestation d'assurance risques locatifs du locataire, charges récupérables avec répartition, et extraits de la grille de loyer en zone tendue.",
    },
    {
      "@type": "HowToStep",
      name: "Respecter les règles de révision du loyer",
      text: "Le loyer ne peut être révisé qu'une fois par an, à la date anniversaire du bail, en utilisant l'IRL INSEE. Informez le locataire par LRAR. Toute clause de révision automatique doit préciser la date de prise en compte et l'indice de référence.",
    },
    {
      "@type": "HowToStep",
      name: "Utiliser un modèle de bail gratuit et conforme",
      text: "Utilisez un modèle préparé par des juristes spécialisés incluant toutes les clauses obligatoires, les clauses interdites à éviter, et une notice explicative pour chaque section. Personnalisez les champs indiqués, puis imprimez.",
    },
  ],
};

export default function ModeleBailGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-12">
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/guides" className="hover:text-stone-700">Guides pratiques</Link>
          <span className="mx-2">›</span>
          <span>Modèle de bail gratuit</span>
        </nav>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 mb-4">
          Guide gratuit
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Modèle de bail de location gratuit 2026
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Téléchargez notre modèle de bail de location gratuit, conforme à la loi du
          6 juillet 1989 et mis à jour pour 2026. Bail vide, bail meublé, bail
          mobilité — tous les contrats dont vous avez besoin pour louer en toute
          sérénité.
        </p>
      </header>

      {/* Download CTA */}
      <div className="mb-12 rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-white p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Modèle de bail gratuit à télécharger
            </h2>
            <p className="mt-1 text-stone-600">
              Format Word modifiable — personnalisez les clauses puis imprimez.
              Entièrement gratuit, sans inscription requise.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <Link
              href="/templates/bail-vide"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Download className="size-4" />
              Télécharger le modèle
            </Link>
            <p className="text-xs text-stone-500">Word (.docx) · Mis à jour avril 2026</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-stone max-w-none">
        <h2>Quel type de bail choisir ?</h2>
        <p>
          En France, le contrat de location dépend de la nature du logement loué.
          Choisir le bon bail est essentiel : un bail mal adapté peut être déclaré
          nul par un tribunal et expose le bailleur à des sanctions.
        </p>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          {[
            { type: "Bail vide", dur: "3 ans", depot: "2 mois max", desc: "Location d'un logement non meublé. Le contrat le plus courant pour les locations longue durée." },
            { type: "Bail meublé", dur: "1 an min", depot: "2 mois max", desc: "Logement équipé de tous les élémentsMobiliers. Durée minimale 1 an (reconduction tacite)." },
            { type: "Bail mobilité", dur: "1-10 mois", depot: "0 €", desc: "Pour besoins professionnels, formation ou mutation. Sans dépôt de garantie." },
            { type: "Bail colocation", dur: "3 ans / 1 an", depot: "1 mois/term", desc: "Plusieurs locataires, un seul bail. Peut prévoir la clause de solidarité." },
          ].map((bail) => (
            <div key={bail.type} className="rounded-xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-900">{bail.type}</h3>
              <p className="mt-1 text-sm text-stone-600">{bail.desc}</p>
              <div className="mt-3 flex gap-4 text-xs text-stone-500">
                <span>⏱ {bail.dur}</span>
                <span>💰 Dépôt {bail.depot}</span>
              </div>
            </div>
          ))}
        </div>

        <h2>Mentions obligatoires dans un bail</h2>
        <p>
          La loi du 6 juillet 1989 impose des mentions obligatoires dans tout contrat
          de location d&apos;habitation principale. L&apos;absence de l&apos;une d&apos;entre elles peut
          entraîner la nullité de la clause concernée ou du bail entier.
        </p>
        <ul>
          <li>Identité et adresse du bailleur (et éventuellement du gestionnaire)</li>
          <li>Situation du bien (adresse, étage, nature et importance du logement)</li>
          <li>Destination du bien (usage d&apos;habitation principale uniquement)</li>
          <li>Date de début et durée du contrat</li>
          <li>Montant du loyer, modalités de révision et charge applicables</li>
          <li>Dépôt de garantie (plafonné à 1 mois hors charges pour le vide)</li>
          <li>Mention de la superficie habitable (loi Alur, depuis 2014)</li>
          <li>Clause de résiliation et conditions du préavis</li>
          <li>Inventaire du mobilier pour les locations meublées</li>
          <li>Attestation d&apos;assurance dep rc habitation par le locataire</li>
        </ul>

        <h2>Documents à joindre au bail</h2>
        <p>
          Le bailleur doit remettre au locataire, dès la signature du contrat, un
          ensemble de documents obligatoires :
        </p>
        <ul>
          <li><strong>L&apos;état des lieux</strong> — établi lors de la remise des clés (entrée) et de restitution (sortie)</li>
          <li><strong>Le dossier de diagnostic technique (DDT)</strong> — DPE, ERNMT, superficie Carrez/ Boutin, radon si applicable</li>
          <li><strong>L&apos;attestation d&apos;assurance</strong> — le locataire doit fournir une attestation d&apos;assurance risques locatifs chaque année</li>
          <li><strong>Les charges récupérables</strong> — mode de répartition et montants prévisionnels</li>
          <li><strong>Les extraits de la grille de loyer</strong> — pour les communes en zone tendue, justification du loyer de référence</li>
        </ul>

        <h2>Révision du loyer en cours de bail</h2>
        <p>
          Le loyer ne peut être révisé qu&apos;une fois par an, à la date anniversaires du
          bail, en utilisant l&apos;Indice de Référence des Loyers (IRL) publié par
          l&apos;INSEE. Toute clause de révision automatique doit préciser la date de
          prise en compte et l&apos;indice de référence.
        </p>
        <p>
          Le bailleur doit informer le locataire de la révision par lettre recommandée
          avec accusé de réception ou par acte.extrajudiciaire. Le manquement à cette
          obligation ne bloque pas la révision mais expose à des sanctions.
        </p>

        <h2>Notre modèle gratuit vous fait gagner du temps</h2>
        <p>
          Notre modèle de bail gratuit a été préparé par des juristes spécialisés en
          droit locatif. Il inclut toutes les clauses obligatoires, des exemples de
          clauses interdites à éviter, et une notice explicative pour chaque section.
          Vous pouvez le personnaliser en toute simplicité : remplacez les champs
          indiqués, ajoutez vos clauses spécifiques, puis imprimez.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 rounded-xl border border-stone-200/60 bg-stone-50 p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-stone-900">
          Besoin d&apos;aller plus loin ?
        </h2>
        <p className="mx-auto mb-6 max-w-md text-stone-600">
          With RentReady, gérez vos baux automatiquement : généréz les contrats,
          envoyez-les pour signature électronique, et suivi des renouvellements.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/templates/bail-vide"
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
          >
            <FileText className="size-4" />
            Voir le modèle en ligne
          </Link>
        </div>
      </div>
    </article>
    </>
  );
}
