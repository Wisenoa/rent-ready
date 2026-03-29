import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              R
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenue sur RentReady
          </h1>
          <p className="text-sm text-muted-foreground">
            Connectez-vous pour gérer vos biens locatifs
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
