import Link from "next/link";
import { SmartHeaderCta } from "@/components/smart-header-cta";

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
        <SmartHeaderCta />
      </div>
      <p className="text-xs text-muted-foreground">
        Ou découvrez notre guide :{" "}
        <Link href="/gestion-locative" className="underline underline-offset-4 hover:text-foreground">
          Gestion locative en France
        </Link>
      </p>
    </div>
  );
}
