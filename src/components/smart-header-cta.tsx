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
          className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
        >
          Connexion
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
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
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        Accéder auDashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
      >
        Connexion
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        Essai gratuit
      </Link>
    </>
  );
}
