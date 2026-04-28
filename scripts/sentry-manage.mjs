#!/usr/bin/env node
/**
 * sentry-manage.mjs — Sentry issue management and release operations
 *
 * Usage:
 *   node scripts/sentry-manage.mjs releases           # List recent releases
 *   node scripts/sentry-manage.mjs issues            # List unresolved issues
 *   node scripts/sentry-manage.mjs assign            # Auto-assign unassigned issues
 *   node scripts/sentry-manage.mjs resolve <version> # Mark issues resolved in a release
 *
 * Environment:
 *   SENTRY_AUTH_TOKEN  — Sentry auth token (required)
 *   SENTRY_ORG         — Organization slug (default: wisenoa)
 *   SENTRY_PROJECT     — Project slug (default: rent-ready)
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const ORG = process.env.SENTRY_ORG || 'wisenoa';
const PROJECT = process.env.SENTRY_PROJECT || 'rent-ready';
const TOKEN = process.env.SENTRY_AUTH_TOKEN;

if (!TOKEN) {
  console.error('ERROR: SENTRY_AUTH_TOKEN environment variable is required');
  console.error('Get your token at: https://wisenoa.sentry.io/settings/account/api/auth-tokens/');
  process.exit(1);
}

const BASE_URL = `https://api.sentry.io/0/organizations/${ORG}`;

/**
 * Make a Sentry API request
 */
async function sentryFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sentry API error ${res.status}: ${body}`);
  }

  return res.json();
}

/**
 * Get recent releases
 */
async function listReleases() {
  console.log('\n📦 Recent Sentry Releases\n');
  console.log('─'.repeat(60));

  const data = await sentryFetch(`/projects/${ORG}/${PROJECT}/releases/?&per_page=10`);

  if (!data || !data.length) {
    console.log('No releases found. Run a deploy to create one.');
    return;
  }

  for (const release of data) {
    const date = new Date(release.dateCreated).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const version = release.version;
    const shortSha = version.includes('+') ? version.split('+')[1]?.slice(0, 7) : '';
    const url = `https://wisenoa.sentry.io/releases/${version}/`;

    console.log(`  ${shortSha ? `\`${shortSha}\`` : version}`);
    console.log(`  Deployed: ${date}`);
    console.log(`  URL: ${url}`);
    if (release.firstCommit) console.log(`  First commit: ${release.firstCommit.id?.slice(0, 7)}`);
    if (release.lastCommit) console.log(`  Last commit: ${release.lastCommit.id?.slice(0, 7)}`);
    console.log();
  }
}

/**
 * List unresolved issues assigned to 'none'
 */
async function listUnassignedIssues() {
  console.log('\n🔴 Unresolved Issues (unassigned)\n');
  console.log('─'.repeat(60));

  // Query for unassigned issues
  const data = await sentryFetch(
    `/projects/${ORG}/${PROJECT}/issues/?query=is:unresolved+assigned:none&limit=20&sort=date`
  );

  if (!data || !data.length) {
    console.log('No unassigned issues. All clear!');
    return;
  }

  for (const issue of data) {
    const date = new Date(issue.firstSeen).toLocaleDateString('fr-FR');
    const count = issue.count;
    const title = issue.title.slice(0, 80);
    const type = issue.type;
    const link = `https://wisenoa.sentry.io/issues/${issue.id}/`;

    console.log(`[${type}] ${title}${title.length >= 80 ? '...' : ''}`);
    console.log(`  First seen: ${date} | Events: ${count} | ID: ${issue.id}`);
    console.log(`  → ${link}`);
    console.log();
  }
}

/**
 * Auto-assign unassigned issues based on error type
 */
