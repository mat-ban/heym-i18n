import type { ShowcaseContext, ShowcaseDefinition } from "@/features/showcase/showcase.types";
import type { ShowcaseIntroContent } from "@/features/showcase/showcaseIntroRegistry";
import type { ReleaseEntry } from "@/features/release-tour/releaseTour.types";
import { getCurrentLocale } from "@/i18n";

import showcaseDe from "./showcase/de.json" with { type: "json" };
import introDe from "./intro/de.json" with { type: "json" };
import releaseDe from "./release/de.json" with { type: "json" };

const showcasePacks: Record<string, Record<string, ShowcaseDefinition>> = {
  de: showcaseDe as unknown as Record<string, ShowcaseDefinition>,
};

const introPacks: Record<string, Record<string, ShowcaseIntroContent>> = {
  de: introDe as unknown as Record<string, ShowcaseIntroContent>,
};

const releasePacks: Record<string, ReleaseEntry[]> = {
  de: releaseDe as unknown as ReleaseEntry[],
};

// Generic pack registration for future languages (e.g. Polish in Phase 1)
export function registerContentPacks(
  locale: string,
  packs: {
    showcase?: Record<string, ShowcaseDefinition>;
    intro?: Record<string, ShowcaseIntroContent>;
    release?: ReleaseEntry[];
  }
): void {
  if (packs.showcase) showcasePacks[locale] = packs.showcase;
  if (packs.intro) introPacks[locale] = packs.intro;
  if (packs.release) releasePacks[locale] = packs.release;
}

export function getLocalizedShowcase(
  context: ShowcaseContext,
  locale?: string
): ShowcaseDefinition | undefined {
  const loc = locale || getCurrentLocale();
  if (loc === "en") return undefined;
  return showcasePacks[loc]?.[context];
}

export function getLocalizedIntro(
  context: ShowcaseContext,
  locale?: string
): ShowcaseIntroContent | undefined {
  const loc = locale || getCurrentLocale();
  if (loc === "en") return undefined;
  return introPacks[loc]?.[context];
}

export function getLocalizedRelease(locale?: string): ReleaseEntry[] | undefined {
  const loc = locale || getCurrentLocale();
  if (loc === "en") return undefined;
  return releasePacks[loc];
}
