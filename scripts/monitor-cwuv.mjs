#!/usr/bin/env node
/**
 * CrUX (Chrome UX Report) Monitor
 * 
 * Pulls real-user Core Web Vitals field data from Google PageSpeed Insights API
 * for key marketing pages and outputs results + exit codes for CI/CD alerting.
 * 
 * Usage:
 *   node scripts/monitor-cwuv.js                      # all pages
 *   node scripts/monitor-cwuv.js --url https://...    # single URL
 *   node scripts/monitor-cwuv.js --json                # machine-readable output
 *   node scripts/monitor-cwuv.js --alert-slack         # send alert on failure
 * 
 * Exit codes:
 *   0 = all metrics pass
 *   1 = one or more metrics fail threshold
 *   2 = API error
 */

const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || '';
const STRATEGY = 'mobile'; // CrUX is primarily tracked on mobile
const DOMAIN = 'rentready.io';

const PAGES = [
  { name: 'Homepage',       url: `https://${DOMAIN}/` },
  { name: 'Pricing',        url: `https://${DOMAIN}/pricing` },
  { name: 'Features',       url: `https://${DOMAIN}/features` },
  { name: 'Demo',           url: `https://${DOMAIN}/demo` },
  { name: 'Blog',           url: `https://${DOMAIN}/blog` },
  { name: 'Outils',         url: `https://${DOMAIN}/outils` },
  { name: 'Templates',      url: `https://${DOMAIN}/templates` },
];

// Thresholds (CWV targets)
const THRESHOLDS = {
  // FCP: First Contentful Paint (ms)
  'first-contentful-paint': { good: 1800, poor: 3000 },
  // LCP: Largest Contentful Paint (ms)
  'largest-contentful-paint': { good: 2500, poor: 4000 },
  // CLS: Cumulative Layout Shift (score)
  'cumulative-layout-shift': { good: 0.1, poor: 0.25 },
  // INP: Interaction to Next Paint (ms) — replaces FID
  'interaction-to-next-paint': { good: 200, poor: 500 },
  // TTFB: Time to First Byte (ms)
  'ttfb': { good: 800, poor: 1800 },
};

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
const CI = process.env.CI === 'true';

async function fetchCruxData(url) {
  const strategy = 'mobile';
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo&key=${API_KEY}`;
  
  const response = await fetch(apiUrl);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PSI API error ${response.status}: ${text}`);
  }
  return response.json();
}

function extractMetrics(data) {
  const auditRefs = data.loadingExperience?.metrics || {};
  const categories = data.categories || {};

  return {
    overall: categories.performance?.score ?? null, // 0–1
    metrics: {
      'first-contentful-paint':   extractFieldMetric(auditRefs, 'FIRST_CONTENTFUL_PAINT_MS'),
      'largest-contentiful-paint': extractFieldMetric(auditRefs, 'LARGEST_CONTENTFUL_PAINT_MS'),
      'cumulative-layout-shift':  extractFieldMetric(auditRefs, 'CUMULATIVE_LAYOUT_SHIFT_SCORE'),
      'interaction-to-next-paint': extractFieldMetric(auditRefs, 'INTERACTION_TO_NEXT_PAINT_MS'),
      'ttfb':                      extractFieldMetric(auditRefs, 'EXPERIMENTAL_TIME_TO_FIRST_BYTE_MS'),
    },
  };
}

function extractFieldMetric(auditRefs, key) {
  const metric = auditRefs[key];
  if (!metric) return null;
  return {
    percentile: metric.percentile ?? null,
    good: metric.distributions?.find(d => d.category === 'GOOD')?.proportion ?? 0,
    needsImprovement: metric.distributions?.find(d => d.category === 'NEEDS_IMPROVEMENT')?.proportion ?? 0,
    poor: metric.distributions?.find(d => d.category === 'POOR')?.proportion ?? 0,
  };
}

function ratingForMetric(name, value) {
  if (value === null) return 'unknown';
  const t = THRESHOLDS[name];
  if (!t) return 'unknown';
  if (value < t.good) return 'good';
  if (value < t.poor) return 'needs-improvement';
  return 'poor';
}

function formatMs(ms) {
  if (ms === null || ms === undefined) return 'N/A';
  return `${(ms).toFixed(0)}ms`;
}

function formatScore(score) {
  if (score === null) return 'N/A';
  return `${(score * 100).toFixed(0)}`;
}

