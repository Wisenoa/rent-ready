"use client";

import { OnboardingTrigger } from "@/components/onboarding-trigger";

interface DashboardOnboardingWrapperProps {
  hasProperties: boolean;
}

export function DashboardOnboardingWrapper({ hasProperties }: DashboardOnboardingWrapperProps) {
  return <OnboardingTrigger hasProperties={hasProperties} />;
}
