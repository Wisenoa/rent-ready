import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const version = process.argv[2];
const metricsOnly = process.argv.includes('--metrics-only');
if (!['v2', 'v3'].includes(version)) throw new Error('Expected v2 or v3');
const baseURL = process.env.CHALLENGE_BASE_URL ?? 'http://127.0.0.1:3004';
const destination = `docs/design/challenge-v3/captures/${version}`;
await mkdir(destination, { recursive: true });
const browser = await chromium.launch();
const measurements = [];

async function captureRegion(page, locator, path) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const region = await locator.boundingBox();
  if (!region) throw new Error(`Region not found: ${path}`);
  await page.screenshot({ path, fullPage: true, clip: region });
}

async function openPage(width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await context.addInitScript(() => {
    localStorage.setItem('rentready_cookie_consent', 'accepted');
    window.challengeMetrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      window.challengeMetrics.lcp = entries[entries.length - 1].startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    let windowStart = 0;
    let lastShift = 0;
    let windowScore = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        if (entry.startTime - lastShift > 1000 || entry.startTime - windowStart > 5000) {
          windowStart = entry.startTime;
          windowScore = 0;
        }
        windowScore += entry.value;
        lastShift = entry.startTime;
        window.challengeMetrics.cls = Math.max(window.challengeMetrics.cls, windowScore);
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  const page = await context.newPage();
  await page.route('**/api/auth/session', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: '{"user":null}',
  }));
  return { page, context };
}

try {
  // Equalize server-side image optimization and initial module caches before
  // comparing fresh browser contexts. Cold optimization is not a field LCP.
  const warmup = await openPage(1440);
  await warmup.page.goto(`${baseURL}/gestion-locative`, { waitUntil: 'load' });
  await warmup.page.waitForTimeout(1500);
  const identity = await warmup.page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
  }));
  await warmup.context.close();
  for (let run = 1; run <= 3; run++) {
    const { page, context } = await openPage(1440);
    await page.goto(`${baseURL}/gestion-locative`, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    measurements.push(await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);
      return {
        ...window.challengeMetrics,
        domContentLoaded: navigation.domContentLoadedEventEnd,
        load: navigation.loadEventEnd,
        resourceTransferBytes: sum(resources, 'transferSize'),
        javascriptEncodedBytes: sum(resources.filter((item) => item.name.includes('.js')), 'encodedBodySize'),
        imageEncodedBytes: sum(resources.filter((item) => item.name.includes('/_next/image')), 'encodedBodySize'),
      };
    }));
    await context.close();
  }

  const checks = [];
  for (const width of metricsOnly ? [] : [360, 390, 768, 1440]) {
    const { page, context } = await openPage(width);
    const errors = [];
    const failedResources = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', (response) => { if (response.status() >= 400) failedResources.push({ url: response.url(), status: response.status() }); });
    await page.goto(`${baseURL}/gestion-locative`, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.addStyleTag({ content: 'nextjs-portal { display: none; }' });
    const hero = await page.locator('article > section').first().boundingBox();
    if (!hero) throw new Error('Hero not found');
    const heroHeight = Math.ceil(hero.y + hero.height);
    await page.setViewportSize({ width, height: Math.max(900, heroHeight) });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${destination}/hero-${width}.png`, clip: { x: 0, y: 0, width, height: heroHeight } });
    await page.setViewportSize({ width, height: 900 });
    for (let y = 0; y < await page.locator('body').evaluate((body) => body.scrollHeight); y += 700) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${destination}/page-${width}.png`, fullPage: true });
    const demo = page.locator('#demonstration');
    if (await demo.count()) {
      await captureRegion(page, demo, `${destination}/demonstration-${width}.png`);
      const documents = page.getByRole('tab', { name: /Retrouver les quittances/ });
      await documents.click();
      await page.waitForFunction(() => document.querySelector('#rent-demo-tab-1')?.getAttribute('aria-selected') === 'true');
      await page.locator('[role="tabpanel"]:visible img').evaluate((image) => image.decode());
      await captureRegion(page, demo, `${destination}/quittances-${width}.png`);
    }
    await captureRegion(page, page.locator('#fonctionnalites'), `${destination}/features-${width}.png`);
    if (await page.locator('#comparatif').count()) await captureRegion(page, page.locator('#comparatif'), `${destination}/comparison-${width}.png`);
    checks.push({ width, errors, failedResources, ...(await page.evaluate(() => ({
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
      h1Count: document.querySelectorAll('h1').length,
    }))) });
    await context.close();
  }
  await writeFile(`${destination}/${metricsOnly ? 'performance' : 'measurements'}.json`, JSON.stringify({ version, baseURL, serverWarmup: true, identity, measurements, checks }, null, 2));
  console.log(JSON.stringify({ version, measurements, checks }, null, 2));
} finally {
  await browser.close();
}