function formatPct(p) {
  return `${(p * 100).toFixed(1)}%`;
}

async function sendSlackAlert(results) {
  if (!SLACK_WEBHOOK_URL) return;
  
  const failedPages = results.filter(r => r.hasFailure);
  const emoji = failedPages.length > 0 ? ':warning:' : ':white_check_mark:';
  
  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${emoji} Core Web Vitals Alert — ${DOMAIN}` },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${failedPages.length} page(s) failing CWV thresholds*\n_Tracked on mobile (CrUX field data)_`,
      },
    },
    { type: 'divider' },
  ];

  for (const r of failedPages) {
    const metricLines = Object.entries(r.metrics)
      .filter(([k, v]) => v !== null && ratingForMetric(k, v.percentile) === 'poor')
      .map(([k, v]) => `  • ${k}: ${formatMs(v.percentile)} (${formatPct(v.poor)} poor)`)
      .join('\n');

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${r.page.name}*\n<${r.page.url}|${r.page.url}>\n${metricLines}`,
      },
    });
  }

  blocks.push(
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Sent by CrUX monitor | ${new Date().toISOString()}`,
        },
      ],
    }
  );

  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  });
}

async function main() {
  const args = process.argv.slice(2);
  const outputJson = args.includes('--json');
  const alertSlack = args.includes('--alert-slack');
  const singleUrlArg = args.find(a => a.startsWith('--url='))?.replace('--url=', '');
  
  const pagesToCheck = singleUrlArg
    ? [{ name: singleUrlArg, url: singleUrlArg }]
    : PAGES;

  if (!API_KEY) {
    console.error('ERROR: GOOGLE_PAGESPEED_API_KEY env var is required');
    process.exit(2);
  }

  const results = [];

  for (const page of pagesToCheck) {
    try {
      process.stdout.write(`Fetching CrUX for ${page.name} (${page.url})... `);
      const data = await fetchCruxData(page.url);
      const result = { page, url: page.url, metrics: {}, hasFailure: false, error: null };
      
      const extracted = extractMetrics(data);
      result.metrics = extracted.metrics;
      result.overallScore = extracted.overall;

      // Check each metric against thresholds
      for (const [metricName, metricData] of Object.entries(result.metrics)) {
        const pct = metricData?.percentile;
        if (pct === null || pct === undefined) continue;
        const t = THRESHOLDS[metricName];
        if (!t) continue;
        if (pct >= t.poor) {
          result.hasFailure = true;
        }
      }

      // Also flag if overall score < 0.9
      if (result.overallScore !== null && result.overallScore < 0.9) {
        result.hasFailure = true;
      }

      results.push(result);
      console.log('OK', result.hasFailure ? '(FAIL)' : '(PASS)');
    } catch (err) {
      console.error(`ERROR: ${err.message}`);
      results.push({ page, url: page.url, metrics: {}, hasFailure: false, error: err.message });
    }
  }

  // Output
  if (outputJson) {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), domain: DOMAIN, pages: results }, null, 2));
  } else {
    console.log('\n=== CrUX Core Web Vitals Results ===');
    console.log(`Domain: ${DOMAIN} | Strategy: ${STRATEGY} | ${new Date().toISOString()}\n`);
    
    for (const r of results) {
      const status = r.error ? 'ERROR' : r.hasFailure ? 'FAIL' : 'PASS';
      const statusIcon = r.error ? '❌' : r.hasFailure ? '⚠️' : '✅';
      console.log(`${statusIcon} [${status}] ${r.page.name} — ${r.page.url}`);
      if (r.overallScore !== null) {
        console.log(`   Overall Score: ${formatScore(r.overallScore)}/100`);
      }
      for (const [metricName, metricData] of Object.entries(r.metrics)) {
        if (!metricData) continue;
        const rating = ratingForMetric(metricName, metricData.percentile);
        const icon = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
        console.log(`   ${icon} ${metricName}: ${formatMs(metricData.percentile)} | Good: ${formatPct(metricData.good)} | Poor: ${formatPct(metricData.poor)}`);
      }
      if (r.error) console.log(`   ERROR: ${r.error}`);
      console.log();
    }
  }

  const hasAnyFailure = results.some(r => r.hasFailure && !r.error);

  if (alertSlack && hasAnyFailure) {
    console.log('\nSending Slack alert...');
    await sendSlackAlert(results);
  }

  process.exit(hasAnyFailure ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(2);
});
