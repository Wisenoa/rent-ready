"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { registerWithStripeCustomer } from "@/lib/actions/register-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterValues) {
    setIsLoading(true);
    try {
      // Split name into firstName and lastName
      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0] ?? "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const registerResult = await registerWithStripeCustomer({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
      });

      if (!registerResult.success) {
        toast.error(registerResult.error ?? "Erreur lors de l'inscription");
        return;
      }

      const signInResult = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (signInResult.error) {
        toast.error("Compte créé mais connexion automatique impossible. Veuillez vous connecter.");
        router.push("/login");
        return;
      }

      toast.success("Compte créé avec succès !");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    try {
      const { signIn } = await import("@/lib/auth-client");
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      toast.error("Erreur lors de la connexion avec Google");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="relative flex w-full items-center justify-center gap-3 rounded-2xl border border-border/60 bg-card py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted/60 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuer avec Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">ou avec email</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nom complet
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Jean Dupont"
              className="pl-10"
              autoComplete="name"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
          <p className="text-[11px] text-muted-foreground">
            Prénom et nom seront affichés sur vos documents
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Adresse email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.fr"
              className="pl-10"
              autoComplete="email"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="8 caractères minimum"
              className="pl-10"
              autoComplete="new-password"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Création du compte…
            </>
          ) : (
            <>
              Créer mon compte
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </div>

      {/* Trust micro-badges */}
      <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap">
        {[
          "Sans carte bancaire",
          "14 jours gratuits",
          "Annulation libre",
        ].map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
          >
            <svg className="size-3 text-emerald-500 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6l2.5 2.5L10 3.5" />
            </svg>
            {label}
          </span>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        En créant un compte, vous acceptez nos{" "}
        <a href="/cgu" className="underline underline-offset-2 hover:text-foreground">
          conditions d&apos;utilisation
        </a>{" "}
        et notre{" "}
        <a href="/politique-confidentialite" className="underline underline-offset-2 hover:text-foreground">
          politique de confidentialité
        </a>.
      </p>
    </form>
  );
}
