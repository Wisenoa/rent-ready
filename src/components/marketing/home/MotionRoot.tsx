"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "framer-motion";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Motion for the homepage islands. Features load after hydration (`strict`
 * keeps every animated element on the lightweight `m` component), and
 * `reducedMotion="user"` turns transforms off for visitors who asked for it.
 * Server-rendered children pass straight through.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
