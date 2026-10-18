import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { toolSlugSchema, type ProductEvent } from "./privacy";

/** Best effort, after the domain operation succeeded. Analytics never determines business state. */
export async function recordProductEvent(userId: string, event: ProductEvent): Promise<void> {
  try {
    const store = await cookies();
    if (store.get("lokna_cookie_consent")?.value !== "accepted") return;
    const source = toolSlugSchema.safeParse(store.get("lokna_source_tool")?.value);
    await prisma.auditLog.create({ data: {
      userId, entityType: "PRODUCT_ANALYTICS", entityId: event, action: "CREATE",
      changes: { event, ...(source.success ? { source_tool: source.data } : {}) },
    } });
  } catch {
    console.warn("[analytics] product event could not be recorded", { event });
  }
}
