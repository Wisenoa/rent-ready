"use client";

import dynamic from "next/dynamic";

const TestimonialsSection = dynamic(
  () => import("@/components/landing/testimonials-section").then((mod) => mod.TestimonialsSection),
  {
    loading: () => (
      <div style={{ minHeight: 700 }} aria-hidden="true" />
    ),
  }
);

export function TestimonialsSectionWrapper() {
  return <TestimonialsSection />;
}
