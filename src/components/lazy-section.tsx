/**
 * LazySection — CLS-safe dynamic import wrapper for "use client" components.
 *
 * Problem: marketing pages use "use client" components (framer-motion, animations)
 * that ship ~60KB of JS for sections below the fold. This bloats the initial
 * bundle and harms INP/LCP.
 *
 * Solution: dynamically import below-fold client components so they are code-split.
 * The server renders a placeholder shell with the same dimensions as the real
 * component, so Cumulative Layout Shift = 0 during the swap.
 *
 * Usage:
 *   import { LazySection } from "@/components/lazy-section";
 *   const BentoBenefits = dynamic(() => import("@/components/landing/bento-benefits"));
 *   <LazySection component={BentoBenefits} className="py-24 sm:py-32" />
 */

import dynamic from "next/dynamic";
import type { ReactComponentElement } from "react";

type LazyComponent = Promise<{ default: ReactComponentElement<{ className?: string; style?: React.CSSProperties }> }>;

interface LazySectionProps {
  component: () => LazyComponent;
  className?: string;
  style?: React.CSSProperties;
  fallbackMinHeight?: string;
}

/**
 * Server-rendered shell that preserves layout space during lazy load.
 * Plain div — disappears the moment the client component hydrates.
 */
function SectionShell({ className, style, minHeight }: { className?: string; style?: React.CSSProperties; minHeight?: string }) {
  return (
    <div
      className={className}
      style={{ minHeight, ...style }}
      aria-hidden="true"
    />
  );
}

/**
 * LazySection — SSR-safe dynamic import.
 *
 * The server always renders SectionShell immediately (zero CLS).
 * The client loads the real component asynchronously after hydration.
 * Code-split chunks are downloaded separately, keeping initial bundle lean.
 */
export function LazySection({
  component,
  className,
  style,
  fallbackMinHeight = "200px",
}: LazySectionProps) {
  const DynamicComponent = dynamic(component, {
    ssr: true,
    loading: () => <SectionShell className={className} style={style} minHeight={fallbackMinHeight} />,
  });

  return <DynamicComponent className={className} style={style} />;
}

/* ─── Pre-built lazy wrappers for common landing components ─── */

export const LazySocialProof = () =>
  LazySection({
    component: () => import("@/components/landing/social-proof"),
    fallbackMinHeight: "180px",
  });

export const LazyProblemSection = () =>
  LazySection({
    component: () => import("@/components/landing/problem-section"),
    fallbackMinHeight: "600px",
  });

export const LazyBentoBenefits = () =>
  LazySection({
    component: () => import("@/components/landing/bento-benefits"),
    fallbackMinHeight: "800px",
  });

export const LazyComparisonSection = () =>
  LazySection({
    component: () => import("@/components/landing/comparison-section"),
    fallbackMinHeight: "500px",
  });

export const LazyTestimonialsSection = () =>
  LazySection({
    component: () => import("@/components/landing/testimonials-section"),
    fallbackMinHeight: "400px",
  });

export const LazyPricingSection = () =>
  LazySection({
    component: () => import("@/components/landing/pricing-section"),
    fallbackMinHeight: "600px",
  });

export const LazyFaqSection = () =>
  LazySection({
    component: () => import("@/components/landing/faq-section"),
    fallbackMinHeight: "500px",
  });

export const LazyFinalCta = () =>
  LazySection({
    component: () => import("@/components/landing/final-cta"),
    fallbackMinHeight: "400px",
  });