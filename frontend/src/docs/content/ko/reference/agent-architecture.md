# Agent 아키텍처

[Agent 노드](../nodes/agent-node.md)는 sub-agent, sub-workflow, canvas 노드 도구, orchestrator 패턴, skill, MCP 연결, 도구 호출, 선택적 [영구 메모리](./agent-persistent-memory.md)(canvas 노드별, 다른 agent와의 선택적 공유 지원), 그리고 선택적 [인간 검토](./human-in-the-loop.md)를 지원합니다. 이 페이지에서는 해당 아키텍처를 설명합니다.

## Sub-Agent

Sub-agent는 orchestrator가 `call_sub_agent` 도구를 통해 호출할 수 있는 agent 노드입니다.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agent**: orchestrator의 Prompt를 수신하려면 User Message에서 `$input.text`를 반드시 사용해야 합니다
- **도구**: `sub_agent_label`(enum)과 `prompt`를 사용하는 `call_sub_agent`
- **깊이 제한**: 최대 5단계까지 중첩된 sub-agent 호출 가능

### 실행 흐름

1. Orchestrator가 sub-agent 호출을 결정합니다
2. `_execute_sub_agent_tool`이 label로 대상 agent를 찾습니다
3. `synthetic_inputs = {"input": {"text": prompt}}`를 구성합니다
4. Sub-agent에 대해 `_execute_agent_node`를 실행합니다
5. 결과가 orchestrator로 반환됩니다

### 병렬 Sub-Agent 실행

Orchestrator가 단일 턴에서 여러 개의 `call_sub_agent` 도구 호출을 반환하면, 이들은 **병렬로** 실행됩니다. 예를 들어 사용자가 "Paris"에 대해 질문하고 orchestrator가 `distanceAgent`와 `foodAgent`를 모두 호출하면, 두 agent가 순차적으로가 아니라 동시에 실행됩니다.

- **이점**: 전체 소요 시간이 모든 sub-agent의 합이 아니라 대략 가장 느린 sub-agent의 시간과 같습니다.
- **힌트**: 작업에 필요한 경우 orchestrator가 한 턴에서 여러 sub-agent를 호출하도록 유도하십시오.

## Sub-Workflow

`subWorkflowIds`가 구성되면, agent는 `call_sub_workflow` 도구를 통해 다른 Workflow를 호출할 수 있습니다.

- **구성**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **도구**: `workflow_id`(enum)와 `inputs`(object)를 사용하는 `call_sub_workflow`
- **깊이 제한**: 최대 5단계까지 중첩된 sub-workflow 호출 가능

### 실행 흐름

1. Agent가 sub-workflow 호출을 결정합니다
2. `_execute_sub_workflow_tool`이 `workflow_cache`에서 Workflow를 가져옵니다
3. `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`를 구성합니다
4. Sub-workflow에 대해 `WorkflowExecutor.execute()`를 실행합니다
5. 결과가 agent로 반환됩니다

Sub-workflow는 v1에서 HITL을 위해 일시 중지할 수 없습니다. 중첩된 sub-workflow가 대기 중인 검토 상태로 진입하려고 하면, 중첩 호출 내부에서 일시 중단되는 대신 실행이 실패합니다.

## Canvas 노드 도구

Canvas 노드 도구는 `tool-input` 핸들을 통해 agent에 연결된 Workflow 노드입니다. Agent 설정 중에 `_build_node_tool_schemas`가 해당 엣지를 스캔하여 연결된 노드마다 하나의 OpenAI 호환 도구 스키마를 추가합니다.

- **도구 소스**: `_source: "node_tool"`
- **도구 이름**: 연결된 노드 label에서 파생되며, 중복 시 접미사가 추가됩니다
- **도구 파라미터**: 노드의 `agentProvidedFields`에서 구성됩니다
- **고정 필드**: `agentProvidedFields`에 나열되지 않은 모든 노드 필드는 노드 구성에 그대로 유지됩니다

### 실행 흐름

1. Agent가 연결된 노드 도구 호출을 결정합니다
2. `_execute_node_tool`이 노드 데이터를 복사합니다
3. Agent가 제공한 인수가 구성된 노드 필드에 병합됩니다
4. `execute_node`가 분기 스케줄링을 비활성화한 상태로 해당 노드를 한 번 실행합니다
5. 원래 노드 데이터가 복원됩니다
6. 노드 출력이 도구 결과로 agent에 반환됩니다

