// Polite crawler for lokna.fr: robots.txt respected, 2 concurrent requests, 300 ms pause.
import { writeFileSync } from "node:fs";
const BASE = "https://lokna.fr";
const OUT = process.argv[2];
const UA = "LoknaSEOAudit/1.0 (+internal audit)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const robotsTxt = await (await fetch(BASE + "/robots.txt", { headers: { "user-agent": UA } })).text();
const disallow = [];
let applies = false;
for (const line of robotsTxt.split("\n")) {
  const [k, ...v] = line.split(":"); const val = v.join(":").trim();
  if (/^user-agent$/i.test(k.trim())) applies = val === "*";
  else if (applies && /^disallow$/i.test(k.trim()) && val) disallow.push(val);
}
const allowed = (path) => !disallow.some((d) => path === d || path.startsWith(d.endsWith("/") ? d : d + "/") || path.startsWith(d + "?"));

const smXml = await (await fetch(BASE + "/sitemap.xml", { headers: { "user-agent": UA } })).text();
const sitemap = [...smXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/");

const norm = (href, from) => {
  try {
    const u = new URL(href, BASE + from);
    if (u.host !== "lokna.fr") return null;
    let p = u.pathname.replace(/\/$/, "") || "/";
    if (p.startsWith("/_next") || /\.(png|jpe?g|webp|svg|ico|pdf|xml|txt|webmanifest|css|js)$/i.test(p)) return null;
    return p;
  } catch { return null; }
};
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#x27;|&#39;|&amp;|&quot;/g, " ").replace(/\s+/g, " ").trim();

const pages = {};
const queue = [{ path: "/", depth: 0, via: null }];
const seen = new Set(["/"]);
const depthOf = { "/": 0 };
for (const p of sitemap) if (!seen.has(p)) { seen.add(p); queue.push({ path: p, depth: null, via: "sitemap" }); }

async function visit(item) {
  const { path } = item;
  if (!allowed(path)) { pages[path] = { path, blocked: true }; return; }
  let res, html = "", redirectChain = [];
  let url = BASE + path;
  for (let hop = 0; hop < 5; hop++) {
    res = await fetch(url, { redirect: "manual", headers: { "user-agent": UA } }).catch((e) => ({ status: 0, error: e.message }));
    if (res.status >= 300 && res.status < 400) { const loc = res.headers.get("location"); redirectChain.push(res.status + " " + loc); url = new URL(loc, url).href; continue; }
    break;
  }
  const rec = { path, status: res.status, redirects: redirectChain, final: url.replace(BASE, "") || "/" };
  if (res.status === 200 && (res.headers.get("content-type") || "").includes("text/html")) {
    html = await res.text();
    const m = (re) => (html.match(re) || [])[1];
    rec.title = m(/<title[^>]*>([^<]*)<\/title>/);
    rec.description = m(/<meta name="description" content="([^"]*)"/);
    rec.canonical = m(/<link rel="canonical" href="([^"]*)"/);
    rec.robots = m(/<meta name="robots" content="([^"]*)"/);
    rec.h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((x) => strip(x[1]));
    rec.h2 = (html.match(/<h2[\s>]/g) || []).length;
    rec.h3 = (html.match(/<h3[\s>]/g) || []).length;
    rec.ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((x) => { try { const j = JSON.parse(x[1]); return (j["@graph"] || [j]).map((n) => n["@type"]); } catch { return ["INVALID_JSON"]; } });
    const mainHtml = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
    rec.text = strip(mainHtml);
    rec.words = rec.text.split(" ").length;
    const chrome = html.replace(/<main[\s\S]*?<\/main>/, "");
    const linkRe = /<a\s[^>]*href="([^"#]*)(?:#[^"]*)?"[^>]*>([\s\S]*?)<\/a>/g;
    rec.links = [];
    for (const [src, ctx] of [[mainHtml, "content"], [chrome, "chrome"]]) {
      for (const x of src.matchAll(linkRe)) { const to = norm(x[1], path); if (to !== null) rec.links.push({ to, anchor: strip(x[2]).slice(0, 80), ctx }); }
    }
    const d = depthOf[path] ?? null;
    for (const l of rec.links) {
      if (!(l.to in depthOf) && d !== null) depthOf[l.to] = d + 1;
      if (!seen.has(l.to)) { seen.add(l.to); queue.push({ path: l.to, depth: d === null ? null : d + 1, via: path }); }
    }
  }
  pages[path] = rec;
}

let active = 0, done = 0;
while (queue.length || active) {
  if (active < 2 && queue.length) {
    const item = queue.shift(); active++;
    visit(item).catch((e) => (pages[item.path] = { path: item.path, error: e.message })).finally(() => { active--; done++; if (done % 50 === 0) console.log("crawled", done, "queue", queue.length); });
    await sleep(300);
  } else await sleep(50);
  if (done > 1500) break;
}
// recompute depth by BFS over discovered links from "/"
const adj = {}; for (const p of Object.values(pages)) adj[p.path] = (p.links || []).map((l) => l.to);
const depth = { "/": 0 }; const q = ["/"];
while (q.length) { const c = q.shift(); for (const n of adj[c] || []) if (!(n in depth)) { depth[n] = depth[c] + 1; q.push(n); } }
for (const p of Object.values(pages)) p.depth = depth[p.path] ?? null;
writeFileSync(OUT, JSON.stringify({ crawledAt: new Date().toISOString(), disallow, sitemap, pages }, null, 0));
console.log("done", Object.keys(pages).length, "pages; disallow:", disallow.join(" "));
