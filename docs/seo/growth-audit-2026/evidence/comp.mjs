const UA = "Mozilla/5.0 (compatible; LoknaSEOAudit/1.0)";
const sites = process.argv.slice(2);
const get = async (u) => { try { const r = await fetch(u, { headers: { "user-agent": UA } }); return r.ok ? await r.text() : ""; } catch { return ""; } };
for (const site of sites) {
  const robots = await get(site + "/robots.txt");
  let maps = [...robots.matchAll(/^sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  if (!maps.length) maps = [site + "/sitemap.xml", site + "/sitemap_index.xml"];
  const urls = new Set(); const queue = [...maps]; let fetched = 0;
  while (queue.length && fetched < 25) {
    const sm = queue.shift(); fetched++;
    const x = await get(sm); await new Promise((r) => setTimeout(r, 400));
    for (const m of x.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) { const u = m[1].replace(/&amp;/g, "&"); if (/sitemap.*\.xml(\.gz)?$/i.test(u) || /\.xml$/i.test(u)) queue.push(u); else urls.add(u); }
  }
  const fam = {}; for (const u of urls) { try { const p = new URL(u).pathname.split("/").filter(Boolean); const k = "/" + (p[0] || "") + (p.length > 1 ? "/*" : ""); fam[k] = (fam[k] || 0) + 1; } catch {} }
  const top = Object.entries(fam).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k}:${v}`).join("  ");
  console.log(`${site} | sitemaps read ${fetched}${queue.length ? " (+" + queue.length + " not read)" : ""} | URLs ${urls.size}\n   ${top}`);
}
