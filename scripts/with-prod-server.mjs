#!/usr/bin/env node
/**
 * Run a command against the production build, with a server that always dies.
 *
 * ## Why this exists
 *
 * During the Wave 1 SEO audit, several subagents each started
 * `node .next/standalone/server.js` to probe rendered HTML. Most left it
 * running: at one point eight standalone servers plus a `next dev` were alive,
 * holding ~3.1 GB of RAM. That is what produced the OOM aborts
 * (`FATAL heap limit`) that were then misread as page defects — one crawl
 * reported "384 × HTTP 000" which was nothing but the server being killed
 * mid-crawl.
 *
 * On a 48 GB machine already carrying 14 GB of swap, that margin decides
 * whether a build completes. So: one helper, one server, guaranteed cleanup.
 *
 * ## Usage
 *
 *   node scripts/with-prod-server.mjs --port 3111 -- curl -s http://127.0.0.1:3111/
 *   node scripts/with-prod-server.mjs --port 3111 -- python3 probe.py
 *
 * The server is started, readiness is polled, then the command runs. The server
 * is terminated on exit, on SIGINT/SIGTERM, and if the command throws.
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SERVER = join(ROOT, ".next", "standalone", "server.js");

const argv = process.argv.slice(2);
const sep = argv.indexOf("--");
if (sep === -1 || sep === argv.length - 1) {
  process.stderr.write(
    "usage: node scripts/with-prod-server.mjs [--port N] [--boot-timeout N] -- <command...>\n"
  );
  process.exit(2);
}

const flags = argv.slice(0, sep);
const command = argv.slice(sep + 1);

const portIndex = flags.indexOf("--port");
const PORT = portIndex >= 0 ? Number(flags[portIndex + 1]) : 3111;
const timeoutIndex = flags.indexOf("--boot-timeout");
const BOOT_TIMEOUT_MS =
  (timeoutIndex >= 0 ? Number(flags[timeoutIndex + 1]) : 90) * 1000;

const ORIGIN = `http://127.0.0.1:${PORT}`;

function log(message) {
  process.stderr.write(`[prod-server] ${message}\n`);
}

if (!existsSync(SERVER)) {
  log(`build introuvable : ${SERVER}`);
  log("Lance d'abord `pnpm build`.");
  process.exit(2);
}

// ─── start ───────────────────────────────────────────────────────────────────

const server = spawn(process.execPath, [SERVER], {
  cwd: ROOT,
  env: {
    ...process.env,
    PORT: String(PORT),
    HOSTNAME: "127.0.0.1",
    NODE_ENV: "production",
    // Without this the standalone server is killed by the default heap on a
    // loaded machine — the same failure this script exists to prevent.
    NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=6144",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

const serverLog = [];
server.stdout.on("data", (b) => serverLog.push(b.toString()));
server.stderr.on("data", (b) => serverLog.push(b.toString()));

let stopped = false;
function stopServer() {
  if (stopped) return;
  stopped = true;
  if (server.exitCode === null && !server.killed) {
    try {
      process.kill(-server.pid, "SIGKILL");
    } catch {
      server.kill("SIGKILL");
    }
  }
}

process.on("exit", stopServer);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    stopServer();
    process.exit(130);
  });
}

/** Server that exits during boot is a build problem, not a probe problem. */
server.on("exit", (code) => {
  if (!stopped) {
    log(`le serveur a quitte prematurelyment (code ${code})`);
    log(serverLog.slice(-25).join(""));
    process.exit(1);
  }
});

// ─── wait for readiness ──────────────────────────────────────────────────────

async function waitForBoot() {
  const deadline = Date.now() + BOOT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) return false;
    const probe = spawnSync("curl", [
      "-s",
      "-o",
      "/dev/null",
      "-w",
      "%{http_code}",
      "--max-time",
      "20",
      ORIGIN,
    ]);
    const code = probe.stdout?.toString().trim();
    if (code && code !== "000") return true;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

const ready = await waitForBoot();
if (!ready) {
  log(`pas pret apres ${BOOT_TIMEOUT_MS / 1000} s sur ${ORIGIN}`);
  log(serverLog.slice(-25).join(""));
  stopServer();
  process.exit(1);
}
log(`pret sur ${ORIGIN}`);

// ─── run the command ─────────────────────────────────────────────────────────

const child = spawn(command[0], command.slice(1), {
  stdio: "inherit",
  cwd: process.cwd(),
  env: process.env,
});

child.on("exit", (code, signal) => {
  stopServer();
  if (signal) {
    log(`commande terminee par ${signal}`);
    process.exit(1);
  }
  log("serveur arrete");
  process.exit(code ?? 1);
});

child.on("error", (err) => {
  stopServer();
  log(`echec de la commande : ${err.message}`);
  process.exit(1);
});