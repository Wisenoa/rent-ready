"use client";

import dynamic from "next/dynamic";

const FinalCta = dynamic(
  () => import("@/components/landing/final-cta").then((mod) => mod.FinalCta),
  {
    loading: () => (
      <div style={{ minHeight: 400 }} aria-hidden="true" />
    ),
  }
);

export function FinalCtaWrapper() {
  return <FinalCta />;
}
