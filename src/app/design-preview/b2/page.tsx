"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { B2ViewMode } from "./types";
import {
  HeroCategoryFirst,
  HeroOutcomeFirst,
  HeroExceptionFirst,
  HeroProductFirst,
  HeroHybrid,
} from "./components/Heroes";
import {
  B2Navbar,
  B2Footer,
  HomepageArchitectureA,
  HomepageArchitectureB,
  HomepageArchitectureC,
} from "./components/FullHomepages";
import { InteractiveDemo } from "./components/InteractiveDemo";

function B2PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mode resolution
  const viewParam = (searchParams.get("view") as B2ViewMode) || "homepage_c_1440";
  const heroParam = searchParams.get("hero");
  const archParam = searchParams.get("arch");
  const stateParam = searchParams.get("state");

  let currentMode: B2ViewMode = viewParam;

  if (heroParam === "1") currentMode = "hero_01_1440";
  else if (heroParam === "2") currentMode = "hero_02_1440";
  else if (heroParam === "3") currentMode = "hero_03_1440";
  else if (heroParam === "4") currentMode = "hero_04_1440";
  else if (heroParam === "5") currentMode = "hero_05_1440";

  if (archParam === "a") currentMode = "homepage_a_1440";
  else if (archParam === "b") currentMode = "homepage_b_1440";
  else if (archParam === "c") currentMode = "homepage_c_1440";

  if (stateParam === "before") currentMode = "product_demo_before";
  else if (stateParam === "attention") currentMode = "product_demo_attention";
  else if (stateParam === "resolved") currentMode = "product_demo_resolved";

  const handleSelectMode = (mode: B2ViewMode) => {
    router.replace(`/design-preview/b2?view=${mode}`, { scroll: false });
  };

  const isMobile = currentMode.endsWith("_390") || currentMode.endsWith("_360");
  const is360 = currentMode.endsWith("_360");

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#15241F] font-sans antialiased selection:bg-[#1E3A2F] selection:text-[#F5F3EF]">
      {/* ── B.2 REVIEWER TOOLBAR ── */}
      <div className="bg-[#15241F] text-white px-4 py-2 text-xs sticky top-0 z-50 border-b border-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
            <span className="font-bold tracking-tight">RentReady B.2 — Atelier Conversion & Homepage</span>
          </div>

          {/* Quick Switchers */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-white/60">5 Héros :</span>
            {[
              { id: "hero_01_1440", label: "H1 Category" },
              { id: "hero_02_1440", label: "H2 Outcome" },
              { id: "hero_03_1440", label: "H3 Exception" },
              { id: "hero_04_1440", label: "H4 Product" },
              { id: "hero_05_1440", label: "H5 Hybrid ★" },
            ].map((h) => (
              <button
                key={h.id}
                onClick={() => handleSelectMode(h.id as B2ViewMode)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  currentMode === h.id ? "bg-[#A3E635] text-[#15241F] font-semibold" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {h.label}
              </button>
            ))}

            <span className="text-white/40 ml-2">|</span>
            <span className="text-white/60 ml-1">3 Pages :</span>
            {[
              { id: "homepage_a_1440", label: "A (Product)" },
              { id: "homepage_b_1440", label: "B (Problem)" },
              { id: "homepage_c_1440", label: "C (Hybrid ★)" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectMode(p.id as B2ViewMode)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  currentMode === p.id ? "bg-[#A3E635] text-[#15241F] font-semibold" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {p.label}
              </button>
            ))}

            <span className="text-white/40 ml-2">|</span>
            <span className="text-white/60 ml-1">Démo :</span>
            {[
              { id: "product_demo_before", label: "Attention" },
              { id: "product_demo_resolved", label: "Résolu" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => handleSelectMode(d.id as B2ViewMode)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  currentMode === d.id ? "bg-[#A3E635] text-[#15241F] font-semibold" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER (RESPONSIVE WRAPPER) ── */}
      <div
        className={
          isMobile
            ? `mx-auto shadow-2xl min-h-screen bg-[#F5F3EF] border-x border-[#E5E2DA] transition-all ${
                is360 ? "max-w-[360px]" : "max-w-[390px]"
              }`
            : "w-full"
        }
      >
        {/* Render based on mode */}

        {/* ── 5 HEROES DESKTOP & MOBILE ── */}
        {(currentMode === "hero_01_1440" || currentMode === "hero_01_390") && (
          <div>
            <B2Navbar />
            <HeroCategoryFirst isMobile={isMobile} />
            <B2Footer />
          </div>
        )}

        {(currentMode === "hero_02_1440" || currentMode === "hero_02_390") && (
          <div>
            <B2Navbar />
            <HeroOutcomeFirst isMobile={isMobile} />
            <B2Footer />
          </div>
        )}

        {(currentMode === "hero_03_1440" || currentMode === "hero_03_390") && (
          <div>
            <B2Navbar />
            <HeroExceptionFirst isMobile={isMobile} />
            <B2Footer />
          </div>
        )}

        {(currentMode === "hero_04_1440" || currentMode === "hero_04_390") && (
          <div>
            <B2Navbar />
            <HeroProductFirst isMobile={isMobile} />
            <B2Footer />
          </div>
        )}

        {(currentMode === "hero_05_1440" || currentMode === "hero_05_390") && (
          <div>
            <B2Navbar />
            <HeroHybrid isMobile={isMobile} />
            <B2Footer />
          </div>
        )}

        {/* ── 3 FULL HOMEPAGES ── */}
        {(currentMode === "homepage_a_1440" || currentMode === "homepage_a_390") && (
          <HomepageArchitectureA isMobile={isMobile} />
        )}

        {(currentMode === "homepage_b_1440" || currentMode === "homepage_b_390") && (
          <HomepageArchitectureB isMobile={isMobile} />
        )}

        {(currentMode === "homepage_c_1440" ||
          currentMode === "homepage_c_390" ||
          currentMode === "homepage_selected_360") && (
          <HomepageArchitectureC isMobile={isMobile} />
        )}

        {/* ── PRODUCT DEMO STANDALONE STATES ── */}
        {currentMode === "product_demo_before" && (
          <div className="py-12 px-4 max-w-4xl mx-auto space-y-4">
            <h2 className="text-xl font-semibold text-[#15241F]">
              État 1 : Attention (Solde manquant de 400 € sur Lyon 3e)
            </h2>
            <InteractiveDemo initialState="before" standalone={true} />
          </div>
        )}

        {currentMode === "product_demo_attention" && (
          <div className="py-12 px-4 max-w-4xl mx-auto space-y-4">
            <h2 className="text-xl font-semibold text-[#15241F]">
              État 2 : Action & Tiroir contextuel (Reçu partiel & Relance)
            </h2>
            <InteractiveDemo initialState="attention" standalone={true} />
          </div>
        )}

        {currentMode === "product_demo_resolved" && (
          <div className="py-12 px-4 max-w-4xl mx-auto space-y-4">
            <h2 className="text-xl font-semibold text-[#15241F]">
              État 3 : Résolu & Calme (Quittance de solde émise, ligne rétractée)
            </h2>
            <InteractiveDemo initialState="resolved" standalone={true} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function B2PreviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#5A6660]">Chargement de l'atelier B.2...</div>}>
      <B2PreviewContent />
    </Suspense>
  );
}
