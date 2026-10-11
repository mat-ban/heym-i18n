export interface HistoryStatusOption {
  value: string | undefined;
  label: string;
}

/**
 * Statuses offered by the history filter. `undefined` is the "no filter" entry, so
 * the list always reads as All Statuses first. "error" also matches runs a restart
 * recovery marked "failed" (the backend groups them); pending and skipped are rare
 * and left to All Statuses.
 */
export const HISTORY_STATUS_OPTIONS: readonly HistoryStatusOption[] = [
  { value: undefined, label: "All Statuses" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
  { value: "cached", label: "Cached" },
  { value: "cancelled", label: "Cancelled" },
];

/**
 * `HISTORY_STATUS_OPTIONS` with labels in the active UI language. `translate` is the
 * `t` function of the calling component, so the labels follow language switches.
 */
export function localizeHistoryStatusOptions(
  translate: (key: string) => string,
): HistoryStatusOption[] {
  return HISTORY_STATUS_OPTIONS.map((option) => ({
    value: option.value,
    label:
      option.value === undefined
        ? translate("history.allStatuses")
        : translate(`history.statusOptions.${option.value}`),
  }));
}

/** Statuses that get a text badge in the run list; success is already the icon. */
const BADGE_CLASSES: Readonly<Record<string, string>> = {
  skipped: "bg-gray-500/20 text-gray-400",
  failed: "bg-red-500/20 text-red-400",
  cached: "bg-sky-500/20 text-sky-400",
  cancelled: "bg-gray-500/20 text-gray-400",
};

/** Returns the badge classes for a status, or null when it needs no badge. */
export function getHistoryStatusBadgeClass(status: string): string | null {
  return BADGE_CLASSES[status] ?? null;
}
