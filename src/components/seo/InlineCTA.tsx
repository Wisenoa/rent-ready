import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface InlineCTAProps {
  /** Text displayed on the CTA */
  text?: string;
  /** Destination URL */
  href: string;
  /** Visual style */
  variant?: "link" | "button" | "banner";
  /** Label for screen readers */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
  /** Set true when this CTA converts a blog/template reader (track as content-to-product) */
  conversionContext?: "blog" | "template" | "tool" | "glossary";
  /** Show arrow icon */
  showArrow?: boolean;
}

/**
 * Contextual inline CTA for use within article/template/tool content.
 * Design principles:
 *   - Non-intrusive: text-link style by default, never a modal or overlay
 *   - Contextual: appears near the relevant mention, not floating
 *   - Valuable: communicates what the user gains, not generic "Sign up"
 *
 * Usage examples:
 *   - Inside blog prose: "Découvrez comment créer un bail en 5 minutes →"
 *   - After template feature list: "Essayez ce modèle en ligne — gratuit 14j"
 *   - After tool explanation: "Gérez vos loyers automatiquement →"
 */
export function InlineCTA({
  text = "Essayer gratuitement",
  href,
  variant = "link",
  ariaLabel,
  className = "",
  conversionContext,
  showArrow = true,
}: InlineCTAProps) {
  const label = ariaLabel ?? text;

  if (variant === "banner") {
    return (
      <div
        className={`not-prose my-6 flex flex-col gap-3 rounded-2xl bg-stone-100 p-5 sm:flex-row sm:items-center sm:justify-between ${className}`}
        role="region"
        aria-label={label}
      >
        <div>
          <p className="font-semibold text-stone-900">{text}</p>
          {conversionContext && (
            <p className="mt-0.5 text-sm text-stone-500">
              Aucune carte bancaire requise · Essai gratuit 14 jours
            </p>
          )}
        </div>
        <Link
          href={href}
          aria-label={label}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700"
        >
          {text}
          {showArrow && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Link>
      </div>
    );
  }

  if (variant === "button") {
    return (
      <Link
        href={href}
        aria-label={label}
        className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 ${className}`}
      >
        {text}
        {showArrow && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      </Link>
    );
  }

  // Default: text link style
  return (
    <Link
      href={href}
      aria-label={label}
      className={`inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 ${className}`}
    >
      {text}
      {showArrow && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
    </Link>
  );
}

/* ─── Pre-configured CTA variants for common positions ─── */

export function BlogInlineCTA({ href = "/register" }: { href?: string }) {
  return (
    <InlineCTA
      text="Essayez RentReady gratuitement"
      href={href}
      variant="link"
      conversionContext="blog"
    />
  );
}

export function TemplateDownloadCTA({ href = "/register" }: { href?: string }) {
  return (
    <InlineCTA
      text="Créer ce bail en ligne — essai gratuit"
      href={href}
      variant="link"
      conversionContext="template"
    />
  );
}

export function ToolResultCTA({ href = "/register" }: { href?: string }) {
  return (
    <InlineCTA
      text="Gérez vos loyers automatiquement →"
      href={href}
      variant="link"
      conversionContext="tool"
    />
  );
}

export function StickyBottomCTA() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-sm py-3 px-4 sm:hidden"
      role="region"
      aria-label="Appel à l'action"
    >
      <Link
        href="/register"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-medium text-white"
      >
        Démarrer gratuitement
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}