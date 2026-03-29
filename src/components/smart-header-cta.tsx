"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

/**
 * Session-aware CTA for the marketing header.
 * Rendered as a client component so SSG pages stay fully static —
 * the HTML is pre-rendered with the public fallback, then this
 * hydrates on the client and swaps to the correct link.
 */
export function SmartHeaderCta() {
  const { data: session, isPending } = useSession();

  // During hydration, show a neutral placeholder to avoid layout shift
  if (isPending) {
    return <div className="h-9 w-32 animate-pulse rounded-lg bg-stone-200" />;
  }

  if (session?.user) {
    return (
      <Link
        href="/dashboard"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        Accéder au Dashboard
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
