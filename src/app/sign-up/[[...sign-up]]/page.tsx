import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
};

export default function SignUpPage() {
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
            Créer un compte RentReady
          </h1>
          <p className="text-sm text-muted-foreground">
            14 jours d&apos;essai gratuit, sans engagement
          </p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
