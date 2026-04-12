import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { tenantSchema } from "@/lib/validations/tenant";

// ============================================================
// GET /api/tenants — List all tenants
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const skip = (page - 1) * limit;

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where: { userId: session.user.id },
        include: {
          _count: { select: { leases: true } },
          leases: {
            where: { status: "ACTIVE" },
            select: { id: true, propertyId: true, rentAmount: true },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.tenant.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      data: tenants,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/tenants error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// POST /api/tenants — Create a new tenant
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = tenantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.create({
      data: {
        userId: session.user.id,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2 || null,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
        placeOfBirth: parsed.data.placeOfBirth || null,
        emergencyName: parsed.data.emergencyName || null,
        emergencyPhone: parsed.data.emergencyPhone || null,
      },
    });

    return NextResponse.json({ data: tenant }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tenants error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
