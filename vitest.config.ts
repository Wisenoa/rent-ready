import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { config as loadEnv } from "dotenv";

// The real-database suites (`*.db.test.ts`) gate on `process.env.DATABASE_URL`
// and SKIP SILENTLY without it, so `pnpm test` reported a green suite that had
// proved nothing about Prisma or PostgreSQL — which is how a broken receipt route
// survived several reviews. `vitest` does not load `.env` on its own, and `pnpm
// test` does not either, so a local run skipped them while CI (which exports the
// variable) ran them.
//
// Loading the file here makes the local suite exercise the same code CI does.
// CI already exports DATABASE_URL and `dotenv` never overrides an existing
// variable, so this changes nothing there. A missing `.env` is not an error:
// without it the database suites skip, exactly as before.
loadEnv({ path: path.resolve(__dirname, ".env"), quiet: true });

export default defineConfig({
  // Needed to import server-action modules that also contain JSX
  // (transaction-actions.tsx renders an email component), so those can be
  // tested by calling them rather than by reading their source.
  plugins: [react()],
  test: {
    environment: "node",
    globals: true,
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
    // The default 10 s is too short for a `beforeAll` that opens Prisma and
    // writes a month of fixtures on a cold connection: it failed on timing, not
    // on behaviour, and the failure said nothing about the code under test.
    hookTimeout: 60_000,
    // Same reason, for a test that drives the whole payment door and then the
    // whole receipt action (the quittance suites give their own budget on top).
    testTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "@react-pdf/renderer": path.resolve(__dirname, "./src/__tests__/__mocks__/@react-pdf/renderer.ts"),
    },
  },
});
