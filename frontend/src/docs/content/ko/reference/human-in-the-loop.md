# Human-in-the-Loop

Human-in-the-loop(HITL)을 사용하면 [Agent 노드](../nodes/agent-node.md)가 특정 시점에 승인을 요청하고, 사람의 결정을 기다린 후, 동일한 실행 스냅샷에서 Workflow를 계속 진행할 수 있습니다.

## 기능 개요

- 별도의 승인 Workflow를 구축하지 않고도 Agent에 명시적인 승인 체크포인트를 추가합니다
- `/review/{token}` 경로에 일회성 공개 검토 URL을 생성합니다
- 검토자가 `Accept`, `Edit & Continue`, `Refuse` 중 하나를 선택할 수 있습니다
- 결정이 도달할 때까지 실행을 `pending` 상태로 표시합니다
- 일시 중지된 실행을 재개하고 승인 후 Agent가 계속 진행할 수 있도록 합니다
- 동일한 Agent 실행 내에서 여러 개의 순차적 HITL 체크포인트를 지원합니다

## Agent 구성

Agent 속성 패널에서 HITL을 활성화합니다.

| 설정 | 설명 |
|---------|-------------|
| `hitlEnabled` | 이 Agent에 대한 사람 검토를 활성화합니다 |
| `hitlSummary` | Agent가 사람 검토를 요청해야 하는 시점에 대한 승인 가이드라인 |

HITL은 Agent에 `request_human_review` 도구를 추가합니다. 시스템 Prompt와 `hitlSummary` 가이드라인을 사용하여 Agent에게 어떤 작업에 승인이 필요한지 알려주십시오. Agent가 체크포인트에 검토가 필요하다고 판단하면, 사람에게 단일 Markdown 검토 텍스트를 전송합니다. 검토자용 요약은 런타임에 Agent의 요청으로부터 생성되며, Agent가 이를 생략하는 경우 Heym이 Markdown 본문에서 도출합니다. v1에서 HITL은 텍스트 모드 Agent 출력만 지원하므로 `jsonOutputEnabled`와 함께 사용할 수 없습니다.

MCP 도구의 경우, Heym은 모델에게 작성된 HITL 지침을 다음 세 가지 승인 범위 중 하나로 해석하도록 요청합니다:

- `always` — "always", "on each", "for each"와 같은 표현
- `once` — "once", "only one time"과 같은 표현
- `never` — "never", "do not ask", "already approved"와 같은 표현

이 해석은 반복되는 MCP 호출이 다시 일시 중지될지, 한 번 승인된 상태로 유지될지, 아니면 사람 검토를 완전히 건너뛸지를 제어합니다.

HITL이 활성화되면 Agent는 `review`라는 레이블이 붙은 두 번째 캔버스 출력 핸들도 노출합니다. 해당 분기를 사용하여 대기 중인 검토 URL과 요약을 Slack, 이메일, 로깅 또는 기타 알림 흐름으로 전송하는 동안, 메인 실행은 사람을 기다립니다.

## 검토 흐름

1. Agent가 승인이 필요한 단계에 도달하여 `request_human_review`를 호출합니다
2. Heym이 공개 검토 요청을 생성하고 검토 URL을 반환합니다
3. Agent의 `review` 핸들에 연결된 모든 노드가 대기 중인 HITL Payload와 함께 즉시 실행됩니다
4. Workflow 실행이 `pending`으로 전환됩니다
5. 검토자가 로그인 없이 `/review/{token}`을 엽니다
6. 검토자가 다음 중 하나의 작업을 선택합니다:
   - `Accept` — 원본 Markdown으로 계속 진행합니다
   - `Edit & Continue` — 편집된 Markdown으로 계속 진행합니다
   - `Refuse` — `decision: "refused"`로 계속 진행하고 추가 Agent 작업을 건너뜁니다
