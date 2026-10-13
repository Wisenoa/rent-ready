import { readFileSync } from "node:fs";
const { pages } = JSON.parse(readFileSync("crawl.json", "utf8"));
const cities = JSON.parse(readFileSync("/home/ubuntu/lokna-seo-audit/src/data/cities.json", "utf8"));
const cityArr = Array.isArray(cities) ? cities : Object.values(cities);
const norm = (t, c) => { let s = t.toLowerCase(); for (const v of [c.name, c.region, c.department, String(c.population), new Intl.NumberFormat("fr-FR").format(c.population)]) s = s.split(String(v).toLowerCase()).join(" X "); return s.replace(/\d[\d\s ,.]*/g, " N ").replace(/[^a-zà-ÿ ]/g, " ").replace(/\s+/g, " ").trim().split(" "); };
const sh = (w) => { const s = new Set(); for (let i = 0; i + 4 < w.length; i++) s.add(w.slice(i, i + 5).join(" ")); return s; };
const jac = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i); };
for (const fam of ["gestion-locative", "bail", "quittances", "assurance-loyer-impaye"]) {
  const S = cityArr.map((c) => ({ c, s: sh(norm(pages[`/${fam}/${c.slug}`].text, c)) }));
  let sum = 0, n = 0, min = 1, max = 0;
  for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) { const v = jac(S[i].s, S[j].s); sum += v; n++; min = Math.min(min, v); max = Math.max(max, v); }
  // unique shingles: present in <=2 pages of family
  const count = {}; for (const { s } of S) for (const x of s) count[x] = (count[x] || 0) + 1;
  const uniq = S.map(({ s }) => [...s].filter((x) => count[x] <= 2).length / s.size);
  const words = cityArr.map((c) => pages[`/${fam}/${c.slug}`].words);
  console.log(`${fam}: pairwise 5-gram Jaccard mean=${(sum / n).toFixed(2)} min=${min.toFixed(2)} max=${max.toFixed(2)} | share of text unique to page (≤2 pages) mean=${(uniq.reduce((a, b) => a + b) / uniq.length * 100).toFixed(1)}% | words ${Math.min(...words)}-${Math.max(...words)}`);
}
// cross-family same city
const cross = (a, b) => { const c = cityArr.find((x) => x.slug === "lyon"); return jac(sh(norm(pages[`/${a}/lyon`].text, c)), sh(norm(pages[`/${b}/lyon`].text, c))).toFixed(2); };
console.log("lyon cross-family: gl~quittances", cross("gestion-locative", "quittances"), "gl~bail", cross("gestion-locative", "bail"), "bail~quittances", cross("bail", "quittances"), "gl~ali", cross("gestion-locative", "assurance-loyer-impaye"));
// claims check across city pages
const claims = { "Open Banking/DSP2": /open banking|dsp2/i, "détecte automatiquement les virements": /détecte automatiquement les virements/i, "envoi direct au locataire": /envoi direct au locataire/i, "pequeños": /pequeños/i, "CLAMEU": /clameu/i, "GLI rembourse": /gli rembourse/i };
for (const [k, re] of Object.entries(claims)) { const hits = Object.values(pages).filter((p) => p.text && re.test(p.text)).map((p) => p.path); const fams = {}; for (const h of hits) { const f = "/" + h.split("/")[1]; fams[f] = (fams[f] || 0) + 1; } console.log(`claim "${k}": ${hits.length} pages ${JSON.stringify(fams)}`); }
