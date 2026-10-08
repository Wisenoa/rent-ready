import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 4901;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/b1/planches");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/b1-refinement";

mkdirSync(REPO_OUT_DIR, { recursive: true });
mkdirSync(BRAIN_OUT_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        return true;
      }
    } catch {
      // server still starting
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

const PLANCHES = [
  // ── PRODUCT SURFACES ──
  {
    id: "dashboard_default_1440",
    name: "Dashboard Défaut · 3 Biens & Exception Nantes",
    category: "product",
    view: "dashboard_default_1440",
    width: 1440,
    height: 900,
  },
  {
    id: "dashboard_dense_1440",
    name: "Dashboard Dense · Stress Test 10 Logements (Calm ≠ Card)",
    category: "product",
    view: "dashboard_dense_1440",
    width: 1440,
    height: 1050,
  },
  {
    id: "dashboard_exceptions_1440",
    name: "Dashboard · 3 Exceptions Simultanées",
    category: "product",
    view: "dashboard_exceptions_1440",
    width: 1440,
    height: 950,
  },
  {
    id: "dashboard_390",
    name: "Dashboard Mobile (390px · iPhone 15/16)",
    category: "product",
    view: "dashboard_390",
    width: 440,
    height: 920,
  },
  {
    id: "dashboard_360",
    name: "Dashboard Mobile Compact (360px · Android Compact)",
    category: "product",
    view: "dashboard_360",
    width: 400,
    height: 880,
  },
  {
    id: "home_base_1440",
    name: "Home Base Bien · T2 Nantes & Registre Documentaire",
    category: "product",
    view: "home_base_1440",
    width: 1440,
    height: 980,
  },
  {
    id: "billing_1440",
    name: "Encaissements & Journal des Règlements",
    category: "product",
    view: "billing_1440",
    width: 1440,
    height: 900,
  },
  {
    id: "lease_detail_1440",
    name: "Bail en Détail & Indexation IRL",
    category: "product",
    view: "lease_detail_1440",
    width: 1440,
    height: 900,
  },
  {
    id: "lease_form_1440",
    name: "Création de Bail · Blocs Aérés & Synthèse Loi 1989",
    category: "product",
    view: "lease_form_1440",
    width: 1440,
    height: 950,
  },
  {
    id: "lease_form_errors_390",
    name: "Formulaire Bail Mobile · Gestion Erreurs de Validation",
    category: "product",
    view: "lease_form_errors_390",
    width: 440,
    height: 980,
  },

  // ── PUBLIC & SEO SURFACES ──
  {
    id: "homepage_1440",
    name: "Homepage B.1 · Composition H3 Exception Demo (Recommandé)",
    category: "public",
    view: "homepage_1440",
    width: 1440,
    height: 1200,
  },
  {
    id: "homepage_h1_1440",
    name: "Homepage B.1 · Composition H1 Product First",
    category: "public",
    view: "homepage_h1_1440",
    width: 1440,
    height: 1200,
  },
  {
    id: "homepage_h2_1440",
    name: "Homepage B.1 · Composition H2 Outcome First",
    category: "public",
    view: "homepage_h2_1440",
    width: 1440,
    height: 1200,
  },
  {
    id: "homepage_390",
    name: "Homepage Mobile (390px)",
    category: "public",
    view: "homepage_390",
    width: 440,
    height: 950,
  },
  {
    id: "pricing_1440",
    name: "Tarifs B.1 · Starter (9 €) & Pro (15 €)",
    category: "public",
    view: "pricing_1440",
    width: 1440,
    height: 900,
  },
  {
    id: "pricing_390",
    name: "Tarifs Mobile (390px)",
    category: "public",
    view: "pricing_390",
    width: 440,
    height: 950,
  },
  {
    id: "free_tool_1440",
    name: "Outil Gratuit · Calculateur IRL 2026 & Passerelle Produit",
    category: "public",
    view: "free_tool_1440",
    width: 1440,
    height: 950,
  },
  {
    id: "free_tool_390",
    name: "Calculateur IRL Mobile (390px)",
    category: "public",
    view: "free_tool_390",
    width: 440,
    height: 920,
  },
  {
    id: "free_tool_quittance_1440",
    name: "Outil Gratuit · Générateur de Quittance & Aperçu Direct",
    category: "public",
    view: "free_tool_quittance_1440",
    width: 1440,
    height: 950,
  },
  {
    id: "article_1440",
    name: "Guide SEO · Révision Loyer IRL 2026",
    category: "public",
    view: "article_1440",
    width: 1440,
    height: 1050,
  },
  {
    id: "article_390",
    name: "Guide SEO Mobile (390px)",
    category: "public",
    view: "article_390",
    width: 440,
    height: 950,
  },
  {
    id: "city_page_1440",
    name: "Page Locale Programmatique · Gestion Locative Nantes",
    category: "public",
    view: "city_page_1440",
    width: 1440,
    height: 950,
  },
  {
    id: "register_1440",
    name: "Inscription & Entrée dans l'Atelier",
    category: "public",
    view: "register_1440",
    width: 1440,
    height: 850,
  },
  {
    id: "register_390",
    name: "Inscription Mobile (390px)",
    category: "public",
    view: "register_390",
    width: 440,
    height: 850,
  },

  // ── BRAND SHEETS ──
  {
    id: "wordmark_sheet",
    name: "Planche Marque · Wordmark (4 Pistes Comparées)",
    category: "brand",
    view: "wordmark_sheet",
    width: 1440,
    height: 950,
  },
  {
    id: "app_icon_sheet",
    name: "Planche Marque · Symboles & Icône d'Application",
    category: "brand",
    view: "app_icon_sheet",
    width: 1440,
    height: 900,
  },
  {
    id: "color_sheet",
    name: "Planche Marque · Tokens OKLCH & Matrice Chromatique",
    category: "brand",
    view: "color_sheet",
    width: 1440,
    height: 950,
  },
  {
    id: "typography_sheet",
    name: "Planche Marque · Plus Jakarta Sans & Chiffres Tabulaires",
    category: "brand",
    view: "typography_sheet",
    width: 1440,
    height: 950,
  },
  {
    id: "motion_storyboard",
    name: "Planche Marque · Storyboard Rétraction (4 Temps)",
    category: "brand",
    view: "motion_storyboard",
    width: 1440,
    height: 950,
  },
];

async function main() {
  console.log(`Starting isolated Next.js dev server on port ${PORT}...`);
  const server = spawn("pnpm", ["exec", "next", "dev", "-p", String(PORT)], {
    stdio: "inherit",
    detached: false,
    env: {
      ...process.env,
      PORT: String(PORT),
      BETTER_AUTH_URL: BASE_URL,
      NEXT_PUBLIC_APP_URL: BASE_URL,
      NEXT_PUBLIC_AUTH_URL: BASE_URL,
    },
  });

  try {
    await waitForServer(`${BASE_URL}/design-preview/b1?view=homepage_1440`);
    console.log("Next.js server is ready! Launching Playwright browser...");

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const setupPage = async (page) => {
      await page.addStyleTag({
        content: `
          nextjs-portal, [data-nextjs-dev-overlay], #nextjs-dev-indicator, [data-nextjs-toast], [data-testid="cookie-banner"] {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `,
      });
    };

    console.log(`Capturing ${PLANCHES.length} high-resolution planches...`);

    for (let i = 0; i < PLANCHES.length; i++) {
      const item = PLANCHES[i];
      console.log(`[${i + 1}/${PLANCHES.length}] Capturing ${item.id} (${item.name})...`);

      const context = await browser.newContext({
        viewport: { width: item.width, height: item.height },
        deviceScaleFactor: 2,
        locale: "fr-FR",
        timezoneId: "Europe/Paris",
      });

      const page = await context.newPage();
      const targetUrl = `${BASE_URL}/design-preview/b1?view=${item.view}`;
      await page.goto(targetUrl, { waitUntil: "networkidle" });
      await setupPage(page);
      await page.waitForTimeout(600);

      const filename = `${item.id}.png`;
      const repoPath = join(REPO_OUT_DIR, filename);
      const brainPath = join(BRAIN_OUT_DIR, filename);

      await page.screenshot({ path: repoPath, fullPage: false });
      copyFileSync(repoPath, brainPath);

      await context.close();
    }

    await browser.close();
    console.log("All planches successfully captured!");

    // Generate Gallery HTML
    console.log("Generating visual gallery...");
    const galleryHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>RentReady B.1 — Galerie Officielle des Planches (Modern French Atelier)</title>
  <style>
    :root {
      --bg: #F5F3EF;
      --card: #FFFFFF;
      --ink: #15241F;
      --muted: #5A6660;
      --border: #E5E2DA;
      --brand: #1E3A2F;
    }
    body {
      margin: 0;
      padding: 32px;
      background: var(--bg);
      color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }
    h1 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background: #EEF4F1;
      color: var(--brand);
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .categories {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
    .category-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      border-left: 3px solid var(--brand);
      padding-left: 10px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
      gap: 24px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(21, 36, 31, 0.05);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(21, 36, 31, 0.08);
    }
    .img-wrap {
      width: 100%;
      height: 260px;
      background: #ECEAE4;
      overflow: hidden;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
    .img-wrap img {
      width: 100%;
      height: auto;
      display: block;
    }
    .card-meta {
      padding: 16px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .card-id {
      font-family: monospace;
      font-size: 11px;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">Système B.1 · Modern French Atelier</div>
    <h1>RentReady — Galerie de Validation des Planches Visuelles</h1>
    <p>29 planches haute résolution capturées sous Playwright (fr-FR, Europe/Paris, retina 2x). Discipline CALM ≠ CARD, conversion publique & planches de marque.</p>
  </header>

  <div class="categories">
    <section>
      <div class="category-title">1. Surfaces Produit (10 Planches)</div>
      <div class="grid">
        ${PLANCHES.filter((p) => p.category === "product")
          .map(
            (p) => `
          <div class="card">
            <div class="img-wrap">
              <a href="${p.id}.png" target="_blank">
                <img src="${p.id}.png" alt="${p.name}" loading="lazy" />
              </a>
            </div>
            <div class="card-meta">
              <div class="card-title">${p.name}</div>
              <div class="card-id">${p.id}.png (${p.width}px)</div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </section>

    <section>
      <div class="category-title">2. Surfaces Publiques & SEO (14 Planches)</div>
      <div class="grid">
        ${PLANCHES.filter((p) => p.category === "public")
          .map(
            (p) => `
          <div class="card">
            <div class="img-wrap">
              <a href="${p.id}.png" target="_blank">
                <img src="${p.id}.png" alt="${p.name}" loading="lazy" />
              </a>
            </div>
            <div class="card-meta">
              <div class="card-title">${p.name}</div>
              <div class="card-id">${p.id}.png (${p.width}px)</div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </section>

    <section>
      <div class="category-title">3. Planches de Marque (5 Planches)</div>
      <div class="grid">
        ${PLANCHES.filter((p) => p.category === "brand")
          .map(
            (p) => `
          <div class="card">
            <div class="img-wrap">
              <a href="${p.id}.png" target="_blank">
                <img src="${p.id}.png" alt="${p.name}" loading="lazy" />
              </a>
            </div>
            <div class="card-meta">
              <div class="card-title">${p.name}</div>
              <div class="card-id">${p.id}.png (${p.width}px)</div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </section>
  </div>
</body>
</html>`;

    writeFileSync(join(REPO_OUT_DIR, "gallery.html"), galleryHtml, "utf8");
    writeFileSync(join(BRAIN_OUT_DIR, "gallery.html"), galleryHtml, "utf8");
    console.log("Gallery successfully written to repo and brain artifacts!");
  } finally {
    console.log("Stopping Next.js dev server...");
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
