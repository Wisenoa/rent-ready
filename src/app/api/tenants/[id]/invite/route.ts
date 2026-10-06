import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { generatePortalLink, sendTenantInvitation } from "@/lib/actions/portal-actions";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================================
// POST /api/tenants/[id]/invite
// Generate portal link and send invitation email to tenant
// ============================================================
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify tenant belongs to this landlord
    const tenant = await prisma.tenant.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Locataire introuvable." },
        { status: 404 }
      );
    }

    if (!tenant.email) {
      return NextResponse.json(
        { error: "Ce locataire n'a pas d'adresse email." },
        { status: 400 }
      );
    }

    // Generate a fresh portal link (creates new token, 7-day expiry)
    const linkResult = await generatePortalLink(id);
    if (!linkResult.success) {
      return NextResponse.json(
        { error: linkResult.error ?? "Impossible de générer le lien d'accès." },
        { status: 500 }
      );
    }

    // Send invitation email
    const emailResult = await sendTenantInvitation(id);
    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error ?? "Impossible d'envoyer l'invitation par email." },
        { status: 500 }
      );
    }

    // Return token + expiry (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      data: {
        token: linkResult.data!.token,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("POST /api/tenants/[id]/invite error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
