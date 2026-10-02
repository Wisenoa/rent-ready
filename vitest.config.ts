import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Needed to import server-action modules that also contain JSX
  // (transaction-actions.tsx renders an email component), so those can be
  // tested by calling them rather than by reading their source.
  plugins: [react()],
  test: {
    environment: "node",
    globals: true,
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "@react-pdf/renderer": path.resolve(__dirname, "./src/__tests__/__mocks__/@react-pdf/renderer.ts"),
    },
  },
});
