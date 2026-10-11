import { describe, it, expect } from "vitest";
import { cldrPluralRule } from "./plural";
import { resolveLocaleFromPreferences } from "./locales";
import { formatDate, formatNumber, getIntlLocale } from "./format";
import { pseudolocalizeString, pseudolocalizeCatalog } from "./pseudo";
import { NODE_DEFINITIONS } from "@/types/node";
import { CREDENTIAL_TYPE_DESCRIPTIONS } from "@/types/credential";
import enCatalog from "@/locales/en.json" with { type: "json" };

describe("U1: cldrPluralRule", () => {
  it("computes Polish plurals correctly across cardinal forms", () => {
    // Polish categories: ['one', 'few', 'many', 'other'] (length 4)
    // 1 -> one (0)
    expect(cldrPluralRule(1, 4, "pl")).toBe(0);
    // 2, 3, 4, 22 -> few (1)
    expect(cldrPluralRule(2, 4, "pl")).toBe(1);
    expect(cldrPluralRule(3, 4, "pl")).toBe(1);
    expect(cldrPluralRule(4, 4, "pl")).toBe(1);
    expect(cldrPluralRule(22, 4, "pl")).toBe(1);
    // 5, 6, 12, 21, 25 -> many (2)
    expect(cldrPluralRule(5, 4, "pl")).toBe(2);
    expect(cldrPluralRule(12, 4, "pl")).toBe(2);
    expect(cldrPluralRule(21, 4, "pl")).toBe(2);
    expect(cldrPluralRule(25, 4, "pl")).toBe(2);
    // 1.5 -> other (3)
    expect(cldrPluralRule(1.5, 4, "pl")).toBe(3);
  });

  it("handles Slovenian dual/plurals", () => {
    // sl categories: ['one', 'two', 'few', 'other'] (length 4)
    expect(cldrPluralRule(1, 4, "sl")).toBe(0); // one
    expect(cldrPluralRule(2, 4, "sl")).toBe(1); // two
    expect(cldrPluralRule(3, 4, "sl")).toBe(2); // few
    expect(cldrPluralRule(5, 4, "sl")).toBe(3); // other
  });

  it("handles Latvian zero/one/other", () => {
    // lv categories: ['zero', 'one', 'other'] (length 3)
    expect(cldrPluralRule(0, 3, "lv")).toBe(0); // zero
    expect(cldrPluralRule(1, 3, "lv")).toBe(1); // one
    expect(cldrPluralRule(2, 3, "lv")).toBe(2); // other
  });

  it("handles standard 2-form languages (en, de)", () => {
    expect(cldrPluralRule(1, 2, "en")).toBe(0);
    expect(cldrPluralRule(2, 2, "en")).toBe(1);
    expect(cldrPluralRule(0, 2, "en")).toBe(1);

    expect(cldrPluralRule(1, 2, "de")).toBe(0);
    expect(cldrPluralRule(5, 2, "de")).toBe(1);
  });
});

describe("U3: Locale Preference Resolution Matrix", () => {
  it("resolves according to the test matrix from ROADMAP.md", () => {
    // Matrix test cases:
    // ["pl-PL"] -> pl
    expect(resolveLocaleFromPreferences(["pl-PL"])).toBe("pl");
    // ["zh-TW", "en"] -> zh-Hant (Traditional Chinese has dedicated Phase 3 locale)
    expect(resolveLocaleFromPreferences(["zh-TW", "en"])).toBe("zh-Hant");
    // ["ca-ES"] -> ca
    expect(resolveLocaleFromPreferences(["ca-ES"])).toBe("ca");
    // ["pt-BR"] -> pt-BR (Brazilian Portuguese has dedicated Phase 3 locale)
    expect(resolveLocaleFromPreferences(["pt-BR"])).toBe("pt-BR");
    // ["ga-IE"] -> en (Irish dropped, falls back to en)
    expect(resolveLocaleFromPreferences(["ga-IE"])).toBe("en");
    // ["mt-MT"] -> en (Maltese dropped, falls back to en)
    expect(resolveLocaleFromPreferences(["mt-MT"])).toBe("en");
    // ["de-AT"] -> de (Regional German falls back to de)
    expect(resolveLocaleFromPreferences(["de-AT"])).toBe("de");
    // unknown tag -> en
    expect(resolveLocaleFromPreferences(["xx-YY"])).toBe("en");
  });
});

