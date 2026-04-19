"use client";

import dynamic from "next/dynamic";

const TestimonialStrip = dynamic(
  () => import("@/components/landing/testimonial-strip").then((mod) => mod.TestimonialStrip),
  {
    loading: () => (
      <div style={{ minHeight: 120 }} aria-hidden="true" />
    ),
  }
);

export function TestimonialStripWrapper() {
  return <TestimonialStrip />;
}
