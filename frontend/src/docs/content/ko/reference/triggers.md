# Triggers

Workflow는 **trigger 노드** 또는 **진입점**에 의해 시작됩니다. 각 trigger 유형은 고유한 endpoint 또는 백그라운드 프로세스를 가집니다.

## Trigger 노드

실행을 개시하는 시작 노드(들어오는 엣지가 없는 노드)입니다:

| 노드 유형 | 설명 |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP 진입점입니다. 요청으로부터 `body`, `headers`, `query`를 수신합니다. |
| [Cron](../nodes/cron-node.md) | 일정에 따라 실행됩니다(cron 표현식, 예: 매시간 실행은 `0 * * * *`). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram이 노드별 webhook URL로 봇 webhook 업데이트를 전송할 때 시작됩니다. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord가 노드별 endpoint로 Interactions API webhook을 전송할 때 시작됩니다. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP 메일함을 폴링하고 새로 감지된 각 이메일마다 한 번씩 시작됩니다. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Heym이 플랫폼 이벤트를 발행할 때 시작됩니다. 하나의 디스패치 윈도우 내 이벤트는 배열로 함께 도착합니다. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | 외부 소켓으로 아웃바운드 클라이언트 연결을 열고 선택된 소켓 이벤트에서 시작됩니다. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | 일회용 업로드 URL을 발급하고 호출자가 대용량 multipart 파일을 게시할 때 시작됩니다. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | RabbitMQ 큐에서 메시지가 소비될 때 시작됩니다. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Slack이 Events API webhook을 통해 이벤트를 전송할 때 시작됩니다. |

## 진입점

