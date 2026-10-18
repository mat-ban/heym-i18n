import { describe, expect, it } from "vitest";

import { buildTraceSpans } from "@/lib/traceSpans";
import { buildTraceSteps } from "@/lib/traceSteps";
import { estimateToolTokens } from "@/lib/traceToolTokens";
import type { LLMTraceDetail } from "@/types/trace";

function makeTrace(
  response: Record<string, unknown>,
  request: Record<string, unknown> = {},
): LLMTraceDetail {
  return {
    id: "trace-1",
    created_at: "2026-10-16T17:17:56Z",
    source: "dashboard_chat",
    request_type: "chat.completions",
    provider: "Custom",
    model: "glm-5.3-flash",
    credential_id: null,
    credential_name: null,
    workflow_id: null,
    workflow_name: null,
    node_id: null,
    node_label: "Dashboard Chat",
    status: "success",
    elapsed_ms: 15000,
    prompt_tokens: 43000,
    completion_tokens: 900,
    total_tokens: 43900,
    cost_usd: null,
    is_priced: false,
    request,
    response,
    error: null,
  };
}

const turns = [
  { turn: 1, startMs: 100, durationMs: 8000, promptTokens: 20000, completionTokens: 100 },
  { turn: 2, startMs: 8200, durationMs: 6000, promptTokens: 23000, completionTokens: 800 },
];

function tool(id: string, startMs: number, result: unknown): Record<string, unknown> {
  return {
    tool_call_id: id,
    name: "get_recent_executions",
    arguments: { limit: 30 },
    result,
    start_ms: startMs,
    elapsed_ms: 14,
  };
}

describe("estimateToolTokens", () => {
  it("credits a lone tool with how much the next prompt grew beyond the reply", () => {
    const estimates = estimateToolTokens(
      makeTrace({ turn_timings: turns, tool_calls: [tool("call-1", 8100, "x".repeat(400))] }),
    );

    // 23000 - 20000 - 100 completion = 2900 tokens of tool output.
    expect(estimates.get("call-1")).toEqual({ tokens: 2900, readByTurn: 2, sharedBy: 1 });
  });

  it("splits the growth between tools of one turn by how much each returned", () => {
    const estimates = estimateToolTokens(
      makeTrace({
        turn_timings: turns,
        tool_calls: [
          tool("call-1", 8100, "x".repeat(900)),
          tool("call-2", 8110, "y".repeat(2000)),
        ],
      }),
    );

    const first = estimates.get("call-1");
    const second = estimates.get("call-2");
    expect(first?.sharedBy).toBe(2);
    expect((first?.tokens ?? 0) + (second?.tokens ?? 0)).toBeGreaterThanOrEqual(2899);
    expect((second?.tokens ?? 0)).toBeGreaterThan(first?.tokens ?? 0);
  });

  it("weighs a chat tool by the size it returned, since the result itself is not kept", () => {
    const estimates = estimateToolTokens(
      makeTrace({
        turn_timings: turns,
        tool_calls: [
          { tool_call_id: "call-1", start_ms: 8100, result_chars: 1000 },
          { tool_call_id: "call-2", start_ms: 8110, result_chars: 3000 },
        ],
      }),
    );

    // 2900 tokens of growth, split 1:3.
    expect(estimates.get("call-1")?.tokens).toBe(725);
    expect(estimates.get("call-2")?.tokens).toBe(2175);
  });

  it("gives no estimate to a tool the last turn asked for, since nothing read it", () => {
    const estimates = estimateToolTokens(
      makeTrace({ turn_timings: turns, tool_calls: [tool("call-9", 14500, "late")] }),
    );

    expect(estimates.size).toBe(0);
  });

  it("estimates from the result size when the next prompt did not grow", () => {
    const estimates = estimateToolTokens(
      makeTrace({
        turn_timings: [turns[0], { ...turns[1], promptTokens: 19000 }],
        tool_calls: [
          { tool_call_id: "call-1", start_ms: 8100, result_chars: 4000 },
          { tool_call_id: "call-2", start_ms: 8120, result_chars: 0 },
        ],
      }),
    );

    // 4000 characters, four per token. An empty result still has nothing to show.
    expect(estimates.get("call-1")).toEqual({
      tokens: 1000,
      readByTurn: 2,
      sharedBy: 1,
      fromResultSize: true,
    });
    expect(estimates.has("call-2")).toBe(false);
  });

  it("estimates a tool whose share of the growth rounds to zero", () => {
    const estimates = estimateToolTokens(
      makeTrace({
        turn_timings: turns,
        tool_calls: [
          { tool_call_id: "call-big", start_ms: 8100, result_chars: 100_000 },
          { tool_call_id: "call-small", start_ms: 8110, result_chars: 8 },
        ],
      }),
    );

    expect(estimates.get("call-big")?.fromResultSize).toBeUndefined();
    expect(estimates.get("call-big")?.tokens).toBeGreaterThan(0);
    expect(estimates.get("call-small")).toEqual({
      tokens: 2,
      readByTurn: 2,
      sharedBy: 1,
      fromResultSize: true,
    });
  });

  it("gives no estimate without per-turn prompts or tool offsets", () => {
    expect(
      estimateToolTokens(
        makeTrace({
          turn_timings: [
            { turn: 1, startMs: 100, durationMs: 8000 },
            { turn: 2, startMs: 8200, durationMs: 6000 },
          ],
          tool_calls: [tool("call-1", 8100, "x")],
        }),
      ).size,
    ).toBe(0);
    expect(
      estimateToolTokens(
        makeTrace({
          turn_timings: turns,
          tool_calls: [{ tool_call_id: "call-1", name: "t", arguments: {}, result: "x" }],
        }),
      ).size,
    ).toBe(0);
  });
});

