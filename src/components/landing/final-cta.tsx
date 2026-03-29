"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { spring } from "./motion-config";
import { ScrollReveal } from "./scroll-reveal";

export function FinalCta() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-stone-900 px-8 py-20 text-center sm:px-16 sm:py-28">
            {/* Ambient glows */}
            <div
              aria-hidden
              className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-teal-500/8 blur-3xl"
            />

            <div className="relative">
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
                Vos locataires ne devraient pas
                <br className="hidden sm:block" />
                être une source de stress.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-stone-400 sm:text-lg">
                Rejoignez les propriétaires qui ont mis leur gestion locative en
                pilote automatique.
              </p>
              <div className="mt-10">
                <Link href="/register">
                  <motion.span
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-[15px] font-semibold text-stone-900 shadow-xl shadow-black/10"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={spring.bouncy}
                  >
                    Commencer gratuitement
                    <ArrowRight className="size-4" />
                  </motion.span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
