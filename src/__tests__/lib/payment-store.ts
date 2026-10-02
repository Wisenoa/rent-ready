/**
 * An in-memory stand-in for the slice of Prisma the payment door uses.
 *
 * The door's whole job is arithmetic over rows plus a few write guards
 * (`updateMany` matching `paidAt: null`, ownership inside every query). Mocking
 * each call with a hand-written return value cannot express "the month's receipts
 * now sum to what was owed", so these tests run against a tiny store that applies
 * the same `where` clauses Prisma would.
 *
 * Money is held as decimal strings, the way Prisma hands a Decimal back into the
 * application.
 */

import Decimal from "decimal.js";
import { vi } from "vitest";

export interface StoredRow {
  id: string;
  userId: string;
  leaseId: string;
  amount: string;
  rentPortion: string;
  chargesPortion: string;
  /**
   * Rent and charges owed for the period, frozen when the payment was recorded.
   * Null on rows that predate the freeze, which is exactly the case the fallback
   * in `generateQuittance` exists for.
   */
  receiptRentAmount: string | null;
  receiptChargesAmount: string | null;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  paidAt: Date | null;
  status: string;
  isFullPayment: boolean;
  receiptType: string | null;
  receiptUrl: string | null;
  receiptNumber: string | null;
  notes: string | null;
  createdAt: Date;
}

/**
 * An archived receipt. `bytes` stands in for the inline `Document.content`, so a
 * test can assert that what the download route serves is the stored document
 * rather than a fresh rendering.
 */
export interface StoredDocument {
  id: string;
  userId: string;
  transactionId: string | null;
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
}

export interface Store {
  rows: StoredRow[];
  /** Generated receipt documents, keyed by the payment they attest. */
  documents: StoredDocument[];
  leases: Array<{
    id: string;
    userId: string;
    rentAmount: string;
    chargesAmount: string;
    property?: Record<string, unknown> | null;
    tenant?: Record<string, unknown> | null;
  }>;
  /** The landlord row `generateQuittance` prints in the bailleur block. */
  landlord: Record<string, unknown> | null;
  prisma: unknown;
}

type Where = Record<string, unknown>;

function sameInstant(a: Date | null, b: Date | null): boolean {
  if (a === null || b === null) return a === b;
  return a.getTime() === b.getTime();
}

function matchesStatus(value: string, filter: unknown): boolean {
  if (filter === undefined) return true;
  if (typeof filter === "string") return value === filter;
  if (filter && typeof filter === "object") {
    const f = filter as { in?: string[]; not?: string };
    if (f.in && !f.in.includes(value)) return false;
    if (f.not !== undefined && value === f.not) return false;
  }
  return true;
}

