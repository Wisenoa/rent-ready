import React from "react";
import { cn } from "@/lib/utils";

export type StatusTone = "calm" | "attention" | "delayed" | "neutral";

interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  size?: "sm" | "md";
}

export function StatusDot({
  tone = "neutral",
  size = "md",
  className,
  ...props
}: StatusDotProps) {
  const toneBg = {
    calm: "bg-emerald-600",
    attention: "bg-orange-600",
    delayed: "bg-amber-500",
    neutral: "bg-neutral-400",
  }[tone];

  const sizeClass = size === "sm" ? "size-1.5" : "size-2";

  return (
    <span
      className={cn("rounded-full shrink-0 inline-block", sizeClass, toneBg, className)}
      aria-hidden="true"
      {...props}
    />
  );
}
