"use client";

import { useEffect, useRef, useState } from "react";

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

/**
 * A euro figure that counts to its new value when it changes. The canonical
 * string computed on the server is what renders first and what the count ends
 * on; the frames in between are presentation only. No count under
 * prefers-reduced-motion.
 */
export function Amount({ cents, label }: { cents: number; label: string }) {
  const [frame, setFrame] = useState<string | null>(null);
  const from = useRef(cents);

  useEffect(() => {
    const start = from.current;
    from.current = cents;
    if (start === cents || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const began = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / 650);
      const eased = 1 - Math.pow(1 - t, 3);
      setFrame(t < 1 ? euros.format(Math.round(start + (cents - start) * eased) / 100) : null);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cents]);

  return <span className="tabular-nums">{frame ?? label}</span>;
}
