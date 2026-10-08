import { chromium } from "@playwright/test";
import { spawn, execSync } from "node:child_process";
import { mkdirSync, copyFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PORT = 4902;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/b2/planches");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/b2";

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
  // ── 5 HEROES DESKTOP (1440) ──
  {
    id: "hero_01_1440",
    name: "Hero 1 (Category First) · Desktop 1440px",
    category: "heroes_desktop",
    view: "hero_01_1440",
    width: 1440,
    height: 900,
    fullPage: false,
  },
  {
    id: "hero_02_1440",
    name: "Hero 2 (Outcome First) · Desktop 1440px",
    category: "heroes_desktop",
    view: "hero_02_1440",
    width: 1440,
    height: 900,
    fullPage: false,
  },
  {
    id: "hero_03_1440",
    name: "Hero 3 (Exception First) · Desktop 1440px",
    category: "heroes_desktop",
    view: "hero_03_1440",
    width: 1440,
    height: 900,
    fullPage: false,
  },
  {
    id: "hero_04_1440",
    name: "Hero 4 (Product First) · Desktop 1440px",
    category: "heroes_desktop",
    view: "hero_04_1440",
    width: 1440,
    height: 900,
    fullPage: false,
  },
  {
    id: "hero_05_1440",
    name: "Hero 5 (Hybrid Recommandé) · Desktop 1440px",
    category: "heroes_desktop",
    view: "hero_05_1440",
    width: 1440,
    height: 900,
    fullPage: false,
  },

  // ── 5 HEROES MOBILE (390) ──
  {
    id: "hero_01_390",
    name: "Hero 1 (Category First) · Mobile 390px (iPhone 15/16)",
    category: "heroes_mobile",
    view: "hero_01_390",
    width: 390,
    height: 844,
    fullPage: false,
  },
  {
    id: "hero_02_390",
    name: "Hero 2 (Outcome First) · Mobile 390px",
    category: "heroes_mobile",
    view: "hero_02_390",
    width: 390,
    height: 844,
    fullPage: false,
  },
  {
    id: "hero_03_390",
    name: "Hero 3 (Exception First) · Mobile 390px",
    category: "heroes_mobile",
    view: "hero_03_390",
    width: 390,
    height: 844,
    fullPage: false,
  },
  {
    id: "hero_04_390",
    name: "Hero 4 (Product First) · Mobile 390px",
    category: "heroes_mobile",
    view: "hero_04_390",
    width: 390,
    height: 844,
    fullPage: false,
  },
  {
    id: "hero_05_390",
    name: "Hero 5 (Hybrid Recommandé) · Mobile 390px",
    category: "heroes_mobile",
    view: "hero_05_390",
    width: 390,
    height: 844,
    fullPage: false,
  },

  // ── 3 FULL HOMEPAGES DESKTOP (1440) ──
  {
    id: "homepage_a_1440",
    name: "Homepage A (Product Led) · Desktop 1440px",
    category: "homepages_desktop",
    view: "homepage_a_1440",
    width: 1440,
    height: 900,
    fullPage: true,
  },
  {
    id: "homepage_b_1440",
    name: "Homepage B (Problem → Resolution) · Desktop 1440px",
    category: "homepages_desktop",
    view: "homepage_b_1440",
    width: 1440,
    height: 900,
    fullPage: true,
  },
  {
    id: "homepage_c_1440",
    name: "Homepage C (Hybrid Conversion Recommandée) · Desktop 1440px",
    category: "homepages_desktop",
    view: "homepage_c_1440",
    width: 1440,
    height: 900,
    fullPage: true,
  },

  // ── 3 FULL HOMEPAGES MOBILE (390) ──
  {
    id: "homepage_a_390",
    name: "Homepage A (Product Led) · Mobile 390px",
    category: "homepages_mobile",
    view: "homepage_a_390",
    width: 390,
    height: 844,
    fullPage: true,
  },
  {
    id: "homepage_b_390",
    name: "Homepage B (Problem → Resolution) · Mobile 390px",
    category: "homepages_mobile",
    view: "homepage_b_390",
    width: 390,
    height: 844,
    fullPage: true,
  },
  {
    id: "homepage_c_390",
    name: "Homepage C (Hybrid Conversion) · Mobile 390px",
    category: "homepages_mobile",
    view: "homepage_c_390",
    width: 390,
    height: 844,
    fullPage: true,
  },

  // ── STRESS & DEMO STATES ──
  {
    id: "homepage_selected_360",
    name: "Homepage Recommandée C · Stress Test Mobile 360px (Galaxy)",
    category: "stress_demo",
    view: "homepage_selected_360",
    width: 360,
    height: 800,
    fullPage: true,
  },
  {
    id: "product_demo_before",
    name: "Démo État 1 · Attention (Solde manquant de 400 €)",
    category: "stress_demo",
    view: "product_demo_before",
    width: 1440,
    height: 800,
    fullPage: false,
  },
  {
    id: "product_demo_attention",
    name: "Démo État 2 · Action Requise (Reçu partiel & Relance)",
    category: "stress_demo",
    view: "product_demo_attention",
    width: 1440,
    height: 800,
    fullPage: false,
  },
  {
    id: "product_demo_resolved",
    name: "Démo État 3 · Résolu & Calme (Quittance de solde émise)",
    category: "stress_demo",
    view: "product_demo_resolved",
    width: 1440,
    height: 800,
    fullPage: false,
  },
];

