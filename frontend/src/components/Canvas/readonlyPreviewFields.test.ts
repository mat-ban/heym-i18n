import { describe, expect, it } from "vitest";

import {
  getReadonlyPreviewFields,
  summarizeReadonlyAgentAttachments,
} from "@/components/Canvas/readonlyPreviewFields";

describe("getReadonlyPreviewFields agent attachments", () => {
  it("lists skill, tool, sub-agent, MCP, and sub-workflow names without their contents", () => {
    const fields = getReadonlyPreviewFields({
      label: "translateAgent",
      nodeType: "agent",
      model: "gpt-4o",
      skills: [{ id: "s1", name: "translate-to-german", content: "SECRET SKILL BODY" }],
      tools: [{ name: "count_characters", code: "return 1", description: "counts", parameters: "{}" }],
      subAgentLabels: ["researchAgent", "summarizerAgent"],
      mcpConnections: [{
        id: "m1",
        label: "filesystem",
        command: "npx",
        env: { API_KEY: "secret" },
      }],
      subWorkflowIds: ["wf-1"],
      subWorkflowNames: { "wf-1": "Logo stamp" },
    });

    const byKey = Object.fromEntries(fields.map((field) => [field.key, field]));
    expect(byKey.skills?.label).toBe("Skills");
    expect(byKey.skills?.value).toBe("translate-to-german");
    expect(byKey.tools?.label).toBe("Tools");
    expect(byKey.tools?.value).toBe("count_characters");
    expect(byKey.subAgentLabels?.label).toBe("Sub-Agents");
    expect(byKey.subAgentLabels?.value).toBe("researchAgent\nsummarizerAgent");
    expect(byKey.mcpConnections?.label).toBe("MCP Connections");
    expect(byKey.mcpConnections?.value).toBe("filesystem");
    expect(byKey.subWorkflowIds?.label).toBe("Sub-Workflows");
    expect(byKey.subWorkflowIds?.value).toBe("Logo stamp");

    const serialized = JSON.stringify(fields);
    expect(serialized).not.toContain("SECRET SKILL BODY");
    expect(serialized).not.toContain("return 1");
    expect(serialized).not.toContain("API_KEY");
    expect(serialized).not.toContain("secret");
  });

  it("omits empty agent attachment lists", () => {
    const fields = getReadonlyPreviewFields({
      model: "gpt-4o",
      skills: [],
      tools: [],
      subAgentLabels: [],
      mcpConnections: [],
    });
    const keys = fields.map((field) => field.key);
    expect(keys).not.toContain("skills");
    expect(keys).not.toContain("tools");
    expect(keys).not.toContain("subAgentLabels");
    expect(keys).not.toContain("mcpConnections");
  });
});

describe("summarizeReadonlyAgentAttachments", () => {
  it("joins attachment names for the canvas node", () => {
    expect(summarizeReadonlyAgentAttachments({
      skills: [{ name: "translate-to-german", content: "SECRET" }],
      subAgentLabels: ["researchAgent"],
      tools: [{ name: "count_characters", code: "return 1" }],
    })).toBe("translate-to-german · count_characters · researchAgent");
  });

  it("returns an empty string when the agent has no attachments", () => {
    expect(summarizeReadonlyAgentAttachments({ model: "gpt-4o", skills: [] })).toBe("");
  });
});
