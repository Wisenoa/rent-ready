import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
export const leaseAnalysisSchema = z.object({
  risks: z.array(
    z.object({
      category: z.enum([
        "DEPOSIT",
        "IRL",
        "NOTICE_PERIOD",
        "CHARGES",
        "DURATION",
        "CLAUSE_ABUSIVE",
        "OBLIGATIONS",
        "OTHER",
      ]),
      severity: z.enum(["low", "medium", "high"]),
      description: z.string(),
      recommendation: z.string(),
    })
  ),
  compliance: z.object({
    irlCompliant: z.boolean().describe("Le bail mentionne-t-il correctement l'IRL de référence ?"),
    depositCompliant: z.boolean().describe("Le dépôt de garantie est-il conforme aux limites légales ?"),
    noticePeriodCorrect: z.boolean().describe("Les préavis sont-ils conformes au type de bail ?"),
    durationCompliant: z.boolean().describe("La durée du bail est-elle conforme ?"),
    chargesClauseCompliant: z.boolean().describe("La clause de charges est-elle réglementaire ?"),
  }),
  missingClauses: z.array(
    z.string().describe("Clauses importantes absentes du bail")
  ),
  summary: z.object({
    strengths: z.array(z.string()).describe("Points forts du bail"),
    weaknesses: z.array(z.string()).describe("Points faibles ou risques"),
    overallRisk: z.enum(["low", "medium", "high"]).describe("Niveau de risque global"),
  }),
});

export type LeaseAnalysis = z.infer<typeof leaseAnalysisSchema>;

export async function analyzeLeaseClauses(
  leaseText: string,
  modelId: string = "gpt-4o"
): Promise<LeaseAnalysis> {
  const { object } = await generateObject({
    model: openai(modelId),
    schema: leaseAnalysisSchema,
    system: `Tu es un expert juridique spécialisé dans le droit immobilier français (loi du 6 juillet 1989, loi ALUR, etc.).

Analyse le contrat de bail fourni pour identifier :
1. Les risques pour le bailleur (clauses déséquilibrées, non-conformités)
2. La conformité avec la législation française
3. Les clauses manquantes importantes
4. Les recommandations pour améliorer le bail

Réponds de manière structuré et factuelle. Sois précis sur les références légales.`,
    prompt: `Analyse ce contrat de bail français et fournis une évaluation structurée des risques et de la conformité :

${leaseText}`,
  });

  return object;
}

export const rentFollowUpSchema = z.object({
  subject: z.string().describe("Objet de la lettre"),
  body: z.string().describe("Corps de la lettre formaté avec sauts de ligne"),
  tone: z.enum(["friendly", "formal", "legal"]).describe("Ton de la lettre"),
  nextSteps: z
    .string()
    .nullable()
    .describe("Actions recommandées si pas de réponse"),
});

export type RentFollowUp = z.infer<typeof rentFollowUpSchema>;

export async function generateRentFollowUpDraft(
  tenantName: string,
  propertyAddress: string,
  amountDue: number,
  dueDate: string,
  daysLate: number,
  previousAttempts: number,
  tone: "friendly" | "formal" | "legal" = "formal",
  modelId: string = "gpt-4o"
): Promise<RentFollowUp> {
  const { object } = await generateObject({
    model: openai(modelId),
    schema: rentFollowUpSchema,
    system: `Tu es un assistant spécialisé dans la rédaction de lettres de relance pour loyers impayés en France.
Tu dois rédiger des lettres professionnelles, conformes au droit français, qui respectent :
- La loi ALUR et la loi ELAN
- Les procédures de recouvrement amiable
- Les délais légaux (commandement de payer après 2 mois)

Adapte le ton selon le stade de relance et les tentatives précédentes.
En français, formel et juridiquement correct.`,
    prompt: `Rédige une lettre de relance pour loyer impayé avec les informations suivantes :

- Locataire : ${tenantName}
- Adresse : ${propertyAddress}
- Montant dû : ${amountDue.toFixed(2)} €
- Date d'échéance : ${dueDate}
- Jours de retard : ${daysLate}
- Tentatives précédentes : ${previousAttempts}
- Ton souhaité : ${tone}

Génère une lettre complète avec objet, corpset indications des prochaines étapes.`,
  });

  return object;
}

export const maintenanceSummarySchema = z.object({
  summary: z.string().describe("Résumé concis du problème"),
  category: z
    .enum([
      "PLUMBING",
      "ELECTRICAL",
      "HEATING",
      "STRUCTURAL",
      "APPLIANCE",
      "SECURITY",
      "OTHER",
    ])
    .describe("Catégorie du problème"),
  urgency: z.enum(["low", "medium", "high", "critical"]).describe("Niveau d'urgence"),
  estimatedResolution: z.string().describe("Estimation du temps de résolution"),
  ownerActions: z.array(z.string()).describe("Actions que le propriétaire doit entreprendre"),
  tenantActions: z.array(z.string()).describe("Actions que le locataire peut faire en attendant"),
  estimatedCost: z
    .object({
      min: z.number().describe("Coût minimum estimé en euros"),
      max: z.number().describe("Coût maximum estimé en euros"),
    })
    .nullable()
    .describe("Estimation du coût si applicable"),
});

