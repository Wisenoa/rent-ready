"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { GESTION_FAQ_ITEMS } from "./faq-data";

export { GESTION_FAQ_ITEMS };

export function GestionFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 border-b border-[#E5E2DA] bg-[#FAF9F5]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A2F]">
            Questions fréquentes
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#15241F]">
            Tout comprendre avant de vous lancer
          </h2>
          <p className="text-sm sm:text-base text-[#5A6660]">
            Des réponses claires et précises aux interrogations des propriétaires bailleurs.
          </p>
        </div>

        <div className="space-y-3">
          {GESTION_FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className="rounded-2xl border border-[#E5E2DA] bg-white transition-all duration-200 overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-[#FAF8F5]/60 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-[#15241F] pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`size-4.5 text-[#5A6660] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#1E3A2F]" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5A6660] leading-relaxed border-t border-[#F5F3EF]">
                    <div className="whitespace-pre-line">{item.answer}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
