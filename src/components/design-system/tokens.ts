/**
 * RentReady Design System — B+ V2.1 Tokens
 *
 * Rôles sémantiques stricts issus des stress-tests d'adversité (Red Team Design) :
 * - Papier & Encre : matérialité architecturale calme, feutrée et contrastée (WCAG AAA/AA).
 * - Calme vs Attention : le calme est silencieux, l'exception est la seule tension.
 * - Typographie tripartite : Editorial (Serif) / Interface (Sans) / Tabulaire (Mono).
 */

export const bplusTokens = {
  color: {
    // Surfaces papier
    paper: "#F8F6F0",
    paperSubtle: "#FAF8F3",
    paperRaised: "#FFFFFF",

    // Encres & Typographie
    ink: "#151413", // Contraste 16.5:1 sur #F8F6F0 (WCAG AAA)
    inkMuted: "#6B6760", // Contraste 5.2:1 sur #F8F6F0 (WCAG AA)
    inkFaint: "#9E9A90", // Repères structurels & étiquettes mineures

    // État Calme / Réglé (Botanique)
    calm: "#166534", // Contraste 6.2:1 sur #F8F6F0 (WCAG AA)
    calmSubtle: "#F0FDF4",
    calmBorder: "#BBF7D0",

    // État Attention / Exception active (Terracotta)
    attention: "#C2410C", // Contraste 4.9:1 sur #F8F6F0 (WCAG AA)
    attentionSubtle: "#FFF7ED",
    attentionBorder: "#FED7AA",

    // État Retard passif (Ambre)
    delayed: "#D97706",
    delayedText: "#78350F", // Contraste 5.8:1 sur #FEF3C7 (WCAG AA)
    delayedSubtle: "#FEF3C7",
    delayedBorder: "#FDE68A",

    // Lignes & Filets structurels
    border: "#E5E0D8",
    borderSubtle: "rgba(21, 20, 19, 0.08)",
    borderStrong: "rgba(21, 20, 19, 0.20)",
  },

  typography: {
    // 1. Editorial : mot-symbole, mois, grands repères de page
    editorial: "font-serif",
    // 2. Interface : 90 % de la navigation, labels, boutons, formulaires
    interface: "font-sans",
    // 3. Tabulaire : montants financiers, centimes, dates d'encaissement
    tabular: "font-mono tabular-nums",
  },

  radius: {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
  },

  motion: {
    // Rétraction/déploiement fonctionnel court respectant prefers-reduced-motion
    retract: "transition-all duration-200 ease-out motion-reduce:transition-none",
  },
} as const;

export type BPlusTokens = typeof bplusTokens;
