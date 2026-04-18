"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion";
import { spring } from "./motion-config";
import { ScrollReveal } from "./scroll-reveal";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question:
      "Quel est le meilleur logiciel de gestion locative en ligne pour particulier en 2026 ?",
    answer:
      "RentReady est conçu spécifiquement pour les propriétaires bailleurs indépendants gérant de 1 à 10 biens. Contrairement aux logiciels professionnels destinés aux agences immobilières (qui facturent des centaines d'euros par mois), RentReady offre toutes les fonctionnalités essentielles — quittancement automatique conforme à la loi du 6 juillet 1989, détection des virements bancaires via Open Banking (DSP2), calcul de la révision IRL connecté à l'INSEE, et portail locataire — pour seulement 15 € par mois. L'outil est déjà conforme au format Factur-X et prépare le e-reporting B2C obligatoire dès septembre 2027.",
  },
  {
    question:
      "Comment automatiser l'envoi des quittances de loyer en toute conformité ?",
    answer:
      "RentReady automatise intégralement le processus de quittancement. Dès qu'un virement correspondant au montant du loyer est détecté sur votre compte bancaire, le système vérifie si le paiement couvre 100 % du solde exigé (loyer de base + provisions pour charges). Si c'est le cas, une quittance de loyer conforme à l'article 21 de la loi du 6 juillet 1989 est générée au format PDF, avec une distinction claire entre le loyer nu et les charges locatives. Si le paiement est partiel, un reçu de paiement partiel est émis à la place, indiquant le solde restant dû. Le document est ensuite envoyé automatiquement par email au locataire.",
  },
  {
    question:
      "Comment calculer la révision annuelle du loyer avec l'indice IRL de l'INSEE ?",
    answer:
      "La révision annuelle du loyer en France est encadrée par l'Indice de Référence des Loyers (IRL) publié chaque trimestre par l'INSEE. La formule légale est : Nouveau loyer = Loyer actuel × (Nouvel IRL du trimestre de référence ÷ IRL de référence à la date de signature du bail). Par exemple, avec un loyer de 800 € et un IRL passant de 142,06 à 145,78 (4ᵉ trimestre 2025), le nouveau loyer serait de 800 × (145,78 ÷ 142,06) = 820,97 €. RentReady effectue ce calcul automatiquement en se connectant aux données officielles de l'INSEE et notifie le locataire de la révision.",
  },
  {
    question:
      "Qu'est-ce que le format Factur-X et pourquoi mon logiciel de gestion locative doit-il le supporter ?",
    answer:
      "Factur-X est le format franco-allemand de facturation électronique conforme à la norme européenne EN 16931. Il s'agit d'un fichier PDF/A-3 (conçu pour l'archivage longue durée) dans lequel est embarqué un fichier XML contenant les métadonnées structurées de la transaction (montant, TVA, identité des parties). La France impose progressivement la facturation électronique obligatoire : les grandes entreprises depuis 2024, les ETI en 2025, et les PME/micro-entrepreneurs dès septembre 2027 pour l'émission et le e-reporting. RentReady génère déjà ses quittances et reçus dans un format compatible Factur-X, vous n'aurez rien à changer le jour J.",
  },
  {
    question:
      "RentReady est-il adapté à une SCI familiale ou au statut LMNP ?",
    answer:
      "Oui. RentReady gère aussi bien les propriétaires en nom propre (régime micro-foncier ou réel) que les SCI familiales et les loueurs en meublé non professionnel (LMNP). Le simulateur fiscal intégré permet de comparer le rendement de vos biens sous le régime LMNP classique avec le nouveau dispositif Jeanbrun 2026, en prenant en compte les prélèvements sociaux actuels de 18,6 % (CSG 10,6 %, CRDS 0,5 %, prélèvement de solidarité 7,5 %). Pour les SCI, l'outil centralise la gestion de tous les lots sous un même compte avec des exports comptables séparés.",
  },
  {
    question:
      "Comment fonctionne la détection automatique des loyers avec l'Open Banking ?",
    answer:
      "RentReady utilise une API d'Open Banking conforme à la directive européenne DSP2 (comme Bridge API ou Powens) pour se connecter en lecture seule à votre compte bancaire professionnel ou dédié à la gestion locative. Lorsqu'un virement entrant est détecté, l'algorithme de rapprochement compare automatiquement le montant, la référence et l'émetteur avec les loyers attendus dans votre tableau de bord. Si une correspondance est trouvée, la transaction est marquée comme « Payé » et la quittance est générée automatiquement. Vos identifiants bancaires ne transitent jamais par nos serveurs.",
  },
  {
    question:
      "Qu'est-ce que le e-reporting B2C et suis-je concerné en tant que propriétaire bailleur ?",
    answer:
      "Le e-reporting B2C est l'obligation de transmettre à l'administration fiscale française un récapitulatif des encaissements perçus de clients particuliers (non assujettis à la TVA). Pour les micro-entrepreneurs et certaines SCI, cette obligation entre en vigueur le 1ᵉʳ septembre 2027. En tant que propriétaire bailleur louant à des particuliers, vous serez potentiellement concerné. RentReady prépare déjà cette échéance en agrégeant automatiquement vos encaissements mensuels dans un format structuré prêt à être transmis à la plateforme publique de facturation (PPF).",
  },
  {
    question:
      "Combien coûte RentReady et y a-t-il un engagement ?",
    answer:
      "RentReady coûte 15 € par mois sans engagement, ou 150 € par an (soit 2 mois offerts). Ce tarif unique inclut la gestion de 10 biens maximum, un nombre illimité de locataires, toutes les fonctionnalités (quittancement, détection des virements, révision IRL, portail locataire, OCR des factures artisans par IA, simulateur fiscal) et les mises à jour légales et réglementaires. Vous bénéficiez d'un essai gratuit de 14 jours sans carte bancaire. Il n'y a aucun frais caché, aucune commission sur les loyers encaissés, et vous pouvez résilier en un clic depuis votre espace.",
  },
];

export function FaqSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <ScrollReveal className="mb-16 text-center sm:mb-20">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-400">
            Questions fréquentes
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-stone-900">
            Tout ce que vous devez savoir
            <br />
            sur la gestion locative automatisée
          </h2>
        </ScrollReveal>

        <motion.div
          className="overflow-hidden rounded-3xl border border-stone-200/40 bg-white/60 px-7 backdrop-blur-sm sm:px-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={spring.gentle}
        >
          <Accordion defaultValue={[0]}>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={i}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionPanel>{faq.answer}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Still have questions? CTA */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-stone-200/40 bg-white/60 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left backdrop-blur-sm">
          <div>
            <p className="text-[14px] font-semibold text-stone-800">
              Vous avez une question spécifique ?
            </p>
            <p className="mt-0.5 text-[13px] text-stone-500">
              Notre équipe répond sous 24h ouvrées.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <a
              href="mailto:support@rentready.fr"
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              Contacter le support
            </a>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-stone-800"
            >
              Voir la démo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * JSON-LD structured data for FAQPage schema.
 * Rendered as a <script> tag in the page head.
 */
export function FaqJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
