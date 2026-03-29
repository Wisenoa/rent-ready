"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { spring } from "./motion-config";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
}

const directionMap = {
  up: { y: 1, x: 0 },
  down: { y: -1, x: 0 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
} as const;

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 40,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  const d = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: d.x * distance, y: d.y * distance }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: d.x * distance, y: d.y * distance }
      }
      transition={{ ...spring.gentle, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
