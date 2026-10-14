"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";

type Status = "idle" | "copied" | "failed";

/**
 * Copies a value and says so, visibly and to screen readers. Falls back to an
 * explicit failure message when the browser refuses clipboard access.
 */
export function CopyButton({
  text,
  label,
  copiedLabel = "Copié",
  icon = "copy",
  variant = "primary",
}: {
  text: string | (() => string);
  label: string;
  copiedLabel?: string;
  icon?: "copy" | "link";
  variant?: "primary" | "quiet";
}) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(typeof text === "function" ? text() : text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  const Icon = status === "copied" ? Check : icon === "link" ? Link2 : Copy;
  const styles =
    variant === "primary"
      ? "bg-forest text-cream hover:bg-forest-hover"
      : "border border-line bg-white text-ink hover:border-sage-300";

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3.5 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest motion-reduce:transition-none ${styles}`}
    >
      <Icon aria-hidden="true" className="size-4" />
      <span>{status === "copied" ? copiedLabel : label}</span>
      <span role="status" className="sr-only">
        {status === "copied" ? copiedLabel : status === "failed" ? "La copie a échoué. Sélectionnez le montant pour le copier." : ""}
      </span>
    </button>
  );
}
