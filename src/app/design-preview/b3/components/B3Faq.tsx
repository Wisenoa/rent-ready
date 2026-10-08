"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function B3Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Pourquoi quitter un tableur Excel pour RentReady ?",
      a: "Un tableur ne prépare pas vos quittances au format légal, n'alerte pas sur les révisions IRL et oblige à pointer vos relevés à la main. RentReady automatise ces vérifications et ne signale que les anomalies.",
    },
    {
      q: "Comment fonctionne l'essai gratuit de 14 jours ?",
      a: "Création de compte immédiate avec votre nom et email. Aucune carte bancaire requise. Vous configurez vos logements et testez l'ensemble du suivi en conditions réelles sans engagement.",
    },
    {
      q: "Que se passe-t-il en cas de versement partiel d'un locataire ?",
      a: "RentReady édite un reçu d'acompte avec le solde restant dû (loi de 1989 art. 21). La quittance définitive n'est disponible qu'une fois le loyer intégralement réglé.",
    },
    {
      q: "Mes données d'encaissement sont-elles exportables ?",
      a: "Oui. En un clic, vous téléchargez un export CSV structuré de vos loyers et versements, directement utilisable pour votre déclaration fiscale ou votre comptable.",
    },
  ];

  return (
    <section className="py-10 sm:py-14 max-w-3xl mx-auto px-4 sm:px-6 space-y-5 border-t border-[#E5E2DA]">
      <div className="text-center space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold text-[#15241F] tracking-tight">
          Questions fréquentes
        </h2>
        <p className="text-xs text-[#5A6660]">
          L'essentiel pour démarrer sereinement.
        </p>
      </div>

      <div className="divide-y divide-[#E5E2DA] border-y border-[#E5E2DA]">
        {faqs.map((faq, i) => (
          <div key={i} className="py-3">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-medium text-[#15241F] gap-4 focus:outline-hidden"
              aria-expanded={openIndex === i}
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#5A6660] shrink-0 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <p className="mt-1.5 text-xs text-[#5A6660] leading-relaxed pr-6">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
