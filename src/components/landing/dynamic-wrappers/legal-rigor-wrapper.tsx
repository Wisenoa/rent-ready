"use client";

import dynamic from "next/dynamic";

const LegalRigorSection = dynamic(
  () =>
    import("@/components/landing/legal-rigor-section").then(
      (mod) => mod.LegalRigorSection
    ),
  {
    loading: () => <div style={{ minHeight: 500 }} aria-hidden="true" />,
  }
);

export function LegalRigorWrapper() {
  return <LegalRigorSection />;
}
