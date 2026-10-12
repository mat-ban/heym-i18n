import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const FRONTEND_ROOT = resolve(__dirname, "..", "..");
const FRONTEND_SRC = resolve(FRONTEND_ROOT, "src");

function collectFiles(dir: string, exts: string[]): string[] {
  let results: string[] = [];
  for (const file of readdirSync(dir)) {
    if (file.startsWith(".") || file === "node_modules" || file === "dist") continue;
    const full = resolve(dir, file);
    const st = statSync(full);
    if (st.isDirectory()) {
      results = results.concat(collectFiles(full, exts));
    } else if (exts.includes(extname(file))) {
      results.push(full);
    }
  }
  return results;
}

const vueFiles = collectFiles(FRONTEND_SRC, [".vue"]);

// Unbound attributes: placeholder="...", title="...", aria-label="..." (NOT :placeholder="...")
const UNBOUND_ATTR_REGEX = /(?<![:\w-])(placeholder|title|aria-label)\s*=\s*"([^"]+)"/g;

// Plain text in tags: > ... <
const TAG_TEXT_REGEX = />\s*([^<>{}\r\n]+?)\s*</g;

const IGNORE_PATTERNS = [
  /^[\s\d.,:/_#\-–—+*|()[\]{}<>]+$/,
  /^[A-Z0-9_-]+$/, // CONSTANTS, IDs
  /^\d+(\.\d+)?(px|rem|em|%|ms|s|KB|MB|GB)?$/,
  /^lucide:/i,
  /^https?:\/\//,
  /^(GET|POST|PUT|DELETE|PATCH)$/,
  /^(true|false|null|undefined)$/,
  /^&[a-z0-9#]+;$/i, // HTML entities
  /^\s*$/
];

interface Finding {
  file: string;
  type: string;
  text: string;
}

export function scanUnlocalizedStrings(options: { targetFiles?: string[] } = {}): Finding[] {
  const filesToScan = options.targetFiles
    ? options.targetFiles.filter((f) => f.endsWith(".vue")).map((f) => resolve(FRONTEND_ROOT, f))
    : vueFiles;

  const results: Finding[] = [];

  for (const file of filesToScan) {
    if (!statSync(file, { throwIfNoEntry: false })) continue;
    const content = readFileSync(file, "utf-8");
    const relPath = relative(FRONTEND_SRC, file);

    const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
    if (!templateMatch) continue;
    const template = templateMatch[1].replace(/<!--[\s\S]*?-->/g, "");

    // Check unbound attributes
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = UNBOUND_ATTR_REGEX.exec(template)) !== null) {
      const [, attrName, text] = attrMatch;
      const trimmed = text.trim();
      if (!trimmed || IGNORE_PATTERNS.some((p) => p.test(trimmed))) continue;
      results.push({ file: relPath, type: `attr:${attrName}`, text: trimmed });
    }

    // Check tag text
    let textMatch: RegExpExecArray | null;
    while ((textMatch = TAG_TEXT_REGEX.exec(template)) !== null) {
      const text = textMatch[1].trim();
      if (!text || IGNORE_PATTERNS.some((p) => p.test(text))) continue;
      if (text.length <= 1) continue;
      results.push({ file: relPath, type: "text", text });
    }
  }

  return results;
}

if (process.argv[1] && process.argv[1].endsWith("scan-unlocalized.ts")) {
  console.log("=== Scanning Vue templates for unlocalized strings ===");
  const findings = scanUnlocalizedStrings();
  console.log(`Found ${findings.length} potentially unlocalized string occurrences.`);

  const byFile: Record<string, Finding[]> = {};
  for (const f of findings) {
    if (!byFile[f.file]) byFile[f.file] = [];
    byFile[f.file].push(f);
  }

  for (const [file, items] of Object.entries(byFile)) {
    console.log(`\n${file} (${items.length}):`);
    for (const item of items.slice(0, 5)) {
      console.log(`  [${item.type}] ${item.text}`);
    }
    if (items.length > 5) {
      console.log(`  ... and ${items.length - 5} more`);
    }
  }
}
