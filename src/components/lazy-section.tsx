"use client";

import React, { Suspense } from "react";

// LazyComponent: a dynamic import that resolves to a React component
// All lazy-loaded sections accept className + style props for consistent styling
type LazyComponent = Promise<{ default: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }>;

interface LazySectionProps {
  /** Dynamic import() call — webpack will code-split this component */
  component: () => LazyComponent;
  /** Passed to the loaded component as className */
  className?: string;
  /** Passed to the loaded component as style */
  style?: React.CSSProperties;
  /** Fallback shown while the component chunk loads (avoids layout shift) */
  loading?: React.ReactNode;
}

/**
 * LazySection — wrapper for below-the-fold sections that should be
 * code-split and loaded on demand. Uses React.Suspense so the loading
 * state is declarative and shareable.
 *
 * Usage:
 *   <LazySection
 *     component={() => import("@/components/landing/bento-benefits")}
 *     className="py-20"
 *   />
 */
export function LazySection({
  component,
  className,
  style,
  loading = null,
}: LazySectionProps) {
  const LazyComponent = React.lazy(component);
  return (
    <Suspense fallback={loading}>
      <LazyComponent className={className} style={style} />
    </Suspense>
  );
}
