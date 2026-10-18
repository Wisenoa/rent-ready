import { Suspense } from "react";
import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/password-reset-form";
export const metadata: Metadata = { title: "Nouveau mot de passe — Lokna", robots: { index: false, follow: false } };
export default function ResetPasswordPage() {
  return <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4"><h1 className="text-2xl font-semibold">Choisir un nouveau mot de passe</h1><Suspense><PasswordResetForm mode="reset" /></Suspense></main>;
}
