/**
 * RentReady Design System — Tokens Fonctionnels
 *
 * Principes :
 * - Fonctionnel plutôt que moodboard
 * - Calme par défaut, exception prioritaire
 * - Typographie sans-serif moderne, chiffres tabulaires
 * - Radius naturel et contrastes accessibles
 */

export const dsTokens = {
  color: {
    // Surfaces
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceSubtle: "#F4F4F5",

    // Textes
    foreground: "#18181B",
    muted: "#71717A",
    subtle: "#A1A1AA",

    // États sémantiques fonctionnels
    calm: "#15803D",
    calmSubtle: "#F0FDF4",
    calmBorder: "#DCFCE7",

    attention: "#C2410C",
    attentionSubtle: "#FFF7ED",
    attentionBorder: "#FED7AA",

    delayed: "#B45309",
    delayedText: "#78350F",
    delayedSubtle: "#FEF3C7",
    delayedBorder: "#FDE68A",

    // Bordures
    border: "#E4E4E7",
    borderSubtle: "#F4F4F5",
    borderStrong: "#D4D4D8",
  },

  typography: {
    heading: "font-sans font-semibold tracking-tight",
    body: "font-sans",
    tabular: "font-sans tabular-nums",
  },

  radius: {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
  },

  motion: {
    retract: "transition-all duration-200 ease-out motion-reduce:transition-none",
  },
} as const;

export const bplusTokens = dsTokens;
export type BPlusTokens = typeof dsTokens;
