"use client";

import { useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function PasswordResetForm({ mode }: { mode: "request" | "reset" }) {
  const token = useSearchParams().get("token");
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  return <form method="post" className="space-y-5" onSubmit={async event => {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const value = data.get("value");
    const parsed = (mode === "request" ? z.email("Adresse email invalide") : z.string().min(8, "Au moins 8 caractères sont nécessaires").max(128)).safeParse(value);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Saisie invalide"); return; }
    setPending(true); setError(null); setMessage(null);
    try {
      if (mode === "request") {
        const response = await fetch("/api/email/send-password-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: parsed.data }) });
        const payload = z.object({ error: z.string().optional(), message: z.string().optional() }).parse(await response.json());
        if (!response.ok) { setError(payload.error ?? "La demande n’a pas abouti."); return; }
        setMessage(payload.message ?? "Si un compte existe, un lien vous sera envoyé.");
      } else {
        if (!token) { setError("Lien invalide. Demandez un nouveau lien."); return; }
        const result = await authClient.resetPassword({ newPassword: parsed.data, token });
        if (result.error) { setError("Ce lien est invalide ou expiré. Demandez un nouveau lien."); return; }
        setMessage("Mot de passe modifié. Vous pouvez vous connecter.");
      }
      setDone(true);
    } catch { setError("Le service est indisponible. Réessayez plus tard."); }
    finally { setPending(false); }
  }}>
    {!done && <>
      <Label htmlFor="reset-value">{mode === "request" ? "Adresse email" : "Nouveau mot de passe"}</Label>
      <Input id="reset-value" name="value" type={mode === "request" ? "email" : "password"} autoComplete={mode === "request" ? "email" : "new-password"} required minLength={mode === "reset" ? 8 : undefined} maxLength={mode === "reset" ? 128 : 254} />
      <Button className="w-full" type="submit" disabled={pending || !hydrated}>{pending ? "Traitement…" : mode === "request" ? "Demander un lien" : "Enregistrer le mot de passe"}</Button>
    </>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {message && <p role="status" className="text-sm">{message}</p>}
    <div className="flex flex-wrap gap-4 text-sm"><Link href="/login" className="underline">Se connecter</Link>{mode === "reset" && <Link href="/forgot-password" className="underline">Demander un nouveau lien</Link>}</div>
  </form>;
}
