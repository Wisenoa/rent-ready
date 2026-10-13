import React from "react";
import Link from "next/link";
import {
  FileText,
  TrendingUp,
  Receipt,
  Scale,
  Calendar,
  ShieldCheck,
  Calculator,
  ArrowRight,
  FolderLock
} from "lucide-react";

export function GestionFeaturesGrid() {
  const FEATURES = [
    {
      icon: Receipt,
      title: "Quittances de loyer conformes",
      desc: "Générées automatiquement dès règlement complet. Conformes à l'article 21 de la loi du 6 juillet 1989.",
      badge: "Loi 1989",
    },
    {
      icon: TrendingUp,
      title: "Suivi des encaissements & acomptes",
      desc: "Détection immédiate des retards. Les règlements partiels génèrent un reçu d'acompte avec solde restant dû.",
      badge: "Temps réel",
    },
    {
      icon: Calendar,
      title: "Révision de loyer indexée (IRL)",
      desc: "Calcul automatique basé sur le dernier Indice de Référence des Loyers publié par l'INSEE à date anniversaire.",
      badge: "INSEE",
    },
    {
      icon: FileText,
      title: "Contrats de bail & annexes",
      desc: "Modèles conformes pour location nue, meublée et colocation. Génération des états des lieux et inventaires.",
      badge: "Juridique",
    },
    {
      icon: Scale,
      title: "Plafonnement du dépôt de garantie",
      desc: "Garde-fou automatique : 1 mois de loyer hors charges en location nue, 2 mois en location meublée.",
      badge: "Conformité",
    },
    {
      icon: Calculator,
      title: "Régularisation des charges",
      desc: "Comparaison annuelle entre les provisions perçues et les dépenses réelles, avec décompte pour le locataire.",
      badge: "Comptabilité",
    },
    {
      icon: FolderLock,
      title: "Coffre-fort & baux archivés",
      desc: "Centralisation sécurisée de tous les documents contractuels, états des lieux et diagnostics techniques.",
      badge: "Hébergé en France",
    },
    {
      icon: ShieldCheck,
      title: "Export comptable & fiscal",
      desc: "Synthèse annuelle pour votre déclaration de revenus fonciers (formulaire 2044) ou régime réel LMNP.",
      badge: "Fiscalité",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-[#E5E2DA] bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A2F]">
            Fonctionnalités essentielles
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#15241F]">
            Tout ce qu&apos;un bailleur indépendant doit maîtriser
          </h2>
          <p className="text-sm sm:text-base text-[#5A6660] leading-relaxed">
            Sans fioritures ni usine à gaz. Chaque outil répond à une obligation légale ou à un besoin opérationnel récurrent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative flex flex-col justify-between rounded-xl border border-[#E5E2DA] bg-[#FAF8F5]/40 p-5 transition-all duration-200 hover:bg-white hover:border-[#1E3A2F]/30 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#E5E2DA] text-[#1E3A2F] shadow-2xs group-hover:bg-[#1E3A2F] group-hover:text-white transition-colors">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] font-medium text-[#1E3A2F] bg-[#1E3A2F]/10 px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#15241F] tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#5A6660] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/features"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1E3A2F] hover:text-[#15241F] underline underline-offset-4 transition-colors"
          >
            <span>Consulter l&apos;ensemble des fonctionnalités détaillées</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
