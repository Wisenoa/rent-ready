"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/components/landing/motion-config";

const COOKIE_KEY = "rentready_cookie_consent";

/** How long to wait before interrupting the user with the banner. */
const DELAY_MS = 1500;

export function CookieConsent() {
  // Two things must be true for the banner to show: no stored decision, and
  // 1.5s elapsed since mount.
  //
  // The previous version called setState synchronously in the effect body
  // (react-hooks/set-state-in-effect rejects that — a cascading render on mount).
  // The fix is a timer that only *reports elapsed time*; visibility is derived
  // during render from two pieces of state, so the effect performs no write that
  // changes the component synchronously — the setTimeout callback is async and
  // is the sanctioned way to defer a state update.
  const [mountedAt, setMountedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(COOKIE_KEY)) return;
    const id = setTimeout(() => {
      setMountedAt(Date.now());
      setElapsed(true);
    }, DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  function decide(value: "accepted" | "rejected") {
    localStorage.setItem(COOKIE_KEY, value);
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
              vos préférences. Aucun cookie publicitaire n&apos;est utilisé.{" "}
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
