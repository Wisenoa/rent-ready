"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { B1ViewMode } from "./types";
import { B1AppNavbar, B1PublicNavbar } from "./components/Navbar";
import {
  B1DashboardView,
  B1HomeBaseView,
  B1BillingView,
  B1LeaseDetailView,
  B1LeaseFormView,
} from "./components/ProductViews";
import {
  B1HomepageView,
  B1PricingView,
  B1FreeToolIRLView,
  B1FreeToolQuittanceView,
  B1ArticleView,
  B1CityPageView,
  B1RegisterView,
} from "./components/PublicViews";
import {
  B1WordmarkSheet,
  B1AppIconSheet,
  B1ColorSheet,
  B1TypographySheet,
  B1MotionStoryboard,
} from "./components/BrandSheets";

function B1PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read view parameter directly from URL or default to homepage_1440
  const currentMode = (searchParams.get("view") as B1ViewMode) || "homepage_1440";

  const handleSelectMode = (mode: B1ViewMode) => {
    router.replace(`/design-preview/b1?view=${mode}`, { scroll: false });
  };

  // Determine categories
  const isProduct =
    currentMode.startsWith("dashboard") ||
    currentMode.startsWith("home_base") ||
    currentMode.startsWith("billing") ||
    currentMode.startsWith("lease");

  const isBrandSheet =
    currentMode.endsWith("_sheet") || currentMode.endsWith("_storyboard");

  const isMobileView = currentMode.endsWith("_390") || currentMode.endsWith("_360");
  const is360 = currentMode.endsWith("_360");

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#15241F] font-sans antialiased selection:bg-[#1E3A2F] selection:text-[#F5F3EF]">
      {/* ── 0. B.1 REVIEWER NAVIGATION TOOLBAR ── */}
      <div className="bg-[#15241F] text-white px-4 py-2.5 text-xs border-b border-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#A3E635] tracking-wide">
              B.1 ATELIER PROTOTYPE
            </span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-white/70 hidden sm:inline">
              Vue : <strong className="text-white">{currentMode}</strong>
            </span>
          </div>

          {/* Quick Category Dropdown / Switchers */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {/* Product Surfaces */}
            <select
              value={isProduct ? currentMode : ""}
              onChange={(e) => e.target.value && handleSelectMode(e.target.value as B1ViewMode)}
              className="bg-[#1E3A2F] text-white px-2.5 py-1 rounded border border-white/20 text-xs focus:outline-none"
            >
              <option value="" disabled>
                -- PRODUIT (10 vues) --
              </option>
              <option value="dashboard_default_1440">Dashboard (3 biens, exception)</option>
              <option value="dashboard_dense_1440">Dashboard Dense (10 biens)</option>
              <option value="dashboard_exceptions_1440">Dashboard (3 exceptions)</option>
              <option value="dashboard_390">Dashboard Mobile (390px)</option>
              <option value="dashboard_360">Dashboard Mobile (360px)</option>
              <option value="home_base_1440">Home Base Bien (Nantes)</option>
              <option value="billing_1440">Encaissements & Règlements</option>
              <option value="lease_detail_1440">Consultation Bail</option>
              <option value="lease_form_1440">Création Bail (Aéré)</option>
              <option value="lease_form_errors_390">Création Bail Erreurs (390px)</option>
            </select>

            {/* Public Surfaces */}
            <select
              value={!isProduct && !isBrandSheet ? currentMode : ""}
              onChange={(e) => e.target.value && handleSelectMode(e.target.value as B1ViewMode)}
              className="bg-[#1E3A2F] text-white px-2.5 py-1 rounded border border-white/20 text-xs focus:outline-none"
            >
              <option value="" disabled>
                -- PUBLIC & SEO (10 vues) --
              </option>
              <option value="homepage_1440">Homepage H3 (Exception Demo)</option>
              <option value="homepage_h1_1440">Homepage H1 (Product First)</option>
              <option value="homepage_h2_1440">Homepage H2 (Outcome First)</option>
              <option value="homepage_390">Homepage Mobile (390px)</option>
              <option value="pricing_1440">Tarifs (Starter & Pro)</option>
              <option value="pricing_390">Tarifs Mobile (390px)</option>
              <option value="free_tool_1440">Simulateur IRL (Gratuit)</option>
              <option value="free_tool_390">Simulateur IRL Mobile (390px)</option>
              <option value="free_tool_quittance_1440">Quittance Gratuite</option>
              <option value="article_1440">Guide SEO IRL 2026</option>
              <option value="article_390">Guide SEO Mobile (390px)</option>
              <option value="city_page_1440">Page Ville (Nantes)</option>
              <option value="register_1440">Inscription / Onboarding</option>
              <option value="register_390">Inscription Mobile (390px)</option>
            </select>

            {/* Brand Sheets */}
            <select
              value={isBrandSheet ? currentMode : ""}
              onChange={(e) => e.target.value && handleSelectMode(e.target.value as B1ViewMode)}
              className="bg-[#1E3A2F] text-white px-2.5 py-1 rounded border border-white/20 text-xs focus:outline-none"
            >
              <option value="" disabled>
                -- PLANCHES DE MARQUE (5) --
              </option>
              <option value="wordmark_sheet">Wordmark (4 pistes)</option>
              <option value="app_icon_sheet">Symbole & Icône App (4 pistes)</option>
              <option value="color_sheet">Tokens Couleurs & OKLCH</option>
              <option value="typography_sheet">Typographie & Tabular-nums</option>
              <option value="motion_storyboard">Storyboard Rétraction</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 1. APPROPRIATE SYSTEM NAVBAR ── */}
      {isProduct ? (
        <B1AppNavbar
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
          unitsCount={currentMode === "dashboard_dense_1440" ? 10 : 3}
          exceptionsCount={
            currentMode === "dashboard_exceptions_1440" ? 3 : 1
          }
        />
      ) : (
        <B1PublicNavbar currentMode={currentMode} onSelectMode={handleSelectMode} />
      )}

      {/* ── 2. VIEW CANVAS WRAPPER ── */}
      <main
        className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all ${
          isMobileView
            ? is360
              ? "max-w-[360px] bg-white rounded-2xl shadow-xl my-6 border-4 border-[#15241F] p-4 min-h-[640px]"
              : "max-w-[390px] bg-white rounded-2xl shadow-xl my-6 border-4 border-[#15241F] p-4 min-h-[700px]"
            : "max-w-7xl"
        }`}
      >
        {/* Render View Switch */}
        {/* Product Views */}
        {currentMode === "dashboard_default_1440" && (
          <B1DashboardView mode="default" isMobile={false} />
        )}
        {currentMode === "dashboard_dense_1440" && (
          <B1DashboardView mode="dense" isMobile={false} />
        )}
        {currentMode === "dashboard_exceptions_1440" && (
          <B1DashboardView mode="exceptions" isMobile={false} />
        )}
        {(currentMode === "dashboard_390" || currentMode === "dashboard_360") && (
          <B1DashboardView mode="dense" isMobile={true} />
        )}
        {currentMode === "home_base_1440" && <B1HomeBaseView />}
        {currentMode === "billing_1440" && <B1BillingView />}
        {currentMode === "lease_detail_1440" && <B1LeaseDetailView />}
        {currentMode === "lease_form_1440" && <B1LeaseFormView hasErrors={false} />}
        {currentMode === "lease_form_errors_390" && <B1LeaseFormView hasErrors={true} />}

        {/* Public Views */}
        {currentMode === "homepage_1440" && (
          <B1HomepageView composition="h3" onSelectMode={handleSelectMode} isMobile={false} />
        )}
        {currentMode === "homepage_h1_1440" && (
          <B1HomepageView composition="h1" onSelectMode={handleSelectMode} isMobile={false} />
        )}
        {currentMode === "homepage_h2_1440" && (
          <B1HomepageView composition="h2" onSelectMode={handleSelectMode} isMobile={false} />
        )}
        {currentMode === "homepage_390" && (
          <B1HomepageView composition="h3" onSelectMode={handleSelectMode} isMobile={true} />
        )}
        {(currentMode === "pricing_1440" || currentMode === "pricing_390") && (
          <B1PricingView onSelectMode={handleSelectMode} />
        )}
        {(currentMode === "free_tool_1440" || currentMode === "free_tool_390") && (
          <B1FreeToolIRLView onSelectMode={handleSelectMode} />
        )}
        {currentMode === "free_tool_quittance_1440" && (
          <B1FreeToolQuittanceView onSelectMode={handleSelectMode} />
        )}
        {(currentMode === "article_1440" || currentMode === "article_390") && (
          <B1ArticleView onSelectMode={handleSelectMode} />
        )}
        {currentMode === "city_page_1440" && <B1CityPageView onSelectMode={handleSelectMode} />}
        {(currentMode === "register_1440" || currentMode === "register_390") && (
          <B1RegisterView onSelectMode={handleSelectMode} />
        )}

        {/* Brand Sheets */}
        {currentMode === "wordmark_sheet" && <B1WordmarkSheet />}
        {currentMode === "app_icon_sheet" && <B1AppIconSheet />}
        {currentMode === "color_sheet" && <B1ColorSheet />}
        {currentMode === "typography_sheet" && <B1TypographySheet />}
        {currentMode === "motion_storyboard" && <B1MotionStoryboard />}
      </main>

      {/* ── 3. FOOTER ── */}
      <footer className="border-t border-[#E5E2DA] bg-[#F5F3EF] py-8 text-xs text-[#7C8782]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#15241F]">RentReady</span>
            <span>· Système de Design B.1 « Modern French Atelier »</span>
          </div>
          <div className="flex items-center gap-4 text-[#5A6660]">
            <span>Hébergement souverain France</span>
            <span>·</span>
            <span>Conforme Loi 6 juillet 1989</span>
            <span>·</span>
            <span>Série INSEE n° 001515333</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function B1PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center p-8 text-xs text-[#5A6660]">
          Chargement du système B.1...
        </div>
      }
    >
      <B1PreviewContent />
    </Suspense>
  );
}
