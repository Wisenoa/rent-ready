"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { B3ViewMode, B3DemoState } from "./types";
import { B3Homepage } from "./components/B3Homepage";
import { B3Navbar } from "./components/B3Navbar";
import { B3Hero } from "./components/B3Hero";
import { B3InteractiveDemo } from "./components/B3InteractiveDemo";

function B3PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const viewParam = (searchParams.get("view") as B3ViewMode) || "homepage_1440";
  const stateParam = (searchParams.get("state") as B3DemoState) || "attention";

  const handleSelectMode = (mode: B3ViewMode) => {
    router.replace(`/design-preview/b3?view=${mode}`, { scroll: false });
  };

  const isMobile = viewParam === "homepage_390" || viewParam === "homepage_360" || viewParam === "hero_390";
  const is360 = viewParam === "homepage_360";
  const demoState: B3DemoState = viewParam === "demo_resolved" || stateParam === "resolved" ? "resolved" : "attention";

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#15241F] font-sans antialiased selection:bg-[#1E3A2F] selection:text-[#F5F3EF]">
      {/* ── B.3 REVIEWER STATUS BAR ── */}
      <div className="bg-[#15241F] text-white px-4 py-2 text-xs sticky top-0 z-50 border-b border-black/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" aria-hidden="true" />
            <span className="font-bold tracking-tight">
              RentReady B.3 — Homepage Finale Éditée
            </span>
            <span className="text-white/60 text-[11px] hidden md:inline">
              (Architecture C simplifiée · DA B.1 · Zéro card soup)
            </span>
          </div>

          {/* Clean Viewport Helpers (Single homepage proposition) */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-white/60">Vue :</span>
            {[
              { id: "homepage_1440", label: "Desktop 1440" },
              { id: "homepage_390", label: "Mobile 390" },
              { id: "homepage_360", label: "Mobile 360" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelectMode(v.id as B3ViewMode)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewParam === v.id
                    ? "bg-[#A3E635] text-[#15241F] font-semibold"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT (RESPONSIVE WRAPPER) ── */}
      <div
        className={
          isMobile
            ? `mx-auto shadow-2xl min-h-screen bg-[#F5F3EF] border-x border-[#E5E2DA] transition-all ${
                is360 ? "max-w-[360px]" : "max-w-[390px]"
              }`
            : "w-full"
        }
      >
        {/* Full Homepage Views */}
        {(viewParam === "homepage_1440" ||
          viewParam === "homepage_390" ||
          viewParam === "homepage_360") && (
          <B3Homepage isMobile={isMobile} demoState={demoState} />
        )}

        {/* Hero Close-up Views */}
        {(viewParam === "hero_1440" || viewParam === "hero_390") && (
          <div className="min-h-screen bg-[#F5F3EF]">
            <B3Navbar isMobile={isMobile} />
            <B3Hero isMobile={isMobile} demoState={demoState} />
          </div>
        )}

        {/* Isolated Demo States */}
        {(viewParam === "demo_attention" || viewParam === "demo_resolved") && (
          <div className="p-6 sm:p-12 max-w-4xl mx-auto">
            <B3InteractiveDemo
              isMobile={isMobile}
              initialState={viewParam === "demo_resolved" ? "resolved" : "attention"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function B3PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F3EF] text-xs text-[#5A6660]">
          Chargement de RentReady B.3...
        </div>
      }
    >
      <B3PreviewContent />
    </Suspense>
  );
}