function matchesEntries(row: StoredRow, where: Where): boolean {
  for (const [key, filter] of Object.entries(where)) {
    switch (key) {
      case "id":
        // Equality, or the `not` / `in` filters. Prisma's `id: { not: x }`
        // EXCLUDES x, and `cancelRentPayment` uses it to list a month's other
        // receipts: treating the object as a plain equality made every row miss,
        // so the sibling sum came back empty and the sibling logic was dead code
        // that the tests still passed on.
        if (filter !== null && typeof filter === "object") {
          const f = filter as { not?: string; in?: string[] };
          if (f.not !== undefined && row.id === f.not) return false;
          if (f.in && !f.in.includes(row.id)) return false;
          break;
        }
        if (row.id !== filter) return false;
        break;
      case "userId":
        if (row.userId !== filter) return false;
        break;
      case "leaseId":
        if (row.leaseId !== filter) return false;
        break;
      case "status":
        if (!matchesStatus(row.status, filter)) return false;
        break;
      case "paidAt": {
        const f = filter as null | Date | { not?: null; lt?: Date; lte?: Date; gte?: Date };
        if (f === null) {
          if (row.paidAt !== null) return false;
        } else if (f instanceof Date) {
          if (!sameInstant(row.paidAt, f)) return false;
        } else if (f) {
          if (f.not === null && row.paidAt === null) return false;
          if (f.lt !== undefined && (row.paidAt === null || row.paidAt >= f.lt)) return false;
          if (f.lte !== undefined && (row.paidAt === null || row.paidAt > f.lte)) return false;
          if (f.gte !== undefined && (row.paidAt === null || row.paidAt < f.gte)) return false;
        }
        break;
      }
      case "createdAt": {
        const f = filter as Date | { lt?: Date };
        if (f instanceof Date) {
          if (!sameInstant(row.createdAt, f)) return false;
        } else if (f?.lt !== undefined && row.createdAt >= f.lt) {
          return false;
        }
        break;
      }
      case "periodStart": {
        if (!sameInstant(row.periodStart, filter as Date)) return false;
        break;
      }
      case "periodEnd": {
        if (!sameInstant(row.periodEnd, filter as Date)) return false;
        break;
      }
      case "amount": {
        // Equality is a compare-and-set guard (`settleRentPeriod` writes
        // `where: { amount: <the balance it read> }`); `gt` filters candidates.
        if (filter && typeof filter === "object" && "gt" in filter) {
          const bound = (filter as { gt?: number }).gt;
          if (bound !== undefined && !new Decimal(row.amount).gt(bound)) return false;
          break;
        }
        if (!new Decimal(row.amount).eq(new Decimal(filter as Decimal.Value))) return false;
        break;
      }
      default:
        break;
    }
  }
  return true;
}

/**
 * Prisma's `where`: the listed keys must all match, and an `OR` list matches when
 * at least one of its branches matches.
 *
 * `generateQuittance` sums a month's earlier receipts with exactly this shape —
 * `OR: [{ paidAt: { lt } }, { paidAt, createdAt: { lt } }]` — to order two
 * same-day instalments. A harness that ignored `OR` would silently treat every
 * earlier payment as "prior" (or as nothing), which is how a cancelled receipt
 * came to be counted as money received before a partial one.
 */
function matches(row: StoredRow, where: Where): boolean {
  const { OR: branches, ...rest } = where;
  if (!matchesEntries(row, rest)) return false;
  if (!Array.isArray(branches)) return true;
  return branches.some((branch) => matchesEntries(row, branch as Where));
}

function project(
  row: StoredRow,
  select?: Record<string, boolean>,
  leases: Store["leases"] = []
): Partial<StoredRow> {
  if (!select) return { ...row };
  const out: Record<string, unknown> = {};
  for (const [key, wanted] of Object.entries(select)) {
    if (!wanted) continue;
    // `lease` is the one nested relation the door selects: it needs the rent and
    // charges to re-derive the month's obligation when a receipt is cancelled.
    if (key === "lease") {
      out.lease = leases.find((l) => l.id === row.leaseId) ?? null;
      continue;
    }
    out[key] = row[key as keyof StoredRow];
  }
  return out as Partial<StoredRow>;
}

/**
 * Build a store seeded with the given rows and leases, plus the `prisma` object
 * to hand to `vi.mock("@/lib/prisma")`.
 *
 * `prisma.$transaction(fn)` runs `fn` against the same store, which is the point:
 * the door writes the payment and closes the period in one transaction, and the
 * tests must see both.
 */
