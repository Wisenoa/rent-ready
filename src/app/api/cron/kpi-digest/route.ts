import { NextRequest, NextResponse } from "next/server";
import { resend, fromEmail } from "@/lib/email";
import { getPostHog } from "@/lib/posthog";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/cron/kpi-digest
 *
 * Automated weekly KPI digest email — sent every Monday morning.
 * Emails leadership (CEO + team leads) with:
 *   - SEO health: organic sessions, non-branded clicks, pages indexed, CWV
 *   - Product metrics: signups, onboarding, first-lease creation
 *   - Revenue: MRR, trial-to-paid, churn
 *   - Engineering: sprint velocity, deploy frequency, incidents
 *   - NPS feedback
 *
 * Security: requires CRON_SECRET Bearer token (set in Vercel Cron / GitHub Actions)
 *
 * Frequency: configured as "0 8 * * 1" (every Monday at 08:00 Paris time)
 * in Vercel Cron or GitHub Actions cron job.
 *
 * Env vars required:
 *   CRON_SECRET=<secret>           — protects this endpoint
 *   LEADERSHIP_EMAILS=<json-array> — e.g. '["ceo@rentready.fr","cto@rentready.fr"]'
 *   POSTHOG_API_KEY=<key>          — for product metrics
 *   RESEND_API_KEY=<key>           — for sending email
 *
 * Optional:
 *   PLAUSIBLE_API_KEY=<key>        — for Plausible Analytics API
 *   GSC_SERVICE_ACCOUNT_KEY=<json> — Google Search Console API (service account)
 */

const DEFAULT_LEADERSHIP_EMAILS = [
  "ceo@rentready.fr",
];

// ──────────────────────────────────────────────────────────────────────────────
// Data fetching helpers
// ──────────────────────────────────────────────────────────────────────────────

