import { computed } from "vue";
import { LOCALE_REGISTRY } from "./locales";
import { i18n } from "./index";

/**
 * Returns the BCP 47 language tag (e.g. "de-DE", "en-US", "pl-PL")
 * for the current or specified locale.
 */
export function getIntlLocale(localeCode?: string): string {
  const code =
    localeCode ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((i18n?.global?.locale as any)?.value ?? (i18n?.global?.locale as any) ?? "en");
  return LOCALE_REGISTRY[code]?.intl || "en-US";
}

function parseDate(value: Date | string | number): Date {
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export function formatDate(
  value: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  localeCode?: string
): string {
  const tag = getIntlLocale(localeCode);
  return new Intl.DateTimeFormat(tag, options).format(parseDate(value));
}

export function formatTime(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" },
  localeCode?: string
): string {
  const tag = getIntlLocale(localeCode);
  return new Intl.DateTimeFormat(tag, options).format(parseDate(value));
}

export function formatDateTime(
  value: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  localeCode?: string
): string {
  const tag = getIntlLocale(localeCode);
  return new Intl.DateTimeFormat(tag, options ?? {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parseDate(value));
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  localeCode?: string
): string {
  const tag = getIntlLocale(localeCode);
  return new Intl.NumberFormat(tag, options).format(value);
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
  localeCode?: string
): string {
  const tag = getIntlLocale(localeCode);
  return new Intl.RelativeTimeFormat(tag, options).format(value, unit);
}

/**
 * Composable returning reactive formatting functions tied to current active locale.
 */
export function useLocaleFormat() {
  const currentIntl = computed(() => getIntlLocale());

  return {
    intlLocale: currentIntl,
    d: (val: Date | string | number, opts?: Intl.DateTimeFormatOptions) =>
      formatDate(val, opts),
    t: (val: Date | string | number, opts?: Intl.DateTimeFormatOptions) =>
      formatTime(val, opts),
    dt: (val: Date | string | number, opts?: Intl.DateTimeFormatOptions) =>
      formatDateTime(val, opts),
    n: (val: number, opts?: Intl.NumberFormatOptions) => formatNumber(val, opts),
  };
}
