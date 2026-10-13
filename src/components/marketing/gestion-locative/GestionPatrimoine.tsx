import React from "react";
import Image from "next/image";
import { Check, Shield, Home, Sparkles } from "lucide-react";

export function GestionPatrimoine() {
  const BENEFITS = [
    {
      icon: Home,
      title: "Visibilité patrimoniale instantanée",
      desc: "Retrouvez la situation financière de chacun de vos biens au même endroit : loyer perçu, solde restant, fin de bail et date de prochaine révision.",
    },
    {
      icon: Sparkles,
      title: "Des relations locataires apaisées",
      desc: "Vos locataires reçoivent des quittances claires et conformes dès leur virement validé. En cas d'oubli, la relance amiable se fait en un clic.",
    },
    {
      icon: Shield,
      title: "Protection contre les erreurs juridiques",
      desc: "Dépôts de garantie plafonnés, clauses légales à jour et calculs déterministes. Lokna applique le droit locatif sans que vous n'ayez à devenir juriste.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-[#E5E2DA] bg-[#FAF9F5]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Architectural Facade Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#E5E2DA] bg-white shadow-xl">
              <Image
                src="/images/challenge/patrimoine-facade.webp"
                alt="Façade d'immeuble résidentiel en pierre de taille avec volets vert forêt et balcons en fer forgé"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover transition-transform duration-500 hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 backdrop-blur-md p-3 border border-white/40 shadow-sm flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-[#15241F]">Gestion de 1 à 10 logements</p>
                  <p className="text-[11px] text-[#5A6660]">Appartements nus, meublés, collocations</p>
                </div>
                <span className="text-[11px] font-medium text-[#1E3A2F] bg-[#1E3A2F]/10 px-2.5 py-1 rounded-full">
                  100% Indépendant
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A2F]">
                Sérénité & Patrimoine
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#15241F] leading-tight">
                Votre patrimoine mérite une gestion à la hauteur de sa valeur.
              </h2>
              <p className="text-sm sm:text-base text-[#5A6660] leading-relaxed">
                Gérer soi-même ne signifie pas bricoler avec des bouts de papier. Lokna vous apporte la rigueur, l&apos;élégance et la tranquillité d&apos;esprit dont vous avez besoin pour faire fructifier vos investissements locatifs.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex items-start gap-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-[#E5E2DA] text-[#1E3A2F] shadow-2xs">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#15241F]">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#5A6660] leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
