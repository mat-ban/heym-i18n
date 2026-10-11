import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const FRONTEND_ROOT = resolve(__dirname, "..", "..");
const EN_PATH = resolve(FRONTEND_ROOT, "src", "locales", "en.json");
const NODE_DEF_PATH = resolve(FRONTEND_ROOT, "src", "types", "node.ts");
const CRED_DEF_PATH = resolve(FRONTEND_ROOT, "src", "types", "credential.ts");

export function checkDrift(): boolean {
  console.log("=== Checking Upstream Drift for en.json ===");

  const en = JSON.parse(readFileSync(EN_PATH, "utf-8"));
  let driftCount = 0;

  // 1. Check Node definitions
  const nodeTs = readFileSync(NODE_DEF_PATH, "utf-8");
  const nodeLabelRegex = /type:\s*NodeType\.(\w+)[\s\S]*?label:\s*"([^"]+)"[\s\S]*?description:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;

  while ((match = nodeLabelRegex.exec(nodeTs)) !== null) {
    const [, nodeType, expectedLabel, expectedDesc] = match;
    const catNode = en.nodes?.[nodeType];
    if (!catNode) {
      console.error(`  [DRIFT] Missing node in en.json: nodes.${nodeType}`);
      driftCount++;
      continue;
    }
    if (catNode.label !== expectedLabel) {
      console.error(`  [DRIFT] Node label mismatch for ${nodeType}: expected "${expectedLabel}", got "${catNode.label}"`);
      driftCount++;
    }
    if (catNode.description !== expectedDesc) {
      console.error(`  [DRIFT] Node description mismatch for ${nodeType}: expected "${expectedDesc}", got "${catNode.description}"`);
      driftCount++;
    }
  }

  // 2. Check Credential descriptions
  const credTs = readFileSync(CRED_DEF_PATH, "utf-8");
  const credDescRegex = /(\w+):\s*"([^"]+)"/g;
  const descBlockMatch = credTs.match(/export const CREDENTIAL_TYPE_DESCRIPTIONS[^=]*=\s*\{([\s\S]*?)\};/);
  if (descBlockMatch) {
    const block = descBlockMatch[1];
    while ((match = credDescRegex.exec(block)) !== null) {
      const [, credType, expectedDesc] = match;
      const catDesc = en.credentials?.types?.[credType]?.description;
      if (catDesc && catDesc !== expectedDesc) {
        console.error(`  [DRIFT] Credential desc mismatch for ${credType}: expected "${expectedDesc}", got "${catDesc}"`);
        driftCount++;
      }
    }
  }

  console.log(`\nDrift check finished with ${driftCount} differences.`);
  return driftCount === 0;
}

if (process.argv[1] && process.argv[1].endsWith("drift.ts")) {
  const ok = checkDrift();
  process.exit(ok ? 0 : 1);
}
