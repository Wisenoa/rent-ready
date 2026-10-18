import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const input = z.object({ email: z.string().trim().toLowerCase().pipe(z.email().max(254)) }).safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
  const limit = await rateLimit(`password-reset:${getClientIp(request.headers)}`, { limit: 5, window: 900 });
  if (!limit.success) return NextResponse.json({ error: "Trop de demandes. Réessayez dans quelques minutes." }, { status: 429 });
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "L’envoi des liens est momentanément indisponible. Réessayez plus tard." }, { status: 503 });
  try {
    // Better Auth owns the expiring, single-use token; never fabricate a callback URL.
    await auth.api.requestPasswordReset({
      headers: request.headers,
      body: { email: input.data.email, redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password` },
    });
    return NextResponse.json({ success: true, message: "Si un compte correspond à cette adresse, un lien de réinitialisation vous sera envoyé." });
  } catch {
    console.error("[password-reset] request failed");
    return NextResponse.json({ error: "La demande n’a pas abouti. Réessayez plus tard." }, { status: 503 });
  }
}
