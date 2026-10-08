import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 4899;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/visual-identity-exploration/planches");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/visual-exploration";

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
      // wait
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

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
    await waitForServer(`${BASE_URL}/design-preview/exploration?dir=a&screen=dashboard`);
    console.log("Server is ready! Launching Playwright browser with French locale (fr-FR)...");

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const setupPage = async (page) => {
      await page.addStyleTag({
        content: `
          nextjs-portal, [data-nextjs-dev-overlay], #nextjs-dev-indicator, [data-nextjs-toast], [data-testid="cookie-banner"], [data-preview-nav] {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `,
      });
    };

    const screens = [
      { id: "dashboard_1440", screen: "dashboard", viewport: { width: 1440, height: 900 }, fullPage: true, label: "Dashboard Desktop 1440" },
      { id: "dashboard_390", screen: "dashboard", viewport: { width: 390, height: 844 }, fullPage: true, label: "Dashboard Mobile 390" },
      { id: "lease_new_1440", screen: "lease_new", viewport: { width: 1440, height: 900 }, fullPage: true, label: "Création Bail Desktop 1440" },
      { id: "lease_new_390", screen: "lease_new", viewport: { width: 390, height: 844 }, fullPage: true, label: "Création Bail Mobile 390" },
      { id: "billing_1440", screen: "billing", viewport: { width: 1440, height: 900 }, fullPage: true, label: "Paiements (Billing) Desktop 1440" },
    ];

    const directions = [
      { key: "a", name: "dir_a", title: "Direction A — Signalétique Foncière" },
      { key: "b", name: "dir_b", title: "Direction B — Modern French Atelier" },
      { key: "c", name: "dir_c", title: "Direction C — Quiet Finance" },
    ];

    const planchesCatalog = [];

    for (const d of directions) {
      for (const s of screens) {
        const filename = `${d.name}_${s.id}.png`;
        const url = `${BASE_URL}/design-preview/exploration?dir=${d.key}&screen=${s.screen}`;

        console.log(`Capturing ${filename} (${s.viewport.width}x${s.viewport.height}) for ${d.title}...`);

        const context = await browser.newContext({
          viewport: s.viewport,
          deviceScaleFactor: 2,
          locale: "fr-FR",
          timezoneId: "Europe/Paris",
        });

        const page = await context.newPage();
        await new Promise((r) => setTimeout(r, 400));
        await page.goto(url, { waitUntil: "networkidle" });
        await setupPage(page);
        await page.waitForTimeout(400);

        const repoPath = join(REPO_OUT_DIR, filename);
        const brainPath = join(BRAIN_OUT_DIR, filename);

        await page.screenshot({ path: repoPath, fullPage: s.fullPage });
        copyFileSync(repoPath, brainPath);

        planchesCatalog.push({
          filename,
          direction: d.key,
          directionTitle: d.title,
          screenId: s.id,
          screenLabel: s.label,
          repoPath,
        });

        console.log(`Saved -> ${repoPath}`);
        await context.close();
      }
    }

    await browser.close();

    // Generate Gallery HTML
    console.log("Generating interactive HTML comparison gallery...");
    const galleryHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>RentReady — Galerie Comparative des 3 Directions Visuelles</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0F172A; color: #F8FAFC; margin: 0; padding: 24px; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    p.lead { color: #94A3B8; font-size: 14px; margin-top: 0; margin-bottom: 32px; }
    .nav-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
    .tab-btn { background: #1E293B; color: #E2E8F0; border: 1px solid #334155; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; }
    .tab-btn.active { background: #2563EB; color: #FFF; border-color: #2563EB; }
    .comparison-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .comparison-col { background: #1E293B; border-radius: 8px; border: 1px solid #334155; overflow: hidden; }
    .col-header { padding: 12px 16px; background: #0F172A; border-bottom: 1px solid #334155; font-size: 13px; font-weight: 600; display: flex; justify-content: space-between; }
    .col-header .badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
    .badge-a { background: #1D4ED8; color: #FFF; }
    .badge-b { background: #1E3A2F; color: #4ADE80; border: 1px solid #2E6F4E; }
    .badge-c { background: #334155; color: #94A3B8; }
    .col-body img { width: 100%; height: auto; display: block; }
    .meta-box { padding: 12px 16px; font-size: 12px; color: #94A3B8; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <h1>RentReady — Galerie Comparative des 3 Directions Visuelles</h1>
  <p class="lead">15 planches capturées en haute résolution avec données métier strictement identiques (3 biens, 2 payés, 1 partiel de 400 €, 1 création de bail).</p>

  <div class="nav-tabs" id="tabs">
    <button class="tab-btn active" onclick="showScreen('dashboard_1440')">Dashboard Desktop (1440)</button>
    <button class="tab-btn" onclick="showScreen('dashboard_390')">Dashboard Mobile (390)</button>
    <button class="tab-btn" onclick="showScreen('lease_new_1440')">Création Bail Desktop (1440)</button>
    <button class="tab-btn" onclick="showScreen('lease_new_390')">Création Bail Mobile (390)</button>
    <button class="tab-btn" onclick="showScreen('billing_1440')">Paiements / Billing (1440)</button>
  </div>

  <div id="views">
    ${screens.map(s => `
      <div class="screen-view" id="view_${s.id}" style="${s.id === 'dashboard_1440' ? '' : 'display:none;'}">
        <div class="comparison-grid">
          <div class="comparison-col">
            <div class="col-header">
              <span>A · Signalétique Foncière</span>
              <span class="badge badge-a">Direction A</span>
            </div>
            <div class="col-body">
              <a href="dir_a_${s.id}.png" target="_blank"><img src="dir_a_${s.id}.png" alt="Direction A ${s.label}"></a>
            </div>
            <div class="meta-box">Pragmatic Utility · Grille technique · Rails mécaniques · Bleu signal</div>
          </div>

          <div class="comparison-col">
            <div class="col-header">
              <span>B · Modern French Atelier</span>
              <span class="badge badge-b">Direction B</span>
            </div>
            <div class="col-body">
              <a href="dir_b_${s.id}.png" target="_blank"><img src="dir_b_${s.id}.png" alt="Direction B ${s.label}"></a>
            </div>
            <div class="meta-box">Clarté Vivante · Fond calcaire doux · Surfaces albâtre · Vert forêt & miel</div>
          </div>

          <div class="comparison-col">
            <div class="col-header">
              <span>C · Quiet Finance</span>
              <span class="badge badge-c">Direction C</span>
            </div>
            <div class="col-body">
              <a href="dir_c_${s.id}.png" target="_blank"><img src="dir_c_${s.id}.png" alt="Direction C ${s.label}"></a>
            </div>
            <div class="meta-box">Précision Calme · Silence visuel · Progressive disclosure · Anthracite doux</div>
          </div>
        </div>
      </div>
    `).join("")}
  </div>

  <script>
    function showScreen(id) {
      document.querySelectorAll('.screen-view').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('view_' + id).style.display = 'block';
      event.target.classList.add('active');
    }
  </script>
</body>
</html>`;

    const galleryPath = join(REPO_OUT_DIR, "gallery.html");
    writeFileSync(galleryPath, galleryHtml);
    copyFileSync(galleryPath, join(BRAIN_OUT_DIR, "gallery.html"));
    console.log(`Gallery saved -> ${galleryPath}`);

    // Summary metadata
    const summaryData = {
      capturedAt: new Date().toISOString(),
      planchesCount: planchesCatalog.length,
      locale: "fr-FR",
      timezone: "Europe/Paris",
      planches: planchesCatalog,
    };
    writeFileSync(join(REPO_OUT_DIR, "planches_manifest.json"), JSON.stringify(summaryData, null, 2));
    console.log("All 15 planches captured and cataloged successfully!");
  } finally {
    console.log("Shutting down dev server...");
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
