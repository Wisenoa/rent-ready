"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BellRing,
  FileCheck,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { spring, stagger } from "./motion-config";

/* ─── Data ─── */
interface BentoItem {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  iconBg: string;
}

const items: BentoItem[] = [
  {
    icon: BellRing,
    title: "Encaissement automatique",
    description:
      "RentReady se connecte à votre banque et détecte vos loyers automatiquement. Vous êtes notifié dès que l'argent arrive.",
    accent: "from-blue-500/10 to-blue-600/5",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileCheck,
    title: "Quittances légales Loi 1989",
    description:
      "Quittance ou reçu partiel. Le système sépare loyer et charges, et n'émet le document que si le solde est réglé.",
    accent: "from-emerald-500/10 to-emerald-600/5",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Révision IRL automatique",
    description:
      "Connecté à l'API de l'INSEE. Calcul automatique de l'indice de référence et notification au locataire.",
    accent: "from-amber-500/10 to-amber-600/5",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    icon: Wrench,
    title: "Portail locataire & maintenance",
    description:
      "Signalement de problèmes avec photo ou vidéo. Vous validez l'intervention en un clic, sans appel nocturne.",
    accent: "from-violet-500/10 to-violet-600/5",
    iconBg: "bg-violet-50 text-violet-600",
  },
];

/* ─── Bento Card ─── */
function BentoCard({
  item,
  index,
  large,
}: {
  item: BentoItem;
  index: number;
  large?: boolean;
}) {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-3xl border border-stone-200/40 bg-white/60 backdrop-blur-sm ${
        large ? "p-8 sm:p-10" : "p-7 sm:p-8"
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...spring.gentle, delay: index * stagger.normal }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="relative">
        <div
          className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconBg}`}
        >
          <item.icon className="size-5" strokeWidth={1.8} />
        </div>
        <h3
          className={`font-semibold tracking-tight text-stone-900 ${
            large ? "text-xl sm:text-2xl" : "text-lg"
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`mt-2 leading-relaxed text-stone-500 ${
            large ? "text-[15px] sm:text-base" : "text-[14px]"
          }`}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Grid ─── */
export function BentoBenefits() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Section heading */}
        <motion.div
          className="mx-auto mb-16 max-w-xl text-center sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={spring.gentle}
        >
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Ce que RentReady fait pour vous
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-stone-900">
            Des résultats concrets.
            <br />
            Pas des fonctionnalités.
          </h2>
        </motion.div>

        {/* Bento Grid: 3-col, asymmetric */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Row 1: large (2-col) + normal (1-col) */}
          <div className="sm:col-span-2">
            <BentoCard item={items[0]} index={0} large />
          </div>
          <BentoCard item={items[1]} index={1} />

          {/* Row 2: normal (1-col) + large (2-col) */}
          <BentoCard item={items[2]} index={2} />
          <div className="sm:col-span-2">
            <BentoCard item={items[3]} index={3} large />
          </div>
        </div>
      </div>
    </section>
  );
}
