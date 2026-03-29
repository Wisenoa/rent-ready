import Link from "next/link";
import type { Metadata } from "next";
import {
  Building2,
  Shield,
  BellRing,
  FileCheck,
  TrendingUp,
  Wrench,
  Check,
  X,
  Lock,
  ScrollText,
  ChevronRight,
  Landmark,
  Smartphone,
} from "lucide-react";
import { SmartHeaderCta } from "@/components/smart-header-cta";

export const metadata: Metadata = {
  title: "RentReady — Gestion Locative Automatisée pour Propriétaires Indépendants",
  description:
    "Encaissement automatique, quittances légales et gestion des urgences. RentReady est le pilote automatique qui sécurise vos revenus locatifs pour 15 €/mois.",
  openGraph: {
    title: "RentReady — Libérez-vous de la gestion locative",
    description:
      "Le pilote automatique pour propriétaires bailleurs. Quittances, IRL, portail locataire. 15 €/mois.",
    type: "website",
    locale: "fr_FR",
  },
};

/* ─── Comparison data ─── */
const comparisonRows = [
  { label: "Coût annuel (pour 1 bien à 1 000 €/mois)", agency: "~840 €", excel: "0 €", rentready: "180 €" },
  { label: "Quittances légales automatiques", agency: true, excel: false, rentready: true },
  { label: "Détection automatique des virements", agency: true, excel: false, rentready: true },
  { label: "Révision IRL calculée (INSEE)", agency: true, excel: false, rentready: true },
  { label: "Portail locataire avec maintenance", agency: false, excel: false, rentready: true },
  { label: "Conformité Factur-X & e-reporting 2027", agency: false, excel: false, rentready: true },
  { label: "Contrôle total de vos données", agency: false, excel: false, rentready: true },
  { label: "Temps passé chaque mois", agency: "~2 h", excel: "~6 h", rentready: "~15 min" },
] as const;

/* ─── Benefits data ─── */
const benefits = [
  {
    icon: BellRing,
    title: "Fini le pointage manuel des virements",
    description:
      "RentReady se connecte à votre banque et détecte vos loyers automatiquement. Vous êtes notifié dès que l'argent est sur votre compte.",
  },
  {
    icon: FileCheck,
    title: "Vos obligations légales en pilote automatique",
    description:
      "Le système édite et envoie la quittance de loyer (ou le reçu de paiement partiel) uniquement quand le solde est réglé, en séparant les charges selon la loi française.",
  },
  {
    icon: TrendingUp,
    title: "Ne perdez plus un euro sur l'inflation",
    description:
      "L'outil se connecte à l'API de l'INSEE pour calculer votre Indice de Référence des Loyers (IRL) et notifie le locataire pour vous.",
  },
  {
    icon: Wrench,
    title: "Des locataires gérés sans appels nocturnes",
    description:
      "Un portail dédié permet à vos locataires de signaler un problème technique avec une vidéo. Vous validez l'intervention d'un artisan en un clic, sans stress.",
  },
];

