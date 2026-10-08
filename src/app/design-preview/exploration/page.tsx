"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  Plus,
  FileText,
  User,
  Building,
  Calendar,
  Clock,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Info,
  Phone,
  Mail,
  Home,
  CreditCard,
  Layers,
  ChevronDown,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────── */
/* FIXTURES COMMUNES STRICTES (Phase 9)                                       */
/* ────────────────────────────────────────────────────────────────────────── */
const FIXTURE_DATA = {
  month: "Octobre 2026",
  stats: {
    expected: 3250,
    received: 2850,
    outstanding: 400,
  },
  properties: [
    {
      id: "prop_1",
      name: "Studio Nantes Decré",
      address: "12 rue Decré, 44000 Nantes",
      tenant: "Claire Martin",
      tenantEmail: "claire.martin@example.fr",
      rent: 850,
      received: 850,
      balance: 0,
      status: "PAID" as const,
      statusLabel: "Réglé",
      paymentDate: "03/10/2026",
      receiptUrl: "#",
    },
    {
      id: "prop_2",
      name: "T3 Lyon République",
      address: "8 rue de la République, 69001 Lyon",
      tenant: "Pierre Durand",
      tenantEmail: "pierre.durand@example.fr",
      rent: 1600,
      received: 1200,
      balance: 400,
      status: "PARTIAL" as const,
      statusLabel: "Acompte perçu",
      paymentDate: "05/10/2026",
      overdueDays: 10,
      overdueDate: "05/10/2026",
    },
    {
      id: "prop_3",
      name: "T2 Paris Belleville",
      address: "45 rue de Belleville, 75020 Paris",
      tenant: "Camille Bernard",
      tenantEmail: "camille.bernard@example.fr",
      rent: 800,
      received: 800,
      balance: 0,
      status: "PAID" as const,
      statusLabel: "Réglé",
      paymentDate: "01/10/2026",
      receiptUrl: "#",
    },
  ],
  leaseCreation: {
    property: "Studio Decré — 12 rue Decré, 44000 Nantes (28 m²)",
    leaseType: "Location vide (loi du 6 juillet 1989)",
    rentPrincipal: 750,
    charges: 100,
    totalCC: 850,
    deposit: 850,
    depositCeiling: 850, // 1 mois de loyer HC pour vide
    startDate: "2026-11-01",
    startDateFrench: "1er novembre 2026",
    paymentDay: 5,
    tenantName: "Lucas Mercier",
    tenantEmail: "lucas.mercier@example.fr",
    tenantPhone: "06 12 34 56 78",
  },
};

export default function ExplorationPreviewRouter() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-500 text-sm">Chargement du prototype...</div>}>
      <ExplorationViewContent />
    </Suspense>
  );
}

