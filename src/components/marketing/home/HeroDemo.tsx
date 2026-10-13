"use client";

import { useEffect, useRef, useState } from "react";
import { LivePanel } from "./LivePanel";
import type { MonthState } from "./month-types";

/** Pause after each state before the next payment lands, in ms. */
const HOLD = [900, 800, 800, 1500];

/** The title's underline on "prêtes." follows the demo (see home.module.css). */
function markTitle(settled: boolean) {
  const title = document.getElementById("hero-title");
  if (title) title.dataset.settled = String(settled);
}

/**
 * The hero's live moment. The server renders `states[resting]`: three homes,
 * one paid short (reçu de paiement partiel, reste dû) — complete without
 * JavaScript, for search engines and with reduced motion. Once the panel is in
 * view, the balance lands: the figures count, the line turns to "Réglé", the
 * quittance is ready, the month reaches 100 % and "prêtes." is underlined.
 *
 * Playing forward from what is already on screen means nothing ever rewinds in
 * front of the visitor, however late hydration happens. "Rejouer" replays the
 * whole month from the 1st, on request; "Pause" stops it.
 */
export function HeroDemo({ states, resting }: { states: MonthState[]; resting: number }) {
  const [index, setIndex] = useState(resting);
  const [phase, setPhase] = useState<"idle" | "playing" | "paused" | "done">("idle");
  const root = useRef<HTMLDivElement>(null);
  const last = states.length - 1;

  const replay = () => {
    setIndex(0);
    setPhase("playing");
    markTitle(false);
  };

  // One step per tick while playing; the last state ends the run.
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setTimeout(
      () => {
        if (index >= last) {
          setPhase("done");
          markTitle(true);
        } else {
          setIndex(index + 1);
        }
      },
      index >= last ? 0 : (HOLD[index] ?? 900)
    );
    return () => window.clearTimeout(timer);
  }, [phase, index, last]);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setPhase((current) => (current === "idle" ? "playing" : current));
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const control =
    phase === "playing"
      ? { label: "Pause", run: () => setPhase("paused") }
      : phase === "paused"
        ? { label: "Reprendre", run: () => setPhase("playing") }
        : { label: phase === "done" ? "Rejouer le mois" : "Voir le mois défiler", run: replay };

  return (
    <div ref={root}>
      <LivePanel state={states[index]} intro compact />
      <div className="mt-4 flex items-start justify-between gap-4 text-[12.5px] text-[#FAF9F5]/65">
        <p>Le suivi du mois dans Lokna. Exemple fictif, calculé avec les règles du logiciel.</p>
        <button
          type="button"
          onClick={control.run}
          className="shrink-0 rounded-sm text-[#FAF9F5]/85 underline decoration-[#7FA68E] underline-offset-4 transition-colors hover:text-[#FAF9F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF9F5]"
        >
          {control.label}
        </button>
      </div>
    </div>
  );
}
