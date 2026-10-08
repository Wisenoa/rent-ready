"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  Home,
  Info,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react";
import { FIXTURE_10_UNITS, FIXTURE_3_EXCEPTIONS, PropertyUnit } from "../types";

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. DASHBOARD COMPONENT                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

interface DashboardViewProps {
  mode: "default" | "dense" | "exceptions";
  isMobile?: boolean;
}

export function B1DashboardView({ mode, isMobile = false }: DashboardViewProps) {
  // Setup dataset according to mode
  const initialUnits =
    mode === "dense"
      ? FIXTURE_10_UNITS
      : mode === "exceptions"
      ? FIXTURE_3_EXCEPTIONS
      : FIXTURE_10_UNITS.slice(0, 3); // 3 units for default

  const [units, setUnits] = useState<PropertyUnit[]>(initialUnits);
  const [resolvedUnits, setResolvedUnits] = useState<Record<string, boolean>>({});

  // Calculate totals
  const totalExpected = units.reduce((acc, u) => acc + u.rentExpected, 0);
  const totalReceived = units.reduce((acc, u) => {
    if (resolvedUnits[u.id]) return acc + u.rentExpected;
    return acc + u.rentReceived;
  }, 0);
  const totalRemaining = Math.max(0, totalExpected - totalReceived);

  // Settlement action handler
  const handleSettleUnit = (id: string) => {
    setResolvedUnits((prev) => ({ ...prev, [id]: true }));
  };

  const handleReset = () => {
    setResolvedUnits({});
  };

  return (
    <div className="space-y-6">
      {/* 1. Arrêté Header & Financial Summary */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E2DA]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C8782]">
                Période d'arrêté en cours
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[#ECEAE4] text-[#15241F] rounded-full border border-[#D4CFC4]">
                Octobre 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#15241F] mt-1">
              Grand Livre des Encaissements
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {Object.keys(resolvedUnits).length > 0 && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6660] hover:text-[#15241F] bg-[#ECEAE4] hover:bg-[#E5E2DA] rounded-lg transition-colors"
                title="Réinitialiser l'état initial"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Réinitialiser anomalie</span>
              </button>
            )}
            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1E3A2F] hover:bg-[#172F26] rounded-lg shadow-sm transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span>Export FEC</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          <div className="bg-[#F5F3EF] rounded-lg p-3.5 border border-[#E5E2DA]">
            <span className="text-xs font-medium text-[#7C8782] block mb-1">
              Loyers Attendus
            </span>
            <div className="text-xl sm:text-2xl font-semibold text-[#15241F] tabular-nums">
              {totalExpected.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              €
            </div>
            <span className="text-[11px] text-[#5A6660]">
              {units.length} lots loués au 05/10
            </span>
          </div>

          <div className="bg-[#EEF7F2] rounded-lg p-3.5 border border-[#C6E7D3]">
            <span className="text-xs font-medium text-[#236B47] block mb-1">
              Perçus & Déchargés
            </span>
            <div className="text-xl sm:text-2xl font-semibold text-[#236B47] tabular-nums">
              {totalReceived.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              €
            </div>
            <span className="text-[11px] text-[#236B47]/80">
              {Object.keys(resolvedUnits).length > 0
                ? "Anomalie résolue ce jour"
                : `${units.filter((u) => u.status === "calm").length} quittances prêtes`}
            </span>
          </div>

          <div
            className={`rounded-lg p-3.5 border transition-colors ${
              totalRemaining > 0
                ? "bg-[#FDF6ED] border-[#F5D6B5]"
                : "bg-[#EEF7F2] border-[#C6E7D3]"
            }`}
          >
            <span
              className={`text-xs font-medium block mb-1 ${
                totalRemaining > 0 ? "text-[#C86D2C]" : "text-[#236B47]"
              }`}
            >
              Solde Restant Dû
            </span>
            <div
              className={`text-xl sm:text-2xl font-semibold tabular-nums ${
                totalRemaining > 0 ? "text-[#C86D2C]" : "text-[#236B47]"
              }`}
            >
              {totalRemaining.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              €
            </div>
            <span
              className={`text-[11px] ${
                totalRemaining > 0 ? "text-[#C86D2C]/80" : "text-[#236B47]/80"
              }`}
            >
              {totalRemaining > 0 ? "1 action requise" : "Tout est à jour"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Principle Banner (Discreet) */}
      <div className="flex items-center justify-between text-xs px-1 text-[#5A6660]">
        <span>
          Règle B.1 : <strong className="text-[#15241F]">CALM ≠ CARD</strong>.
          Seule l'exception se déploie. Les baux sains sont des lignes de 42px.
        </span>
        <span className="text-[#7C8782] font-mono text-[11px]">
          {units.length} baux en cours
        </span>
      </div>

      {/* 3. The Grand Livre Registry */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] shadow-sm overflow-hidden">
        {/* Table Header (Hidden on Mobile) */}
        {!isMobile && (
          <div className="grid grid-cols-12 px-5 py-3 bg-[#F5F3EF] border-b border-[#E5E2DA] text-[11.5px] font-semibold text-[#7C8782] uppercase tracking-wider">
            <div className="col-span-4">Logement & Adresse</div>
            <div className="col-span-3">Locataire en Titre</div>
            <div className="col-span-2 text-right">Loyer + Charges</div>
            <div className="col-span-3 text-right">Statut & Décharge</div>
          </div>
        )}

        {/* Rows List */}
        <div className="divide-y divide-[#E5E2DA]">
          {units.map((unit) => {
            const isResolved = resolvedUnits[unit.id] === true;
            const effectiveStatus = isResolved ? "calm" : unit.status;
            const isAttention = effectiveStatus === "attention" || effectiveStatus === "danger";

            if (isAttention) {
              /* ── DEPLOYED EXCEPTION ROW (ATTENTION) ── */
              return (
                <div
                  key={unit.id}
                  className={`p-4 sm:p-5 transition-all duration-200 ${
                    effectiveStatus === "danger"
                      ? "bg-[#FDF1F0] border-l-4 border-l-[#B9382B]"
                      : "bg-[#FDF6ED] border-l-4 border-l-[#C86D2C]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Info & Note */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full border ${
                            effectiveStatus === "danger"
                              ? "bg-white text-[#B9382B] border-[#F6C4C0]"
                              : "bg-white text-[#C86D2C] border-[#F5D6B5]"
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>
                            {effectiveStatus === "danger" ? "Impayé" : "Solde partiel"}
                          </span>
                        </span>
                        <span className="font-semibold text-sm text-[#15241F]">
                          {unit.city} — {unit.type} ({unit.surface} m²)
                        </span>
                      </div>

                      <div className="text-xs text-[#5A6660]">{unit.address}</div>

                      <div
                        className={`text-xs font-medium pt-1 ${
                          effectiveStatus === "danger" ? "text-[#B9382B]" : "text-[#C86D2C]"
                        }`}
                      >
                        {unit.exceptionNote}
                      </div>
                    </div>

                    {/* Right: Amounts & Primary Contextual Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5D6B5]/60">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#15241F] tabular-nums">
                          {unit.rentReceived} € perçus
                        </div>
                        <div
                          className={`text-xs font-medium tabular-nums ${
                            effectiveStatus === "danger" ? "text-[#B9382B]" : "text-[#C86D2C]"
                          }`}
                        >
                          Reste {unit.rentExpected - unit.rentReceived} € dû
                        </div>
                      </div>

                      <button
                        onClick={() => handleSettleUnit(unit.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition-all active:scale-[0.98] ${
                          effectiveStatus === "danger"
                            ? "bg-[#B9382B] hover:bg-[#9E2E23]"
                            : "bg-[#1E3A2F] hover:bg-[#172F26]"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Pointer le solde</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            /* ── COMPACT CALM ROW (CALM ≠ CARD : 42px) ── */
            return (
              <div
                key={unit.id}
                className={`flex items-center justify-between px-4 sm:px-5 py-2.5 hover:bg-[#F5F3EF]/60 transition-colors ${
                  isResolved ? "bg-[#EEF7F2]/40" : ""
                }`}
              >
                {/* Desktop Grid Layout */}
                <div className="hidden sm:grid grid-cols-12 w-full items-center">
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#236B47]" />
                    <span className="font-semibold text-[13.5px] text-[#15241F]">
                      {unit.city}
                    </span>
                    <span className="text-xs text-[#7C8782] truncate max-w-[200px]">
                      {unit.address}
                    </span>
                  </div>

                  <div className="col-span-3 text-xs text-[#5A6660]">
                    <span className="font-medium text-[#15241F]">{unit.tenantName}</span>
                    <span className="text-[#7C8782] ml-1">({unit.type})</span>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="text-[13.5px] font-semibold text-[#15241F] tabular-nums">
                      {unit.rentExpected.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[#EEF7F2] text-[#236B47] border border-[#C6E7D3] rounded-full">
                      <Check className="w-3 h-3" />
                      <span>Réglé</span>
                    </span>
                    <button
                      className="p-1 text-[#7C8782] hover:text-[#1E3A2F] rounded hover:bg-[#ECEAE4] transition-colors"
                      title="Télécharger la quittance"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Compact 42px Line */}
                <div className="sm:hidden flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#236B47] flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-xs text-[#15241F] mr-1.5">
                        {unit.city}
                      </span>
                      <span className="text-[11px] text-[#7C8782] truncate">
                        {unit.type} · {unit.tenantName.split(" ")[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-xs font-semibold text-[#15241F] tabular-nums">
                      {unit.rentExpected} €
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-[#EEF7F2] text-[#236B47] rounded-full">
                      ✓
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. HOME BASE COMPONENT (PROPERTY VIEW)                                     */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1HomeBaseView() {
  return (
    <div className="space-y-6">
      {/* Property Identity Card */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E2DA]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7C8782] mb-1">
              <span className="font-medium text-[#1E3A2F] bg-[#EEF4F1] px-2 py-0.5 rounded">
                Lot #NT-44002
              </span>
              <span>· Résidence Les Loriettes</span>
            </div>
            <h1 className="text-2xl font-semibold text-[#15241F] tracking-tight">
              Nantes Centre — T2 de 54 m²
            </h1>
            <p className="text-xs text-[#5A6660] mt-0.5">
              14 bis, avenue du Maréchal de Lattre de Tassigny, Escalier B, Bâtiment 4, 44000 Nantes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#EEF7F2] text-[#236B47] border border-[#C6E7D3] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#236B47]" />
              <span>Bail actif · Occupé</span>
            </span>
          </div>
        </div>

        {/* Property Key Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
          <div>
            <span className="text-[#7C8782] block mb-1">Loyer Nu Exigible</span>
            <span className="text-base font-semibold text-[#15241F] tabular-nums">780,00 €</span>
          </div>
          <div>
            <span className="text-[#7C8782] block mb-1">Provisions Charges</span>
            <span className="text-base font-semibold text-[#15241F] tabular-nums">70,00 €</span>
          </div>
          <div>
            <span className="text-[#7C8782] block mb-1">Total Mensuel</span>
            <span className="text-base font-semibold text-[#1E3A2F] tabular-nums">850,00 €</span>
          </div>
          <div>
            <span className="text-[#7C8782] block mb-1">Date d'Exigibilité</span>
            <span className="text-base font-semibold text-[#15241F]">5 du mois</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Tenant Profile & Active Lease */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tenant Profile */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA]">
            <h2 className="text-sm font-semibold text-[#15241F] flex items-center gap-2">
              <User className="w-4 h-4 text-[#1E3A2F]" />
              <span>Locataire en Titre</span>
            </h2>
            <span className="text-[11px] text-[#7C8782]">Entré le 15/09/2024</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Nom complet</span>
              <span className="font-semibold text-[#15241F]">M. Alexandre de La Tour-du-Pin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Téléphone</span>
              <span className="text-[#15241F]">06 42 19 88 02</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Email</span>
              <span className="text-[#15241F]">alexandre.latour@gmail.com</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#E5E2DA]">
              <span className="text-[#7C8782]">Cautionnaire</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#236B47] bg-[#EEF7F2] px-2 py-0.5 rounded">
                <Shield className="w-3 h-3" />
                <span>Garant Visale Certifié</span>
              </span>
            </div>
          </div>
        </div>

        {/* Active Lease & Indexation */}
        <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA]">
            <h2 className="text-sm font-semibold text-[#15241F] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1E3A2F]" />
              <span>Conditions du Bail</span>
            </h2>
            <span className="text-[11px] font-medium text-[#1E3A2F] bg-[#EEF4F1] px-2 py-0.5 rounded">
              Loi 6 juillet 1989
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Typologie du contrat</span>
              <span className="font-semibold text-[#15241F]">Bail d'habitation meublé (1 an)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Dépôt de garantie séquestré</span>
              <span className="font-semibold text-[#15241F] tabular-nums">1 560,00 € (2 mois nu)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8782]">Clause révision IRL</span>
              <span className="text-[#15241F]">Trimestre T2 (Prochaine révision : Sept. 2027)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#E5E2DA]">
              <span className="text-[#7C8782]">Indice de référence initial</span>
              <span className="text-[#15241F] font-mono text-[11px]">IRL T2 2024 = 145.17</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chronological Document Registry */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E2DA] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#15241F] flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#1E3A2F]" />
            <span>Registre Documentaire Conforme</span>
          </h2>
          <span className="text-xs text-[#7C8782]">Archivage légal Loi 1989</span>
        </div>

        <div className="divide-y divide-[#E5E2DA] text-xs">
          {[
            {
              name: "Quittance de loyer · Octobre 2026",
              ref: "Art. 21 Loi 89 · Décharge complète",
              date: "05/10/2026",
              status: "Disponible",
            },
            {
              name: "Quittance de loyer · Septembre 2026",
              ref: "Art. 21 Loi 89 · Décharge complète",
              date: "05/09/2026",
              status: "Archivé",
            },
            {
              name: "Attestation d'assurance habitation annuelle",
              ref: "AXA Police #441029 · Valide jusqu'au 14/09/2027",
              date: "14/09/2026",
              status: "Conforme",
            },
            {
              name: "Bail de location meublée signé numériquement",
              ref: "Contrat type loi Alur + état des lieux initial",
              date: "15/09/2024",
              status: "Original",
            },
          ].map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between px-5 py-3 hover:bg-[#F5F3EF]/60">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#5A6660]" />
                <div>
                  <div className="font-semibold text-[#15241F]">{doc.name}</div>
                  <div className="text-[#7C8782] text-[11px]">{doc.ref}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[#7C8782] text-[11px]">{doc.date}</span>
                <button className="p-1.5 text-[#5A6660] hover:text-[#1E3A2F] rounded hover:bg-[#ECEAE4]">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. BILLING & FINANCIAL TRANSACTIONS                                        */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1BillingView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E2DA]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#15241F] tracking-tight">
            Journal des Règlements & Pointages
          </h1>
          <p className="text-xs text-[#5A6660] mt-0.5">
            Historique certifié des flux financiers et décharges délivrées
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#15241F] bg-white border border-[#E5E2DA] rounded-lg hover:bg-[#F5F3EF]">
            <Calendar className="w-3.5 h-3.5 text-[#5A6660]" />
            <span>Exercice 2026</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1E3A2F] hover:bg-[#172F26] rounded-lg shadow-sm">
            <Download className="w-3.5 h-3.5" />
            <span>Grand Livre CSV</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 bg-[#F5F3EF] border-b border-[#E5E2DA] text-[11px] font-semibold text-[#7C8782] uppercase tracking-wider">
          <div className="col-span-2">Date Valeur</div>
          <div className="col-span-4">Bien & Locataire</div>
          <div className="col-span-2">Mode Règlement</div>
          <div className="col-span-2 text-right">Montant</div>
          <div className="col-span-2 text-right">Quittance</div>
        </div>

        <div className="divide-y divide-[#E5E2DA] text-xs">
          {[
            {
              date: "05/10/2026",
              unit: "Paris 11e · 28 rue de la Roquette",
              tenant: "Camille Renoir",
              mode: "Virement SEPA",
              amount: 680,
              ref: "QUIT-2026-10-01",
            },
            {
              date: "05/10/2026",
              unit: "Lyon 3e · 104 cours Lafayette",
              tenant: "Élodie & Thomas Vasseur",
              mode: "Virement SEPA",
              amount: 1150,
              ref: "QUIT-2026-10-02",
            },
            {
              date: "03/10/2026",
              unit: "Nantes · 14 bis av. de Lattre",
              tenant: "M. Alexandre de La Tour-du-Pin",
              mode: "Acompte partiel",
              amount: 450,
              ref: "RECU-ACOMPTE-01",
            },
            {
              date: "05/09/2026",
              unit: "Nantes · 14 bis av. de Lattre",
              tenant: "M. Alexandre de La Tour-du-Pin",
              mode: "Virement SEPA",
              amount: 850,
              ref: "QUIT-2026-09-03",
            },
          ].map((tx, idx) => (
            <div key={idx} className="grid grid-cols-12 px-5 py-3 items-center hover:bg-[#F5F3EF]/60">
              <div className="col-span-2 text-[#5A6660] font-mono text-[11px]">{tx.date}</div>
              <div className="col-span-4">
                <div className="font-semibold text-[#15241F]">{tx.unit}</div>
                <div className="text-[#7C8782] text-[11px]">{tx.tenant}</div>
              </div>
              <div className="col-span-2 text-[#5A6660]">{tx.mode}</div>
              <div className="col-span-2 text-right font-semibold text-[#15241F] tabular-nums">
                {tx.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1.5">
                <span className="font-mono text-[10px] text-[#236B47] bg-[#EEF7F2] px-1.5 py-0.5 rounded border border-[#C6E7D3]">
                  {tx.ref}
                </span>
                <button className="p-1 text-[#7C8782] hover:text-[#1E3A2F]">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 4. LEASE DETAIL VIEW                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export function B1LeaseDetailView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E5E2DA] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E2DA]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7C8782] mb-1">
              <span>Bail d'habitation meublé</span>
              <span>· Signé le 15/09/2024</span>
            </div>
            <h1 className="text-2xl font-semibold text-[#15241F] tracking-tight">
              Bail locatif #BAIL-NT-2024
            </h1>
            <p className="text-xs text-[#5A6660]">14 bis avenue du Maréchal de Lattre, 44000 Nantes</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1E3A2F] rounded-lg">
              <Download className="w-3.5 h-3.5" />
              <span>Contrat PDF certifié</span>
            </button>
          </div>
        </div>

        {/* Legal Clauses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5 text-xs">
          <div className="space-y-2">
            <span className="font-semibold text-[#15241F] block text-sm">Clause d'Indexation IRL</span>
            <p className="text-[#5A6660] leading-relaxed">
              Révision annuelle automatique à date anniversaire. Indice de référence retenu :{" "}
              <strong>IRL T2 2024 (145.17)</strong>. Date de prochaine notification légale : 15/08/2027.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-[#15241F] block text-sm">Sûreté & Dépôt</span>
            <p className="text-[#5A6660] leading-relaxed">
              Dépôt de garantie séquestré de <strong>1 560,00 €</strong> correspondant au plafond légal
              meublé (2 mois de loyer nu). Caution solidaire Action Logement (Visale).
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-[#15241F] block text-sm">Régime des Charges</span>
            <p className="text-[#5A6660] leading-relaxed">
              Provisions sur charges avec régularisation annuelle au décompte réel du syndic. Provision
              actuelle : <strong>70,00 €/mois</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 5. LEASE FORM (WITH LIVE VALIDATION TOGGLE)                                 */
/* ────────────────────────────────────────────────────────────────────────── */

interface LeaseFormProps {
  hasErrors?: boolean;
}

export function B1LeaseFormView({ hasErrors = false }: LeaseFormProps) {
  const [showErrors, setShowErrors] = useState(hasErrors);

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DA]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#15241F] tracking-tight">
            Régiger un Nouveau Bail Conforme
          </h1>
          <p className="text-xs text-[#5A6660] mt-0.5">
            Cadre légal de la Loi du 6 juillet 1989 & décret d'application Alur
          </p>
        </div>

        <button
          onClick={() => setShowErrors(!showErrors)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            showErrors
              ? "bg-[#FDF1F0] text-[#B9382B] border-[#F6C4C0]"
              : "bg-white text-[#5A6660] border-[#E5E2DA]"
          }`}
        >
          {showErrors ? "Masquer erreurs de validation" : "Simuler erreurs de validation"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Open Breathable Blocks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Block 1: The Parties */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-[#15241F] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1E3A2F]" />
              <span>1. Les Parties au Contrat</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#5A6660] font-medium mb-1">
                  Logement concerné
                </label>
                <select className="w-full px-3 py-2 bg-[#F5F3EF] border border-[#E5E2DA] rounded-lg text-[#15241F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]">
                  <option>Nantes — T2 54 m² (14 bis av. de Lattre)</option>
                  <option>Paris 11e — Studio 24 m² (28 rue de la Roquette)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5A6660] font-medium mb-1">
                  Type de bail
                </label>
                <select className="w-full px-3 py-2 bg-[#F5F3EF] border border-[#E5E2DA] rounded-lg text-[#15241F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]">
                  <option>Location Meublée (1 an reconductible)</option>
                  <option>Location Nue (3 ans reconductible)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#5A6660] font-medium mb-1">
                  Nom et prénom du locataire
                </label>
                <input
                  type="text"
                  defaultValue={showErrors ? "" : "M. Alexandre de La Tour-du-Pin"}
                  placeholder="Ex : M. Pierre Dupont"
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-[#15241F] focus:outline-none focus:ring-2 ${
                    showErrors
                      ? "border-[#B9382B] focus:ring-[#B9382B]"
                      : "border-[#E5E2DA] focus:ring-[#1E3A2F]"
                  }`}
                />
                {showErrors && (
                  <p className="text-[11px] text-[#B9382B] mt-1">
                    Veuillez renseigner le nom complet du locataire en titre.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Block 2: Financial Terms */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-[#15241F] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1E3A2F]" />
              <span>2. Conditions Financières & Règlement</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#5A6660] font-medium mb-1">
                  Loyer mensuel nu (€)
                </label>
                <input
                  type="number"
                  defaultValue={showErrors ? 0 : 780}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-[#15241F] tabular-nums focus:outline-none focus:ring-2 ${
                    showErrors
                      ? "border-[#B9382B] focus:ring-[#B9382B]"
                      : "border-[#E5E2DA] focus:ring-[#1E3A2F]"
                  }`}
                />
                {showErrors && (
                  <p className="text-[11px] text-[#B9382B] mt-1">
                    Le loyer doit être supérieur à 0 €.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#5A6660] font-medium mb-1">
                  Provisions charges (€)
                </label>
                <input
                  type="number"
                  defaultValue={70}
                  className="w-full px-3 py-2 bg-white border border-[#E5E2DA] rounded-lg text-[#15241F] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block text-[#5A6660] font-medium mb-1">
                  Exigibilité mensuelle
                </label>
                <select className="w-full px-3 py-2 bg-[#F5F3EF] border border-[#E5E2DA] rounded-lg text-[#15241F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]">
                  <option>Le 5 du mois</option>
                  <option>Le 1er du mois</option>
                  <option>Le 10 du mois</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Legal Sidebar: Floating Law 1989 Verification */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#F5F3EF] rounded-xl border border-[#D4CFC4] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#15241F]">
              <Shield className="w-4 h-4 text-[#1E3A2F]" />
              <span>Contrôle Légal Loi du 6 juillet 1989</span>
            </div>

            <div className="text-xs text-[#5A6660] space-y-2">
              <div className="flex justify-between pb-2 border-b border-[#E5E2DA]">
                <span>Plafond Dépôt (Meublé) :</span>
                <strong className="text-[#15241F]">Max. 2 mois nu</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5E2DA]">
                <span>Montant calculé :</span>
                <strong className="text-[#1E3A2F] tabular-nums">1 560,00 € max</strong>
              </div>
              <div className="flex justify-between">
                <span>Encadrement des loyers :</span>
                <span className="text-[#236B47] font-semibold">Zone tendue (Nantes)</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#E5E2DA] text-[11px] text-[#7C8782] leading-relaxed">
              RentReady insère automatiquement la clause type de révision annuelle IRL (Art. 17-1)
              et pré-remplit les mentions obligatoires du décret n° 2015-587.
            </div>

            <button className="w-full py-2.5 bg-[#1E3A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#172F26] transition-colors shadow-sm">
              Générer le contrat prêt à signer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
