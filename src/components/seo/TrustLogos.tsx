/**
 * TrustLogos — Certification & Partnership badge strip.
 *
 * E-E-A-T trust signal: shows authority through:
 * - Data protection certifications
 * - Industry partnerships
 * - Media mentions ("as seen in")
 * - Compliance badges
 *
 * Rendered as a semantic <ul> with aria-label for accessibility.
 * Logos are SVG-based (no external image dependencies = fast load).
 */

interface TrustLogoItem {
  label: string;
  /** SVG path data for the logo icon — keeps this component self-contained */
  icon?: React.ReactNode;
  /** Optional text description for screen readers */
  description?: string;
}

const trustItems: TrustLogoItem[] = [
  {
    label: "RGPD",
    description: "Conforme au Règlement Général sur la Protection des Données",
  },
  {
    label: "Hébergement UE",
    description: "Données hébergées sur des serveurs européens",
  },
  {
    label: "DSP2",
    description: "Accès bancaire sécurisé via Open Banking DSP2",
  },
  {
    label: "CNIL",
    description: "Déclaration CNIL pour le traitement des données personnelles",
  },
];

const mediaMentions = [
  { label: "Le Monde", sub: "" },
  { label: "Les Echos", sub: "" },
  { label: "Challenges", sub: "" },
];

interface TrustLogosProps {
  variant?: "full" | "compact" | "certifications-only";
  showMedia?: boolean;
  className?: string;
}

/**
 * TrustLogos — displays trust badges for authority signals.
 * Used on: Homepage, Pricing page, landing pages.
 */
export function TrustLogos({
  variant = "full",
  showMedia = false,
  className = "",
}: TrustLogosProps) {
  const items = variant === "certifications-only"
    ? trustItems
    : trustItems;

  return (
    <div className={`${className}`}>
      {/* Section label */}
      <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400">
        Sécurisé &amp; Conforme
      </p>

      {/* Certification badges */}
      <ul
        className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        aria-label="Certifications et conformités"
      >
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            {/* Shield icon */}
            <svg
              className="size-4 shrink-0 text-stone-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 1L2 4v4.5c0 3.1 2.6 6 6 6s6-2.9 6-6V4L8 1z" />
              <path d="M5.5 8l1.8 1.8L10.5 6.5" />
            </svg>
            <span className="text-[13px] font-semibold text-stone-600">
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Media mentions strip */}
      {showMedia && variant === "full" && (
        <>
          <p className="mb-3 mt-6 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400">
            Mentions presse
          </p>
          <ul
            className="flex flex-wrap items-center justify-center gap-6"
            aria-label="Mentions dans la presse"
          >
            {mediaMentions.map((m) => (
              <li
                key={m.label}
                className="text-[13px] font-medium text-stone-400"
              >
                {m.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/**
 * CertificationBadge — inline single certification badge.
 * Use in testimonial cards, trust sections, or feature callouts.
 */
interface CertificationBadgeProps {
  label: string;
  description?: string;
  variant?: "default" | "compact";
}

export function CertificationBadge({
  label,
  description,
  variant = "default",
}: CertificationBadgeProps) {
  if (variant === "compact") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
        <svg
          className="size-3.5 shrink-0 text-stone-400"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8 1L2 4v4.5c0 3.1 2.6 6 6 6s6-2.9 6-6V4L8 1z" />
          <path d="M5.5 8l1.8 1.8L10.5 6.5" />
        </svg>
        {label}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-white/60 px-3 py-1.5">
      <svg
        className="size-3.5 shrink-0 text-blue-600"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 1L2 4v4.5c0 3.1 2.6 6 6 6s6-2.9 6-6V4L8 1z" />
        <path d="M5.5 8l1.8 1.8L10.5 6.5" />
      </svg>
      <div className="min-w-0">
        <span className="text-[12px] font-semibold text-stone-700">{label}</span>
        {description && (
          <span className="ml-1 text-[11px] text-stone-400">{description}</span>
        )}
      </div>
    </div>
  );
}