export function createStore(options: {
  leases?: Store["leases"];
  rows?: StoredRow[];
  documents?: StoredDocument[];
  landlord?: Record<string, unknown> | null;
}): Store {
  const store: Store = {
    rows: [...(options.rows ?? [])],
    documents: [...(options.documents ?? [])],
    leases: [...(options.leases ?? [])],
    landlord: options.landlord ?? null,
    prisma: undefined,
  };

  let sequence = store.rows.length;
  let documentSequence = store.documents.length;

  const transaction = {
    findFirst: vi.fn(
      async ({ where, select, include }: { where: Where; select?: Record<string, boolean>; include?: Record<string, boolean> }) => {
        const row = store.rows.find((r) => matches(r, where));
        if (!row) return null;
        // `generateQuittance`'s lost-race handler re-reads with
        // `include: { receiptDocument: true }`, so the relation has to be there —
        // returning the bare row there made the handler miss the winner's
        // document and report a failure for a receipt that did exist.
        if (include?.receiptDocument) {
          return {
            ...row,
            receiptDocument:
              store.documents.find((d) => d.transactionId === row.id) ?? null,
          };
        }
        return project(row, select, store.leases);
      }
    ),
    findMany: vi.fn(async ({ where, select }: { where: Where; select?: Record<string, boolean> }) =>
      store.rows
        .filter((r) => matches(r, where))
        .map((r) => project(r, select, store.leases))
    ),
    findUnique: vi.fn(async ({ where }: { where: { id: string } }) => {
      const row = store.rows.find((r) => r.id === where.id);
      if (!row) return null;
      const lease = store.leases.find((l) => l.id === row.leaseId);
      const relations: Record<string, unknown> = {
        lease: lease
          ? {
              ...lease,
              property: lease.property ?? null,
              tenant: lease.tenant ?? null,
            }
          : null,
        user: store.landlord ?? null,
        // The one receipt generated for this payment, if any. `generateQuittance`
        // reads it to answer an already-receipted payment with the existing
        // document instead of minting a second one.
        receiptDocument:
          store.documents.find((d) => d.transactionId === row.id) ?? null,
      };
      // `generateQuittance` reads the transaction with its lease (property and
      // tenant included) and the landlord, then writes the receipt back on the row.
      return { ...row, ...relations };
    }),
    aggregate: vi.fn(
      async ({ where, _sum }: { where: Where; _sum?: { amount?: boolean } }) => {
        const rows = store.rows.filter((r) => matches(r, where));
        if (!_sum?.amount) return { _sum: {}, _count: rows.length };
        const total = rows.reduce(
          (sum, r) => sum.plus(new Decimal(r.amount)),
          new Decimal(0)
        );
        return { _sum: { amount: rows.length ? total : null }, _count: rows.length };
      }
    ),
    create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
      sequence += 1;
      const row: StoredRow = {
        id: `tx-${sequence}`,
        userId: data.userId as string,
        leaseId: data.leaseId as string,
        amount: new Decimal(data.amount as number).toFixed(2),
        rentPortion: new Decimal(data.rentPortion as number).toFixed(2),
        chargesPortion: new Decimal(data.chargesPortion as number).toFixed(2),
        // Frozen when the payment is recorded. A row that does not carry them is
        // a row written before the freeze existed.
        receiptRentAmount:
          data.receiptRentAmount === undefined || data.receiptRentAmount === null
            ? null
            : new Decimal(data.receiptRentAmount as number).toFixed(2),
        receiptChargesAmount:
          data.receiptChargesAmount === undefined ||
          data.receiptChargesAmount === null
            ? null
            : new Decimal(data.receiptChargesAmount as number).toFixed(2),
        periodStart: data.periodStart as Date,
        periodEnd: data.periodEnd as Date,
        dueDate: data.dueDate as Date,
        paidAt: (data.paidAt as Date) ?? null,
        status: data.status as string,
        isFullPayment: Boolean(data.isFullPayment),
        receiptType: (data.receiptType as string) ?? null,
        receiptUrl: (data.receiptUrl as string) ?? null,
        receiptNumber: (data.receiptNumber as string) ?? null,
        notes: (data.notes as string) ?? null,
        createdAt: new Date(),
      };
      store.rows.push(row);
      return { ...row };
    }),
    update: vi.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const row = store.rows.find((r) => r.id === where.id);
      if (!row) throw new Error(`unknown row ${where.id}`);
      applyUpdate(row, data);
      return { ...row };
    }),
    updateMany: vi.fn(
      async ({ where, data }: { where: Where; data: Record<string, unknown> }) => {
        const matching = store.rows.filter((r) => matches(r, where));
        for (const row of matching) applyUpdate(row, data);
        return { count: matching.length };
      }
    ),
  };

  const prisma = {
    transaction,
    document: {
      findFirst: vi.fn(async ({ where }: { where: Where }) => {
        // Every read is scoped by userId in the callers, so a foreign document is
        // simply absent. `transactionId` selects the one receipt for a payment.
        const found = store.documents.find(
          (d) =>
            (where.id === undefined || d.id === where.id) &&
            (where.userId === undefined || d.userId === where.userId) &&
            (where.transactionId === undefined ||
              d.transactionId === where.transactionId)
        );
        return found ? { ...found, content: found.bytes } : null;
      }),
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        // UNIQUE ("transactionId"), as in the schema. This is what makes two
        // concurrent generations produce one document: the loser cannot persist.
        const transactionId = (data.transactionId as string | null) ?? null;
        if (
          transactionId !== null &&
          store.documents.some((d) => d.transactionId === transactionId)
        ) {
          const error = new Error("Unique constraint failed") as Error & {
            code: string;
          };
          error.code = "P2002";
          throw error;
        }
        documentSequence += 1;
        const doc: StoredDocument = {
          id: `doc-${documentSequence}`,
          userId: data.userId as string,
          transactionId,
          fileName: data.fileName as string,
          mimeType: data.mimeType as string,
          bytes:
            (data.content as Uint8Array | null | undefined) ??
            new Uint8Array([0x25, 0x50, 0x44, 0x46]),
        };
        store.documents.push(doc);
        return { id: doc.id };
      }),
    },
    lease: {
      findFirst: vi.fn(async ({ where, select }: { where: Where; select?: Record<string, boolean> }) => {
        const lease = store.leases.find((l) => l.id === where.id && l.userId === where.userId);
        if (!lease) return null;
        if (!select) return { ...lease };
        const out: Record<string, unknown> = {};
        for (const [key, wanted] of Object.entries(select)) {
          if (wanted) out[key] = lease[key as keyof typeof lease];
        }
        return out;
      }),
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => {
        const lease = store.leases.find((l) => l.id === where.id);
        return lease ? { ...lease } : null;
      }),
    },
    $transaction: vi.fn(async (fn: (tx: unknown) => Promise<unknown>) => fn(prisma)),
  };

  store.prisma = prisma;
  return store;
}

