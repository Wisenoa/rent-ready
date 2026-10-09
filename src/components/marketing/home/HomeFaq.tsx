"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HOME_FAQ_ITEMS } from "./faq-data";

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 sm:py-14 max-w-3xl mx-auto px-4 sm:px-6 space-y-5 border-t border-[#E5E2DA]">
      <div className="text-center space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold text-[#15241F] tracking-tight">
          Questions fréquentes
        </h2>
        <p className="text-xs text-[#5A6660]">
          L'essentiel pour démarrer sereinement.
        </p>
      </div>

      <div className="divide-y divide-[#E5E2DA] border-y border-[#E5E2DA]">
        {HOME_FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="py-3">
              <button
                type="button"
                id={`faq-trigger-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                onClick={() => toggleIndex(i)}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-medium text-[#15241F] gap-4 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1E3A2F] rounded-sm py-1"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#5A6660] shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="mt-1.5 text-xs text-[#5A6660] leading-relaxed pr-6"
                >
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
