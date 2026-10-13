import type { ReactNode } from "react";
import Link from "next/link";
import { calculateRentRevision, formatQuarterLabel } from "@/lib/irl-calculator";
import { formatCurrency } from "@/lib/format";
import { FeatureTabs, type FeatureTab } from "./FeatureTabs";
import styles from "./home.module.css";

const TOOLS = [
  { href: "/outils/calculateur-irl", label: "Calculateur de révision IRL" },
  { href: "/outils/lettre-relance-loyer", label: "Lettre de relance de loyer" },
  { href: "/outils/generateur-quittance", label: "Générateur de quittance" },
  { href: "/outils/calculateur-depot-garantie", label: "Plafond du dépôt de garantie" },
  { href: "/outils", label: "Tous les outils" },
];

/**
 * Three things a landlord does outside the monthly loop, each shown with the
 * product's own wording: the e-mail subjects Lokna sends
 * (`sendPaymentReminder`), the revision computed by `calculateRentRevision`,
 * and the tenant space's sections (`/portal/[token]`).
 */

const TABS: FeatureTab[] = [
  {
    id: "relancer",
    label: "Relancer",
    summary: "Un rappel, une relance formelle, une mise en demeure : envoyés par e-mail depuis le suivi.",
  },
  {
    id: "reviser",
    label: "Réviser le loyer",
    summary: "Le nouveau loyer calculé avec l'indice de référence des loyers de l'INSEE.",
  },
  {
    id: "partager",
    label: "Partager",
    summary: "Un espace en ligne où votre locataire retrouve ses quittances.",
  },
];

function Surface({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#15241F]/10 bg-[#FDFCF9] text-[#15241F] shadow-[0_40px_80px_-40px_rgba(6,24,18,0.6)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E7E3DA] px-5 py-4">
        <p className="text-[15px] font-semibold">{title}</p>
        <p className="text-[12.5px] text-[#5C6560]">{meta}</p>
      </div>
      {children}
    </div>
  );
}

