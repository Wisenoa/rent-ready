"use client";

import dynamic from "next/dynamic";

const ComparisonSection = dynamic(
  () => import("@/components/landing/comparison-section").then((mod) => mod.ComparisonSection),
  {
    loading: () => (
      <div style={{ minHeight: 600 }} aria-hidden="true" />
    ),
  }
);

export function ComparisonSectionWrapper() {
  return <ComparisonSection />;
}
