import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { createWorkflow, deleteWorkflow, prepareAuthenticatedPage } from "./support";
import type { TestWorkflow } from "./support";

/**
 * Guards the German UI.
 *
 * Instead of a hand-maintained list of "English words that must not appear", the
 * test derives it from the translation catalogs: every English string that has a
 * different German counterpart is a *leak* if it is still rendered while the UI is
 * set to German. Technical terms that intentionally stay English (Workflow,
 * Trigger, ...) are identical in both catalogs and are therefore never flagged.
 *
 * What this cannot see: text that is not in the catalogs at all (e.g. strings
 * returned by the backend) and hard-coded strings that never existed in `en.json`.
 * Those are covered by the heuristics in `npm run i18n:check`.
 */

const LOCALE_STORAGE_KEY = "heym_locale";

/** Dashboard tabs reachable as `/?tab=<id>` on a fresh account. */
const DASHBOARD_TABS = [
  "workflows",
  "board",
  "templates",
  "globalvariables",
  "chat",
  "drive",
  "datatable",
  "schedules",
  "credentials",
  "vectorstores",
  "mcp",
  "traces",
  "analytics",
  "dashboard",
  "teams",
  "logs",
];

type Catalog = { [key: string]: string | Catalog };

function flatten(catalog: Catalog, prefix = ""): Map<string, string> {
  const result = new Map<string, string>();
  for (const [key, value] of Object.entries(catalog)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") result.set(full, value);
    else for (const [k, v] of flatten(value, full)) result.set(k, v);
  }
  return result;
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function loadCatalog(rootDir: string, locale: string): Map<string, string> {
  const file = path.resolve(rootDir, "..", "src", "locales", `${locale}.json`);
  return flatten(JSON.parse(fs.readFileSync(file, "utf-8")) as Catalog);
}

/**
 * English strings that were translated to something different in the target language. Strings
 * that also exist as a localized value somewhere (shared words) and strings that are
 * too short to be unambiguous are excluded to keep the check free of false alarms.
 */
function untranslatedCandidates(rootDir: string, targetLocale = "de"): Map<string, string> {
  const en = loadCatalog(rootDir, "en");
  const target = loadCatalog(rootDir, targetLocale);
  const targetValues = new Set([...target.values()].map(normalize));

  const candidates = new Map<string, string>();
  for (const [key, english] of en) {
    const localized = target.get(key);
    const value = normalize(english);
    if (localized === undefined || normalize(localized) === value) continue;
    if (value.length < 4 || /[{}@|]/.test(value)) continue;
    if (targetValues.has(value)) continue;
    candidates.set(value, key);
  }
  return candidates;
}

/** Visible text nodes plus user-facing attributes of the current page. */
async function visibleTexts(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const SKIPPED = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "TITLE"]);
    const found = new Set<string>();

    const isVisible = (element: Element): boolean => {
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") return false;
      return element.getClientRects().length > 0;
    };

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      const text = node.textContent?.replace(/\s+/g, " ").trim();
      if (!parent || !text || SKIPPED.has(parent.tagName) || !isVisible(parent)) continue;
      found.add(text);
    }

    for (const element of document.querySelectorAll("[placeholder], [title], [aria-label]")) {
      if (!isVisible(element)) continue;
      for (const attribute of ["placeholder", "title", "aria-label"]) {
        const value = element.getAttribute(attribute)?.replace(/\s+/g, " ").trim();
        if (value) found.add(value);
      }
    }

    // Selects and comboboxes render their current choice as an input value.
    for (const input of document.querySelectorAll("input")) {
      if (!isVisible(input) || input.type === "password") continue;
      const value = input.value?.replace(/\s+/g, " ").trim();
      if (value) found.add(value);
    }
    return [...found];
  });
}

async function setLocale(page: Page, locale: "en" | "de"): Promise<void> {
  await prepareAuthenticatedPage(page);
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: LOCALE_STORAGE_KEY, value: locale },
  );
}

async function expectNoEnglishLeaks(page: Page, rootDir: string, where: string): Promise<void> {
  const candidates = untranslatedCandidates(rootDir);
  const leaks = (await visibleTexts(page))
    .map(normalize)
    .filter((text) => candidates.has(text))
    .map((text) => `"${text}" (key: ${candidates.get(text)})`);
  expect(leaks, `English text rendered in German UI on ${where}`).toEqual([]);
}