/* ─── Pricing features ─── */
const pricingFeatures = [
  "Jusqu'à 10 biens immobiliers",
  "Locataires illimités",
  "Quittances et reçus légaux",
  "Détection automatique des loyers",
  "Révision IRL (INSEE)",
  "Portail locataire & maintenance",
  "OCR des factures artisans (IA)",
  "Conformité Factur-X 2026",
  "Support email prioritaire",
  "Mises à jour légales incluses",
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4] font-[family-name:var(--font-sans)]">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 border-b border-stone-200/40 bg-[#f8f7f4]/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">
              R
            </div>
            <span className="text-lg font-semibold tracking-tight text-stone-900">
              RentReady
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <SmartHeaderCta />
          </div>
        </nav>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Copy */}
            <div className="max-w-xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-600">
                Pour les propriétaires indépendants (1 à 10 lots)
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                Libérez-vous de la gestion locative.{" "}
                <span className="text-blue-600">Sans payer d&apos;agence.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone-600">
                Encaissement automatique, quittances légales et gestion des urgences.
                RentReady est le pilote automatique qui sécurise vos revenus pour{" "}
                <strong className="text-stone-900">15&nbsp;€ par mois</strong>, sans aucun effort quotidien.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
                >
                  Créer mon compte
                  <ChevronRight className="size-4" />
                </Link>
                <span className="text-sm text-stone-500">
                  Sans carte bancaire
                </span>
              </div>
              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-500">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="size-3.5 text-blue-600" />
                  Connexion bancaire sécurisée (DSP2)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ScrollText className="size-3.5 text-blue-600" />
                  Conforme Loi 1989 &amp; Factur-X 2026
                </span>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-100/60 via-teal-50/40 to-stone-100/60 blur-2xl" />
              <div className="relative rounded-[2rem] border border-stone-200/60 bg-white/80 p-4 shadow-2xl shadow-stone-900/10 backdrop-blur-sm">
                <div className="rounded-2xl bg-[#f8f7f4] p-5">
                  {/* Status bar */}
                  <div className="flex items-center justify-between text-[10px] text-stone-400 mb-5">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <Smartphone className="size-3" />
                    </div>
                  </div>
                  {/* Notification */}
                  <div className="rounded-xl border border-emerald-200/60 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <Check className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-900">
                          Loyer de 850 € reçu
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          Quittance envoyée à M. Dupont
                        </p>
                        <p className="mt-1.5 text-[10px] text-stone-400">
                          Il y a 2 minutes
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Mini KPI */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-stone-400">
                        Encaissé ce mois
                      </p>
                      <p className="mt-1 text-lg font-bold text-stone-900">
                        2&nbsp;550 €
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-stone-400">
                        Taux occupation
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-600">
                        100 %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Band ─── */}
      <section className="border-y border-stone-200/40 bg-white/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-center sm:gap-10 sm:px-6">
          <div className="flex items-center gap-2.5 text-sm text-stone-500">
            <Landmark className="size-4 text-blue-600" />
            <span>
              Connexion bancaire sécurisée via{" "}
              <strong className="text-stone-700">Bridge API / Powens</strong>
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-stone-300/50" />
          <div className="flex items-center gap-2.5 text-sm text-stone-500">
            <Shield className="size-4 text-blue-600" />
            <span>
              Prêt pour la réforme{" "}
              <strong className="text-stone-700">e-reporting B2C 2027</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ─── Comparison ─── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Pourquoi se contenter d&apos;Excel ou payer une agence{" "}
              <span className="text-blue-600">7&nbsp;%</span> de vos loyers ?
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200/60 bg-white/80 shadow-lg shadow-stone-900/5 backdrop-blur-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="py-4 pl-5 pr-3 font-medium text-stone-500 w-[40%]" />
                  <th className="py-4 px-4 font-medium text-stone-500 text-center">
                    <span className="block text-base text-stone-700">Agence</span>
                    <span className="block text-xs font-normal text-stone-400 mt-0.5">~7 % du loyer</span>
                  </th>
                  <th className="py-4 px-4 font-medium text-stone-500 text-center">
                    <span className="block text-base text-stone-700">Excel / Papier</span>
                    <span className="block text-xs font-normal text-stone-400 mt-0.5">Gratuit</span>
                  </th>
                  <th className="py-4 px-4 font-medium text-center rounded-t-xl bg-blue-50/60">
                    <span className="block text-base font-bold text-blue-700">RentReady</span>
                    <span className="block text-xs font-normal text-blue-500 mt-0.5">15 €/mois</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-stone-50 last:border-0">
                    <td className="py-3.5 pl-5 pr-3 text-stone-700">{row.label}</td>
                    <td className="py-3.5 px-4 text-center">
                      {typeof row.agency === "boolean" ? (
                        row.agency ? (
                          <Check className="mx-auto size-4 text-stone-400" />
                        ) : (
                          <X className="mx-auto size-4 text-stone-300" />
                        )
                      ) : (
                        <span className="text-stone-500">{row.agency}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {typeof row.excel === "boolean" ? (
                        row.excel ? (
                          <Check className="mx-auto size-4 text-stone-400" />
                        ) : (
                          <X className="mx-auto size-4 text-stone-300" />
                        )
                      ) : (
                        <span className="text-stone-500">{row.excel}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-blue-50/40">
                      {typeof row.rentready === "boolean" ? (
                        row.rentready ? (
                          <Check className="mx-auto size-5 text-blue-600" />
                        ) : (
                          <X className="mx-auto size-4 text-stone-300" />
                        )
                      ) : (
                        <span className="font-semibold text-blue-700">{row.rentready}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="border-t border-stone-200/40 bg-white/40 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-600">
              Des résultats, pas des fonctionnalités
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Ce que RentReady fait concrètement pour vous
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-stone-200/50 bg-white/70 p-7 shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:border-stone-200"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                  <benefit.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Un prix unique. Zéro mauvaise surprise.
            </h2>
          </div>

          <div className="mx-auto max-w-lg">
            <div className="relative overflow-hidden rounded-3xl border border-stone-200/60 bg-white/80 shadow-xl shadow-stone-900/5 backdrop-blur-sm">
              {/* Glow */}
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-100/40 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-teal-100/30 blur-3xl" />

              <div className="relative p-8 sm:p-10">
                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold tracking-tight text-stone-900">
                      15
                    </span>
                    <span className="text-xl font-semibold text-stone-500">€</span>
                    <span className="text-base text-stone-400 ml-1">/mois</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-500">
                    ou <strong className="text-stone-700">150 €/an</strong>{" "}
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      2 mois offerts
                    </span>
                  </p>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {pricingFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-blue-600" />
                      <span className="text-stone-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/register"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
                >
                  Essai gratuit — 14 jours
                  <ChevronRight className="size-4" />
                </Link>
                <p className="mt-3 text-center text-xs text-stone-400">
                  Sans carte bancaire · Annulable en 1 clic
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="border-t border-stone-200/40 bg-stone-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <Building2 className="mx-auto mb-5 size-10 text-blue-400" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Vos locataires ne devraient pas être une source de stress.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-stone-400">
            Rejoignez les propriétaires qui ont mis leur gestion locative en pilote automatique.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-400 hover:shadow-xl"
          >
            Commencer gratuitement
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-stone-200/40 bg-[#f8f7f4]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-sm text-stone-500 sm:flex-row sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} RentReady. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/gestion-locative" className="transition-colors hover:text-stone-700">
              Gestion locative
            </Link>
            <Link href="/mentions-legales" className="transition-colors hover:text-stone-700">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="transition-colors hover:text-stone-700">
              Confidentialité
            </Link>
            <Link href="/cgu" className="transition-colors hover:text-stone-700">
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