describe("U5: Intl Formatting", () => {
  it("formats dates and numbers according to locale intl tags", () => {
    const testDate = new Date("2026-10-11T12:00:00Z");
    const deFormatted = formatDate(testDate, { month: "long" }, "de");
    expect(deFormatted).toContain("Oktober");

    const enFormatted = formatDate(testDate, { month: "long" }, "en");
    expect(enFormatted).toContain("October");

    expect(getIntlLocale("de")).toBe("de-DE");
    expect(getIntlLocale("en")).toBe("en-US");
    expect(getIntlLocale("pl")).toBe("pl-PL");

    // Numbers
    const num = 1234.5;
    const deNum = formatNumber(num, undefined, "de");
    expect(deNum).toContain(","); // German uses comma decimal separator
  });
});

describe("U6: Registry Parity", () => {
  it("ensures en.json node labels match NODE_DEFINITIONS", () => {
    const nodes = (enCatalog as Record<string, unknown>).nodes as Record<string, { label?: string; description?: string }>;
    for (const [nodeType, def] of Object.entries(NODE_DEFINITIONS)) {
      if (nodes[nodeType]) {
        expect(nodes[nodeType].label).toBe(def.label);
      }
    }
  });

  it("ensures en.json credential descriptions match CREDENTIAL_TYPE_DESCRIPTIONS", () => {
    const credTypes = (((enCatalog as Record<string, unknown>).credentials as Record<string, unknown>).types || {}) as Record<string, { description?: string }>;
    for (const [credType, desc] of Object.entries(CREDENTIAL_TYPE_DESCRIPTIONS)) {
      if (credTypes[credType]) {
        expect(credTypes[credType].description).toBe(desc);
      }
    }
  });
});

describe("U7: Pseudo-Locale Generator", () => {
  it("expands text and preserves placeholders and HTML tags", () => {
    const input = "Delete {count} workflows <span class='tag'>now</span>";
    const pseudo = pseudolocalizeString(input);
    expect(pseudo.startsWith("[")).toBe(true);
    expect(pseudo.endsWith("]")).toBe(true);
    expect(pseudo).toContain("{count}");
    expect(pseudo).toContain("<span class='tag'>");
    expect(pseudo).toContain("</span>");
    expect(pseudo.length).toBeGreaterThan(input.length);
  });

  it("recursively transforms catalog objects", () => {
    const sample = {
      common: {
        save: "Save",
        confirm: "Are you sure?",
      },
      count: 42,
    };
    const res = pseudolocalizeCatalog(sample) as { common: { save: string; confirm: string }; count: number };
    expect(res.common.save.startsWith("[")).toBe(true);
    expect(res.common.confirm.startsWith("[")).toBe(true);
    expect(res.count).toBe(42);
  });
});

describe("U4: Lazy Loader & Locale Switching", () => {
  it("loads existing locale and sets document.documentElement.lang", async () => {
    const { setLocale, getCurrentLocale, loadLocaleMessages } = await import("./index");
    const ok = await loadLocaleMessages("de");
    expect(ok).toBe(true);

    await setLocale("de");
    expect(getCurrentLocale()).toBe("de");
    if (typeof document !== "undefined") {
      expect(document.documentElement.lang).toBe("de");
    }

    // Switch back to en
    await setLocale("en");
    expect(getCurrentLocale()).toBe("en");
  });

  it("gracefully falls back when loading unknown locale", async () => {
    const { setLocale, getCurrentLocale, loadLocaleMessages } = await import("./index");
    const ok = await loadLocaleMessages("unknown_locale");
    expect(ok).toBe(false);

    await setLocale("unknown_locale");
    expect(getCurrentLocale()).toBe("en");
  });
});
