/**
 * Shared spring animation configs — Apple-style physics.
 * No linear or ease-in-out allowed. Springs only.
 */
export const spring = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 20, mass: 1 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 24, mass: 0.8 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 17, mass: 0.6 },
  slow: { type: "spring" as const, stiffness: 60, damping: 18, mass: 1.2 },
} as const;

export const stagger = {
  fast: 0.06,
  normal: 0.1,
  slow: 0.15,
} as const;
