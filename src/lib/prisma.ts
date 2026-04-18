import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaPg({ connectionString });

  const isDev = process.env.NODE_ENV !== "production";

  return new PrismaClient({
    adapter,
    log: isDev ? ["query", "error", "warn"] : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Slow query logger — audits DB performance for public-facing (SEO) pages
// Logs to stderr; in production route to your log aggregator (Datadog, CloudWatch, etc.)
// Threshold configurable via SLOW_QUERY_THRESHOLD_MS env var (default: 100ms)
if (process.env.SLOW_QUERY_LOG === "true" || process.env.NODE_ENV !== "production") {
  prisma.$on<"query">("query", (event) => {
    const threshold = parseInt(process.env.SLOW_QUERY_THRESHOLD_MS || "100", 10);
    if (event.duration >= threshold) {
      const ts = new Date().toISOString();
      // eslint-disable-next-line no-console
      console.error(
        `[SLOW_QUERY] duration=${event.duration}ms ts=${ts} query=${event.query.substring(0, 200)}`
      );
    }
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
