"use client";

import dynamic from "next/dynamic";

const SocialProof = dynamic(
  () => import("@/components/landing/social-proof").then((mod) => mod.SocialProof),
  {
    loading: () => (
      <div className="py-16 sm:py-20" style={{ minHeight: 180 }} aria-hidden="true" />
    ),
  }
);

export function SocialProofWrapper() {
  return <SocialProof />;
}
