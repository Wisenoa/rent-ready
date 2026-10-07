"use client";

import dynamic from "next/dynamic";

const MonthlyCycleStory = dynamic(
  () => import("@/components/landing/monthly-cycle-story").then((mod) => mod.MonthlyCycleStory),
  {
    loading: () => <div style={{ minHeight: 600 }} aria-hidden="true" />,
  }
);

export function MonthlyCycleStoryWrapper() {
  return <MonthlyCycleStory />;
}
