import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const maintenanceSummarizationSchema = z.object({
  category: z.enum([
    "PLUMBING",
    "ELECTRICAL",
    "HEATING",
    "STRUCTURAL",
    "APPLIANCE",
    "SECURITY",
    "COMMON_AREAS",
    "OTHER",
  ]).describe("Catégorie du problème"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).describe("Niveau d'urgence"),
  estimatedTimeHours: z.number().describe("Temps estimé en heures"),
  estimatedCostMin: z.number().describe("Coût estimé minimum en euros"),
  estimatedCostMax: z.number().describe("Coût estimé maximum en euros"),
  actionItems: z.array(z.string()).describe("Actions recommandées"),
  risks: z.array(z.object({
    description: z.string().describe("Description du risque"),
    mitigation: z.string().describe("Mesure d'atténuation"),
  })).describe("Risques potentiels"),
  suggestedProfessionals: z.array(z.enum([
    "PLUMBER",
    "ELECTRICIAN",
    "HEATING_TECH",
    "HANDYMAN",
    "LOCKSMITH",
    "ROOFER",
    "GENERAL_CONTRACTOR",
  ])).describe("Professionnels suggérés"),
  notes: z.string().nullable().describe("Notes additionnelles"),
});

export type MaintenanceSummarization = z.infer<typeof maintenanceSummarizationSchema>;

/**
 * Use AI to summarize and categorize a maintenance ticket
 */
export async function summarizeMaintenanceTicket(
  title: string,
  description: string,
  propertyInfo?: {
    type?: string;
    surface?: number;
    rooms?: number;
    age?: number;
  },
  modelId: string = "gpt-4o-mini"
): Promise<MaintenanceSummarization> {
  const { object } = await generateObject({
    model: openai(modelId),
    schema: maintenanceSummarizationSchema,
    system: `Tu es un expert en maintenance immobilière France. Tu analyses les demandes de réparation et fournis:
- Une catégorisation précise
- Une évaluation de l'urgence
- Des estimations de temps et de coût
- Des actions recommandées
- Des risques potentiels et mesures d'atténuation
- Les professionnels qualifiés pour intervenir

Ta réponse doit être en français et professionnelle.`,
    prompt: `Analyse cette demande de maintenance:

Titre: ${title}
Description: ${description}
${propertyInfo ? `
Contexte du bien:
${propertyInfo.type ? `- Type: ${propertyInfo.type}` : ""}
${propertyInfo.surface ? `- Surface: ${propertyInfo.surface}m²` : ""}
${propertyInfo.rooms ? `- Pièces: ${propertyInfo.rooms}` : ""}
${propertyInfo.age ? `- Âge du bien: ${propertyInfo.age} ans` : ""}
` : ""}

Fournis une analyse structurée avec:
1. Catégorie appropriée
2. Niveau d'urgence (LOW = peut attendre, MEDIUM = à traiter ce mois, HIGH = à traiter cette semaine, URGENT = intervention immédiate)
3. Estimation de temps de travail (en heures)
4. Estimation de coût (fourchette en euros)
5. Liste d'actions recommandées
6. Risques potentiels et comment les atténuer
7. Types de professionnels qualifiés`,
  });

  return object;
}