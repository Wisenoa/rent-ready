"use client";

import dynamic from "next/dynamic";

const ComparisonSection = dynamic(
  () => import("@/components/landing/comparison-section"),
  {
    loading: () => (
      <div style={{ minHeight: 500 }} aria-hidden="true" />
    ),
  }
);

export function ComparisonSectionWrapper() {
  return <ComparisonSection />;
}
