"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, PartyPopper, ArrowRight, Home, Users, FileText, CreditCard } from "lucide-react";

interface DashboardWelcomeBannerProps {
  userCreatedAt: Date | null;
  hasProperties: boolean;
  hasTenants: boolean;
  hasLeases: boolean;
  hasPayments: boolean;
}

type NextAction = {
  label: string;
  description: string;
  href: string;
  icon: typeof Home;
};

function getNextBestAction(props: {
  hasProperties: boolean;
  hasTenants: boolean;
  hasLeases: boolean;
  hasPayments: boolean;
}): NextAction | null {
  if (!props.hasProperties) {
    return {
      label: "Ajouter votre premier bien",
      description: "Commencez par ajouter votre bien pour activer votre tableau de bord.",
      href: "/properties/new",
      icon: Home,
    };
  }
  if (!props.hasLeases) {
    return {
      label: "Créer votre premier bail",
      description: "Un bail lie votre bien à un locataire et permet de suivre les paiements.",
      href: "/leases/new",
      icon: FileText,
    };
  }
  if (!props.hasTenants) {
    return {
      label: "Inviter votre locataire",
      description: "Ajoutez les coordonnées de votre locataire pour générer des quittances.",
      href: "/tenants/new",
      icon: Users,
    };
  }
  if (!props.hasPayments) {
    return {
      label: "Enregistrer un paiement",
      description: "Enregistrez vos premiers loyers reçus pour générer des quittances.",
      href: "/billing",
      icon: CreditCard,
    };
  }
  return null;
}

const STORAGE_KEY = "rentready_welcome_banner_dismissed";

export function DashboardWelcomeBanner({
  userCreatedAt,
  hasProperties,
  hasTenants,
  hasLeases,
  hasPayments,
}: DashboardWelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Check if user is within 7-day welcome window
  const isWithinWelcomeWindow = userCreatedAt
    ? (Date.now() - new Date(userCreatedAt).getTime()) < 7 * 24 * 60 * 60 * 1000
    : false;

  // Only show for new users within welcome window with no properties
  const shouldShow = !dismissed && isWithinWelcomeWindow && !hasProperties;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  if (!shouldShow) {
    return null;
  }

  const nextAction = getNextBestAction({ hasProperties, hasTenants, hasLeases, hasPayments });

  return (
    <div className="relative rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-amber-100 hover:text-amber-700 transition-colors"
        aria-label="Fermer"
      >
        <X className="size-4" />
      </button>

      <div className="flex items-start gap-4">
        {/* Celebration icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
          <PartyPopper className="size-6 text-amber-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-amber-900">
            Bienvenue sur RentReady ! 🎉
          </h3>
          <p className="mt-1 text-sm text-amber-700/80">
            Votre compte est prêt. Commencez par ajouter votre premier bien pour activer
            votre tableau de bord.
          </p>

          {nextAction && (
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                href={nextAction.href}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:-translate-y-0.5"
              >
                <nextAction.icon className="size-4 mr-2" />
                {nextAction.label}
                <ArrowRight className="size-4 ml-2" />
              </Link>
              <p className="text-xs text-amber-600/70">{nextAction.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
