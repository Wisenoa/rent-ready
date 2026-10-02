import { z } from "zod";

const paymentMethodSchema = z
  .enum(["TRANSFER", "CHECK", "CASH", "DIRECT_DEBIT", "OTHER"])
  .nullable()
  .optional();

export const transactionSchema = z.object({
  leaseId: z.string().min(1, "Le bail est requis"),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  periodStart: z.string().min(1, "La période de début est requise"),
  periodEnd: z.string().min(1, "La période de fin est requise"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  paidAt: z.string().optional().or(z.literal("")),
  // Optional. When the dialog let the landlord pick a materialised rent period
  // instead of typing dates, it sends the row it picked. Resolved and re-checked
  // against the lease server-side: a client-supplied id is never trusted on its
  // own. Absent, the period is resolved from the dates as before.
  duePeriodId: z.string().optional().or(z.literal("")),
  paymentMethod: z.enum(["TRANSFER", "CHECK", "CASH", "DIRECT_DEBIT", "OTHER"]).optional(),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

/**
 * Annotation-only update schema, shared by the two PATCH routes.
 *
 * Amount, status, paidAt and the receipt / bank fields are deliberately absent:
 * they carry money or settlement state, which is derived from what was received
 * (AGENTS.md 11) and written only through the payment door.
 */
export const paymentAnnotationSchema = z
  .object({
    notes: z.string().max(1000).nullable().optional(),
    paymentMethod: paymentMethodSchema,
  })
  .strict();

/** Fields that carry money or settlement state — never client-writable. */
export const FINANCIAL_TRANSACTION_FIELDS = [
  "amount",
  "rentPortion",
  "chargesPortion",
  "status",
  "paidAt",
  "isFullPayment",
  "receiptType",
  "receiptUrl",
  "receiptNumber",
  "bankTransactionId",
  "bankMatchedAt",
  "bankRawData",
] as const;

export type TransactionFormValues = z.infer<typeof transactionSchema>;
