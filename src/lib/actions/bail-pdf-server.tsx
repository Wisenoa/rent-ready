/**
 * Server-side bail PDF generation.
 * Called from createLease server action after the lease record is created.
 */
import { prisma } from "@/lib/prisma";
import { uploadBuffer } from "@/lib/storage";
import type { BailData } from "@/lib/bail-pdf-generator";

export async function generateAndUploadBailPdf(
  leaseId: string,
  userId: string,
  propertyId: string,
  tenantId: string,
  data: {
    rentAmount: number;
    chargesAmount: number;
    depositAmount: number;
    startDate: Date;
    endDate: Date | null;
    paymentDay: number;
    paymentMethod: string;
    leaseType: string;
    irlReferenceQuarter: string | null;
    irlReferenceValue: number | null;
  }
): Promise<string | null> {
  try {
    // Fetch full context needed for the PDF
    const [user, property, tenant] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.property.findUnique({ where: { id: propertyId } }),
      prisma.tenant.findUnique({ where: { id: tenantId } }),
    ]);

    if (!user || !property || !tenant) return null;

    const bailData: BailData = {
      landlord: {
        firstName: user.firstName,
        lastName: user.lastName,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2 ?? undefined,
        city: user.city,
        postalCode: user.postalCode,
      },
      tenant: {
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        addressLine1: tenant.addressLine1,
        addressLine2: tenant.addressLine2 ?? undefined,
        city: tenant.city,
        postalCode: tenant.postalCode,
      },
      property: {
        name: property.name,
        addressLine1: property.addressLine1,
        addressLine2: property.addressLine2 ?? undefined,
        city: property.city,
        postalCode: property.postalCode,
        surface: property.surface ?? undefined,
        type: property.type ?? undefined,
      },
      leaseType: data.leaseType as BailData["leaseType"],
      startDate: data.startDate,
      endDate: data.endDate,
      rentAmount: data.rentAmount,
      chargesAmount: data.chargesAmount,
      depositAmount: data.depositAmount,
      paymentDay: data.paymentDay,
      paymentMethod: data.paymentMethod,
      irlReferenceQuarter: data.irlReferenceQuarter,
      irlReferenceValue: data.irlReferenceValue,
      leaseId,
      generatedAt: new Date(),
    };

    // Dynamically import @react-pdf/renderer (server-safe)
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { BailPDF } = await import("@/lib/bail-pdf-generator");

    const pdfBuffer = await renderToBuffer(<BailPDF data={bailData} />);

    const objectName = `leases/${userId}/${leaseId}/bail.pdf`;
    const result = await uploadBuffer(
      Buffer.from(pdfBuffer),
      objectName,
      "application/pdf"
    );

    return result.url;
  } catch (err) {
    // PDF generation is best-effort — don't fail lease creation
    console.error("generateAndUploadBailPdf error:", err);
    return null;
  }
}
