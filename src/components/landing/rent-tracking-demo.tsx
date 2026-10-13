"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type DemoStep = {
  label: string;
  title: string;
  description: string;
  screenshot: ReactNode;
};

/** A guided tour of real captures. These controls never mutate product data. */
export function RentTrackingDemo({ steps }: { steps: DemoStep[] }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1
      : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0;
    const next = event.key === "Home" ? 0 : event.key === "End" ? steps.length - 1
      : direction ? (index + direction + steps.length) % steps.length : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="mt-9 grid items-start gap-6 lg:grid-cols-[0.32fr_0.68fr] lg:gap-12">
      <div>
        <div role="tablist" aria-label="Explorer le suivi locatif" className="grid gap-2">
          {steps.map((step, index) => (
            <button
              key={step.label}
              ref={(node) => { buttons.current[index] = node; }}
              type="button"
              role="tab"
              id={`rent-demo-tab-${index}`}
              aria-controls={`rent-demo-panel-${index}`}
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => navigate(event, index)}
              className={`flex min-h-14 items-center gap-4 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2C] ${active === index ? "border-[#0B3B2C] bg-[#0B3B2C] text-white" : "border-[#D8DDD4] bg-transparent text-[#315B48] hover:border-[#7FA68E] hover:bg-white"}`}
            >
              <span className={active === index ? "text-[#CBDACE]" : "text-[#526058]"}>0{index + 1}</span>
              {step.label}
              <span aria-hidden="true" className="ml-auto">↗</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-[#526058]">
          Captures réelles, données fictives. Cette visite n&apos;effectue
          aucune opération.
        </p>
      </div>

      <div>
        {steps.map((step, index) => (
          <div
            key={step.label}
            role="tabpanel"
            id={`rent-demo-panel-${index}`}
            aria-labelledby={`rent-demo-tab-${index}`}
            hidden={active !== index}
            tabIndex={0}
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3B2C]"
          >
            <div className="mx-auto max-w-[390px] overflow-hidden rounded-xl border border-[#D8DDD4] bg-[#FAFAFA] p-3 sm:p-4 lg:max-w-none">
              {step.screenshot}
            </div>
            <h3 className="mt-6 text-lg font-semibold text-[#203D30] sm:text-xl">{step.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#526058] sm:text-base">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
