export type LocaleTier = "A" | "B" | "C" | "source";
export type DocsTier = "A" | "B" | "C";

export interface LocaleDefinition {
  code: string;
  label: string; // Endonym
  name?: string;
  nativeName?: string;
  intl: string; // BCP 47 Intl tag (e.g. "de-DE", "en-US", "pl-PL")
  bcp47?: string;
  tier: LocaleTier;
  docsTier: DocsTier;
  dir?: "ltr" | "rtl";
  script: "Latin" | "Cyrillic" | "Greek" | "CJK" | "Hangul";
  aliases: string[];
  active?: boolean;
}

export const ALL_LOCALES: LocaleDefinition[] = [
  {
    code: "en",
    label: "English",
    name: "English",
    nativeName: "English",
    intl: "en-US",
    bcp47: "en-US",
    tier: "source",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["en", "en-us", "en-gb", "en-ca", "en-au"],
    active: true,
  },
  {
    code: "de",
    label: "Deutsch",
    name: "German",
    nativeName: "Deutsch",
    intl: "de-DE",
    bcp47: "de-DE",
    tier: "A",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["de", "de-de", "de-at", "de-ch", "de-lu", "de-li"],
    active: true,
  },
  {
    code: "pl",
    label: "Polski",
    name: "Polish",
    nativeName: "Polski",
    intl: "pl-PL",
    bcp47: "pl-PL",
    tier: "A",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["pl", "pl-pl"],
    active: true,
  },
  {
    code: "fr",
    label: "Français",
    name: "French",
    nativeName: "Français",
    intl: "fr-FR",
    bcp47: "fr-FR",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["fr", "fr-fr", "fr-be", "fr-ca", "fr-ch", "fr-lu"],
    active: true,
  },
  {
    code: "es",
    label: "Español",
    name: "Spanish",
    nativeName: "Español",
    intl: "es-ES",
    bcp47: "es-ES",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["es", "es-es", "es-419", "es-mx", "es-ar", "es-co", "es-cl"],
    active: true,
  },
  {
    code: "it",
    label: "Italiano",
    name: "Italian",
    nativeName: "Italiano",
    intl: "it-IT",
    bcp47: "it-IT",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["it", "it-it", "it-ch"],
    active: true,
  },
  {
    code: "nl",
    label: "Nederlands",
    name: "Dutch",
    nativeName: "Nederlands",
    intl: "nl-NL",
    bcp47: "nl-NL",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["nl", "nl-nl", "nl-be"],
    active: true,
  },
  {
    code: "pt",
    label: "Português",
    name: "Portuguese",
    nativeName: "Português",
    intl: "pt-PT",
    bcp47: "pt-PT",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["pt", "pt-pt"],
    active: true,
  },
  {
    code: "cs",
    label: "Čeština",
    name: "Czech",
    nativeName: "Čeština",
    intl: "cs-CZ",
    bcp47: "cs-CZ",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["cs", "cs-cz"],
    active: true,
  },
  {
    code: "sk",
    label: "Slovenčina",
    name: "Slovak",
    nativeName: "Slovenčina",
    intl: "sk-SK",
    bcp47: "sk-SK",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["sk", "sk-sk"],
    active: true,
  },
  {
    code: "hu",
    label: "Magyar",
    name: "Hungarian",
    nativeName: "Magyar",
    intl: "hu-HU",
    bcp47: "hu-HU",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["hu", "hu-hu"],
    active: true,
  },
  {
    code: "ro",
    label: "Română",
    name: "Romanian",
    nativeName: "Română",
    intl: "ro-RO",
    bcp47: "ro-RO",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["ro", "ro-ro", "ro-md"],
    active: true,
  },
  {
    code: "sv",
    label: "Svenska",
    name: "Swedish",
    nativeName: "Svenska",
    intl: "sv-SE",
    bcp47: "sv-SE",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["sv", "sv-se", "sv-fi"],
    active: true,
  },
  {
    code: "da",
    label: "Dansk",
    name: "Danish",
    nativeName: "Dansk",
    intl: "da-DK",
    bcp47: "da-DK",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["da", "da-dk"],
    active: true,
  },
  {
    code: "fi",
    label: "Suomi",
    name: "Finnish",
    nativeName: "Suomi",
    intl: "fi-FI",
    bcp47: "fi-FI",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["fi", "fi-fi"],
    active: true,
  },
  {
    code: "bg",
    label: "Български",
    name: "Bulgarian",
    nativeName: "Български",
    intl: "bg-BG",
    bcp47: "bg-BG",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Cyrillic",
    aliases: ["bg", "bg-bg"],
    active: true,
  },
  {
    code: "el",
    label: "Ελληνικά",
    name: "Greek",
    nativeName: "Ελληνικά",
    intl: "el-GR",
    bcp47: "el-GR",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Greek",
    aliases: ["el", "el-gr", "el-cy"],
    active: true,
  },
  {
    code: "hr",
    label: "Hrvatski",
    name: "Croatian",
    nativeName: "Hrvatski",
    intl: "hr-HR",
    bcp47: "hr-HR",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["hr", "hr-hr", "hr-ba"],
    active: true,
  },
  {
    code: "sl",
    label: "Slovenščina",
    name: "Slovenian",
    nativeName: "Slovenščina",
    intl: "sl-SI",
    bcp47: "sl-SI",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["sl", "sl-si"],
    active: true,
  },
  {
    code: "et",
    label: "Eesti",
    name: "Estonian",
    nativeName: "Eesti",
    intl: "et-EE",
    bcp47: "et-EE",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["et", "et-ee"],
    active: true,
  },
  {
    code: "lv",
    label: "Latviešu",
    name: "Latvian",
    nativeName: "Latviešu",
    intl: "lv-LV",
    bcp47: "lv-LV",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["lv", "lv-lv"],
    active: true,
  },
  {
    code: "lt",
    label: "Lietuvių",
    name: "Lithuanian",
    nativeName: "Lietuvių",
    intl: "lt-LT",
    bcp47: "lt-LT",
    tier: "C",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["lt", "lt-lt"],
    active: true,
  },
  {
    code: "ca",
    label: "Català",
    name: "Catalan",
    nativeName: "Català",
    intl: "ca-ES",
    bcp47: "ca-ES",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["ca", "ca-es", "ca-ad", "ca-fr", "ca-it"],
    active: true,
  },
  {
    code: "zh-Hans",
    label: "简体中文",
    name: "Simplified Chinese",
    nativeName: "简体中文",
    intl: "zh-CN",
    bcp47: "zh-CN",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "CJK",
    aliases: ["zh", "zh-cn", "zh-sg", "zh-hans"],
    active: true,
  },
  {
    code: "zh-Hant",
    label: "繁體中文",
    name: "Traditional Chinese",
    nativeName: "繁體中文",
    intl: "zh-TW",
    bcp47: "zh-TW",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "CJK",
    aliases: ["zh-tw", "zh-hk", "zh-mo", "zh-hant"],
    active: true,
  },
  {
    code: "ja",
    label: "日本語",
    name: "Japanese",
    nativeName: "日本語",
    intl: "ja-JP",
    bcp47: "ja-JP",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "CJK",
    aliases: ["ja", "ja-jp"],
    active: true,
  },
  {
    code: "ko",
    label: "한국어",
    name: "Korean",
    nativeName: "한국어",
    intl: "ko-KR",
    bcp47: "ko-KR",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Hangul",
    aliases: ["ko", "ko-kr"],
    active: true,
  },
  {
    code: "pt-BR",
    label: "Português do Brasil",
    name: "Brazilian Portuguese",
    nativeName: "Português do Brasil",
    intl: "pt-BR",
    bcp47: "pt-BR",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["pt-br"],
    active: true,
  },
  {
    code: "id",
    label: "Bahasa Indonesia",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    intl: "id-ID",
    bcp47: "id-ID",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["id", "id-id"],
    active: true,
  },
  {
    code: "vi",
    label: "Tiếng Việt",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    intl: "vi-VN",
    bcp47: "vi-VN",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["vi", "vi-vn"],
    active: true,
  },
  {
    code: "tr",
    label: "Türkçe",
    name: "Turkish",
    nativeName: "Türkçe",
    intl: "tr-TR",
    bcp47: "tr-TR",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Latin",
    aliases: ["tr", "tr-tr"],
    active: true,
  },
  {
    code: "uk",
    label: "Українська",
    name: "Ukrainian",
    nativeName: "Українська",
    intl: "uk-UA",
    bcp47: "uk-UA",
    tier: "B",
    docsTier: "A",
    dir: "ltr",
    script: "Cyrillic",
    aliases: ["uk", "uk-ua"],
    active: true,
  },
];

