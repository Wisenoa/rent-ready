import { chromium } from "@playwright/test";
import { unlinkSync, existsSync } from "node:fs";

const PORT = 4910;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function testRegression() {
  console.log(`Connecting to ${BASE_URL}...`);
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const errors = [];
  const logConsole = (p, name) => {
    p.on("pageerror", (err) => {
      console.error(`[${name}] Page Error:`, err.message);
      errors.push(`[${name}] Page Error: ${err.message}`);
    });
    p.on("response", (res) => {
      if (res.status() >= 400) {
        console.log(`[${name}] HTTP ${res.status()}: ${res.url()}`);
      }
    });
    p.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        // Ignore expected unauthenticated session check and non-Vercel environment script
        if (!text.includes("_vercel/insights") && !text.includes("api/auth/session") && !text.includes("404")) {
          console.error(`[${name}] Console Error:`, text);
          errors.push(`[${name}] Console Error: ${text}`);
        }
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Quittance Tool: Form, PDF Generation, Download & CTA
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- Testing Quittance Tool (/outils/generateur-quittance) ---");
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    acceptDownloads: true,
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  logConsole(page, "quittance");

  await page.goto(`${BASE_URL}/outils/generateur-quittance`, { waitUntil: "networkidle" });

  // Dismiss cookie banner
  const cookieBtn = page.locator('button:has-text("Accepter")');
  if (await cookieBtn.isVisible()) await cookieBtn.click();

  // Fill form
  await page.fill("#q-email", "test.bailleur@rentready.fr");
  await page.fill("#q-bailleur-nom", "Alexandre Martin");
  await page.fill("#q-locataire-nom", "Sophie Bernard");
  await page.fill("#q-bailleur-adresse", "10 boulevard Saint-Germain, 75005 Paris");
  await page.fill("#q-loyer", "850");
  await page.fill("#q-charges", "65");

  // Trigger PDF Generation and catch download event
  const submitBtn = page.locator('button[type="submit"]');
  console.log("Triggering PDF generation...");
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 15000 }),
    submitBtn.click(),
  ]);

  const filename = download.suggestedFilename();
  console.log(`Download received: ${filename}`);
  if (!filename.endsWith(".pdf")) {
    throw new Error(`Expected .pdf extension, got ${filename}`);
  }

  const tempPath = `/tmp/${filename}`;
  await download.saveAs(tempPath);
  if (!existsSync(tempPath)) {
    throw new Error(`Downloaded PDF file not saved to disk at ${tempPath}`);
  }
  console.log("PDF successfully generated and saved to disk!");
  unlinkSync(tempPath);

  // Verify persistent success card and CTA
  await page.waitForSelector("text=Votre quittance de loyer PDF a été téléchargée avec succès.", { timeout: 5000 });
  const ctaQuittance = page.locator('a[href="/register"]:has-text("Essayer gratuitement")');
  if (!(await ctaQuittance.isVisible())) {
    throw new Error("Quittance CTA button to /register is not visible");
  }
  console.log("Quittance CTA verified visible.");

  // Test CTA link target
  const ctaHref = await ctaQuittance.getAttribute("href");
  if (ctaHref !== "/register") {
    throw new Error(`Expected CTA href to be /register, got ${ctaHref}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Lettre Relance Loyer: Preview, Copy feedback & CTA
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- Testing Relance Tool (/outils/lettre-relance-loyer) ---");
  await page.goto(`${BASE_URL}/outils/lettre-relance-loyer`, { waitUntil: "networkidle" });
  if (await cookieBtn.isVisible()) await cookieBtn.click();

  // Verify preview text contains default content
  const preview = page.locator("text=Objet : Relance pour impayé de loyer");
  if (!(await preview.isVisible())) {
    throw new Error("Letter preview is missing or not visible");
  }
  console.log("Letter preview verified visible.");

  // Click Copy
  const copyBtn = page.getByRole("button", { name: /copier/i });
  await copyBtn.click();
  await page.waitForSelector("text=Copié !", { timeout: 3000 });
  console.log("Copy button feedback ('Copié !') verified.");

  // Verify contextual product CTA
  const ctaRelance = page.locator('a[href="/register"]:has-text("Centraliser mes loyers")');
  if (!(await ctaRelance.isVisible())) {
    throw new Error("Relance CTA button to /register is not visible");
  }
  console.log("Relance CTA verified visible.");

  // Click CTA to test navigation to /register
  console.log("Testing CTA navigation to /register...");
  await Promise.all([
    page.waitForURL("**/register"),
    ctaRelance.click(),
  ]);
  const registerH1 = page.locator("h1");
  console.log(`Navigated to /register successfully. Heading: "${await registerH1.innerText()}"`);
  await context.close();

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Mobile Viewport (390px) Overflow & Responsiveness
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- Testing Mobile 390px Responsiveness ---");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const mobPage = await mobileContext.newPage();
  logConsole(mobPage, "mobile");

  for (const path of ["/outils/generateur-quittance", "/outils/lettre-relance-loyer"]) {
    await mobPage.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
    const hasHorizontalOverflow = await mobPage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`Checking horizontal overflow on ${path}: ${hasHorizontalOverflow ? "OVERFLOW DETECTED!" : "OK (no overflow)"}`);
    if (hasHorizontalOverflow) {
      throw new Error(`Horizontal overflow detected on mobile 390px for ${path}`);
    }
  }
  await mobileContext.close();

  await browser.close();

  // ─────────────────────────────────────────────────────────────────────────────
  // Check console error summary
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- Checking Console Errors & CSP ---");
  const cspErrors = errors.filter((e) => e.includes("Content Security Policy") || e.includes("violates"));
  if (cspErrors.length > 0) {
    throw new Error(`CSP Errors detected:\n${cspErrors.join("\n")}`);
  }
  if (errors.length > 0) {
    throw new Error(`Console/Page Errors detected:\n${errors.join("\n")}`);
  }
  console.log("Zero console errors, zero CSP violations detected!");
  console.log("\n✅ ALL REGRESSION TESTS PASSED CLEANLY!");
}

testRegression().catch((err) => {
  console.error("\n❌ Regression test failed:", err);
  process.exit(1);
});
