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
    calm: "bg-[#166534]",
    attention: "bg-[#C2410C]",
    delayed: "bg-[#D97706]",
    neutral: "bg-[#9E9A90]",
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
