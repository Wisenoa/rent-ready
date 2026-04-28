import { z } from "zod";

export const reminderSchema = z.object({
  leaseId: z.string().optional().or(z.literal("")),
  propertyId: z.string().optional().or(z.literal("")),
  tenantId: z.string().optional().or(z.literal("")),
  type: z.enum([
    "RENT_DUE",
    "LEASE_RENEWAL",
    "DEPOSIT_RETURN",
    "TAX_DEADLINE",
    "CONDO_FEE",
    "MAINTENANCE_DUE",
    "CUSTOM",
  ]),
  title: z.string().min(1, "Le titre est requis").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  isRecurring: z.boolean().optional().default(false),
  recurringInterval: z.coerce.number().int().min(1).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;
