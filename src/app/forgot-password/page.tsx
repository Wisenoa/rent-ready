import { Suspense } from "react";
import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/password-reset-form";
export const metadata: Metadata = { title: "Mot de passe oublié — Lokna", robots: { index: false, follow: false } };
export default function ForgotPasswordPage() {
  return <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4"><h1 className="text-2xl font-semibold">Mot de passe oublié</h1><p className="text-sm text-muted-foreground">Demandez un lien pour choisir un nouveau mot de passe.</p><Suspense><PasswordResetForm mode="request" /></Suspense></main>;
}
