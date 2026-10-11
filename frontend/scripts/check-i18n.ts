import { runI18nCheck } from "./i18n/check.ts";

const ok = runI18nCheck();
process.exit(ok ? 0 : 1);
