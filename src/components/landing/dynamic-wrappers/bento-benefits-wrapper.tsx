"use client";

import dynamic from "next/dynamic";

const BentoBenefits = dynamic(
  () => import("@/components/landing/bento-benefits").then((mod) => mod.BentoBenefits),
  {
    loading: () => (
      <div style={{ minHeight: 800 }} aria-hidden="true" />
    ),
  }
);

export function BentoBenefitsWrapper() {
  return <BentoBenefits />;
}
