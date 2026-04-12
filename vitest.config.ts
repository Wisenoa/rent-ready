import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
    exclude: ["src/__tests__/lib/quittance-generator.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "@react-pdf/renderer": path.resolve(__dirname, "./src/__tests__/__mocks__/@react-pdf/renderer.ts"),
    },
  },
});
