"use client";

import dynamic from "next/dynamic";

const ProblemSection = dynamic(
  () => import("@/components/landing/problem-section").then((mod) => mod.ProblemSection),
  {
    loading: () => (
      <div style={{ minHeight: 600 }} aria-hidden="true" />
    ),
  }
);

export function ProblemSectionWrapper() {
  return <ProblemSection />;
}