test.describe("German UI", () => {
  // Several screens only render certain strings once data exists (status badges,
  // analytics charts, execution inputs/outputs). Seed one finished execution so the
  // leak scan sees them regardless of which specs ran before.
  let seeded: TestWorkflow | undefined;

  test.beforeEach(async ({ page }) => {
    await setLocale(page, "de");
    seeded = await createWorkflow(
      page,
      `I18N Seed ${Date.now()}`,
      [
        {
          id: "input",
          type: "textInput",
          position: { x: 20, y: 100 },
          data: { label: "start", inputFields: [{ key: "text" }] },
        },
        {
          id: "result",
          type: "output",
          position: { x: 280, y: 100 },
          data: { label: "result", message: "$start.body.text" },
        },
      ],
      [{ id: "edge", source: "input", target: "result" }],
    );
    const run = await page.request.post(`/api/workflows/${seeded.id}/execute`, {
      data: { inputs: { text: "hello" } },
    });
    expect(run.ok()).toBeTruthy();
  });

  test.afterEach(async ({ page }) => {
    if (seeded) await deleteWorkflow(page, seeded.id);
    seeded = undefined;
  });

  test("catalogs provide a usable set of leak candidates", async ({}, testInfo) => {
    // Guards the guard: if this set collapses, the leak checks below would pass vacuously.
    expect(untranslatedCandidates(testInfo.config.rootDir).size).toBeGreaterThan(500);
  });

  for (const tab of DASHBOARD_TABS) {
    test(`tab "${tab}" is fully German`, async ({ page }, testInfo) => {
      await page.goto(`/?tab=${tab}`);
      await expect(page.locator("html")).toHaveAttribute("lang", "de");
      await page.waitForLoadState("networkidle");
      await expectNoEnglishLeaks(page, testInfo.config.rootDir, `/?tab=${tab}`);
    });
  }

  test("the evaluation view is fully German", async ({ page }, testInfo) => {
    await page.goto("/evals");
    await page.waitForLoadState("networkidle");
    await expectNoEnglishLeaks(page, testInfo.config.rootDir, "/evals");
  });

  test("the run history dialog is fully German", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Verlauf", exact: true }).click();
    // The newest run is selected automatically; wait for its detail panes (inputs,
    // outputs) so they are part of the scan.
    await expect(page.getByText("Eingaben", { exact: true })).toBeVisible();
    await page.waitForLoadState("networkidle");
    await expectNoEnglishLeaks(page, testInfo.config.rootDir, "run history dialog");
  });

  test("the user settings dialog is fully German", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.getByTitle("Einstellungen").click();
    await expect(page.locator("#user-language")).toBeVisible();
    await expectNoEnglishLeaks(page, testInfo.config.rootDir, "user settings dialog");
  });
});

test.describe("Language selection", () => {
  test.describe("with a German browser", () => {
    test.use({ locale: "de-DE" });

    test("first visit follows the browser language", async ({ page }) => {
      await prepareAuthenticatedPage(page);
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", "de");
      await expect(page.getByTitle("Einstellungen")).toBeVisible();
    });
  });

  test.describe("with an English browser", () => {
    test.use({ locale: "en-US" });

    test("first visit stays English", async ({ page }) => {
      await prepareAuthenticatedPage(page);
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.getByTitle("Settings")).toBeVisible();
    });

    test("a stored preference wins over the browser language", async ({ page }) => {
      await setLocale(page, "de");
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", "de");
      await expect(page.getByTitle("Einstellungen")).toBeVisible();
    });
  });

  test("switching the language in the user settings applies immediately and persists", async ({
    page,
  }) => {
    await prepareAuthenticatedPage(page);
    await page.goto("/");
    await page.getByTitle("Settings").click();

    await page.locator("#user-language select").selectOption("de");

    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.locator("label[for=user-language]")).toHaveText("Sprache");
    expect(await page.evaluate((key) => window.localStorage.getItem(key), LOCALE_STORAGE_KEY)).toBe(
      "de",
    );

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.getByTitle("Einstellungen")).toBeVisible();
  });
});