function ExplorationViewContent() {
  const searchParams = useSearchParams();
  const dir = (searchParams.get("dir") || "a") as "a" | "b" | "c";
  const screen = (searchParams.get("screen") || "dashboard") as "dashboard" | "lease_new" | "billing";

  return (
    <div className="min-h-screen">
      {/* Switcher Bar pour revue visuelle rapide en local */}
      <header
        data-preview-nav
        className="sticky top-0 z-50 bg-neutral-900 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-neutral-800"
      >
        <div className="flex items-center gap-2 font-medium">
          <span className="text-emerald-400 font-bold uppercase tracking-wider">RentReady Explorations</span>
          <span className="text-neutral-500">·</span>
          <span>Phase 8 Prototypes Isolés</span>
        </div>

        {/* Direction Switcher */}
        <div className="flex items-center gap-1 bg-neutral-800 p-0.5 rounded">
          <Link
            href={`/design-preview/exploration?dir=a&screen=${screen}`}
            className={`px-2.5 py-1 rounded transition-colors ${
              dir === "a" ? "bg-blue-600 text-white font-semibold" : "text-neutral-300 hover:text-white"
            }`}
          >
            A — Signalétique Foncière
          </Link>
          <Link
            href={`/design-preview/exploration?dir=b&screen=${screen}`}
            className={`px-2.5 py-1 rounded transition-colors ${
              dir === "b" ? "bg-emerald-700 text-white font-semibold" : "text-neutral-300 hover:text-white"
            }`}
          >
            B — Modern French Atelier
          </Link>
          <Link
            href={`/design-preview/exploration?dir=c&screen=${screen}`}
            className={`px-2.5 py-1 rounded transition-colors ${
              dir === "c" ? "bg-slate-700 text-white font-semibold" : "text-neutral-300 hover:text-white"
            }`}
          >
            C — Quiet Finance
          </Link>
        </div>

        {/* Screen Switcher */}
        <div className="flex items-center gap-1 bg-neutral-800 p-0.5 rounded">
          <Link
            href={`/design-preview/exploration?dir=${dir}&screen=dashboard`}
            className={`px-2.5 py-1 rounded transition-colors ${
              screen === "dashboard" ? "bg-neutral-600 text-white font-semibold" : "text-neutral-300 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href={`/design-preview/exploration?dir=${dir}&screen=lease_new`}
            className={`px-2.5 py-1 rounded transition-colors ${
              screen === "lease_new" ? "bg-neutral-600 text-white font-semibold" : "text-neutral-300 hover:text-white"
            }`}
          >
            Création de bail
          </Link>
          <Link
            href={`/design-preview/exploration?dir=${dir}&screen=billing`}
            className={`px-2.5 py-1 rounded transition-colors ${
              screen === "billing" ? "bg-neutral-600 text-white font-semibold" : "text-neutral-300 hover:text-white"
            }`}
          >
            Paiements (Billing)
          </Link>
        </div>
      </header>

      {/* Rendu spécifique à la Direction */}
      {dir === "a" && <DirectionARenderer screen={screen} />}
      {dir === "b" && <DirectionBRenderer screen={screen} />}
      {dir === "c" && <DirectionCRenderer screen={screen} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* DIRECTION A : SIGNALÉTIQUE FONCIÈRE (Pragmatic Utility)                     */
/* ══════════════════════════════════════════════════════════════════════════ */
function DirectionARenderer({ screen }: { screen: string }) {
  return (
    <div className="bg-[#F8F9FA] text-[#0F172A] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Top Utility Bar */}
      <nav className="border-b border-[#E2E8F0] bg-white px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-xs tracking-tighter">
              RR
            </span>
            <span className="font-bold text-sm tracking-tight text-[#0F172A]">RentReady</span>
          </div>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-xs font-medium text-[#64748B]">Gestion Foncière Particuliers</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#64748B]">Session bailleur :</span>
          <span className="font-medium text-[#0F172A]">Jean Dupont (3 logements)</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {screen === "dashboard" && <DirectionADashboard />}
        {screen === "lease_new" && <DirectionALeaseNew />}
        {screen === "billing" && <DirectionABilling />}
      </main>
    </div>
  );
}

function DirectionADashboard() {
  return (
    <div className="space-y-6">
      {/* Header Signalétique */}
      <div className="border-b border-[#E2E8F0] pb-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider mb-1">
            <span className="h-2 w-2 rounded-full bg-[#1D4ED8]" />
            Situation Locative Mensuelle
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Octobre 2026
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            3 biens loués · Échéances au 5 du mois · 1 action d&apos;encaissement requise
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/design-preview/exploration?dir=a&screen=lease_new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1D4ED8] text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="size-3.5" />
            Nouveau bail
          </Link>
        </div>
      </div>

      {/* Rail Financier Signalétique (Barre macro technique) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#E2E8F0] border border-[#E2E8F0] rounded-md overflow-hidden bg-white shadow-sm">
        <div className="bg-white p-4">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide block">
            1. Total attendu
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#0F172A] tabular-nums block mt-1">
            {FIXTURE_DATA.stats.expected.toLocaleString("fr-FR")} €
          </span>
          <span className="text-[11px] text-[#64748B]">3 loyers contractuels</span>
        </div>
        <div className="bg-white p-4">
          <span className="text-[11px] font-semibold text-[#16A34A] uppercase tracking-wide block">
            2. Encaissé à date
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#16A34A] tabular-nums block mt-1">
            {FIXTURE_DATA.stats.received.toLocaleString("fr-FR")} €
          </span>
          <span className="text-[11px] text-[#64748B]">2 règlements intégraux + 1 acompte</span>
        </div>
        <div className="bg-white p-4">
          <span className="text-[11px] font-semibold text-[#D97706] uppercase tracking-wide block">
            3. Reste à percevoir
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#D97706] tabular-nums block mt-1">
            {FIXTURE_DATA.stats.outstanding.toLocaleString("fr-FR")} €
          </span>
          <span className="text-[11px] text-[#D97706] font-medium">1 terme partiel en attente</span>
        </div>
      </div>

      {/* Registre des Biens (Anti-Card : Liste continue structurée) */}
      <div className="border border-[#E2E8F0] rounded-md bg-white overflow-hidden shadow-sm">
        <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#64748B] uppercase tracking-wider">
          <span>Logement & Locataire</span>
          <span>Statut du terme d&apos;octobre</span>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {FIXTURE_DATA.properties.map((prop) => {
            const isPartial = prop.status === "PARTIAL";

            if (isPartial) {
              /* EXCEPTION EXPANSION : Déploiement avec rail d'alerte gauche */
              return (
                <div key={prop.id} className="p-4 sm:p-5 bg-[#FFFBEB]/40 border-l-4 border-l-[#D97706] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0F172A]">{prop.name}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                          <AlertTriangle className="size-3" />
                          {prop.statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">{prop.address} · {prop.tenant}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#B45309] block tabular-nums">
                        Solde restant : {prop.balance} €
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        {prop.received} € réglés sur {prop.rent} € exigibles
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#FDE68A]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-xs text-[#78350F]">
                      Le locataire accuse {prop.overdueDays} jours de retard sur le solde de {prop.balance} €. La quittance intégrale est consignée jusqu&apos;à apurement.
                    </p>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1D4ED8] text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors shrink-0 shadow-sm">
                      Pointer un règlement ({prop.balance} €)
                    </button>
                  </div>
                </div>
              );
            }

            /* CALM ROW : Ligne silencieuse compacte de 40px */
            return (
              <div
                key={prop.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#16A34A] shrink-0" aria-label="À jour" />
                  <div>
                    <span className="font-medium text-xs sm:text-sm text-[#0F172A]">{prop.name}</span>
                    <span className="text-xs text-[#64748B] ml-2 hidden sm:inline">· {prop.tenant}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="font-semibold text-[#0F172A] tabular-nums">{prop.rent} €</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#DCFCE7] text-[#15803D]">
                    Réglé
                  </span>
                  <button className="text-xs text-[#1D4ED8] hover:underline font-medium flex items-center gap-1">
                    <Download className="size-3" />
                    Quittance
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DirectionALeaseNew() {
  const lease = FIXTURE_DATA.leaseCreation;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4 flex items-center justify-between">
        <div>
          <Link href="/design-preview/exploration?dir=a&screen=dashboard" className="text-xs text-[#1D4ED8] hover:underline inline-flex items-center gap-1 mb-1 font-medium">
            <ArrowLeft className="size-3" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Établissement d&apos;un contrat de location
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Bail d&apos;habitation conforme Loi n° 89-462 du 6 juillet 1989
          </p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold bg-[#F1F5F9] text-[#475569] rounded-md border border-[#E2E8F0]">
          Brouillon contractuel
        </span>
      </div>

      {/* Disposition en grille technique (Rail latéral gauche + formulaire ouvert) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Section 01 : Logement */}
          <div className="border border-[#E2E8F0] rounded-md bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              <span className="h-5 w-5 rounded bg-[#0F172A] text-white flex items-center justify-center text-[10px]">01</span>
              Logement & Régime locatif
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#475569] mb-1">Bien désigné</label>
                <input
                  type="text"
                  readOnly
                  value={lease.property}
                  className="w-full bg-[#F8F9FA] border border-[#CBD5E1] rounded px-3 py-2 text-[#0F172A] font-medium"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#475569] mb-1">Nature de la location</label>
                  <select className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-[#0F172A] font-medium focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]">
                    <option>Location vide (bail 3 ans)</option>
                    <option>Location meublée (bail 1 an)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#475569] mb-1">Date de prise d&apos;effet (entrée dans les lieux)</label>
                  {/* Correction Phase 13 : Format explicite français */}
                  <div className="relative">
                    <input
                      type="date"
                      defaultValue={lease.startDate}
                      className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-[#0F172A] font-medium focus:border-[#1D4ED8]"
                    />
                  </div>
                  <span className="text-[11px] text-[#64748B] mt-0.5 block">Exigibilité au {lease.paymentDay} de chaque mois</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 02 : Conditions Financières */}
          <div className="border border-[#E2E8F0] rounded-md bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              <span className="h-5 w-5 rounded bg-[#0F172A] text-white flex items-center justify-center text-[10px]">02</span>
              Ventilation financière mensuelle
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-[#475569] mb-1">Loyer principal HC</label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={lease.rentPrincipal}
                    className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-[#0F172A] font-semibold tabular-nums"
                  />
                  <span className="absolute right-3 top-2 text-[#64748B]">€</span>
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#475569] mb-1">Provisions pour charges</label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={lease.charges}
                    className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-[#0F172A] font-semibold tabular-nums"
                  />
                  <span className="absolute right-3 top-2 text-[#64748B]">€</span>
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#475569] mb-1">Total mensuel CC</label>
                <div className="bg-[#F1F5F9] border border-[#CBD5E1] rounded px-3 py-2 text-[#0F172A] font-bold tabular-nums">
                  {lease.totalCC} € / mois
                </div>
              </div>
            </div>

            {/* Dépôt de garantie et plafond légal */}
            <div className="p-3 bg-[#F8F9FA] rounded border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#0F172A]">Dépôt de garantie exigé</span>
                <span className="font-bold text-[#0F172A] tabular-nums">{lease.deposit} €</span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Plafond légal Loi 1989 (location vide) : 1 mois de loyer hors charges maximum ({lease.depositCeiling} €).
              </p>
            </div>
          </div>

          {/* Section 03 : Titulaire */}
          <div className="border border-[#E2E8F0] rounded-md bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              <span className="h-5 w-5 rounded bg-[#0F172A] text-white flex items-center justify-center text-[10px]">03</span>
              Locataire titulaire
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-[#475569] mb-1">Nom et prénom</label>
                <input
                  type="text"
                  defaultValue={lease.tenantName}
                  className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-[#0F172A] font-medium"
                />
              </div>
              <div>
                <label className="block font-medium text-[#475569] mb-1">Email de transmission</label>
                <input
                  type="email"
                  defaultValue={lease.tenantEmail}
                  className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-[#0F172A] font-medium"
                />
              </div>
              <div>
                <label className="block font-medium text-[#475569] mb-1">Téléphone</label>
                <input
                  type="tel"
                  defaultValue={lease.tenantPhone}
                  className="w-full bg-white border border-[#CBD5E1] rounded px-3 py-2 text-[#0F172A] font-medium tabular-nums"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne récapitulative & validation */}
        <div className="space-y-4">
          <div className="border border-[#E2E8F0] rounded-md bg-white p-5 space-y-4 shadow-sm sticky top-16">
            <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
              Bordereau Contractuel
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Type de bail :</span>
                <span className="font-medium text-[#0F172A]">Vide (3 ans)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Prise d&apos;effet :</span>
                <span className="font-medium text-[#0F172A]">{lease.startDateFrench}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Loyer mensuel CC :</span>
                <span className="font-bold text-[#0F172A] tabular-nums">{lease.totalCC} €</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Dépôt encaissé :</span>
                <span className="font-bold text-[#0F172A] tabular-nums">{lease.deposit} €</span>
              </div>
            </div>

            <button className="w-full py-2.5 bg-[#1D4ED8] hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-sm transition-colors">
              Éditer et enregistrer le bail
            </button>
            <p className="text-[11px] text-[#64748B] text-center">
              Le contrat signé sera téléchargeable au format PDF conforme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectionABilling() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#E2E8F0] pb-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider block mb-1">
            Registre des Règlements
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Paiements et quittances
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Période échue : Octobre 2026 · Suivi des flux locatifs et délivrance des quittances Art. 21
          </p>
        </div>
      </div>

      {/* Tableau d'encaissements linéaire */}
      <div className="border border-[#E2E8F0] rounded-md bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8F9FA] text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">
                <th className="py-2.5 px-4">Bien & Locataire</th>
                <th className="py-2.5 px-4">Échéance</th>
                <th className="py-2.5 px-4 text-right">Attendu</th>
                <th className="py-2.5 px-4 text-right">Perçu</th>
                <th className="py-2.5 px-4 text-right">Solde</th>
                <th className="py-2.5 px-4">Statut</th>
                <th className="py-2.5 px-4 text-right">Action / Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {FIXTURE_DATA.properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-[#F8F9FA] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#0F172A] block">{prop.name}</span>
                    <span className="text-[#64748B] text-[11px] block">{prop.tenant}</span>
                  </td>
                  <td className="py-3 px-4 text-[#64748B] tabular-nums">{prop.paymentDate}</td>
                  <td className="py-3 px-4 text-right font-medium tabular-nums">{prop.rent} €</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#16A34A] tabular-nums">{prop.received} €</td>
                  <td className="py-3 px-4 text-right font-semibold tabular-nums">
                    {prop.balance > 0 ? (
                      <span className="text-[#D97706]">{prop.balance} €</span>
                    ) : (
                      <span className="text-[#94A3B8]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {prop.status === "PAID" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#DCFCE7] text-[#15803D]">
                        Réglé
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FEF3C7] text-[#B45309]">
                        Acompte
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {prop.status === "PAID" ? (
                      <button className="text-[#1D4ED8] hover:underline font-medium inline-flex items-center gap-1">
                        <Download className="size-3" />
                        Quittance
                      </button>
                    ) : (
                      <button className="px-2.5 py-1 bg-[#1D4ED8] text-white rounded text-[11px] font-medium hover:bg-blue-700">
                        Régulariser ({prop.balance} €)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* DIRECTION B : MODERN FRENCH ATELIER (Clarté Vivante)                       */
/* ══════════════════════════════════════════════════════════════════════════ */
function DirectionBRenderer({ screen }: { screen: string }) {
  return (
    <div className="bg-[#F5F3EF] text-[#15241F] min-h-screen font-sans selection:bg-[#E5E2DA] selection:text-[#15241F]">
      {/* Top Header Chaleureux */}
      <nav className="border-b border-[#E5E2DA] bg-[#F5F3EF] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-[#1E3A2F] flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            RR
          </div>
          <span className="font-semibold text-base tracking-tight text-[#15241F]">RentReady</span>
          <span className="text-xs px-2 py-0.5 bg-[#ECEAE4] text-[#5B6661] rounded-full font-medium hidden sm:inline">
            Patrimoine locatif
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#5B6661]">
          <span>Espace propriétaire :</span>
          <span className="font-semibold text-[#15241F] bg-white px-2.5 py-1 rounded-full border border-[#E5E2DA]">
            3 biens actifs
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {screen === "dashboard" && <DirectionBDashboard />}
        {screen === "lease_new" && <DirectionBLeaseNew />}
        {screen === "billing" && <DirectionBBilling />}
      </main>
    </div>
  );
}

function DirectionBDashboard() {
  return (
    <div className="space-y-6">
      {/* En-tête Atelier */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-[#E5E2DA] pb-5">
        <div>
          <span className="text-xs font-semibold text-[#2E6F4E] block mb-1">
            Bilan d&apos;exploitation
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#15241F]">
            Octobre 2026
          </h1>
          <p className="text-xs text-[#5B6661] mt-1">
            Tranquillité d&apos;esprit garantie : 2 loyers perçus en totalité, 1 échéance partiellement honorée.
          </p>
        </div>
        <div>
          <Link
            href="/design-preview/exploration?dir=b&screen=lease_new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E3A2F] text-white text-xs font-medium rounded-full hover:bg-[#2D5A4C] transition-all shadow-sm"
          >
            <Plus className="size-3.5" />
            Nouveau contrat de location
          </Link>
        </div>
      </div>

      {/* Cartouche Macro Financier (Surfaces albâtre avec pilules) */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-[#5B6661]">
          <span className="font-medium">Synthèse des loyers du mois</span>
          <span className="text-[#2E6F4E] font-semibold">88% perçus</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <span className="text-xs text-[#5B6661] block">Total attendu</span>
            <span className="text-2xl font-semibold text-[#15241F] tabular-nums mt-0.5 block">
              {FIXTURE_DATA.stats.expected.toLocaleString("fr-FR")} €
            </span>
          </div>
          <div>
            <span className="text-xs text-[#5B6661] block">Règlements encaissés</span>
            <span className="text-2xl font-semibold text-[#2E6F4E] tabular-nums mt-0.5 block">
              {FIXTURE_DATA.stats.received.toLocaleString("fr-FR")} €
            </span>
          </div>
          <div>
            <span className="text-xs text-[#5B6661] block">Reste à percevoir</span>
            <span className="text-2xl font-semibold text-[#C86D2C] tabular-nums mt-0.5 block">
              {FIXTURE_DATA.stats.outstanding.toLocaleString("fr-FR")} €
            </span>
          </div>
        </div>
      </div>

      {/* Liste des Biens : Cartes Albâtre & Pilules */}
      <div className="space-y-3">
        {FIXTURE_DATA.properties.map((prop) => {
          const isPartial = prop.status === "PARTIAL";

          if (isPartial) {
            /* EXCEPTION : Carte chaleureuse avec teinte ambre miel */
            return (
              <div
                key={prop.id}
                className="bg-[#FDF5EC] rounded-xl border border-[#F8DCBE] p-5 space-y-3 shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#15241F]">{prop.name}</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F8DCBE] text-[#8C4612]">
                        <Clock className="size-3" />
                        {prop.statusLabel}
                      </span>
                    </div>
                    <p className="text-xs text-[#5B6661]">{prop.address} · Locataire : {prop.tenant}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-semibold text-[#C86D2C] block tabular-nums">
                      Solde : {prop.balance} €
                    </span>
                    <span className="text-xs text-[#5B6661]">sur {prop.rent} € attendus</span>
                  </div>
                </div>

                <div className="p-3 bg-white/70 rounded-lg text-xs text-[#8C4612] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-[#F8DCBE]/60">
                  <span>
                    Acompte de {prop.received} € reçu le {prop.paymentDate}. Le solde restant dû s&apos;élève à {prop.balance} €.
                  </span>
                  <button className="px-3.5 py-1.5 bg-[#C86D2C] text-white font-medium text-xs rounded-full hover:bg-[#A8551E] transition-colors shrink-0 shadow-sm">
                    Enregistrer le solde
                  </button>
                </div>
              </div>
            );
          }

          /* CALM : Ligne albâtre compacte avec pilule sauge */
          return (
            <div
              key={prop.id}
              className="bg-white rounded-xl border border-[#E5E2DA] px-5 py-3.5 flex items-center justify-between shadow-sm hover:border-[#CBD5E1] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2E6F4E]" />
                <div>
                  <span className="font-medium text-sm text-[#15241F]">{prop.name}</span>
                  <span className="text-xs text-[#5B6661] ml-2 hidden sm:inline">· {prop.tenant}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="font-semibold text-[#15241F] tabular-nums">{prop.rent} €</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF7F2] text-[#2E6F4E] border border-[#D2EBDC]">
                  Réglé
                </span>
                <button className="text-xs text-[#1E3A2F] hover:underline font-medium inline-flex items-center gap-1">
                  <Download className="size-3" />
                  Quittance
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DirectionBLeaseNew() {
  const lease = FIXTURE_DATA.leaseCreation;
  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E2DA] pb-4 flex items-center justify-between">
        <div>
          <Link href="/design-preview/exploration?dir=b&screen=dashboard" className="text-xs text-[#1E3A2F] hover:underline inline-flex items-center gap-1 mb-1 font-medium">
            <ArrowLeft className="size-3" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[#15241F]">
            Nouveau contrat de location
          </h1>
          <p className="text-xs text-[#5B6661] mt-0.5">
            Rédaction guidée conforme au modèle type réglementaire ALUR
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {/* Fiche 1 */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#15241F] border-b border-[#E5E2DA] pb-2.5">
              1. Le bien loué
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5B6661] mb-1 font-medium">Logement sélectionné</label>
                <div className="p-3 bg-[#F5F3EF] rounded-lg font-medium text-[#15241F]">
                  {lease.property}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5B6661] mb-1 font-medium">Type de contrat</label>
                  <select className="w-full bg-white border border-[#E5E2DA] rounded-lg px-3 py-2 text-[#15241F] font-medium focus:border-[#1E3A2F]">
                    <option>Location vide (loi du 6 juillet 1989)</option>
                    <option>Location meublée classique (1 an)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5B6661] mb-1 font-medium">Prise d&apos;effet du bail</label>
                  <input
                    type="date"
                    defaultValue={lease.startDate}
                    className="w-full bg-white border border-[#E5E2DA] rounded-lg px-3 py-2 text-[#15241F] font-medium focus:border-[#1E3A2F]"
                  />
                  <span className="text-[11px] text-[#5B6661] mt-0.5 block">Entrée dans les lieux le {lease.startDateFrench}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fiche 2 */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#15241F] border-b border-[#E5E2DA] pb-2.5">
              2. Modalités financières
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[#5B6661] mb-1 font-medium">Loyer hors charges</label>
                <input
                  type="number"
                  defaultValue={lease.rentPrincipal}
                  className="w-full bg-white border border-[#E5E2DA] rounded-lg px-3 py-2 text-[#15241F] font-semibold tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[#5B6661] mb-1 font-medium">Provisions charges</label>
                <input
                  type="number"
                  defaultValue={lease.charges}
                  className="w-full bg-white border border-[#E5E2DA] rounded-lg px-3 py-2 text-[#15241F] font-semibold tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[#5B6661] mb-1 font-medium">Total mensuel CC</label>
                <div className="p-2 bg-[#EEF7F2] text-[#2E6F4E] font-bold rounded-lg tabular-nums">
                  {lease.totalCC} € / mois
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#F5F3EF] rounded-lg text-xs space-y-1 text-[#15241F]">
              <div className="flex justify-between font-semibold">
                <span>Dépôt de garantie</span>
                <span>{lease.deposit} €</span>
              </div>
              <p className="text-[11px] text-[#5B6661]">
                Conforme au plafond légal (1 mois de loyer HC en location vide).
              </p>
            </div>
          </div>

          {/* Fiche 3 */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#15241F] border-b border-[#E5E2DA] pb-2.5">
              3. Locataire
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[#5B6661] mb-1 font-medium">Nom complet</label>
                <input
                  type="text"
                  defaultValue={lease.tenantName}
                  className="w-full bg-white border border-[#E5E2DA] rounded-lg px-3 py-2 text-[#15241F] font-medium"
                />
              </div>
              <div>
                <label className="block text-[#5B6661] mb-1 font-medium">Email</label>
                <input
                  type="email"
                  defaultValue={lease.tenantEmail}
                  className="w-full bg-white border border-[#E5E2DA] rounded-lg px-3 py-2 text-[#15241F] font-medium"
                />
              </div>
              <div>
                <label className="block text-[#5B6661] mb-1 font-medium">Téléphone</label>
                <input
                  type="tel"
                  defaultValue={lease.tenantPhone}
                  className="w-full bg-white border border-[#E5E2DA] rounded-lg px-3 py-2 text-[#15241F] font-medium tabular-nums"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sommaire sticky */}
        <div>
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 space-y-4 shadow-sm sticky top-16">
            <h3 className="text-xs font-semibold text-[#15241F] uppercase tracking-wider">
              Récapitulatif du contrat
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5B6661]">Loyer principal :</span>
                <span className="font-semibold">{lease.rentPrincipal} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6661]">Charges :</span>
                <span className="font-semibold">{lease.charges} €</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5E2DA] font-semibold text-sm text-[#1E3A2F]">
                <span>Total dû :</span>
                <span>{lease.totalCC} €</span>
              </div>
            </div>

            <button className="w-full py-2.5 bg-[#1E3A2F] hover:bg-[#2D5A4C] text-white font-medium text-xs rounded-full shadow-sm transition-all">
              Finaliser le contrat de location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectionBBilling() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E2DA] pb-5">
        <span className="text-xs font-semibold text-[#2E6F4E] block mb-1">
          Suivi comptable des règlements
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-[#15241F]">
          Paiements et quittances
        </h1>
        <p className="text-xs text-[#5B6661] mt-1">
          Relevé chronologique des encaissements pour le mois d&apos;Octobre 2026.
        </p>
      </div>

      <div className="space-y-3">
        {FIXTURE_DATA.properties.map((prop) => (
          <div
            key={prop.id}
            className="bg-white rounded-xl border border-[#E5E2DA] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm"
          >
            <div>
              <span className="font-semibold text-sm text-[#15241F] block">{prop.name}</span>
              <span className="text-xs text-[#5B6661] block">{prop.tenant} · Échéance du {prop.paymentDate}</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <span className="font-semibold text-[#15241F] block tabular-nums">{prop.received} € perçus</span>
                <span className="text-[11px] text-[#5B6661]">sur {prop.rent} €</span>
              </div>

              {prop.status === "PAID" ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EEF7F2] text-[#2E6F4E] border border-[#D2EBDC]">
                  Payé
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF5EC] text-[#C86D2C] border border-[#F8DCBE]">
                  Solde dû : {prop.balance} €
                </span>
              )}

              {prop.status === "PAID" ? (
                <button className="text-xs text-[#1E3A2F] underline font-medium">
                  Quittance
                </button>
              ) : (
                <button className="px-3 py-1 bg-[#C86D2C] text-white text-xs font-medium rounded-full">
                  Encaisser
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* DIRECTION C : QUIET FINANCE (Précision Calme & Progressive Disclosure)     */
/* ══════════════════════════════════════════════════════════════════════════ */
function DirectionCRenderer({ screen }: { screen: string }) {
  return (
    <div className="bg-[#F7F7F8] text-[#1C1E21] min-h-screen font-sans selection:bg-neutral-200 selection:text-neutral-900">
      <nav className="border-b border-[#E5E5E8] bg-white px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 rounded bg-[#1C1E21] text-white flex items-center justify-center text-[10px] font-bold">
            R
          </span>
          <span className="font-medium text-sm tracking-tight text-[#1C1E21]">RentReady</span>
        </div>
        <div className="text-xs text-[#71767B]">
          Espace calme · 3 biens gérés
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {screen === "dashboard" && <DirectionCDashboard />}
        {screen === "lease_new" && <DirectionCLeaseNew />}
        {screen === "billing" && <DirectionCBilling />}
      </main>
    </div>
  );
}

function DirectionCDashboard() {
  const [expandedId, setExpandedId] = useState<string>("prop_2"); // Par défaut, l'exception est déployée

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-[#E5E5E8] pb-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-[#1C1E21]">
            Octobre 2026
          </h1>
          <p className="text-xs text-[#71767B] mt-0.5">
            Tout est silencieux pour 2 biens. 1 attention requise.
          </p>
        </div>
        <Link
          href="/design-preview/exploration?dir=c&screen=lease_new"
          className="text-xs font-medium text-[#1C1E21] hover:underline"
        >
          + Ajouter un bail
        </Link>
      </div>

      {/* Synthèse macro ton-sur-ton feutrée */}
      <div className="bg-white rounded-lg border border-[#E5E5E8] p-4 flex items-center justify-between text-xs">
        <div>
          <span className="text-[#71767B] block">Exigible</span>
          <span className="font-medium text-sm text-[#1C1E21] tabular-nums mt-0.5 block">{FIXTURE_DATA.stats.expected} €</span>
        </div>
        <div>
          <span className="text-[#71767B] block">Reçu</span>
          <span className="font-medium text-sm text-[#15803D] tabular-nums mt-0.5 block">{FIXTURE_DATA.stats.received} €</span>
        </div>
        <div>
          <span className="text-[#71767B] block">Attente</span>
          <span className="font-medium text-sm text-[#EA580C] tabular-nums mt-0.5 block">{FIXTURE_DATA.stats.outstanding} €</span>
        </div>
      </div>

      {/* Registre feutré (Progressive Disclosure) */}
      <div className="space-y-2">
        {FIXTURE_DATA.properties.map((prop) => {
          const isPartial = prop.status === "PARTIAL";

          if (isPartial) {
            return (
              <div
                key={prop.id}
                className="bg-[#FFF7ED] rounded-lg border border-[#FED7AA] p-4 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
                    <span className="font-semibold text-[#1C1E21]">{prop.name}</span>
                    <span className="text-[#71767B]">· {prop.tenant}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#EA580C] tabular-nums">
                    Reste : {prop.balance} €
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-[#9A3412]">
                  <span>{prop.received} € perçus sur {prop.rent} € exigibles (10j de retard).</span>
                  <button className="px-3 py-1 bg-[#1C1E21] text-white rounded-md text-xs font-medium hover:bg-black">
                    Pointer le solde
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={prop.id}
              className="bg-white rounded-lg border border-[#E5E5E8] px-4 py-2.5 flex items-center justify-between text-xs hover:border-[#CBD5E1]"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />
                <span className="text-[#1C1E21] font-medium">{prop.name}</span>
                <span className="text-[#71767B]">· {prop.tenant}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="tabular-nums font-medium text-[#1C1E21]">{prop.rent} €</span>
                <span className="text-[#15803D]">Réglé</span>
                <button className="text-[#71767B] hover:text-[#1C1E21] underline">Quittance</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DirectionCLeaseNew() {
  const lease = FIXTURE_DATA.leaseCreation;
  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E8] pb-4 flex items-center justify-between">
        <div>
          <Link href="/design-preview/exploration?dir=c&screen=dashboard" className="text-xs text-[#71767B] hover:text-[#1C1E21] inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="size-3" />
            Retour
          </Link>
          <h1 className="text-2xl font-medium tracking-tight text-[#1C1E21]">
            Nouveau bail
          </h1>
          <p className="text-xs text-[#71767B] mt-0.5">
            Déroulement progressif sans surcharge mentale.
          </p>
        </div>
      </div>

      {/* Accordéon séquentiel épuré (Progressive Disclosure) */}
      <div className="space-y-3">
        {/* Étape 1 : Logement (rétractée et validée) */}
        <div className="bg-white rounded-lg border border-[#E5E5E8] p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-[#15803D]" />
            <span className="font-medium text-[#1C1E21]">1. Logement : {lease.property}</span>
          </div>
          <button className="text-xs text-[#71767B] hover:underline">Modifier</button>
        </div>

        {/* Étape 2 : Conditions Financières (Active et déployée) */}
        <div className="bg-white rounded-lg border border-[#1C1E21] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E5E8] pb-2 text-xs font-semibold text-[#1C1E21]">
            <span>2. Conditions financières & Dépôt</span>
            <span className="text-[#15803D]">Étape active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[#71767B] mb-1">Loyer principal</label>
              <input
                type="number"
                defaultValue={lease.rentPrincipal}
                className="w-full bg-[#F7F7F8] border border-[#E5E5E8] rounded p-2 text-[#1C1E21] font-medium tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[#71767B] mb-1">Charges</label>
              <input
                type="number"
                defaultValue={lease.charges}
                className="w-full bg-[#F7F7F8] border border-[#E5E5E8] rounded p-2 text-[#1C1E21] font-medium tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[#71767B] mb-1">Total mensuel CC</label>
              <div className="p-2 bg-[#EFEFF1] rounded font-semibold text-[#1C1E21] tabular-nums">
                {lease.totalCC} € / mois
              </div>
            </div>
          </div>

          <div className="text-xs text-[#71767B] bg-[#F7F7F8] p-3 rounded">
            Dépôt de garantie légal : {lease.deposit} € (plafond 1 mois HC respecté).
          </div>
        </div>

        {/* Étape 3 : Locataire */}
        <div className="bg-white rounded-lg border border-[#E5E5E8] p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-[#E5E5E8] text-[#71767B] flex items-center justify-center text-[10px]">3</span>
            <span className="text-[#71767B]">Locataire : {lease.tenantName} ({lease.tenantEmail})</span>
          </div>
          <span className="text-xs text-[#71767B]">Prêt à valider</span>
        </div>
      </div>

      <div className="pt-2">
        <button className="px-5 py-2.5 bg-[#1C1E21] text-white text-xs font-medium rounded-lg hover:bg-black transition-colors">
          Enregistrer le contrat de bail
        </button>
      </div>
    </div>
  );
}

function DirectionCBilling() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E8] pb-4">
        <h1 className="text-2xl font-medium tracking-tight text-[#1C1E21]">
          Paiements d&apos;octobre 2026
        </h1>
        <p className="text-xs text-[#71767B] mt-0.5">
          Registre linéaire des encaissements et quittances.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#E5E5E8] overflow-hidden">
        <div className="divide-y divide-[#E5E5E8] text-xs">
          {FIXTURE_DATA.properties.map((prop) => (
            <div key={prop.id} className="p-3.5 flex items-center justify-between hover:bg-[#F7F7F8]">
              <div>
                <span className="font-medium text-[#1C1E21] block">{prop.name}</span>
                <span className="text-[#71767B] text-[11px] block">{prop.tenant} · Échéance {prop.paymentDate}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="tabular-nums text-[#1C1E21]">{prop.received} / {prop.rent} €</span>
                {prop.status === "PAID" ? (
                  <span className="text-[#15803D]">Réglé</span>
                ) : (
                  <span className="text-[#EA580C] font-medium">Solde : {prop.balance} €</span>
                )}
                {prop.status === "PAID" ? (
                  <button className="text-[#71767B] hover:text-[#1C1E21] underline">Quittance</button>
                ) : (
                  <button className="px-2.5 py-1 bg-[#1C1E21] text-white rounded text-[11px]">Régulariser</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