function applyUpdate(row: StoredRow, data: Record<string, unknown>): void {
  if (data.amount !== undefined) row.amount = new Decimal(data.amount as number).toFixed(2);
  if (data.rentPortion !== undefined) {
    row.rentPortion = new Decimal(data.rentPortion as number).toFixed(2);
  }
  if (data.chargesPortion !== undefined) {
    row.chargesPortion = new Decimal(data.chargesPortion as number).toFixed(2);
  }
  if (data.receiptRentAmount !== undefined) {
    row.receiptRentAmount =
      data.receiptRentAmount === null
        ? null
        : new Decimal(data.receiptRentAmount as number).toFixed(2);
  }
  if (data.receiptChargesAmount !== undefined) {
    row.receiptChargesAmount =
      data.receiptChargesAmount === null
        ? null
        : new Decimal(data.receiptChargesAmount as number).toFixed(2);
  }
  if (data.status !== undefined) row.status = data.status as string;
  if (data.paidAt !== undefined) row.paidAt = data.paidAt as Date | null;
  if (data.isFullPayment !== undefined) row.isFullPayment = Boolean(data.isFullPayment);
  if (data.receiptType !== undefined) row.receiptType = data.receiptType as string | null;
  if (data.receiptUrl !== undefined) row.receiptUrl = data.receiptUrl as string | null;
  if (data.receiptNumber !== undefined) {
    row.receiptNumber = data.receiptNumber as string | null;
  }
  if (data.notes !== undefined) row.notes = data.notes as string | null;
}

