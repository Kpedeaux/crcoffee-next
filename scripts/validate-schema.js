#!/usr/bin/env node
// Structured-data + consistency validator for crcoffeenola.com.
// Run before every commit: node scripts/validate-schema.js
// Exits 1 if any ERROR is found (WARNs don't fail the build).
//
// Catches the bug classes from the 2026-07 Search Console incident:
//  1. JSON-LD that doesn't parse
//  2. Products/Offers missing Google-required fields (price, image, brand...)
//  3. @id references that don't resolve to a definition on the SAME page
//  4. Cross-file fact drift (banned strings that contradict site facts)

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const errors = [];
const warns = [];

function htmlFiles() {
  const out = [];
  for (const dir of [ROOT, path.join(ROOT, "news")]) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".html")) out.push(path.join(dir, f));
    }
  }
  return out;
}

function blocks(text) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  const out = [];
  let m;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

function walk(node, fn) {
  if (Array.isArray(node)) return node.forEach((n) => walk(n, fn));
  if (node && typeof node === "object") {
    fn(node);
    Object.values(node).forEach((v) => walk(v, fn));
  }
}

// ---- per-type required fields (Google rich-result requirements) ----
function checkNode(node, file) {
  const t = node["@type"];
  if (!t) return;
  const types = Array.isArray(t) ? t : [t];
  const has = (k) => node[k] !== undefined && node[k] !== "";

  if (types.includes("Product")) {
    for (const k of ["name", "image", "offers", "brand"])
      if (!has(k)) errors.push(`${file}: Product "${node.name || "?"}" missing "${k}"`);
    if (node.brand && node.brand["@id"] && Object.keys(node.brand).length === 1)
      warns.push(`${file}: Product "${node.name}" brand is a bare @id ref (inline a Brand instead)`);
    // Google requires price on PRODUCT offers (this is what invalidated the
    // 5 blends in July 2026). MenuItem offers are exempt - no rich result.
    const offers = Array.isArray(node.offers) ? node.offers : node.offers ? [node.offers] : [];
    for (const o of offers) {
      if (!o.price && !o.priceSpecification)
        errors.push(`${file}: Product "${node.name}" offer missing "price"`);
      if (!o.priceCurrency && !o.priceSpecification)
        errors.push(`${file}: Product "${node.name}" offer missing "priceCurrency"`);
    }
  }
  if (types.includes("Event")) {
    for (const k of ["eventStatus", "description", "image", "startDate", "location"])
      if (!has(k)) warns.push(`${file}: Event "${node.name || "?"}" missing "${k}"`);
  }
  if (types.some((x) => ["NewsArticle", "BlogPosting", "Article"].includes(x))) {
    for (const k of ["headline", "image", "datePublished"])
      if (!has(k)) warns.push(`${file}: ${types[0]} missing "${k}"`);
  }
  if (types.some((x) => ["CafeOrCoffeeShop", "LocalBusiness"].includes(x))) {
    if (node.address && node.address.streetAddress && !has("geo"))
      warns.push(`${file}: ${types[0]} "${node.name}" has street address but no geo`);
  }
  if (types.includes("FAQPage")) {
    if (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0)
      errors.push(`${file}: FAQPage with empty mainEntity`);
  }
}

// ---- cross-file fact drift: strings that must never appear ----
const BANNED = [
  ["Magazine Street Blend", "no such blend exists (lineup: Streetcar, French Roast, St. Roch, Cold Brew, CR Espresso)"],
  ["Metaerie", "misspelling of Metairie"],
  ["wholesale@crcoffeenola.com", "address does not exist; use coastroastcoffeestroch@gmail.com"],
  ["info@crcoffeenola.com", "unmonitored; use coastroastcoffeestroch@gmail.com"],
  ["steep 12 hours", "cold brew steep is 18 hours"],
  ["steep twelve hours", "cold brew steep is 18 hours"],
  ["Sun 7am-7pm", "Magazine St is open 6am on Sundays too (daily 6am-7pm)"],
  ["www.crcoffeenola.com", "canonical host is apex crcoffeenola.com"],
  // Rebuild-era rules (2026-08-31):
  ["Crescent Room", "dropped from the rebuild; redirects point at /magazine-street"],
  ["operates inside Louis Armstrong", "airport is a naming-rights presence: say 'CR Coffee is inside Louis Armstrong'"],
  ["Milk-chocolate, velvety body, citrus lift", "old Streetcar notes; canonical is 'Full body, light acidity, smooth and satisfying finish'"],
  ["unleash", "phrasing barred from all CR copy (trademark caution)"],
  ["—", "no em dashes in site copy (Kevin's rule); use commas, colons, or periods"],
];

for (const file of htmlFiles().concat([path.join(ROOT, "llms.txt"), path.join(ROOT, ".well-known", "ai-agent.json")])) {
  if (!fs.existsSync(file)) continue;
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const text = fs.readFileSync(file, "utf8");

  for (const [needle, why] of BANNED)
    if (text.includes(needle)) errors.push(`${rel}: contains "${needle}" (${why})`);

  if (!file.endsWith(".html")) continue;
  const defs = new Set();
  const refs = new Set();
  const parsed = [];
  blocks(text).forEach((b, i) => {
    try {
      parsed.push(JSON.parse(b));
    } catch (e) {
      errors.push(`${rel}: JSON-LD block ${i + 1} does not parse: ${e.message}`);
    }
  });
  for (const p of parsed)
    walk(p, (node) => {
      checkNode(node, rel);
      if (node["@id"]) {
        if (Object.keys(node).filter((k) => k !== "@id").length >= 2) defs.add(node["@id"]);
        else refs.add(node["@id"]);
      }
    });
  // Only fragment @ids (#organization, #location, #product...) are entity
  // references that must resolve on-page. Plain page-URL @ids (e.g.
  // mainEntityOfPage self-references) are navigational and fine.
  for (const r of refs)
    if (!defs.has(r) && r.startsWith("https://crcoffeenola.com") && r.includes("#"))
      warns.push(`${rel}: @id reference not defined on this page: ${r}`);
}

for (const w of warns) console.log("WARN  " + w);
for (const e of errors) console.log("ERROR " + e);
console.log(`\n${errors.length} errors, ${warns.length} warnings across ${htmlFiles().length} pages`);
process.exit(errors.length ? 1 : 0);
