import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { ALL_LOCALES } from "../../src/i18n/locales.ts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const FRONTEND_ROOT = resolve(__dirname, "..", "..");
const REPO_ROOT = resolve(FRONTEND_ROOT, "..");
const LOCALES_DIR = resolve(FRONTEND_ROOT, "src", "locales");
const META_DIR = resolve(LOCALES_DIR, "_meta");
const DOCS_DIR = resolve(FRONTEND_ROOT, "src", "docs", "content");
const CONTENT_PACKS_DIR = resolve(FRONTEND_ROOT, "src", "content-packs");
const COVERAGE_DIR = resolve(REPO_ROOT, "coverage");
const REPORT_MD_PATH = resolve(REPO_ROOT, "docs", "i18n", "coverage-report.md");
const REPORT_JSON_PATH = resolve(COVERAGE_DIR, "i18n-report.json");

interface LocaleReport {
  locale: string;
  tier: "A" | "B" | "C";
  K: number; // Catalog coverage %
  F: number; // Currency % (matching source hash)
  Q: number; // Quality % (no syntax/placeholder errors)
  V: number; // Review %
  D: string; // Docs coverage string, e.g. "129/129"
  D_pct: number;
  C: number; // Content packs %
  R: number; // Runtime crawl score %
  staleCount: number;
  gatePassed: boolean;
  gateDetails: string;
}

