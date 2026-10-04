"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
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

/**
 * `variant` lives in localStorage — an external mutable source — so it is read
 * through useSyncExternalStore instead of being copied into state by an effect.
 * Reading it during render avoids the extra render pass (and the
 * react-hooks/set-state-in-effect error) the previous mount effect caused.
 * getServerSnapshot keeps SSR and the first client render in agreement.
 */
function subscribeToVariant() {
  // The one-time assignment the old mount effect performed, now done as an
  // external-system write when the store is subscribed to. getSnapshot stays
  // free of side effects.
  getOrAssignVariant();
  return () => {};
}

function getVariantSnapshot(): OnboardingVariant {
  if (typeof window === "undefined") return "C";
  try {
    const stored = localStorage.getItem(VARIANT_KEY);
    return stored === "A" || stored === "B" || stored === "C" ? stored : "C";
  } catch {
    return "C";
  }
}

function getVariantServerSnapshot(): OnboardingVariant {
  return "C";
}

/**
 * `autoOpen` should be false on any page that is not the dashboard.
 *
 * The hook opens the wizard 300 ms after mount when the user has not dismissed
 * it. That is right on /dashboard and wrong everywhere else: the wizard should
 * not ambush someone who came to add a second property.
 */
export function useOnboardingWizard({ autoOpen = true }: { autoOpen?: boolean } = {}) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const variant = useSyncExternalStore(
    subscribeToVariant,
    getVariantSnapshot,
    getVariantServerSnapshot
  );
  // True on the client, false during SSR and the hydration render.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const startWizard = useCallback(() => {
    setWizardOpen(true);
  }, []);

  useEffect(() => {
    if (!mounted || !autoOpen) return;
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
  }, [mounted, autoOpen]);

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

/**
 * Renders the wizard from a caller-owned hook instance.
 *
 * ## Why this exists
 *
 * `useOnboardingWizard` holds `wizardOpen` in plain `useState`, so every caller
 * gets its own independent copy. `<OnboardingWizardV2>` was rendered in exactly
 * one place — inside `<OnboardingTrigger>`, which is mounted only on /dashboard
 * and returns `null` as soon as the account has a property.
 *
 * /properties, /tenants and /leases each called the hook and got a `startWizard`
 * that flipped their own `wizardOpen`, which nothing read. The buttons behind it
 * — including « Commencer la configuration », the primary call to action on an
 * empty /properties — were provably dead: the state changed and no dialog
 * appeared. The wizard did open on the dashboard, which is why the feature looked
 * alive.
 *
 * This component takes the caller's values, so the button and the dialog it opens
 * share one piece of state.
 */
export function OnboardingWizardHost({
  open,
  onOpenChange,
  variant = "C",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: OnboardingVariant;
}) {
  return <OnboardingWizardV2 open={open} onOpenChange={onOpenChange} variant={variant} />;
}