/** What a month's receipts add up to: the money actually collected. */
export function monthReceipts(store: Store, leaseId: string, periodStart: Date): Decimal {
  return store.rows
    .filter(
      (r) =>
        r.leaseId === leaseId &&
        sameInstant(r.periodStart, periodStart) &&
        r.paidAt !== null &&
        r.status !== "CANCELLED"
    )
    .reduce((sum, r) => sum.plus(new Decimal(r.amount)), new Decimal(0));
}

/** Period rows still owed for the month — none may survive a full payment. */
export function openPeriods(store: Store, leaseId: string, periodStart: Date): StoredRow[] {
  return store.rows.filter(
    (r) =>
      r.leaseId === leaseId && sameInstant(r.periodStart, periodStart) && r.paidAt === null
  );
}

/** A materialised rent period row: the obligation, unpaid. */
export function periodRow(options: {
  id?: string;
  userId?: string;
  leaseId?: string;
  amount: string;
  periodStart?: Date;
  periodEnd?: Date;
  dueDate?: Date;
}): StoredRow {
  return {
    id: options.id ?? "period-oct",
    userId: options.userId ?? "landlord-1",
    leaseId: options.leaseId ?? "lease-1",
    amount: options.amount,
    rentPortion: options.amount,
    chargesPortion: "0.00",
    // An unpaid period row has no payment yet, so nothing is frozen: the amounts
    // are written when the payment that closes it is recorded.
    receiptRentAmount: null,
    receiptChargesAmount: null,
    periodStart: options.periodStart ?? new Date("2026-10-01T00:00:00.000Z"),
    periodEnd: options.periodEnd ?? new Date("2026-10-31T00:00:00.000Z"),
    dueDate: options.dueDate ?? new Date("2026-10-03T00:00:00.000Z"),
    paidAt: null,
    status: "PENDING",
    isFullPayment: false,
    receiptType: null,
    receiptUrl: null,
    receiptNumber: null,
    notes: null,
    createdAt: new Date("2026-10-01T00:00:00.000Z"),
  };
}

/** A receipt: a payment already recorded against a period. */
export function receiptRow(options: {
  id?: string;
  userId?: string;
  leaseId?: string;
  amount: string;
  rentPortion?: string;
  chargesPortion?: string;
  /** Frozen at payment time. Omit to simulate a row predating the freeze. */
  receiptRentAmount?: string | null;
  receiptChargesAmount?: string | null;
  periodStart?: Date;
  periodEnd?: Date;
  paidAt?: Date;
  createdAt?: Date;
  status?: string;
}): StoredRow {
  const createdAt = options.createdAt ?? new Date("2026-10-05T00:00:00.000Z");
  return {
    id: options.id ?? "receipt-1",
    userId: options.userId ?? "landlord-1",
    leaseId: options.leaseId ?? "lease-1",
    amount: options.amount,
    rentPortion: options.rentPortion ?? options.amount,
    chargesPortion: options.chargesPortion ?? "0.00",
    receiptRentAmount: options.receiptRentAmount ?? null,
    receiptChargesAmount: options.receiptChargesAmount ?? null,
    periodStart: options.periodStart ?? new Date("2026-10-01T00:00:00.000Z"),
    periodEnd: options.periodEnd ?? new Date("2026-10-31T00:00:00.000Z"),
    dueDate: new Date("2026-10-03T00:00:00.000Z"),
    paidAt: options.paidAt ?? createdAt,
    status: options.status ?? "PAID",
    isFullPayment: true,
    receiptType: null,
    receiptUrl: null,
    receiptNumber: null,
    notes: null,
    createdAt,
  };
}

/** A lease with the given rent and charges, owned by `userId`. */
export function lease(
  id: string,
  userId: string,
  rentAmount: string,
  chargesAmount: string
): Store["leases"][number] {
  return { id, userId, rentAmount, chargesAmount };
}