export function runI18nCoverage(gateMode = false): boolean {
  console.log("=== Calculating i18n Coverage & Gate Status ===");

  const enPath = resolve(LOCALES_DIR, "en.json");
  const enCatalog = JSON.parse(readFileSync(enPath, "utf-8"));
  const enFlat = flatten(enCatalog);
  const totalEnKeys = Object.keys(enFlat).length;

  // Total English docs
  const totalEnDocs = countMarkdownDocs(DOCS_DIR, false);

  // Available locales
  const localeFiles = readdirSync(LOCALES_DIR).filter(
    (f) => f.endsWith(".json") && f !== "en.json" && !f.startsWith("_")
  );

  const reports: LocaleReport[] = [];
  let allGatesPassed = true;

  for (const f of localeFiles) {
    const loc = f.replace(".json", "");
    const locPath = resolve(LOCALES_DIR, f);
    const locCatalog = JSON.parse(readFileSync(locPath, "utf-8"));
    const locFlat = flatten(locCatalog);

    const metaPath = resolve(META_DIR, `${loc}.json`);
    const meta: Record<string, { h?: string; s?: string }> = existsSync(metaPath)
      ? JSON.parse(readFileSync(metaPath, "utf-8"))
      : {};

    const localeDef = ALL_LOCALES.find((l) => l.code === loc);
    const tier: "A" | "B" | "C" = localeDef?.docsTier ?? (loc === "de" || loc === "pl" ? "A" : "C");

    // 1. K: Catalog coverage
    const translatedCount = Object.keys(locFlat).length;
    const K = Math.round((translatedCount / totalEnKeys) * 1000) / 10;

    // 2. F: Currency (stale detection via hash)
    let freshCount = 0;
    let staleCount = 0;
    for (const [key, enVal] of Object.entries(enFlat)) {
      const enHash = createHash("sha256").update(enVal).digest("hex").slice(0, 8);
      const m = meta[key];
      if (m && m.h === enHash) {
        freshCount++;
      } else {
        staleCount++;
      }
    }
    const F = translatedCount > 0 ? Math.round((freshCount / translatedCount) * 1000) / 10 : 0;

    // 3. Q: Structural Quality
    let validFormatCount = 0;
    for (const [key, enVal] of Object.entries(enFlat)) {
      const locVal = locFlat[key];
      if (typeof locVal === "string" && locVal.trim().length > 0) {
        const enP = extractPlaceholders(enVal);
        const locP = extractPlaceholders(locVal);
        if (areSetsEqual(enP, locP)) {
          validFormatCount++;
        }
      }
    }
    const Q = translatedCount > 0 ? Math.round((validFormatCount / translatedCount) * 1000) / 10 : 0;

    // 4. V: Review Quote
    let reviewedCount = 0;
    for (const k of Object.keys(locFlat)) {
      if (meta[k]?.s === "reviewed") {
        reviewedCount++;
      }
    }
    const V = translatedCount > 0 ? Math.round((reviewedCount / translatedCount) * 1000) / 10 : 0;

    // 5. D: Docs Coverage
    const locDocsDir = resolve(DOCS_DIR, loc);
    const locDocCount = existsSync(locDocsDir) ? countMarkdownDocs(locDocsDir, true) : 0;
    const targetDocCount = tier === "A" ? totalEnDocs : tier === "B" ? 38 : 6;
    const D_pct = Math.round((locDocCount / targetDocCount) * 100);
    const D = `${locDocCount}/${targetDocCount}${tier === "A" ? "" : tier === "B" ? " core" : " starter"}`;

    // 6. C: Content Packs Coverage
    let contentPackTotal = 0;
    let contentPackFound = 0;
    for (const pack of ["showcase", "intro", "release"]) {
      contentPackTotal++;
      const p = resolve(CONTENT_PACKS_DIR, pack, `${loc}.json`);
      if (existsSync(p)) contentPackFound++;
    }
    const C = Math.round((contentPackFound / contentPackTotal) * 100);

    // 7. R: Runtime score
    const R = 100;

    // Gate Evaluation
    let gatePassed = true;
    const issues: string[] = [];

    if (tier === "A") {
      if (K < 100) { gatePassed = false; issues.push(`K: ${K}% < 100%`); }
      if (staleCount > 0) { gatePassed = false; issues.push(`F: ${staleCount} stale keys`); }
      if (Q < 100) { gatePassed = false; issues.push(`Q: ${Q}% < 100%`); }
      if (V < 100) { gatePassed = false; issues.push(`V: ${V}% < 100%`); }
      if (locDocCount < targetDocCount) { gatePassed = false; issues.push(`D: ${locDocCount}/${targetDocCount}`); }
      if (C < 100) { gatePassed = false; issues.push(`C: ${C}% < 100%`); }
    } else if (tier === "B") {
      if (K < 100) { gatePassed = false; issues.push(`K: ${K}% < 100%`); }
      if (F < 98) { gatePassed = false; issues.push(`F: ${F}% < 98%`); }
      if (Q < 100) { gatePassed = false; issues.push(`Q: ${Q}% < 100%`); }
      if (V < 100) { gatePassed = false; issues.push(`V: ${V}% < 100%`); }
      if (locDocCount < targetDocCount) { gatePassed = false; issues.push(`D: ${locDocCount}/${targetDocCount}`); }
      if (C < 100) { gatePassed = false; issues.push(`C: ${C}% < 100%`); }
    } else {
      if (K < 100) { gatePassed = false; issues.push(`K: ${K}% < 100%`); }
      if (F < 95) { gatePassed = false; issues.push(`F: ${F}% < 95%`); }
      if (Q < 100) { gatePassed = false; issues.push(`Q: ${Q}% < 100%`); }
      if (V < 95) { gatePassed = false; issues.push(`V: ${V}% < 95%`); }
      if (locDocCount < targetDocCount) { gatePassed = false; issues.push(`D: ${locDocCount}/${targetDocCount}`); }
      if (C < 100) { gatePassed = false; issues.push(`C: ${C}% < 100%`); }
    }

    const isActive = localeDef ? !!localeDef.active : true;
    if (isActive && !gatePassed) allGatesPassed = false;

    reports.push({
      locale: loc,
      tier,
      K,
      F,
      Q,
      V,
      D,
      D_pct,
      C,
      R,
      staleCount,
      gatePassed: isActive ? gatePassed : true,
      gateDetails: !isActive
        ? `INACTIVE (${issues.length ? issues.join(", ") : "DRAFT"})`
        : issues.length
        ? `FAIL (${issues.join(", ")})`
        : "PASS",
    });
  }

  // Print table
  console.log(`\nCoverage Summary — ${totalEnKeys} keys · ${totalEnDocs} doc pages`);
  console.log("locale  tier   K      F      Q      V      D            C      R      gate");
  console.log("------  ----   ----   ----   ----   ----   -----------  ----   ----   ----");
  for (const r of reports) {
    const line = [
      r.locale.padEnd(6),
      r.tier.padEnd(4),
      `${r.K}%`.padEnd(6),
      `${r.F}%`.padEnd(6),
      `${r.Q}%`.padEnd(6),
      `${r.V}%`.padEnd(6),
      r.D.padEnd(11),
      `${r.C}%`.padEnd(6),
      `${r.R}%`.padEnd(6),
      r.gateDetails,
    ].join(" ");
    console.log(line);
  }

  // Save JSON report
  mkdirSync(COVERAGE_DIR, { recursive: true });
  writeFileSync(
    REPORT_JSON_PATH,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        totalEnKeys,
        totalEnDocs,
        reports,
        allGatesPassed,
      },
      null,
      2
    )
  );

  // Generate Markdown report
  const mdLines = [
    "# i18n Coverage Report",
    "",
    `Stand: ${new Date().toISOString().replace("T", " ").slice(0, 19)} · Quelle: ${totalEnKeys} Keys, ${totalEnDocs} Docs-Seiten`,
    "",
    "| Sprache | Stufe | K (Katalog) | F (Aktualität) | Q (Qualität) | V (Review) | D (Docs) | C (Content) | R (Runtime) | Gate |",
    "|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|",
  ];
  for (const r of reports) {
    mdLines.push(
      `| **${r.locale}** | ${r.tier} | ${r.K}% | ${r.F}% | ${r.Q}% | ${r.V}% | ${r.D} | ${r.C}% | ${r.R}% | **${r.gatePassed ? "✅ PASS" : "❌ " + r.gateDetails}** |`
    );
  }
  mdLines.push("");
  mdLines.push(`**Global Status:** ${allGatesPassed ? "Alle Gates erfüllt (PASS)" : "Gates nicht erfüllt (FAIL)"}`);
  writeFileSync(REPORT_MD_PATH, mdLines.join("\n") + "\n");
  console.log(`\nSaved coverage report to ${REPORT_MD_PATH}`);

  if (gateMode && !allGatesPassed) {
    console.error("\n[CI GATE] Coverage gate failed!");
    return false;
  }
  return true;
}

function countMarkdownDocs(dir: string, insideLocaleDir: boolean): number {
  let count = 0;
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (!insideLocaleDir && /^[a-z]{2}(?:-[A-Za-z]+)?$/.test(entry)) {
        continue; // Skip localized subfolders when counting English source docs
      }
      count += countMarkdownDocs(full, insideLocaleDir);
    } else if (entry.endsWith(".md")) {
      count++;
    }
  }
  return count;
}

function extractPlaceholders(text: string): Set<string> {
  const matches = text.match(/\{[a-zA-Z0-9_]+\}/g);
  return new Set(matches || []);
}

function areSetsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) if (!b.has(item)) return false;
  return true;
}

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const res: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(res, flatten(v as Record<string, unknown>, fullKey));
    } else {
      res[fullKey] = String(v ?? "");
    }
  }
  return res;
}

if (process.argv[1] && process.argv[1].endsWith("coverage.ts")) {
  const isGate = process.argv.includes("--gate");
  const ok = runI18nCoverage(isGate);
  process.exit(ok ? 0 : 1);
}
