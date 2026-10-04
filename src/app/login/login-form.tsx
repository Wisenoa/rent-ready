"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  /**
   * Held in state, not only raised as a toast.
   *
   * Measured on the running app: the error toast was gone 4 seconds after the
   * click. Someone who mistypes a password, looks away and comes back finds a
   * form that appears to have done nothing, with no explanation anywhere. The
   * toast is kept for immediacy; this is what remains.
   */
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginValues) {
    setIsLoading(true);
    setFormError(null);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        const message = authErrorMessage(result.error);
        setFormError(message);
        toast.error(message);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      const message = authErrorMessage(error);
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm space-y-5">
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
              placeholder="••••••••"
              className="pl-10"
              autoComplete="current-password"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {formError && (
          // role="alert" so a screen reader announces it; it sits inside the form
          // so it is read in the same context as the fields it is about, and it
          // stays until the next attempt rather than expiring.
          <p
            role="alert"
            data-testid="login-error"
            className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {formError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Connexion en cours…
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </div>
    </form>
  );
}
