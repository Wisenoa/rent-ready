"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BellRing,
  FileCheck,
  TrendingUp,
  Wrench,
  Shield,
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
    title: "Encaissement automatique via Open Banking",
    description:
      "Fini le pointage manuel de vos relevés. RentReady se connecte à votre banque en lecture seule via une API conforme à la directive européenne DSP2 (Bridge API / Powens). Chaque virement entrant est comparé automatiquement aux loyers attendus. Si le montant, la référence et l'émetteur correspondent, la transaction est marquée comme payée et la quittance part automatiquement.",
    accent: "from-blue-500/10 to-blue-600/5",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileCheck,
    title: "Quittancement légal conforme à la loi du 6 juillet 1989",
    description:
      "L'article 21 de la loi n° 89-462 du 6 juillet 1989 impose au bailleur de transmettre gratuitement une quittance pour tout loyer intégralement réglé. RentReady distingue automatiquement le loyer de base des provisions pour charges sur deux lignes séparées. Si le paiement est partiel, un reçu est émis à la place, mentionnant le solde restant dû — jamais une quittance.",
    accent: "from-emerald-500/10 to-emerald-600/5",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Révision IRL automatique connectée à l'INSEE",
    description:
      "L'Indice de Référence des Loyers (IRL) est publié chaque trimestre par l'INSEE. RentReady applique la formule légale — Nouveau loyer = Loyer actuel × (Nouvel IRL ÷ IRL de référence à la signature) — de façon entièrement automatique. Le dernier indice officiel (145,78 au 4ᵉ trimestre 2025) est intégré, et le locataire est notifié de la révision sans intervention de votre part.",
    accent: "from-amber-500/10 to-amber-600/5",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    icon: Wrench,
    title: "Portail locataire et gestion de la maintenance",
    description:
      "Vos locataires disposent d'un espace dédié pour télécharger leurs quittances et signaler un incident technique (fuite, panne de chaudière) avec photo ou vidéo à l'appui. Chaque demande est horodatée et centralisée. Vous validez l'intervention d'un artisan en un clic, sans appel nocturne ni échange de SMS interminables.",
    accent: "from-violet-500/10 to-violet-600/5",
    iconBg: "bg-violet-50 text-violet-600",
  },
  {
    icon: Shield,
    title: "Conforme Factur-X et e-reporting 2027",
    description:
      "La réforme française de facturation électronique impose le format Factur-X (PDF/A-3 avec XML embarqué, norme EN 16931) pour toutes les transactions. Pour les micro-entrepreneurs et SCI, le e-reporting B2C sera obligatoire dès le 1ᵉʳ septembre 2027. RentReady génère déjà ses documents dans un format compatible et agrège vos encaissements mensuels pour la transmission à la plateforme publique de facturation.",
    accent: "from-teal-500/10 to-cyan-600/5",
    iconBg: "bg-teal-50 text-teal-600",
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
          {/* Row 1: large (2-col) + normal */}
          <div className="sm:col-span-2">
            <BentoCard item={items[0]} index={0} large />
          </div>
          <BentoCard item={items[1]} index={1} />

          {/* Row 2: normal + large (2-col) */}
          <BentoCard item={items[2]} index={2} />
          <div className="sm:col-span-2">
            <BentoCard item={items[3]} index={3} large />
          </div>

          {/* Row 3: full-width compliance card */}
          <div className="sm:col-span-2 lg:col-span-3">
            <BentoCard item={items[4]} index={4} large />
          </div>
        </div>
      </div>
    </section>
  );
}
