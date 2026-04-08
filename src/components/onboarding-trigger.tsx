"use client";

import { useState, useEffect } from "react";
import { OnboardingWizard } from "@/components/onboarding-wizard";

interface OnboardingTriggerProps {
  hasProperties: boolean;
}

const STORAGE_KEY = "onboarding_wizard_state";
const DISMISSAL_KEY = "onboarding_wizard_dismissed";

interface WizardState {
  propertyId?: string;
  tenantId?: string;
  propertySkipped?: boolean;
  tenantSkipped?: boolean;
}

function loadState(): WizardState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function OnboardingTrigger({ hasProperties }: OnboardingTriggerProps) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!hasProperties) {
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
    }
  }, [mounted, hasProperties]);

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

  if (!mounted || hasProperties) return null;

  return (
    <OnboardingWizard open={wizardOpen} onOpenChange={handleOpenChange} />
  );
}
