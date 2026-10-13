import { readFileSync, writeFileSync } from "node:fs";
const { sitemap, pages } = JSON.parse(readFileSync("crawl.json", "utf8"));
const P = Object.values(pages);
const fam = (p) => { const s = p.split("/").filter(Boolean); if (!s.length) return "/"; if (s.length === 1) return "/" + s[0]; return "/" + s[0] + "/*"; };
const sm = new Set(sitemap);
const status = {}; for (const p of P) { const k = p.blocked ? "blocked" : p.status; status[k] = (status[k] || 0) + 1; }
console.log("STATUS", JSON.stringify(status));
console.log("NON-200:", P.filter((p) => !p.blocked && p.status !== 200).map((p) => `${p.status} ${p.path} ${p.redirects?.join(">") || ""}`).join("\n  "));
// inlinks
const inl = {}, inlCtx = {}, anchors = {};
for (const p of P) for (const l of p.links || []) { if (l.to === p.path) continue; (inl[l.to] ||= new Set()).add(p.path); if (l.ctx === "content") (inlCtx[l.to] ||= new Set()).add(p.path); (anchors[l.to] ||= {})[l.anchor] = ((anchors[l.to] || {})[l.anchor] || 0) + 1; }
const ok = P.filter((p) => p.status === 200 && p.title);
const notInSitemap = ok.filter((p) => !sm.has(p.path)).map((p) => p.path);
const sitemapNot200 = sitemap.filter((s) => !pages[s] || pages[s].status !== 200);
console.log("SITEMAP", sitemap.length, "| 200 html crawled", ok.length, "| crawled-but-not-in-sitemap", notInSitemap.length, notInSitemap.slice(0, 40).join(" "));
console.log("SITEMAP-not-200:", sitemapNot200.join(" "));
const orphans = sitemap.filter((s) => !inl[s] || inl[s].size === 0);
console.log("ORPHANS (0 internal inlinks):", orphans.length, orphans.join(" "));
const depthDist = {}; for (const p of ok) { const d = p.depth ?? "unreachable"; depthDist[d] = (depthDist[d] || 0) + 1; }
console.log("DEPTH", JSON.stringify(depthDist));
console.log("DEPTH>=4 or unreachable:", ok.filter((p) => p.depth === null || p.depth >= 4).map((p) => `${p.path}(${p.depth})`).join(" "));
const dup = (key) => { const m = {}; for (const p of ok) { const v = (Array.isArray(p[key]) ? p[key][0] : p[key]) || "∅"; (m[v] ||= []).push(p.path); } return Object.entries(m).filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length); };
for (const k of ["title", "description", "h1"]) { const d = dup(k); console.log(`DUP ${k}: ${d.length} groups`); d.slice(0, 12).forEach(([v, ps]) => console.log(`   [${ps.length}] ${v.slice(0, 90)} :: ${ps.slice(0, 5).join(" ")}`)); }
console.log("H1 != 1:", ok.filter((p) => p.h1.length !== 1).map((p) => `${p.path}(${p.h1.length})`).join(" "));
const canonBad = ok.filter((p) => p.canonical !== "https://lokna.fr" + (p.path === "/" ? "" : p.path));
console.log("CANONICAL mismatch:", canonBad.length, canonBad.slice(0, 30).map((p) => `${p.path} -> ${p.canonical}`).join(" | "));
console.log("ROBOTS meta:", JSON.stringify(ok.reduce((a, p) => ((a[p.robots || "∅"] = (a[p.robots || "∅"] || 0) + 1), a), {})));
console.log("NOINDEX in sitemap:", ok.filter((p) => /noindex/.test(p.robots || "") && sm.has(p.path)).map((p) => p.path).join(" "));
console.log("INVALID LD:", ok.filter((p) => p.ld.includes("INVALID_JSON")).map((p) => p.path).join(" "));
console.log("TITLE len>65:", ok.filter((p) => (p.title || "").length > 65).length, "| <30:", ok.filter((p) => (p.title || "").length < 30).map((p) => p.path + ":" + p.title).slice(0, 10).join(" | "));
console.log("DESC missing:", ok.filter((p) => !p.description).map((p) => p.path).join(" "), "| >165:", ok.filter((p) => (p.description || "").length > 165).length);
// broken links
const broken = []; for (const p of ok) for (const l of p.links || []) { const t = pages[l.to]; if (t && !t.blocked && t.status !== 200 && !(t.status >= 300 && t.status < 400 && pages[t.final]?.status === 200)) broken.push(`${p.path} -> ${l.to} (${t.status})`); }
console.log("BROKEN internal links:", [...new Set(broken)].length, [...new Set(broken)].slice(0, 30).join(" | "));
const redirLinks = []; for (const p of ok) for (const l of p.links || []) { const t = pages[l.to]; if (t?.redirects?.length) redirLinks.push(`${p.path} -> ${l.to} => ${t.final}`); }
console.log("LINKS TO REDIRECTS:", [...new Set(redirLinks)].length, [...new Set(redirLinks)].slice(0, 12).join(" | "));
// families
const F = {};
for (const p of ok) { const f = fam(p.path); const e = (F[f] ||= { n: 0, words: [], inl: [], ctxIn: [], out: [], depth: [], inSitemap: 0, ld: {} }); e.n++; e.words.push(p.words); e.inl.push(inl[p.path]?.size || 0); e.ctxIn.push(inlCtx[p.path]?.size || 0); e.out.push(new Set((p.links || []).map((l) => l.to)).size); e.depth.push(p.depth ?? 99); if (sm.has(p.path)) e.inSitemap++; for (const t of p.ld) e.ld[t] = 1; }
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
console.log("\nFAMILY | n | inSitemap | medWords | medInlinks | medContextInlinks | medOutlinks | medDepth | LD");
for (const [f, e] of Object.entries(F).sort((a, b) => b[1].n - a[1].n)) console.log(`${f} | ${e.n} | ${e.inSitemap} | ${med(e.words)} | ${med(e.inl)} | ${med(e.ctxIn)} | ${med(e.out)} | ${med(e.depth)} | ${Object.keys(e.ld).join(",")}`);
// top/least linked
const ranked = ok.map((p) => [p.path, inl[p.path]?.size || 0, inlCtx[p.path]?.size || 0]).sort((a, b) => b[1] - a[1]);
console.log("\nTOP linked:", ranked.slice(0, 15).map((r) => `${r[0]}(${r[1]}/${r[2]}ctx)`).join(" "));
console.log("LEAST linked (sitemap):", ranked.filter((r) => sm.has(r[0])).slice(-25).map((r) => `${r[0]}(${r[1]}/${r[2]})`).join(" "));
console.log("THIN (<350 words main):", ok.filter((p) => p.words < 350).map((p) => `${p.path}(${p.words})`).join(" "));
writeFileSync("summary.json", JSON.stringify({ inl: Object.fromEntries(Object.entries(inl).map(([k, v]) => [k, [...v]])), inlCtx: Object.fromEntries(Object.entries(inlCtx).map(([k, v]) => [k, [...v]])), anchors }, null, 0));
