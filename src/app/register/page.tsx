import { Metadata } from "next";
import { RegisterForm } from "./register-form";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Créer un compte — RentReady",
    description:
      "Créez votre compte RentReady en 2 minutes. Gérez vos biens locatifs, générez des quittances conformes et suivez vos loyers. Essai gratuit.",
    robots: { index: false, follow: false },
  };
}

const testimonials = [
  {
    text: "J'ai récupéré mes week-ends. La quittance part toute seule.",
    name: "Marie-Claire D.",
    role: "3 appartements LMNP",
  },
  {
    text: "Pour 15 € par mois, c'est une assurance tranquillité.",
    name: "Thomas R.",
    role: "2 studios meublés",
  },
];

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

        <RegisterForm />

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
          {/* Mini stats bar */}
          <div className="grid grid-cols-3 gap-px rounded-xl border border-border/50 bg-border/50 overflow-hidden">
            {[
              { value: "2 400+", label: "propriétaires" },
              { value: "98%", label: "satisfaits" },
              { value: "15 min", label: "setup" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card px-3 py-3 text-center">
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex gap-3 rounded-xl border border-border/50 bg-card p-4"
              >
                <div className="mt-0.5 size-5 shrink-0 text-blue-500">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.5 1.5h4v4h-4v-4zm-5 9h4v4H1.5v-4zm7-1a3.5 3.5 0 014 4 3.5 3.5 0 01-4 4H8V6.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] italic text-muted-foreground">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-muted-foreground/70">
                    {t.name}, {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

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
