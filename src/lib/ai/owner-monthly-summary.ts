import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const ownerMonthlySummarySchema = z.object({
  overview: z.object({
    month: z.string().describe("Mois et année (ex: 'Janvier 2025')"),
    totalRevenue: z.number().describe("Revenus totaux du mois"),
    totalExpenses: z.number().describe("Dépenses totales du mois"),
    netOperatingIncome: z.number().describe("Résultat d'exploitation (NOI)"),
    occupancyRate: z.number().min(0).max(100).describe("Taux d'occupation en pourcentage"),
  }),
  revenueBreakdown: z.object({
    rentPayments: z.number().describe("Total des paiements de loyers"),
    latePayments: z.number().describe("Montant des paiements en retard"),
    outstandingPayments: z.number().describe("Montant des loyers impayés"),
    revenueTrend: z.enum(["INCREASING", "STABLE", "DECREASING"]).describe("Tendance des revenus"),
  }),
  expenseBreakdown: z.object({
    maintenance: z.number().describe("Coûts de maintenance"),
    utilities: z.number().describe("Charges utilities"),
    taxes: z.number().describe("Impôts et taxes"),
    insurance: z.number().describe("Assurances"),
    management: z.number().describe("Frais de gestion"),
    other: z.number().describe("Autres dépenses"),
    expenseTrend: z.enum(["INCREASING", "STABLE", "DECREASING"]).describe("Tendance des dépenses"),
  }),
  propertyPerformance: z.array(z.object({
    propertyName: z.string(),
    occupancy: z.boolean(),
    monthlyRent: z.number(),
    paymentStatus: z.enum(["PAID", "PENDING", "LATE"]),
    issues: z.array(z.string()).describe("Problèmes identifiés"),
  })).describe("Performance par propriété"),
  highlights: z.object({
    achievements: z.array(z.string()).describe("Points positifs du mois"),
    concerns: z.array(z.string()).describe("Points d'attention"),
    recommendations: z.array(z.string()).describe("Recommandations pour le propriétaire"),
  }),
  upcomingActions: z.array(z.object({
    type: z.enum(["PAYMENT_DUE", "LEASE_RENEWAL", "MAINTENANCE_DUE", "TAX_DEADLINE", "OTHER"]),
    description: z.string(),
    dueDate: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  })).describe("Actions à venir"),
});

export type OwnerMonthlySummary = z.infer<typeof ownerMonthlySummarySchema>;

/**
 * Generate AI-powered monthly summary for property owner
 */
export async function generateOwnerMonthlySummary(
  data: {
    properties: Array<{
      name: string;
      type: string;
      status: string;
      monthlyRent: number;
      occupancyStatus: string;
    }>;
    transactions: Array<{
      amount: number;
      rentPortion: number;
      chargesPortion: number;
      status: string;
      periodStart: Date;
      paidAt: Date | null;
      propertyName: string;
    }>;
    expenses: Array<{
      amount: number;
      category: string;
      date: Date;
      description: string | null;
    }>;
    maintenanceTickets: Array<{
      title: string;
      status: string;
      priority: string;
      createdAt: Date;
      propertyName: string;
    }>;
    month: string;
    year: number;
  },
  modelId: string = "gpt-4o-mini"
): Promise<OwnerMonthlySummary> {
  const { object } = await generateObject({
    model: openai(modelId),
    schema: ownerMonthlySummarySchema,
    system: `Tu es un expert en gestion immobilière française. Tu analyses les données mensuelles d'un portefeuille immobilier et fournis:

- Un résumé financier complet (revenus, dépenses, NOI)
- Des tendances et évolutions
- Des insights sur la performance par propriété
- Des points forts et des préoccupations
- Des recommandations stratégiques
- Des actions à venir

Tu parles français de manière professionnelle et tes analyses sont basées sur les données réelles.`,
    prompt: `Analyse les données mensuelles suivantes pour ${data.month} ${data.year}:

**PROPRIÉTÉS:**
${JSON.stringify(data.properties, null, 2)}

**TRANSACTIONS:**
${JSON.stringify(data.transactions, null, 2)}

**DÉPENSES:**
${JSON.stringify(data.expenses, null, 2)}

**TICKETS MAINTENANCE:**
${JSON.stringify(data.maintenanceTickets, null, 2)}

Fournis une analyse complète avec:
1. Vue d'ensemble financière
2. Détail des revenus et tendances
3. Détail des dépenses et tendances
4. Performance par propriété
5. Points forts et préoccupations
6. Recommandations
7. Actions à venir`,
  });

  return object;
}