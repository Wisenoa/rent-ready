import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const csvRowSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "PARKING", "OTHER"]),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().min(4),
  surface: z.coerce.number().optional(),
  rooms: z.coerce.number().int().optional(),
  description: z.string().optional(),
  cadastralRef: z.string().optional(),
  taxRef: z.string().optional(),
});

type ImportResult = {
  row: number;
  name: string;
  status: "success" | "error";
  error?: string;
};

/**
 * POST /api/properties/import
 * Bulk import properties from CSV.
 * Accepts a CSV file with columns: name, type, addressLine1, addressLine2 (optional),
 * city, postalCode, surface (optional), rooms (optional), description (optional),
 * cadastralRef (optional), taxRef (optional).
 *
 * Returns a summary of imported and failed rows.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse form data — CSV file is in the "file" field
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Fichier CSV requis" },
        { status: 400 }
      );
    }

    const content = await file.text();
    const lines = content.trim().split("\n");
    if (lines.length < 2) {
      return NextResponse.json(
        { error: "Le fichier CSV doit contenir un en-tête et au moins une ligne de données" },
        { status: 400 }
      );
    }

    // Parse header (first line)
    const header = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    const rows: ImportResult[] = [];
    let imported = 0;
    let errors = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing — handle basic quoted fields
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const rowData: Record<string, string> = {};
      header.forEach((col, idx) => {
        rowData[col] = values[idx] ?? "";
      });

      const parsed = csvRowSchema.safeParse(rowData);
      if (!parsed.success) {
        rows.push({
          row: i + 1,
          name: rowData.name || "(sans nom)",
          status: "error",
          error: parsed.error.issues[0]?.message,
        });
        errors++;
        continue;
      }

      const data = parsed.data;
      try {
        await prisma.property.create({
          data: {
            userId,
            name: data.name,
            type: data.type,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2 || null,
            city: data.city,
            postalCode: data.postalCode,
            surface: data.surface ?? null,
            rooms: data.rooms ?? null,
            description: data.description || null,
            cadastralRef: data.cadastralRef || null,
            taxRef: data.taxRef || null,
          },
        });
        rows.push({ row: i + 1, name: data.name, status: "success" });
        imported++;
      } catch {
        rows.push({
          row: i + 1,
          name: data.name,
          status: "error",
          error: "Erreur lors de l'enregistrement en base de données",
        });
        errors++;
      }
    }

    return NextResponse.json({
      total: lines.length - 1,
      imported,
      errors,
      rows,
    });
  } catch (error) {
    console.error("POST /api/properties/import error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
