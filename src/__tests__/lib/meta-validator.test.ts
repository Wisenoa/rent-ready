import { describe, it, expect } from "vitest";
const { extractMetadata, RULES, Reporter } = require("../../../seo-checks/meta-validator.js");

describe("Metadata Validator (TECH-02)", () => {
  describe("1. Metadata Statiques", () => {
    it("extrait et valide un export statique conforme", () => {
      const code = `
        import type { Metadata } from "next";
        export const metadata: Metadata = {
          title: "Logiciel de Gestion Locative",
          description: "Gérez vos locations sereinement avec RentReady. Suivi des loyers, quittances conformes loi 1989 et alertes automatiques.",
          alternates: { canonical: "https://www.rentready.fr/logiciel" },
          robots: { index: true, follow: true },
          openGraph: {
            title: "Logiciel de Gestion Locative",
            description: "Gérez vos locations sereinement avec RentReady.",
            images: ["/og-image.png"]
          }
        };
        export default function Page() { return <div>Page</div>; }
      `;

      const { issues, metadata } = extractMetadata(code);
      expect(issues).toEqual([]);
      expect(metadata).not.toBeNull();
      expect(metadata.title).toBe("Logiciel de Gestion Locative");
      expect(metadata._hasAlternates).toBe(true);
      expect(metadata._hasRobots).toBe(true);
      expect(metadata._hasOpenGraph).toBe(true);
      expect(metadata._hasOgImages).toBe(true);

      const reporter = new Reporter();
      reporter.checkPage("src/app/(marketing)/test/page.tsx", { issues, metadata });
      expect(reporter.errorCount).toBe(0);
    });
  });

  describe("2. Metadata Dynamiques (generateMetadata)", () => {
    it("extrait et valide generateMetadata utilisant baseMetadata", () => {
      const code = `
        import { baseMetadata } from "@/lib/seo/metadata";
        export async function generateMetadata() {
          return baseMetadata({
            title: "Calculateur Révision Loyer IRL 2026",
            description: "Calculez gratuitement la révision de votre loyer avec l'indice officiel INSEE. Formule conforme et simulation instantanée sans inscription.",
            url: "/outils/calculateur-irl",
          });
        }
        export default function Page() { return <div>IRL</div>; }
      `;

      const { issues, metadata } = extractMetadata(code);
      expect(issues).toEqual([]);
      expect(metadata).not.toBeNull();
      expect(metadata._isDynamic).toBe(true);
      expect(metadata.title).toBe("Calculateur Révision Loyer IRL 2026");
      expect(metadata.description).toContain("Calculez gratuitement");
      expect(metadata._hasAlternates).toBe(true);
      expect(metadata._hasRobots).toBe(true);
      expect(metadata._hasOpenGraph).toBe(true);

      const reporter = new Reporter();
      reporter.checkPage("src/app/(marketing)/outils/calculateur-irl/page.tsx", { issues, metadata });
      expect(reporter.errorCount).toBe(0);
    });

    it("gère les variables locales et template strings dans generateMetadata", () => {
      const code = `
        export async function generateMetadata({ params }) {
          const { ville } = await params;
          const title = \`Gestion locative à \${ville}\`;
          const description = \`Gérez vos logements à \${ville} sans tableur. Quittances conformes et suivi des paiements en temps réel.\`;
          return baseMetadata({ title, description, url: \`/gestion-locative/\${ville}\` });
        }
      `;

      const { issues, metadata } = extractMetadata(code);
      expect(issues).toEqual([]);
      expect(metadata).not.toBeNull();
      expect(metadata.title).toBe("Gestion locative à ${ville}");
      expect(metadata.description).toContain("Gérez vos logements à ${ville}");

      const reporter = new Reporter();
      reporter.checkPage("src/app/(marketing)/gestion-locative/[ville]/page.tsx", { issues, metadata });
      expect(reporter.errorCount).toBe(0);
    });
  });

  describe("3. Metadata Absentes", () => {
    it("détecte l'absence de metadata sans crasher ni faire d'erreur silencieuse", () => {
      const code = `
        export default function Page() {
          return <div>Page sans metadata</div>;
        }
      `;

      const { issues, metadata } = extractMetadata(code);
      expect(metadata).toBeNull();
      expect(issues.some((i: { rule: string }) => i.rule === "no-metadata")).toBe(true);

      const reporter = new Reporter();
      // Ne doit PAS crasher avec "Cannot read properties of null (reading 'title')"
      expect(() => {
        reporter.checkPage("src/app/(marketing)/orphan/page.tsx", { issues, metadata });
      }).not.toThrow();

      expect(reporter.errorCount).toBeGreaterThan(0);
      expect(reporter.results.some((r: { ruleId: string }) => r.ruleId === "no-metadata")).toBe(true);
    });
  });

  describe("4. Erreurs Réelles & Non Régression", () => {
    it("signale un titre manquant comme erreur bloquante", () => {
      const code = `
        export const metadata = {
          description: "Description valide de plus de 50 caractères pour passer le test de longueur.",
          alternates: { canonical: "/test" },
          robots: { index: true, follow: true },
          openGraph: { title: "OG", description: "Desc", images: ["/img.png"] },
        };
      `;
      const { issues, metadata } = extractMetadata(code);
      const reporter = new Reporter();
      reporter.checkPage("src/app/(marketing)/no-title/page.tsx", { issues, metadata });
      expect(reporter.errorCount).toBeGreaterThan(0);
      expect(reporter.results.some((r: { ruleId: string }) => r.ruleId === "title-required")).toBe(true);
    });

    it("signale un titre trop long (> 75 caractères)", () => {
      const longTitle = "A".repeat(85);
      const code = `
        export const metadata = {
          title: "${longTitle}",
          description: "Description valide de plus de 50 caractères pour passer le test de longueur.",
          alternates: { canonical: "/test" },
          robots: { index: true, follow: true },
          openGraph: { title: "OG", description: "Desc", images: ["/img.png"] },
        };
      `;
      const { issues, metadata } = extractMetadata(code);
      const reporter = new Reporter();
      reporter.checkPage("src/app/(marketing)/long-title/page.tsx", { issues, metadata });
      expect(reporter.results.some((r: { ruleId: string }) => r.ruleId === "title-length")).toBe(true);
    });

    it("signale les console.log interdits en production", () => {
      const code = `
        export const metadata = { title: "T", description: "D", alternates: {}, robots: {}, openGraph: { images: [] } };
        console.log("debug info");
      `;
      const { issues, metadata } = extractMetadata(code);
      expect(issues.some((i: { rule: string }) => i.rule === "no-console-log")).toBe(true);
    });

    it("signale les titres dupliqués entre routes marketing", () => {
      const reporter = new Reporter();
      const titleMap = new Map([
        ["/route-a", "Mon Titre Identique"],
        ["/route-b", "Mon Titre Identique"],
      ]);
      reporter.checkDuplicates(titleMap);
      expect(reporter.errorCount).toBe(2);
      expect(reporter.results.every((r: { ruleId: string }) => r.ruleId === "duplicate-title")).toBe(true);
    });
  });
});
