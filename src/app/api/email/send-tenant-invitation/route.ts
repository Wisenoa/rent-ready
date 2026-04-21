import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { emailService } from "@/lib/email/service";
import { z, ZodError } from "zod";

const RequestBodySchema = z.object({
  tenantId: z.string().min(1, "tenantId is required"),
  portalUrl: z.string().url("portalUrl must be a valid URL").min(1),
});

/**
 * POST /api/email/send-tenant-invitation
 *
 * Sends a tenant portal invitation email.
 *
 * Requires authentication (landlord / property manager).
 */
export async function POST(request: Request) {
  try {
    const session = await auth.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tenantId, portalUrl } = RequestBodySchema.parse(body);

    const user = await (await import("@/lib/prisma")).prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true },
    });

    if (!user?.firstName) {
      return NextResponse.json(
        { error: "User not found or missing firstName" },
        { status: 404 }
      );
    }

    // Optional: look up property address for context
    const tenant = await (await import("@/lib/prisma")).prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        leases: {
          where: { userId: session.user.id },
          take: 1,
          select: {
            property: {
              select: {
                addressLine1: true,
                city: true,
                postalCode: true,
              },
            },
          },
        },
      },
    });

    const propertyAddress = tenant?.leases?.[0]?.property
      ? `${tenant.leases[0].property.addressLine1}, ${tenant.leases[0].property.postalCode} ${tenant.leases[0].property.city}`
      : undefined;

    await emailService.sendTenantInvitationEmail(
      tenantId,
      portalUrl,
      user.firstName,
      user.lastName ?? "",
      propertyAddress
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[send-tenant-invitation] Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send tenant invitation email" },
      { status: 500 }
    );
  }
}