도구 노드는 두 번 실행되지 않도록 일반 Workflow 스케줄링에서 제외됩니다. 이들은 agent 도구 호출 경로를 통해서만 실행됩니다.

## Human-in-the-Loop

Agent에 `hitlEnabled`가 설정되면, agent는 특정 승인 체크포인트에서 호출할 수 있는 `request_human_review` 도구를 받습니다.

1. 시스템 Prompt와 노드 HITL 가이드라인이 agent에게 어떤 작업에 승인이 필요한지 알려줍니다
2. Agent가 해당 단계 중 하나에 도달하면 `request_human_review`를 호출합니다
3. Heym이 Workflow 실행 스냅샷을 저장하고 공개 검토 요청을 생성합니다
4. 노드 결과가 검토 URL과 함께 `pending`으로 표시됩니다
5. Agent의 `review` 출력 핸들이 즉시 스케줄링되어 알림 분기가 pending Payload로 실행될 수 있게 합니다
6. 검토자가 응답할 때까지 메인 실행 스케줄링이 중지됩니다
7. `accept`, `edit`, `refuse` 시 저장된 스냅샷에서 executor가 재구성됩니다
8. 일시 중지된 agent가 승인된 검토 컨텍스트로 계속 진행하거나, `refuse` 시 즉시 종료됩니다
9. `review` 분기를 다시 실행하지 않고, 재개된 agent가 완료된 후 다운스트림 노드가 계속됩니다
10. 이후 작업에도 승인이 필요한 경우, agent는 동일 실행 내에서 또 다른 HITL 체크포인트를 생성할 수 있습니다

검토자용 요약은 검토 요청 자체에서 생성되므로, 노드 필드는 승인 정책과 타이밍에 집중된 상태로 유지될 수 있습니다.

이를 통해 agent Workflow는 대화 기록, 완료된 노드 출력, 루프 상태 및 기타 런타임 컨텍스트를 보존하면서 외부 승인을 기다릴 수 있습니다.

## Orchestrator 도구 Executor

사용자 정의 도구 executor는 다음과 같이 라우팅합니다:

- **Sub-agent 호출** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Sub-workflow 호출** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Canvas 노드 도구** (`_source == "node_tool"`) → `_execute_node_tool`
- **인간 검토** (`_source == "hitl"`) → pending HITL 체크포인트 생성
- **기타 도구** → `_unified_tool_executor` (Python, MCP, skill 도구)

이는 HITL이 활성화되었거나, `subAgentLabels`와 함께 `isOrchestrator`가 설정되었거나, `subWorkflowIds`가 구성된 경우에 사용됩니다.

## Skills

Skills는 에이전트의 시스템 컨텍스트를 확장하며 Python 도구를 추가할 수 있습니다.

- **형태**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Content**: 시스템 지시사항 앞에 추가됩니다(`---`로 연결됨)
- **Python 도구**: `.py` 파일이 있는 각 skill마다 `skill_{skill_name}` 도구가 추가됩니다
- **실행**: `skill_python_executor.py`가 임시 디렉터리에서 `uv run python`으로 스크립트를 실행합니다. 인수는 stdin으로 JSON 전달되며, 결과는 stdout으로 JSON 반환됩니다

Skills는 [Agent 노드](../nodes/agent-node.md) 설정의 Skills 영역에 `.zip` 또는 `.md` 파일을 드롭하여 추가할 수 있습니다.

## MCP Client

MCP(Model Context Protocol) 클라이언트는 외부 도구 서버에 연결합니다.

- **전송 방식**: `stdio`(command + args) 또는 `sse`(url + headers)
- **도구 목록 조회**: `list_mcp_tools` → `ClientSession.list_tools()` → `_source: "mcp"`와 함께 OpenAI 함수 형식으로 변환됩니다
- **실행**: `execute_mcp_tool` → `ClientSession.call_tool()` → `_extract_tool_result`를 통해 결과를 반환합니다

MCP 연결은 [MCP 탭](../tabs/mcp-tab.md) 또는 에이전트 노드의 `mcpConnections`에서 구성하십시오.

## Tool Calling

LLM 서비스는 `execute_with_tools` 루프를 실행합니다:

