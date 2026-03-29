import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

/**
 * Schema for data extracted from a scanned lease document.
 * The LLM will structure its extraction according to this schema.
 */
export const leaseExtractionSchema = z.object({
  // Landlord info
  landlordFirstName: z.string().nullable().describe("Prénom du bailleur / propriétaire"),
  landlordLastName: z.string().nullable().describe("Nom de famille du bailleur / propriétaire"),
  landlordAddress: z.string().nullable().describe("Adresse complète du bailleur"),

  // Tenant info
  tenantFirstName: z.string().nullable().describe("Prénom du locataire"),
  tenantLastName: z.string().nullable().describe("Nom de famille du locataire"),
  tenantAddress: z.string().nullable().describe("Adresse complète du locataire (avant emménagement si disponible)"),

  // Property info
  propertyAddress: z.string().nullable().describe("Adresse complète du bien loué"),
  propertyType: z
    .enum(["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "PARKING", "OTHER"])
    .nullable()
    .describe("Type de bien"),
  propertySurface: z.number().nullable().describe("Surface habitable en m²"),
  propertyRooms: z.number().nullable().describe("Nombre de pièces principales"),

  // Financial info
  rentAmount: z
    .number()
    .nullable()
    .describe("Montant du loyer mensuel hors charges en euros"),
  chargesAmount: z
    .number()
    .nullable()
    .describe("Montant de la provision pour charges mensuelles en euros"),
  depositAmount: z
    .number()
    .nullable()
    .describe("Montant du dépôt de garantie en euros"),

  // Dates
  leaseStartDate: z
    .string()
    .nullable()
    .describe("Date de début du bail au format YYYY-MM-DD"),
  leaseEndDate: z
    .string()
    .nullable()
    .describe("Date de fin du bail au format YYYY-MM-DD (null si indéterminée)"),
  signatureDate: z
    .string()
    .nullable()
    .describe("Date de signature du bail au format YYYY-MM-DD"),

  // Lease type
  leaseType: z
    .enum(["UNFURNISHED", "FURNISHED", "COMMERCIAL", "SEASONAL"])
    .nullable()
    .describe("Type de bail : vide, meublé, commercial, saisonnier"),

  // Payment
  paymentDay: z
    .number()
    .nullable()
    .describe("Jour du mois pour le paiement du loyer (1-31)"),
  paymentMethod: z
    .enum(["TRANSFER", "CHECK", "CASH", "DIRECT_DEBIT", "OTHER"])
    .nullable()
    .describe("Mode de paiement du loyer"),

  // IRL reference (if mentioned)
  irlReferenceValue: z
    .number()
    .nullable()
    .describe("Valeur de l'IRL de référence mentionné dans le bail"),
  irlReferenceQuarter: z
    .string()
    .nullable()
    .describe("Trimestre de l'IRL de référence (ex: T4-2025)"),

  // Confidence
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Score de confiance global de l'extraction (0 à 1)"),
  extractionNotes: z
    .string()
    .nullable()
    .describe("Notes sur les éléments incertains ou manquants"),
});

export type LeaseExtraction = z.infer<typeof leaseExtractionSchema>;

/**
 * Extract structured lease data from document text using an LLM.
 *
 * This function uses Vercel AI SDK's generateObject to get
 * type-safe structured output from the model.
 *
 * @param documentText - The OCR text extracted from the lease document
 * @param modelId - OpenAI model to use (default: gpt-4o)
 */
export async function extractLeaseData(
  documentText: string,
  modelId: string = "gpt-4o"
): Promise<LeaseExtraction> {
  const { object } = await generateObject({
    model: openai(modelId),
    schema: leaseExtractionSchema,
    system: `Tu es un assistant juridique spécialisé dans l'extraction de données 
à partir de contrats de bail français. Tu dois extraire avec précision toutes les 
informations demandées à partir du texte OCR fourni.

Règles :
- Si une information n'est pas trouvée dans le texte, retourne null pour ce champ.
- Les montants doivent être en euros, sans le symbole €.
- Les dates doivent être au format YYYY-MM-DD.
- Pour le type de bail, détermine-le à partir du contexte (loi du 6 juillet 1989 = vide/meublé).
- Évalue ta confiance globale entre 0 et 1.
- Note dans extractionNotes les informations que tu n'as pas pu trouver ou dont tu doutes.`,
    prompt: `Extrais les informations structurées du contrat de bail suivant :\n\n${documentText}`,
  });

  return object;
}

/**
 * Process a lease document image/PDF for OCR + extraction.
 *
 * This is the main entry point for the AI lease extraction pipeline:
 * 1. Accept base64-encoded image or PDF
 * 2. Use GPT-4o vision for OCR (text extraction from image)
 * 3. Use structured extraction on the OCR text
 *
 * @param fileBase64 - Base64-encoded file content
 * @param mimeType - MIME type of the file (image/jpeg, image/png, application/pdf)
 */
export async function processLeaseDocument(
  fileBase64: string,
  mimeType: string
): Promise<{
  extraction: LeaseExtraction;
  ocrText: string;
}> {
  // Step 1: OCR — use vision model to extract text from the document
  const { object: ocrResult } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      extractedText: z.string().describe("Full text extracted from the document"),
      documentType: z.string().describe("Type of document identified"),
      quality: z
        .enum(["good", "medium", "poor"])
        .describe("Quality assessment of the scan"),
    }),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Extrais l'intégralité du texte visible dans ce document. 
C'est un contrat de bail ou un document immobilier français. 
Retranscris le texte fidèlement, en préservant la structure et la mise en page.`,
          },
          {
            type: "image",
            image: fileBase64,
            mediaType: mimeType,
          },
        ],
      },
    ],
  });

  // Step 2: Structured extraction from OCR text
  const extraction = await extractLeaseData(ocrResult.extractedText);

  return {
    extraction,
    ocrText: ocrResult.extractedText,
  };
}
