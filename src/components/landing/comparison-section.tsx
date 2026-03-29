"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";
import { spring, stagger } from "./motion-config";

interface ComparisonRow {
  label: string;
  agency: string | boolean;
  excel: string | boolean;
  rentready: string | boolean;
}

const rows: ComparisonRow[] = [
  {
    label: "Coût annuel (1 bien à 1 000 €/mois)",
    agency: "~840 €",
    excel: "0 €",
    rentready: "180 €",
  },
  {
    label: "Quittances légales automatiques",
    agency: true,
    excel: false,
    rentready: true,
  },
  {
    label: "Détection automatique des virements",
    agency: true,
    excel: false,
    rentready: true,
  },
  {
    label: "Révision IRL calculée",
    agency: true,
    excel: false,
    rentready: true,
  },
  {
    label: "Portail locataire & maintenance",
    agency: false,
    excel: false,
    rentready: true,
  },
  {
    label: "Conformité Factur-X & e-reporting",
    agency: false,
    excel: false,
    rentready: true,
  },
  {
    label: "Contrôle total de vos données",
    agency: false,
    excel: false,
    rentready: true,
  },
  {
    label: "Temps mensuel estimé",
    agency: "~2 h",
    excel: "~6 h",
    rentready: "~15 min",
  },
];

function CellValue({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check
        className={`mx-auto size-[18px] ${
          highlight ? "text-blue-600" : "text-stone-300"
        }`}
        strokeWidth={2.5}
      />
    ) : (
      <X className="mx-auto size-[18px] text-stone-200" strokeWidth={2} />
    );
  }
  return (
    <span
      className={`text-[13px] ${
        highlight ? "font-semibold text-blue-700" : "text-stone-500"
      }`}
    >
      {value}
    </span>
  );
}

export function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          className="mx-auto mb-16 max-w-xl text-center sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={spring.gentle}
        >
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-stone-900">
            Pourquoi se contenter d&apos;Excel
            <br />
            ou payer une agence{" "}
            <span className="text-blue-600">7&nbsp;%</span> ?
          </h2>
        </motion.div>

        {/* Glass table */}
        <motion.div
          className="overflow-hidden rounded-3xl border border-stone-200/30 bg-white/50 shadow-xl shadow-stone-900/[0.03] backdrop-blur-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring.gentle, delay: 0.1 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[560px]">
              <thead>
                <tr>
                  <th className="py-5 pl-6 pr-4 text-[12px] font-medium uppercase tracking-wider text-stone-400 w-[40%]" />
                  <th className="py-5 px-4 text-center">
                    <span className="block text-[13px] font-semibold text-stone-600">
                      Agence
                    </span>
                    <span className="block text-[11px] text-stone-400 mt-0.5">
                      ~7 % du loyer
                    </span>
                  </th>
                  <th className="py-5 px-4 text-center">
                    <span className="block text-[13px] font-semibold text-stone-600">
                      Excel
                    </span>
                    <span className="block text-[11px] text-stone-400 mt-0.5">
                      Gratuit
                    </span>
                  </th>
                  <th className="py-5 px-4 text-center bg-blue-50/50 rounded-t-2xl">
                    <span className="block text-[13px] font-bold text-blue-700">
                      RentReady
                    </span>
                    <span className="block text-[11px] text-blue-500 mt-0.5">
                      15 €/mois
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr
                    key={row.label}
                    className="border-t border-stone-100/60"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * stagger.fast + 0.2 }}
                  >
                    <td className="py-3.5 pl-6 pr-4 text-[13px] text-stone-600">
                      {row.label}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <CellValue value={row.agency} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <CellValue value={row.excel} />
                    </td>
                    <td className="py-3.5 px-4 text-center bg-blue-50/30">
                      <CellValue value={row.rentready} highlight />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
