import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-8 px-4">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-md">
              R
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Bienvenue sur RentReady
          </h1>
          <p className="text-sm text-muted-foreground">
            Connectez-vous pour gérer vos biens locatifs
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Créer un compte gratuitement
          </a>
        </p>
      </div>
    </div>
  );
}