export type MaintenanceSummary = z.infer<typeof maintenanceSummarySchema>;

export async function summarizeMaintenanceTicket(
  title: string,
  description: string,
  priority: string,
  modelId: string = "gpt-4o"
): Promise<MaintenanceSummary> {
  const { object } = await generateObject({
    model: openai(modelId),
    schema: maintenanceSummarySchema,
    system: `Tu es un expert en gestion immobilière qui aide les propriétaires à comprendre et prioriser les demandes de maintenance.

Analyse les demandes de maintenance pour :
1. En extraire un résumé clair
2. Catégoriser le problème
3. Évaluer l'urgence réelle (pas uniquement celle déclarée par le locataire)
4. Proposer des actions concrètes
5. Estimer les coûts potentiels

Réponds en français de manière pratique etactionnable.`,
    prompt: `Analyse cette demande de maintenance :

Titre : ${title}
Description : ${description}
Priorité déclarée : ${priority}

Fournis une analyse structurée.`,
  });

  return object;
}

export const monthlySummarySchema = z.object({
  period: z.string().describe("Période couverte (MM/AAAA)"),
  revenue: z.object({
    total: z.number().describe("Total des revenus"),
    breakdown: z
      .array(
        z.object({
          property: z.string(),
          amount: z.number(),
        })
      )
      .describe("Détail par bien"),
  }),
  expenses: z.object({
    total: z.number().describe("Total des dépenses"),
    breakdown: z.array(
      z.object({
        category: z.string(),
        amount: z.number(),
      })
    ).describe("Détail par catégorie"),
  }),
  noi: z.number().describe("Résultat net d'exploitation"),
  occupancy: z.object({
    rate: z.number().describe("Taux d'occupation en pourcentage"),
    changes: z
      .array(
        z.object({
          property: z.string(),
          status: z.enum(["new_tenant", "vacant", "renewed"]),
        })
      )
      .describe("Changements d'occupation"),
  }),
  upcoming: z.object({
    leaseExpirations: z
      .array(
        z.object({
          property: z.string(),
          tenant: z.string(),
          date: z.string(),
        })
      )
      .describe("Baux arrivant à échéance"),
    pendingPayments: z
      .array(
        z.object({
          tenant: z.string(),
          amount: z.number(),
        })
      )
      .describe("Paiements en attente"),
  }),
  highlights: z.array(z.string()).describe("Points importants du mois"),
  recommendations: z.array(z.string()).describe("Recommandations pour le propriétaire"),
});

export type MonthlySummary = z.infer<typeof monthlySummarySchema>;

export async function generateOwnerMonthlySummary(
  propertyData: Array<{
    name: string;
    tenant: string | null;
    revenue: number;
    status: string;
  }>,
  expenseData: Array<{
    category: string;
    amount: number;
  }>,
  upcomingExpirations: Array<{
    property: string;
    tenant: string;
    endDate: string;
  }>,
  pendingPayments: Array<{
    tenant: string;
    amount: number;
  }>,
  month: string,
  modelId: string = "gpt-4o"
): Promise<MonthlySummary> {
  const totalRevenue = propertyData.reduce((sum, p) => sum + p.revenue, 0);
  const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);

  const { object } = await generateObject({
    model: openai(modelId),
    schema: monthlySummarySchema,
    system: `Tu es un assistant immobilier professionnel qui génère des rapports mensuels clairs etconcis pour les propriétaires bailleurs.

Ton rôle est de :
1. Synthétiser les données financières
2. Mettre en évidence les tendances et anomalies
3. Proposer des actions concrètes
4. Rédiger en français professionnel

Le rapport doit être utile et-actionnable.`,
    prompt: `Génère un rapport mensuel pour ${month} avec les données suivantes :

Biens et revenus :
${propertyData.map((p) => `- ${p.name}: ${p.tenant || "VACANT"}, ${p.revenue}€, ${p.status}`).join("\n")}

Dépenses par catégorie :
${expenseData.map((e) => `- ${e.category}: ${e.amount}€`).join("\n")}

Baux arrivant à échéance :
${upcomingExpirations.map((e) => `- ${e.property} (${e.tenant}): ${e.endDate}`).join("\n") || "Aucun"}

Paiements en attente :
${pendingPayments.map((p) => `- ${p.tenant}: ${p.amount}€`).join("\n") || "Aucun"}

Total revenus : ${totalRevenue}€
Total dépenses : ${totalExpenses}€
Résultat net : ${totalRevenue - totalExpenses}€`,
  });

  return object;
}