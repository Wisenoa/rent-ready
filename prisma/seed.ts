import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const IRL_DATA = [
  { quarter: "T1-2023", year: 2023, trimester: 1, value: 138.61 },
  { quarter: "T2-2023", year: 2023, trimester: 2, value: 140.59 },
  { quarter: "T3-2023", year: 2023, trimester: 3, value: 141.03 },
  { quarter: "T4-2023", year: 2023, trimester: 4, value: 142.06 },
  { quarter: "T1-2024", year: 2024, trimester: 1, value: 143.46 },
  { quarter: "T2-2024", year: 2024, trimester: 2, value: 144.21 },
  { quarter: "T3-2024", year: 2024, trimester: 3, value: 144.51 },
  { quarter: "T4-2024", year: 2024, trimester: 4, value: 144.89 },
  { quarter: "T1-2025", year: 2025, trimester: 1, value: 145.17 },
  { quarter: "T2-2025", year: 2025, trimester: 2, value: 145.34 },
  { quarter: "T3-2025", year: 2025, trimester: 3, value: 145.49 },
  { quarter: "T4-2025", year: 2025, trimester: 4, value: 145.78 },
];

async function main() {
  console.log("Seeding IRL data...");

  for (const irl of IRL_DATA) {
    await prisma.irlIndex.upsert({
      where: { quarter: irl.quarter },
      update: { value: irl.value },
      create: irl,
    });
  }

  console.log(`Seeded ${IRL_DATA.length} IRL indices.`);
  console.log("Latest IRL: T4-2025 = 145.78");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
