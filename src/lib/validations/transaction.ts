import { z } from "zod";

/**
 * Le moyen de paiement est facultatif, mais « facultatif » ne veut pas dire
 * « absent » : le Select de base-ui envoie une chaîne vide pour un champ que
 * le propriétaire n'a pas touché, exactement comme un champ texte laissé vide.
 * Sans ce preprocesseur, `transactionSchema` rejetaient `""` au nom de l'enum
 * et le propriétaire ne pouvait pas saisir un paiement sans renseigner un champ
 * qui n'est pas obligatoire.
 *
 * La distinction qui compte est « aucune valeur » contre « une valeur » :
 *   "" / null / undefined → absent, valide
 *   "TRANSFER"            → valeur, doit appartenir à l'enum
 *   "VIREMENT"            → invalide, refusé
 *
 * Une valeur réellement fausse n'est donc jamais transformée en absent : elle
 * reste refusée.
 */
const absentIfBlank = (value: unknown): unknown =>
  value === null || (typeof value === "string" && value.trim() === "") ? undefined : value;

const PAYMENT_METHODS = ["TRANSFER", "CHECK", "CASH", "DIRECT_DEBIT", "OTHER"] as const;

const paymentMethodSchema = z.preprocess(absentIfBlank, z.enum(PAYMENT_METHODS).optional());

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
  paymentMethod: paymentMethodSchema,
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
