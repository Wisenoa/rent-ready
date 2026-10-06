import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";

type RouteParams = { params: Promise<{ id: string }> };

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ============================================================
// POST /api/leases/[id]/document — Upload/replace lease PDF
// ============================================================
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify lease ownership
    const lease = await prisma.lease.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!lease) {
      return NextResponse.json({ error: "Bail introuvable" }, { status: 404 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez PDF ou DOCX." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Le fichier dépasse la taille maximale de 10 Mo." },
        { status: 400 }
      );
    }

    // Build storage path: leases/{leaseId}/document.{ext}
    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `leases/${id}/document.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Delete old document if exists
    if (lease.documentUrl) {
      try {
        const oldPath = lease.documentUrl.split("/").pop() ?? "";
        await deleteFile(`documents/${session.user.id}/${oldPath}`);
      } catch {
        // Best-effort delete
      }
    }

    // Upload new document
    const url = await uploadFile(
      buffer,
      `documents/${session.user.id}/${path}`,
      file.type
    );

    // Update lease with new document URL
    await prisma.lease.update({
      where: { id },
      data: { documentUrl: url },
    });

    return NextResponse.json({ documentUrl: url }, { status: 200 });
  } catch (error) {
    console.error("POST /api/leases/[id]/document error:", error);
    return NextResponse.json({ error: "Échec de l'upload du document" }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/leases/[id]/document — Remove lease document
// ============================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const lease = await prisma.lease.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!lease) {
      return NextResponse.json({ error: "Bail introuvable" }, { status: 404 });
    }

    if (!lease.documentUrl) {
      return NextResponse.json({ error: "Aucun document à supprimer" }, { status: 404 });
    }

    // Delete from storage
    try {
      const path = lease.documentUrl.split("/").pop() ?? "";
      await deleteFile(`documents/${session.user.id}/${path}`);
    } catch {
      // Best-effort
    }

    await prisma.lease.update({
      where: { id },
      data: { documentUrl: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/leases/[id]/document error:", error);
    return NextResponse.json({ error: "Échec de la suppression" }, { status: 500 });
  }
}
