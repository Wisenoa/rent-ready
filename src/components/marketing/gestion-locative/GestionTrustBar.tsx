import React from "react";
import { ShieldCheck, Scale, FileCheck, Lock } from "lucide-react";

export function GestionTrustBar() {
  const TRUST_ITEMS = [
    {
      icon: Scale,
      title: "Loi du 6 juillet 1989",
      desc: "Quittances et reçus strictement conformes à l'article 21 avec ventilation loyer et charges.",
    },
    {
      icon: FileCheck,
      title: "Indice INSEE IRL 2026",
      desc: "Calcul automatique de la révision légale du loyer à chaque date anniversaire.",
    },
    {
      icon: ShieldCheck,
      title: "Garde-fous juridiques",
      desc: "Dépôts de garantie plafonnés (1 mois nu, 2 mois meublé) et mentions obligatoires.",
    },
    {
      icon: Lock,
      title: "Hébergement en France",
      desc: "Données bancaires et baux chiffrés en transit et au repos. Aucune revente de données.",
    },
  ];

  return (
    <section className="border-y border-[#E5E2DA] bg-[#FAF8F5]/60 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-[#E5E2DA] text-[#1E3A2F] shadow-2xs">
                  <Icon className="size-4.5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#15241F] tracking-tight">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-xs text-[#5A6660] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
