"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { spring } from "./motion-config";

interface TestimonialCardProps {
  /** Reviewer name */
  name: string;
  /** Reviewer role / context */
  role: string;
  /** Star rating 1-5 */
  stars?: number;
  /** Review text */
  text: string;
  /** Optional avatar initials override */
  avatarInitials?: string;
  /** Optional avatar image URL */
  avatarSrc?: string;
  /** Source platform (Google, Trustpilot, Capterra) */
  source?: "google" | "trustpilot" | "capterra" | "direct";
  /** CSS class override */
  className?: string;
  /** Hover animation */
  enableHover?: boolean;
}

/**
 * TestimonialCard — E-E-A-T social proof component.
 *
 * Design principles:
 * - Uses blockquote semantics for accessibility
 * - Star rating is decorative but accessible (aria-label on the container)
 * - Avatar fallback with initials when no photo provided
 * - Gradient reveal on hover for interactivity feedback
 * - Compact enough to use in a grid (3-col on desktop, 1-col on mobile)
 *
 * Used on: Homepage, Pricing, Feature pages, Testimonials page.
 */
export function TestimonialCard({
  name,
  role,
  stars = 5,
  text,
  avatarInitials,
  avatarSrc,
  source,
  className = "",
  enableHover = true,
}: TestimonialCardProps) {
  const initials = avatarInitials ?? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const sourceLabel: Record<string, string> = {
    google: "Avis Google vérifié",
    trustpilot: "Avis Trustpilot vérifié",
    capterra: "Avis Capterra vérifié",
    direct: "Avis vérifié",
  };

  return (
    <motion.blockquote
      className={`group relative overflow-hidden rounded-3xl border border-stone-200/40 bg-white/60 p-7 backdrop-blur-sm sm:p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={spring.gentle}
      whileHover={enableHover ? { y: -3 } : undefined}
      aria-label={`Témoignage de ${name} — ${role}`}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-teal-500/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative">
        {/* Quote icon */}
        <Quote
          className="mb-4 size-6 text-stone-200"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        {/* Stars */}
        <div className="flex gap-0.5" role="img" aria-label={`${stars} étoiles sur 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${i < stars ? "fill-amber-400 text-amber-400" : "fill-stone-100 text-stone-200"}`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Review text */}
        <p className="mt-4 text-[15px] leading-relaxed text-stone-600">
          {text}
        </p>

        {/* Reviewer info */}
        <footer className="mt-5 border-t border-stone-100/60 pt-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
              aria-hidden="true"
            >
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={initials}
                  className="h-full w-full rounded-full object-cover"
                  width={36}
                  height={36}
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <p className="text-[14px] font-semibold text-stone-900">{name}</p>
              <p className="text-[13px] text-stone-400">{role}</p>
            </div>
          </div>

          {/* Verified source badge */}
          {source && (
            <div className="mt-2 flex items-center gap-1.5">
              {/* Checkmark */}
              <svg
                className="size-3 text-green-600 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="6.5" />
                <path d="M5.5 8l1.8 1.8L10.5 6.5" />
              </svg>
              <span className="text-[11px] text-stone-400">{sourceLabel[source]}</span>
            </div>
          )}
        </footer>
      </div>
    </motion.blockquote>
  );
}

/* ─── Pre-configured variant for star rating displays ─── */

interface StarRatingDisplayProps {
  rating: number;       // e.g. 4.8
  reviewCount: number;  // e.g. 127
  source?: "google" | "trustpilot" | "capterra";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * StarRatingDisplay — aggregate rating shown near CTAs or section headers.
 * Example: "★★★★½ 4.8/5 sur Google (127 avis)"
 */
export function StarRatingDisplay({
  rating,
  reviewCount,
  source = "google",
  size = "md",
  className = "",
}: StarRatingDisplayProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const starSize = size === "sm" ? "size-3" : size === "lg" ? "size-5" : "size-3.5";

  const sourceName: Record<string, string> = {
    google: "Google",
    trustpilot: "Trustpilot",
    capterra: "Capterra",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} aria-label={`${rating} sur 5 — ${reviewCount} avis ${sourceName[source]}`}>
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${i < fullStars ? "fill-amber-400 text-amber-400" : i === fullStars && hasHalf ? "fill-amber-400/60 text-amber-400" : "fill-stone-100 text-stone-200"}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className={`font-semibold text-stone-800 ${size === "lg" ? "text-base" : "text-sm"}`}>
        {rating}
      </span>
      <span className={`text-stone-500 ${size === "lg" ? "text-sm" : "text-xs"}`}>
        / 5 sur {sourceName[source]} ({reviewCount.toLocaleString("fr-FR")} avis)
      </span>
    </div>
  );
}
