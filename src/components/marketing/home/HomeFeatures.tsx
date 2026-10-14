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
 * Three things a landlord does outside the monthly loop, each shown as it works
 * in production today: the balance left on a late month (`settlePeriodPayments`),
 * the revision computed by `calculateRentRevision`, and the documents of a
 * lease, downloaded on demand.
 *
 * No e-mail and no tenant space here: reminder e-mails cannot leave production
 * (no e-mail provider configured) and no screen lets a landlord invite a tenant
 * to the portal. Show them again only once both work.
 */

const TABS: FeatureTab[] = [
  {
    id: "relancer",
    label: "Suivre un retard",
    summary: "Ce qui est dû, ce qui a été versé, ce qui reste : les montants exacts pour relancer.",
  },
  {
    id: "reviser",
    label: "Réviser le loyer",
    summary: "Le nouveau loyer calculé avec l'indice de référence des loyers de l'INSEE.",
  },
  {
    id: "partager",
    label: "Documents",
    summary: "Les quittances et reçus de chaque mois, à télécharger en PDF quand vous en avez besoin.",
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
  const lines = [
    { label: "Loyer et charges d'octobre", value: "700,00 €", extra: "échéance du 5 octobre" },
    { label: "Versement reçu le 7 octobre", value: "350,00 €", extra: "reçu de paiement partiel" },
    { label: "Reste dû", value: "350,00 €", extra: "en retard depuis le 5 octobre" },
  ];
  return (
    <Surface title="Emma Laurent · T3 boulevard Foch" meta="350,00 € en retard">
      <ol>
        {lines.map((line, i) => (
          <li key={line.label} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2 border-b border-[#E7E3DA] px-5 py-4 last:border-b-0">
            <span className="text-[13px] font-medium tabular-nums text-[#5C6560]">0{i + 1}</span>
            <div className="flex min-w-0 items-baseline justify-between gap-4">
              <p className="text-[14px] font-semibold">
                {line.label}
                <span className="mt-0.5 block text-[12.5px] font-normal text-[#4F5D56]">{line.extra}</span>
              </p>
              <p className="shrink-0 text-[14px] tabular-nums">{line.value}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="border-t border-[#E7E3DA] bg-[#F4F1EA] px-5 py-3 text-[12.5px] text-[#4F5D56]">
        Pour relancer, notre{" "}
        <Link href="/outils/lettre-relance-loyer" className="underline underline-offset-2">
          modèle de lettre gratuit
        </Link>{" "}
        reprend ces montants. C&apos;est vous qui l&apos;envoyez.
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
  const receipts = [
    { month: "Octobre 2026", kind: "Reçu", detail: "Versement partiel · 350,00 €" },
    { month: "Septembre 2026", kind: "Quittance", detail: "Loyer + charges · 700,00 €" },
    { month: "Août 2026", kind: "Quittance", detail: "Loyer + charges · 700,00 €" },
  ];
  return (
    <Surface title="Documents · Léa Bernard" meta="T2 rue Saint-Aubin">
      <ul className="px-5 pt-2">
        {receipts.map((doc) => (
          <li key={doc.month} className="flex items-center justify-between gap-4 border-b border-[#E7E3DA] py-3 text-[14px] last:border-b-0">
            <span>
              {doc.kind} · {doc.month}
              <span className="block text-[12.5px] text-[#5C6560]">{doc.detail}</span>
            </span>
            <span aria-hidden="true" className="rounded-md border border-[#D9D5CC] px-2.5 py-1 text-[12.5px] text-[#15241F]">
              PDF
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-[#E7E3DA] bg-[#F4F1EA] px-5 py-3 text-[12.5px] text-[#4F5D56]">
        Chaque document se télécharge à la demande. Lokna ne l&apos;envoie pas : vous le transmettez à votre locataire.
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
