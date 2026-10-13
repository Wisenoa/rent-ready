import React from "react";
import Image from "next/image";
import { Check, ArrowRight, FileText } from "lucide-react";

export function GestionGoldenPath() {
  const STEPS = [
    {
      num: "01",
      title: "Le Logement",
      desc: "Adresse, surface habitable, caractéristiques. La surface alimente automatiquement le contrôle du loyer au m².",
    },
    {
      num: "02",
      title: "Le Locataire",
      desc: "Identité, contacts et pièces justificatives centralisés au même endroit, accessibles en 1 clic.",
    },
    {
      num: "03",
      title: "Le Bail & l'Échéancier",
      desc: "Loyer nu, charges, dépôt de garantie plafonné. Le contrat génère immédiatement l'échéancier mensuel.",
    },
    {
      num: "04",
      title: "Le Loyer Attendu",
      desc: "Chaque premier du mois, Lokna sait exactement quel montant est dû, par qui et à quelle date limite.",
    },
    {
      num: "05",
      title: "Le Paiement Réel",
      desc: "Virement reçu ? La ligne passe au vert. Paiement partiel ? Le solde exact reste visible sans approximation.",
    },
    {
      num: "06",
      title: "La Quittance Conforme",
      desc: "Générée automatiquement avec les mentions obligatoires de la loi du 6 juillet 1989 dès règlement complet.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-[#E5E2DA] bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A2F]">
            La méthode Lokna
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#15241F]">
            La boucle d&apos;or : du bien à la quittance
          </h2>
          <p className="text-sm sm:text-base text-[#5A6660] leading-relaxed">
            Une mécanique limpide où chaque étape alimente la suivante. Fini les calculs refaits de mémoire, les quittances bricolées et les doutes de fin de mois.
          </p>
        </div>

        {/* Content Grid: Steps + Visual Still Life */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: The 6 sequential steps */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group relative rounded-xl border border-[#E5E2DA] bg-[#FAF8F5]/50 p-5 transition-all duration-200 hover:bg-white hover:border-[#1E3A2F]/30 hover:shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold tabular-nums text-[#1E3A2F] bg-[#1E3A2F]/10 px-2 py-0.5 rounded">
                    {step.num}
                  </span>
                  <span className="text-[11px] text-[#7C8782] font-medium">Étape clé</span>
                </div>
                <h3 className="text-base font-semibold text-[#15241F] tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#5A6660] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Editorial Visual Still Life with receipt */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E5E2DA] bg-[#FAF8F5] shadow-lg">
              <Image
                src="/images/challenge/quittance-cycle.webp"
                alt="Quittance de loyer conforme à la loi de 1989, trousseau de clés d'appartement et stylo plume sur table en travertin"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover transition-transform duration-500 hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 backdrop-blur-md p-3.5 border border-white/40 shadow-sm text-xs">
                <div className="flex items-center gap-2 text-[#1E3A2F] font-semibold mb-1">
                  <FileText className="size-4" aria-hidden="true" />
                  <span>Quittance conforme Art. 21</span>
                </div>
                <p className="text-[11px] text-[#5A6660]">
                  Ventilation légale loyer nu + charges, date de valeur et signature certifiée.
                </p>
              </div>
            </div>

            {/* Micro-insight box */}
            <div className="rounded-xl border border-[#E5E2DA] bg-[#FAF8F5] p-4 text-xs">
              <p className="text-[#15241F] font-medium leading-relaxed">
                <span className="font-semibold text-[#1E3A2F]">Important juridique :</span> Un paiement partiel ne doit jamais donner lieu à une quittance complète. Lokna produit un « reçu de paiement partiel » indiquant expressément le solde restant dû.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
