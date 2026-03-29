"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SmartHeaderCta } from "@/components/smart-header-cta";

export function GlassNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 font-bold text-sm text-white">
            R
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-stone-900">
            RentReady
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <SmartHeaderCta />
        </div>
      </nav>
    </header>
  );
}
