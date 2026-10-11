import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { DOCS_MANIFEST, getDocsManifest } from "../src/docs/manifest";
import { prepareAuthenticatedPage } from "./support";

/**
 * Guards the German in-app documentation (`src/docs/content/de/**`).
 *
 * Everything is derived from the sources of truth instead of a hand-maintained
 * route list: the pages come from `DOCS_MANIFEST`, and the expected heading of
 * each page is read from its German Markdown file. A page that is added upstream
 * is therefore picked up automatically.
 *
 * Set `I18N_DOCS_ALLOW_MISSING=1` to downgrade "page has no German translation"
 * from a failure to a warning (useful right after rebasing onto a new upstream
 * release, before the new pages are translated; they fall back to English).
 */

const LOCALE_STORAGE_KEY = "heym_locale";

interface DocPage {
  categoryId: string;
  slug: string;
}

const DOC_PAGES: DocPage[] = Object.entries(DOCS_MANIFEST).flatMap(([categoryId, category]) =>
  category.items.map((item) => ({ categoryId, slug: item.slug })),
);

/**
 * Playwright's `config.rootDir` is the test directory (`frontend/e2e`), the sources live one
 * level up. `contentDir` is also asserted to exist so a wrong path can never make the
 * checks below pass vacuously.
 */
function contentDir(rootDir: string): string {
  return path.resolve(rootDir, "..", "src", "docs", "content");
}

/** First `# Heading` of a Markdown file, reduced to the text a reader sees. */
function firstHeading(markdown: string): string | null {
  const match = /^#\s+(.+?)\s*$/m.exec(markdown);
  if (!match) return null;
  return match[1]
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readDoc(rootDir: string, locale: "en" | "de", page: DocPage): string | null {
  const base = contentDir(rootDir);
  const file =
    locale === "de"
      ? path.join(base, "de", page.categoryId, `${page.slug}.md`)
      : path.join(base, page.categoryId, `${page.slug}.md`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : null;
}

async function useLocale(page: Page, locale: "en" | "de"): Promise<void> {
  await prepareAuthenticatedPage(page);
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: LOCALE_STORAGE_KEY, value: locale },
  );
}

async function renderedHeading(page: Page, docPage: DocPage): Promise<string> {
  await page.goto(`/docs/${docPage.categoryId}/${docPage.slug}`);
  const heading = page.locator(".doc-markdown h1").first();
  await expect(heading).toBeVisible();
  return ((await heading.textContent()) ?? "").replace(/\s+/g, " ").trim();
}

test.describe("German documentation: coverage", () => {
  test("every manifest page has a German translation", async ({}, testInfo) => {
    const rootDir = testInfo.config.rootDir;
    expect(fs.existsSync(path.join(contentDir(rootDir), "de")), "content/de directory").toBe(true);
    const missing = DOC_PAGES.filter((p) => readDoc(rootDir, "de", p) === null).map(
      (p) => `${p.categoryId}/${p.slug}`,
    );

    if (process.env.I18N_DOCS_ALLOW_MISSING === "1" && missing.length > 0) {
      testInfo.annotations.push({
        type: "warning",
        description: `${missing.length} page(s) fall back to English: ${missing.join(", ")}`,
      });
      return;
    }
    expect(missing, "pages without content/de/<category>/<slug>.md").toEqual([]);
  });

  test("every German page has an English source and a heading", async ({}, testInfo) => {
    const rootDir = testInfo.config.rootDir;
    const problems: string[] = [];
    for (const docPage of DOC_PAGES) {
      const de = readDoc(rootDir, "de", docPage);
      if (de === null) continue;
      const id = `${docPage.categoryId}/${docPage.slug}`;
      if (readDoc(rootDir, "en", docPage) === null) problems.push(`${id}: no English source`);
      if (firstHeading(de) === null) problems.push(`${id}: German page has no H1`);
    }
    expect(problems).toEqual([]);
  });

  test("the German manifest localizes every title and category", async () => {
    const english = Object.values(DOCS_MANIFEST).flatMap((category) =>
      category.items.map((item) => item.title),
    );
    const german = Object.values(getDocsManifest("de")).flatMap((category) =>
      category.items.map((item) => item.title),
    );
    expect(german).toHaveLength(english.length);
    // Most titles differ; a manifest that returns the English one verbatim is not localized.
    const unchanged = german.filter((title, index) => title === english[index]).length;
    expect(unchanged).toBeLessThan(english.length / 2);
  });
});

test.describe("German documentation: rendering", () => {
  test.beforeEach(async ({ page }) => {
    await useLocale(page, "de");
  });

  for (const docPage of DOC_PAGES) {
    test(`${docPage.categoryId}/${docPage.slug} renders its German source`, async ({ page }, testInfo) => {
      const de = readDoc(testInfo.config.rootDir, "de", docPage);
      test.skip(de === null, "no German translation (covered by the coverage test)");

      const expected = firstHeading(de as string);
      const actual = await renderedHeading(page, docPage);
      expect(actual).toBe(expected);
    });
  }

  test("the sidebar shows the German category labels", async ({ page }) => {
    await page.goto("/docs/getting-started/introduction");

    for (const category of Object.values(getDocsManifest("de"))) {
      await expect(
        page.getByRole("button", { name: category.label, exact: true }).first(),
        `category "${category.label}"`,
      ).toBeVisible();
    }
  });
});

test.describe("English documentation", () => {
  test.beforeEach(async ({ page }) => {
    await useLocale(page, "en");
  });

  test("English users keep the English sources", async ({ page }, testInfo) => {
    const docPage: DocPage = { categoryId: "getting-started", slug: "introduction" };
    const en = readDoc(testInfo.config.rootDir, "en", docPage);
    expect(en).not.toBeNull();

    const actual = await renderedHeading(page, docPage);
    expect(actual).toBe(firstHeading(en as string));

    const de = readDoc(testInfo.config.rootDir, "de", docPage);
    if (de !== null && firstHeading(de) !== firstHeading(en as string)) {
      expect(actual).not.toBe(firstHeading(de));
    }
  });
});
