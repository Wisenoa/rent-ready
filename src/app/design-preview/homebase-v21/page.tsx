"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HomebaseV21, HomebaseMode } from "@/components/design-translation/homebase-v21";

function HomebaseContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as HomebaseMode) || "nantes_exception";
  const resolvedParam = searchParams.get("resolved");
  const initialResolved =
    resolvedParam !== null ? resolvedParam === "true" : undefined;

  return <HomebaseV21 mode={mode} initialResolved={initialResolved} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6F0]" />}>
      <HomebaseContent />
    </Suspense>
  );
}
