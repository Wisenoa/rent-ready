"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Session-aware CTA for the marketing header.
 * Renders static CTA during SSR/SSG, then hydrates on client to show
 * the appropriate link based on session state without causing hydration errors.
 */
export function SmartHeaderCta() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check session on client only
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!data?.user);
      })
      .catch(() => {
        // Session check failed, show default CTA
        setIsAuthenticated(false);
      });
  }, []);

  // During SSR and initial hydration, show the static CTA
  // This prevents hydration mismatches and allows static generation
  if (!mounted) {
    return (
      <>
        <Link
          href="/login"
          className="hidden sm:block text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
        >
          Connexion
        </Link>
        <Link
          href="/register"
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          Essai gratuit
        </Link>
      </>
    );
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/dashboard"
        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        Accéder au Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="hidden sm:block text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
      >
        Connexion
      </Link>
      <Link
        href="/register"
        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        Essai gratuit
      </Link>
    </>
  );
}
