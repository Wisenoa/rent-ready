import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-md">
        R
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">RentReady</h1>
        <p className="text-muted-foreground max-w-sm">
          La gestion locative intelligente pour les propriétaires bailleurs indépendants.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Se connecter
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Essai gratuit — 14 jours
        </Link>
      </div>
    </div>
  );
}
