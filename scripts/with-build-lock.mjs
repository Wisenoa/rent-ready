#!/usr/bin/env node
/**
 * Serialise `next build` across agents working in the same tree.
 *
 * ## Why this exists
 *
 * Two `next build` runs against one worktree corrupt each other's output, and
 * the failure is reported as an application bug:
 *
 *   PageNotFoundError: Cannot find module for page: /_document
 *
 * That was reproduced during the Wave 1 SEO work: a `next dev` server (started
 * by Playwright's `webServer`, which uses `reuseExistingServer`) held `.next`
 * open while another agent built, and the build died at `/_document`.
 *
 * Two mitigations, both needed:
 *
 *   1. `next dev` builds into `.next-dev` (see `distDir` in next.config.ts), so
 *      a dev server and a build never share a directory. That removes the
 *      observed failure.
 *   2. This lock, so two builds cannot overlap either. Removing the first
 *      reproducer does not make concurrent builds safe.
 *
 * ## What may run in parallel
 *
 * Safe in parallel: `pnpm test` (vitest), `pnpm lint`, `tsc`, `pnpm gen:routes`,
 * `pnpm dev`, `pnpm serve:prod`, Playwright E2E.
 *
 * Serialised: `pnpm build` — one at a time, per worktree.
 *
 * ## Stale locks
 *
 * A lock left behind by a killed process would block every future build, which
 * is worse than no lock. The owner PID is recorded, and a lock whose owner is
 * gone is reclaimed after `STALE_MS` (default 30 min — long enough that a slow
 * build is never declared stale, short enough to self-heal after a reboot).
 * `--force` reclaims immediately.
 */

import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const LOCK_DIR = join(ROOT, ".next-build.lock");
const LOCK_FILE = join(LOCK_DIR, "owner.json");
const STALE_MS = 30 * 60 * 1000;
const POLL_MS = 2000;

/** Is this PID alive? signal 0 tests existence without signalling. */
function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    // EPERM means it exists but belongs to another user.
    return err.code === "EPERM";
  }
}

function readOwner() {
  try {
    return JSON.parse(readFileSync(LOCK_FILE, "utf8"));
  } catch {
    return null;
  }
}

/** Why we may take the lock, or null if we must wait. */
function takeoverReason() {
  if (!existsSync(LOCK_FILE)) return "aucun lock";

  const owner = readOwner();
  if (!owner) return "lock illisible";

  if (owner.pid === process.pid) return "lock deja detenupar ce process";

  if (!pidAlive(owner.pid)) {
    return `process ${owner.pid} n'existe plus (lock orphelin)`;
  }

  const age = Date.now() - (owner.startedAt ?? 0);
  if (age > STALE_MS) {
    return `lock tenu depuis ${Math.round(age / 60000)} min par ${owner.pid} (expire)`;
  }

  return null;
}

function acquire(force) {
  if (!existsSync(LOCK_DIR)) mkdirSync(LOCK_DIR, { recursive: true });

  const reason = takeoverReason();
  if (reason && !(force && reason !== "lock deja detenupar ce process")) {
    if (reason.startsWith("lock deja")) return true;
    log(`lock disponible : ${reason}`);
  } else if (!reason) {
    return false; // a live owner holds it
  }

  writeFileSync(
    LOCK_FILE,
    JSON.stringify(
      {
        pid: process.pid,
        startedAt: Date.now(),
        cmd: process.argv.slice(2).join(" "),
      },
      null,
      2
    )
  );
  log(`lock pris (pid ${process.pid})${force ? " — force" : ""}`);
  return true;
}

function release() {
  try {
    const owner = readOwner();
    if (owner && owner.pid === process.pid) unlinkSync(LOCK_FILE);
  } catch {
    /* already gone */
  }
}

function log(message) {
  process.stderr.write(`[build-lock] ${message}\n`);
}

// ─── main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const force = args.includes("--force");
const command = args.filter((a) => a !== "--force");

if (command.length === 0) {
  log("usage: node scripts/with-build-lock.mjs [--force] <command...>");
  process.exit(2);
}

let waited = 0;
while (!acquire(force)) {
  const owner = readOwner();
  if (waited === 0) {
    log(
      `build deja en cours (pid ${owner?.pid}, depuis ${Math.round(
        (Date.now() - (owner?.startedAt ?? Date.now())) / 60000
      )} min) — attente`
    );
  }
  await new Promise((r) => setTimeout(r, POLL_MS));
  waited += POLL_MS;
  if (waited > STALE_MS + 60_000) {
    log("abandon : le lock n'a jamais ete libere. Utilise --force.");
    process.exit(3);
  }
  if (waited % 30_000 === 0) log(`toujours en attente (${Math.round(waited / 1000)} s)`);
}
if (waited > 0) log(`lock obtenu apres ${Math.round(waited / 1000)} s`);

// Release on every exit path, including SIGINT/SIGTERM, so an interrupted build
// never leaves a lock behind.
let released = false;
const cleanup = () => {
  if (released) return;
  released = true;
  release();
};
process.on("exit", cleanup);
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    cleanup();
    process.kill(process.pid, signal);
  });
}

const child = spawn(command[0], command.slice(1), {
  stdio: "inherit",
  env: process.env,
});
child.on("exit", (code, signal) => {
  cleanup();
  if (signal) {
    log(`build termine par ${signal}`);
    process.exit(1);
  }
  log(`build termine (code ${code})`);
  process.exit(code ?? 1);
});

child.on("error", (err) => {
  cleanup();
  log(`echec du lancement : ${err.message}`);
  process.exit(1);
});