export const LOCALE_REGISTRY: Record<string, LocaleDefinition> = Object.fromEntries(
  ALL_LOCALES.map((loc) => [loc.code, loc])
);

// Locales that are enabled and ready in the user interface
export function getActiveLocales(): LocaleDefinition[] {
  return ALL_LOCALES.filter((loc) => loc.active);
}

export function isSupportedLocale(code: string, activeOnly = true): boolean {
  const loc = LOCALE_REGISTRY[code];
  if (!loc) return false;
  return activeOnly ? !!loc.active : true;
}

export function getLocaleDefinition(code: string): LocaleDefinition {
  return LOCALE_REGISTRY[code] ?? LOCALE_REGISTRY.en;
}

// Banned / intentionally excluded locales that fall back directly to English
const EXCLUDED_LANGUAGE_PREFIXES = ["ga", "mt"];

/**
 * Resolves preferred locale from a list of language tags (e.g. navigator.languages).
 * Follows the priority:
 * 1. Exact match with registered locale code
 * 2. Alias match (e.g. "zh-TW" -> "zh-Hans", "pt-BR" -> "pt")
 * 3. Base language match (e.g. "de-AT" -> "de")
 * Excluded languages ("ga", "mt") always fall back to "en".
 */
export function resolveLocaleFromPreferences(
  languages: readonly string[],
  availableCodes?: string[]
): string {
  const allowed = availableCodes ? new Set(availableCodes) : null;

  for (const raw of languages) {
    if (!raw) continue;
    const tag = raw.trim().toLowerCase();

    // Check excluded languages first
    const basePrefix = tag.split(/[-_]/)[0];
    if (EXCLUDED_LANGUAGE_PREFIXES.includes(basePrefix)) {
      continue; // Skip directly, allowing fallback or later choices
    }

    // 1. Direct code match
    for (const loc of ALL_LOCALES) {
      if (loc.code.toLowerCase() === tag) {
        if (!allowed || allowed.has(loc.code)) {
          return loc.code;
        }
      }
    }

    // 2. Alias match
    for (const loc of ALL_LOCALES) {
      if (loc.aliases.some((alias) => alias.toLowerCase() === tag)) {
        if (!allowed || allowed.has(loc.code)) {
          return loc.code;
        }
      }
    }

    // 3. Base prefix match (e.g. "de" from "de-CH")
    for (const loc of ALL_LOCALES) {
      if (loc.code.toLowerCase() === basePrefix) {
        if (!allowed || allowed.has(loc.code)) {
          return loc.code;
        }
      }
    }
  }

  return "en";
}