async function main() {
  console.log(`Starting capture process for ${PLANCHES.length} planches...`);

  // Start Next.js dev server on isolated port
  console.log(`Launching isolated Next.js server on port ${PORT}...`);
  const server = spawn("pnpm", ["exec", "next", "dev", "-p", String(PORT)], {
    stdio: "inherit",
    env: { ...process.env, PORT: String(PORT) },
  });

  const cleanup = () => {
    try {
      server.kill("SIGTERM");
    } catch {
      // ignore
    }
  };
  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  try {
    await waitForServer(`${BASE_URL}/design-preview/b2?view=homepage_c_1440`, 60000);
    console.log(`Server is ready at ${BASE_URL}!`);

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const context = await browser.newContext({
      deviceScaleFactor: 2, // High-DPI retina captures
    });

    for (let i = 0; i < PLANCHES.length; i++) {
      const planche = PLANCHES[i];
      console.log(`[${i + 1}/${PLANCHES.length}] Capturing: ${planche.id} (${planche.name})...`);

      const page = await context.newPage();
      await page.setViewportSize({
        width: planche.width,
        height: planche.height,
      });

      const url = `${BASE_URL}/design-preview/b2?view=${planche.view}`;
      let response = await page.goto(url, { waitUntil: "networkidle" });
      if (response && response.status() !== 200) {
        console.log(`Status was ${response.status()}, retrying ${planche.id} in 1s...`);
        await page.waitForTimeout(1000);
        response = await page.goto(url, { waitUntil: "networkidle" });
      }
      await page.waitForTimeout(600); // Allow styles and fonts to settle

      // If capturing standalone demo state, trigger action if needed
      if (planche.id === "product_demo_resolved") {
        const resolveBtn = page.locator("#btn-resolve-demo");
        if (await resolveBtn.count() > 0) {
          await resolveBtn.click();
          await page.waitForTimeout(400);
        }
      }

      const repoPath = join(REPO_OUT_DIR, `${planche.id}.png`);
      const brainPath = join(BRAIN_OUT_DIR, `${planche.id}.png`);

      await page.screenshot({
        path: repoPath,
        fullPage: planche.fullPage,
      });

      copyFileSync(repoPath, brainPath);
      await page.close();
    }

    await browser.close();
    console.log(`All ${PLANCHES.length} screenshots captured successfully!`);

    // ── Generate Gallery HTML ──
    generateGalleryHtml();

    // ── Create ZIP Archive ──
    const zipPath = "/home/ubuntu/rent-ready/rentready-b2-homepage-captures.zip";
    console.log(`Creating ZIP archive at ${zipPath}...`);
    execSync(`python3 -c "
import zipfile, glob, os
with zipfile.ZipFile('${zipPath}', 'w', zipfile.ZIP_DEFLATED) as z:
    for f in glob.glob('${REPO_OUT_DIR}/*.png'):
        z.write(f, os.path.basename(f))
    gallery = 'docs/design/b2/gallery.html'
    if os.path.exists(gallery):
        z.write(gallery, 'gallery.html')
"`);
    console.log(`ZIP created successfully at: ${zipPath}`);

  } finally {
    cleanup();
  }
}

