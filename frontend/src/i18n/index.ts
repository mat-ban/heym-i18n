import { createI18n } from "vue-i18n";
import en from "../locales/en.json" with { type: "json" };
import {
  ALL_LOCALES,
  getActiveLocales,
  getLocaleDefinition,
  isSupportedLocale,
  resolveLocaleFromPreferences,
  type LocaleDefinition,
} from "./locales";
import { createPluralRules } from "./plural";

export type SupportedLocale = string;

export interface SupportedLocaleOption {
  value: SupportedLocale;
  label: string;
}

export const SUPPORTED_LOCALES: SupportedLocaleOption[] = getActiveLocales().map(
  (loc) => ({
    value: loc.code,
    label: loc.label,
  })
);

export { ALL_LOCALES, getActiveLocales, getLocaleDefinition, isSupportedLocale, type LocaleDefinition };

const STORAGE_KEY = "heym_locale";

// Lazy-loaded locale loaders via Vite import.meta.glob (guarded for Node/Playwright runtime)
const globFn = (import.meta as any).glob;
const localeModules: Record<string, () => Promise<Record<string, unknown>>> =
  typeof globFn === "function"
    ? import.meta.glob<Record<string, unknown>>("../locales/*.json")
    : {};
const loadedLocales = new Set<string>(["en"]);

export async function loadLocaleMessages(locale: string): Promise<boolean> {
  if (loadedLocales.has(locale)) {
    return true;
  }

  const pathKey = `../locales/${locale}.json`;
  const loader = localeModules[pathKey];

  if (!loader) {
    console.warn(`[i18n] Locale catalog not found: ${locale}`);
    return false;
  }

  try {
    const mod = await loader();
    const messages = (mod && typeof mod === "object" && "default" in mod)
      ? (mod as { default: Record<string, unknown> }).default
      : mod;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    i18n.global.setLocaleMessage(locale, messages as any);
    loadedLocales.add(locale);
    return true;
  } catch (err) {
    console.error(`[i18n] Failed to load locale "${locale}":`, err);
    return false;
  }
}

export function getInitialLocale(): SupportedLocale {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isSupportedLocale(saved, true)) {
      return saved;
    }

    const navLanguages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];

    const activeCodes = getActiveLocales().map((l) => l.code);
    const detected = resolveLocaleFromPreferences(navLanguages, activeCodes);
    if (isSupportedLocale(detected, true)) {
      return detected;
    }
  }
  return "en";
}

const initialLocale = getInitialLocale();

if (typeof window !== "undefined") {
  document.documentElement.lang = initialLocale;
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: "en",
  messages: {
    en,
  },
  pluralRules: createPluralRules(ALL_LOCALES.map((l) => l.code)),
  missing: (locale, key) => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      w.__i18nMissing = w.__i18nMissing || [];
      w.__i18nMissing.push({ locale, key });
    }
  },
});

export async function initI18n(): Promise<void> {
  const initial = getInitialLocale();
  if (initial !== "en") {
    await loadLocaleMessages(initial);
  }
  if (typeof window !== "undefined") {
    document.documentElement.lang = initial;
  }
}

export async function setLocale(locale: SupportedLocale): Promise<void> {
  if (locale !== "en") {
    const ok = await loadLocaleMessages(locale);
    if (!ok) {
      console.warn(`[i18n] Falling back to "en" because "${locale}" could not be loaded.`);
      locale = "en";
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (i18n.global.locale as any).value = locale;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }
}

export function getCurrentLocale(): SupportedLocale {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loc = (i18n.global.locale as any).value ?? (i18n.global.locale as any);
  return String(loc || "en");
}

export default i18n;
