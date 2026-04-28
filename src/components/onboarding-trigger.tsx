"use client";

import { useState, useEffect, useCallback } from "react";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { OnboardingWizardV2 } from "@/components/onboarding-wizard-v2";

interface OnboardingTriggerProps {
  hasProperties: boolean;
}

const STORAGE_KEY = "onboarding_wizard_state";
const DISMISSAL_KEY = "onboarding_wizard_dismissed";
const VARIANT_KEY = "onboarding_variant";

// 'C' = original 3-step, 'A' = micro-progress, 'B' = outcome-first
export type OnboardingVariant = "A" | "B" | "C";

function loadState(): WizardState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

interface WizardState {
  propertyId?: string;
  tenantId?: string;
  propertySkipped?: boolean;
  tenantSkipped?: boolean;
}

function getOrAssignVariant(): OnboardingVariant {
  if (typeof window === "undefined") return "C";
  try {
    const stored = localStorage.getItem(VARIANT_KEY);
    if (stored === "A" || stored === "B" || stored === "C") {
      return stored;
    }
    // Default to C for now — switch to A/B/C split when ready
    const variant: OnboardingVariant = "C";
    localStorage.setItem(VARIANT_KEY, variant);
    return variant;
  } catch {
    return "C";
  }
}

export function useOnboardingWizard() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [variant, setVariant] = useState<OnboardingVariant>("C");

  useEffect(() => {
    setMounted(true);
    setVariant(getOrAssignVariant());
  }, []);

  const startWizard = useCallback(() => {
    setWizardOpen(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Auto-show for users with 0 properties on first visit
    const timer = setTimeout(() => {
      const savedState = loadState();
      const dismissed = localStorage.getItem(DISMISSAL_KEY);

      // Show if they have partial progress OR haven't dismissed yet
      if (
        savedState.propertyId ||
        savedState.tenantId ||
        savedState.propertySkipped ||
        savedState.tenantSkipped
      ) {
        setWizardOpen(true);
      } else if (!dismissed) {
        setWizardOpen(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [mounted]);

  function handleOpenChange(open: boolean) {
    setWizardOpen(open);
    if (!open) {
      const state = loadState();
      // Only mark dismissed if no partial progress
      if (!state.propertyId && !state.tenantId && !state.propertySkipped && !state.tenantSkipped) {
        localStorage.setItem(DISMISSAL_KEY, "1");
      }
    }
  }

  return { wizardOpen, handleOpenChange, startWizard, mounted, variant };
}

export function OnboardingTrigger({ hasProperties }: OnboardingTriggerProps) {
  const { wizardOpen, handleOpenChange, mounted, variant } = useOnboardingWizard();

  if (!mounted || hasProperties) return null;

  // Use V2 wizard for all variants for now (redesigned flow)
  // The variant prop can be passed to switch between flows
  return (
    <OnboardingWizardV2
      open={wizardOpen}
      onOpenChange={handleOpenChange}
      variant={variant}
    />
  );
}
