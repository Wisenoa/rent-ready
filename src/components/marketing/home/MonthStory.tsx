"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { LivePanel } from "./LivePanel";
import type { IssuedDocument, MonthState } from "./month-types";
import styles from "./home.module.css";

/**
 * Where on screen a step "is being read": a little under the middle on a
 * desktop, lower on a phone so the step being read sits below the pinned panel.
 */
const LINE_DESKTOP = 0.6;
const LINE_PHONE = 0.78;

/**
 * The month moving forward with the page. Scrolling is native: the progress of
 * the step list across a reading line picks the panel's state, and a ruled
 * line fills alongside. The dates are buttons, so the story also works from
 * the keyboard and by tapping. Step texts are rendered on the server and
 * passed in, so they are in the HTML whatever happens here.
 */
export function MonthStory({
  states,
  dates,
  steps,
}: {
  states: MonthState[];
  dates: string[];
  steps: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const [line, setLine] = useState(LINE_PHONE);
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setLine(desktop.matches ? LINE_DESKTOP : LINE_PHONE);
    const frame = requestAnimationFrame(update);
    desktop.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      desktop.removeEventListener("change", update);
    };
  }, []);
  const { scrollYProgress } = useScroll({
    target: list,
    offset: [`start ${line}`, `end ${line}`],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(states.length - 1, Math.max(0, Math.floor(p * states.length)));
    setActive((current) => (current === next ? current : next));
  });

  const goTo = (index: number) => {
    const el = list.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const start = top - window.innerHeight * line;
    const target = start + (el.offsetHeight * (index + 0.5)) / states.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
    setActive(index);
  };

  const state = states[active];

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      <div className="sticky top-14 z-10 -mx-5 bg-[#F5F3EF]/95 px-5 pb-3 pt-3 backdrop-blur-sm sm:-mx-8 sm:px-8 lg:top-24 lg:order-2 lg:col-span-7 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0 lg:backdrop-blur-none">
        <ol aria-label="Dates du mois" className="mb-3 flex items-center gap-1 overflow-x-auto sm:mb-4">
          {dates.map((date, i) => (
            <li key={date}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active ? "step" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A2F]",
                  i === active ? "text-[#FAF9F5]" : "text-[#4F5D56] hover:text-[#15241F]"
                )}
              >
                {i === active ? (
                  <m.span
                    layoutId="month-date"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-md bg-[#1E3A2F]"
                  />
                ) : null}
                <span className="relative">{date}</span>
              </button>
            </li>
          ))}
        </ol>
        <div aria-live="polite" className="sr-only">
          {dates[active]} : {state.event}
        </div>
        <LivePanel state={state} compact />
        <div className="relative hidden h-[7.5rem] lg:block">
          <AnimatePresence initial={false} mode="popLayout">
            {state.document ? <DocumentSlip key={`${active}-${state.document.kind}`} doc={state.document} /> : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative mt-4 lg:order-1 lg:col-span-5 lg:mt-0">
        <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-[#D9D5CC]">
          <m.div style={{ scaleY: fill }} className="h-full w-px origin-top bg-[#1E3A2F]" />
        </div>
        <ol ref={list} className="lg:pb-16">
          {steps.map((step, i) => (
            <li key={dates[i]} data-active={i === active} className={cn(styles.step, "py-6 pl-6 sm:py-7 lg:py-9")}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The document the latest payment produced, slipping out from under the panel. */
function DocumentSlip({ doc }: { doc: IssuedDocument }) {
  const quittance = doc.kind === "quittance";
  return (
    <m.div
      initial={{ y: -36, opacity: 0, rotate: -1.5 }}
      animate={{ y: 0, opacity: 1, rotate: quittance ? 1.2 : -0.8 }}
      exit={{ y: -24, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="absolute right-6 top-4 w-[19rem] rounded-sm border border-[#E2DDD2] bg-[#FFFEFB] px-5 py-4 shadow-[0_18px_40px_-24px_rgba(6,24,18,0.45)]"
    >
      <p className="font-[family-name:var(--font-serif)] text-[1.15rem] leading-tight text-[#15241F]">
        {quittance ? "Quittance de loyer" : "Reçu de paiement partiel"}
      </p>
      <p className="mt-1 text-[12px] text-[#5C6560]">
        Octobre 2026 · {doc.tenant} · {doc.home}
      </p>
      <p className="mt-2 flex justify-between border-t border-[#E7E3DA] pt-2 text-[12.5px] tabular-nums">
        <span className="text-[#4F5D56]">{quittance ? "Total acquitté" : "Montant reçu"}</span>
        <span className="font-semibold text-[#15241F]">{quittance ? doc.due : doc.paid}</span>
      </p>
      {quittance ? null : (
        <p className="flex justify-between text-[12.5px] tabular-nums text-[#A63F17]">
          <span>Solde restant dû</span>
          <span className="font-semibold">{doc.outstanding}</span>
        </p>
      )}
    </m.div>
  );
}
