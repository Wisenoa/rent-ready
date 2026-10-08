"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  HeroCategoryFirst,
  HeroOutcomeFirst,
  HeroExceptionFirst,
  HeroProductFirst,
  HeroHybrid,
} from "./Heroes";
import { InteractiveDemo } from "./InteractiveDemo";

interface PageProps {
  isMobile?: boolean;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 0. COMMON SUB-SECTIONS                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

export function B2Navbar() {
  return (
    <header className="border-b border-[#E5E2DA] bg-[#F5F3EF]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/design-preview/b2" className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A2F]" />
            <span className="font-bold text-base sm:text-lg tracking-tight text-[#15241F]">
              RentReady
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[#5A6660]">
            <a href="#demo" className="hover:text-[#15241F] transition-colors">
              Fonctionnement
            </a>
            <a href="#features" className="hover:text-[#15241F] transition-colors">
              Fonctionnalités
            </a>
            <a href="#outils" className="hover:text-[#15241F] transition-colors">
              Outils gratuits
            </a>
            <a href="#pricing" className="hover:text-[#15241F] transition-colors">
              Tarifs
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-[#5A6660] hover:text-[#15241F] transition-colors hidden sm:inline"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] text-xs font-medium transition-colors shadow-2xs"
          >
            Essai gratuit 14 jours
          </Link>
        </div>
      </div>
    </header>
  );
}

export function B2FourPillarsSection() {
  return (
    <section id="features" className="py-12 sm:py-20 border-t border-[#E5E2DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-[#15241F]">
            Les 4 piliers de votre routine mensuelle
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6660]">
            Tout ce dont un propriétaire a besoin chaque mois, sans dispersion ni jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pilier 1 */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 sm:p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-semibold text-[#15241F]">
              Suivi précis des encaissements
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6660] leading-relaxed">
              Chaque somme reçue est comparée au montant du bail. Les règlements intégraux passent au vert et s'effacent. Les montants partiels ou les retards restent visibles avec l'écart exact à régulariser.
            </p>
            <div className="pt-2 text-xs font-medium text-[#1E3A2F] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Fini le pointage manuel sur relevé bancaire
            </div>
          </div>

          {/* Pilier 2 */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 sm:p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-semibold text-[#15241F]">
              Quittances et reçus conformes (Loi 1989)
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6660] leading-relaxed">
              Conformément à l'article 21 de la loi du 6 juillet 1989, chaque quittance sépare loyer nu et charges. En cas de paiement partiel, RentReady édite un reçu d'acompte avec le solde restant dû.
            </p>
            <div className="pt-2 text-xs font-medium text-[#1E3A2F] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Quittance complète ou reçu d'acompte en un clic
            </div>
          </div>

          {/* Pilier 3 */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 sm:p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-semibold text-[#15241F]">
              Révision de loyer IRL à date anniversaire
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6660] leading-relaxed">
              Une révision non réclamée dans l'année est définitivement perdue (art. 17-1). RentReady vous prévient 30 jours avant et applique la formule officielle INSEE avec le bon trimestre.
            </p>
            <div className="pt-2 text-xs font-medium text-[#1E3A2F] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Alerte d'échéance et calcul automatique INSEE
            </div>
          </div>

          {/* Pilier 4 */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 sm:p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="text-base font-semibold text-[#15241F]">
              Historique classé et export comptable CSV
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6660] leading-relaxed">
              Chaque logement conserve ses baux, ses versements et ses quittances émises. En fin d'année, téléchargez un fichier CSV propre pour votre déclaration de revenus fonciers ou votre comptable.
            </p>
            <div className="pt-2 text-xs font-medium text-[#1E3A2F] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Données exportables en un clic pour vos impôts
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function B2LegalTrustSection() {
  return (
    <section className="py-12 sm:py-16 bg-white border-y border-[#E5E2DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <h2 className="text-lg sm:text-2xl font-semibold text-[#15241F]">
            Un cadre légal rigoureux pour vos locations
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6660]">
            Aucune approximation. Tous nos modèles respectent les textes en vigueur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="p-4 rounded-lg bg-[#F5F3EF] border border-[#E5E2DA] space-y-2">
            <span className="font-semibold text-[#15241F] block">
              Loi du 6 juillet 1989 · Art. 21
            </span>
            <p className="text-[#5A6660] text-xs leading-relaxed">
              Distinction obligatoire entre quittance (paiement intégral) et reçu d'acompte (versement partiel). Ventilation stricte loyer nu / charges.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#F5F3EF] border border-[#E5E2DA] space-y-2">
            <span className="font-semibold text-[#15241F] block">
              Indices officiels INSEE · Art. 17-1
            </span>
            <p className="text-[#5A6660] text-xs leading-relaxed">
              Calcul IRL basé sur la série officielle INSEE (série n° 001515333). Date de publication au Journal officiel vérifiable.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#F5F3EF] border border-[#E5E2DA] space-y-2">
            <span className="font-semibold text-[#15241F] block">
              Confidentialité & RGPD
            </span>
            <p className="text-[#5A6660] text-xs leading-relaxed">
              Vos données restent strictly privées. Chiffrement TLS 1.3 en transit, sauvegardes sécurisées et aucune revente de coordonnées.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function B2FreeToolsSection() {
  return (
    <section id="outils" className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-lg sm:text-2xl font-semibold text-[#15241F]">
            Besoin d'effectuer un calcul immédiat ?
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6660]">
            Deux outils en accès libre, sans création de compte requise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2F]">
                <Calculator className="w-3.5 h-3.5" /> Calculateur IRL 2026
              </span>
              <p className="text-sm font-semibold text-[#15241F]">
                Calculer une révision annuelle de loyer
              </p>
              <p className="text-xs text-[#5A6660]">
                Renseignez votre loyer et les trimestres de référence. Le nouveau loyer est calculé selon la formule officielle INSEE.
              </p>
            </div>
            <Link
              href="/outils/calculateur-irl"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1E3A2F] hover:underline"
            >
              Accéder au calculateur IRL →
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E2DA] p-5 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2F]">
                <FileText className="w-3.5 h-3.5" /> Modèle PDF
              </span>
              <p className="text-sm font-semibold text-[#15241F]">
                Générer une quittance de loyer d'essai
              </p>
              <p className="text-xs text-[#5A6660]">
                Remplissez les informations de base et téléchargez un modèle PDF avec les mentions légales obligatoires.
              </p>
            </div>
            <Link
              href="/outils/modele-quittance-loyer-pdf"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1E3A2F] hover:underline"
            >
              Générer une quittance d'essai →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function B2PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-12 sm:py-20 border-t border-[#E5E2DA] bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-[#15241F]">
            Des tarifs clairs, proportionnés à vos logements
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6660]">
            14 jours d'essai gratuit sur chaque formule. Sans carte bancaire requise.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-3 flex items-center justify-center gap-3 text-xs">
            <button
              onClick={() => setAnnual(false)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                !annual ? "bg-[#1E3A2F] text-white" : "text-[#5A6660] hover:bg-[#F5F3EF]"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                annual ? "bg-[#1E3A2F] text-white" : "text-[#5A6660] hover:bg-[#F5F3EF]"
              }`}
            >
              Annuel <span className="text-[#A3E635] text-[11px] font-semibold">(2 mois offerts)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Plan Starter */}
          <div className="p-6 rounded-xl border border-[#E5E2DA] bg-[#F5F3EF] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#5A6660] uppercase tracking-wider">
                  Plan Starter
                </span>
                <p className="text-xs text-[#7C8782] mt-0.5">Pour 1 à 3 logements</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#15241F]">
                    {annual ? "89 €" : "9 €"}
                  </span>
                  <span className="text-xs text-[#5A6660]">
                    {annual ? "/ an (soit 7,42 €/mois)" : "/ mois"}
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#15241F] pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Jusqu'à 3 logements inclus
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Suivi mensuel des encaissements
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Quittances conformes loi 1989
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Reçus de paiement partiel
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Export comptable CSV
                </li>
              </ul>
            </div>

            <Link
              href="/register?plan=starter"
              className="w-full py-2.5 rounded-lg border border-[#1E3A2F] text-[#1E3A2F] hover:bg-[#1E3A2F] hover:text-white font-medium text-xs text-center transition-colors block"
            >
              Tester Starter (14 jours offerts)
            </Link>
          </div>

          {/* Plan Pro */}
          <div className="p-6 rounded-xl border-2 border-[#1E3A2F] bg-white flex flex-col justify-between space-y-6 shadow-sm relative">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#1E3A2F] text-white text-[10px] font-semibold tracking-wide uppercase">
              Le plus complet
            </span>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#1E3A2F] uppercase tracking-wider">
                  Plan Pro
                </span>
                <p className="text-xs text-[#7C8782] mt-0.5">Pour 4 à 10 logements</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#15241F]">
                    {annual ? "149 €" : "15 €"}
                  </span>
                  <span className="text-xs text-[#5A6660]">
                    {annual ? "/ an (soit 12,41 €/mois)" : "/ mois"}
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#15241F] pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Jusqu'à 10 logements inclus
                </li>
                <li className="flex items-center gap-2 font-medium text-[#1E3A2F]">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Tout le plan Starter
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Alertes et calcul révision IRL INSEE
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Relances d'impayés prêtes en 1 clic
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Analyse assistée par IA des baux
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" /> Support prioritaire
                </li>
              </ul>
            </div>

            <Link
              href="/register?plan=pro"
              className="w-full py-2.5 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-xs text-center transition-colors block shadow-2xs"
            >
              Tester Pro (14 jours offerts)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function B2FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Pourquoi utiliser RentReady plutôt qu'un tableur Excel ?",
      a: "Un fichier Excel ne vous alerte pas à la date anniversaire de la révision IRL, ne génère pas de quittance PDF légale avec distinction loyer/charges, et vous oblige à pointer chaque relevé à la main. RentReady automatise ces tâches et n'attire votre attention qu'en cas d'écart.",
    },
    {
      q: "Comment se déroule l'essai gratuit de 14 jours ?",
      a: "Vous créez votre compte avec votre nom et email. Aucune carte bancaire n'est exigée. Vous pouvez ajouter vos logements et tester le cycle en conditions réelles sans aucun engagement.",
    },
    {
      q: "Que se passe-t-il si un locataire effectue un versement partiel ?",
      a: "La loi du 6 juillet 1989 (art. 21) interdit de délivrer une quittance pour un paiement partiel. RentReady édite alors un reçu de paiement partiel précisant la somme versée et le solde restant dû, tout en maintenant l'alerte à l'écran.",
    },
    {
      q: "Les quittances éditées sont-elles valables en cas de litige ?",
      a: "Oui. Chaque document comporte l'ensemble des mentions légales obligatoires : identité du bailleur et du locataire, adresse précise du bien loué, ventilation loyer principal / charges et période exacte concernée.",
    },
    {
      q: "Puis-je exporter mes données pour ma déclaration fiscale ?",
      a: "Oui. En un clic, vous exportez vos encaissements au format CSV pour les transmettre à votre comptable ou les utiliser pour votre déclaration de revenus locatifs.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-lg sm:text-2xl font-semibold text-[#15241F]">
          Questions fréquentes des propriétaires
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6660]">
          Les réponses à vos interrogations avant de commencer.
        </p>
      </div>

      <div className="divide-y divide-[#E5E2DA] border-y border-[#E5E2DA]">
        {faqs.map((faq, i) => (
          <div key={i} className="py-4">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-medium text-[#15241F] gap-4"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#5A6660] transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <p className="mt-2 text-xs text-[#5A6660] leading-relaxed pr-8">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function B2FinalCtaSection() {
  return (
    <section className="py-12 sm:py-20 border-t border-[#E5E2DA] bg-[#F5F3EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-[#15241F]">
          Reprenez le contrôle de vos loyers dès ce mois-ci.
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6660] max-w-xl mx-auto">
          Configurez votre premier logement en 3 minutes et découvrez la gestion locative apaisée.
        </p>

        <div className="pt-2 flex flex-col items-center gap-2">
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] font-medium text-xs sm:text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            Commencer mon essai gratuit de 14 jours <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-[#7C8782]">
            Sans carte bancaire · Annulation en un clic · Conforme loi de 1989
          </p>
        </div>

        {/* Brand Signature */}
        <div className="pt-8 border-t border-[#E5E2DA]/60 max-w-md mx-auto">
          <p className="text-xs italic text-[#1E3A2F] font-medium">
            « Tout ce qui va bien devient silencieux. Seule l'exception demande votre attention. »
          </p>
        </div>
      </div>
    </section>
  );
}

export function B2Footer() {
  return (
    <footer className="border-t border-[#E5E2DA] bg-[#F5F3EF] text-xs text-[#5A6660] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A2F]" />
            <span className="font-bold text-[#15241F]">RentReady</span>
          </div>
          <p className="text-[11px] text-[#7C8782]">
            Logiciel de gestion locative pour propriétaires indépendants.
          </p>
          <p className="text-[11px] text-[#7C8782] pt-2">
            © 2026 RentReady. Tous droits réservés.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-[#15241F]">Produit</p>
          <ul className="space-y-1.5 text-[11px]">
            <li><a href="#features" className="hover:text-[#15241F]">Fonctionnalités</a></li>
            <li><a href="#pricing" className="hover:text-[#15241F]">Tarifs</a></li>
            <li><Link href="/register" className="hover:text-[#15241F]">Essai gratuit</Link></li>
            <li><Link href="/login" className="hover:text-[#15241F]">Espace bailleur</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-[#15241F]">Outils & Guides</p>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/outils/calculateur-irl" className="hover:text-[#15241F]">Calculateur IRL</Link></li>
            <li><Link href="/outils/modele-quittance-loyer-pdf" className="hover:text-[#15241F]">Modèle Quittance PDF</Link></li>
            <li><Link href="/guides" className="hover:text-[#15241F]">Guides de gestion</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-[#15241F]">Légal</p>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/mentions-legales" className="hover:text-[#15241F]">Mentions légales</Link></li>
            <li><Link href="/politique-confidentialite" className="hover:text-[#15241F]">Confidentialité & RGPD</Link></li>
            <li><Link href="/cgu" className="hover:text-[#15241F]">CGU</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. ARCHITECTURE A — PRODUCT LED                                            */
/* ────────────────────────────────────────────────────────────────────────── */
export function HomepageArchitectureA({ isMobile = false }: PageProps) {
  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#15241F]">
      <B2Navbar />
      <HeroProductFirst isMobile={isMobile} />
      <B2FourPillarsSection />
      <B2PricingSection />
      <B2FinalCtaSection />
      <B2Footer />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. ARCHITECTURE B — PROBLEM → RESOLUTION                                   */
/* ────────────────────────────────────────────────────────────────────────── */
export function HomepageArchitectureB({ isMobile = false }: PageProps) {
  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#15241F]">
      <B2Navbar />
      <HeroOutcomeFirst isMobile={isMobile} />

      {/* Pain Point Section : Pourquoi abandonner le tableur */}
      <section className="py-12 sm:py-16 border-t border-[#E5E2DA] max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#15241F]">
            Pourquoi vos locations méritent mieux qu'un tableur
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6660]">
            Excel est gratuit, mais il ne vous protège pas contre les oublis et les erreurs de droit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-5 rounded-xl border border-red-200 bg-red-50/30 space-y-2">
            <span className="font-semibold text-red-900 block">Avec un tableur artisanal</span>
            <ul className="space-y-1.5 text-red-800 text-xs">
              <li>• Pointage manuel ligne par ligne le 5 du mois</li>
              <li>• Pas d'alerte à la date anniversaire de la révision IRL</li>
              <li>• Quittances Word rédigées à la main avec risque d'erreur</li>
              <li>• Documents éparpillés entre Drive et boîtes email</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-[#1E3A2F]/30 bg-white space-y-2">
            <span className="font-semibold text-[#1E3A2F] block">Avec RentReady</span>
            <ul className="space-y-1.5 text-[#15241F] text-xs">
              <li>• Ce qui est réglé s'efface silencieusement</li>
              <li>• Notification 30j avant l'anniversaire IRL avec formule INSEE</li>
              <li>• Quittances et reçus émis en 1 clic (art. 21 loi 1989)</li>
              <li>• Espace locataire avec téléchargement autonome</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="demo" className="py-10 max-w-5xl mx-auto px-4 sm:px-6">
        <InteractiveDemo standalone={true} isMobile={isMobile} />
      </section>

      <B2LegalTrustSection />
      <B2FreeToolsSection />
      <B2PricingSection />
      <B2FaqSection />
      <B2FinalCtaSection />
      <B2Footer />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. ARCHITECTURE C — HYBRID CONVERSION (RECOMMENDED)                        */
/* ────────────────────────────────────────────────────────────────────────── */
export function HomepageArchitectureC({ isMobile = false }: PageProps) {
  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#15241F]">
      <B2Navbar />
      <HeroHybrid isMobile={isMobile} />
      <B2FourPillarsSection />
      <B2LegalTrustSection />
      <B2FreeToolsSection />
      <B2PricingSection />
      <B2FaqSection />
      <B2FinalCtaSection />
      <B2Footer />
    </div>
  );
}
