import { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Inscription",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
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
      </div>
    </div>
  );
}
