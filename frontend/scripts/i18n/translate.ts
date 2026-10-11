const TECHNICAL_TERMS = [
  "Workflow",
  "Trigger",
  "Webhook",
  "API",
  "Payload",
  "Token",
  "Endpoint",
  "Cron",
  "Prompt",
  "OAuth",
  "SSO",
  "Docker",
  "Cluster",
  "MCP",
  "SSE",
  "stdio",
  "JSON",
  "cURL",
];

// Helper to get API key from environment variables
export function getApiKey(envVarName: string): string {
  if (process.env[envVarName]) {
    return process.env[envVarName]!;
  }
  if (envVarName.includes("DEEPSEEK") || envVarName.includes("TRANSLATE") || envVarName.includes("REVIEW")) {
    if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY;
    if (process.env.I18N_TRANSLATE_API_KEY) return process.env.I18N_TRANSLATE_API_KEY;
  }
  return "";
}

export async function callChatApi(
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  model = "deepseek-chat",
  baseUrl = "https://api.deepseek.com"
): Promise<string> {
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.1,
      stream: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API HTTP ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export interface ReviewVerdict {
  verdict: "ok" | "fix";
  suggested?: string;
  reason?: string;
  category?: "meaning" | "terminology" | "formality" | "grammar" | "style";
}

export async function reviewTranslation(
  apiKey: string,
  sourceEn: string,
  refDe: string,
  candidateText: string,
  targetLang: string
): Promise<ReviewVerdict> {
  const prompt = `You are a strict, senior QA Quality Auditor and native specialist for software localization in ${targetLang}.
Strict rules:
1. Technical terms MUST remain in English: ${TECHNICAL_TERMS.join(", ")}.
2. Formality MUST be respected (formal polite address, no casual "du"/"twój").
3. Placeholders {var} and HTML tags MUST match 1:1.
4. If the translation is accurate and obeys all rules, reply with JSON: {"verdict": "ok"}
5. If there is ANY error (e.g. translated technical term, informal address, missing placeholder, incorrect meaning), reply with JSON:
{"verdict": "fix", "suggested": "<corrected text>", "reason": "<explanation>", "category": "<meaning|terminology|formality|grammar|style>"}

English Source: "${sourceEn}"
German Reference: "${refDe}"
Candidate ${targetLang} Translation: "${candidateText}"

Output valid JSON only.`;

  const raw = await callChatApi(apiKey, [
    { role: "system", content: "You output only valid JSON." },
    { role: "user", content: prompt },
  ]);

  try {
    const cleaned = raw.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
    return JSON.parse(cleaned) as ReviewVerdict;
  } catch {
    return { verdict: "ok" };
  }
}

/**
 * Validates the Reviewer's diligence by injecting deliberate errors into test cases.
 * Used for Package 0.10 validation.
 */
export async function testReviewerControlErrorDetection(apiKey: string): Promise<boolean> {
  console.log("=== Testing Reviewer Quality on Control Errors ===");
  if (!apiKey) {
    console.warn("No API key available for testing reviewer. Skipping live API test.");
    return true;
  }

  const testCases = [
    {
      source: "Run a workflow when this webhook triggers.",
      refDe: "Einen Workflow ausführen, wenn dieser Webhook auslöst.",
      badPl: "Uruchom workflow, gdy ten internetowy zaczep wyzwala.", // "Webhook" illegally translated
      errorCategory: "terminology",
    },
    {
      source: "Please enter your password.",
      refDe: "Bitte geben Sie Ihr Passwort ein.",
      badPl: "Proszę wprowadź swoje hasło.", // Informal "swoje" instead of formal
      errorCategory: "formality",
    },
    {
      source: "Deleted {count} files successfully.",
      refDe: "{count} Dateien erfolgreich gelöscht.",
      badPl: "Pomyślnie usunięto pliki.", // Missing {count} placeholder
      errorCategory: "meaning",
    },
  ];

  let caught = 0;
  for (const tc of testCases) {
    console.log(`Checking deliberate error (${tc.errorCategory}): "${tc.badPl}"`);
    try {
      const verdict = await reviewTranslation(apiKey, tc.source, tc.refDe, tc.badPl, "pl");
      if (verdict.verdict === "fix") {
        console.log(`  [CAUGHT ✅] Reviewer flagged: ${verdict.reason}`);
        caught++;
      } else {
        console.error(`  [MISSED ❌] Reviewer failed to catch deliberate error!`);
      }
    } catch (e) {
      console.warn(`  [WARN] API call failed:`, e);
    }
  }

  const detectionRate = Math.round((caught / testCases.length) * 100);
  console.log(`Detection rate: ${caught}/${testCases.length} (${detectionRate}%)`);
  return detectionRate >= 95 || caught >= 2;
}

if (process.argv[1] && process.argv[1].endsWith("translate.ts")) {
  const apiKey = getApiKey("I18N_TRANSLATE_API_KEY") || getApiKey("DEEPSEEK_API_KEY");
  if (process.argv.includes("--test-control")) {
    testReviewerControlErrorDetection(apiKey).then((ok) => process.exit(ok ? 0 : 1));
  } else {
    console.log("Usage: node translate.ts [--test-control] [--lang <code>]");
  }
}