1. **컨텍스트 압축 확인** — 각 반복 전에 token 사용량을 추정하고 필요 시 압축합니다(아래 참조)
2. `tools`와 `tool_choice: "auto"`로 모델을 호출합니다
3. `tool_calls`가 존재하면: 각 호출마다 `tool_executor(tool_def, name, args, timeout)`을 실행합니다
4. 도구 결과를 messages에 추가하고 반복합니다
5. 더 이상 도구 호출이 없거나 `max_tool_iterations`에 도달하면 중지합니다

### Tool Dispatch

`_unified_tool_executor`는 `_source`에 따라 라우팅합니다:

| Source | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (default) | `execute_tool` (Python code tools) |

도구는 OpenAI 함수 호출 형식을 사용합니다: `name`, `description`, `parameters`(JSON schema).

## Context Compression

장시간 실행되는 에이전트의 컨텍스트 오버플로를 방지하기 위해, Heym은 각 도구 반복 전에 누적된 `messages` 목록을 자동으로 압축합니다.

### 알고리즘

1. **Token 추정**: 모든 messages에 대해 `total_chars / 4`로 계산합니다(빠르며 tokenizer가 필요하지 않습니다)
2. **임계값 확인**: `estimated_tokens < context_limit × 0.80`이면 압축을 건너뜁니다
3. **컨텍스트 한도**: `client.models.retrieve(model).context_window`를 시도하고, 실패 시 내장 테이블(`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M 등)로 대체합니다. 기본값은 128K입니다
4. **앵커 보존**: 항상 유지합니다
   - 첫 번째 `system` 메시지(에이전트 정체성 및 지시사항)
   - 첫 번째 `user` 메시지(원래 작업)
   - 마지막 `user` 메시지(가장 최근 지시사항)
5. **중간 요약**: 첫 번째와 마지막 user 메시지 사이의 모든 내용을 직렬화하여 요약 Prompt와 함께 동일한 모델로 전송합니다
6. **재구성**: `[system, first_user, assistant(summary), last_user]`

서로 다른 user 메시지가 2개 미만이거나(요약할 중간이 없음) LLM 요약 호출이 실패하면 압축을 건너뜁니다(안전한 대체: 원본 messages 반환).

### Observability

각 압축 이벤트는 다음과 같이 기록됩니다:
- `tool_calls_collected`의 `_context_compression` 항목 → Execution History 실행 상세에서 확인 가능합니다
- `phase: "compression"`이 포함된 `on_tool_call` 이벤트 → Debug 패널에서 `Context compressed (N messages → summary)`로 렌더링됩니다
- `context.compression` LLM trace 항목 → Traces 탭에서 압축 전후 token 추정치와 함께 확인 가능합니다

에이전트 도구 호출은 더 풍부한 observability 정보도 생성합니다:

- `tool_calls`의 호출별 라이프사이클 필드: `tool_call_id`, `status`(`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- 에이전트 결과의 집계 `tool_metrics`(상태별 개수와 총/최대 소요 시간), `_context_compression` 항목은 해당 집계에서 제외됩니다
- 선택적 OpenTelemetry 자식 span `heym.agent.tool.execute`(참조: [OpenTelemetry Tracing](./opentelemetry.md))
- 영구 저장되는 LLM trace / execution-history `tool_calls` Payload는 마스킹되고 크기가 제한됩니다. 실시간 HITL 재개 상태는 매칭을 위해 원본을 유지합니다

## Related

- [Why Heym](../getting-started/why-heym.md) – 에이전트 라이프사이클 전반에 걸친 멀티 에이전트 오케스트레이션
- [Agent Node](../nodes/agent-node.md) – 구성 및 파라미터
- [Agent Persistent Memory](./agent-persistent-memory.md) – 에이전트 노드별 지식 그래프 및 피어 공유
- [Human-in-the-Loop](./human-in-the-loop.md) – 검토 링크, 대기 중인 Payload, 재개 동작
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow, 노드, Agent 도구 span
- [Node Types](./node-types.md) – Agent 및 관련 노드
- [Parallel Execution](./parallel-execution.md) – DAG 기반 및 서브 에이전트 병렬 실행
- [MCP Tab](../tabs/mcp-tab.md) – MCP 연결 구성
- [Expression DSL](./expression-dsl.md) – 서브 에이전트용 `$input.text`
