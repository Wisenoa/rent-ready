import { z } from "zod";

export const communicationLogSchema = z.object({
  tenantId: z.string().min(1, "tenantId est requis"),
  leaseId: z.string().optional(),
  direction: z.enum(["INBOUND", "OUTBOUND"]),
  channel: z.enum(["IN_APP", "EMAIL", "PHONE", "LETTER"]).default("IN_APP"),
  communicationType: z
    .enum(["RENTAL_INQUIRY", "LEASE_NEGOTIATION", "PAYMENT_REMINDER", "MAINTENANCE_REQUEST", "GENERAL", "LEGAL_NOTICE", "OTHER"])
    .optional(),
  subject: z.string().min(1, "Le sujet est requis").max(500),
  body: z.string().min(1, "Le corps du message est requis").max(10000),
  relatedEntityType: z
    .enum(["LEASE", "PAYMENT", "MAINTENANCE", "DOCUMENT"])
    .optional(),
  relatedEntityId: z.string().optional(),
});

export const communicationFilterSchema = z.object({
  tenantId: z.string().optional(),
  direction: z.enum(["INBOUND", "OUTBOUND"]).optional(),
  channel: z.enum(["IN_APP", "EMAIL", "PHONE", "LETTER"]).optional(),
  relatedEntityType: z
    .enum(["LEASE", "PAYMENT", "MAINTENANCE", "DOCUMENT"])
    .optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CommunicationLogFormValues = z.infer<
  typeof communicationLogSchema
>;
export type CommunicationFilterValues = z.infer<
  typeof communicationFilterSchema
>;
