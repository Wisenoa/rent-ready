import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_MINIO_BUCKET } from "@/lib/storage";

describe("MinIO Storage Bucket Fallback Invariants (STORAGE-01)", () => {
  it("enforces canonical historical default bucket value 'rent-ready-docs'", () => {
    expect(DEFAULT_MINIO_BUCKET).toBe("rent-ready-docs");
  });

  it("ensures src/app/api/health/route.ts uses DEFAULT_MINIO_BUCKET from @/lib/storage", () => {
    const healthRoutePath = join(process.cwd(), "src/app/api/health/route.ts");
    const content = readFileSync(healthRoutePath, "utf8");

    // Must import the shared constant
    expect(content).toContain("DEFAULT_MINIO_BUCKET");
    expect(content).toContain("from '@/lib/storage'");

    // Must use it as the fallback
    expect(content).toContain("process.env.MINIO_BUCKET || DEFAULT_MINIO_BUCKET");

    // Must never contain hardcoded diverging bucket fallbacks
    expect(content).not.toContain("|| 'lokna-docs'");
    expect(content).not.toContain('|| "lokna-docs"');
  });

  it("ensures src/lib/storage.ts uses DEFAULT_MINIO_BUCKET consistently across all operations", () => {
    const storagePath = join(process.cwd(), "src/lib/storage.ts");
    const content = readFileSync(storagePath, "utf8");

    expect(content).toContain("export const DEFAULT_MINIO_BUCKET = \"rent-ready-docs\";");

    // All usages must fall back to DEFAULT_MINIO_BUCKET
    const bucketUsages = content.match(/process\.env\.MINIO_BUCKET \|\| [a-zA-Z0-9_]+/g);
    expect(bucketUsages).not.toBeNull();
    expect(bucketUsages!.length).toBeGreaterThanOrEqual(2);
    for (const usage of bucketUsages!) {
      expect(usage).toBe("process.env.MINIO_BUCKET || DEFAULT_MINIO_BUCKET");
    }
  });

  it("ensures health route treats not_configured status as non-failing", () => {
    const healthRoutePath = join(process.cwd(), "src/app/api/health/route.ts");
    const content = readFileSync(healthRoutePath, "utf8");

    expect(content).toContain("c.status === 'healthy' || c.status === 'not_configured'");
  });
});
