"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./home.module.css";

/**
 * Fades a block in the first time it scrolls into view.
 *
 * The server renders the block visible. Only after hydration, and only if the
 * block is still below the fold, is it hidden and then revealed — so nothing is
 * ever invisible without JavaScript, above the fold, or with reduced motion
 * (the CSS cancels the hidden state there).
 */
export function Reveal({
  children,
  className,
  index = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  as?: "div" | "li" | "figure";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      style={{ "--i": index } as CSSProperties}
      className={cn(styles.reveal, className)}
    >
      {children}
    </Tag>
  );
}
