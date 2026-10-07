import React from "react";
import Decimal from "decimal.js";
import {
  PageShell,
  Section,
  Money,
  StatusBadge,
  StatusDot,
  AttentionSurface,
  CalmSurface,
  MonthHeader,
  FinancialSummary,
  RentRow,
  DocumentRegister,
  PropertySituationBar,
} from "@/components/design-system";

export const metadata = {
  title: "B+ V2.1 Production Design System Inventory · RentReady",
  robots: { index: false, follow: false },
};

export default function DesignSystemInventoryPage() {
  return (
    <PageShell maxWidth="default" className="space-y-12 py-10">
      {/* Title & Identity Header */}
      <header className="border-b border-[#151413]/10 pb-6 space-y-2">
        <StatusBadge tone="calm" size="xs">
          Production Design System · Candidate Validé
        </StatusBadge>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#151413] tracking-tight font-normal">
          B+ V2.1 « Editorial Software » — Inventaire & Spécifications
        </h1>
        <p className="text-sm text-[#6B6760] max-w-2xl">
          Catalogue exhaustif des jetons sémantiques, composants primitifs et patterns métier
          migrés en production sur les surfaces Dashboard et Property Home Base.
        </p>
      </header>

      {/* 1. JETONS SÉMANTIQUES & PALETTE MATÉRIAUX */}
      <Section
        eyebrow="Fondations & Matérialité"
        title="Palette Chromatique & Contraste WCAG AA"
        description="Nuances feutrées issues de la papeterie financière. Zéro blanc pur criard."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="border border-[#151413]/10 p-3 bg-[#F8F6F0]">
            <div className="h-10 bg-[#F8F6F0] border border-[#151413]/10 mb-2" />
            <p className="text-xs font-semibold text-[#151413]">Warm Paper</p>
            <p className="text-[10px] font-mono text-[#6B6760]">#F8F6F0</p>
            <p className="text-[10px] text-[#9E9A90] mt-1">Fond principal</p>
          </div>

          <div className="border border-[#151413]/10 p-3 bg-white">
            <div className="h-10 bg-[#151413] mb-2" />
            <p className="text-xs font-semibold text-[#151413]">Deep Ink</p>
            <p className="text-[10px] font-mono text-[#6B6760]">#151413</p>
            <p className="text-[10px] text-[#9E9A90] mt-1">Encre & titrage</p>
          </div>

          <div className="border border-[#151413]/10 p-3 bg-white">
            <div className="h-10 bg-[#166534] mb-2" />
            <p className="text-xs font-semibold text-[#151413]">Calm Emerald</p>
            <p className="text-[10px] font-mono text-[#6B6760]">#166534</p>
            <p className="text-[10px] text-[#9E9A90] mt-1">Sérénité / Réglé</p>
          </div>

          <div className="border border-[#151413]/10 p-3 bg-white">
            <div className="h-10 bg-[#C2410C] mb-2" />
            <p className="text-xs font-semibold text-[#151413]">Attention Orange</p>
            <p className="text-[10px] font-mono text-[#6B6760]">#C2410C</p>
            <p className="text-[10px] text-[#9E9A90] mt-1">Acompte / Action</p>
          </div>

          <div className="border border-[#151413]/10 p-3 bg-white">
            <div className="h-10 bg-[#D97706] mb-2" />
            <p className="text-xs font-semibold text-[#151413]">Delayed Amber</p>
            <p className="text-[10px] font-mono text-[#6B6760]">#D97706</p>
            <p className="text-[10px] text-[#9E9A90] mt-1">Retard / Échéance</p>
          </div>

          <div className="border border-[#151413]/10 p-3 bg-white">
            <div className="h-10 bg-[#E5E0D8] mb-2" />
            <p className="text-xs font-semibold text-[#151413]">Border Ochre</p>
            <p className="text-[10px] font-mono text-[#6B6760]">#E5E0D8</p>
            <p className="text-[10px] text-[#9E9A90] mt-1">Filet de registre</p>
          </div>
        </div>
      </Section>

      {/* 2. TYPOGRAPHIE TRIPARTITE */}
      <Section
        eyebrow="Typographie Tripartite"
        title="Hiérarchie Textuelle & Clarté Cognitive"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#151413]/10 bg-[#FAF8F3] p-5">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B6760] font-semibold">
              1. Serif Noble (Newsreader)
            </span>
            <p className="font-serif text-2xl text-[#151413]">Grand Livre · Mars 2026</p>
            <p className="text-xs text-[#6B6760]">
              Utilisé pour les en-têtes temporels, identités d&apos;immeuble et synthèses.
            </p>
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#151413]/10 pt-3 md:pt-0 md:pl-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B6760] font-semibold">
              2. Sans Moderne (Inter)
            </span>
            <p className="font-sans text-base font-medium text-[#151413]">
              Bail meublé résidence principale
            </p>
            <p className="text-xs text-[#6B6760]">
              Utilisé pour le corps de texte, labels fonctionnels, fil d&apos;Ariane et boutons.
            </p>
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#151413]/10 pt-3 md:pt-0 md:pl-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B6760] font-semibold">
              3. Monospace Rigoureux (JetBrains)
            </span>
            <p className="font-mono text-xl font-bold text-[#151413]">2 450,00 €</p>
            <p className="text-xs text-[#6B6760]">
              Chiffres tabulaires stricts pour toutes les valeurs monétaires et références légales.
            </p>
          </div>
        </div>
      </Section>

      {/* 3. PRIMITIVES : MONEY, STATUS DOT, BADGES */}
      <Section
        eyebrow="Composants Primitifs"
        title="Précision Monétaire & États Sémantiques"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Money sizes & tones */}
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6760]">
              Primitive &lt;Money /&gt; (Prisma Decimal / Zero Float)
            </h4>
            <div className="flex flex-wrap items-baseline gap-4">
              <div>
                <span className="text-[10px] text-[#6B6760] block">size=&quot;xs&quot;</span>
                <Money amount={450} size="xs" />
              </div>
              <div>
                <span className="text-[10px] text-[#6B6760] block">size=&quot;sm&quot;</span>
                <Money amount={850} size="sm" />
              </div>
              <div>
                <span className="text-[10px] text-[#6B6760] block">size=&quot;base&quot;</span>
                <Money amount={1200} size="base" />
              </div>
              <div>
                <span className="text-[10px] text-[#6B6760] block">size=&quot;xl&quot; tone=&quot;calm&quot;</span>
                <Money amount={2450} size="xl" tone="calm" />
              </div>
              <div>
                <span className="text-[10px] text-[#6B6760] block">size=&quot;2xl&quot; tone=&quot;attention&quot;</span>
                <Money amount={400} size="2xl" tone="attention" />
              </div>
            </div>
          </div>

          {/* Status Badges & Dots */}
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6760]">
              Primitives &lt;StatusBadge /&gt; & &lt;StatusDot /&gt;
            </h4>
            <div className="flex flex-wrap gap-2.5 items-center">
              <StatusBadge tone="calm" showDot>
                Payé · Quittance prête
              </StatusBadge>
              <StatusBadge tone="attention" showDot>
                Acompte · Reçu art. 21
              </StatusBadge>
              <StatusBadge tone="delayed" showDot>
                En retard · Relance requise
              </StatusBadge>
              <StatusBadge tone="neutral" showDot>
                Vacant
              </StatusBadge>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. PATTERNS : FINANCIAL SUMMARY & SURFACES */}
      <Section
        eyebrow="Patterns Métier"
        title="Grand Livre & Rétractation Mécanique"
        description="Démonstration des surfaces de calme silencieux vs surfaces d'attention active."
      >
        <FinancialSummary
          expected={new Decimal(2850)}
          received={new Decimal(2450)}
          outstanding={new Decimal(400)}
          collectionPercentage={86}
        />

        {/* Tableau comparatif des lignes : Réglé (rétracté) vs Exception (déployé) */}
        <div className="space-y-3 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6760]">
            Rétractation Mécanique (-54% de hauteur quand réglé)
          </h4>
          <div className="border border-[#151413]/10 divide-y divide-[#151413]/10 bg-[#FAF8F3]">
            {/* Ligne Calme (Compacte) */}
            <RentRow
              propertyId="prop-1"
              propertyName="T2 Voltaire"
              propertyLocation="Paris (75011)"
              tenantName="Lucas Martin"
              leaseDetail="Bail actif"
              totalRent={new Decimal(850)}
              status="PAID"
              paidDate="3 mars"
              quittanceUrl="/billing"
            />

            {/* Ligne Exception (Déployée avec bande d'attention orange et action) */}
            <RentRow
              propertyId="prop-2"
              propertyName="T3 Canclaux"
              propertyLocation="Nantes (44000)"
              tenantName="Antoine Dupuis"
              leaseDetail="Bail actif"
              totalRent={new Decimal(750)}
              status="PARTIAL"
              dueDate="5 mars"
              remainingAmount={new Decimal(300)}
              exceptionNotice="Acompte perçu. Reçu d'acompte émis (art. 21). Le solde de 300,00 € reste à pointer."
              actionSlot={
                <button className="px-2.5 py-1 bg-[#151413] text-[#F8F6F0] text-xs font-medium">
                  Pointer le solde
                </button>
              }
            />

            {/* Ligne Retard */}
            <RentRow
              propertyId="prop-3"
              propertyName="Maison Procé"
              propertyLocation="Nantes (44000)"
              tenantName="Camille Bernard"
              leaseDetail="Bail actif"
              totalRent={new Decimal(1000)}
              status="LATE"
              dueDate="1 mars"
              remainingAmount={new Decimal(1000)}
              exceptionNotice="Échéance passée sans paiement constaté. Une relance peut être envoyée."
              actionSlot={
                <button className="px-2.5 py-1 bg-[#151413] text-[#F8F6F0] text-xs font-medium">
                  Relancer
                </button>
              }
            />
          </div>
        </div>
      </Section>

      {/* 5. REGISTRE DOCUMENTAIRE */}
      <Section
        eyebrow="Registre Documentaire"
        title="Alternative Linéaire Haute Densité à la Card Soup"
        description="Tableau structuré 4 colonnes, éliminant les cartes de 140px pour une densité optimale."
      >
        <DocumentRegister
          documents={[
            {
              id: "doc-1",
              title: "Bail de location actif",
              subtitle: "Signé le 1 janv. 2026",
              period: "Meublé",
              statusLabel: "Actif",
              statusTone: "calm",
              actionType: "view",
              actionHref: "#",
            },
            {
              id: "doc-2",
              title: "Quittance Mars 2026",
              subtitle: "Attestation de loyer acquitté (Art. 21 loi 89)",
              period: "Mars 2026",
              statusLabel: "Délivrée",
              statusTone: "calm",
              actionType: "download",
              actionHref: "#",
            },
            {
              id: "doc-3",
              title: "État des lieux d'entrée",
              subtitle: "Dossier contradictoire d'entrée",
              statusLabel: "Archivé",
              statusTone: "neutral",
              actionType: "view",
              actionHref: "#",
            },
            {
              id: "doc-4",
              title: "Attestation assurance habitation",
              subtitle: "Garantie villégiature & risques locatifs",
              statusLabel: "Vérifié",
              statusTone: "calm",
              actionType: "view",
              actionHref: "#",
            },
          ]}
        />
      </Section>
    </PageShell>
  );
}
