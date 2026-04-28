#!/usr/bin/env node
/**
 * Google Search Console — Ranking & Traffic Monitor
 *
 * Pulls search analytics data from GSC API:
 *   - Top 20 queries by impressions
 *   - Ranking changes week-over-week
 *   - Pages with most clicks
 *   - Pages needing SEO attention
 *   - Significant ranking drops alert (>10 position drop)
 *
 * Usage:
 *   node scripts/monitor-gsc.mjs                      # all reports
 *   node scripts/monitor-gsc.mjs --json               # machine-readable output
 *   node scripts/monitor-gsc.mjs --alert-slack         # send Slack alert on significant drops
 *   node scripts/monitor-gsc.mjs --site=https://...    # override site URL
 *
 * Environment variables:
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — Service account JSON (JSON stringified)
 *   GOOGLE_OAUTH_ACCESS_TOKEN   — Or pre-obtained OAuth2 access token
 *   GSC_SITE_URL                — Property URL in GSC (defaults to https://www.rentready.fr/)
 *   SLACK_WEBHOOK_URL           — Slack webhook for alerts
 *   RANKING_DROP_THRESHOLD       — Position drop to trigger alert (default: 10)
 *
 * API Docs: https://developers.google.com/webmaster-tools/search-console/api-original
 */

import { readFileSync } from 'fs';
import { google } from 'googleapis';

const DOMAIN = 'rentready.fr';
const DEFAULT_SITE = `sc-domain:${DOMAIN}`;
const REPORT_DATE_RANGE_DAYS = 28;   // GSC lookback window
const PREV_DATE_RANGE_DAYS = 28;    // Previous period for WoW comparison
const TOP_QUERIES_LIMIT = 20;
const TOP_PAGES_LIMIT = 20;
const RANKING_DROP_THRESHOLD = parseInt(process.env.RANKING_DROP_THRESHOLD || '10', 10);

const GSC_SITE = process.env.GSC_SITE_URL || process.env.GSC_SITE || DEFAULT_SITE;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
const OUTPUT_JSON = process.argv.includes('--json');
const ALERT_SLACK = process.argv.includes('--alert-slack');
const CI = process.env.CI === 'true';

// ─── Auth ────────────────────────────────────────────────────────────────────

async function getAccessToken() {
  // Option 1: Pre-supplied OAuth2 access token (fastest for CI)
  if (process.env.GOOGLE_OAUTH_ACCESS_TOKEN) {
    return process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  }

  // Option 2: Service account JSON — return googleapis client directly
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const webmasters = google.webmasters({
      version: 'v3',
      auth: new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
      }),
    });
    return webmasters;
  }

  throw new Error(
    'No GSC credentials found. Set GOOGLE_OAUTH_ACCESS_TOKEN or GOOGLE_SERVICE_ACCOUNT_JSON env var.'
  );
}

// ─── GSC API ─────────────────────────────────────────────────────────────────

const GSC_API_BASE = 'https://searchconsole.googleapis.com/v1';

/**
 * Execute a GSC search analytics query
 * @param {string|accessToken} accessTokenOrClient — raw access token string, or
 *   a googleapis Webmasters object (when using service account)
 * @param {object} body  — GSC API request body
 * @returns {Promise<object>}
 */
