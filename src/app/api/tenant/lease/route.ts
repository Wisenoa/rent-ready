import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/tenant/lease
 * Returns the tenant's current active lease details
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    // Support both authenticated user (owner viewing) and token-based access (tenant portal)
    let tenantId: string | null = null;
    
    if (token) {
      // Token-based access for tenant portal
      const accessToken = await prisma.tenantAccessToken.findUnique({
        where: { token },
        include: { tenant: true },
      });

      if (!accessToken) {
        return NextResponse.json(
          { error: "Invalid or expired access token" },
          { status: 401 }
        );
      }

      // Check if token is expired
      if (accessToken.expiresAt && new Date() > accessToken.expiresAt) {
        return NextResponse.json(
          { error: "Access token has expired" },
          { status: 401 }
        );
      }

      tenantId = accessToken.tenantId;
      
      // Update last used
      await prisma.tenantAccessToken.update({
        where: { id: accessToken.id },
        data: { lastUsedAt: new Date() },
      });
    } else {
      // Authenticated user access - find tenant owned by this user
      // For now, we'll return an error if no token provided
      // In a real implementation, you'd need a way to identify which tenant
      return NextResponse.json(
        { error: "Token required for tenant portal access" },
        { status: 400 }
      );
    }

    // Get current active lease for the tenant
    const lease = await prisma.lease.findFirst({
      where: {
        tenantId: tenantId!,
        status: "ACTIVE",
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            type: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            postalCode: true,
            country: true,
            surface: true,
            rooms: true,
          },
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!lease) {
      return NextResponse.json(
        { error: "No active lease found" },
        { status: 404 }
      );
    }

    // Calculate remaining days until renewal date (if applicable)
    const renewalDate = lease.revisionDate;
    const daysUntilRenewal = renewalDate
      ? Math.ceil((renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    // Format response for tenant portal
    const response = {
      id: lease.id,
      property: lease.property,
      tenant: lease.tenant,
      financials: {
        rentAmount: lease.rentAmount,
        chargesAmount: lease.chargesAmount,
        totalRent: lease.rentAmount + lease.chargesAmount,
        depositAmount: lease.depositAmount,
        paymentDay: lease.paymentDay,
        paymentMethod: lease.paymentMethod,
      },
      dates: {
        startDate: lease.startDate,
        endDate: lease.endDate,
        renewalDate: lease.revisionDate,
        daysUntilRenewal,
      },
      leaseType: lease.leaseType,
      irl: {
        referenceValue: lease.irlReferenceValue,
        referenceQuarter: lease.irlReferenceQuarter,
      },
      documentUrl: lease.documentUrl,
    };

    return NextResponse.json({ lease: response });
  } catch (error) {
    console.error("Tenant lease fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lease details" },
      { status: 500 }
    );
  }
}