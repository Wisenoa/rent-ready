import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const expenseExtractionSchema = z.object({
  vendorName: z
    .string()
    .nullable()
    .describe("Nom du prestataire / artisan / fournisseur"),
  description: z
    .string()
    .nullable()
    .describe("Description de la prestation ou du produit"),
  amount: z.number().nullable().describe("Montant total TTC en euros"),
  date: z
    .string()
    .nullable()
    .describe("Date de la facture au format YYYY-MM-DD"),
  category: z
    .enum([
      "PLUMBING",
      "ELECTRICAL",
      "GENERAL_MAINTENANCE",
      "INSURANCE",
      "TAX",
      "CONDO_FEES",
      "MANAGEMENT_FEES",
      "RENOVATION",
      "OTHER",
    ])
    .nullable()
    .describe("Catégorie de dépense"),
  confidence: z.number().min(0).max(1).describe("Score de confiance (0-1)"),
  extractionNotes: z
    .string()
    .nullable()
    .describe("Notes sur éléments incertains"),
});

export type ExpenseExtraction = z.infer<typeof expenseExtractionSchema>;

/**
 * Extract structured expense data from document text using an LLM.
 *
 * @param documentText - The OCR text extracted from the invoice
 * @param modelId - OpenAI model to use (default: gpt-4o)
 */
export async function extractExpenseData(
  documentText: string,
  modelId: string = "gpt-4o"
): Promise<ExpenseExtraction> {
  const { object } = await generateObject({
    model: openai(modelId),
    schema: expenseExtractionSchema,
    system: `Tu es un assistant comptable spécialisé dans l'extraction de données 
à partir de factures et devis d'artisans français. Tu dois extraire avec précision 
toutes les informations demandées à partir du texte OCR fourni.

Règles :
- Si une information n'est pas trouvée dans le texte, retourne null pour ce champ.
- Les montants doivent être en euros, le montant TTC final (pas HT).
- Les dates doivent être au format YYYY-MM-DD.
- Pour la catégorie, déduis-la du contenu de la facture :
  - PLUMBING : plomberie, sanitaires, tuyauterie, chauffe-eau
  - ELECTRICAL : électricité, câblage, tableau électrique
  - GENERAL_MAINTENANCE : entretien courant, ménage, jardinage
  - INSURANCE : assurance habitation, PNO, loyers impayés
  - TAX : taxe foncière, CFE, impôts
  - CONDO_FEES : charges de copropriété, syndic
  - MANAGEMENT_FEES : frais de gestion locative, honoraires
  - RENOVATION : travaux importants, rénovation, peinture, toiture
  - OTHER : si aucune catégorie ne correspond
- Évalue ta confiance globale entre 0 et 1.
- Note dans extractionNotes les informations que tu n'as pas pu trouver ou dont tu doutes.`,
    prompt: `Extrais les informations structurées de la facture suivante :\n\n${documentText}`,
  });

  return object;
}

/**
 * Process an invoice document image/PDF for OCR + extraction.
 *
 * Pipeline:
 * 1. Accept base64-encoded image or PDF
 * 2. Use GPT-4o vision for OCR (text extraction from image)
 * 3. Use structured extraction on the OCR text
 *
 * @param fileBase64 - Base64-encoded file content
 * @param mimeType - MIME type of the file (image/jpeg, image/png, application/pdf)
 */
export async function processExpenseDocument(
  fileBase64: string,
  mimeType: string
): Promise<{
  extraction: ExpenseExtraction;
  ocrText: string;
}> {
  // Step 1: OCR — use vision model to extract text from the document
  const { object: ocrResult } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      extractedText: z
        .string()
        .describe("Full text extracted from the document"),
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
C'est une facture, un devis ou un justificatif de dépense français.
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
  const extraction = await extractExpenseData(ocrResult.extractedText);

  return {
    extraction,
    ocrText: ocrResult.extractedText,
  };
}
