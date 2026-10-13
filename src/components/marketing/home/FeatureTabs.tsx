"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "./home.module.css";

export type FeatureTab = { id: string; label: string; summary: string };

/**
 * WAI-ARIA tabs: arrow keys move between tabs, Home/End jump to the ends.
 * Panels are rendered on the server and only shown or hidden here.
 */
export function FeatureTabs({ tabs, panels }: { tabs: FeatureTab[]; panels: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      focusTab(keys[event.key]);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div role="tablist" aria-label="Fonctionnalités" aria-orientation="vertical" className="flex flex-col lg:col-span-5">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${tab.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "group border-t border-[#FAF9F5]/15 py-5 text-left transition-colors last:border-b focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FAF9F5]",
              i === active ? "text-[#FAF9F5]" : "text-[#FAF9F5]/60 hover:text-[#FAF9F5]/85"
            )}
          >
            <span className="flex items-center text-[1.5rem] font-semibold tracking-[-0.02em] sm:text-[1.75rem]">
              <span aria-hidden="true" className={cn("relative h-[2px] transition-[width,margin] duration-300 motion-reduce:transition-none", i === active ? "mr-3 w-6" : "mr-0 w-0")}>
                {i === active ? (
                  <m.span
                    layoutId="feature-tab"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 bg-[#A8C4B1]"
                  />
                ) : null}
              </span>
              {tab.label}
            </span>
            <span className={cn("mt-1.5 block text-[15px] leading-6", i === active ? "text-[#FAF9F5]/85" : "text-[#FAF9F5]/70")}>
              {tab.summary}
            </span>
          </button>
        ))}
      </div>

      <div className="lg:col-span-7">
        {tabs.map((tab, i) => (
          <m.div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={i !== active}
            tabIndex={0}
            // Every panel stays in the HTML; the one shown rises into place.
            initial={false}
            animate={i === active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            className={cn(i === active && styles.stagger, "origin-top focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FAF9F5]")}
          >
            {panels[i]}
          </m.div>
        ))}
      </div>
    </div>
  );
}
