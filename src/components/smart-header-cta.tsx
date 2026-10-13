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

  useEffect(() => {
    // Check session on client only. The setState calls live in the promise
    // callbacks, which are async by definition, so there is no synchronous
    // setState in the effect body (react-hooks/set-state-in-effect).
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

  // The session fetch always resolves after the first render, so `isAuthenticated`
  // is false during SSR and during the hydration render. That first render is
  // therefore identical to the unauthenticated markup below, which is why no
  // `mounted` flag is needed: it would only ever re-render the same output.
  if (isAuthenticated) {
    return (
      <Link
        href="/dashboard"
        className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#15241F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A2F]"
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
        className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#15241F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A2F]"
      >
        Essai gratuit
      </Link>
    </>
  );
}
