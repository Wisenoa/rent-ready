/**
 * Stable identity of a bank webhook event, used as the UNIQUE replay key.
 *
 * Replay protection compared the payload's `timestamp`, which is OPTIONAL in the
 * provider schema: an event without one was never deduplicated and was applied in
 * full on every redelivery. Application-level read-then-write cannot fix that
 * either — two concurrent deliveries of the same event both read "not seen" and
 * both write. So the key is carried by a UNIQUE column and the database refuses
 * the second delivery (AGENTS.md §12, §13).
 *
 * A transaction event is keyed by the provider's own transaction id, which is
 * stable across redeliveries. Event types that carry no id are keyed by a hash of
 * the raw body, so a redelivery of the same body yields the same key.
 *
 * Lives outside the route because a Next.js route module may only export its HTTP
 * handlers.
 */

import { createHash } from "node:crypto";

export interface BankEventIdentity {
  event_type: string;
  transaction?: { id?: string } | undefined;
}

export function buildDedupeKey(payload: BankEventIdentity, rawBody: string): string {
  const providerId = payload.transaction?.id;
  if (providerId) {
    return `bridge:${payload.event_type}:${providerId}`;
  }
  return `bridge:${payload.event_type}:sha256:${createHash("sha256")
    .update(rawBody)
    .digest("hex")}`;
}