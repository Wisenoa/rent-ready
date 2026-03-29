"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, Clock, Calculator } from "lucide-react";
import { spring, stagger } from "./motion-config";

const painPoints = [
  {
    icon: AlertTriangle,
    title: "La peur des impayés",
    text: "Chaque mois, la même angoisse : le virement est-il arrivé ? Vous ouvrez votre relevé bancaire, vous pointez les lignes une par une, et vous priez pour que rien ne manque. Un retard d'un jour et c'est la boule au ventre. Et quand le loyer n'arrive tout simplement pas, c'est la spirale : relance, mise en demeure, procédure… Le tout sans aucun outil pour anticiper.",
    accent: "from-red-500/8 to-orange-500/5",
    iconColor: "text-red-500 bg-red-50",
  },
  {
    icon: Clock,
    title: "La charge mentale du quotidien",
    text: "Une fuite d'eau signalée par SMS un dimanche soir. Une quittance à rédiger avant la fin du mois. Un indice IRL à retrouver sur le site de l'INSEE. Une facture de plombier à archiver. Gérer un ou deux appartements en direct, c'est accepter d'être disponible 7 jours sur 7 pour des micro-tâches administratives qui, mises bout à bout, dévorent des heures entières chaque mois.",
    accent: "from-amber-500/8 to-yellow-500/5",
    iconColor: "text-amber-600 bg-amber-50",
  },
  {
    icon: Calculator,
    title: "La complexité fiscale et réglementaire",
    text: "Régime micro-foncier ou réel ? LMNP classique ou dispositif Jeanbrun 2026 ? E-reporting obligatoire ou non pour votre SCI ? Factur-X, norme EN 16931, prélèvements sociaux à 18,6 %… La législation française change chaque année, et une erreur de déclaration peut coûter des milliers d'euros en redressement. Aucun propriétaire particulier ne devrait avoir à décrypter seul le Code général des impôts.",
    accent: "from-violet-500/8 to-blue-500/5",
    iconColor: "text-violet-600 bg-violet-50",
  },
];

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={spring.gentle}
        >
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-400">
            Le problème que nous résolvons
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-stone-900">
            Gérer ses biens en direct,
            <br />
            c&apos;est un second emploi non rémunéré.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-500 sm:text-lg sm:leading-relaxed">
            En France, plus de 2,5 millions de particuliers gèrent eux-mêmes
            leurs locations. Sans outil adapté, chaque propriétaire consacre en
            moyenne 6 heures par mois à des tâches répétitives et stressantes.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {painPoints.map((point, i) => (
            <motion.article
              key={point.title}
              className="group relative overflow-hidden rounded-3xl border border-stone-200/40 bg-white/60 p-7 backdrop-blur-sm sm:p-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...spring.gentle, delay: i * stagger.normal }}
              whileHover={{ y: -3 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${point.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="relative">
                <div
                  className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${point.iconColor}`}
                >
                  <point.icon className="size-5" strokeWidth={1.8} />
                </div>
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-stone-900">
                  {point.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-stone-500">
                  {point.text}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Solution bridge */}
        <motion.div
          className="mx-auto mt-16 max-w-2xl text-center sm:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring.gentle, delay: 0.2 }}
        >
          <p className="text-base leading-relaxed text-stone-500 sm:text-lg sm:leading-relaxed">
            <strong className="text-stone-800">
              RentReady supprime cette friction.
            </strong>{" "}
            En connectant votre compte bancaire, en automatisant les documents
            légaux et en centralisant les demandes de vos locataires, le logiciel
            transforme une corvée mensuelle en un processus qui tourne tout seul.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
