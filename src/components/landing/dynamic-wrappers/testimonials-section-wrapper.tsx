"use client";

import dynamic from "next/dynamic";

const TestimonialsSection = dynamic(
  () => import("@/components/landing/testimonials-section"),
  {
    loading: () => (
      <div style={{ minHeight: 400 }} aria-hidden="true" />
    ),
  }
);

export function TestimonialsSectionWrapper() {
  return <TestimonialsSection />;
}
