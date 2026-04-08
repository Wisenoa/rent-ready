/**
 * Object Storage utilities using MinIO / S3-compatible storage.
 * Used for storing generated PDFs (quittances, reports).
 *
 * Supports environments without MinIO configured — uploadBuffer will
 * silently skip and return a placeholder URL.
 */

export interface UploadResult {
  url: string;
  bucket: string;
  objectName: string;
}

/**
 * Upload a Buffer to MinIO/S3 and return the public URL.
 * Silently skips if MinIO is not configured.
 */
export async function uploadBuffer(
  buffer: Buffer,
  objectName: string,
  contentType: string = "application/pdf"
): Promise<UploadResult> {
  if (
    !process.env.MINIO_ENDPOINT ||
    !process.env.MINIO_ACCESS_KEY ||
    !process.env.MINIO_SECRET_KEY
  ) {
    // MinIO not configured — return a placeholder URL
    return {
      url: `minio://placeholder/${objectName}`,
      bucket: "not-configured",
      objectName,
    };
  }

  const Minio = require("minio");
  const client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  });

  const bucket = process.env.MINIO_BUCKET || "rent-ready-docs";

  await client.putObject(bucket, objectName, buffer, buffer.length, {
    "Content-Type": contentType,
  });

  const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
  const port = process.env.MINIO_PORT || "9000";
  const endpoint = process.env.MINIO_ENDPOINT;
  const url = `${protocol}://${endpoint}:${port}/${bucket}/${objectName}`;

  return { url, bucket, objectName };
}

/**
 * Delete an object from MinIO/S3.
 */
export async function deleteObject(objectName: string): Promise<void> {
  if (
    !process.env.MINIO_ENDPOINT ||
    !process.env.MINIO_ACCESS_KEY ||
    !process.env.MINIO_SECRET_KEY
  ) {
    return;
  }

  const Minio = require("minio");
  const client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  });

  const bucket = process.env.MINIO_BUCKET || "rent-ready-docs";
  await client.removeObject(bucket, objectName);
}
