"use client";

import dynamic from "next/dynamic";

const PricingSection = dynamic(
  () => import("@/components/landing/pricing-section"),
  {
    loading: () => (
      <div style={{ minHeight: 600 }} aria-hidden="true" />
    ),
  }
);

export function PricingSectionWrapper() {
  return <PricingSection />;
}
