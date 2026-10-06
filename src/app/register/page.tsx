import { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Créer un compte — RentReady",
    description:
      "Créez votre compte RentReady en 2 minutes. Gérez vos biens locatifs, générez des quittances conformes et suivez vos loyers. Essai gratuit.",
    robots: { index: false, follow: false },
  };
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto w-full max-w-md space-y-8 px-4 py-12">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-md">
              R
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Créer un compte RentReady
          </h1>
          <p className="text-sm text-muted-foreground">
            14 jours d&apos;essai gratuit, sans engagement
          </p>
        </div>

        <Suspense>
          <RegisterForm />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <a
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Se connecter
          </a>
        </p>

        {/* Social proof section */}
        <div className="space-y-4 pt-4">
          {/* What the trial includes — factual, not social proof theatre */}
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border/50 bg-border/50">
            {[
              { value: "14 jours", label: "d'essai gratuit" },
              { value: "0 €", label: "carte bancaire" },
              { value: "15 min", label: "pour le setup" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card px-3 py-3 text-center">
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-2 text-[13px] text-muted-foreground">
            {[
              "Quittances générées depuis vos données réelles, pas depuis un formulaire",
              "Rapprochement automatique des virements reçus",
              "Rappel de la révision IRL à la date anniversaire du bail",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-blue-500">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {[
              { icon: "🛡️", label: "DSP2 sécurisé" },
              { icon: "🇫🇷", label: "Hébergement France" },
              { icon: "📋", label: "Conforme Loi 1989" },
            ].map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
              >
                <span>{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
