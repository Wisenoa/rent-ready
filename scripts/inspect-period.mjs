// Ad-hoc inspection helper: list transactions for a rental period.
// Usage: node scripts/inspect-period.mjs [periodStartISO]
import fs from "fs";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) {
    process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const { PrismaClient } = await import("@prisma/client");
const { PrismaPg } = await import("@prisma/adapter-pg");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const start = new Date(process.argv[2] || "2026-10-01");
const rows = await prisma.transaction.findMany({
  where: { periodStart: start },
  orderBy: { createdAt: "asc" },
  select: { amount: true, status: true, receiptType: true, receiptNumber: true },
});

console.log(`period ${start.toISOString().slice(0, 10)}: ${rows.length} transaction(s)`);
for (const r of rows) {
  console.log(
    `  ${r.amount.toString().padStart(9)} EUR  status=${r.status.padEnd(8)} receipt=${r.receiptType || "-"}/${r.receiptNumber || "-"}`
  );
}
const total = rows.reduce((s, r) => s + Number(r.amount), 0);
console.log(`  total paid: ${total.toFixed(2)} EUR`);

await prisma.$disconnect();
