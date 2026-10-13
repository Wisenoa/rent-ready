"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MonthPanel } from "./MonthPanel";
import type { MonthState, MonthStep } from "./month-types";
import styles from "./home.module.css";

/**
 * The month moving forward as the visitor scrolls. Native scrolling only: the
 * steps are ordinary blocks, and whichever one crosses the reading line becomes
 * the panel's state. Dates are buttons too, so the story works from the
 * keyboard. Without JavaScript the steps read top to bottom beside the first
 * state of the month.
 */
export function MonthStory({ steps, states }: { steps: MonthStep[]; states: MonthState[] }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(index)) setActive(index);
          }
        }
      },
      // A thin reading line: mid-screen on desktop, and on small screens just
      // under the sticky panel so the step being read is never hidden by it.
      {
        rootMargin: window.matchMedia("(min-width: 1024px)").matches
          ? "-50% 0px -48% 0px"
          : "-76% 0px -22% 0px",
      }
    );
    for (const el of stepRefs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const el = stepRefs.current[index];
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    setActive(index);
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
      {/* The panel: sticky on top of the steps on phones, beside them on desktop. */}
      <div className="sticky top-14 z-10 -mx-5 bg-[#F5F3EF]/95 px-5 pb-4 pt-3 backdrop-blur-sm sm:-mx-8 sm:px-8 lg:order-2 lg:col-span-7 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0 lg:backdrop-blur-none lg:top-24">
        <ol aria-label="Dates du mois" className="mb-3 flex items-center gap-1.5 overflow-x-auto sm:mb-4">
          {steps.map((step, i) => (
            <li key={step.date}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active ? "step" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-md border px-2.5 py-1.5 text-[13px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A2F]",
                  i === active
                    ? "border-[#1E3A2F] bg-[#1E3A2F] text-[#FAF9F5]"
                    : "border-[#D9D5CC] bg-[#FDFCF9] text-[#4F5D56] hover:border-[#1E3A2F]"
                )}
              >
                {step.date}
              </button>
            </li>
          ))}
        </ol>
        <div aria-live="polite" className="sr-only">
          {steps[active].date} : {states[active].event}
        </div>
        <MonthPanel state={states[active]} compact />
      </div>

      <ol className="relative mt-6 lg:order-1 lg:col-span-5 lg:mt-0">
        {steps.map((step, i) => (
          <li
            key={step.date}
            data-index={i}
            data-active={i === active}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className={cn(
              styles.step,
              "flex min-h-[44vh] flex-col justify-center border-t border-[#D9D5CC] py-8 pl-5 first:border-t-0 lg:min-h-[60vh] lg:py-12"
            )}
          >
            <p className="font-[family-name:var(--font-serif)] text-[2.4rem] leading-none tracking-[-0.02em] sm:text-[3rem]">
              {step.date}
            </p>
            <h3 className="mt-4 text-[1.4rem] font-semibold tracking-[-0.02em] sm:text-[1.6rem]">
              {step.title}
            </h3>
            <p className="mt-3 max-w-[30rem] text-[16px] leading-7">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
