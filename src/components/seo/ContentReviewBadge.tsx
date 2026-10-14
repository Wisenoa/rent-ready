import { RefreshCw } from "lucide-react";

interface ContentReviewBadgeProps {
  updatedAt: string;
  category?: "article" | "template" | "tool" | "glossary" | "legal";
  showIcon?: boolean;
  className?: string;
}

/**
 * ContentReviewBadge — the date a page was last updated, and nothing more.
 *
 * It used to read « Article expert-vérifié », « Définition vérifiée » or
 * « Contenu juridique revu » with a green shield. No qualified human review is
 * recorded anywhere, so those labels claimed a validation that never happened.
 * The badge now states a fact the repository can back: the update date. Add a
 * reviewer label only together with the reviewer's identity and the review date.
 *
 * `category` is kept so call sites do not change; it no longer alters the text.
 */
export function ContentReviewBadge({
  updatedAt,
  showIcon = true,
  className = "",
}: ContentReviewBadgeProps) {
  const formattedDate = new Date(updatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink-muted ${className}`}
    >
      {showIcon ? <RefreshCw className="size-3.5 shrink-0 text-ink-soft" aria-hidden="true" /> : null}
      <span>Mis à jour le {formattedDate}</span>
    </p>
  );
}
