import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function isSerializationConflict(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  if ("code" in error && error.code === "P2034") return true;
  // Prisma 7's pg adapter can expose a commit-time PostgreSQL 40001 directly,
  // before Prisma wraps it as P2034 (verified in the installed adapter source).
  if (!(error instanceof Error) || error.name !== "DriverAdapterError" || !("cause" in error)) return false;
  const cause = error.cause;
  return typeof cause === "object" && cause !== null && "kind" in cause && cause.kind === "TransactionWriteConflict";
}

/** Re-decide from fresh balances after a serialization conflict. No external effects here. */
export async function withFinancialTransaction<T>(operation: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await prisma.$transaction(operation, { isolationLevel: "Serializable" });
    } catch (error) {
      if (attempt >= 8 || !isSerializationConflict(error)) throw error;
      // Immediate retries can repeatedly collide under load, even across leases
      // sharing PostgreSQL predicate locks. Bound the delay and retry count.
      await new Promise(resolve => setTimeout(resolve, Math.min(10 * 2 ** (attempt - 1), 250)));
    }
  }
}
