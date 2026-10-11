import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const FRONTEND_ROOT = resolve(__dirname, "..", "..");
const LOCALES_DIR = resolve(FRONTEND_ROOT, "src", "locales");
const SRC_DIR = resolve(FRONTEND_ROOT, "src");

// Technical terms that legitimately stay identical across languages
const VALUE_MISUSE_PATTERNS = [
  /(?:^|[\s<])(?:v-bind)?:value\s*=\s*"[^"]*\$?\bt\(/,
  /\bvalue\s*:\s*(?:\$t|t|i18n\.global\.t)\(/,
  /(?:===|!==|==|!=)\s*(?:\$t|t|i18n\.global\.t)\(\s*["'`]/,
  /(?:\$t|\bt|i18n\.global\.t)\(\s*["'`][\w.${}]+["'`][^)]*\)\s*(?:===|!==)/,
];

const IDENTICAL_TERM_ALLOWLIST = new Set([
  "heym",
  "imap trigger",
  "amazon s3",
  "workflows",
  "traces",
  "mcp",
  "chat",
  "dashboard",
  "datatable",
  "drive",
  "credentials",
  "evals",
  "teams",
  "sso",
  "cron",
  "qdrant",
  "postgres",
  "openai",
  "gravatar",
  "curl",
  "status",
  "input",
  "output",
  "description",
  "name",
  "id",
  "english",
  "deutsch",
  "polski",
  "none",
  "update",
  "heym work",
  "telegram trigger",
  "websocket trigger",
  "slack trigger",
  "discord trigger",
  "heym trigger",
  "code (js/ts)",
  "google drive",
  "heym drive",
  "plugin trigger",
  "quick drawer",
  "raw json body",
  "request body",
  "sse streaming",
  "opencode go",
  "workflow llm",
  "jwt token",
  "header auth",
  "rate limit (429)",
  "{current} / {total}",
  "lat.",
  "tokens: {tokens}",
  "issuer url",
  "client id",
  "client secret",
  "redirect uri",
  "otlp endpoint",
  "version {number}",
  "{count} downloads",
]);

// S12 Formality regex patterns
const INFORMAL_PATTERNS: Record<string, RegExp> = {
  de: /\b(du|dir|dich|dein|deine|deinem|deinen|deiner|deines)\b/i,
  pl: /\b(twój|twoja|twoje|twoim|twoich|twojemu|twoją|twojej|masz|musisz|chcesz)\b/i,
  // Impersonal sv/da: forbid du/dig/din AND formal ni/De
  sv: /\b(du|dig|din|ditt|dina|ni|er|ert|era)\b/i,
  da: /\b(du|dig|din|dit|dine)\b/i,
  "zh-Hans": /你/,
};

export interface CheckOptions {
  locales?: string[];
  strict?: boolean;
}

export function runI18nCheck(options: CheckOptions = {}): boolean {
  console.log("=== Checking i18n Translation Integrity ===");

  const enPath = resolve(LOCALES_DIR, "en.json");
  if (!existsSync(enPath)) {
    console.error(`[ERROR] en.json not found at ${enPath}`);
    return false;
  }

  const enContent = JSON.parse(readFileSync(enPath, "utf-8"));
  const enFlat = flattenObject(enContent);
  const totalEnKeys = Object.keys(enFlat).length;
  console.log(`\n1. Source locale en.json: ${totalEnKeys} keys found.`);

  // Determine locales to check
  const files = readdirSync(LOCALES_DIR).filter(
    (f) => f.endsWith(".json") && f !== "en.json" && !f.startsWith("_")
  );
  const targetLocales = options.locales || files.map((f) => f.replace(".json", ""));

  let hasErrors = false;
  let totalWarnings = 0;

  for (const loc of targetLocales) {
    const locFile = `${loc}.json`;
    const locPath = resolve(LOCALES_DIR, locFile);
    if (!existsSync(locPath)) {
      console.error(`[ERROR] Required locale file missing: ${locFile}`);
      hasErrors = true;
      continue;
    }

    console.log(`\nChecking locale: ${loc}`);
    let locContent: Record<string, unknown>;
    try {
      locContent = JSON.parse(readFileSync(locPath, "utf-8"));
    } catch (e) {
      console.error(`[ERROR] Invalid JSON in ${locFile}:`, e);
      hasErrors = true;
      continue;
    }

    const locFlat = flattenObject(locContent);
    const locKeys = new Set(Object.keys(locFlat));
    const enKeys = new Set(Object.keys(enFlat));

    // S1: Missing and Extra keys
    const missingKeys = [...enKeys].filter((k) => !locKeys.has(k));
    const extraKeys = [...locKeys].filter((k) => !enKeys.has(k));

    if (missingKeys.length > 0) {
      console.error(`  [ERROR S1] Missing ${missingKeys.length} keys in ${loc}:`, missingKeys.slice(0, 10));
      hasErrors = true;
    }
    if (extraKeys.length > 0) {
      console.error(`  [ERROR S1] Extra ${extraKeys.length} unknown keys in ${loc}:`, extraKeys.slice(0, 10));
      hasErrors = true;
    }

    let emptyCount = 0;
    let placeholderMismatches = 0;
    let escapingErrors = 0;
    let identicalWarnings = 0;
    let informalityErrors = 0;

    const informalRegex = INFORMAL_PATTERNS[loc];

    for (const [key, enVal] of Object.entries(enFlat)) {
      const locVal = locFlat[key];
      if (typeof locVal !== "string") continue;

      // S2: Empty values
      if (locVal.trim() === "") {
        emptyCount++;
      }

      // S3: Placeholder parity
      const enPlaceholders = extractPlaceholders(enVal);
      const locPlaceholders = extractPlaceholders(locVal);
      if (!areSetsEqual(enPlaceholders, locPlaceholders)) {
        placeholderMismatches++;
        if (placeholderMismatches <= 5) {
          console.error(`  [ERROR S3] Placeholder mismatch at key "${key}": expected [${[...enPlaceholders].join(",")}], got [${[...locPlaceholders].join(",")}]`);
        }
      }

      // S6: Escaping checks
      if (locVal.includes("@") && !locVal.includes("{'@'}") && !locVal.startsWith("@:")) {
        escapingErrors++;
      }

      // S8: Identical to English check
      if (
        enVal.trim() === locVal.trim() &&
        enVal.trim().length > 3 &&
        !IDENTICAL_TERM_ALLOWLIST.has(enVal.toLowerCase().trim()) &&
        !/^[{<][\s\S]*[}>]$/.test(enVal.trim()) &&
        !/^[0-9\s.,:\-/+]+$/.test(enVal.trim())
      ) {
        identicalWarnings++;
      }

      // S12: Formality check
      if (informalRegex && informalRegex.test(locVal)) {
        informalityErrors++;
        if (informalityErrors <= 3) {
          console.error(`  [ERROR S12] Informality detected in ${loc} at key "${key}": "${locVal}"`);
        }
      }
    }

    if (emptyCount > 0) {
      console.error(`  [ERROR S2] ${emptyCount} empty translations in ${loc}`);
      hasErrors = true;
    }
    if (placeholderMismatches > 0) {
      console.error(`  [ERROR S3] ${placeholderMismatches} placeholder mismatches in ${loc}`);
      hasErrors = true;
    }
    if (escapingErrors > 0) {
      console.error(`  [ERROR S6] ${escapingErrors} unescaped '@' in ${loc}`);
      hasErrors = true;
    }
    if (informalityErrors > 0) {
      console.error(`  [ERROR S12] ${informalityErrors} informal phrases found in ${loc}`);
      hasErrors = true;
    }
    if (identicalWarnings > 0) {
      console.log(`  [WARN S8] ${identicalWarnings} keys identical to English in ${loc}`);
      totalWarnings += identicalWarnings;
    }

    if (missingKeys.length === 0 && extraKeys.length === 0 && emptyCount === 0 && placeholderMismatches === 0) {
      console.log(`  [OK] ${loc} has 100% key parity (${Object.keys(locFlat).length} keys).`);
    }
  }

  // Scan codebase for invalid key usage and value misuse (Rule 3b)
  console.log("\n2. Scanning code files for key validity and value misuse...");
  const codeCheck = scanSourceFiles(enFlat);
  if (!codeCheck) {
    hasErrors = true;
  }

  console.log(`\n=== Result: ${hasErrors ? "FAILED ❌" : "PASSED ✅"} (${totalWarnings} warnings) ===`);
  return !hasErrors;
}

function extractPlaceholders(text: string): Set<string> {
  const matches = text.match(/\{[a-zA-Z0-9_]+\}/g);
  return new Set(matches || []);
}

function areSetsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const res: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(res, flattenObject(v as Record<string, unknown>, fullKey));
    } else {
      res[fullKey] = String(v ?? "");
    }
  }
  return res;
}

function scanSourceFiles(enFlat: Record<string, string>): boolean {
  const allFiles: string[] = [];
  collectFiles(SRC_DIR, allFiles);

  const keyRegex = /(?:\$t|\bt|i18n\.global\.t)\(\s*["'`]([\w.-]+)["'`]/g;
  let errors = 0;

  for (const file of allFiles) {
    const content = readFileSync(file, "utf-8");

    // Check Rule 3b: Value misuse
    for (const pattern of VALUE_MISUSE_PATTERNS) {
      if (pattern.test(content)) {
        console.error(`  [ERROR 3b] Translated text used as value in ${relative(FRONTEND_ROOT, file)}`);
        errors++;
      }
    }

    // Check key validity
    let match: RegExpExecArray | null;
    while ((match = keyRegex.exec(content)) !== null) {
      const key = match[1];
      // Skip dynamic interpolations like nodes.${type}.label
      if (key.includes("${") || key.endsWith(".")) continue;
      if (!enFlat[key] && !key.startsWith("docs.titles.") && !key.startsWith("docs.categories.")) {
        // Some keys might be dynamic prefixes
        const hasPrefixMatch = Object.keys(enFlat).some((k) => k.startsWith(key + "."));
        if (!hasPrefixMatch) {
          console.error(`  [ERROR] Unknown translation key "${key}" in ${relative(FRONTEND_ROOT, file)}`);
          errors++;
        }
      }
    }
  }

  return errors === 0;
}

function collectFiles(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".") || entry === "node_modules" || entry === "dist") continue;
    const full = resolve(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      collectFiles(full, out);
    } else if (entry.endsWith(".vue") || entry.endsWith(".ts")) {
      out.push(full);
    }
  }
}

// CLI entry point
if (process.argv[1] && process.argv[1].endsWith("check.ts")) {
  const success = runI18nCheck();
  process.exit(success ? 0 : 1);
}
