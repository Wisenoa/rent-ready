"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "./home.module.css";

/**
 * A photograph that opens like a shutter the first time it scrolls into view,
 * then drifts a few percent against the scroll. The image is always in the
 * HTML and visible without JavaScript; the shutter only closes after hydration
 * and only for a photo that is still below the fold.
 */
export function ParallaxPhoto({
  src,
  alt,
  sizes,
  className,
  position = "50% 50%",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  position?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  useEffect(() => {
    const el = frame.current;
    if (!el || reduce || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div ref={frame} className={cn(styles.photo, "relative overflow-hidden bg-[#DDD6C9]", className)}>
      <m.div style={reduce ? undefined : { y }} className="absolute inset-[-6%_0]">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: position }} />
      </m.div>
    </div>
  );
}
