import React from "react";
import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="border-t border-[#E5E2DA] bg-[#F5F3EF] text-xs text-[#5A6660] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A2F]" aria-hidden="true" />
            <span className="font-bold text-[#15241F]">RentReady</span>
          </div>
          <p className="text-[11px] text-[#7C8782]">
            Logiciel de gestion locative pour propriétaires bailleurs indépendants.
          </p>
          <p className="text-[11px] text-[#7C8782] pt-2">
            © 2026 RentReady. Tous droits réservés.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-[#15241F]">Produit</p>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <a href="#demo" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                Fonctionnement
              </a>
            </li>
            <li>
              <a href="#moments" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                Moments clés
              </a>
            </li>
            <li>
              <a href="#tarifs" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                Tarifs
              </a>
            </li>
            <li>
              <Link href="/register" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                Essai gratuit
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-[#15241F]">Outils & Guides</p>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <Link href="/outils/calculateur-irl" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                Calculateur IRL
              </Link>
            </li>
            <li>
              <Link href="/outils/modele-quittance-loyer-pdf" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                Modèle Quittance PDF
              </Link>
            </li>
            <li>
              <Link href="/guides" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                Guides bailleur
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-[#15241F]">Légal</p>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <Link href="/mentions-legales" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/politique-confidentialite" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                Confidentialité & RGPD
              </Link>
            </li>
            <li>
              <Link href="/cgu" className="hover:text-[#15241F] transition-colors focus:outline-hidden focus-visible:underline">
                CGU
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