async function gscQuery(accessTokenOrClient, body) {
  // If it's a googleapis client (has searchanalytics), use it directly
  if (typeof accessTokenOrClient === 'object' && accessTokenOrClient.searchanalytics) {
    const res = await accessTokenOrClient.searchanalytics.query({
      siteUrl: GSC_SITE,
      requestBody: body,
    });
    return res.data;
  }

  // Otherwise use REST API with raw access token
  const response = await fetch(`${GSC_API_BASE}/url:searchAnalytics/query?uploadType=body`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessTokenOrClient}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...body, siteUrl: GSC_SITE }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GSC API error ${response.status}: ${text}`);
  }

  return response.json();
}

/**
 * Get date string N days ago
 */
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ─── Data Fetching ───────────────────────────────────────────────────────────

/**
 * Fetch search analytics rows for a given date range and dimensions
 */
async function fetchRows(accessToken, startDate, endDate, dimensions, rowLimit) {
  const data = await gscQuery(accessToken, {
    startDate,
    endDate,
    dimensions,
    rowLimit,
    aggregationType: 'byPage', // 'byPage' | 'byProperty' | 'byDate'
  });
  return data.rows || [];
}

/**
 * Fetch queries report for current and previous period
 */
async function fetchQueryReport(accessToken) {
  const currentStart = daysAgo(REPORT_DATE_RANGE_DAYS);
  const currentEnd = daysAgo(1);
  const prevStart = daysAgo(REPORT_DATE_RANGE_DAYS + PREV_DATE_RANGE_DAYS);
  const prevEnd = daysAgo(REPORT_DATE_RANGE_DAYS + 1);

  const [currentRows, prevRows] = await Promise.all([
    fetchRows(accessToken, currentStart, currentEnd, ['query'], 200),
    fetchRows(accessToken, prevStart, prevEnd, ['query'], 200),
  ]);

  // Build prev lookup
  const prevByQuery = new Map(prevRows.map(r => {
    const key = r.keys[0];
    return [key, { impressions: r.impressions, clicks: r.clicks, position: r.position }];
  }));

  // Enrich with WoW comparison
  return currentRows.map(row => {
    const query = row.keys[0];
    const prev = prevByQuery.get(query);
    const prevPosition = prev?.position ?? null;
    const positionDelta = prevPosition !== null ? row.position - prevPosition : null;
    return {
      query,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
      position: row.position,
      positionDelta,
    };
  });
}

/**
 * Fetch pages report (sorted by clicks)
 */
async function fetchPagesReport(accessToken) {
  const startDate = daysAgo(REPORT_DATE_RANGE_DAYS);
  const endDate = daysAgo(1);

  const rows = await fetchRows(accessToken, startDate, endDate, ['page'], 200);

  return rows.map(row => ({
    page: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
    position: row.position,
  }));
}

/**
 * Fetch device breakdown
 */
async function fetchDeviceReport(accessToken) {
  const startDate = daysAgo(REPORT_DATE_RANGE_DAYS);
  const endDate = daysAgo(1);

  const rows = await fetchRows(accessToken, startDate, endDate, ['device'], 10);

  return rows.map(row => ({
    device: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
    position: row.position,
  }));
}

/**
 * Identify queries with significant ranking drops
 */
function findRankingDrops(queries) {
  return queries
    .filter(q => q.positionDelta !== null && q.positionDelta > RANKING_DROP_THRESHOLD)
    .sort((a, b) => b.positionDelta - a.positionDelta);
}

/**
 * Identify queries with high impressions but low CTR (optimization opportunities)
 */
function findLowCtrOpportunities(queries, impressionsThreshold = 100, ctrThreshold = 0.02) {
  return queries
    .filter(q => q.impressions >= impressionsThreshold && q.ctr < ctrThreshold)
    .sort((a, b) => b.impressions - a.impressions);
}

/**
 * Identify pages with high impressions but low CTR (needs SEO attention)
 */
function findPageOpportunities(pages, impressionsThreshold = 100, ctrThreshold = 0.02) {
  return pages
    .filter(p => p.impressions >= impressionsThreshold && p.ctr < ctrThreshold)
    .sort((a, b) => b.impressions - a.impressions);
}

// ─── Formatting ──────────────────────────────────────────────────────────────

function formatPct(n) {
  return `${(n * 100).toFixed(2)}%`;
}

function formatPosition(p) {
  return p !== null ? p.toFixed(1) : 'N/A';
}

function formatDelta(d) {
  if (d === null) return 'N/A';
  return d > 0 ? `+${d.toFixed(1)}` : `${d.toFixed(1)}`;
}

// ─── Console Report ──────────────────────────────────────────────────────────

function printReport(queryData, pageData, deviceData, drops, queryOpps, pageOpps) {
  const totalClicks = queryData.reduce((s, q) => s + q.clicks, 0);
  const totalImpressions = queryData.reduce((s, q) => s + q.impressions, 0);
  const avgPosition = queryData.length > 0
    ? queryData.reduce((s, q) => s + q.position * q.impressions, 0) / totalImpressions
    : null;

  console.log('\n=== GSC — Search Analytics Report ===');
  console.log(`Domain: ${DOMAIN}`);
  console.log(`Period: last ${REPORT_DATE_RANGE_DAYS} days`);
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log(`Site: ${GSC_SITE}\n`);
  console.log(`Total Clicks: ${totalClicks.toLocaleString()}`);
  console.log(`Total Impressions: ${totalImpressions.toLocaleString()}`);
  console.log(`Avg Position: ${avgPosition !== null ? avgPosition.toFixed(1) : 'N/A'}`);
  console.log(`Overall CTR: ${totalImpressions > 0 ? formatPct(totalClicks / totalImpressions) : 'N/A'}`);

  // ── Top 20 Queries ──
  console.log('\n─────────────────────────────────────');
  console.log('TOP 20 QUERIES BY IMPRESSIONS');
  console.log('─────────────────────────────────────');
  console.log(`${'#'.padEnd(3)} ${'Query'.padEnd(35)} ${'Clicks'.padStart(7)} ${'Impr'.padStart(8)} ${'CTR'.padStart(7)} ${'Pos'.padStart(6)} ${'WoW'.padStart(7)}`);
  console.log(String('-').repeat(80));
  queryData.slice(0, TOP_QUERIES_LIMIT).forEach((q, i) => {
    const delta = formatDelta(q.positionDelta);
    const deltaColor = q.positionDelta === null ? '' : q.positionDelta > 5 ? '🔴' : q.positionDelta > 0 ? '🟡' : '🟢';
    console.log(
      `${String(i + 1).padEnd(3)} ${q.query.padEnd(35).slice(0, 35)} ${String(q.clicks).padStart(7)} ${String(q.impressions).padStart(8)} ${formatPct(q.ctr).padStart(7)} ${formatPosition(q.position).padStart(6)} ${deltaColor}${delta.padStart(6)}`
    );
  });

  // ── Pages with Most Clicks ──
  console.log('\n─────────────────────────────────────');
  console.log('TOP 20 PAGES BY CLICKS');
  console.log('─────────────────────────────────────');
  console.log(`${'#'.padEnd(3)} ${'Page'.padEnd(50)} ${'Clicks'.padStart(7)} ${'Impr'.padStart(8)} ${'CTR'.padStart(7)} ${'Pos'.padStart(6)}`);
  console.log(String('-').repeat(90));
  pageData.slice(0, TOP_PAGES_LIMIT).forEach((p, i) => {
    const pageShort = p.page.replace(`https://${DOMAIN}`, '') || '/';
    console.log(
      `${String(i + 1).padEnd(3)} ${pageShort.padEnd(50).slice(0, 50)} ${String(p.clicks).padStart(7)} ${String(p.impressions).padStart(8)} ${formatPct(p.ctr).padStart(7)} ${formatPosition(p.position).padStart(6)}`
    );
  });

  // ── Device Breakdown ──
  if (deviceData.length > 0) {
    console.log('\n─────────────────────────────────────');
    console.log('DEVICE BREAKDOWN');
    console.log('─────────────────────────────────────');
    console.log(`${'Device'.padEnd(12)} ${'Clicks'.padStart(8)} ${'Impr'.padStart(10)} ${'CTR'.padStart(8)} ${'Avg Pos'.padStart(8)}`);
    console.log(String('-').repeat(50));
    deviceData.forEach(d => {
      console.log(
        `${String(d.device).padEnd(12)} ${String(d.clicks).padStart(8)} ${String(d.impressions).padStart(10)} ${formatPct(d.ctr).padStart(8)} ${formatPosition(d.position).padStart(8)}`
      );
    });
  }

  // ── Ranking Drops ──
  if (drops.length > 0) {
    console.log('\n─────────────────────────────────────');
    console.log(`⚠️  RANKING DROPS > ${RANKING_DROP_THRESHOLD} POSITIONS (WoW)`);
    console.log('─────────────────────────────────────');
    console.log(`${'Query'.padEnd(40)} ${'Prev Pos'.padStart(9)} ${'Curr Pos'.padStart(9)} ${'Drop'.padStart(7)}`);
    console.log(String('-').repeat(70));
    drops.slice(0, 20).forEach(q => {
      console.log(
        `${q.query.padEnd(40).slice(0, 40)} ${formatPosition(q.positionDelta - q.position + q.position).padStart(9)} ${formatPosition(q.position).padStart(9)} ${'🔴'}${formatDelta(q.positionDelta).padStart(5)}`
      );
    });
  } else {
    console.log('\n─────────────────────────────────────');
    console.log('✅ NO SIGNIFICANT RANKING DROPS');
    console.log(`(Threshold: > ${RANKING_DROP_THRESHOLD} position drop WoW)`);
    console.log('─────────────────────────────────────');
  }

  // ── Low CTR Opportunities ──
  if (queryOpps.length > 0) {
    console.log('\n─────────────────────────────────────');
    console.log(`💡 QUERY OPTIMIZATION OPPORTUNITIES (high impressions, CTR < ${formatPct(0.02)})`);
    console.log('─────────────────────────────────────');
    console.log(`${'Query'.padEnd(40)} ${'Impr'.padStart(8)} ${'CTR'.padStart(8)} ${'Pos'.padStart(6)}`);
    console.log(String('-').repeat(65));
    queryOpps.slice(0, 15).forEach(q => {
      console.log(
        `${q.query.padEnd(40).slice(0, 40)} ${String(q.impressions).padStart(8)} ${formatPct(q.ctr).padStart(8)} ${formatPosition(q.position).padStart(6)}`
      );
    });
  }

  if (pageOpps.length > 0) {
    console.log('\n─────────────────────────────────────');
    console.log(`🔍 PAGES NEEDING SEO ATTENTION (high impressions, CTR < ${formatPct(0.02)})`);
    console.log('─────────────────────────────────────');
    console.log(`${'Page'.padEnd(50)} ${'Impr'.padStart(8)} ${'CTR'.padStart(8)} ${'Pos'.padStart(6)}`);
    console.log(String('-').repeat(75));
    pageOpps.slice(0, 15).forEach(p => {
      const pageShort = p.page.replace(`https://${DOMAIN}`, '') || '/';
      console.log(
        `${pageShort.padEnd(50).slice(0, 50)} ${String(p.impressions).padStart(8)} ${formatPct(p.ctr).padStart(8)} ${formatPosition(p.position).padStart(6)}`
      );
    });
  }

  console.log('\n');
}