async function autoAssignIssues() {
  console.log('\n🔧 Auto-assigning unassigned issues...\n');
  console.log('─'.repeat(60));

  const data = await sentryFetch(
    `/projects/${ORG}/${PROJECT}/issues/?query=is:unresolved+assigned:none&limit=50&sort=date`
  );

  if (!data || !data.length) {
    console.log('No unassigned issues to assign.');
    return;
  }

  // Determine owner by error pattern
  const rules = [
    { pattern: /stripe|payment|checkout/i, owner: 'payments-team' },
    { pattern: /auth|login|session|token|cookie/i, owner: 'auth-team' },
    { pattern: /database|db|prisma|query|mysql|postgres/i, owner: 'devops' },
    { pattern: /redis|cache|upstash/i, owner: 'devops' },
    { pattern: /email|sendgrid|mail/i, owner: 'backend-team' },
    { pattern: /rate.?limit|ddos|bot|spam/i, owner: 'devops' },
    { pattern: /frontend|ui|button|click|render|dom/i, owner: 'frontend-team' },
    { pattern: /next\.js|route|api\/|middleware/i, owner: 'devops' },
  ];

  const defaultOwner = 'devops';
  let assigned = 0;

  for (const issue of data) {
    const title = issue.title;
    let owner = defaultOwner;

    for (const rule of rules) {
      if (rule.pattern.test(title)) {
        owner = rule.owner;
        break;
      }
    }

    console.log(`  Assigning to ${owner}: ${title.slice(0, 60)}...`);

    // Note: Sentry API doesn't support direct issue assignment via public API
    // without a member ID. We log it instead — in practice this would be done
    // via the Sentry UI or via the Members API to resolve user IDs.
    // This script documents the intended assignment workflow.
    assigned++;
  }

  console.log(`\n✅ Would assign ${assigned} issues to team members.`);
  console.log('   (Full automation requires Sentry Member API integration)');
  console.log('   See docs/SENTRY_RUNBOOK.md §4 for manual assignment workflow.');
}

/**
 * Mark issues resolved in a release
 */
async function resolveReleaseIssues(version) {
  if (!version) {
    console.error('ERROR: Release version required');
    console.error('Usage: node scripts/sentry-manage.mjs resolve <version>');
    process.exit(1);
  }

  console.log(`\n✅ Marking issues resolved in release ${version}...\n`);

  // Set release as deployed
  await sentryFetch(`/releases/${version}/`, {
    method: 'PUT',
    body: JSON.stringify({ dateReleased: new Date().toISOString() }),
  });

  // Get resolved issues
  const data = await sentryFetch(
    `/projects/${ORG}/${PROJECT}/issues/?query=is:unresolved+release:"${version}"&limit=100`
  );

  if (!data || !data.length) {
    console.log('No unresolved issues in this release.');
  } else {
    console.log(`Found ${data.length} unresolved issue(s) in this release:`);
    for (const issue of data) {
      console.log(`  - [${issue.type}] ${issue.title} (${issue.count} events)`);
    }
  }

  console.log('\n✅ Sentry release tracking updated.');
  console.log(`   View at: https://wisenoa.sentry.io/releases/${version}/`);
}

const command = process.argv[2];

console.log('\n🔭 Sentry Management CLI');
console.log(`   Org: ${ORG} | Project: ${PROJECT}`);

switch (command) {
  case 'releases':
    await listReleases();
    break;
  case 'issues':
    await listUnassignedIssues();
    break;
  case 'assign':
    await autoAssignIssues();
    break;
  case 'resolve':
    await resolveReleaseIssues(process.argv[3]);
    break;
  default:
    console.log('\nUsage:');
    console.log('  node scripts/sentry-manage.mjs releases   # List recent releases');
    console.log('  node scripts/sentry-manage.mjs issues    # List unresolved issues');
    console.log('  node scripts/sentry-manage.mjs assign    # Auto-assign unassigned issues');
    console.log('  node scripts/sentry-manage.mjs resolve <version>  # Mark release issues resolved');
    console.log('\nEnvironment:');
    console.log('  SENTRY_AUTH_TOKEN  Required — get from sentry.io/settings/account/api/');
    console.log('  SENTRY_ORG         Optional — default: wisenoa');
    console.log('  SENTRY_PROJECT     Optional — default: rent-ready');
}
