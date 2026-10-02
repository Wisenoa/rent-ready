"use client";

import React, { Suspense, use } from "react";

// LazyComponent: a dynamic import that resolves to a React component
// All lazy-loaded sections accept className + style props for consistent styling
type LazyComponent = Promise<{ default: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }>;

type LazyLoader = () => LazyComponent;

interface LazySectionProps {
  /** Dynamic import() call — webpack will code-split this component.
   *  Must be a stable module-level reference (see note on promiseCache). */
  component: LazyLoader;
  /** Passed to the loaded component as className */
  className?: string;
  /** Passed to the loaded component as style */
  style?: React.CSSProperties;
  /** Fallback shown while the component chunk loads (avoids layout shift) */
  loading?: React.ReactNode;
}

/**
 * Module-level cache of import promises, keyed by loader.
 *
 * The dynamic import must start once per loader, not once per render, and it
 * must not be kicked off as a render side effect either. Caching at module
 * scope keeps one in-flight promise per loader: use() then reads the resolved
 * module, and the component identity comes from the module's own export.
 *
 * That last point is what keeps this out of render scope. Building the
 * component with React.lazy() in a render body hands React a brand-new
 * component type on every pass, so the section remounts and drops its state on
 * every parent re-render — and react-hooks/static-components rejects it
 * outright ("Cannot create components during render"). Reading `.default` off
 * a resolved module has neither problem: it is a fixed module export.
 */
const promiseCache = new Map<LazyLoader, LazyComponent>();

function getLazyModule(loader: LazyLoader): LazyComponent {
  const cached = promiseCache.get(loader);
  if (cached) return cached;

  const pending = loader();
  promiseCache.set(loader, pending);
  return pending;
}

/**
 * Suspends on the cached import and renders the module's default export.
 * Module-level component, so its own identity is stable across renders.
 */
function LazySectionContent({
  component,
  className,
  style,
}: {
  component: LazyLoader;
  className?: string;
  style?: React.CSSProperties;
}) {
  const LoadedSection = use(getLazyModule(component)).default;
  return <LoadedSection className={className} style={style} />;
}

/**
 * LazySection — wrapper for below-the-fold sections that should be
 * code-split and loaded on demand. Uses React.Suspense so the loading
 * state is declarative and shareable.
 *
 * Note: pass a stable loader reference. An inline arrow
 * (`component={() => import("...")}`) is a new function on every parent
 * render, which misses the cache and starts the import again — declare the
 * loader at module level instead:
 *
 *   const loadBentoBenefits = () => import("@/components/landing/bento-benefits");
 *   ...
 *   <LazySection component={loadBentoBenefits} className="py-20" />
 */
export function LazySection({
  component,
  className,
  style,
  loading = null,
}: LazySectionProps) {
  return (
    <Suspense fallback={loading}>
      <LazySectionContent component={component} className={className} style={style} />
    </Suspense>
  );
}