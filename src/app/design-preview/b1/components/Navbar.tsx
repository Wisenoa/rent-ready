"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Bell, ChevronDown, Plus, ShieldCheck } from "lucide-react";
import { B1ViewMode } from "../types";

interface PublicNavProps {
  currentMode: B1ViewMode;
  onSelectMode: (mode: B1ViewMode) => void;
}

export function B1PublicNavbar({ currentMode, onSelectMode }: PublicNavProps) {
  return (
    <header className="border-b border-[#E5E2DA] bg-[#F5F3EF]/95 backdrop-blur-sm sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark & Tag */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectMode("homepage_1440")}
            className="flex items-baseline gap-2 text-left group"
          >
            <span className="font-sans text-xl font-semibold tracking-tight text-[#15241F] group-hover:text-[#1E3A2F] transition-colors">
              RentReady
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium text-[#7C8782] border-l border-[#D4CFC4] pl-2.5">
              Intendance foncière
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-[13.5px] font-medium text-[#5A6660]">
          <button
            onClick={() => onSelectMode("homepage_1440")}
            className={`hover:text-[#15241F] transition-colors ${
              currentMode.startsWith("homepage") ? "text-[#1E3A2F] font-semibold" : ""
            }`}
          >
            Le Produit
          </button>
          <button
            onClick={() => onSelectMode("free_tool_1440")}
            className={`hover:text-[#15241F] transition-colors ${
              currentMode.startsWith("free_tool") ? "text-[#1E3A2F] font-semibold" : ""
            }`}
          >
            Simulateur IRL
          </button>
          <button
            onClick={() => onSelectMode("free_tool_quittance_1440")}
            className="hover:text-[#15241F] transition-colors"
          >
            Quittance Gratuite
          </button>
          <button
            onClick={() => onSelectMode("pricing_1440")}
            className={`hover:text-[#15241F] transition-colors ${
              currentMode.startsWith("pricing") ? "text-[#1E3A2F] font-semibold" : ""
            }`}
          >
            Tarifs
          </button>
          <button
            onClick={() => onSelectMode("article_1440")}
            className={`hover:text-[#15241F] transition-colors ${
              currentMode.startsWith("article") ? "text-[#1E3A2F] font-semibold" : ""
            }`}
          >
            Guide Légal
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectMode("dashboard_default_1440")}
            className="hidden sm:inline-flex text-[13px] font-medium text-[#15241F] hover:text-[#1E3A2F] px-3 py-1.5 transition-colors"
          >
            Espace Bailleur
          </button>
          <button
            onClick={() => onSelectMode("register_1440")}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#1E3A2F] hover:bg-[#172F26] rounded-lg shadow-[0_1px_2px_rgba(21,36,31,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all active:scale-[0.98]"
          >
            <span>Essai 14 jours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

interface AppNavProps {
  currentMode: B1ViewMode;
  onSelectMode: (mode: B1ViewMode) => void;
  unitsCount?: number;
  exceptionsCount?: number;
}

export function B1AppNavbar({
  currentMode,
  onSelectMode,
  unitsCount = 3,
  exceptionsCount = 1,
}: AppNavProps) {
  return (
    <header className="border-b border-[#E5E2DA] bg-[#F5F3EF] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand + Active Period */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectMode("dashboard_default_1440")}
            className="flex items-baseline gap-2 group"
          >
            <span className="font-sans text-lg font-semibold tracking-tight text-[#15241F] group-hover:text-[#1E3A2F] transition-colors">
              RentReady
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-[12px] text-[#5A6660] bg-[#ECEAE4] px-2.5 py-1 rounded-md border border-[#E5E2DA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2F]" />
            <span className="font-medium text-[#15241F]">Arrêté Octobre 2026</span>
            <span className="text-[#7C8782]">· 5 échues</span>
          </div>
        </div>

        {/* Center: Operational Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 text-[13px] font-medium">
          <button
            onClick={() => onSelectMode("dashboard_default_1440")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentMode.startsWith("dashboard")
                ? "bg-white text-[#15241F] shadow-sm font-semibold border border-[#E5E2DA]"
                : "text-[#5A6660] hover:text-[#15241F] hover:bg-[#ECEAE4]/60"
            }`}
          >
            Grand Livre
            {exceptionsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[11px] font-semibold bg-[#FDF6ED] text-[#C86D2C] border border-[#F5D6B5] rounded-full">
                {exceptionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectMode("home_base_1440")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentMode === "home_base_1440"
                ? "bg-white text-[#15241F] shadow-sm font-semibold border border-[#E5E2DA]"
                : "text-[#5A6660] hover:text-[#15241F] hover:bg-[#ECEAE4]/60"
            }`}
          >
            Biens
          </button>

          <button
            onClick={() => onSelectMode("billing_1440")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentMode === "billing_1440"
                ? "bg-white text-[#15241F] shadow-sm font-semibold border border-[#E5E2DA]"
                : "text-[#5A6660] hover:text-[#15241F] hover:bg-[#ECEAE4]/60"
            }`}
          >
            Encaissements
          </button>

          <button
            onClick={() => onSelectMode("lease_detail_1440")}
            className={`hidden md:inline-block px-3 py-1.5 rounded-md transition-colors ${
              currentMode.startsWith("lease")
                ? "bg-white text-[#15241F] shadow-sm font-semibold border border-[#E5E2DA]"
                : "text-[#5A6660] hover:text-[#15241F] hover:bg-[#ECEAE4]/60"
            }`}
          >
            Baux
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectMode("lease_form_1440")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-semibold text-white bg-[#1E3A2F] hover:bg-[#172F26] rounded-md shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nouveau bail</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-[#ECEAE4] border border-[#E5E2DA] flex items-center justify-center text-[12px] font-semibold text-[#15241F]">
            AL
          </div>
        </div>
      </div>
    </header>
  );
}
