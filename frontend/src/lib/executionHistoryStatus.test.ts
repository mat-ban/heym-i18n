import { describe, expect, it } from "vitest";

import { i18n } from "@/i18n";

import {
  getHistoryStatusBadgeClass,
  HISTORY_STATUS_OPTIONS,
  localizeHistoryStatusOptions,
} from "./executionHistoryStatus";

describe("HISTORY_STATUS_OPTIONS", () => {
  it("starts with the unfiltered entry", () => {
    expect(HISTORY_STATUS_OPTIONS[0]).toEqual({ value: undefined, label: "All Statuses" });
  });

  it("offers success, error, cached and cancelled", () => {
    const values = HISTORY_STATUS_OPTIONS.map((option) => option.value);
    expect(values).toEqual([undefined, "success", "error", "cached", "cancelled"]);
  });

  it("has no duplicate values", () => {
    const values = HISTORY_STATUS_OPTIONS.map((option) => option.value);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe("getHistoryStatusBadgeClass", () => {
  it("returns a badge for statuses the icon does not explain", () => {
    expect(getHistoryStatusBadgeClass("cached")).toContain("sky");
    expect(getHistoryStatusBadgeClass("failed")).toContain("red");
    expect(getHistoryStatusBadgeClass("skipped")).toContain("gray");
  });

  it("badges runs that never executed because of the concurrency limit", () => {
    expect(getHistoryStatusBadgeClass("expired")).toContain("amber");
    expect(getHistoryStatusBadgeClass("queue_full")).toContain("orange");
  });

  it("returns null for statuses without a badge", () => {
    expect(getHistoryStatusBadgeClass("success")).toBeNull();
    expect(getHistoryStatusBadgeClass("unknown")).toBeNull();
  });
});

describe("localizeHistoryStatusOptions", () => {
  const { t } = i18n.global;

  it("keeps the option values and labels every entry from the catalog", () => {
    const localized = localizeHistoryStatusOptions((key) => t(key));
    expect(localized.map((option) => option.value)).toEqual(
      HISTORY_STATUS_OPTIONS.map((option) => option.value),
    );
    expect(localized.map((option) => option.label)).toEqual([
      "All Statuses",
      "Success",
      "Error",
      "Cached",
      "Cancelled",
    ]);
  });

  it("uses the translated labels when the catalog says so", () => {
    const labels = localizeHistoryStatusOptions((key) => `[${key}]`).map((option) => option.label);
    expect(labels).toEqual([
      "[history.allStatuses]",
      "[history.statusOptions.success]",
      "[history.statusOptions.error]",
      "[history.statusOptions.cached]",
      "[history.statusOptions.cancelled]",
    ]);
  });
});
