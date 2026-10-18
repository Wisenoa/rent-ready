"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/components/landing/motion-config";

const COOKIE_KEY = "lokna_cookie_consent";
const CONSENT_AT_KEY = "lokna_cookie_consent_at";

/** How long to wait before interrupting the user with the banner. */
const DELAY_MS = 1500;

export function CookieConsent() {
  // Two things must be true for the banner to show: no stored decision, and
  // 1.5s elapsed since mount.
  const [mountedAt, setMountedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    const show = () => {
      setMountedAt(Date.now());
      setElapsed(true);
    };
    let id: ReturnType<typeof setTimeout> | undefined;
    try {
      const recordedAt = Number(localStorage.getItem(CONSENT_AT_KEY));
      if (!localStorage.getItem(COOKIE_KEY) || recordedAt <= 0 || Date.now() - recordedAt >= 180 * 24 * 60 * 60 * 1000) {
        id = setTimeout(show, DELAY_MS);
      }
    } catch { id = setTimeout(show, DELAY_MS); }
    window.addEventListener("lokna-consent-settings", show);
    return () => {
      clearTimeout(id);
      window.removeEventListener("lokna-consent-settings", show);
    };
  }, []);

  function decide(value: "accepted" | "rejected") {
    try { localStorage.setItem(COOKIE_KEY, value); localStorage.setItem(CONSENT_AT_KEY, String(Date.now())); } catch { /* Browser storage may be disabled. */ }
    document.cookie = `lokna_cookie_consent=${value}; Path=/; SameSite=Lax; Max-Age=15552000`;
    if (value === "rejected") document.cookie = "lokna_source_tool=; Path=/; Max-Age=0; SameSite=Lax";
    window.dispatchEvent(new Event("lokna-consent-change"));
    setElapsed(false);
  }

  function accept() {
    decide("accepted");
  }

  function reject() {
    decide("rejected");
  }

  const visible = elapsed && mountedAt !== null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={spring.gentle}
        >
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-stone-200/40 bg-white/80 p-5 shadow-xl shadow-stone-900/5 backdrop-blur-2xl sm:flex sm:items-center sm:gap-6 sm:p-6">
            <p className="text-[14px] leading-relaxed text-stone-600 sm:flex-1">
              Ce site utilise des cookies strictement nécessaires au
              fonctionnement de l&apos;authentification et à la mémorisation de
              vos préférences. Avec votre accord, nous mesurons aussi l’usage des outils et du produit. Aucun cookie publicitaire n&apos;est utilisé.{" "}
              <Link
                href="/politique-confidentialite"
                className="underline underline-offset-2 text-stone-800 hover:text-blue-600"
              >
                En savoir plus
              </Link>
            </p>
            <div className="mt-4 flex gap-3 sm:mt-0 sm:shrink-0">
              <button
                onClick={reject}
                aria-label="Refuser tous les cookies optionnels"
                className="rounded-xl px-5 py-2.5 text-[13px] font-medium text-stone-600 transition-colors hover:bg-stone-100"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                aria-label="Accepter tous les cookies"
                className="rounded-xl bg-stone-900 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-stone-800"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CookieSettingsButton() {
  return <button type="button" className="text-forest underline underline-offset-2" onClick={() => {
    // Withdrawal takes effect immediately, before the preference dialog opens.
    try { localStorage.setItem(COOKIE_KEY, "rejected"); localStorage.setItem(CONSENT_AT_KEY, String(Date.now())); } catch { /* No storage access. */ }
    document.cookie = "lokna_cookie_consent=rejected; Path=/; SameSite=Lax; Max-Age=15552000";
    document.cookie = "lokna_source_tool=; Path=/; Max-Age=0; SameSite=Lax";
    window.dispatchEvent(new Event("lokna-consent-settings"));
  }}>Modifier mon choix de mesure d’audience</button>;
}
