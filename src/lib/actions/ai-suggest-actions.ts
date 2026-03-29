"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function getFieldSuggestion(
  fieldName: string,
  currentValue: string,
  context?: Record<string, string>
): Promise<string | null> {
  if (currentValue.length < 2) return null;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: `Tu es un assistant de saisie pour un logiciel de gestion locative français.
Complete le champ "${fieldName}" en donnant UNIQUEMENT la suite du texte, pas de répétition du début.
Contexte: ${JSON.stringify(context || {})}
Réponds uniquement avec la complétion, sans guillemets ni explication.`,
    prompt: currentValue,
    maxOutputTokens: 50,
  });

  return text.trim() || null;
}