function RemindPanel() {
  const steps = [
    { tone: "Rappel", subject: "Rappel : votre loyer en attente", extra: null },
    {
      tone: "Relance formelle",
      subject: "Relance pour loyer impayé - boulevard Foch",
      extra: "avec une lettre de relance à télécharger",
    },
    {
      tone: "Mise en demeure",
      subject: "MISE EN DEMEURE - boulevard Foch - Loyer impayé",
      extra: "avec la lettre de mise en demeure",
    },
  ];
  return (
    <Surface title="Emma Laurent · T3 boulevard Foch" meta="350,00 € en retard">
      <ol>
        {steps.map((step, i) => (
          <li key={step.tone} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 border-b border-[#E7E3DA] px-5 py-4 last:border-b-0">
            <span className="text-[13px] font-medium tabular-nums text-[#5C6560]">0{i + 1}</span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold">{step.tone}</p>
              <p className="mt-1 break-words rounded-md border border-[#E7E3DA] bg-[#F4F1EA] px-3 py-2 text-[13px] text-[#15241F]">
                <span className="text-[#5C6560]">Objet : </span>
                {step.subject}
              </p>
              {step.extra ? <p className="mt-1.5 text-[12.5px] text-[#4F5D56]">{step.extra}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      <p className="border-t border-[#E7E3DA] bg-[#F4F1EA] px-5 py-3 text-[12.5px] text-[#4F5D56]">
        Possible dès que l&apos;échéance est passée. Si l&apos;envoi échoue, Lokna vous le dit.
      </p>
    </Surface>
  );
}

function RevisePanel() {
  const revision = calculateRentRevision({
    currentRent: "640.00",
    referenceIrlQuarter: "T4-2024",
    newIrlQuarter: "T4-2025",
  });
  const lines = [
    { label: "Loyer actuel hors charges", value: formatCurrency(revision.currentRent) },
    {
      label: `IRL de référence (${formatQuarterLabel(revision.referenceIrl.quarter)})`,
      value: revision.referenceIrl.value.toLocaleString("fr-FR"),
    },
    {
      label: `Nouvel IRL (${formatQuarterLabel(revision.newIrl.quarter)})`,
      value: revision.newIrl.value.toLocaleString("fr-FR"),
    },
  ];
  return (
    <Surface title="Léa Bernard · T2 rue Saint-Aubin" meta="Révision annuelle du bail">
      <dl className="px-5 py-2">
        {lines.map((line) => (
          <div key={line.label} className="flex items-baseline justify-between gap-4 border-b border-[#E7E3DA] py-3 text-[14px]">
            <dt className="text-[#4F5D56]">{line.label}</dt>
            <dd className="tabular-nums">{line.value}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="text-[15px] font-semibold">Nouveau loyer proposé</dt>
          <dd className="text-right">
            <span className="block text-[1.6rem] font-semibold tabular-nums tracking-[-0.02em] text-[#0B3B2C]">
              {formatCurrency(revision.newRent)}
            </span>
            <span className="text-[12.5px] tabular-nums text-[#4F5D56]">
              +{formatCurrency(revision.difference)} par mois · +{revision.percentageChange.toLocaleString("fr-FR")} %
            </span>
          </dd>
        </div>
      </dl>
      <p className="border-t border-[#E7E3DA] bg-[#F4F1EA] px-5 py-3 text-[12.5px] text-[#4F5D56]">
        Lokna propose, vous validez : le nouveau loyer ne s&apos;applique qu&apos;après votre accord.
      </p>
    </Surface>
  );
}

function SharePanel() {
  const receipts = ["Octobre 2026", "Septembre 2026", "Août 2026"];
  return (
    <Surface title="Espace de Léa Bernard" meta="T2 rue Saint-Aubin">
      <div className="px-5 pt-4">
        <p className="text-[13px] font-medium text-[#4F5D56]">Mes quittances</p>
        <ul className="mt-2">
          {receipts.map((month) => (
            <li key={month} className="flex items-center justify-between gap-4 border-b border-[#E7E3DA] py-3 text-[14px]">
              <span>
                Quittance · {month}
                <span className="block text-[12.5px] text-[#5C6560]">Loyer + charges · 700,00 €</span>
              </span>
              <span aria-hidden="true" className="rounded-md border border-[#D9D5CC] px-2.5 py-1 text-[12.5px] text-[#15241F]">
                PDF
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <span className="text-[13px] font-medium text-[#4F5D56]">Mes demandes</span>
        <span aria-hidden="true" className="rounded-md bg-[#1E3A2F] px-3 py-1.5 text-[12.5px] text-[#FAF9F5]">
          Nouvelle demande
        </span>
      </div>
      <p className="border-t border-[#E7E3DA] bg-[#F4F1EA] px-5 py-3 text-[12.5px] text-[#4F5D56]">
        Vous l&apos;invitez par e-mail. Il retrouve ses quittances et peut signaler un problème dans le logement.
      </p>
    </Surface>
  );
}

export function HomeFeatures() {
  return (
    <section
      id="fonctionnalites"
      aria-labelledby="fonctionnalites-title"
      className="scroll-mt-14 bg-[#1E3A2F] text-[#FAF9F5]"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-12 grid gap-5 lg:grid-cols-12 lg:gap-10">
          <h2
            id="fonctionnalites-title"
            className="text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[3rem] lg:col-span-6"
          >
            Et les autres jours du mois.
          </h2>
          <p className="max-w-[34rem] text-[17px] leading-8 text-[#FAF9F5]/75 lg:col-span-5 lg:col-start-8 lg:pt-3">
            Un retard qui dure, un bail qui fête ses un an, un locataire qui
            cherche sa quittance : chaque fois, la réponse est déjà dans Lokna.
          </p>
        </div>
        <FeatureTabs tabs={TABS} panels={[<RemindPanel key="r" />, <RevisePanel key="v" />, <SharePanel key="s" />]} />
        <p className="mt-6 text-[12.5px] text-[#FAF9F5]/60">
          Illustrations fidèles aux écrans de Lokna. Données fictives ; indices IRL publiés par l&apos;INSEE.
        </p>
        <nav aria-label="Outils gratuits" className="mt-12 border-t border-[#FAF9F5]/15 pt-6">
          <p className="text-[15px] font-medium text-[#FAF9F5]">Gratuits, sans créer de compte</p>
          <ul className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-[15px]">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className={`${styles.link} text-[#FAF9F5]/90 hover:text-[#FAF9F5]`}>
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
