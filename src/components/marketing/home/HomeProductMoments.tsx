import React from "react";
import { Check, Clock, FileText, TrendingUp } from "lucide-react";

export function HomeProductMoments() {
  return (
    <div id="moments" className="border-t border-[#E5E2DA]">
      {/* ── BRAND REVELATION & THE MONTHLY LOOP (AHA MOMENT) ── */}
      <section className="py-10 sm:py-14 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <blockquote className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1E3A2F]">
          « Tout ce qui va bien devient silencieux. »
        </blockquote>
        <p className="mt-2 text-xs sm:text-sm text-[#5A6660] max-w-md mx-auto leading-relaxed">
          Ce qui est réglé s'efface de l'écran. Seuls les retards et les versements incomplets restent visibles, avec l'action exacte pour les résoudre.
        </p>
      </section>

      {/* ── MOMENT 1 : LOYER — « MON LOCATAIRE A-T-IL PAYÉ ? » ── */}
      <section className="py-10 sm:py-12 border-t border-[#E5E2DA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center">
          {/* Text Column */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1E3A2F]">
              01 · Encaissement
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#15241F] tracking-tight">
              « Mon locataire a-t-il payé ? »
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6660] leading-relaxed">
              RentReady rapproche chaque virement du loyer prévu au bail. Dès que la somme arrive, la ligne est validée. En cas de retard ou de versement partiel, l'écart apparaît immédiatement au centime près.
            </p>
            <div className="pt-0.5 text-xs text-[#1E3A2F] font-medium flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Détection immédiate des écarts et des retards</span>
            </div>
          </div>

          {/* Product Proof Column */}
          <div className="bg-white rounded-lg border border-[#E5E2DA] p-4 text-xs space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E2DA] text-[11px] text-[#5A6660]">
              <span className="font-medium text-[#15241F]">Contrôle d'échéance · Octobre 2026</span>
              <span>Lyon 3e · Sarah Merand</span>
            </div>

            <div className="space-y-1.5 pt-0.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#5A6660]">Loyer au bail :</span>
                <span className="tabular-nums font-semibold text-[#15241F]">1 600,00 €</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#5A6660]">Virement reçu (05/10) :</span>
                <span className="tabular-nums font-semibold text-[#15241F]">1 200,00 €</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-[#E5E2DA] text-xs">
                <span className="font-medium text-[#D97706] flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" aria-hidden="true" /> Solde restant dû :
                </span>
                <span className="tabular-nums font-bold text-[#D97706]">400,00 €</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOMENT 2 : QUITTANCE — « QUEL DOCUMENT DOIS-JE REMETTRE ? » ── */}
      <section className="py-10 sm:py-12 border-t border-[#E5E2DA] bg-[#FAF8F5]/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center">
          {/* Product Proof Column (Left on Desktop) */}
          <div className="order-2 md:order-1 space-y-2.5">
            <div className="bg-white rounded-lg border border-[#E5E2DA] p-3 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#15241F] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" /> Quittance de loyer
                </span>
                <span className="text-[10px] font-medium text-[#1E3A2F] bg-[#1E3A2F]/10 px-2 py-0.5 rounded">
                  Paiement 100%
                </span>
              </div>
              <p className="text-[11px] text-[#5A6660]">
                Thomas Delmas · Paris 11e · 1 100,00 € réglé · PDF conforme prêt
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#F59E0B]/40 bg-[#FEF3C7]/20 p-3 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#92400E] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#D97706] shrink-0" aria-hidden="true" /> Reçu de paiement partiel
                </span>
                <span className="text-[10px] font-medium text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded">
                  Paiement partiel
                </span>
              </div>
              <p className="text-[11px] text-[#7C8782]">
                Sarah Merand · Lyon 3e · 1 200,00 € versé · Mention du solde dû (400,00 €)
              </p>
            </div>
          </div>

          {/* Text Column (Right on Desktop) */}
          <div className="order-1 md:order-2 space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1E3A2F]">
              02 · Conformité
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#15241F] tracking-tight">
              « Quel document dois-je remettre ? »
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6660] leading-relaxed">
              En cas de versement incomplet, la loi interdit d'émettre une quittance intégrale (art. 21). RentReady produit un reçu d'acompte avec le solde restant. La quittance officielle se débloque dès le règlement complet.
            </p>
            <div className="pt-0.5 text-xs text-[#1E3A2F] font-medium flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Ventilation stricte loyer nu / charges (loi de 1989)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOMENT 3 : RÉVISION — « QUAND DOIS-JE REVOIR LE LOYER ? » ── */}
      <section className="py-10 sm:py-12 border-t border-[#E5E2DA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center">
          {/* Text Column */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1E3A2F]">
              03 · Révision IRL
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#15241F] tracking-tight">
              « Quand dois-je réévaluer le loyer ? »
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6660] leading-relaxed">
              Une révision oubliée dans l'année est définitivement perdue (art. 17-1). RentReady vous prévient 30 jours avant l'échéance et applique la formule légale selon le dernier indice officiel publié par l'INSEE.
            </p>
            <div className="pt-0.5 text-xs text-[#1E3A2F] font-medium flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Série officielle INSEE n° 001515333 intégrée</span>
            </div>
          </div>

          {/* Product Proof Column */}
          <div className="bg-white rounded-lg border border-[#E5E2DA] p-4 text-xs space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E2DA] text-[11px]">
              <span className="font-semibold text-[#15241F] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" aria-hidden="true" /> Échéance de révision IRL
              </span>
              <span className="text-[#1E3A2F] font-medium bg-[#1E3A2F]/10 px-2 py-0.5 rounded">
                Dans 28 jours
              </span>
            </div>

            <div className="space-y-1.5 pt-0.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#5A6660]">Loyer actuel hors charges :</span>
                <span className="tabular-nums font-semibold text-[#15241F]">1 420,00 €</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#5A6660]">IRL T2-2025 → T2-2026 :</span>
                <span className="tabular-nums font-medium text-[#15241F]">146,68 → 148,37</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-[#E5E2DA] text-xs">
                <span className="font-semibold text-[#15241F]">Nouveau loyer calculé :</span>
                <span className="tabular-nums font-bold text-[#1E3A2F]">
                  1 436,36 € <span className="text-[11px] font-normal text-[#5A6660]">(+16,36 €/mois)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
