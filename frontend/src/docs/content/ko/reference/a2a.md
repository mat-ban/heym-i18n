# A2A

Heym은 Agent2Agent 프로토콜(A2A 1.0, JSON-RPC 바인딩)을 통해 **Heym Agent**를 제공합니다. Heym Agent는 [Chat 탭](../tabs/chat-tab.md)을 구동하는 핵심 엔진입니다. MCP 클라이언트는 `heym_chat` 도구를 통해 동일한 에이전트에 접근합니다([MCP / A2A 탭](../tabs/mcp-tab.md) 참조). A2A를 활성화하면 다른 에이전트가 자연어로 Task를 전달하고 Chat과 동일한 기능을 활용하여 답변을 받아볼 수 있습니다.

## 활성화

1. **MCP / A2A** 탭을 엽니다.
2. 기본 서버 또는 지정된 이름의 서버에서 **Heym Agent**를 켜고, 해당 자격 증명과 모델을 선택합니다.
3. **A2A 활성화**를 선택합니다. 카드에 **Agent Card** URL과 **JSON-RPC Endpoint**가 표시됩니다.

A2A는 Heym Agent 위에서 동작합니다. 에이전트를 끄면 A2A도 함께 비활성화됩니다.

## Endpoints

| | 기본 서버 | 지정된 서버 |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card는 별도의 자격 증명을 요구하지 않으며 사용자, 서버 또는 Workflow 이름을 지정하지 않습니다. A2A가 활성화되어 있는 동안에만 존재합니다. 최소 한 명의 사용자가 기본 서버에 대해 A2A를 켜둔 동안 도메인 카드가 유지되며, 지정된 서버의 A2A가 켜져 있는 동안 해당 서버의 카드가 유지됩니다. 그렇지 않은 경우 해당 주소는 404를 반환합니다.

## 인증

MCP와 동일한 자격 증명을 헤더를 통해서만 전달하십시오.

- `X-MCP-Key: <key>`: 기본 서버 키 또는 지정된 서버 키
- `Authorization: Bearer <token>`: Heym OAuth 서버에서 발급한 OAuth Token

URL에 포함된 자격 증명은 거부됩니다. Agent Card는 두 가지 체계를 모두 선언하므로 A2A 클라이언트는 카드에서 이를 직접 읽을 수 있습니다.

## 메서드

| 메서드 | 설명 |
|---|---|
| `SendMessage` | Task를 시작하거나 입력을 기다리는 작업을 재개합니다. `configuration.returnImmediately`가 `true`가 아닌 한 응답을 기다립니다. |
| `SendStreamingMessage` | 동일하게 작동하며, 작업 진행 상황과 결과를 Server-Sent Events 스트림으로 전달합니다. |
| `GetTask` | Task의 상태, 응답 및 히스토리를 조회합니다(`historyLength`로 히스토리 크기 제한). |
| `ListTasks` | 이 서버에서 사용자의 작업 목록을 최신순으로 조회하며, `contextId` 또는 `status`로 필터링하고 `pageSize`와 `pageToken`을 지원합니다. |
| `CancelTask` | 실행 중이거나 대기 중인 Task를 중단합니다. |
| `SubscribeToTask` | 진행 중인 Task의 진행 상황을 구독합니다. |
| `GetExtendedAgentCard` | 서버 이름 및 스킬로 할당된 Workflows를 포함하는 카드입니다. |

푸시 알림은 제공되지 않습니다. 카드에는 `pushNotifications: false`로 표시되며 푸시 메서드 호출 시 `PushNotificationNotSupportedError`가 반환됩니다. 요청에는 A2A 1.0을 사용하며, `A2A-Version: 1.0` 헤더를 전송하십시오. `message/send`와 같은 A2A 0.3 메서드 이름은 `VersionNotSupportedError`를 반환합니다.

## Tasks 및 대화

모든 Task는 Chat 탭의 대화이며 네트워크 아이콘으로 표시됩니다. 작업의 `contextId`가 해당 대화를 나타냅니다. 대화를 계속하려면 동일한 `contextId`를 지정하고 `taskId` 없이 새 메시지를 보내십시오.

| 에이전트 수행 작업 | Task 상태 |
|---|---|
| 응답 완료 | `TASK_STATE_COMPLETED`: 텍스트 형태의 응답과, 저장된 항목이 있는 경우 Workflows 및 평가 스위트에 대한 링크가 데이터로 포함됨 |
| 추가 설명 질문 제시 | `TASK_STATE_INPUT_REQUIRED`: 동일한 `taskId`로 응답 |
| 자격 증명 필요 | `TASK_STATE_AUTH_REQUIRED`: 상태 메시지에 Heym 자격 증명 페이지 링크가 포함됩니다. 사용자가 Heym에 로그인된 브라우저에서 이를 열어 입력하며, 해당 값은 상대 에이전트를 절대 통과하지 않습니다. 이후 동일한 Task에서 메시지를 전송하여 계속 진행하십시오. |
| 실패 | `TASK_STATE_FAILED`: 실패 원인 포함 |
| 취소됨 | `TASK_STATE_CANCELED` |

완료된 Task 또는 여전히 작업 중인 작업으로 전송된 메시지는 `UnsupportedOperationError`로 거부됩니다. 메시지는 `text` 및 `data` 부분을 수신하며 둘을 합쳐 최대 20,000자까지 지원합니다. 파일 부분은 거부되므로 파일은 링크 형태로 전송하십시오.

## 진행 상황

Task가 실행되는 동안 스트림은 각 단계별 상태 업데이트를 전송합니다. Chat 탭에 표시되는 문구(예: `Running workflow "Invoice Parser"` 또는 `Testing the workflow · attempt 2/5`)와 동일합니다. MCP 클라이언트는 `heym_chat`으로부터 `notifications/progress` 형태로 동일한 단계를 수신합니다.

## 예시

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## 제한 사항

- `CancelTask`는 Chat 탭의 중지 버튼과 마찬가지로 해당 턴을 실행 중인 Heym 인스턴스에서 즉시 턴을 중단합니다. 다른 위치에서는 작업이 취소된 것으로 표시되고 늦게 도착한 턴 결과는 기록되지 않습니다.
- 푸시 알림 미지원, REST 또는 gRPC 바인딩 없음, 서명된 Agent Cards 미지원.

## 관련 문서

- [MCP / A2A 탭](../tabs/mcp-tab.md): Heym Agent 및 A2A 켜기
- [Chat 탭](../tabs/chat-tab.md): 에이전트를 구동하는 핵심 엔진
- [보안](./security.md): 키 저장 및 관리 방식
