/**
 * Object Storage utilities using MinIO / S3-compatible storage.
 * Used for storing generated PDFs (quittances, reports).
 *
 * Configuration is REQUIRED. This used to return a `minio://placeholder/...` URL
 * when storage was unconfigured, so a receipt generation request answered
 * HTTP 200 with a "receiptUrl" that could never be downloaded and no Document row
 * was ever written — the UI reported success for a document that did not exist.
 * `isStorageConfigured()` lets callers decide; `uploadBuffer()` throws rather
 * than lying.
 */

export interface UploadResult {
  url: string;
  bucket: string;
  objectName: string;
}

/** True when object storage is configured. Callers may degrade gracefully. */
export /**
 * Storage credentials, read once.
 *
 * process.env values are `string | undefined`, so every `new Client({ endPoint:
 * process.env.MINIO_ENDPOINT })` was a type error even though each caller is
 * guarded by isStorageConfigured() first. Reading them through this helper makes
 * the guard's guarantee visible to the compiler instead of relying on it.
 */
function storageEnv(): {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
} | null {
  const endPoint = process.env.MINIO_ENDPOINT;
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;
  if (!endPoint || !accessKey || !secretKey) return null;
  return {
    endPoint,
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey,
    secretKey,
  };
}

export function isStorageConfigured(): boolean {
  return storageEnv() !== null;
}

/**
 * Raised when a document cannot be persisted. Callers must surface this as a
 * failure — never treat a missing document as a successful upload.
 */
export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Object storage is not configured (MINIO_ENDPOINT, MINIO_ACCESS_KEY, " +
        "MINIO_SECRET_KEY). The document was NOT saved."
    );
    this.name = "StorageNotConfiguredError";
  }
}

/**
 * Upload a Buffer to MinIO/S3 and return its URL.
 *
 * @throws {StorageNotConfiguredError} when storage is not configured. A caller
 * that must still produce a document should catch it and persist the bytes
 * elsewhere (e.g. a Document row); it must not report success without a file.
 */
export async function uploadBuffer(
  buffer: Buffer,
  objectName: string,
  contentType: string = "application/pdf"
): Promise<UploadResult> {
  if (!isStorageConfigured()) {
    throw new StorageNotConfiguredError();
  }

  const { Client } = await import("minio");
  const env = storageEnv();
  if (!env) throw new StorageNotConfiguredError();
  const client = new Client({
    endPoint: env.endPoint,
    port: env.port,
    useSSL: env.useSSL,
    accessKey: env.accessKey,
    secretKey: env.secretKey,
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
  if (!isStorageConfigured()) {
    return;
  }

  const { Client } = await import("minio");
  const env = storageEnv();
  if (!env) throw new StorageNotConfiguredError();
  const client = new Client({
    endPoint: env.endPoint,
    port: env.port,
    useSSL: env.useSSL,
    accessKey: env.accessKey,
    secretKey: env.secretKey,
  });

  const bucket = process.env.MINIO_BUCKET || "rent-ready-docs";
  await client.removeObject(bucket, objectName);
}
