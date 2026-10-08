"use client";

import React from "react";
import Link from "next/link";

interface NavbarProps {
  isMobile?: boolean;
}

export function B3Navbar({ isMobile = false }: NavbarProps) {
  return (
    <header className="border-b border-[#E5E2DA] bg-[#F5F3EF]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/design-preview/b3" className="flex items-center gap-2" aria-label="RentReady Accueil">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A2F]" aria-hidden="true" />
            <span className="font-bold text-base sm:text-lg tracking-tight text-[#15241F]">
              RentReady
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[#5A6660]">
            <a href="#demo" className="hover:text-[#15241F] transition-colors">
              Fonctionnement
            </a>
            <a href="#moments" className="hover:text-[#15241F] transition-colors">
              Moments clés
            </a>
            <a href="#outils" className="hover:text-[#15241F] transition-colors">
              Outils gratuits
            </a>
            <a href="#tarifs" className="hover:text-[#15241F] transition-colors">
              Tarifs
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-[#5A6660] hover:text-[#15241F] transition-colors hidden sm:inline"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#15241F] text-xs font-medium transition-colors shadow-2xs"
          >
            Essayer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
