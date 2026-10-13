import React from "react";
import { Check, X, Minus } from "lucide-react";

export function GestionComparison() {
  const ROWS = [
    {
      label: "Calcul des loyers & acomptes",
      excel: "Manuel, risques d'erreurs de formule",
      agence: "Géré par l'agence avec décalage de trésorerie",
      lokna: "Automatique au centime près en temps réel",
      loknaHighlight: true,
    },
    {
      label: "Quittances de loyer conformes",
      excel: "Modèles Word recopiés à la main",
      agence: "Incluses mais transmises avec délai",
      lokna: "Conformes loi 1989 prêtes en 1 clic",
      loknaHighlight: true,
    },
    {
      label: "Révision annuelle IRL (INSEE)",
      excel: "Recherche manuelle de l'indice et calcul",
      agence: "Parfois oubliée ou facturée en option",
      lokna: "Rappel automatique avec formule officielle",
      loknaHighlight: true,
    },
    {
      label: "Dépôt de garantie & plafonds",
      excel: "Aucun garde-fou juridique",
      agence: "Inclus",
      lokna: "Plafonnement automatique selon le type de bail",
      loknaHighlight: true,
    },
    {
      label: "Coût financier mensuel",
      excel: "Gratuit en apparence (coût en temps)",
      agence: "7 % à 10 % des loyers (70 à 150 € / mois)",
      lokna: "Dès 9 € / mois sans engagement",
      loknaHighlight: true,
    },
    {
      label: "Contrôle & autonomie",
      excel: "Total mais chronophage et anxiogène",
      agence: "Intermédiaire obligatoire, manque de visibilité",
      lokna: "Contrôle direct, clair et sans friction",
      loknaHighlight: true,
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-[#E5E2DA] bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A2F]">
            Comparatif clair
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#15241F]">
            Pourquoi remplacer votre tableur par Lokna ?
          </h2>
          <p className="text-sm sm:text-base text-[#5A6660] leading-relaxed">
            Un tableur enregistre ce que vous tapez mais ne prévient pas vos oublis. Une agence coûte plusieurs centaines d&apos;euros par an. Lokna vous offre la rigueur professionnelle à prix juste.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#E5E2DA] bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E5E2DA] bg-[#FAF8F5]">
                <th className="py-4 px-4 sm:px-6 font-semibold text-[#15241F] w-1/3">
                  Critères
                </th>
                <th className="py-4 px-3 sm:px-4 font-medium text-[#7C8782] w-1/5">
                  Tableur Excel / Sheets
                </th>
                <th className="py-4 px-3 sm:px-4 font-medium text-[#7C8782] w-1/4">
                  Agence immobilière
                </th>
                <th className="py-4 px-4 sm:px-6 font-semibold text-[#1E3A2F] bg-[#1E3A2F]/5 w-1/4">
                  Lokna
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DA]">
              {ROWS.map((row) => (
                <tr key={row.label} className="hover:bg-[#FAF8F5]/50 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-medium text-[#15241F]">
                    {row.label}
                  </td>
                  <td className="py-4 px-3 sm:px-4 text-[#5A6660]">
                    {row.excel}
                  </td>
                  <td className="py-4 px-3 sm:px-4 text-[#5A6660]">
                    {row.agence}
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-medium text-[#1E3A2F] bg-[#1E3A2F]/5">
                    <span className="flex items-center gap-1.5">
                      <Check className="size-4 shrink-0 text-[#1E3A2F]" aria-hidden="true" />
                      <span>{row.lokna}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