function generateGalleryHtml() {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RentReady B.2 — Galerie d'Épreuve des 5 Héros & 3 Homepages</title>
  <style>
    :root {
      --bg: #F5F3EF;
      --card-bg: #FFFFFF;
      --ink: #15241F;
      --muted: #5A6660;
      --forest: #1E3A2F;
      --border: #E5E2DA;
      --accent: #A3E635;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.5;
      padding-bottom: 80px;
    }
    header {
      background: var(--ink);
      color: white;
      padding: 24px 32px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .title-group h1 { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .title-group p { font-size: 13px; color: #94A3B8; margin-top: 4px; }
    nav.filter-nav { display: flex; gap: 8px; flex-wrap: wrap; }
    nav.filter-nav a {
      background: rgba(255,255,255,0.1);
      color: white;
      text-decoration: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s;
    }
    nav.filter-nav a:hover, nav.filter-nav a.active {
      background: var(--accent);
      color: var(--ink);
    }
    main { max-width: 1400px; margin: 32px auto; padding: 0 24px; }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--forest);
      margin: 40px 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    .grid-mobile {
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
    }
    .card-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FAFAF8;
    }
    .card-title { font-size: 13px; font-weight: 600; color: var(--ink); }
    .card-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--border);
      color: var(--muted);
      font-weight: 500;
    }
    .card-badge.rec { background: #DCFCE7; color: #166534; font-weight: 700; }
    .card-body {
      padding: 12px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      background: #ECEAE4;
      overflow: auto;
      max-height: 600px;
    }
    .card-body img {
      width: 100%;
      height: auto;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: block;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      <div class="title-group">
        <h1>RentReady B.2 — Galerie d'Épreuve Comparative</h1>
        <p>5 Stratégies de Hero (Desktop & Mobile) · 3 Architectures de Homepage · Démonstration Interactive</p>
      </div>
      <nav class="filter-nav">
        <a href="#heroes-desktop">5 Héros Desktop</a>
        <a href="#heroes-mobile">5 Héros Mobile</a>
        <a href="#homepages">3 Homepages</a>
        <a href="#demo">Démo États</a>
      </nav>
    </div>
  </header>

  <main>
    <!-- SECTION 1: 5 HEROES DESKTOP -->
    <h2 id="heroes-desktop" class="section-title">
      <span>1. Les 5 Stratégies de Hero (Desktop 1440px)</span>
      <span style="font-size: 12px; font-weight: normal; color: var(--muted);">Comparaison des angles H1 et visibilité produit</span>
    </h2>
    <div class="grid">
      ${PLANCHES.filter(p => p.category === "heroes_desktop").map(p => `
        <div class="card">
          <div class="card-header">
            <span class="card-title">${p.name}</span>
            <span class="card-badge ${p.id.includes("05") ? "rec" : ""}">${p.id.includes("05") ? "RECOMMANDÉ ★" : "VARIANTE"}</span>
          </div>
          <div class="card-body">
            <a href="planches/${p.id}.png" target="_blank">
              <img src="planches/${p.id}.png" alt="${p.name}" loading="lazy">
            </a>
          </div>
        </div>
      `).join("")}
    </div>

    <!-- SECTION 2: 5 HEROES MOBILE -->
    <h2 id="heroes-mobile" class="section-title">
      <span>2. Les 5 Héros sur Mobile (390px — iPhone 15/16)</span>
      <span style="font-size: 12px; font-weight: normal; color: var(--muted);">Discipline du 1er viewport : produit visible sans scroll excessif</span>
    </h2>
    <div class="grid grid-mobile">
      ${PLANCHES.filter(p => p.category === "heroes_mobile").map(p => `
        <div class="card">
          <div class="card-header">
            <span class="card-title">${p.name}</span>
            <span class="card-badge ${p.id.includes("05") ? "rec" : ""}">${p.id.includes("05") ? "RECOMMANDÉ ★" : "VARIANTE"}</span>
          </div>
          <div class="card-body">
            <a href="planches/${p.id}.png" target="_blank">
              <img src="planches/${p.id}.png" alt="${p.name}" loading="lazy">
            </a>
          </div>
        </div>
      `).join("")}
    </div>

    <!-- SECTION 3: 3 FULL HOMEPAGES -->
    <h2 id="homepages" class="section-title">
      <span>3. Les 3 Architectures Complètes de Homepage (Desktop & Mobile)</span>
      <span style="font-size: 12px; font-weight: normal; color: var(--muted);">Storytelling, piliers métier, rigueur légale, outils et tarifs</span>
    </h2>
    <div class="grid">
      ${PLANCHES.filter(p => p.category.startsWith("homepages")).map(p => `
        <div class="card">
          <div class="card-header">
            <span class="card-title">${p.name}</span>
            <span class="card-badge ${p.id.includes("homepage_c") ? "rec" : ""}">${p.id.includes("homepage_c") ? "RECOMMANDÉE ★" : "ALTERNATIVE"}</span>
          </div>
          <div class="card-body">
            <a href="planches/${p.id}.png" target="_blank">
              <img src="planches/${p.id}.png" alt="${p.name}" loading="lazy">
            </a>
          </div>
        </div>
      `).join("")}
    </div>

    <!-- SECTION 4: DEMO STATES & STRESS -->
    <h2 id="demo" class="section-title">
      <span>4. États de l'Interaction Produit & Stress Test 360px</span>
      <span style="font-size: 12px; font-weight: normal; color: var(--muted);">Attention → Action → Résolution et affichage Samsung Galaxy</span>
    </h2>
    <div class="grid">
      ${PLANCHES.filter(p => p.category === "stress_demo").map(p => `
        <div class="card">
          <div class="card-header">
            <span class="card-title">${p.name}</span>
            <span class="card-badge">INTERACTION</span>
          </div>
          <div class="card-body">
            <a href="planches/${p.id}.png" target="_blank">
              <img src="planches/${p.id}.png" alt="${p.name}" loading="lazy">
            </a>
          </div>
        </div>
      `).join("")}
    </div>
  </main>
</body>
</html>
`;

  const repoGallery = join(process.cwd(), "docs/design/b2/gallery.html");
  const brainGallery = join(BRAIN_OUT_DIR, "gallery.html");

  writeFileSync(repoGallery, html, "utf-8");
  writeFileSync(brainGallery, html, "utf-8");
  console.log(`Gallery HTML saved to ${repoGallery}`);
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