describe("tool token estimate in the trace views", () => {
  const response = { turn_timings: turns, tool_calls: [tool("call-1", 8100, "x".repeat(400))] };

  it("puts the estimate on the tool row of the Duration Breakdown", () => {
    const spans = buildTraceSpans(makeTrace(response));

    expect(spans.find((span) => span.id === "tool_0")?.toolTokens).toEqual({
      tokens: 2900,
      readByTurn: 2,
      sharedBy: 1,
    });
  });

  it("puts the estimate on the tool step between the two turns", () => {
    const steps = buildTraceSteps(
      makeTrace(response, {
        messages: [
          { role: "user", content: "Show me my runs" },
          {
            role: "assistant",
            content: "",
            tool_calls: [
              {
                id: "call-1",
                type: "function",
                function: { name: "get_recent_executions", arguments: '{"limit":30}' },
              },
            ],
          },
          { role: "tool", tool_call_id: "call-1", content: "x".repeat(400) },
        ],
      }),
    );

    const toolStep = steps.find((step) => step.kind === "tool");
    expect(toolStep?.tokens).toBe(2900);
    expect(toolStep?.tokensEstimated).toBe(true);
    expect(toolStep?.tokensNote).toContain("turn 2");
  });

  it("keeps a size estimate on the tool row when the next prompt shrank", () => {
    const shrunk = {
      turn_timings: [turns[0], { ...turns[1], promptTokens: 19000 }],
      tool_calls: [
        {
          tool_call_id: "call-1",
          name: "save_workflow",
          start_ms: 8100,
          elapsed_ms: 22,
          result_chars: 4000,
        },
      ],
    };
    const spans = buildTraceSpans(makeTrace(shrunk));
    expect(spans.find((span) => span.id === "tool_0")?.toolTokens).toEqual({
      tokens: 1000,
      readByTurn: 2,
      sharedBy: 1,
      fromResultSize: true,
    });

    const steps = buildTraceSteps(
      makeTrace(shrunk, {
        messages: [
          { role: "user", content: "Save it" },
          {
            role: "assistant",
            content: "",
            tool_calls: [
              {
                id: "call-1",
                type: "function",
                function: { name: "save_workflow", arguments: "{}" },
              },
            ],
          },
          { role: "tool", tool_call_id: "call-1", content: "saved" },
        ],
      }),
    );
    const toolStep = steps.find((step) => step.kind === "tool");
    expect(toolStep?.tokens).toBe(1000);
    expect(toolStep?.tokensNote).toContain("result size");
  });
});
