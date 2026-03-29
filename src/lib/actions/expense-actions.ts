"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { expenseSchema } from "@/lib/validations/expense";
import { processExpenseDocument } from "@/lib/ai/expense-extractor";
import type { ActionResult } from "./property-actions";

export async function createExpense(
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const raw = Object.fromEntries(formData.entries());
    const parsed = expenseSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Données invalides",
      };
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        vendorName: parsed.data.vendorName,
        description: parsed.data.description || null,
        amount: parsed.data.amount,
        category: parsed.data.category,
        date: new Date(parsed.data.date),
        propertyId: parsed.data.propertyId || null,
        aiExtracted: formData.get("aiExtracted") === "true",
      },
    });

    revalidatePath("/expenses");
    return { success: true, data: { id: expense.id } };
  } catch (error) {
    console.error("createExpense error:", error);
    return {
      success: false,
      error: "Impossible de créer la dépense. Veuillez réessayer.",
    };
  }
}

export async function updateExpense(
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    const id = formData.get("id") as string;

    if (!id) {
      return { success: false, error: "Identifiant manquant." };
    }

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return {
        success: false,
        error: "Dépense introuvable ou accès non autorisé.",
      };
    }

    const raw = Object.fromEntries(formData.entries());
    const parsed = expenseSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Données invalides",
      };
    }

    await prisma.expense.update({
      where: { id },
      data: {
        vendorName: parsed.data.vendorName,
        description: parsed.data.description || null,
        amount: parsed.data.amount,
        category: parsed.data.category,
        date: new Date(parsed.data.date),
        propertyId: parsed.data.propertyId || null,
      },
    });

    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error("updateExpense error:", error);
    return {
      success: false,
      error: "Impossible de modifier la dépense.",
    };
  }
}

export async function deleteExpense(id: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return {
        success: false,
        error: "Dépense introuvable ou accès non autorisé.",
      };
    }

    await prisma.expense.delete({ where: { id } });
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error("deleteExpense error:", error);
    return {
      success: false,
      error: "Impossible de supprimer la dépense.",
    };
  }
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function extractExpenseFromInvoice(
  formData: FormData
): Promise<ActionResult> {
  try {
    await getCurrentUserId();

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "Aucun fichier fourni." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Le fichier dépasse la taille maximale de 10 Mo.",
      };
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Format de fichier non supporté. Utilisez une image ou un PDF.",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const { extraction, ocrText } = await processExpenseDocument(
      base64,
      file.type
    );

    return {
      success: true,
      data: {
        vendorName: extraction.vendorName,
        description: extraction.description,
        amount: extraction.amount,
        date: extraction.date,
        category: extraction.category,
        confidence: extraction.confidence,
        extractionNotes: extraction.extractionNotes,
        ocrText,
      },
    };
  } catch (error) {
    console.error("extractExpenseFromInvoice error:", error);
    return {
      success: false,
      error:
        "L'extraction IA a échoué. Vous pouvez saisir les informations manuellement.",
    };
  }
}