| Trigger | Endpoint / 소스 | 인증 |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` header 또는 `Authorization: Bearer` (header 전용) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal 세션 token |
| **Board** | [Board](../tabs/board-tab.md) 카드 이동 / workflow 체인이 있는 컬럼으로의 후속 실행 (`trigger_source="board"`) | JWT (board 소유자) |
| **Cron** | Cron 스케줄러 (60초마다 실행되며 cron 표현식을 평가) | N/A |
| **IMAP** | IMAP trigger 관리자 (리더 worker, 노드별 폴링 간격) | IMAP 사용자 이름/비밀번호 |
| **WebSocket** | 아웃바운드 WebSocket trigger 관리자 (리더 worker, 영구 클라이언트 연결) | 노드별 선택적 headers |
| **File Upload** | 슬롯 발급 후 `POST /api/file-intake/u/{token}` | 일회용 capability token |
| **RabbitMQ** | RabbitMQ consumer (리더 worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 서명 secret |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 애플리케이션 공개 키 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | 선택적 `x-telegram-bot-api-secret-token` |
| **Editor** | Webhook과 동일하며, `workflowStore.executeWorkflow`를 통해 실행 | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **입력**: 요청 body가 textInput 노드에 `body`로 전달됩니다
- **Body 모드**: Workflow는 편집기와 cURL 대화상자에서 `defined` 필드 형태의 예시 또는 `generic` 원시 JSON 예시를 사용할 수 있습니다
- **인증**: Workflow별로 구성됩니다(`auth_type`, `allow_anonymous`)

TTL, 캐시, 속도 제한, 인증에 대한 자세한 내용은 [Webhooks](./webhooks.md)를 참조하십시오.

### MCP

`mcp_enabled=true`인 Workflow는 MCP 클라이언트에 도구로 표시됩니다. 도구 이름은 Workflow 이름에서 파생됩니다. [MCP Tab](../tabs/mcp-tab.md)을 참조하십시오.

### Portal

`/chat/{slug}`에서 제공되는 공개 채팅 UI입니다. 자세한 내용은 [Portal](./portal.md)을 참조하십시오.

### Cron

Cron 스케줄러는 60초마다 실행되며, 활성 `cron` 노드를 가진 Workflow를 찾아 cron 표현식을 평가하고 일치하는 Workflow를 실행합니다. 입력에는 `{"triggered_by": "cron"}`이 포함됩니다.

### IMAP

IMAP trigger 관리자는 리더 worker에서 실행되며, 구성된 `pollIntervalMinutes`에 따라 활성 `imapTrigger` 노드를 확인합니다. 각 노드는 IMAP 커서(`UIDVALIDITY` + 마지막으로 확인한 UID)를 저장합니다. 입력에는 `email`, `triggered_by: "imap"`, `trigger_node_id`, `triggered_at`이 포함됩니다.

### Heym 플랫폼 이벤트

Heym 이벤트 디스패처는 5초마다 `heym_events` 로그를 폴링하고 일치하는 이벤트를 활성 `heymTrigger` 노드에 전달합니다. 전달은 (event, workflow, node)별 고유 제약 조건을 통해 클레임되므로, 이벤트는 모든 worker, 컨테이너, 머신에 걸쳐 구독 노드당 정확히 한 번만 발생합니다. 한 번의 패스에서 클레임된 모든 이벤트는 단일 실행으로 전달됩니다: 입력에는 `events`(항상 배열, 오래된 것부터), `count`, `triggered_by: "heym_event"`, `trigger_node_id`, `triggered_at`이 포함됩니다. 최근 5분 이내에 발행된 이벤트만 디스패치되므로, 장애 발생 시 백로그가 재생되는 것을 방지합니다. 이벤트는 7일 동안 보존됩니다.

### WebSocket

WebSocket trigger 관리자는 리더 worker에서 실행되며 활성 [WebSocket Trigger](../nodes/websocket-trigger-node.md) 노드당 하나의 아웃바운드 클라이언트 연결을 유지합니다. `onMessage`, `onConnected`, `onClosed`에 대해 실행을 발생시킬 수 있습니다. 입력에는 `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id`, 그리고 `message`, `connection`, `close` 중 하나가 포함됩니다.

### 파일 업로드

[File Upload Trigger](../nodes/file-upload-trigger-node.md)는 Workflow가 API, MCP 또는 캔버스를 통해 호출될 때 TTL이 제한된 일회용 업로드 슬롯을 생성합니다. `POST /api/file-intake/u/{token}`로 multipart form 데이터를 업로드하면 슬롯이 소비되고, 파일이 Drive 파일로 저장되며, Workflow가 동기적으로 시작됩니다. 입력에는 `file`, `uploaded_at`, `triggered_by: "file_upload"` 및 업로드 메타데이터가 포함됩니다.

### Telegram

Telegram은 봇 Webhook 업데이트를 `POST /api/telegram/webhook/{node_id}`로 전송합니다. Payload는 `update`, `message`, 선택적 `callback_query`, 정제된 `headers`, `triggered_by`, `trigger_node_id`, `triggered_at`으로 Workflow에 전달됩니다. 선택한 자격 증명에 secret token이 있는 경우, Heym은 실행 전에 `x-telegram-bot-api-secret-token`을 검증합니다.

### Discord

Discord는 상호작용 Webhook을 `POST /api/discord/webhook/{node_id}`로 전송합니다. Payload는 `interaction`, `type`, `data`, 정제된 `headers`, `triggered_by`, `trigger_node_id`, `triggered_at`으로 Workflow에 전달됩니다. Heym은 실행 전에 Ed25519와 선택한 `discord_trigger` 자격 증명의 애플리케이션 공개 키를 사용하여 요청을 검증합니다.

### RabbitMQ

RabbitMQ consumer는 리더 워커가 초기화될 때 시작됩니다. `rabbitmqOperation === "receive"`인 `rabbitmq` 노드를 가진 Workflow는 consumer를 할당받습니다. 입력에는 `message_data`(body, headers, routing_key 등)와 `triggered_by: "rabbitmq"`가 포함됩니다.

## 동시성 제한

[동시성 제한](./webhooks.md#concurrency-limit-and-queued-runs)이 있는 워크플로는 슬롯이 가득 찼을 때 위의 모든 진입점에서의 프로덕션 실행을 모든 인스턴스에 걸쳐 선입선출(FIFO) 방식으로 대기열에 추가합니다. 호출자가 결과를 확인하는 방법은 진입점에 따라 다릅니다:

| 진입점 | 실행이 대기하는 동안 |
|---|---|
| Webhook / API | `execution_id` 및 상태 URL과 함께 `202 Accepted` |
| SSE streaming, Quick Drawer, Portal chat | 스트림이 열린 상태로 유지되며 `queued` 이벤트를 전송 |
| Portal without streaming | 요청이 결과를 대기 |
| MCP | `heym_execution_status`로 폴링할 `queued` 결과 |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Trigger는 다른 [인스턴스](./cluster.md)에서의 실행과 동일한 시간 동안 결과를 대기합니다. 실행은 어느 쪽이든 진행되며 기록에 남습니다 |

대기열이 가득 차면 실행이 시작되지 않고 기록에 `queue_full`로 기록됩니다. 편집기의 테스트 실행, 서브 워크플로 호출([Execute](../nodes/execute-node.md) 노드 및 에이전트 워크플로 도구), [Evals](../tabs/evals-tab.md), 채팅 빌드 모드 테스트 실행 및 리뷰 재개는 절대 대기열에 추가되지 않습니다. [Board](../tabs/board-tab.md) 카드 실행, [File Upload](../nodes/file-upload-trigger-node.md) 실행, AI 어시스턴트의 run-workflow 도구로 시작된 실행, 경고 알림 워크플로 또한 슬롯을 기다리지 않고 시작됩니다.

## trigger_source

실행 기록은 모든 진입점에 대해 `trigger_source`를 기록합니다:

| 값 | 시점 |
|-------|------|
| `"API"` | 명시적 헤더가 없는 Webhook / API 호출 (기본값) |
| `"Canvas"` | Workflow 편집기 캔버스에서 실행 |
| `"Quick Drawer"` | 편집기 quick-drawer 패널에서 실행(드롭존에서 업로드된 파일 실행 포함) |
| `"cron"` | Cron 스케줄러 |
| `"imap"` | IMAP Trigger 관리자 |
| `"websocket"` | 아웃바운드 WebSocket Trigger 관리자 |
| `"file_upload"` | File Upload Trigger 업로드 Endpoint(HTTP, MCP 또는 캔버스를 통해 발급된 링크) |
| `"dashboard"` | 대시보드 위젯 실행 및 파일 드롭 위젯에서 업로드된 실행 |
| `"telegram"` | Telegram 봇 Webhook |
| `"Discord"` | Discord 상호작용 Webhook |
| `"MCP"` | MCP 도구 호출 |
| `"portal"` | Portal 실행 |
| `"dashboard_chat"` | AI 어시스턴트 채팅 |
| `"AI Agents"` | AI Agent 노드에 의해 호출된 하위 Workflow |
| `"SUB_WORKFLOW"` | Execute Workflow 노드에 의해 호출된 하위 Workflow |
| 사용자 정의 | `X-Trigger-Source` 헤더 또는 `trigger_source` query/body 파라미터로 전송된 모든 값 |
| (설정되지 않음) | RabbitMQ consumer |

## Trigger별 입력

- **HTTP/Webhook**: 요청의 `body`, `headers`, `query`
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + 선택적 `callback_query` + 정제된 `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + 정제된 `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (전체 Slack 이벤트 객체) + `headers` (정제됨) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + 선택적 `conversation_history`

## 관련 항목

- [Webhooks](./webhooks.md) – Webhook TTL, 캐시, 속도 제한, 인증
- [Workflow 구조](./workflow-structure.md) – 노드와 엣지
- [노드 유형](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord 상호작용 Webhook Trigger
- [빠른 시작](../getting-started/quick-start.md) – Input으로 Workflow 구축
- [Portal](./portal.md) – Portal Trigger 및 채팅 UI
- [실행 기록](./execution-history.md) – 과거 실행 및 trigger_source 확인
