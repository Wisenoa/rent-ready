import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "eslint-config-next";

/**
 * Flat config for ESLint 9.
 *
 * Two things changed to make linting run at all:
 *
 * 1. `@rushstack/eslint-patch` is gone. It monkey-patched ESLint internals and
 *    crashed on ESLint 9 ("Failed to patch ESLint because the calling module was
 *    not recognized"), so `pnpm lint` had never run successfully in this repo.
 *    `eslint-config-next` v16 no longer depends on it.
 *
 * 2. `eslint-config-next` v16 default-exports an array of flat-config objects
 *    (it used to export a legacy config object you spread). Spreading it as a
 *    function (`...nextPlugin()`) throws "nextPlugin is not a function".
 */
const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    // ~12k-line content literal; its integrity is asserted by
    // src/__tests__/lib/articles-integrity.test.ts instead of by lint.
    "src/data/articles.ts",
    // Generated from articles.ts by scripts/gen-article-meta.mjs.
    "src/data/articles-meta.ts",
  ]),
  ...nextPlugin,
  {
    rules: {
      // French copy is full of apostrophes ("dépôt de garantie", "l'état des
      // lieux"). Requiring `&apos;` in 75 files made the text unreadable and is
      // not a real correctness risk — React escapes text content automatically.
      "react/no-unescaped-entities": [
        "error",
        { forbid: [">", '"', "}"] },
      ],
    },
  },
]);

export default eslintConfig;