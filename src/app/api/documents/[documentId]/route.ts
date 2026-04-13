import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/documents/[documentId]
 * Returns document metadata and a presigned download URL.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await context.params;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Ensure the document belongs to the authenticated user
    if (document.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let downloadUrl: string | null = null;

    // Generate a presigned URL if MinIO/S3 is configured
    if (
      document.fileUrl.startsWith("minio://") ||
      document.fileUrl.startsWith("https://") ||
      document.fileUrl.startsWith("http://")
    ) {
      if (
        process.env.MINIO_ENDPOINT &&
        process.env.MINIO_ACCESS_KEY &&
        process.env.MINIO_SECRET_KEY
      ) {
        try {
          const { Client } = await import("minio");
          const minio = new Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: parseInt(process.env.MINIO_PORT || "9000", 10),
            useSSL: process.env.MINIO_USE_SSL === "true",
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
          });

          // Extract bucket and object name from URL
          // Expected format: minio://bucket/object-name or https://endpoint/bucket/object-name
          let bucket = "";
          let objectName = "";
          if (document.fileUrl.startsWith("minio://")) {
            const parts = document.fileUrl.replace("minio://", "").split("/");
            bucket = parts[0];
            objectName = parts.slice(1).join("/");
          } else {
            // Try to parse as full URL
            const urlObj = new URL(document.fileUrl);
            const pathParts = urlObj.pathname.split("/").filter(Boolean);
            if (pathParts.length >= 2) {
              bucket = pathParts[0];
              objectName = pathParts.slice(1).join("/");
            }
          }

          if (bucket && objectName) {
            downloadUrl = await minio.presignedGetObject(
              bucket,
              objectName,
              60 * 15 // 15 minutes expiry
            );
          }
        } catch (err) {
          console.error("[document] presigned URL error:", err);
          // Non-fatal — return metadata without download URL
        }
      }
    }

    return NextResponse.json({
      data: {
        id: document.id,
        type: document.type,
        fileName: document.fileName,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        downloadUrl,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error("GET /api/documents/[documentId] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

/**
 * DELETE /api/documents/[documentId]
 * Delete a document.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await context.params;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (document.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.document.delete({ where: { id: documentId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/documents/[documentId] error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