// ─── Slack Alert ─────────────────────────────────────────────────────────────

async function sendSlackAlert({ drops, queryOpps, pageOpps, totalClicks, totalImpressions, avgPosition, queryReport }) {
  if (!SLACK_WEBHOOK_URL) return;

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: '📊 GSC Weekly Report — rentready.fr' },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Period:* last ${REPORT_DATE_RANGE_DAYS} days | *Generated:* ${new Date().toLocaleDateString('fr-FR')}`,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Total Clicks*\n${totalClicks.toLocaleString()}` },
        { type: 'mrkdwn', text: `*Total Impressions*\n${totalImpressions.toLocaleString()}` },
        { type: 'mrkdwn', text: `*Avg Position*\n${avgPosition !== null ? avgPosition.toFixed(1) : 'N/A'}` },
        { type: 'mrkdwn', text: `*Overall CTR*\n${totalImpressions > 0 ? formatPct(totalClicks / totalImpressions) : 'N/A'}` },
      ],
    },
    { type: 'divider' },
  ];

  // Ranking drops
  if (drops.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*⚠️ Ranking Drops (>${RANKING_DROP_THRESHOLD} positions WoW)*\n${drops.slice(0, 5).map(q =>
          `• *${q.query}* — ${formatPosition(q.positionDelta - q.position + q.position)} → ${formatPosition(q.position)} (${formatDelta(q.positionDelta)})`
        ).join('\n')}${drops.length > 5 ? `\n_...and ${drops.length - 5} more_` : ''}`,
      },
    });
  } else {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '✅ *No significant ranking drops detected*' },
    });
  }

  // Top opportunities
  if (queryOpps.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*💡 Top Query Opportunities*\n${queryOpps.slice(0, 5).map(q =>
          `• *${q.query}* — ${q.impressions} impr, ${formatPct(q.ctr)} CTR, pos ${formatPosition(q.position)}`
        ).join('\n')}`,
      },
    });
  }

  if (pageOpps.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*🔍 Pages Needing SEO Attention*\n${pageOpps.slice(0, 5).map(p => {
          const pageShort = p.page.replace(`https://${DOMAIN}`, '') || '/';
          return `• ${pageShort} — ${p.impressions} impr, ${formatPct(p.ctr)} CTR, pos ${formatPosition(p.position)}`;
        }).join('\n')}`,
      },
    });
  }

  blocks.push({
    type: 'context',
    elements: [
      { type: 'mrkdwn', text: `rentready.fr GSC Monitor | ${new Date().toISOString()}` },
    ],
  });

  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  try {
    console.log('Fetching GSC access token...');
    const accessToken = await getAccessToken();

    console.log('Fetching query report (current + previous period)...');
    const queryReport = await fetchQueryReport(accessToken);

    console.log('Fetching pages report...');
    const pageReport = await fetchPagesReport(accessToken);

    console.log('Fetching device breakdown...');
    const deviceReport = await fetchDeviceReport(accessToken);

    // Sort by impressions for query report, by clicks for page report
    const sortedQueries = [...queryReport].sort((a, b) => b.impressions - a.impressions);
    const sortedPages = [...pageReport].sort((a, b) => b.clicks - a.clicks);

    const drops = findRankingDrops(sortedQueries);
    const queryOpps = findLowCtrOpportunities(sortedQueries);
    const pageOpps = findPageOpportunities(sortedPages);

    const totalClicks = sortedQueries.reduce((s, q) => s + q.clicks, 0);
    const totalImpressions = sortedQueries.reduce((s, q) => s + q.impressions, 0);
    const avgPosition = totalImpressions > 0
      ? sortedQueries.reduce((s, q) => s + q.position * q.impressions, 0) / totalImpressions
      : null;

    if (OUTPUT_JSON) {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        domain: DOMAIN,
        site: GSC_SITE,
        period: { days: REPORT_DATE_RANGE_DAYS, startDate: daysAgo(REPORT_DATE_RANGE_DAYS), endDate: daysAgo(1) },
        summary: { totalClicks, totalImpressions, avgPosition, ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0 },
        topQueries: sortedQueries.slice(0, TOP_QUERIES_LIMIT),
        topPages: sortedPages.slice(0, TOP_PAGES_LIMIT),
        deviceBreakdown: deviceReport,
        rankingDrops: drops,
        queryOpportunities: queryOpps,
        pageOpportunities: pageOpps,
      }, null, 2));
    } else {
      printReport(sortedQueries, sortedPages, deviceReport, drops, queryOpps, pageOpps);
    }

    if (ALERT_SLACK) {
      console.log('Sending Slack alert...');
      await sendSlackAlert({ drops, queryOpps, pageOpps, totalClicks, totalImpressions, avgPosition, queryReport: sortedQueries });
    }

    // Exit code: 1 if significant drops, 0 otherwise
    process.exit(drops.length > 0 ? 1 : 0);

  } catch (err) {
    console.error('Fatal error:', err.message);
    if (err.message.includes('credentials') || err.message.includes('auth')) {
      console.error('\nGSC authentication error. Check:');
      console.error('  1. Set GOOGLE_SERVICE_ACCOUNT_JSON env var (service account JSON as stringified JSON)');
      console.error('  2. OR set GOOGLE_OAUTH_ACCESS_TOKEN env var (pre-obtained OAuth2 access token)');
      console.error('  3. The service account must have "Webmaster Tools" read-only access');
    }
    process.exit(2);
  }
}

main();
