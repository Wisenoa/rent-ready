import { NextResponse } from "next/server";

/**
 * Sentry tunnel.
 *
 * ## Why this route exists
 *
 * `next.config.ts` points Sentry's browser SDK at `/api/sentry-error` so that
 * client-side errors go to our own origin instead of straight to sentry.io. That
 * setting was inert twice over:
 *
 *   - the option was named `tunnelRoute`, which Sentry does not read. The real
 *     option is `tunnelUrl`, so the value was silently discarded.
 *   - this route did not exist, so even with the right option name it would have
 *     answered 404 (verified with curl before this file was written).
 *
 * @sentry/nextjs 10.48 does not ship a tunnel helper — Sentry's own docs tell
 * you to copy one into your project — and `@sentry/node` is only a transitive
 * dependency here, which pnpm's strict resolution would refuse to import from
 * application code. So the envelope is forwarded with plain `fetch`.
 *
 * ## What happens without a DSN
 *
 * Nothing is sent, but the event is NOT dropped silently: it is logged on the
 * server with the message and stack. An error that vanishes in production is
 * worse than an error that is logged locally and still not sent — the first one
 * leaves no trace at all.
 *
 * `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` must be set for this to do anything.
 */

export const runtime = "nodejs";

/** Forward a Sentry envelope to the project's ingest endpoint. */
async function forward(dsn: string, envelope: string): Promise<Response> {
  const { host, pathname, username, password } = new URL(dsn);
  // https://<key>@o1.ingest.sentry.io/<projectId>  ->  …/<projectId>/envelope/
  const projectId = pathname.replace(/^\//, "");
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  return fetch(`https://${host}/api/${projectId}/envelope/`, {
    method: "POST",
    body: envelope,
    headers: {
      "Content-Type": "application/x-sentry-envelope",
      "X-Sentry-Auth": `Sentry sentry_version=7, sentry_client=rentready/1.0, sentry_key=${username}`,
      Authorization: `Basic ${auth}`,
    },
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  let envelope: string;
  try {
    envelope = await request.text();
  } catch (cause) {
    return NextResponse.json(
      { error: "corps de requete illisible" },
      { status: 400 }
    );
  }

  // Pull the message out of the first item of the envelope so the server-side
  // log says what failed, rather than "an event was dropped".
  let summary = "evenement Sentry sans message lisible";
  try {
    const [headerLine] = envelope.split("\n");
    const header = JSON.parse(headerLine);
    const item = JSON.parse(envelope.split("\n")[1] ?? "{}");
    const payload = item.payload ?? {};
    summary =
      payload.exception?.values?.[0]?.value ??
      payload.message ??
      String(header.type ?? "evenement");
  } catch {
    // Malformed envelope: still log something rather than nothing.
  }

  const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.error(
      `[sentry-error] SENTRY_DSN absent — evenement NON transmis : ${summary}`
    );
    return NextResponse.json(
      { error: "SENTRY_DSN absent", logged: true },
      { status: 503 }
    );
  }

  try {
    const upstream = await forward(dsn, envelope);
    if (!upstream.ok) {
      console.error(
        `[sentry-error] Sentry a repondu ${upstream.status} : ${summary}`
      );
      return NextResponse.json(
        { error: "envoi refuse par Sentry", status: upstream.status },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error(
      `[sentry-error] envoi impossible (${String(error)}) : ${summary}`
    );
    return NextResponse.json(
      { error: "envoi impossible", logged: true },
      { status: 502 }
    );
  }
}