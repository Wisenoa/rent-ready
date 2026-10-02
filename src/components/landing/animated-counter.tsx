"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface AnimatedCounterProps {
  /** Target value to animate to (e.g. 2400, 98, 15) */
  value: number;
  /** Displayed suffix (e.g. "+", "%", "min") */
  suffix?: string;
  /** Displayed prefix (e.g. "0") */
  prefix?: string;
  /** Duration in ms */
  duration?: number;
  /** CSS class */
  className?: string;
  /** Label shown below the number */
  label?: string;
  /** Format as French locale (spaces for thousands) */
  localeFR?: boolean;
}

/**
 * `prefers-reduced-motion` read as an external source via useSyncExternalStore,
 * the same pattern as `src/hooks/use-mobile.ts`.
 *
 * Reading it this way keeps the reduced-motion value available *during render*,
 * so the component can derive the final number without ever calling setState in
 * an effect body (which `react-hooks/set-state-in-effect` rejects, and which
 * costs an extra cascading render pass on mount).
 *
 * getServerSnapshot returns false: the server and the first client render agree,
 * so the plain-number server render stays hydration-safe. A user with reduced
 * motion enabled gets the final value on the very next render, which is the same
 * instant display the old setState produced.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * AnimatedCounter — animates a number from 0 to `value`.
 *
 * Design principles:
 * - Uses requestAnimationFrame for smooth 60fps animation
 * - Respects prefers-reduced-motion (falls back to instant display)
 * - Uses Intersection Observer so animation only starts when visible
 * - Renders plain number on server (avoids hydration mismatch)
 *
 * Used in: SocialProof stats bar, hero section metrics.
 *
 * Example:
 *   <AnimatedCounter value={2400} suffix="+" label="propriétaires actifs" />
 */
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1400,
  className = "",
  label,
  localeFR = true,
}: AnimatedCounterProps) {
  // `animatedValue` is only ever written from the rAF callback, i.e. an async
  // external-system update, never synchronously in an effect body.
  const [animatedValue, setAnimatedValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Intersection Observer — only animate when scrolled into view.
    // setState lives in the observer callback, not the effect body.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    // Reduced motion is derived during render (see above), so there is nothing
    // to do here but skip the animation entirely.
    if (!hasStarted || prefersReducedMotion) return;

    const startTime = performance.now();
    const startValue = 0;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3); // cubic ease-out

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const current = Math.round(startValue + (value - startValue) * easedProgress);

      setAnimatedValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [hasStarted, prefersReducedMotion, value, duration]);

  // Reduced-motion (and the pre-start state) resolve to the final value / 0
  // without a state write; otherwise show whatever the rAF loop last produced.
  const displayValue = hasStarted && prefersReducedMotion ? value : animatedValue;

  const formatted = localeFR
    ? displayValue.toLocaleString("fr-FR")
    : displayValue.toLocaleString();

  return (
    <span ref={ref} className={`inline-flex flex-col items-center ${className}`}>
      <span className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl tabular-nums">
        {prefix}{formatted}{suffix}
      </span>
      {label && (
        <span className="mt-1 text-[12px] text-stone-500 sm:text-[13px]">{label}</span>
      )}
    </span>
  );
}

/* ─── Pre-configured stats bar using AnimatedCounter ─── */

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  prefix?: string;
}

const STATS_CONFIG: StatItem[] = [
  { value: 2400, suffix: "+", label: "propriétaires actifs" },
  { value: 98, suffix: "%", label: "satisfaction client" },
  { value: 15, suffix: " min", label: "temps moyen de setup" },
  { value: 0, suffix: "", label: "carte bancaire pour commencer" },
];

interface StatsBarProps {
  /** Override stats config */
  stats?: StatItem[];
  className?: string;
}

/**
 * StatsBar — animated counter stats row.
 * Ships pre-configured with the 4 RentReady stats.
 *
 * Accessible: each stat is in a <div> with role="group" and aria-label.
 */
export function StatsBar({ stats = STATS_CONFIG, className = "" }: StatsBarProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-px rounded-2xl border border-stone-200/50 bg-stone-200/50 sm:grid-cols-4 overflow-hidden ${className}`}
      role="group"
      aria-label="Statistiques RentReady"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center justify-center bg-white/80 px-6 py-6 sm:py-8"
        >
          <AnimatedCounter
            value={stat.value}
            suffix={stat.suffix ?? ""}
            prefix={stat.prefix ?? ""}
            label={stat.label}
          />
        </div>
      ))}
    </div>
  );
}