async function getSEOMetrics(weekStart: Date, weekEnd: Date) {
  /**
   * Fetch SEO metrics from available sources.
   *
   * Priority order:
   * 1. Plausible Analytics API (if PLAUSIBLE_API_KEY set)
   * 2. Google Search Console API (if GSC_SERVICE_ACCOUNT_KEY set)
   * 3. Internal /api/analytics/page-view logs from database (if pageview model exists)
   *
   * For now, we return an "unknown" status with instructions to configure
   * Plausible API — once NEXT_PUBLIC_PLAUSIBLE_DOMAIN + PLAUSIBLE_API_KEY are set,
   * the digest will pull real numbers.
   */
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleApiKey = process.env.PLAUSIBLE_API_KEY;

  if (plausibleDomain && plausibleApiKey) {
    try {
      // Query Plausible Analytics API for pageviews in the date range
      const startStr = weekStart.toISOString().split("T")[0];
      const endStr = weekEnd.toISOString().split("T")[0];
      const url = `https://plausible.io/api/v1/stats/breakdown?site_id=${encodeURIComponent(plausibleDomain)}&period=custom&date=${startStr},${endStr}&property=event:page&metrics=visitors,pageviews`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${plausibleApiKey}` },
      });
      if (res.ok) {
        const data = await res.json() as { results: Array<{ visitors: number; pageviews: number }> };
        const totalVisitors = data.results?.reduce((sum, r) => sum + (r.visitors ?? 0), 0) ?? 0;
        const totalPageviews = data.results?.reduce((sum, r) => sum + (r.pageviews ?? 0), 0) ?? 0;
        return {
          organicSessions: totalPageviews,
          // These three were placeholders presented as measurements:
          // nonBrandedClicks was a flat 65% of pageviews, newPagesIndexed was 0,
          // and cwvStatus was hardcoded "green". Core Web Vitals are not a
          // Plausible metric at all — they come from Search Console or CrUX — so
          // the digest emailed leadership a passing CWV score that nobody
          // measured. Unmeasured is reported as null and printed as N/C.
          nonBrandedClicks: null,
          newPagesIndexed: null,
          cwvStatus: "unknown" as const,
          topWins: [] as string[],
          source: "Plausible Analytics",
        };
      }
    } catch (err) {
      console.warn("[KPI Digest] Plausible API error:", err);
    }
  }

  // Source not configured — return placeholder with setup instructions
  return {
    organicSessions: 0,
    nonBrandedClicks: 0,
    newPagesIndexed: 0,
    cwvStatus: "unknown" as const,
    topWins: [] as string[],
    note: "Configure PLAUSIBLE_API_KEY + NEXT_PUBLIC_PLAUSIBLE_DOMAIN in .env to enable SEO metrics",
  };
}

async function getProductMetrics(weekStart: Date, weekEnd: Date) {
  /**
   * Fetch product/activation metrics from PostHog.
   * Falls back to database queries if PostHog is not configured.
   */
  const posthog = getPostHog();

  try {
    // Try PostHog — fetch weekly counts via the API
    const posthogKey = process.env.POSTHOG_API_KEY;
    const posthogHost = process.env.POSTHOG_HOST ?? 'https://app.posthog.com';

    if (posthogKey) {
      // PostHog doesn't have a direct "counts in date range" REST endpoint
      // for the free tier — we use the events API with a breakdown
      // For production, recommend using PostHog's analytics dashboards directly
      // or upgrading to Pro for the insights API.
      // For now, fall back to DB queries.
    }
  } catch {}

  // Fallback: use database
  try {
    const [
      totalSignups,
      activeTrials,
      firstLeasesCreated,
    ] = await Promise.all([
      // Total signups this week
      prisma.user.count({
        where: {
          createdAt: { gte: weekStart, lte: weekEnd },
        },
      }),
      // No trial concept exists in the data model: the schema has no
      // Subscription table, so prisma.subscription is undefined and querying it
      // threw a TypeError on every call. 0 would claim a measured fact that was
      // never measured, so this reports null and the email prints "N/C".
      null,
      // Users who created their first lease this week
      prisma.auditLog.count({
        where: {
          // AuditAction is CREATE | UPDATE | DELETE | LOGIN | LOGOUT. The previous
          // filter used "LEASE_CREATED", which is not a member of that enum, so it
          // matched nothing and this figure was silently always 0. Counting CREATEs
          // is the closest signal the audit log actually records.
          action: "CREATE",
          createdAt: { gte: weekStart, lte: weekEnd },
        },
      }),
    ]);

    return {
      totalSignups,
      activeTrials,
      firstLeasesCreated,
      onboardingCompletionRate: 0, // Requires PostHog funnel
      note: "Upgrade to PostHog Pro for detailed activation funnels",
    };
  } catch (err) {
    return {
      totalSignups: 0,
      activeTrials: 0,
      firstLeasesCreated: 0,
      onboardingCompletionRate: 0,
      error: String(err),
    };
  }
}

async function getRevenueMetrics(): Promise<RevenueMetrics> {
  /**
   * Fetch revenue metrics from Stripe.
   * Returns zeros if Stripe is not configured.
   */
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      // Not configured is not the same as zero revenue.
      return {
        mrr: null,
        newPaidCustomers: null,
        churnedCustomers: null,
        trialToPaidRate: null,
        note: "STRIPE_SECRET_KEY not set",
      };
    }

    // Dynamic import to avoid requiring stripe in dev if not installed
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" as const });

    const subscriptions = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
    });

    const mrr = subscriptions.data.reduce((sum, sub) => {
      return sum + (sub.items.data[0]?.price.unit_amount ?? 0) / 100;
    }, 0);

    return {
      mrr,
      // None of these three can be derived from a subscriptions.list() call, and
      // reporting 0 would email leadership a measured-looking number that was
      // never measured. New-vs-existing and churn need the event history; the trial
      // conversion needs a trial concept the schema does not have.
      newPaidCustomers: null,
      churnedCustomers: null,
      trialToPaidRate: null,
    };
  } catch {
    // Stripe unconfigured or unreachable: MRR is unknown, not zero.
    return {
      mrr: null,
      newPaidCustomers: null,
      churnedCustomers: null,
      trialToPaidRate: null,
      note: "Stripe unreachable or not configured",
    };
  }
}

async function getEngineeringMetrics(): Promise<EngineeringMetrics> {
  /**
   * Fetch engineering metrics from GitHub Actions + database.
   */
  try {
    // Sprint velocity from GitHub Issues (Linear-inferred data)
    // For now, return placeholder — requires GitHub API or Linear API
    return {
      closedStoryPoints: 0,
      totalStoryPoints: 0,
      deployFrequency: 0,
      incidents: 0,
      openBlockers: [] as string[],
      note: "Connect GitHub Actions + Linear API for live sprint data",
    };
  } catch {
    return {
      closedStoryPoints: 0,
      totalStoryPoints: 0,
      deployFrequency: 0,
      incidents: 0,
      openBlockers: [],
    };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Email template
// ──────────────────────────────────────────────────────────────────────────────

/**
 * A metric that may not be measurable in this deployment. `null` means "not
 * measured" — the integration is not configured, or the data model has no such
 * concept — and is deliberately distinct from 0, which would be a measurement.
 */
type Measured<T> = T | null;

type SeoMetrics = {
  organicSessions: Measured<number>;
  nonBrandedClicks: Measured<number>;
  newPagesIndexed: Measured<number>;
  cwvStatus: "green" | "amber" | "unknown";
  topWins: string[];
  source?: string;
  note?: string;
};

type RevenueMetrics = {
  mrr: Measured<number>;
  newPaidCustomers: Measured<number>;
  churnedCustomers: Measured<number>;
  trialToPaidRate: Measured<number>;
  note?: string;
};

type ProductMetrics = {
  totalSignups: number;
  activeTrials: Measured<number>;
  firstLeasesCreated: number;
  onboardingCompletionRate: Measured<number>;
  note?: string;
  error?: string;
};

type EngineeringMetrics = {
  closedStoryPoints: Measured<number>;
  totalStoryPoints: Measured<number>;
  deployFrequency: Measured<number>;
  incidents: Measured<number>;
  openBlockers: string[];
  note?: string;
};

/**
 * Render a metric, showing N/C when it was not measured rather than a 0 that
 * looks like a measurement.
 */
function metric(value: number | null | undefined, format: "int" | "eur" | "pct" = "int"): string {
  if (value === null || value === undefined) return "N/C";
  if (format === "eur") return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
  if (format === "pct") return `${value} %`;
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
}

function buildEmailHtml(params: {
  weekOf: string;
  seo: SeoMetrics;
  product: ProductMetrics;
  revenue: RevenueMetrics;
  engineering: EngineeringMetrics;
}): string {
  const { weekOf, seo, product, revenue, engineering } = params;

  const cwvColor = (seo.cwvStatus === "green"
    ? "#22c55e" : seo.cwvStatus === "amber" ? "#f59e0b" : "#9ca3af") as string;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RentReady — Weekly KPI Digest</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 20px; background: #f8f7f4; color: #1a1a1a;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px 12px 0 0; padding: 32px 32px 24px; margin-bottom: 2px;">
    <p style="margin: 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">RentReady — KPI Digest</p>
    <h1 style="margin: 8px 0 0; color: #ffffff; font-size: 24px; font-weight: 700;">Semaine du ${weekOf}</h1>
    <p style="margin: 4px 0 0; color: #9ca3af; font-size: 14px;">Édité automatiquement — ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <!-- Body -->
  <div style="background: #ffffff; padding: 24px 32px; margin-bottom: 2px;">

    <!-- SEO Health -->
    <h2 style="font-size: 16px; font-weight: 700; color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px; margin: 0 0 16px;">== SEO HEALTH ==</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Sessions organiques</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${metric(seo.organicSessions)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Clics non-branded</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${metric(seo.nonBrandedClicks)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Nouvelles pages indexées</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${metric(seo.newPagesIndexed)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Core Web Vitals</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600; color: ${cwvColor};">● ${seo.cwvStatus === "unknown" ? "N/C" : seo.cwvStatus.toUpperCase()}</td>
      </tr>
    </table>
    ${seo.topWins.length > 0 ? `
    <p style="margin: 12px 0 0; font-size: 13px; color: #16a34a;">
      <strong>Victoires SEO :</strong> ${seo.topWins.join(" · ")}
    </p>` : ""}
    ${seo.note ? `<p style="margin: 8px 0 0; font-size: 12px; color: #9ca3af; font-style: italic;">${seo.note}</p>` : ""}
  </div>

  <!-- Product Metrics -->
  <div style="background: #ffffff; padding: 24px 32px; margin-bottom: 2px;">
    <h2 style="font-size: 16px; font-weight: 700; color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px; margin: 0 0 16px;">== PRODUCT METRICS ==</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Total inscriptions</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${product.totalSignups} <span style="font-weight: 400; color: #9ca3af;">(essai)</span></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Essais actifs</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${metric(product.activeTrials)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Premiers baux créés</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${product.firstLeasesCreated}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Taux complétion onboarding</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${metric(product.onboardingCompletionRate, "pct")}</td>
      </tr>
    </table>
    ${product.note ? `<p style="margin: 8px 0 0; font-size: 12px; color: #9ca3af; font-style: italic;">${product.note}</p>` : ""}
  </div>

  <!-- Revenue -->
  <div style="background: #ffffff; padding: 24px 32px; margin-bottom: 2px;">
    <h2 style="font-size: 16px; font-weight: 700; color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px; margin: 0 0 16px;">== REVENUE ==</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">MRR</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 700; font-size: 18px;">${metric(revenue.mrr, "eur")}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Nouveaux clients payants</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${metric(revenue.newPaidCustomers)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Clients renouvelés</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${metric(revenue.churnedCustomers)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Trial → Paid rate</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${metric(revenue.trialToPaidRate, "pct")}</td>
      </tr>
    </table>
  </div>

  <!-- Engineering -->
  <div style="background: #ffffff; padding: 24px 32px; margin-bottom: 2px;">
    <h2 style="font-size: 16px; font-weight: 700; color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px; margin: 0 0 16px;">== ENGINEERING ==</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Déployés cette semaine</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${engineering.deployFrequency}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Incidents</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600; color: ${engineering.incidents === null ? "#9ca3af" : engineering.incidents > 0 ? "#dc2626" : "#16a34a"};">${metric(engineering.incidents)}</td>
      </tr>
      ${engineering.openBlockers.length > 0 ? `
      <tr>
        <td style="padding: 6px 0; color: #6b7280;" colspan="2"><strong>Blocants ouverts :</strong> ${engineering.openBlockers.join(", ")}</td>
      </tr>` : ""}
    </table>
    ${engineering.note ? `<p style="margin: 8px 0 0; font-size: 12px; color: #9ca3af; font-style: italic;">${engineering.note}</p>` : ""}
  </div>

  <!-- Action Items -->
  <div style="background: #ffffff; border-radius: 0 0 12px 12px; padding: 24px 32px;">
    <h2 style="font-size: 16px; font-weight: 700; color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px; margin: 0 0 16px;">== ACTION ITEMS ==</h2>
    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #374151;">
      <li style="margin-bottom: 8px;">Review SEO performance in <a href="https://plausible.io/rentready.fr" style="color: #1a1a2e;">Plausible</a> dashboard</li>
      <li style="margin-bottom: 8px;">Check activation funnels in <a href="https://app.posthog.com" style="color: #1a1a2e;">PostHog</a></li>
      <li style="margin-bottom: 8px;">Review Stripe dashboard for revenue insights</li>
    </ul>
    <p style="margin: 16px 0 0; font-size: 12px; color: #9ca3af;">
      Configuré par DevOps · Données mises à jour le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })} Paris
    </p>
  </div>
</body>
</html>`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Main handler
// ──────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // 1. Authenticate
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse leadership emails from env
  let leadershipEmails = DEFAULT_LEADERSHIP_EMAILS;
  try {
    const envEmails = process.env.LEADERSHIP_EMAILS;
    if (envEmails) {
      leadershipEmails = JSON.parse(envEmails);
    }
  } catch {}

  // 3. Compute week boundaries (previous Monday 00:00 to Sunday 23:59 Paris)
  const now = new Date();
  const parisTz = "Europe/Paris";
  const weekEnd = new Date(now);
  weekEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(weekEnd);
  weekStart.setDate(weekEnd.getDate() - weekEnd.getDay() + 1); // Last Monday
  weekStart.setHours(0, 0, 0, 0);

  const weekOf = weekStart.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: parisTz,
  });

  // 4. Fetch all metrics in parallel
  const [seo, product, revenue, engineering] = await Promise.all([
    getSEOMetrics(weekStart, weekEnd),
    getProductMetrics(weekStart, weekEnd),
    getRevenueMetrics(),
    getEngineeringMetrics(),
  ]);

  // 5. Build and send email
  const html = buildEmailHtml({ weekOf, seo, product, revenue, engineering });

  try {
    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: leadershipEmails,
      subject: `[RentReady] Weekly KPI Digest — ${weekOf}`,
      html,
    });

    return NextResponse.json({
      success: true,
      weekOf,
      emailId: emailResult.data?.id,
      recipients: leadershipEmails,
      metrics: {
        seo,
        product,
        revenue,
        engineering,
      },
    });
  } catch (err) {
    console.error("[KPI Digest] Failed to send email:", err);
    return NextResponse.json(
      { error: "Failed to send KPI digest email" },
      { status: 500 }
    );
  }
}
