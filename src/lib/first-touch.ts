/**
 * First-touch attribution: the shared contract.
 *
 * The client writes the cookie (`FirstTouchCapture`), the signup action reads it
 * server-side, and this module is the one place that defines the shape both sides
 * agree on. Keeping the parsing here is what stops the two ends from drifting —
 * the alternative is a JSON blob interpreted twice, once loosely and once
 * hopefully.
 *
 * Nothing is invented. Every field is either present in the URL, present in
 * `document.referrer`, or absent. There is no "direct traffic" default: an
 * account whose origin was not captured stores null, so "we do not know" stays
 * distinguishable from "they came directly".
 */

export const FIRST_TOUCH_COOKIE = "rr_ft";

/**
 * 90 days. Long enough to cover a landlord who reads for a month and then signs
 * up, short enough that it does not become a durable identifier of a person.
 */
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

export interface FirstTouch {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage?: string;
  referrer?: string;
}

/** Read the cookie value from a raw `Cookie:` header. */
function cookieValue(header: string | undefined): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const name = part.slice(0, eq).trim();
    if (name === FIRST_TOUCH_COOKIE) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return null;
}

/**
 * Parse the cookie into a `FirstTouch`, or null when there is nothing to record.
 *
 * Every field is length-capped and cast to `string`: the cookie is attacker-
 * controlled input, and it is about to be written to a database.
 */
export function parseFirstTouch(header: string | undefined): FirstTouch | null {
  const raw = cookieValue(header);
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return null;
  }

  const out: FirstTouch = {};
  const str = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed.slice(0, 200) : undefined;
  };

  const source = str((parsed as Record<string, unknown>).utmSource);
  const medium = str((parsed as Record<string, unknown>).utmMedium);
  const campaign = str((parsed as Record<string, unknown>).utmCampaign);
  const landing = str((parsed as Record<string, unknown>).landingPage);
  const referrer = str((parsed as Record<string, unknown>).referrer);

  if (source) out.utmSource = source;
  if (medium) out.utmMedium = medium;
  if (campaign) out.utmCampaign = campaign;
  if (landing) out.landingPage = landing;
  if (referrer) out.referrer = referrer;

  return Object.keys(out).length > 0 ? out : null;
}

/** Read from a Next.js `cookies()` store instead of a raw header. */
export function readFirstTouch(cookieStore: {
  get: (name: string) => { value: string } | undefined;
}): FirstTouch | null {
  const entry = cookieStore.get(FIRST_TOUCH_COOKIE);
  if (!entry) return null;
  return parseFirstTouch(`${FIRST_TOUCH_COOKIE}=${entry.value}`);
}
