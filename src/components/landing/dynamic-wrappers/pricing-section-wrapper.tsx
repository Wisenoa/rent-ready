"use client";

import dynamic from "next/dynamic";

const PricingSection = dynamic(
  () => import("@/components/landing/pricing-section").then((mod) => mod.PricingSection),
  {
    loading: () => (
      <div style={{ minHeight: 800 }} aria-hidden="true" />
    ),
  }
);

export function PricingSectionWrapper() {
  return <PricingSection />;
}
