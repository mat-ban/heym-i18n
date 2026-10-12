const CLDR_ORDER = ["zero", "one", "two", "few", "many", "other"] as const;

/**
 * Universal CLDR-based pluralization rule for vue-i18n using Intl.PluralRules.
 *
 * Maps a numeric choice count to the corresponding translation form index:
 * - If choicesLength == 1: returns 0.
 * - If choicesLength == supportedCategories.length: returns index matching the CLDR category.
 * - If choicesLength == 2: returns 0 for 'one', 1 for anything else.
 * - Otherwise: maps to CLDR order or clamps within [0, choicesLength - 1].
 */
export function cldrPluralRule(
  choice: number,
  choicesLength: number,
  locale = "en"
): number {
  if (choicesLength <= 1) return 0;

  let pr: Intl.PluralRules;
  try {
    pr = new Intl.PluralRules(locale);
  } catch {
    pr = new Intl.PluralRules("en");
  }

  const category = pr.select(choice);
  const rawSupported = pr.resolvedOptions().pluralCategories;
  const supported = CLDR_ORDER.filter((c) => rawSupported.includes(c));

  // Exact category count match (canonically ordered by CLDR_ORDER)
  if (choicesLength === supported.length) {
    const idx = supported.indexOf(category);
    return idx >= 0 ? idx : choicesLength - 1;
  }

  // Common 2-form fallback (e.g. 1 file | 2 files)
  if (choicesLength === 2) {
    return category === "one" ? 0 : 1;
  }

  // Match against standard CLDR order subset
  const idx = supported.indexOf(category);
  if (idx >= 0 && idx < choicesLength) {
    return idx;
  }

  return Math.min(choicesLength - 1, Math.max(0, idx >= 0 ? idx : 0));
}

/**
 * Creates vue-i18n plural rule definitions for a list of locale codes.
 */
export function createPluralRules(
  locales: string[]
): Record<string, (choice: number, choicesLength: number) => number> {
  const rules: Record<string, (choice: number, choicesLength: number) => number> = {};
  for (const loc of locales) {
    rules[loc] = (choice: number, choicesLength: number) =>
      cldrPluralRule(choice, choicesLength, loc);
  }
  return rules;
}
