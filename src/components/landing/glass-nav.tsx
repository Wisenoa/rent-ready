"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SmartHeaderCta } from "@/components/smart-header-cta";

const NAV_LINKS = [
  { href: "/gestion-locative", label: "Fonctionnalités" },
  { href: "/locations", label: "Gestion locative" },
  { href: "/bail", label: "Baux" },
  { href: "/quittances", label: "Quittances" },
  { href: "/pricing", label: "Tarifs" },
];

export function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBanner(window.scrollY > window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-700 ease-out ${
        scrolled
          ? "bg-[#f8f7f4]/80 backdrop-blur-2xl shadow-[0_1px_0_rgba(168,162,158,0.12)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 font-bold text-sm text-white">
            R
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-stone-900">
            RentReady
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-[14px] font-medium text-stone-600 transition-colors hover:text-stone-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <SmartHeaderCta />
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden rounded-md p-2 text-stone-600 hover:bg-stone-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h14M3 10h14M3 14h14" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Sticky CTA banner — appears after scrolling past hero (100vh) */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-stone-900 text-white text-center py-2.5 text-[13px] font-medium shadow-[0_-1px_0_rgba(0,0,0,0.15)]">
          Commencez gratuitement — sans carte bancaire{" "}
          <Link href="/register" className="ml-1 underline hover:text-blue-300 transition-colors">
            Créer un compte
          </Link>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden border-t border-stone-200/60 bg-[#f8f7f4]/95 backdrop-blur-md px-5 py-4 space-y-1"
          onClick={() => setMenuOpen(false)}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-stone-700 hover:bg-stone-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/templates"
            className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Modèles gratuits
          </Link>
          <Link
            href="/guides"
            className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Guides pratiques
          </Link>
          <Link
            href="/glossaire-immobilier"
            className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Glossaire immobilier
          </Link>
          <Link
            href="/blog"
            className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </Link>
          <div className="pt-3 border-t border-stone-200/60 mt-3">
            <Link
              href="/login"
              className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-stone-700 hover:bg-stone-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="block rounded-lg bg-blue-600 px-3 py-2.5 mt-2 text-[15px] font-medium text-white hover:bg-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
