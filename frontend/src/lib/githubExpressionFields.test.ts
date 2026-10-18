import { describe, expect, it } from "vitest";

import { getGitHubExpressionFields } from "@/lib/githubExpressionFields";

function keys(operation: string): string[] {
  return getGitHubExpressionFields(operation).map((field) => field.key);
}

const PAGED_OPERATIONS = [
  "listIssues",
  "getRepositoryIssues",
  "getUserIssues",
  "listPullRequests",
  "getRepositoryPullRequests",
  "listReviews",
  "listReleases",
  "listWorkflows",
  "listOrganizationRepositories",
  "listUserRepositories",
  "getUserRepositories",
];

describe("getGitHubExpressionFields cursor", () => {
  it.each(PAGED_OPERATIONS)("offers the cursor last for %s", (operation) => {
    const fieldKeys = keys(operation);
    expect(fieldKeys[fieldKeys.length - 1]).toBe("githubCursor");
    expect(fieldKeys.filter((key) => key === "githubCursor")).toHaveLength(1);
  });

  it("does not offer the cursor for operations that are not paged", () => {
    for (const operation of ["getRepository", "getIssue", "createIssue", "listFiles", "inviteUser"]) {
      expect(keys(operation)).not.toContain("githubCursor");
    }
  });

  it("keeps the existing fields and their order ahead of the cursor", () => {
    expect(keys("listReleases")).toEqual(["githubOwner", "githubRepo", "githubCursor"]);
    expect(keys("listReviews")).toEqual([
      "githubOwner",
      "githubRepo",
      "githubPullRequestNumber",
      "githubCursor",
    ]);
    expect(keys("getUserIssues")).toEqual([
      "githubMentioned",
      "githubLabelsFilter",
      "githubSince",
      "githubCursor",
    ]);
    expect(keys("listUserRepositories")).toEqual(["githubOwner", "githubCursor"]);
  });
});
