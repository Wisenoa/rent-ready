"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardV21, DashboardMode } from "@/components/design-translation/dashboard-v21";

function DashboardContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as DashboardMode) || "standard_exception";
  const resolvedParam = searchParams.get("resolved");
  const initialResolved =
    resolvedParam !== null ? resolvedParam === "true" : undefined;

  return <DashboardV21 mode={mode} initialResolved={initialResolved} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6F0]" />}>
      <DashboardContent />
    </Suspense>
  );
}
