import { ShieldCheck, RefreshCw } from "lucide-react";

/** Content counts as recently reviewed for 90 days. */
const FRESHNESS_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * Reference clock for the freshness check.
 *
 * `Date.now()` is impure: reading it during render makes the output depend on
 * *when* the render happened rather than on props, so the same props can yield
 * different markup and server/client renders can disagree. It is therefore read
 * here, at module scope, not inside the component.
 *
 * This badge is a static, server-rendered E-E-A-T signal, so one timestamp per
 * module load is the right granularity: worst case, content sitting exactly on
 * the 90-day boundary keeps its previous icon until the next deploy. That is
 * cosmetic and self-correcting.
 */
const RENDERED_AT = Date.now();

interface ContentReviewBadgeProps {
  updatedAt: string;
  category?: "article" | "template" | "tool" | "glossary" | "legal";
  showIcon?: boolean;
  className?: string;
}

/**
 * ContentReviewBadge — E-E-A-T trust signal for content freshness.
 *
 * Signals to Google and users that content is actively maintained:
 * - "Mis à jour le [date]" — shows content is not stale
 * - Shield icon signals expert-reviewed content
 * - Refresh icon signals regular updates
 *
 * Used on: blog articles, template pages, tool pages, glossary terms, legal pages.
 * Should appear near the top of the article content, below the title/intro.
 */
export function ContentReviewBadge({
  updatedAt,
  category = "article",
  showIcon = true,
  className = "",
}: ContentReviewBadgeProps) {
  const date = new Date(updatedAt);
  const isRecent = RENDERED_AT - date.getTime() < FRESHNESS_WINDOW_MS;
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const categoryLabel: Record<string, string> = {
    article: "Article expert-vérifié",
    template: "Modèle mis à jour",
    tool: "Outil recalculé",
    glossary: "Définition vérifiée",
    legal: "Contenu juridique revu",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-stone-50 px-3 py-1.5 text-xs text-stone-500 ${className}`}
      aria-label={`Contenu ${categoryLabel[category]} — dernière mise à jour ${formattedDate}`}
    >
      {showIcon && (
        isRecent ? (
          <ShieldCheck className="size-3.5 shrink-0 text-green-600" aria-hidden="true" />
        ) : (
          <RefreshCw className="size-3.5 shrink-0 text-stone-400" aria-hidden="true" />
        )
      )}
      <span>
        <span className="font-medium text-stone-600">
          {categoryLabel[category]}
        </span>
        {" · "}
        <span>
          Mis à jour le {formattedDate}
        </span>
      </span>
    </div>
  );
}