7. Heym이 저장된 스냅샷에서 Workflow를 재개하고, Agent가 승인된 Markdown 컨텍스트로 계속 진행할 수 있도록 합니다
8. 이후 단계에서도 승인이 필요한 경우, Agent가 HITL을 다시 호출하여 또 다른 대기 체크포인트를 생성할 수 있습니다

아무도 응답하지 않으면 검토 링크는 168시간 후에 만료됩니다.

## 공개 검토 페이지

공개 검토 페이지에는 다음이 표시됩니다:

- Workflow 이름과 Agent 레이블
- Agent의 검토 요청으로부터 자동 생성된 검토자 요약
- Markdown 검토 텍스트가 메인 콘텐츠로 먼저 표시됩니다
- 검토자가 `Edit`을 클릭한 후에만 열리는 편집 상자
- 편집 중 실시간 Markdown 미리보기
- `Accept`, `Edit & Continue`, `Refuse`를 위한 작업 버튼

결정이 제출되면 Token이 잠기고 재사용할 수 없습니다.

## 출력 및 실행 상태

검토를 기다리는 동안 Agent 출력에는 대기 중인 Payload가 포함됩니다:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

검토자가 응답하고 Workflow가 재개된 후, 최종 Agent 출력에는 결정 메타데이터가 포함됩니다:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

다운스트림 노드에서 `$agentLabel.decision`을 사용하여 accepted, edited, refused 결과로 분기하십시오.

## 캔버스 검토 분기

`review` 출력 핸들은 Agent에 대해 `hitlEnabled`가 활성화된 경우에만 사용할 수 있습니다.

- 사람의 결정이 도달하기 전에 실행됩니다
- `summary`, `draftText`, `reviewUrl`, `shareText`, `shareMarkdown`을 포함한 대기 중인 HITL Payload를 수신합니다
- Slack, 이메일, 감사 로깅과 같은 알림 또는 핸드오프 단계를 위한 것입니다
- 각 HITL 체크포인트마다 한 번씩 실행됩니다
- 검토자가 응답한 후에는 다시 실행되지 않으며, 재개 시에는 일반 Agent 출력 경로만 계속됩니다

## 표시 위치

- [Execution History](./execution-history.md)는 `pending` 실행을 즉시 표시하고 노드 결과에 검토 URL을 저장합니다
- [Portal](./portal.md) 채팅 응답은 빈 답변 대신 사람 검토 링크를 표시합니다
- Debug 패널과 기록 대화상자는 최종 HITL 결정과 검토된 텍스트를 표시합니다
- 검토 출력 핸들은 Workflow가 Cron, curl 또는 Portal 트래픽에 의해 Trigger된 경우에도 외부 채널에 알릴 수 있습니다
- 여러 HITL 체크포인트는 동일한 실행 기록 항목을 재사용하면서 각 일시 중지마다 새로운 일회성 검토 링크를 생성합니다

## 현재 제한 사항

- HITL은 Agent 노드에서만 사용할 수 있습니다
- HITL은 Agent의 텍스트 출력을 사용하며 v1에서는 JSON 출력을 지원하지 않습니다
- 일시 중지된 실행은 최신 편집된 Workflow 버전이 아닌 저장된 Workflow 스냅샷에서 재개됩니다
- 중첩된 하위 Workflow는 v1에서 대기 중인 HITL 상태로 진입할 수 없습니다. 호출하기 전에 상위 Agent에서 검토를 요청하십시오

## 관련 항목

- [Agent Node](../nodes/agent-node.md) - Agent에서 HITL 구성
- [Agent Architecture](./agent-architecture.md) - Agent, 도구, 하위 Agent 및 HITL이 함께 작동하는 방식
- [Execution History](./execution-history.md) - 대기 중 및 재개된 실행 검사
- [Board](../tabs/board-tab.md) - Board 체인 실행은 HITL 시 카드를 대기(호박색) 상태로 일시 중지합니다
- [Portal](./portal.md) - 공개 채팅 흐름 및 HITL 검토 링크
