# 전체 기능 목록

Heym의 모든 기능을 포괄적으로 개괄합니다. 각 섹션에서는 기능이나 개념을 몇 문장으로 설명합니다.

---

## 시작하기

### [소개](../getting-started/introduction.md)

Heym은 프로덕션 환경에서 AI 에이전트를 실행하고 관리하기 위한 인프라입니다. 시각적 캔버스에서 에이전트 시스템을 구축하고 자신 있게 실행할 수 있습니다. 에이전트를 오케스트레이션하고, 비즈니스 프로세스를 자동화하며, 모든 실행을 검사하고, 자체 인프라에서 인간이 제어권을 유지하도록 합니다. 시각적 Workflow, AI 기반 노드([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Assistant](./ai-assistant.md), 통합([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), 인바운드 [IMAP Trigger](../nodes/imap-trigger-node.md) 이메일, 아웃바운드 [Send Email](../nodes/send-email-node.md)), [Cron](../nodes/cron-node.md)을 통한 스케줄링, 그리고 최종 사용자를 위한 [Portal](./portal.md) 채팅 포털을 지원합니다.

[핵심 개념](../getting-started/core-concepts.md), [노드 유형](./node-types.md), [서드파티 통합](./integrations.md)도 참조하십시오.

### [Heym을 선택하는 이유](../getting-started/why-heym.md)

Heym을 선택하는 이유에서는 에이전트 생명주기(구축, 오케스트레이션, 실행, 관찰, 평가, 제어, 노출)를 살펴보고, 각 단계에서 하나의 자체 호스팅 런타임이 무엇을 처리하는지 보여줍니다. 여기에는 도구 호출, Python 도구, [MCP](../tabs/mcp-tab.md) 연결, 스킬, 멀티 에이전트 오케스트레이션을 지원하는 [LLM](../nodes/llm-node.md) 노드와 [Agent Node](../nodes/agent-node.md), Trigger, 재시도, [부하 분산](./cluster.md), 실행별 USD 비용과 OpenTelemetry 내보내기를 제공하는 [Traces](../tabs/traces-tab.md), [Evals](../tabs/evals-tab.md), [인간 검토 체크포인트](./human-in-the-loop.md), 가드레일, SSO, 감사 추적, 그리고 REST, MCP, Portal Endpoint가 포함됩니다. n8n, Zapier, Make.com과의 기능 비교로 페이지를 마무리합니다.

[Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md), [에이전트 아키텍처](./agent-architecture.md)도 참조하십시오.

### [빠른 시작](../getting-started/quick-start.md)

몇 분 만에 첫 Workflow를 실행하십시오. [Workflows](../tabs/workflows-tab.md) 탭에서 Workflow를 생성하고, [Input](../nodes/input-node.md) 노드, [LLM](../nodes/llm-node.md) 노드, [Output](../nodes/output-node.md) 노드를 추가한 다음 연결합니다. credential로 [LLM](../nodes/llm-node.md)을 구성하고 `userMessage`를 `$input.text`로 설정하십시오. Run 또는 [AI Assistant](./ai-assistant.md)를 사용하여 자연어로 Workflow를 실행하거나 생성할 수 있습니다.

[Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md), [Expression DSL](./expression-dsl.md)과 자연스럽게 함께 사용됩니다.

### [핵심 개념](../getting-started/core-concepts.md)

Workflow는 엣지로 연결된 노드의 방향성 그래프이며, 실행은 Trigger 노드([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md))에서 처리 노드를 거쳐 [Output](../nodes/output-node.md) 노드로 흐릅니다. 각 노드는 유형, 데이터(구성), 입력/출력을 가지며, 엣지는 데이터 흐름을 정의합니다. 노드는 `$nodeLabel.field`와 같은 [Expression DSL](./expression-dsl.md) 표현식을 통해 업스트림 데이터를 참조하며, 독립적인 노드는 자동으로 [병렬](./parallel-execution.md)로 실행됩니다.

[Trigger](./triggers.md), [병렬 실행](./parallel-execution.md), [Workflow 구조](./workflow-structure.md)도 참조하십시오.

### [실행 및 배포](../getting-started/running-and-deployment.md)

Heym은 로컬 개발용 `run.sh`(Docker 내 데이터베이스, FastAPI 백엔드, Vite 프론트엔드)와 Docker Compose를 사용한 프로덕션용 `deploy.sh`를 제공합니다. 둘 다 `.env` 파일을 사용하며, 주요 변수로는 `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL`, `ALLOW_REGISTER`가 있습니다. 개발 환경은 구성 가능한 프론트엔드 및 백엔드 포트에서 실행되며, 프로덕션은 프론트엔드 컨테이너를 통해 `/api` 아래에서 API를 제공합니다.

[보안](./security.md), [엔터프라이즈](./enterprise.md), [설정](./user-settings.md)도 참조하십시오.

### [Heym으로 마이그레이션](../getting-started/migrate-to-heym.md)

AI Convert 도구는 다른 플랫폼(n8n, Flowise, Dify, Langflow, sim.ai, Activepieces)의 Workflow 또는 평범한 영어 설명을 Heym Workflow로 변환하여 캔버스에 실시간으로 스트리밍하고 [다운로드 및 가져오기](./download-import.md)할 준비를 갖춥니다. AI 안전 검사를 실행한 다음, 입력 및 속도 제한이 설정된 상태로 DSL을 생성합니다. [heym.run/convert](https://heym.run/convert)에서 열 수 있습니다.

[빠른 시작](../getting-started/quick-start.md), [다운로드 및 가져오기](./download-import.md), [AI Assistant](./ai-assistant.md)도 참조하십시오.

---

## 노드

### Trigger
#### [Input](../nodes/input-node.md)

Input 노드는 사용자 또는 API 호출자로부터 데이터를 수신하는 Workflow의 진입점입니다. 단일 또는 다중 입력 필드를 지원하며 요청 메타데이터(headers, query params)를 노출합니다. body 필드는 `$nodeLabel.body.fieldKey`로, headers는 `$nodeLabel.headers`로, query는 `$nodeLabel.query`로 접근하십시오.

[Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) 노드와 자연스럽게 조합됩니다. Payload 참조 및 필드 접근에 대해서는 [Expression DSL](./expression-dsl.md) 및 [Webhooks](./webhooks.md)를 참조하십시오.

#### [Cron](../nodes/cron-node.md)

Cron 노드는 표준 5필드 cron 표현식을 사용하여 일정에 따라 Workflow를 Trigger합니다. 사용자 입력이 필요하지 않으며, 지정된 시각(예: 매시간, 매일, 15분마다)에 Workflow가 자동으로 실행됩니다. 출력은 Payload가 없는 Trigger 이벤트입니다.

예약 및 지연 실행에 대해서는 [Triggers](./triggers.md), [Wait](../nodes/wait-node.md), [Execution History](./execution-history.md)를 참조하십시오.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

IMAP Trigger 노드는 설정 가능한 분 단위 간격으로 수신함을 폴링하고, 새로 감지된 각 이메일에 대해 Workflow를 시작합니다. 파싱된 headers, 발신자 및 수신자 목록, 일반 텍스트 및 HTML 본문, 첨부 파일 메타데이터, Trigger 타임스탬프를 출력합니다. 지원 수신함 분류, 메일함에서 [Slack](../nodes/slack-node.md)으로의 라우팅, 또는 [Human-in-the-Loop](./human-in-the-loop.md)를 활용한 이메일 기반 승인 흐름에 사용하십시오.

수신 분류 및 응답 Workflow를 위해 [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md), [Slack](../nodes/slack-node.md)과 조합됩니다.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Heym Trigger 노드는 Heym 자체가 플랫폼 이벤트를 발행할 때 Workflow를 시작합니다: `heym.started`, `workflow.created`, `workflow.updated`, `workflow.deleted`. 전달은 배치 방식으로 이루어지며, 하나의 5초 디스패치 윈도우 내에 발행된 모든 이벤트는 단일 실행에서 `$nodeLabel.events`로 도착하며 항상 배열입니다. 각 이벤트는 고유한 데이터베이스 제약 조건을 통해 클레임되므로, 실행 중인 worker, container, machine 수에 관계없이 구독 노드당 정확히 한 번만 발생합니다. Workflow 변경 감사 추적, 배포 공지, 인스턴스 상태 요약에 사용하십시오.

변경된 Workflow를 조회하려면 [Heym](../nodes/heym-node.md) 노드와, 이벤트당 한 번씩 동작하려면 [Loop](../nodes/loop-node.md)와 조합하십시오.

#### [Heym](../nodes/heym-node.md)

Heym 노드는 세 가지 작업을 통해 Heym 자체 데이터를 읽습니다: `listWorkflows`는 소유자가 접근할 수 있는 모든 Workflow를 노드 수 및 타임스탬프와 함께 반환하고, `getWorkflow`는 하나의 Workflow의 노드 및 엣지 구조를 반환하며, `getExecutionHistory`는 실행 이력 항목을 최신순으로 반환하며 선택적 status, time-window, limit 필터와 status별로 그룹화된 합계를 함께 제공합니다. 결과는 노드가 위치한 Workflow의 소유자로 범위가 지정되므로, cron, portal, 또는 이벤트로 시작된 실행도 수동 실행과 동일한 데이터를 반환합니다. `getWorkflow`는 전체 노드 구성을 반환하므로, 하드코딩된 키나 Token에 대해 Workflow를 감사하는 것이 가능합니다. 이는 Workflow 소유자가 편집기에서 이미 열 수 없는 어떤 것도 노출하지 않습니다. Credential은 필요하지 않습니다.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

WebSocket Trigger 노드는 외부 WebSocket 서버로 아웃바운드 클라이언트 연결을 열고 `onMessage`, `onConnected`, `onClosed`에서 Workflow를 시작합니다. 파싱된 메시지 Payload, 재연결 상태, 종료 메타데이터, 다운스트림 표현식용 소켓 URL을 노출합니다.

실시간 통합을 위해 [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md), [SSE Streaming](./sse-streaming.md)과 조합됩니다.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Telegram Trigger 노드는 봇 Webhook 업데이트를 수신하고 즉시 Workflow를 시작합니다. 전체 업데이트 Payload, 기본 메시지 객체, callback queries, 정제된 headers, Trigger 타임스탬프를 노출합니다. 챗봇, [Telegram](../nodes/telegram-node.md) 내 AI 어시스턴트, 버튼 기반 흐름에 사용하십시오.

봇 기반 Workflow를 위해 [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md), [Webhooks](./webhooks.md)와 조합됩니다.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Slack Trigger 노드는 Slack Events API Webhook을 수신하고 요청 서명을 검증한 후 Workflow를 자동으로 시작합니다. 다운스트림 라우팅, [LLM](../nodes/llm-node.md) 기반 분류, 응답 흐름을 위해 이벤트 Payload와 정제된 headers를 노출합니다.

[Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md), [Third-Party Integrations](./integrations.md)와 조합됩니다.

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Discord Trigger 노드는 Discord Interactions API Webhook을 수신하고, 선택된 `discord_trigger` Credential로 Ed25519 서명을 검증한 후 Workflow를 시작합니다. 다운스트림 라우팅 또는 응답을 위해 전체 interaction Payload, command 데이터, 정제된 headers, Trigger 메타데이터를 노출합니다.

[Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md), [Third-Party Integrations](./integrations.md)와 조합됩니다.
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ 노드는 RabbitMQ 큐 및 익스체인지와 메시지를 주고받습니다. 메시지 기반 Workflow와 이벤트 처리에 사용하십시오. 전송 모드는 선택적 지연과 함께 메시지를 발행하며, 수신 모드는 [Trigger](./triggers.md)로 동작하여 메시지가 도착하면 Workflow가 시작됩니다. 출력에는 status, message_id, body가 포함됩니다.

이벤트 기반 처리를 위해 [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md), [Parallel Execution](./parallel-execution.md)과 함께 사용하십시오.

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler 노드는 Workflow 내의 어떤 노드든 실패할 때 자동으로 실행됩니다. 들어오는 엣지가 필요하지 않으며, 엔진에 의해 트리거됩니다. 출력에는 오류 메시지, 실패한 노드 레이블, 노드 유형, 타임스탬프가 포함됩니다. 이를 사용하여 [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md), 또는 [Send Email](../nodes/send-email-node.md)을 통해 알림을 보내거나, 오류를 로깅하거나, 사용자 정의 오류 응답을 반환하십시오.

캔버스에서 오류를 처리하는 대신, Workflow가 실패를 별도의 Workflow에 위임할 수도 있습니다 — [Error Workflow](#error-workflow)를 참조하십시오. 캔버스에 이미 Error Handler 노드가 포함되어 있으면 오류 Workflow는 **호출되지 않습니다**(로컬 핸들러가 우선합니다).

일반적인 알림 대상은 [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md)이며, 실행 세부 정보는 [Execution History](./execution-history.md)에서 더 쉽게 확인할 수 있습니다.

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent 노드는 도구 호출 기능을 갖춘 [LLM](../nodes/llm-node.md) 노드입니다. Python 도구를 실행하고, 연결된 캔버스 노드를 도구로 호출하고, [MCP](../tabs/mcp-tab.md) 서버에 연결하고, 스킬(지시 파일 및 선택적 Python 스크립트)을 사용하고, 다른 에이전트 노드에 위임하는 오케스트레이터 역할을 하고, 다른 Workflow를 도구로 호출할 수 있습니다. 출력은 `$nodeLabel.text`로 사용할 수 있습니다. 선택적 **Extra Body** 토글은 도구 호출 루프의 모든 요청에 제공자별 요청 파라미터의 JSON 객체를 첨부합니다. 기본값은 꺼짐입니다. 선택적 **Use Responses API** 토글은 에이전트의 모델 호출을 Responses API를 통해 라우팅하며, 이는 도구 호출 전반에 걸쳐 모델의 추론을 보존하므로 추론 모델이 다단계 루프를 거치는 동안 사고 연쇄를 유지합니다. 기본값은 꺼짐이며 OpenAI 및 사용자 정의 자격 증명과 함께 작동합니다.

캔버스 노드 도구를 사용하면 에이전트가 캔버스에서 직접 구성된 Workflow 노드를 호출할 수 있습니다. 지원되는 노드를 에이전트의 도구 핸들에 연결한 다음, 봇 아이콘으로 특정 필드를 에이전트 제공으로 표시하십시오. 해당 필드는 런타임에 도구 파라미터가 되며, 자격 증명과 표시되지 않은 필드는 노드 구성에 고정된 상태로 유지됩니다.

Skills 섹션에는 이제 새 스킬을 생성하기 위한 **AI Build**, 기존 스킬에 대한 인라인 AI 편집 액션, 스킬별 ZIP 다운로드, 그리고 런타임에 Heym Drive 파일을 읽어야 하는 스킬을 위한 선택적 **Enable Drive files** 스위치가 포함됩니다. Skill Builder 모달은 왼쪽에 채팅 대화를 스트리밍하고, 각 파인튜닝 코멘트와 함께 드래그 앤 드롭 파일을 받고, 오른쪽에 생성된 `SKILL.md` 및 `.py` 파일의 실시간 읽기 전용 미리보기를 표시하고, 해당 미리보기를 ZIP으로 다운로드할 수 있으며, 업로드된 파인튜닝 파일을 수동 업로드에 사용되는 것과 동일한 ZIP 수집 흐름을 통해 번들 스킬 자산으로 다시 저장합니다.

**[Agent Persistent Memory](./agent-persistent-memory.md)** 가 활성화되면 각 에이전트 노드는 자체 지식 그래프를 유지합니다. 팩트는 비어 있지 않을 때 시스템 Prompt에 로드되며, 성공적인 실행은 새로운 엔터티와 관계의 백그라운드 병합을 트리거합니다. 하위 에이전트는 별도의 그래프를 사용합니다. 그래프 대화 상자에서 읽기 전용 또는 읽기/쓰기 액세스로 에이전트의 그래프를 다른 에이전트(동일하거나 다른 Workflow)와 **공유**할 수 있습니다. 캔버스 브레인 컨트롤은 그래프 편집기를 엽니다.

Agent 노드는 [Human-in-the-Loop](./human-in-the-loop.md) 모드로 들어갈 수도 있습니다. 이 모드에서 에이전트는 `request_human_review` 도구를 받고, 특정 승인 필요 단계에서 일시 중지하고, 일회성 공개 검토 링크를 생성하고, 알림 흐름을 위한 `review` 캔버스 분기를 노출하고, 검토자가 Markdown 검토 텍스트를 수락, 편집 또는 거부할 때까지 대기할 수 있습니다. 노드의 HITL 필드는 언제 요청할지에 대한 승인 지침 역할을 하며, 검토자 대상 요약은 각 검토 요청에서 생성됩니다. [MCP](../tabs/mcp-tab.md) 도구의 경우, Heym은 모델을 사용하여 이러한 서면 지시를 `always`, `once`, 또는 `never`로 해석하므로, 자유 형식 승인 언어가 구체적인 런타임 정책에 매핑됩니다. 실행은 `pending`으로 표시되고 결정이 도착한 후 저장된 실행 스냅샷에서 재개되며, 이후 단계에서도 검토가 필요한 경우 동일한 에이전트 실행이 두 번 이상 일시 중지될 수 있습니다.

Agent 노드는 누적된 메시지 기록이 모델의 컨텍스트 윈도우의 80%에 근접하면 자동으로 압축합니다. 시스템 Prompt, 첫 번째 사용자 메시지, 가장 최근 사용자 메시지는 항상 보존되며, 그 사이의 모든 내용은 동일한 모델과 자격 증명을 사용하여 요약됩니다. 압축 이벤트는 Debug 패널, [Execution History](./execution-history.md), 그리고 [Traces](../tabs/traces-tab.md) 탭에서 확인할 수 있습니다.

[LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md), [File Generation](./file-generation.md)도 참조하십시오.
#### [Codex](../nodes/codex-node.md)

Codex 노드는 격리된 Heym workspace 내에서 OpenAI Codex CLI를 실행합니다. Codex credential(ChatGPT로 로그인하여 토큰당 API 비용 없이 구독을 사용하거나 access token을 붙여넣기), GitHub credential, repository URL, base branch, task prompt, publish mode(`diff_only` 또는 `draft_pr`), branch name, timeout을 받습니다. runner는 repository를 로컬에 clone하고, ChatGPT token bundle 또는 `CODEX_ACCESS_TOKEN`을 Codex 프로세스에만 전달하며, 구조화된 summary, validation notes, changed files, diff, usage metadata, 그리고 선택적 draft PR URL을 반환합니다.

Codex가 `needs_input`을 반환하면 workflow가 일시 중지되고 `question` branch가 노출됩니다. 해당 branch를 Slack, email 또는 다른 notification 노드에 연결하십시오. 공개 follow-up 링크는 답변이 제출된 후 저장된 execution snapshot을 재개합니다. Codex 노드는 AI Agent에 tool로 연결할 수도 있어, agent가 coding task를 위임할 수 있습니다. tool로 사용될 때 `needs_input` 결과는 workflow를 일시 중지하는 대신 agent에게 inline으로 반환됩니다.

[GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md), [Node Types](./node-types.md)도 참조하십시오.

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go 노드는 GitHub repository에 대해 OpenCode CLI(Go)를 실행합니다. 격리는 Codex 패턴을 따릅니다. 로컬에서는 host subprocess로 실행되며, Docker 배포에서는 workspace volume을 공유하는 hardened sibling container 내부에서 실행됩니다. OpenCode Go credential(선택적 base URL이 있는 gateway API key), GitHub credential, repository URL, base branch, task prompt, publish mode, branch name, timeout, 그리고 실시간 검색 가능한 model 목록에서 선택한 `opencode-go/<model>` model(내장 fallback 포함)을 받습니다. Heym은 모든 git/GitHub 작업을 host에서 수행하며 GitHub token을 sandbox 내부에 절대 두지 않습니다. OpenCode는 disk의 파일만 편집합니다. 노드는 구조화된 summary, validation notes, changed files, diff, 그리고 선택적 pull request URL을 반환합니다. AI Agent에 tool로 연결할 수 있습니다.

[Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md), [Node Types](./node-types.md)도 참조하십시오.

#### [LLM](../nodes/llm-node.md)

LLM 노드는 language model로 텍스트를 처리하거나 이미지를 생성합니다. text generation, vision(image input), image generation, structured JSON output, 지원되는 OpenAI 및 OpenAI 호환 endpoint에 대한 provider-native Batch API 실행, 그리고 호출을 Chat Completions 대신 Responses API로 라우팅하는 선택적 **Use Responses API** toggle(기본값 off, OpenAI 및 custom credential과 함께 작동하며 Batch mode와 결합할 수 없음)을 지원합니다. credential, model, system 및 user messages, temperature, max tokens를 구성하십시오. prompt에는 [Expression DSL](./expression-dsl.md)을 사용하십시오. batch mode에서 `userMessage`는 array로 resolve되어야 하며, 노드는 progress update와 함께 `batchStatus` branch를 emit하고, 최종 output에는 per-item batch 결과가 포함됩니다. 선택적 **Extra Body** toggle은 provider별 request parameter의 JSON object(예: `{"thinking": {"type": "disabled"}}`)를 각 API 호출에 첨부합니다. 기본값은 off입니다. 선택적 [Guardrails](./guardrails.md)는 호출 전에 안전하지 않은 콘텐츠를 차단합니다.

[Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md), [Expression Evaluation Dialog](./expression-evaluation-dialog.md)와 자연스럽게 어울립니다.

#### [Decision](../nodes/decision-node.md)

Decision 노드는 run의 state에 대해 decision model에 typed question을 질의하고, prose 대신 probability를 반환합니다. **State** 필드는 model이 읽어야 할 것을 담습니다. 단독 expression은 자체 type을 유지하므로 `$input`은 텍스트가 아닌 object를 전송합니다. 그리고 question 목록은 판단을 담습니다. Question은 세 가지 형태로 제공됩니다. **noul**은 조건이 성립하는지 여부를 답하고, **choice**는 사용자가 정의한 집합에서 하나의 option을 선택하여 전체 distribution을 반환하며, **score**는 state를 순서가 있는 level에 따라 평가하고 그 사이에 위치할 수 있습니다. Choice 및 score 답변은 confidence도 함께 전달하므로, [Switch](../nodes/switch-node.md)는 답변에 따라 route할 수 있고 [Condition](../nodes/condition-node.md)은 얼마나 확실했는지에 대해 gate할 수 있습니다. **Generate with AI**는 평범한 문장으로부터 state template과 question row를 초안하고, **Custom request body**는 contract가 다른 endpoint를 위해 직접 작성한 JSON을 전송합니다. provider response는 변경 없이 그대로 전달되며, 각 호출은 [Traces](../tabs/traces-tab.md)에 기록됩니다.

Decision Model credential이 필요하며, [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md), [Agent Node](../nodes/agent-node.md)와 자연스럽게 어울립니다.
#### [RAG / Vector Store](../nodes/rag-node.md)

RAG / Vector Store 노드는 검색 증강 생성(retrieval-augmented generation)을 위해 벡터 스토어에 문서를 삽입, upsert, 삭제 및 검색합니다. Database 드롭다운에서 백엔드를 선택합니다 — **Qdrant**(외부 서버) 또는 **Postgres (pgvector)**(Heym 자체 데이터베이스, 외부 서비스 불필요)이며, 기본값은 Qdrant입니다. [Vectorstores](../tabs/vectorstores-tab.md) 탭에서 벡터 스토어를 선택하고 작업을 insert, upsert, delete 또는 search로 설정하십시오. Upsert와 delete는 payload 내부에 저장된 고유 id로 문서를 지정합니다 — **Document ID Field**는 해당 필드의 이름을 지정하고(기본값 `doc_id`), **Document ID**는 그 값을 담습니다 — 따라서 문서는 여러분의 시스템이 이미 사용하는 id를 그대로 유지합니다. upsert는 일치하는 모든 point를 교체한 후 새 버전을 저장하며, delete는 일치하는 항목이 있었는지 보고합니다. 문서 메타데이터는 값에 표현식을 허용하므로 `{"url": "$start.url"}`은 실행이 생성한 값을 저장합니다. 검색은 메타데이터 필터, 선택적 **Hybrid Search**(벡터 유사도와 BM25 키워드 매칭을 융합하여 ID 및 에러 코드와 같은 정확한 용어를 시맨틱 매칭과 함께 검색) 및 선택적 Cohere reranking을 지원하며, [LLM](../nodes/llm-node.md) 또는 [Agent Node](../nodes/agent-node.md) 흐름에서 사용할 수 있도록 text, score, metadata, reranked 및 hybrid 플래그, count를 포함한 결과 배열을 반환합니다.

일반적인 다운스트림 노드는 [LLM](../nodes/llm-node.md)과 [Agent Node](../nodes/agent-node.md)이며, 벡터 스토어 설정은 [Vectorstores](../tabs/vectorstores-tab.md)에 있습니다.

#### [MCP Call Node](../nodes/mcp-call-node.md)

MCP Call 노드는 LLM이 어떤 도구를 호출할지 결정하지 않고 특정 [MCP](../tabs/mcp-tab.md) 도구를 직접 호출합니다. 설계 시점에 실행할 도구를 정확히 알고 있을 때 — Workflow에서 결정론적이고 단일 단계인 MCP 도구 실행이 필요할 때 사용하십시오. 연결(SSE, Streamable HTTP 또는 stdio, [Agent Node](../nodes/agent-node.md) MCP 연결과 동일한 필드)을 구성하고 **Fetch Tools**를 클릭하여 드롭다운을 채우고, 도구를 선택한 후 도구의 입력 스키마에서 자동 렌더링된 인수 필드를 채우십시오. 각 인수는 정적 값 또는 `$userInput.body.text`와 같은 [DSL expression](./expression-dsl.md)을 허용합니다. 결과는 `$nodeLabel.result`로 사용할 수 있습니다(파싱 가능하면 JSON 객체, 그렇지 않으면 문자열). MCP Call 노드는 캔버스 도구로 [Agent Node](../nodes/agent-node.md)에 연결할 수 없습니다.

[Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md), [Expression DSL](./expression-dsl.md)도 참조하십시오.

### Logic

#### [Condition](../nodes/condition-node.md)

Condition 노드는 if/else 표현식을 기반으로 Workflow를 분기합니다. 두 개의 출력 핸들이 있습니다. 하나는 조건이 truthy일 때, 다른 하나는 falsy일 때입니다. 조건 표현식에 [Expression DSL](./expression-dsl.md)의 비교 및 논리 연산자를 사용하십시오. 노드는 선택된 분기로 입력을 통과시킵니다.

[Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md), [Expression DSL](./expression-dsl.md)도 참조하십시오.

#### [Switch](../nodes/switch-node.md)

Switch 노드는 값을 case와 일치시켜 실행을 서로 다른 경로로 라우팅합니다. 평가할 표현식과 case 값 목록을 구성하십시오. 각 case는 소스 핸들을 가지며, 일치하지 않는 값에는 default 핸들이 사용됩니다. 입력은 일치된 분기로 통과됩니다.

이진 분기에는 [Condition](../nodes/condition-node.md)을, 라우팅된 경로를 다시 합치려면 [Merge](../nodes/merge-node.md)를 사용하십시오. 일치 규칙은 [Expression DSL](./expression-dsl.md)에서 다룹니다.

#### [Merge](../nodes/merge-node.md)

Merge 노드는 여러 병렬 입력을 기다렸다가 단일 출력으로 결합합니다. 기다릴 입력 수를 설정하십시오. 모든 분기가 완료되면 노드는 병합된 객체를 생성합니다. 계속 진행하기 전에 병렬 분기의 결과를 합치는 데 사용하십시오. 병렬 분기가 별도의 Output 노드에서 끝나는 경우에는 사용하지 마십시오.

분기를 재결합할 때는 [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md), [Output](../nodes/output-node.md)도 참조하십시오.

#### [Loop](../nodes/loop-node.md)

Loop 노드는 배열을 반복하며 각 항목에 대해 다운스트림 노드를 실행합니다. 진행하려면 반복 본문의 마지막 노드로부터의 back-connection이 필요합니다. 루프 본문 내부에서는 `item`, `index`, `total`, `isFirst`, `isLast`를 사용하십시오. 루프는 반복 경로와 완료 경로에 대해 별도의 출력을 가집니다.

반복적 Workflow를 위해 [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md), [Expression DSL](./expression-dsl.md)과 함께 사용하십시오.

### Data

#### [Set](../nodes/set-node.md)

Set 노드는 입력 데이터를 변환하고 사용자 정의 출력으로 매핑합니다. 각 값이 [Expression DSL](./expression-dsl.md) 표현식인 key-value 매핑을 정의하십시오. 대문자 변환, 부분 문자열, 연결, 난수 및 유사한 변환에 사용하십시오. 키로 출력에 접근하십시오(예: `$setNode.keyName`). 캔버스 노드 도구로 에이전트에 연결된 경우, 매핑 값을 에이전트 제공으로 표시하여 에이전트가 런타임에 채우도록 할 수 있습니다. 다른 Workflow를 호출하려면 대신 [Execute](../nodes/execute-node.md) 노드를 사용하십시오.

[Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md), [Expression DSL](./expression-dsl.md)도 참조하십시오.
#### [Converter](../nodes/converter-node.md)

Converter 노드는 코드를 작성하지 않고도 데이터를 여러 형식 간에 변환합니다. 텍스트 변환은 `csvToJson`(CSV 텍스트를 행 객체 배열로, 헤더가 없으면 배열로 변환), `jsonToCsv`(객체/행 배열을 CSV 텍스트로 변환), `xmlToJson`(XML 텍스트를 객체로 변환), `jsonToXml`(객체를 XML 텍스트로 변환)입니다. 변환 방향과 소스 표현식을 구성하십시오. CSV 변환은 추가로 구분자와 헤더 처리를 사용하며, `jsonToCsv`는 명시적인 열 순서를 고정할 수 있습니다. 인용, 포함된 구분자, 포함된 개행은 RFC 4180을 따릅니다. XML 속성은 `@` 접두사를 사용하고, 속성과 혼합된 텍스트는 `#text`를 사용하며, 반복되는 요소는 배열이 되고, XML 엔티티 확장은 비활성화됩니다. 동일한 노드는 저장된 파일에도 작동합니다. `imageToText`와 `pdfToText`는 Tesseract OCR을 실행하여 Heym Drive에서 파일을 읽고(File upload Trigger의 `$Upload.file.id`, Drive 노드 결과, 또는 에이전트가 생성한 파일), 감지된 문자 체계에서 언어를 자동으로 선택하거나 `tur` 또는 `eng+tur`와 같이 지정한 코드를 사용하며, 기본적으로 텍스트를 UTF-8로 정규화하고 선택적으로 NFC 정규화 및 `cp1254`와 같은 더 좁은 문자 집합을 사용합니다. `fileConvert`는 저장된 파일을 다른 형식으로 다시 작성하는데, 문서는 pandoc을 통해, 이미지는 Pillow를 통해 처리하며, 원본을 건드리지 않고 결과를 새 Drive 파일로 저장합니다. 결과는 `$converterNode.result`로 사용할 수 있으며, OCR 실행의 경우 `.language`, `.encoding`, `.page_count`, `.pages`, `.file`이 함께 제공되고, `fileConvert`의 경우 `.id`, `.filename`, `.download_url`이 제공됩니다.

[Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [Expression DSL](./expression-dsl.md)도 참조하십시오.

#### [Code](../nodes/code-node.md)

Code 노드는 직접 작성한 Python을 자체 `requirements.txt`와 함께 실행하며, 매 실행마다 생성되고 파괴되는 컨테이너에서 동작합니다. 코드는 `main(params)` 함수를 정의하고 JSON 직렬화 가능한 값을 반환하며, 이 값이 `$codeNode.result`가 됩니다. 출력하는 모든 내용은 별도로 `$codeNode.logs`로 캡처되고, `$codeNode.install`은 어떤 도구가 의존성을 설치했는지 보고합니다. 파라미터는 실행 전에 `$` 표현식이 해석되는 JSON 객체로 구성되며, 코드는 `params.user.name` 또는 `params.orders[0].id`와 같은 점 표기법으로 이를 읽습니다. 의존성은 `uv`로 설치하고, `uv`가 처리할 수 없는 패키지의 경우 `pip`로 대체하며, 실행 간 캐싱은 없습니다. `requirements.txt`를 비워 두면 설치를 완전히 건너뛰어 훨씬 빠릅니다. 실행 단계는 `codeAllowNetwork`가 켜져 있지 않으면 네트워크가 없지만, 의존성 설치는 항상 PyPI에 접근합니다. 샌드박스는 모든 capability를 제거한 비루트 권한으로 실행되며, 읽기 전용 루트 파일 시스템, Docker 소켓 없음, 백엔드 시크릿 접근 불가로 구성되고, 메모리 512 MB, CPU 1개, 프로세스 256개, 설치 120초, 실행 60초로 제한됩니다. Docker가 필요하며 대체 모드는 없습니다. 접근 가능한 데몬이 없으면 노드는 백엔드 프로세스에서 코드를 실행하는 대신 실패합니다.

#### [Variable](../nodes/variable-node.md)

Variable 노드는 Workflow 로컬 변수(`$vars.variableName`) 또는 영구 [전역 변수](./global-variables.md)(`$global.variableName`)를 설정하거나 업데이트합니다. 카운터, 누적 목록, 공유 상태에 사용하십시오. 변수 이름, 값 표현식, 타입 강제 변환, 전역 저장소에 저장할지 여부를 구성합니다. 배열 변수는 `$array()`와 `.add()`를 지원합니다.

[Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md), [Global Variables](./global-variables.md)와 함께 사용합니다.

#### [Execute](../nodes/execute-node.md)

Execute 노드는 다른 Workflow(하위 Workflow)를 호출하고 입력을 전달합니다. 대상 Workflow를 ID로 지정하고 단일 표현식 또는 키-값 매핑으로 입력을 제공하십시오. 출력에는 workflow_id, status, outputs가 포함됩니다. 데이터 변환에는 사용하지 말고(그 용도로는 Set을 사용하십시오) 재사용 가능한 로직에 사용하십시오.

Extract to Sub-Workflow에 대해서는 [Canvas Features](./canvas-features.md)를, 그리고 [Workflow Structure](./workflow-structure.md), [Output](../nodes/output-node.md)도 참조하십시오.

### Integrations

#### [HTTP](../nodes/http-node.md)

HTTP 노드는 cURL 스타일 구성으로 HTTP 요청을 수행합니다. Workflow 시작점(들어오는 엣지 없음)이 될 수도 있고, 업스트림 노드로부터 입력을 받을 수도 있습니다. 응답은 status, headers, body(해당되는 경우 파싱된 JSON)로 사용할 수 있습니다. Bearer 또는 사용자 정의 헤더 인증에는 [Credentials](./credentials.md)를 사용하십시오.

[Webhooks](./webhooks.md), [Credentials](./credentials.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.

#### [WebSocket Send](../nodes/websocket-send-node.md)

WebSocket Send 노드는 아웃바운드 클라이언트 연결을 열고, 하나의 텍스트/JSON/바이너리 메시지를 전송한 뒤 닫습니다. Heym이 호스팅하는 소켓 Endpoint를 만들지 않고도 Workflow 출력을 실시간 시스템에 게시할 때 사용하십시오.

[WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md), [Third-Party Integrations](./integrations.md)도 참조하십시오.
#### [Telegram](../nodes/telegram-node.md)

Telegram 노드는 채팅, 그룹 또는 채널로 봇 메시지를 전송합니다. Telegram [credential](./credentials.md)을 구성하고 `chatId`를 설정한 다음, [Expression DSL](./expression-dsl.md) 표현식으로 발신 `message`를 작성하십시오. 대화형 Workflow를 위한 [Telegram Trigger](../nodes/telegram-trigger-node.md) 및 운영자 알림을 위한 [Error Handler](../nodes/error-handler-node.md)와 자연스럽게 조합됩니다.

설정 및 credential 패턴에 대해서는 [Third-Party Integrations](./integrations.md) 및 [Credentials](./credentials.md)를 참조하십시오.

#### [Slack](../nodes/slack-node.md)

Slack 노드는 Incoming Webhook을 통해 Slack 채널로 메시지를 전송합니다. Slack [credential](./credentials.md)과 메시지 표현식을 구성하십시오. 알림, 경고 및 오류 보고에 사용하며, 출력은 입력을 그대로 전달합니다.

[Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) 및 [Third-Party Integrations](./integrations.md)와 조합됩니다.

#### [Discord](../nodes/discord-node.md)

Discord 노드는 Incoming Webhook을 통해 Discord 채널로 메시지를 전송합니다. Discord [credential](./credentials.md)을 구성하고, [Expression DSL](./expression-dsl.md)로 발신 메시지를 작성하며, 선택적으로 webhook 사용자 이름 또는 아바타 재정의를 설정하십시오.

[Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) 및 [Third-Party Integrations](./integrations.md)와 조합됩니다.

#### [Send Email](../nodes/send-email-node.md)

Send Email 노드는 SMTP를 통해 이메일을 전송합니다. SMTP [credential](./credentials.md)과 수신자, 제목 및 본문에 대한 [Expression DSL](./expression-dsl.md) 표현식을 구성하십시오. 알림, 경고 및 트랜잭션 이메일에 사용합니다. 출력에는 status, to 및 subject가 포함됩니다.

[IMAP Trigger](../nodes/imap-trigger-node.md)는 수신 메일을 처리하여 Send Email을 보완합니다. 이 둘을 함께 사용하면 Workflow가 공유 받은 편지함에서 수신 이메일을 읽고, AI 노드로 요약 또는 분류한 후, 후속 또는 에스컬레이션 메시지를 전송할 수 있습니다. [Telegram Trigger](../nodes/telegram-trigger-node.md)와 [Telegram 노드](../nodes/telegram-node.md)는 봇 기반 채팅 Workflow에 대해 동일한 수신/발신 패턴을 제공합니다.

양방향 알림 흐름의 경우 [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) 및 [Third-Party Integrations](./integrations.md)와도 잘 조합됩니다.

#### [Redis](../nodes/redis-node.md)

Redis 노드는 Redis 작업(set, get, hasKey, deleteKey)을 수행합니다. 캐싱, 속도 제한 및 키-값 저장에 사용합니다. [credential](./credentials.md), 작업 유형, 키 표현식을 구성하고, set 작업의 경우 값과 선택적 TTL을 설정하십시오. 출력은 작업에 따라 달라집니다(value, success, exists, deleted).

캐싱, 스로틀링 및 조정을 위해 [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) 및 [Parallel Execution](./parallel-execution.md)과 조합됩니다.

#### [Grist](../nodes/grist-node.md)

Grist 노드는 Grist 스프레드시트의 데이터를 읽고, 쓰고, 관리합니다. 작업에는 getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables 및 listColumns가 포함됩니다. 문서 ID, 테이블 ID를 제공하고, create/update의 경우 열 ID를 사용하여 레코드 데이터를 제공하십시오. CRUD, 일괄 업데이트 및 스프레드시트 자동화에 사용합니다.

[Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) 및 [Third-Party Integrations](./integrations.md)도 참조하십시오.

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets 노드는 OAuth2를 통해 스프레드시트 데이터를 읽고, 쓰고, 관리합니다. Workflow 내에서 보고서를 읽고, Workflow 결과를 추가하고, 트래커를 업데이트하며, 시트 탭을 지우거나 검사하는 데 사용합니다. [BigQuery](../nodes/bigquery-node.md)와 마찬가지로 Google 기반 통합 credential을 사용하며, 스프레드시트 데이터가 흐름의 일부일 때 [Grist](../nodes/grist-node.md)와 잘 어울립니다.

[Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) 및 [Third-Party Integrations](./integrations.md)와 조합됩니다.

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery 노드는 OAuth2를 통해 SQL 쿼리를 실행하고 Google BigQuery 데이터셋에 행을 삽입합니다. 분석 Workflow, 보고 파이프라인 및 Workflow 실행에서 구조화된 이벤트 데이터를 기록하는 데 유용합니다. 행을 구성하기 위한 [Set](../nodes/set-node.md) 및 보다 가벼운 스프레드시트 지향 보고를 위한 [Google Sheets](../nodes/google-sheets-node.md)와 자주 조합됩니다.

[Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) 및 [Third-Party Integrations](./integrations.md)와 조합됩니다.
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive 노드는 OAuth2를 통해 Drive 파일과 폴더를 나열, 다운로드, 업데이트, 삭제하며, `syncToHeymDrive` 작업으로 Drive 파일을 [Heym Drive](../nodes/drive-node.md)로 곧바로 복사할 수 있습니다. Google Docs, Sheets, Slides는 다운로드 가능한 바이트가 없으므로 노드가 자동으로 내보냅니다 — Docs는 PDF로, Sheets는 XLSX로, Slides는 PPTX로 — 대상 형식은 재정의할 수 있습니다. 삭제는 "Delete permanently"가 활성화되지 않은 한 항목을 Drive 휴지통으로 이동시키며, 노드는 파일 작업을 통해 폴더를 삭제하거나 그 반대의 경우를 거부합니다. [Google Sheets](../nodes/google-sheets-node.md)와 마찬가지로 Google 기반 OAuth2 credential을 사용합니다. 단, 이 credential은 전체 Drive 액세스를 요청하므로 공유하기 전에 [Credential Sharing](./credentials-sharing.md)을 검토하십시오.

[Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.

#### [GitHub](../nodes/github-node.md)

GitHub 노드는 리포지토리, 조직 및 사용자, 이슈, pull request, 리뷰, 릴리스, Actions workflow, 트래픽 인사이트, 리포지토리 파일을 아우르는 40개의 네이티브 GitHub REST 작업을 제공합니다. HTTP 요청을 직접 구성하지 않고도 이슈 트리아지, 리뷰 자동화, workflow 디스패치 및 완료 대기, 릴리스 자동화, 리포지토리 파일 업데이트에 사용할 수 있습니다. GitHub.com과 credential의 선택적 GitHub Enterprise `base_url`을 지원합니다.

[Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.

#### [Jira](../nodes/jira-node.md)

Jira 노드는 workflow를 Jira Cloud 또는 Jira Data Center / Server REST API에 연결하여 프로젝트, 이슈, 댓글, 첨부 파일, 사용자, 알림, 전환 자동화를 수행합니다. 프로젝트 나열, JQL로 이슈 검색, 이슈 생성 또는 업데이트, 변경 로그 조회, 이해관계자 알림, 댓글 및 첨부 파일 관리, 사용자 조회 또는 관리, 사용 가능한 전환 나열, 전환 ID를 통한 이슈 이동이 가능합니다. Atlassian 이메일, API token, 사이트 base URL, 배포 모드를 포함한 Jira credential을 사용하십시오.

지원 접수, 버그 트리아지, 릴리스 workflow를 위해 [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.

#### [Linear](../nodes/linear-node.md)

Linear 노드는 workflow를 Linear의 GraphQL API에 연결하여 워크스페이스 및 이슈 자동화를 수행합니다. 팀, 프로젝트, 이슈, workflow 상태, 팀 멤버, 댓글을 나열하고, 이슈를 생성, 업데이트, 삭제, 연결하며, 댓글을 생성, 업데이트, 해결, 미해결 처리, 삭제할 수 있습니다. Linear personal API key 또는 OAuth2 credential을 사용한 다음, 이슈를 생성하거나 업데이트하기 전에 목록 작업에서 팀, 프로젝트, 상태, 담당자 UUID를 확인하십시오.

접수, 트리아지, 엔지니어링 백로그 workflow를 위해 [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.

#### [Supabase](../nodes/supabase-node.md)

Supabase 노드는 Supabase PostgREST를 통해 노출된 테이블을 읽고 변경합니다. 커스텀 HTTP 요청 배선 없이 데이터베이스 액세스를 원하는 제품 백엔드, 사용자/프로필 데이터, workflow 상태, CRUD 스타일 자동화에 적합합니다.

[Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse 노드는 HTTP 인터페이스를 통해 외부 ClickHouse 데이터베이스에 대해 CRUD, count, 원시 SQL 작업을 실행합니다. 분석 파이프라인, 이벤트 로깅, 리포팅 workflow에 적합합니다. 이벤트가 발생하는 대로 삽입한 다음 `query`/`count`로 집계하거나 개수를 셀 수 있습니다. [DataTable](../nodes/datatable-node.md) 작업 집합(find, getAll, count, getById, insert, update, remove, upsert)을 그대로 반영하며 원시 SQL 이스케이프 해치를 추가로 제공하고, `update`/`remove`는 ClickHouse mutation으로 실행됩니다.

[Set](../nodes/set-node.md), 예약 리포트를 위한 [Cron](../nodes/cron-node.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.

#### [Notion](../nodes/notion-node.md)

Notion 노드는 현재 Notion API(`2026-03-11`)를 통해 Notion 데이터베이스, 데이터 소스, 페이지, 블록을 관리합니다. 검색, 페이지 CRUD, 데이터베이스 및 데이터 소스 작업, 블록 자식, 블록 추가/업데이트/삭제, 휴지통 이동/복원을 지원합니다. internal integration token 또는 Notion public integration OAuth credential을 사용하십시오. 편집기에서 액세스 가능한 데이터 소스와 상위 페이지를 검색하고 커서 페이지네이션할 수 있습니다. 공유 credential은 workflow 실행 시 소유 credential과 동일하게 작동합니다.

커스텀 REST 호출의 경우 `$credentials.YourNotionCredential`이 동일한 bearer token으로 확인됩니다. [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.
#### [Sentry](../nodes/sentry-node.md)

Sentry 노드는 Sentry REST API를 통해 Sentry 조직, 프로젝트, 팀, 이슈, 이벤트, 릴리스를 자동화합니다. 알림 트리아지, 이슈 상태 업데이트, 릴리스 자동화, 이벤트 조회, 프로젝트/팀 설정 또는 정리에 사용하십시오. 선택적 credential base URL을 통해 Sentry SaaS와 자체 호스팅 Sentry를 지원합니다.

인시던트 및 릴리스 Workflow를 위해 [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.

#### [DataTable](../nodes/datatable-node.md)

DataTable 노드는 Heym DataTables(자사 구조화 스토리지)의 데이터를 읽고, 쓰고, 관리합니다. 작업에는 find, getAll, getById, insert, update, remove, upsert가 포함됩니다. 외부 credential은 필요하지 않습니다. 테이블은 [DataTable](../tabs/datatable-tab.md) 대시보드 탭에서 관리되며 Workflow 소유자가 직접 접근합니다.

자사 구조화 스토리지를 위해 [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [DataTable 탭](../tabs/datatable-tab.md)과 함께 사용합니다.

#### [Drive](../nodes/drive-node.md)

Drive 노드는 Workflow 내에서 직접 스킬이 생성한 파일을 관리합니다. 작업에는 delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams, unshareWithMyTeams가 포함되며 읽기 전용 팀 접근을 관리합니다. 형식 변환은 대신 [Converter](../nodes/converter-node.md) 노드에서 처리합니다. 파일은 `$agentLabel._generated_files[0].id`로 참조하십시오. 출력에는 status, file_id, 링크 제약 조건을 위한 업데이트된 download_url, 팀 공유를 위한 shared_team_count가 포함됩니다. 이는 [File Generation](./file-generation.md)과 [Drive](./drive.md) 참조 모델을 사용하는 [Agent Node](../nodes/agent-node.md) Workflow에서 특히 유용합니다.

일반적인 동반 노드는 [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md), [Drive](./drive.md)입니다.

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 노드는 `s3` credential(access key, secret key, region, 선택적 session token)을 사용하여 Amazon S3에서 객체 스토리지 작업을 실행합니다. 작업에는 putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder, listBuckets가 포함됩니다. 텍스트 업로드와 텍스트 또는 base64 다운로드가 지원되며, bucket 및 key 필드는 [Expression DSL](./expression-dsl.md)을 허용합니다. Workflow 출력을 저장하고, 파일을 아카이빙하고, 객체를 다시 흐름으로 읽어들이는 데 사용하십시오.

[Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md), [Third-Party Integrations](./integrations.md)와 함께 사용합니다.

### Automation

#### [Crawler](../nodes/crawler-node.md)

Crawler 노드는 FlareSolverr를 사용하여 웹 페이지를 스크래핑하며, 선택적으로 CSS 선택자를 통한 HTML 추출을 지원합니다. FlareSolverr [credential](./credentials.md), URL 표현식, 대기 시간, 추출을 위한 선택적 선택자를 구성하십시오. 출력은 원시 HTML 또는 추출된 콘텐츠입니다. 웹 스크래핑 및 콘텐츠 추출에 사용하십시오.

스크래핑 후 분석 흐름을 위해 [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md), [LLM](../nodes/llm-node.md)과 함께 사용합니다.

#### [Playwright](../nodes/playwright-node.md)

Playwright 노드는 구성 가능한 단계(navigate, refresh, click, type, screenshot, extract, aiStep) 또는 사용자 정의 Playwright Python을 위한 **Run Code** 모드(샌드박스 처리됨, `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`를 통해 기본적으로 비활성화됨)로 브라우저 상호작용을 자동화합니다. 헤드리스 모드, 일반적인 Playwright 자동화 신호를 줄이는 선택적 설정, 타임아웃, 선택적 네트워크 캡처(responses, cookies, localStorage, sessionStorage), `$global.authState`와 같은 [Global Variables](./global-variables.md) 표현식으로부터의 cookie/storageState 인증 부트스트랩, 인증 복원 실패 시 대체 로그인 단계, 선택자 실패 시 Auto Heal을 사용하는 AI 단계를 지원합니다. 웹 스크래핑, 양식 작성, 브라우저 기반 Workflow에 사용하십시오.

브라우저 자동화 및 디버깅에 대해서는 [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md), [Execution History](./execution-history.md)를 참조하십시오.

### Utilities

#### [Output](../nodes/output-node.md)

Output 노드는 호출자에게 응답을 반환하는 Workflow endpoint입니다. message 표현식을 설정하여 레이블로 이전 노드를 참조하십시오(여기서 [Input](../nodes/input-node.md) 노드의 `$input`을 절대 사용하지 마십시오). 선택적 async downstream을 사용하면 응답이 전송된 후 output 이후의 노드가 백그라운드에서 실행될 수 있습니다.

일반적인 업스트림 소스는 [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Execute](../nodes/execute-node.md)이며, 응답 형태 조정은 [Expression Evaluation Dialog](./expression-evaluation-dialog.md)에서 디버깅하기 더 쉽습니다.

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper 노드는 [Set](../nodes/set-node.md) 스타일의 키-값 매핑으로부터 일반 JSON 객체를 생성하고 이를 Workflow 응답의 루트에서 반환합니다. API 호출자가 표준 [Output](../nodes/output-node.md) 노드 래퍼 대신 원시 JSON 본문을 받아야 할 때 사용하십시오.
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

HTML output mapper 노드는 단일 HTML 템플릿을 렌더링하며, `$nodeLabel.field` 표현식을 페이지에 보간합니다. 이것이 워크플로우의 유일한 종료 노드인 경우, execute webhook은 JSON 본문 대신 `text/html`과 노드에 구성된 상태 코드로 응답하므로, 워크플로우가 브라우저에 페이지를 직접 제공할 수 있습니다. 디버깅을 위해 일반적인 JSON envelope을 받으려면 `X-Simple-Response: false`를 전송하십시오.

[Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md), [Webhooks](./webhooks.md)와 함께 사용합니다.

#### [Chart Output](../nodes/chart-output-node.md)

Chart Output 노드는 [Dashboard](../tabs/dashboard-tab.md) 위젯 워크플로우의 종료 노드입니다. 상위 노드에서 생성된 행을 대시보드가 렌더링하는 표준화된 차트 payload로 변환합니다. `chartType`(bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, Gantt, entity relationships, text 또는 HITL)을 선택하고, `labelField`/`valueField`(또는 다중 시리즈의 경우 `series`, markdown 메시지의 경우 `text`)를 매핑한 후 마지막에 배치하십시오. 출력 엣지가 없습니다. HITL은 상위 행을 무시하고 대기 중인 사람 검토 목록을 표시합니다. 다른 하나는 새 탭에서 URL을 여는 링크 버튼으로 렌더링할 수 있습니다(`linkColumn`, 버튼 텍스트의 경우 `linkLabel` 사용)

[Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md), [Output](../nodes/output-node.md)도 참조하십시오.

#### [Wait](../nodes/wait-node.md)

Wait 노드는 워크플로우 실행을 지정된 시간(밀리초) 동안 최대 15분까지 일시 중지합니다. 속도 제한, 지연 작업 또는 폴링 간격에 사용하십시오. 입력을 변경하지 않고 그대로 전달합니다.

페이싱과 폴링을 위해 [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md), [Parallel Execution](./parallel-execution.md)과 함께 사용합니다.

#### [Sticky Note](../nodes/sticky-note-node.md)

Sticky Note 노드는 캔버스에 markdown 노트를 추가합니다. 실행되지 않습니다. 다른 [Canvas Features](./canvas-features.md)와 함께 문서화, 지침 또는 워크플로우 노트로 사용하십시오. 캔버스를 더블 클릭하여 노트 내용을 편집하십시오.

[Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md), [Workflow Organization](./workflow-organization.md)도 참조하십시오.

#### [Console Log](../nodes/console-log-node.md)

Console Log 노드는 값을 백엔드(서버) 콘솔에 로그로 기록합니다. 개발 중 디버깅과 검사에 사용하십시오. 로그 메시지는 [Expression DSL](./expression-dsl.md) 표현식을 지원하며, 출력은 입력을 그대로 전달합니다.

디버깅을 위해 [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), [Expression Evaluation Dialog](./expression-evaluation-dialog.md)와 함께 사용합니다.

#### [Disable Node](../nodes/disable-node.md)

Disable Node 노드는 워크플로우 내 다른 노드의 `active` 플래그를 false로 설정하여 영구적으로 비활성화합니다. 대상 노드를 레이블로 지정하십시오. 조건이 충족된 후 [Cron](../nodes/cron-node.md) trigger를 중지하는 것과 같은 일회성 작업에 사용하십시오.

워크플로우 제어 패턴에 대해서는 [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), [Cron](../nodes/cron-node.md)도 참조하십시오.

#### [Enable Node](../nodes/enable-node.md)

Enable Node 노드는 다른 노드의 `active` 플래그를 true로 설정하고 변경 사항을 저장하여 다시 켭니다. 대상 노드를 레이블로 지정하십시오. 다른 진입점에서 비활성화된 [Cron](../nodes/cron-node.md) trigger를 다시 활성화하거나, 조건이 충족되면 노드를 켜는 데 사용하십시오. Enable Node의 하위에 위치하며 아직 실행되지 않은 대상도 현재 실행에서 실행됩니다.

워크플로우 제어 패턴에 대해서는 [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md), [Cron](../nodes/cron-node.md)도 참조하십시오.

#### [Throw Error](../nodes/throw-error-node.md)

Throw Error 노드는 워크플로우 실행을 즉시 중지하고 사용자 지정 HTTP 상태 코드와 함께 오류 응답을 반환합니다. 오류 메시지 표현식과 상태 코드(예: 400, 401, 403, 404, 429, 500)를 설정하십시오. 검증 실패, 권한 없는 접근 또는 기타 오류 조건에 사용하며, 특히 [Condition](../nodes/condition-node.md) 및 [Error Handler](../nodes/error-handler-node.md)와 함께 사용할 때 유용합니다.

명시적 실패 경로를 위해 [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md), [Security](./security.md)와 함께 사용합니다.

---

## Reference
### [노드 유형](./node-types.md)

Heym은 다양한 노드 유형을 제공합니다. [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Error Handler](../nodes/error-handler-node.md)와 같은 Trigger 노드, [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md), [MCP Call](../nodes/mcp-call-node.md)과 같은 AI 노드, [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md)와 같은 로직 노드, [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md), [Heym](../nodes/heym-node.md)과 같은 데이터 노드, [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md), [Drive](../nodes/drive-node.md)와 같은 통합 노드, [Crawler](../nodes/crawler-node.md), [Playwright](../nodes/playwright-node.md)와 같은 자동화 노드, 그리고 [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md), [Sticky Note](../nodes/sticky-note-node.md)와 같은 유틸리티 노드가 있습니다. 노드 구성에서는 `$input.text` 및 `$nodeLabel.field`와 같은 표현식을 사용하십시오.

[Triggers](./triggers.md), [Third-Party Integrations](./integrations.md), [Parallel Execution](./parallel-execution.md) 문서도 참조하십시오.

### [Expression DSL](./expression-dsl.md)

Heym은 상위 노드의 데이터를 참조하기 위해 간단한 표현식 언어를 사용합니다. [Input](../nodes/input-node.md) 노드에는 `$input`을, 모든 상위 노드에는 `$nodeLabel.field`를, [credentials](./credentials.md)에는 `$credentials.CredentialName`을, [global variables](./global-variables.md)에는 `$global.variableName`을 사용하십시오. 내장 특수 변수로는 `$now`, `$UUID`, 그리고 workflow 메타데이터인 `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl`, `$executionId`(해당 실행의 [Execution History](./execution-history.md) id — `/workflows/{id}/{executionId}`는 캔버스에서 해당 실행을 엽니다. 런타임 전용이며 표현식 미리보기 대화상자에서는 비어 있음)가 있습니다. 리터럴, 산술, 비교, [Loop](../nodes/loop-node.md) 컨텍스트, 중첩 필드, 문자열/배열 헬퍼(JSON 문자열을 파싱하는 `$text.toJson()` 포함)를 지원합니다. 전체 값이 단일 `$expr`인 경우 백엔드는 배열, 객체, 불리언, 숫자를 네이티브 타입으로 보존합니다.

[Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md), [Workflow Structure](./workflow-structure.md) 문서도 참조하십시오.

### [Global Variables](./global-variables.md)

Global Variable Store는 workflow 실행 전반에 걸쳐 유지되는 영구적이고 사용자 범위의 키-값 데이터를 보관합니다. [Variables](../tabs/global-variables-tab.md) 탭이나 "Store in Global Variable Store"가 활성화된 [Variable](../nodes/variable-node.md) 노드에서 변수를 생성하십시오. 표현식에서 `$global.variableName`으로 접근할 수 있으며, 다른 사용자나 [teams](./teams.md)와 공유할 수 있습니다.

공유 workflow 상태를 위해 [Variable](../nodes/variable-node.md), [Teams](./teams.md), [Credentials Sharing](./credentials-sharing.md)과 함께 사용하십시오.
### [Expression Evaluation Dialog](./expression-evaluation-dialog.md)

Expression Evaluation Dialog는 표현식 필드 옆의 확장 버튼을 클릭하면 나타나는 확장 가능한 편집기입니다. 화면 중앙에 큰 모달로 열리며, 자동 완성이 활성화된 상태로 유지되고, 입력을 멈추면 백엔드 미리보기 출력이 자동으로 갱신됩니다. 객체 및 배열 결과는 출력 경로 선택기로 탐색할 수 있습니다. 이 대화상자는 전체 줄로 된 순수 점 경로(예: `myNode.output.field`)를 마치 `$myNode.output.field`인 것처럼 허용합니다. 배치 규칙은 [Expression DSL](./expression-dsl.md)을 참조하십시오.

툴바의 **Build with AI** 버튼을 사용하면 원하는 표현식을 일반 텍스트로 설명할 수 있습니다. LLM [credential](./credentials.md)과 모델을 선택하고, *"Get the customer name from the API response"*와 같은 설명을 입력한 뒤 Generate를 클릭하십시오. 백엔드는 [Expression DSL](./expression-dsl.md) 컨텍스트와 마지막 실행 노드 출력을 모델에 전송하고 단일 표현식 문자열을 반환합니다. 결과는 즉시 평가되므로 Apply를 클릭하기 전에 검증할 수 있습니다.

[Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md)와 자연스럽게 함께 사용됩니다.

### [Workflow Structure](./workflow-structure.md)

Workflow는 노드와 엣지로 구성된 JSON으로 저장됩니다. Workflow 객체에는 id, name, description, nodes, edges, auth 설정이 포함됩니다. 각 노드에는 id, type, position, data(레이블 및 유형별 설정)가 있습니다. 엣지는 소스 및 대상 노드 ID를 선택적 핸들 ID와 함께 연결합니다. data 필드의 표현식 구문은 [Expression DSL](./expression-dsl.md)을 따르며, 이와 동일한 형태가 [Download & Import](./download-import.md)에서 사용됩니다.

[Node Types](./node-types.md), [Expression DSL](./expression-dsl.md), [Download & Import](./download-import.md)도 참조하십시오.

### [Canvas Features](./canvas-features.md)

Sticky가 아닌 캔버스 노드 위에 마우스를 올리고 **Run**을 클릭하면 해당 노드까지 실행됩니다. 필수 입력이 있는 경우 Run 패널이 열리며 첫 번째 필드에 포커스가 맞춰지고, 입력이 없는 경로는 즉시 시작됩니다. [Run to Node](./canvas-features.md#run-to-node)를 참조하십시오.

Workflow 편집기는 Data Pin(다시 실행하지 않고 다운스트림을 테스트하기 위해 노드의 마지막 출력을 고정), Execution Logs([Execution History](./execution-history.md)를 보완하는 실시간 노드 결과 및 에이전트 진행 상황), Enable/Disable(실행 중 노드 건너뛰기), Extract to Sub-Workflow(선택 항목을 새 Workflow로 이동하고 [Execute](../nodes/execute-node.md) 노드로 대체)를 제공합니다. 실행 중인 프로덕션 실행은 History 또는 Board 카드에서 열 수 있으며, 편집기는 현재 스냅샷을 복원하고 SSE에 연결하여 캔버스 애니메이션과 Debug 로그를 실시간으로 유지합니다. [Keyboard Shortcuts](./keyboard-shortcuts.md)는 복사, 붙여넣기, 실행, 인라인 노드 검색을 지원합니다.

[Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md), [Execution History](./execution-history.md)도 참조하십시오.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym은 편집기 전반에 걸쳐 단축키를 제공합니다: Command Palette(Ctrl+K), Run(Ctrl+Enter), Save(Ctrl+S), Undo/Redo, 그리고 Escape로 닫기. 캔버스에서는 전체 선택, 다중 선택, 복사/잘라내기/붙여넣기, 삭제, 노드 활성화 토글(D), 고정 데이터 토글(P), 입력을 통한 인라인 노드 검색을 사용할 수 있습니다. 단축키는 인앱 레퍼런스에 문서화되어 있으며 Data Pin 및 노드 활성화/비활성화와 같은 [Canvas Features](./canvas-features.md)와 긴밀하게 연동됩니다.

[Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md), [Contextual Showcase](./contextual-showcase.md)도 참조하십시오.

### [AI Assistant](./ai-assistant.md)

AI Assistant는 Debug 패널에서 열리는 채팅 패널로, 자연어로 Workflow를 생성하거나 수정할 수 있습니다. [credential](./credentials.md)과 모델을 선택한 뒤 원하는 내용을 설명하십시오. AI가 응답을 스트리밍하고, 코드 블록에 포함된 유효한 [workflow JSON](./workflow-structure.md)은 자동으로 파싱되어 캔버스에 적용됩니다. 호환 브라우저에서는 음성 입력이 지원됩니다.

**YOLO mode**(Agent mode, 기본값 꺼짐)를 켜면 어시스턴트가 빌드한 내용을 테스트합니다. 각 변경 후 캔버스에서 Workflow를 실행하고, 결과를 읽고, 요청한 대로 동작할 때까지 Workflow를 수정하며, 메시지당 최대 5회 실행합니다. 첫 실행 전에 테스트 입력을 요청하고, 다른 Workflow의 결과가 필요할 때 해당 Workflow를 실행할 수 있으며, 작업하는 각 단계를 표시합니다. [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode)를 참조하십시오.

캔버스의 노드 위에 있는 **AI**를 클릭하여 해당 노드만 변경하거나 수정할 수 있습니다. 패널에는 수정 중인 노드가 표시되며(실행 후 최신 결과 포함) **Change this node as ...**, **Fix error in this node ...**, **Other**를 제공합니다. 해당 노드만 업데이트되며 나머지 워크플로우와 레이아웃은 그대로 유지됩니다. [AI Assistant › 단일 노드 변경](./ai-assistant.md#changing-one-node)을 참조하세요.

Workflow가 레코드를 저장할 때 어시스턴트는 사용할 [data table](../tabs/datatable-tab.md)을 묻거나, Workflow에 필요한 컬럼으로 새로 생성합니다. [AI Assistant › Data tables](./Chat 및 MCP `heym_chat`은 소유자 또는 쓰기 권한을 사용하여 열과 행을 직접 편집할 수도 있으며, 열 제거 또는 모든 행 지우기 전에 확인을 요청합니다. Chat 및 MCP `heym_chat`은 소유자 또는 쓰기 권한을 사용하여 열과 행을 직접 편집할 수도 있으며, 열 제거 또는 모든 행 지우기 전에 확인을 요청합니다. ai-assistant.md#data-tables)를 참조하십시오.

현재 Workflow에 [Agent Node](../nodes/agent-node.md) 스킬이 포함된 경우, 어시스턴트는 각 스킬의 `SKILL.md`만 Workflow 컨텍스트로 전송합니다. 첨부된 `.py` 파일과 바이너리 스킬 자산은 요청 전에 제외되므로, 대용량 스킬 번들이 모델 컨텍스트 윈도우를 초과하지 않습니다.

[Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md), [Expression DSL](./expression-dsl.md)과 잘 어울립니다.
### [Chat with Heym](./chat-with-heym.md)

Chat with Heym은 제품 관련 질문에 답하는 문서 헤더 어시스턴트입니다. 중앙 대화 상자에서 열리며, credential 및 모델 선택 항목을 상단에 항상 표시하고, 활성 문서 페이지 경로를 컨텍스트로 주입하며, 대화 상자를 닫으면 메시지 기록을 지웁니다. 이는 더 광범위한 [AI Assistant](./ai-assistant.md)와 더 가벼운 [Contextual Showcase](./contextual-showcase.md)를 보완합니다.

[AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md), [Node Types](./node-types.md)도 참조하십시오.

### [Workflow Organization](./workflow-organization.md)

인스턴스 관리자(`HEYM_ADMIN_EMAILS`)는 모든 workflow에 접근하고 편집할 수 있으며, 이메일로 소유자의 workflow를 찾고, 스케줄과 실행 기록을 검사하며, 자동 Trigger를 일시 중지 및 재개하고, 실행이 정리된 후 workflow를 삭제할 수 있습니다. 오프보딩 흐름과 자동 Trigger 일시 중지와 모든 호출 차단의 차이점은 [Instance Administration](../tabs/workflows-tab.md#instance-administration)을 참조하십시오.

Workflow는 트리 구조의 폴더와 하위 폴더로 구성할 수 있습니다. 폴더에는 이름과 선택적 상위 폴더가 있으며, workflow는 폴더에 할당됩니다. Workflow는 삭제 예약(영구 제거 전 휴지통 영역으로 이동)할 수 있습니다. API는 생성, 업데이트, 삭제, 폴더 간 workflow 이동을 지원하며, 동일한 구성 모델이 [Workflows](../tabs/workflows-tab.md) 탭에 나타납니다.

[Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md), [Edit History](./edit-history.md)도 참조하십시오.

### [Quick Drawer](./quick-drawer.md)

Quick Drawer는 내부 비캔버스 페이지를 위한 고정된 오른쪽 빠른 실행 패널입니다. 편집기를 열지 않고도 [workflows](../tabs/workflows-tab.md)를 검색하고, 즐겨찾기를 고정하고, 입력을 선택하고, 즉시 실행하며, 진행 상황이나 결과를 검사할 수 있습니다. [File Upload Trigger](../nodes/file-upload-trigger-node.md)가 있는 workflow는 드롭하거나 선택한 파일을 받습니다. 고정 순서와 마지막으로 선택한 workflow는 브라우저에 저장됩니다.

[Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md), [Execution History](./execution-history.md)도 참조하십시오.

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase는 대시보드 탭, [Evals](../tabs/evals-tab.md), Docs, workflow 편집기와 같은 인증된 주요 화면을 위한 간결한 인앱 가이드 레일입니다. 기본적으로 닫혀 있으며, 먼저 짧은 페이지 요약을 제공하고, 요청 시 약간 더 자세한 내용을 제공하며, 더 깊은 안내가 필요할 때 전체 문서 문서로 연결합니다.

인앱 안내 흐름을 위해 [Chat with Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md), [AI Assistant](./ai-assistant.md)와 함께 사용됩니다.

### [Credentials](./credentials.md)

Credentials는 workflow 노드에서 사용하는 API 키와 secret을 저장합니다. [Credentials](../tabs/credentials-tab.md) 탭에서 추가하고 [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md)와 같은 노드에서 이름이나 ID로 참조하십시오. 저장 시 암호화되며, 사용자 또는 [teams](./teams.md)와 공유할 수 있고, [Expression DSL](./expression-dsl.md)에서 `$credentials.Name`을 통해 참조할 수도 있습니다.

[Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md), [Third-Party Integrations](./integrations.md)도 참조하십시오.

### [Credentials Sharing](./credentials-sharing.md)

Credentials는 이메일로 다른 사용자와 공유하거나 팀과 공유할 수 있습니다. credential이 팀과 공유되면 모든 팀 구성원이 접근 권한을 얻습니다. 공유된 credential은 [Credentials](../tabs/credentials-tab.md) 탭에 표시자와 함께 나타납니다. 런타임 시 workflow 소유자의 컨텍스트는 소유한 credential, 사용자 공유 credential, 팀 공유 credential을 병합합니다. 표현식에서 `$credentials.CredentialName`을 사용하거나 노드 데이터에 credentialId를 설정하십시오.

[Credentials](./credentials.md), [Teams](./teams.md), [Third-Party Integrations](./integrations.md)도 참조하십시오.

### [Teams](./teams.md)

Teams를 사용하면 workflow, credential, 전역 변수, vector store, Drive 파일을 한 번에 사용자 그룹과 공유할 수 있습니다. [Teams](../tabs/teams-tab.md) 탭에서 팀을 생성하고 이메일로 구성원을 추가하십시오. 관련 공유 대화 상자에서 팀과 리소스를 공유하면 모든 구성원이 접근 권한을 갖습니다. 생성자는 팀을 편집하고 삭제할 수 있으며, 팀을 삭제하면 모든 팀 공유가 제거됩니다.

[Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md), [Enterprise](./enterprise.md)와 함께 사용됩니다.

### [Parallel Execution](./parallel-execution.md)

Heym은 노드 간에 서로 의존성이 없을 때 노드를 병렬로 실행합니다. 실행기는 DAG를 구축하고 스레드 풀로 동일한 레벨의 노드를 동시에 실행하며, 노드가 완료되는 즉시 다운스트림 노드가 스케줄됩니다. 필요할 때 [Merge](../nodes/merge-node.md) 노드를 사용하여 병렬 분기를 결합하십시오. 여러 workflow 실행이 동시에 실행되며, 각 실행은 격리됩니다. [SSE Streaming](./sse-streaming.md) 모드에서는 노드가 완료될 때 이벤트를 발생시킵니다.

[Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md), [Execution History](./execution-history.md)도 참조하십시오.
### [Agent 아키텍처](./agent-architecture.md)

[Agent 노드](../nodes/agent-node.md)는 하위 에이전트(orchestrator가 call_sub_agent를 통해 다른 에이전트 노드를 호출), 하위 Workflow(에이전트가 call_sub_workflow를 통해 다른 Workflow를 호출), 스킬(.zip 또는 .md에서 가져온 지침 콘텐츠 및 Python 도구), 그리고 [MCP](../tabs/mcp-tab.md) 클라이언트 연결을 지원합니다. orchestrator 도구 실행기는 하위 에이전트 및 하위 Workflow 호출을 라우팅하며, 그 외의 도구는 Python, MCP 또는 스킬 실행기로 전달됩니다. 하위 에이전트와 하위 Workflow의 최대 중첩 깊이는 5입니다. 도구 호출 루프에는 자동 컨텍스트 압축이 포함됩니다. 즉, 각 반복 전에 Token 사용량을 추정하여 모델의 컨텍스트 윈도우의 80%를 초과하면 동일한 모델을 사용하여 중간 메시지를 요약하며, 시스템 Prompt, 첫 번째 사용자 메시지, 마지막 사용자 메시지는 그대로 유지합니다.

[Agent 노드](../nodes/agent-node.md), [Agent 영구 메모리](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md), [MCP](../tabs/mcp-tab.md)도 참조하십시오.

### [Agent 영구 메모리](./agent-persistent-memory.md)

[Agent 노드](../nodes/agent-node.md)별로 선택적으로 Postgres에 저장되는 지식 그래프로, 엔터티, 유형, 속성, 방향성 관계로 구성됩니다. `persistentMemoryEnabled`가 true이면 각 실행 시 그래프가 시스템 Prompt로 요약되며, 성공적으로 완료된 후에는 [LLM](../nodes/llm-node.md)이 백그라운드에서 구조화된 업데이트를 추출합니다. REST CRUD는 `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...` 아래에 있습니다. 편집기는 노드의 분홍색 뇌 컨트롤에서 열립니다.

[Agent 노드](../nodes/agent-node.md), [Agent 아키텍처](./agent-architecture.md), [Traces](../tabs/traces-tab.md)도 참조하십시오.

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop를 사용하면 [Agent 노드](../nodes/agent-node.md)가 특정 체크포인트에서 승인을 요청하고, 공개 `/review/{token}` 페이지를 생성하며, 로그인하지 않은 검토자가 Markdown 검토 텍스트를 수락, 편집 또는 거부할 때까지 대기할 수 있습니다. HITL이 활성화된 에이전트는 `review` 출력 핸들도 노출하므로 실행이 대기 중인 동안 [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) 또는 기타 채널에 알림을 보낼 수 있습니다. 노드 수준의 HITL 텍스트는 승인 지침으로 사용되며, 공개 페이지 요약은 검토 요청 자체에서 생성됩니다. 대기 중인 실행은 즉시 [Execution History](./execution-history.md)에 나타나며, 동일한 실행에서 두 번 이상 발생할 수 있고, 각 결정이 제출되면 저장된 정확한 Workflow 스냅샷에서 재개됩니다.

[Agent 노드](../nodes/agent-node.md), [Portal](./portal.md), [Execution History](./execution-history.md), [Send Email](../nodes/send-email-node.md)도 참조하십시오.

### [Webhooks](./webhooks.md)

Workflow는 `POST /api/workflows/{workflow_id}/execute`에서 [HTTP](../nodes/http-node.md)를 통해 트리거되거나, `POST /api/workflows/{workflow_id}/execute/stream`에서 점진적으로 스트리밍될 수 있습니다. 요청 본문은 [Input](../nodes/input-node.md) 노드에 body로 전달되며, 헤더와 쿼리 파라미터는 [Expression DSL](./expression-dsl.md) 표현식에서 사용할 수 있습니다. Workflow별 인증(익명, JWT 또는 사용자 정의 헤더)을 구성하십시오. 선택적 응답 캐싱, 속도 제한, 편집기의 Run with cURL 대화 상자는 모두 Workflow에 있으며 두 모드 모두에 적용됩니다. [동시 실행 제한](./webhooks.md#concurrency-limit-and-queued-runs)이 설정되어 있으면 대기해야 하는 호출은 대신 실행 ID와 상태 URL이 포함된 `202 Accepted`를 받습니다.

[Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md), [Workflow 구조](./workflow-structure.md)도 참조하십시오.

### [Execution Tokens](./execution-tokens.md)

Execution Token은 단일 Workflow의 execute 및 stream Endpoint에 대한 액세스를 부여하는 범위 지정 JWT입니다. Workflow가 JWT 인증을 사용하는 경우, Token을 통해 외부 스크립트, CI 파이프라인 및 통합이 사용자 세션을 공유하지 않고도 Workflow를 호출할 수 있습니다. 각 Token은 하나의 Workflow에 고정하는 `wid` 클레임, 즉시 폐기를 위한 `jti`, 그리고 구성 가능한 TTL(60초~10년)을 포함합니다. **Run with cURL** 대화 상자에서 직접 Token을 생성, 선택 및 폐기할 수 있으며, 선택한 Token은 생성된 명령에 자동으로 포함됩니다.

[Webhooks](./webhooks.md), [Security](./security.md), [SSE Streaming](./sse-streaming.md)도 참조하십시오.

### [SSE Streaming](./sse-streaming.md)

cURL 대화 상자는 [webhook](./webhooks.md) 실행을 Server-Sent Events 모드로 전환할 수 있습니다. 이는 `execution_started`, `node_start`, `node_complete`, `execution_complete` 이벤트를 실시간으로 생성하고, 생성된 cURL 명령에 `--no-buffer`를 추가하며, 외부 터미널 소비자를 위해 `[START] LLM` 또는 사용자 정의 텍스트와 같은 노드별 시작 메시지를 구성할 수 있게 합니다.

[Webhooks](./webhooks.md), [Execution History](./execution-history.md), [LLM](../nodes/llm-node.md)도 참조하십시오.
### [Triggers](./triggers.md)

Workflow는 Trigger 노드([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) receive) 또는 진입점([Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron scheduler, Telegram webhook, Discord interaction webhook, IMAP trigger manager, RabbitMQ consumer, Editor run)에 의해 시작됩니다. 각 Trigger는 자체 Endpoint 또는 백그라운드 프로세스를 가지며, [Cron](../nodes/cron-node.md)은 60초마다 실행되고, [Telegram Trigger](../nodes/telegram-trigger-node.md) 노드는 봇 Webhook을 수신하며, [Discord Trigger](../nodes/discord-trigger-node.md) 노드는 서명된 interaction Webhook을 수신하고, [IMAP Trigger](../nodes/imap-trigger-node.md) 노드는 설정된 polling 간격에 따라 실행됩니다. [Input](../nodes/input-node.md) 노드는 Webhook 요청으로부터 body, headers, query를 수신합니다.

[Node Types](./node-types.md), [Webhooks](./webhooks.md), [Parallel Execution](./parallel-execution.md) 문서도 참고하십시오.

### [Execution History](./execution-history.md)

Execution History는 Workflow 실행 내역을 기록합니다: 입력, 출력, 노드 결과, 상태, Trigger 소스 등입니다. Editor 툴바, Docs 뷰, Dashboard 헤더 또는 [Evals](../tabs/evals-tab.md) 뷰에서 접근할 수 있습니다. Workflow별 History는 열려 있는 Workflow의 실행 내역을 표시하고, 전체 History 뷰는 모든 Workflow와 chat에 걸친 실행 내역을 표시합니다. 현재 실행 중인 Execution은 두 대화 상자 모두의 최상단에 **Open live** 및 **Cancel** 액션과 함께 표시됩니다. Open live는 [SSE](./sse-streaming.md)를 통해 Editor를 기존 Execution에 연결하고, 완료된 노드를 복원하며, 현재 및 대기 중인 노드를 펄스 표시하고, 새로운 실행을 시작하지 않고 Debug 로그를 추가합니다. Bring to Canvas는 완료된 실행의 입력과 노드 출력을 로드하여 재실행 또는 디버깅에 사용할 수 있게 합니다. 딥 링크 `/workflows/{workflowId}/{executionId}`는 라이브 및 완료된 Execution 모두를 지원합니다. [Human-in-the-Loop](./human-in-the-loop.md)로 일시 중지된 실행은 공개 review URL과 에이전트의 `review` 브랜치에서 실행된 모든 알림 노드를 포함하여 즉시 `pending`으로 저장됩니다. 실행 도중 서버가 재시작되면 중단된 실행은 자동으로 복구됩니다. 동일한 입력으로 처음부터 다시 실행되며 완료된 것으로 표시(**Recovered** 표시)됩니다. 이는 Workflow별 **Auto-recover runs** 토글로 제어되며, 대신 `skipped`로 기록하도록 설정할 수도 있습니다.

[SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md), [Traces](../tabs/traces-tab.md) 문서도 참고하십시오.

### Execution Highlights

라이브 실행 후 또는 **Bring to Canvas** 후에 Canvas 우측 상단에 닫을 수 있는 **Execution Highlights** 팝업이 나타나며, 각 노드가 실행 순서대로 생성한 결과를 나열합니다. 각 노드를 열지 않고도 노드별 출력을 빠르게 확인할 수 있는 방법입니다. **✕**로 닫을 수 있으며, 다음 실행 시 다시 열립니다. Highlights는 dashboard 실행에서도 표시됩니다. 자세한 내용은 [Execution History](./execution-history.md)를 참고하십시오.

### [Edit History](./edit-history.md)

Edit History는 Workflow의 저장된 버전을 추적합니다(저장할 때마다 버전이 생성됩니다). 목록을 보고, 버전을 열어 현재 Workflow와의 diff([nodes](./workflow-structure.md), edges, config)를 확인하고, Revert로 과거 버전을 복원할 수 있습니다. [Execution History](./execution-history.md)와 달리 Edit History는 실행이 아닌 구조 변경을 추적합니다.

[Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md), [Canvas Features](./canvas-features.md) 문서도 참고하십시오.

### Error Workflow

Workflow는 실패 시 실행할 다른 Workflow를 지정할 수 있습니다. Workflow 수준 **Properties** 패널(노드가 선택되지 않았을 때 표시됨)의 **On error, run workflow**에서 설정합니다. Workflow 소유자만 설정, 변경, 해제할 수 있습니다. 자세한 내용은 [Owner-only settings](./workflow-organization.md#owner-only-settings)를 참고하십시오. 최상위 실행이 처리되지 않은 실패로 종료되면 선택된 Error Workflow가 실행되며 실패 컨텍스트(실패한 Workflow id와 이름, run id, 에러 메시지, 실패한 노드 레이블과 유형, 타임스탬프)를 수신합니다. Canvas에 이미 [Error Handler](../nodes/error-handler-node.md) 노드가 있는 경우 로컬 핸들러가 우선하며 Error Workflow는 호출되지 **않습니다**. Error Workflow 자체는 직접 실행되므로 자체 Error Workflow를 트리거하지 않습니다.

Error Workflow는 모든 비테스트 최상위 실행을 대상으로 합니다: 두 execute Endpoint, [Portal](./portal.md), 그리고 [cron](../nodes/cron-node.md), chat 플랫폼 Trigger, email, queues, [MCP](../tabs/mcp-tab.md), dashboard 위젯을 포함한 모든 Trigger입니다. [Load Distribution](./cluster.md)이 활성화된 경우에도 이는 변경되지 않으며, worker가 실행한 실행도 포함됩니다. 실패한 노드가 결과와 함께 반환되고, Error Workflow는 다른 실행과 마찬가지로 분배되므로 그 안에 있는 노드가 main 인스턴스에서 실행되어야 하는 경우에도 그대로 실행됩니다. 두 가지 경우는 Workflow 자체의 결과가 아직 알려지지 않았기 때문에 의도적으로 제외됩니다: 어떤 인스턴스도 실행하지 않은 실행, 그리고 실행이 계속 진행 중일 수 있는 동안 타임아웃된 wait입니다. 또한 수동 Canvas 테스트 실행으로는 트리거되지 **않습니다**.
### Workflow Timeout

각 Workflow는 workflow 수준의 **Properties** 패널에서 **workflow timeout**을 초 단위로 설정할 수 있습니다. `0`(기본값)은 이를 비활성화합니다. 설정된 경우, 제한 시간을 초과한 실행은 다음 노드 경계에서 중지되며 "timed out" 오류와 함께 실패한 실행으로 기록됩니다. 이 timeout은 수동, API, Trigger 실행 모두에 적용됩니다. 긴 [Wait](../nodes/wait-node.md) 노드는 전체 시간 동안 차단되는 대신 즉시 중단됩니다.

### 동시 실행 제한

각 워크플로우는 워크플로우 수준의 **Properties** 패널에 있는 **동시 실행 제한**을 통해 한 번에 실행되는 프로덕션 실행 수를 제한할 수 있습니다. 소유자와 편집 권한이 있는 공동 작업자가 변경할 수 있으며 기본적으로 꺼져 있습니다. 제한에 도달하면 [webhook](./webhooks.md#concurrency-limit-and-queued-runs) 및 [스트리밍](./sse-streaming.md) endpoint, [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) 및 모든 [trigger](./triggers.md)의 새 실행은 [클러스터](./cluster.md)의 모든 인스턴스에 걸쳐 계산되는 FIFO(선입선출) 큐에서 대기합니다. 에디터의 테스트 실행, 하위 워크플로우 호출, [Evals](../tabs/evals-tab.md) 및 검토 재개는 대기열에 들어가지 않으며, [Board](../tabs/board-tab.md) 카드 실행, 파일 업로드 실행, AI 어시스턴트의 run-workflow 도구로 시작된 실행 및 알림 통지 워크플로우는 슬롯을 기다리지 않고 시작됩니다. 대기해야 하는 webhook 호출은 즉시 `execution_id`, 동일한 자격 증명으로 응답하는 상태 URL, 대기 순서, 큐 크기 및 실행 중인 카운트와 함께 `202 Accepted`를 받습니다. MCP 클라이언트도 동일하게 수신하고 `heym_execution_status` 도구를 폴링합니다. 선택 사항인 **최대 큐 크기**는 초과 호출을 `429`로 거부하고, 선택 사항인 **최대 대기 시간**은 너무 오래 대기한 실행을 `expired`로 기록합니다. 대기 중인 실행은 [실행 기록](./execution-history.md)에 **대기 중 n/m**으로 표시되며 거기서 취소할 수 있습니다.

### Time Saved

각 Workflow는 workflow 수준의 **Properties** 패널에서 설정하는 **실행당 예상 절약 시간**(분 단위)을 기록할 수 있습니다. [Analytics](../tabs/analytics-tab.md) 탭은 선택한 범위에 걸쳐 이를 집계하여 총 **Time Saved** 통계(각 Workflow의 예상값 × 성공한 실행 수의 합)로 표시합니다. Most Used에서도 Workflow별 합계를 나열하며, 설정되지 않은 경우 **Not Set**을 클릭하면 예상값 입력 필드가 열립니다. [Workflow Analysis](./workflow-analysis.md) 보고서는 예상값이 구성되지 않은 경우 설정할 것을 권장합니다.

### [Settings](./user-settings.md)

Settings 대화 상자(헤더의 아바타에서 열림)에는 네 개의 탭이 있습니다: Profile(Gravatar 사진, 표시 이름, User Rules), [Security](./security.md)(비밀번호 변경), Voice([ElevenLabs TTS/STT](./chat-voice.md)), Observability(읽기 전용 [OpenTelemetry](./opentelemetry.md) 상태). User Rules는 workflow builder와 [Chat](../tabs/chat-tab.md)을 포함한 모든 AI 요청에 주입되는 사용자 지정 지침으로, 언어, 어조, 코딩 스타일 또는 workflow 규칙을 한 번만 설정할 수 있습니다. 비밀번호 정책과 [MCP](../tabs/mcp-tab.md) API key 관리도 사용할 수 있습니다.

[Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md), [AI Assistant](./ai-assistant.md)도 참조하십시오.

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym은 모든 workflow 실행 및 노드 실행에 대해 OpenTelemetry trace를 내보낼 수 있습니다: 실행당 루트 `heym.workflow.execute` span과 노드당 자식 `heym.node.execute` span이 생성되며, 모델 및 token 사용량이 LLM 및 agent 노드에 첨부됩니다. Span은 OTLP/HTTP를 통해 모든 호환 백엔드(Jaeger, Grafana Tempo, Honeycomb, Datadog)로 내보내지며, W3C trace context는 인바운드 webhook, 아웃바운드 HTTP, sub-workflow 전반에 걸쳐 전파됩니다. Tracing은 기본적으로 비활성화되어 있으며 `HEYM_OTEL_*` [환경 변수](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)로 구성됩니다. 활성 상태는 [Settings](./user-settings.md) Observability 탭에 표시됩니다.

[Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), [Webhooks](./webhooks.md)도 참조하십시오.

### [Download & Import](./download-import.md)

Editor 툴바의 Download 버튼을 통해 현재 workflow를 JSON으로 내보낼 수 있습니다. 파일에는 노드와 엣지가 포함됩니다. JSON 파일을 [Workflows](../tabs/workflows-tab.md) 탭으로 드래그하면(새 workflow 생성) 또는 캔버스로 드래그하면(교체 또는 병합) 가져올 수 있습니다. JSON에는 nodes 배열이 반드시 포함되어야 하며, name과 edges는 선택 사항입니다. 백업, 공유 또는 인스턴스 간 마이그레이션에 사용하십시오.

[Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md), [Canvas Features](./canvas-features.md)도 참조하십시오.

### [Portal](./portal.md)

Portal은 workflow를 `/chat/{slug}`에서 공개 chat UI로 노출합니다. workflow별로 portal_enabled, slug, 선택적 인증(portal users), streaming, 파일 업로드를 구성할 수 있습니다. 최종 사용자는 Heym에 로그인하지 않고 chat 인터페이스를 통해 상호작용하며, 이미지 출력은 chat에 표시될 수 있습니다. Portal workflow는 [Agent Node](../nodes/agent-node.md)가 승인을 필요로 할 때 [Human-in-the-Loop](./human-in-the-loop.md) 검토 페이지로 전환할 수 있으며, agent의 `review` 브랜치는 다른 채널로 알림을 전송합니다. 내부 도구, 고객 대면 챗봇, AI 기반 양식에 사용하십시오.

[Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md), [Drive](./drive.md)도 참조하십시오.

### [File Generation](./file-generation.md)

Skill은 실행 중 `_OUTPUT_DIR` workspace에 작성하여 PDF, DOCX, CSV, JSON, 이미지 등의 파일을 생성할 수 있습니다. Heym은 이러한 파일을 자동으로 캡처하여 저장하고, `_generated_files` 아래에 다운로드 메타데이터를 노출합니다. 이후 [Drive node](../nodes/drive-node.md)로 관리하거나 [Drive](../tabs/drive-tab.md) 탭에서 검토할 수 있습니다.

[Agent Node](../nodes/agent-node.md), [Drive](./drive.md), [Drive node](../nodes/drive-node.md)도 참조하십시오.

### [Drive](./drive.md)

Drive는 skill이 생성한 파일을 위한 공유 스토리지 및 공유 계층입니다. 파일을 탐색하고, 공개 또는 비밀번호로 보호된 링크를 생성하고, 만료 및 다운로드 제한을 적용하고, 팀과 읽기 전용으로 파일을 공유하고, [Drive node](../nodes/drive-node.md)로 프로그래밍 방식으로 또는 [Drive](../tabs/drive-tab.md) 탭에서 수동으로 해당 파일을 관리할 수 있습니다.

[Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md), [Portal](./portal.md)도 참조하십시오.
### [보안](./security.md)

Heym은 비밀번호 정책(길이, 대문자, 소문자, 숫자)을 적용하고, 액세스 토큰을 HttpOnly 쿠키에 저장하며, 사용 시 refresh token을 회전합니다. 로그인, 회원가입, [Portal](./portal.md) 로그인에 속도 제한이 적용됩니다. [Credentials](./credentials.md)는 AES-256(Fernet)으로 저장 시 암호화됩니다. [MCP](../tabs/mcp-tab.md) API key는 클라이언트 인증에 사용되며, 콘텐츠 안전성은 [LLM](../nodes/llm-node.md) 및 [Agent Node](../nodes/agent-node.md) 노드에서 [Guardrails](./guardrails.md)를 통해 사용할 수 있습니다. [Execution Tokens](./execution-tokens.md)는 외부 호출자를 위한 워크플로우별 범위 지정 JWT를 제공합니다.

[Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md), [Credentials](./credentials.md)도 참조하십시오.

### [Single Sign-On](./sso.md)

Heym은 모든 외부 OpenID Connect 제공자 - Keycloak, Okta, Entra ID, Auth0, Google - 에 대해 사용자를 인증하며, `HEYM_ADMIN_EMAILS`에 등록된 인스턴스 관리자가 **Settings → SSO**에서 런타임에 구성합니다. 발급자 URL과 클라이언트 자격 증명만 입력하면 되며, 모든 엔드포인트는 제공자의 검색 문서에서 가져오므로 어떤 제공자도 하드코딩되지 않습니다. 로그인은 PKCE를 사용하는 Authorization Code를 사용하며, ID token은 제공자가 게시한 키로 검증됩니다. 계정은 `(issuer, subject)`를 우선으로, 검증된 이메일을 차선으로 매핑하며, 선택적 자동 프로비저닝은 이메일 도메인 허용 목록으로 제한됩니다. 비밀번호 로그인은 SSO와 함께 계속 사용할 수 있으며 연결 테스트가 통과되면 비활성화할 수 있고, `HEYM_ADMIN_EMAILS` 계정은 예외로 두어 잘못 구성된 제공자가 인스턴스를 잠글 수 없도록 합니다.

[Settings](./user-settings.md), [Security](./security.md), [Audit Logging](./audit.md)도 참조하십시오.

### [부하 분산](./cluster.md)

두 번째 Heym 인스턴스를 동일한 데이터베이스에 연결하면 워커로 참여합니다. 백그라운드 실행 - cron, webhooks, MCP tool calls, chat triggers - 은 인스턴스 관리자가 **Settings → Instances**에서 설정한 비율에 따라 인스턴스 간에 공유되며, 각 인스턴스의 상태, 데이터베이스 지연 시간, 버전이 하나의 표에 표시됩니다. 인스턴스는 서로 통신하지 않습니다. Postgres가 작업을 전달하므로 워커에는 열린 포트도, 메인 인스턴스로 돌아가는 경로도 필요하지 않습니다. 로컬 파일, 코딩 에이전트 워크스페이스 또는 설치된 플러그인을 다루는 작업은 항상 메인 인스턴스에서 실행되며, 패널은 지난 24시간 동안 그 비중이 얼마나 되었는지 보고하므로 운영자는 비율 조정이 도움이 되지 않는 시점을 확인할 수 있습니다. 기록의 모든 실행은 이를 실행한 인스턴스 이름을 표시하며, 두 기록 대화 상자 모두 이를 기준으로 필터링할 수 있습니다.

[Settings](./user-settings.md), [Traces](../tabs/traces-tab.md), [Analytics](../tabs/analytics-tab.md)도 참조하십시오.

### [서드파티 통합](./integrations.md)

Heym은 [Credentials](../tabs/credentials-tab.md) 탭에 저장된 자격 증명(저장 시 암호화)을 통해 외부 서비스에 연결합니다. 지원되는 유형에는 OpenAI, Google, [Decision node](../nodes/decision-node.md)용 Decision Model, 자동 모델 선택용 Model Router(아래 참조), [GitHub node](../nodes/github-node.md) 및 MCP 통합용 GitHub, [Jira node](../nodes/jira-node.md)용 Jira, [Notion node](../nodes/notion-node.md)용 Notion, Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), [Send Email](../nodes/send-email-node.md)용 SMTP, [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header, [Crawler](../nodes/crawler-node.md)용 FlareSolverr가 포함됩니다. 각 유형은 필수 필드를 문서화하며, 자격 증명은 사용자 또는 [teams](./teams.md)와 공유할 수 있고 노드에서 이름으로 또는 표현식에서 `$credentials.Name`으로 참조할 수 있습니다.

### Model Router (Auto Model)

**Model Router** 자격 증명은 키를 보유하는 대신 요청별로 모델을 선택합니다. 이는
결정 모델 자격 증명과 기존 OpenAI/Google/Custom 자격 증명 목록을 저장하며, 각각은
언제 사용해야 하는지에 대한 기준을 포함하고, 모든 모델 선택기에서 **Auto**라는
단일 모델로 나타납니다.

Traces, 캔버스 Execution Log 및 Span View는 선택의 양쪽 절반을 표시합니다. 예를 들어
`Auto Model / GPT-5`와 같으며, 비용은 실행된 모델에 귀속됩니다. Auto
Model은 Responses API, Batch 모드 또는 이미지 출력과 결합할 수 없습니다. 전체
동작은 [Credentials](./credentials.md)를 참조하십시오.

[Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md), [Teams](./teams.md)도 참조하십시오.

### [Guardrails](./guardrails.md)

Guardrails는 안전하지 않거나 원치 않는 사용자 메시지가 [LLM](../nodes/llm-node.md) 또는 [Agent Node](../nodes/agent-node.md)에 도달하기 전에 차단합니다. 노드별로 활성화하고 차단할 카테고리(예: 폭력, 혐오 발언, 성적 콘텐츠, 자해, 괴롭힘, 불법 활동)를 선택하십시오. 민감도(낮음, 중간, 높음)를 설정하십시오. 트리거되면 노드는 [Error Handler](../nodes/error-handler-node.md)로 잡을 수 있는 오류를 발생시킵니다. 감지는 자격 증명 유형에 따라 제공자 moderation API 또는 LLM 분류를 사용합니다.

[Security](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Error Handler](../nodes/error-handler-node.md)도 참조하십시오.
### [Enterprise](./enterprise.md)

Enterprise는 프로덕션 환경에서 Heym을 운영하는 팀을 위한 상용 라이선스, 전문 지원, 배포 서비스를 제공합니다. 여기에는 Workflow 아키텍처 지원, 온보딩, Kubernetes 및 스케일링 가이드, 우선 지원, 그리고 [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md), [Portal](./portal.md)과 같은 고급 기능에 대한 맞춤 개발이 포함됩니다.

[Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md), [Teams](./teams.md) 문서도 참고하십시오.

### [Heym Work](./heym-work.md)

Heym Work는 Heym 위에 구축된 비즈니스 팀용 두 번째 인터페이스입니다. 사용자가 업무를 설명하고 몇 가지 질문에 답하면 테스트를 거친 workflow를 받게 되며, 이후 모든 실행에 이름이 부여되는 페이지, 승인 및 활동 목록에서 작업할 수 있습니다. 인스턴스 관리자는 **설정 → Heym Work**에서 주소와 통합 키로 연결하며, Heym 팀에서 발급하는 별도의 라이선스를 사용합니다.

[Enterprise](./enterprise.md), [Single Sign-On](./sso.md), [Human-in-the-Loop](./human-in-the-loop.md) 문서도 참고하십시오.

---

## Dashboard Tabs

### [Workflows](../tabs/workflows-tab.md)

Workflows 탭은 기본 대시보드 화면입니다. 두 개의 패널로 구성된 목록을 표시합니다. 왼쪽에는 Workflow와 폴더가 밀집된 행으로 나열되고, 오른쪽에는 선택한 Workflow의 Trigger, 마지막 실행, 단계, 그리고 Open Workflow 및 Run Now 버튼이 포함된 미리보기가 표시됩니다. 모든 행에는 상태 칩(Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled)이 표시되며, Status 드롭다운으로 필터링할 수 있습니다. Trigger 노드가 없는 Workflow는 가장 최근 실행이 어떻게 시작되었는지에 따라 라벨이 지정됩니다. HTTP 호출의 경우 API, 상위 Workflow의 경우 SubWorker, 공개 채팅의 경우 Portal로 표시되며, 실행 전까지는 Manual 상태로 유지됩니다. 폴더와 하위 폴더는 [조직화](./workflow-organization.md)를 처리합니다. New Workflow로 Workflow를 생성하고, JSON을 드래그 앤 드롭하여 [가져오기](./download-import.md)하며, 행 작업에서 편집하거나 삭제할 수 있습니다. Workflow는 폴더 간에 이동할 수 있으며, 삭제는 영구 제거 전에 예약(휴지통)됩니다.

[Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md), [Quick Drawer](./quick-drawer.md) 문서도 참고하십시오.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

카드가 영구적인 작업인 에이전트 기반 칸반 보드입니다. 각 열을 순서가 지정된 Workflow 체인으로 구성하십시오. 카드를 열로 이동하면 카드의 전체 컨텍스트(콘텐츠, 댓글, 이력, 이전 출력)와 함께 체인이 실행됩니다. 결과는 카드에 다시 기록됩니다. 성공 시 녹색, 실패 시 빨간색, 실행 중에는 황색입니다. 후속 라운드는 지금까지 누적된 모든 항목과 함께 현재 열의 체인을 다시 실행하며, 이는 반복적 계획 수립을 지원합니다. 실행은 `board` Trigger 소스와 함께 [Execution History](./execution-history.md)에 기록됩니다. 카드 실행이 활성 상태인 동안 **Open live**를 클릭하면 증분 Debug 로그와 함께 애니메이션 캔버스에서 해당 실행을 정확히 열 수 있습니다.

[Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md), [Human-in-the-Loop](./human-in-the-loop.md) 문서도 참고하십시오.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Templates 탭에서는 Workflow 템플릿(전체 Workflow)과 노드 템플릿(구성된 단일 노드)을 저장하고 재사용할 수 있습니다. 편집기에서 Workflow 템플릿을 생성하고(Share as Template), 노드를 마우스 오른쪽 버튼으로 클릭하여 노드 템플릿을 생성하십시오. 공개 범위(Everyone 또는 특정 사용자/[팀](./teams.md))별로 탐색하고, 템플릿을 적용하여 새 Workflow를 생성하거나 캔버스에 노드를 추가하며, 공유한 템플릿을 관리할 수 있습니다.

[Workflows](../tabs/workflows-tab.md), [Teams](./teams.md), [Canvas Features](./canvas-features.md) 문서도 참고하십시오.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Variables 탭은 [Global Variable Store](./global-variables.md)를 관리합니다. 전역 변수를 생성, 편집, 삭제하고 이름, 값, 값 유형(Auto, String, Number, Boolean, Array, Object)을 설정하십시오. 변수는 사용자 범위로 지정되며 실행 간에 유지됩니다. 모든 Workflow [표현식](./expression-dsl.md)에서 `$global.variableName`으로 참조할 수 있습니다. 변수는 다른 사용자 또는 [팀](./teams.md)과 공유할 수 있습니다.

[Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md), [Expression DSL](./expression-dsl.md) 문서도 참고하십시오.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Chat 탭은 대화를 통해 워크스페이스를 운영하기 위한 Heym의 장시간 실행 에이전트 인터페이스입니다. [credential](./credentials.md)과 모델을 선택한 다음, Chat에 질문에 대한 답변, 워크플로우 정의 검사, 기존 워크플로우 실행, 실행 및 스케줄 요약, 단일 워크플로우의 실행 이력 보고(실행 횟수, 상태별 분류, 마지막 실행, 요청 시 특정 실행의 세부 정보), 현재 실행 중인 실행 보고(경과 시간, 현재 노드, 각 라이브 실행 링크 포함), 대기 중인 사람 검토 처리, 편집기에서 사용되는 것과 동일한 AI Builder 엔진으로 워크플로우 생성 및 수정, 또는 자연어로 kanban 보드에 카드 추가를 요청할 수 있습니다. 새 카드는 항상 선택한 보드의 첫 번째 열에서 시작되며, 여러 보드를 사용할 수 있고 특정 보드를 지정하지 않은 경우 Chat은 카드를 생성하기 전에 보드 선택을 제시합니다.

Chat은 브라우저를 닫은 후에도 백엔드에서 계속 실행됩니다. 답변이 스트리밍되는 동안 추가 메시지를 보낼 수 있으며, Heym은 이를 데이터베이스 기반 큐에 저장하고, 대기 중인 메시지가 시작되기 전에 편집하거나 삭제할 수 있게 하며, 현재 응답이 완료되면 순서대로 실행합니다. 어시스턴트가 계획 세부 정보를 필요로 하여 명확화 질문을 반환하는 경우, 큐는 해당 질문에 답변할 때까지 일시 중지되었다가 계획 응답 이후 재개됩니다.

응답은 markdown, 인라인 이미지, 워크플로우 미리보기 카드, 접을 수 있는 도구 호출 카드, 컨텍스트 사용량, 자동 컨텍스트 압축과 함께 스트리밍됩니다. Chat은 첨부 파일, 음성 입력, 소리 내어 읽기 재생, 복사 작업, 빠른 프롬프트, [Settings](./user-settings.md)의 User Rules, 그리고 컨텍스트로서의 [global variables](./global-variables.md)를 지원합니다.

[AI Assistant](./ai-assistant.md), [Credentials](./credentials.md), [Settings](./user-settings.md)도 참조하십시오.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Chat 데모 보기</a></p>

### [Credentials](../tabs/credentials-tab.md)

Credentials 탭은 노드에서 사용하는 API 키와 시크릿을 관리합니다. 유형별로 credential을 추가하고(OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere 등), 이름을 지정한 다음 워크플로우 노드에서 참조할 수 있습니다. 카드에서 편집하거나 삭제할 수 있으며, 이메일로 사용자에게 또는 [teams](./teams.md)와 공유할 수 있습니다. 모든 값은 저장 시 암호화되고 UI에서는 마스킹됩니다.

[Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md), [Third-Party Integrations](./integrations.md)도 참조하십시오.

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Credentials 데모 보기</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Vectorstores 탭은 [RAG](../nodes/rag-node.md) 노드에서 사용하는 벡터 스토어를 관리합니다. 이름과 벡터 스토어 [credential](./credentials.md) — *RAG: Qdrant + OpenAI*(외부 Qdrant) 또는 *RAG: Psql + OpenAI*(pgvector를 통한 Heym 자체 Postgres)로 스토어를 생성하면 스토어의 백엔드가 고정됩니다 — 으로 스토어를 만들고, 선택적으로 컬렉션 이름을 설정한 다음, 문서(PDF, TXT 등)를 업로드합니다. 콘텐츠를 관리하고(소스 보기, 삭제), 스토어 세부 정보를 편집하며, 스토어를 사용자와 공유할 수 있습니다. [RAG](../nodes/rag-node.md) 노드에서 Database를 선택하고, 벡터 스토어를 선택한 다음, insert, upsert, delete 또는 search 작업을 실행하십시오.

[Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md), [Teams](./teams.md)도 참조하십시오.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vectorstores 데모 보기</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP 탭은 Model Context Protocol 통합을 구성합니다. Heym은 두 가지 모드를 지원합니다:

**기본 서버** – `/api/mcp/sse`의 단일 Endpoint가 MCP가 활성화된 모든 Workflow를 노출합니다. API key를 확인 및 재생성하고, 바로 사용 가능한 클라이언트 JSON을 복사하고, Cursor를 한 번의 클릭으로 연결하거나, 자동 OAuth 등록과 함께 Claude 설정 흐름을 따를 수 있습니다.

**명명된 서버** – 각각 고유한 UUID 기반 URL(`/api/mcp/servers/{uuid}/sse`)과 독립적인 API key를 가진 여러 개의 격리된 MCP Endpoint를 생성합니다. 각 서버에 특정 Workflow를 할당하여 서로 다른 AI 클라이언트나 팀이 필요한 도구만 볼 수 있도록 합니다. 각 명명된 서버는 동일한 인증 방식(API key, Claude OAuth)을 지원하며 자체적인 Copy JSON 및 Add to Cursor 단축 기능을 갖습니다. 두 Endpoint 모두 SSE transport(GET)와 Streamable HTTP transport(POST)를 지원합니다. 명명된 서버 내에서 Workflow를 토글하면 변경된 행이 계속 보이도록 할당된 목록의 맨 위로 이동합니다.

**Heym chat 도구** – 두 모드 모두 [Chat](../tabs/chat-tab.md) 엔진을 단일 `heym_chat` 도구로 노출할 수 있으며, 각 화면별로 자체 LLM credential과 모델([Settings](./user-settings.md)의 선호 모델에서 미리 채워짐)로 토글됩니다. MCP 클라이언트가 자연어 `message` 하나를 보내면 엔진이 나머지를 처리합니다: 빌드 모드에서 Workflow 빌드(저장, 최대 5회 테스트 실행, 수정 및 검증), Workflow 실행, analytics, executions, 실시간 실행 상태, schedules, boards 및 cards, teams, 전역 변수, 문서 검색, 그리고 human-in-the-loop 결정. 나중에 Chat에 추가되는 기능도 추가 등록 없이 동일한 도구를 통해 접근할 수 있습니다. 각 호출은 Chat 탭 기록에 plug 표시가 된 대화로 저장되며, 클라이언트가 스레드를 계속하기 위해 다시 전달할 수 있는 `conversation_id`를 반환합니다.

[Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md), [SSE Streaming](./sse-streaming.md)도 참조하십시오.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCP 데모 시청</a></p>

### [Traces](../tabs/traces-tab.md)

Traces 탭은 [LLM](../nodes/llm-node.md) 실행 trace를 표시합니다. 목록 위의 통계 헤더는 선택한 시간 범위를 KPI 카드(Calls, Tokens, Cost, Avg Latency, Error %)와 세 개의 차트 — Tokens by Model, Cost by Model, Calls Over Time(성공 대 오류 누적) — 로 요약합니다. 단일 **Time range** 선택기(1h / 24h / 7d / 30d / All, 기본값 7일)가 차트와 목록을 함께 필터링합니다. Cost는 사용자별 [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table)에서 계산되며, 가격이 없는 모델은 해당 테이블로 연결되는 인라인 경고로 표시됩니다. 아무 trace나 열면 요청 및 응답 Payload, 타이밍 분석(llm_ms, tools_ms, mcp_list_ms), 도구 호출(이름, 인수, 결과), 포함된 skills를 볼 수 있습니다. 확장된 이벤트는 MCP 및 JSON-RPC Payload를 포함한 JSON을 첫 번째 레벨이 기본적으로 열린 접을 수 있는 트리로 표시하며, **Tree / Raw**는 원본 텍스트로 전환하고 잘못된 형식의 JSON도 읽을 수 있게 유지됩니다. trace를 사용하여 [Agent Node](../nodes/agent-node.md) 및 [LLM](../nodes/llm-node.md) 동작을 디버깅하고 Payload를 복사하거나 내보낼 수 있습니다.

[Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md)도 참조하십시오.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Traces 데모 시청</a></p>
### [Alerts](../tabs/alerts-tab.md)

Alerts 탭은 시간 윈도우에 대한 임계값 조건을 정의하고, 해당 조건이 충족될 때 알려줍니다. 네 가지 알림 유형은 운영자가 실제로 묻는 질문을 다룹니다: **error threshold**(윈도우 내에서 N회 이상 실패했는가), **workflow duration**(실행이 느려졌는가, max, average, p95로 측정), **token / USD cost**(예산을 초과했는가, [Traces](../tabs/traces-tab.md)와 동일한 pricing table을 통해 산출), **execution count**(예상보다 훨씬 자주 실행되었는가). 모든 유형은 단일 이벤트가 아닌 선택한 윈도우를 기준으로 판정합니다. 한 번의 실패한 실행은 노이즈이고, 연속된 폭주는 인시던트이기 때문입니다. Alerts는 하나의 workflow 또는 접근 가능한 모든 workflow를 감시합니다.

5단계 마법사가 유형, 범위, 조건, 응답, 검토 순으로 안내합니다. 검토 단계에서는 먼저 조건을 **backtest**하여 지난 24시간에서 7일 동안 얼마나 자주 발동되었을지 보고하므로, 임계값이 너무 낮게 설정된 경우 누군가에게 페이지가 가기 전에 저장 전에 발견됩니다. 원하는 내용을 자연어로 설명하면 AI가 가능한 모든 단계를 채우고 추측한 부분을 표시합니다. 부분적인 요청이라도 마법사는 진행되며, 처음부터 다시 시작하지 않고 아직 결정이 필요한 첫 번째 단계에서 열립니다. 기본적으로 알림은 한 번 발동하고 메트릭이 복구될 때까지 조용히 유지됩니다. 대신 일정 간격으로 반복하도록 설정할 수도 있습니다.

응답 단계에서 알림은 발동 시 실행할 새 workflow를 생성하고 할당하거나, 이미 보유한 workflow를 사용하거나, 아무것도 하지 않을 수 있습니다. 발동 payload에는 관측값, 임계값, 윈도우, 그리고 해당 수치에 기여한 workflow가 포함되며, 이를 통해 이미 보유한 노드를 사용하여 Slack, email, Telegram으로 알림을 전달할 수 있습니다. 발동 이력은 각 알림이 발동된 순간의 상태를 기록하며 90일 동안 보관됩니다. 발동을 확인(acknowledging)하면 조건이 해소된 것처럼 가장하지 않고 배지를 Firing에서 Acknowledged로 변경합니다. [Chat](../tabs/chat-tab.md) 탭에서는 어떤 알림이 존재하는지, 왜 또는 언제 발동되었는지 답변할 수 있습니다. Alerts는 사용자 및 [teams](../tabs/teams-tab.md)와 공유할 수 있습니다.

[Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md), [Execution History](./execution-history.md)도 참조하십시오.

### [Analytics](../tabs/analytics-tab.md)

Analytics 탭은 실행 메트릭과 추세를 보여줍니다. 요약 통계에는 총 실행 수, 성공률, 오류율, 지연 시간 분석, 총 **Time Saved**(각 workflow의 실행당 예상 절약 시간 × 성공한 실행 수의 합계)가 포함됩니다. Most Used는 workflow별 동일한 합계를 나열합니다. 기본 시간 범위(24h, 7d, 30d, all)를 선택하고, 선택적으로 workflow로 필터링한 다음, 차트를 드래그하여 선택한 날짜 범위로 드릴다운할 수 있습니다. 차트와 workflow 테이블이 선택 항목에 맞게 새로 고쳐지며, 자동 새로 고침으로 메트릭이 최신 상태로 유지됩니다. 과거 결과와 예정된 실행을 모두 확인해야 할 때 [Execution History](./execution-history.md)와 [Scheduled](../tabs/scheduled-tab.md) 뷰를 보완합니다.

[Execution History](./execution-history.md), [Scheduled](../tabs/scheduled-tab.md), [Evals](../tabs/evals-tab.md)도 참조하십시오.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Dashboard 탭은 Grafana 스타일의 공간으로, 각각 자체적인 숨겨진 Heym workflow에서 렌더링되는 차트 위젯 그리드를 구성할 수 있습니다. 필요한 만큼 대시보드를 만들고 각각을 사용자 또는 팀과 읽기 전용 또는 편집 가능으로 공유할 수 있습니다. 위젯은 항상 소유자의 자격 증명으로 실행되므로 모든 사람이 동일한 데이터를 봅니다. 자연어로 메트릭을 설명하면 AI가 위젯을 생성하거나, 수동으로 추가하여 차트 유형을 선택할 수 있으며 샘플 데이터로 미리 볼 수 있습니다: bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text, HITL. HITL은 대기 중인 사람 검토의 캐러셀입니다. 헤더에는 `1/n pending`이 표시됩니다. workflow 이름을 클릭하면 캔버스에서 해당 실행이 열립니다. **Approve**, **Request changes**, **Reject**로 처리하며, 위젯 제목 옆의 이력 아이콘을 클릭하면 같은 페이지의 이력 대화 상자에서 해당 실행이 열립니다. 위젯은 결과를 캐시하고, AI로 세부 조정할 수 있으며(각 변경 사항은 [Edit History](./edit-history.md)에 저장됨), 완전한 workflow와 함께 복제되고, Tidy up으로 재배치되며, 편집 모드에서 드래그하거나 크기를 조정할 수 있습니다. 테이블은 상태 칩을 표시하고 클릭한 행의 레코드를 `$page.record`로 읽어오는 상세 대시보드에 행을 연결할 수 있으며, Run 위젯은 드롭된 파일, 입력 필드 또는 실행 버튼을 사용해 대시보드에서 바로 workflow를 실행합니다. 각 위젯이 workflow이므로, 가져올 수 있는 모든 데이터 — [HTTP](../nodes/http-node.md) 호출, [BigQuery](../nodes/bigquery-node.md) 쿼리, [RAG](../nodes/rag-node.md) 조회, 또는 [LLM](../nodes/llm-node.md) 출력 — 이 차트가 될 수 있습니다. HITL 위젯의 설정은 이를 단일 워크플로우의 검토 또는 그 안의 에이전트나 Slack 승인 단계로 좁힐 수 있습니다. 이러한 위젯은 해당 워크플로우를 열 수 있는 모든 사람에게 이를 표시하고 열 수 없는 사람에게는 숨깁니다. [Chat](../tabs/chat-tab.md) 및 MCP `heym_chat` 도구는 위젯이 포함된 대시보드를 나열하고, 워크플로가 어떤 대시보드에 있는지 확인하며, 새 위젯을 추가하고(먼저 빈 위젯이 추가된 후 Chat이 해당 워크플로를 빌드하고 테스트함), 기존 워크플로를 위젯으로 대시보드에 배치하고, 위젯 이름을 바꾸거나 삭제하며, 정리 버튼처럼 레이아웃을 정돈합니다.

[Chart Output node](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md), [Execution History](./execution-history.md)도 참조하십시오.

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>
### [Evals](../tabs/evals-tab.md)

Evals 탭(`/evals`)에서는 평가 스위트를 생성하고, 테스트 케이스를 추가하거나 생성하며, 스위트 Prompt를 최적화하고, [Agent 노드](../nodes/agent-node.md) Workflow에 대한 평가를 실행할 수 있습니다. 하나 이상의 모델을 선택하고, 채점 방식(Exact Match, Contains, LLM-as-Judge)을 고르며, 선택적으로 별도의 모델이나 [Decision 노드](../nodes/decision-node.md)가 LLM-as-Judge 응답을 판정하도록 할 수 있습니다. 테스트당 실행 횟수(Exact Match 및 Contains의 경우 temperature와 reasoning effort 포함)를 설정한 다음, 통과/실패 여부와 모델별 출력을 비교하십시오. 과거 평가의 실행 이력을 검토하고(각 실행에서 사용한 judge 포함), 동일한 judge로 재실행하고, JSON으로 내보내며, [Traces](../tabs/traces-tab.md)에서 기반 동작을 교차 확인하십시오.

**에이전트 스위트**는 대신 단일 에이전트 노드를 검사합니다. 에이전트의 실제 실행에서 기준 지연 시간, USD 비용, 토큰 및 도구 호출을 표시하고, 각 도구, MCP 도구, 서브 에이전트, 서브 워크플로 또는 스킬을 에이전트가 호출해야 하거나 호출해서는 안 되는 항목으로 표시할 수 있도록 하며, 기준선보다 20% 높은 상한을 설정하고, 마지막 실행의 입력 또는 AI가 작성한 입력으로 선택한 횟수만큼 워크플로를 실행하며, 실패한 이유와 함께 각 실행을 채점합니다. 스위트 선택기는 두 종류를 유형과 함께 나열하고 검색할 수 있으며, [Workflow Analysis](./workflow-analysis.md) 보고서는 에이전트 또는 LLM 노드가 있는 워크플로에 대한 스위트를 제안합니다.

[Agent 노드](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md), [Execution History](./execution-history.md)도 참조하십시오.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evals 데모 보기</a></p>

### [Teams](../tabs/teams-tab.md)

Teams 탭에서는 팀을 생성하고 관리할 수 있습니다. 팀을 생성하고, 이메일로 멤버를 추가하며, 멤버를 제거할 수 있습니다(생성자는 제거할 수 없음). 각 항목의 공유 대화상자에서 [Workflow](../tabs/workflows-tab.md), [템플릿](../tabs/templates-tab.md), [Credential](../tabs/credentials-tab.md), [변수](../tabs/global-variables-tab.md), [벡터 스토어](../tabs/vectorstores-tab.md), [Drive 파일](../tabs/drive-tab.md)을 팀과 공유하십시오. 모든 팀 멤버가 접근 권한을 얻게 됩니다. 팀 이름과 설명을 편집하거나 팀을 삭제하십시오(모든 팀 공유가 제거됨).

[Teams](./teams.md), [Credential 공유](./credentials-sharing.md), [Workflow 구성](./workflow-organization.md)도 참조하십시오.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Teams 데모 보기</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

Scheduled 탭에서는 모든 활성 [Cron](../nodes/cron-node.md) Workflow를 시각적 캘린더에 표시합니다. 일, 주, 월 보기 간에 전환하여 자동화가 언제 실행되도록 예약되어 있는지 확인한 다음, 일정을 편집해야 할 때 관련 [Workflow](../tabs/workflows-tab.md)로 돌아가십시오.

[Cron](../nodes/cron-node.md), [Analytics](../tabs/analytics-tab.md), [Execution History](./execution-history.md)도 참조하십시오.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Scheduled 데모 보기</a></p>

### [Logs](../tabs/logs-tab.md)

Logs 탭에서는 Heym 스택(백엔드, 프런트엔드, PostgreSQL)의 Docker 컨테이너 로그를 표시합니다. 컨테이너를 선택하고, 로그 레벨(All, INFO, WARNING, ERROR, DEBUG)로 필터링하며, 로그 내에서 검색하십시오. 디버깅 및 문제 해결에 사용하십시오. Workflow 실행 로그(노드 결과, 출력)의 경우에는 대신 [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), 또는 편집기의 Debug 패널을 사용하십시오.

[Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), [Canvas 기능](./canvas-features.md)도 참조하십시오.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Logs 데모 보기</a></p>

### [DataTable](../tabs/datatable-tab.md)

DataTable 탭에서는 Heym 내에서 구조화된 데이터 테이블을 생성하고 관리할 수 있습니다. 타입이 지정된 열(string, number, boolean, date, JSON)을 정의하고, 인라인 더블 클릭 편집으로 행을 관리하며, CSV를 가져오기/내보내기하고, 읽기/쓰기 권한으로 사용자 또는 [팀](./teams.md)과 테이블을 공유하십시오. Workflow에서 프로그래밍 방식으로 테이블에 접근하려면 [DataTable 노드](../nodes/datatable-node.md)를 사용하십시오. 상단에 고정된 **System tables** 섹션에는 **LLM Cost Table**이 있습니다. 이는 백그라운드에서 Helicone으로부터 시딩된 모델별 가격의 고정 스키마 뷰이며(24시간 TTL, 수동 Refresh), 각 사용자는 가격을 재정의하거나 Helicone이 나열하지 않는 모델에 대한 사용자 정의 행을 추가할 수 있습니다. 이러한 가격 규칙은 [Traces](../tabs/traces-tab.md) 탭의 비용 KPI와 모델별 비용 차트를 구동합니다.

[DataTable 노드](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Workflow 구조](./workflow-structure.md), [Teams](./teams.md)도 참조하십시오.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ DataTable 데모 보기</a></p>
### [Drive](../tabs/drive-tab.md)

Drive 탭은 Workflow 전반에서 스킬에 의해 생성된 모든 파일을 표시합니다. 각 파일의 이름, 유형, 크기, 소스 노드, 생성 날짜, 팀 공유 상태를 나열하며, 검색, 인증된 다운로드, 공유, 삭제, 페이지네이션 컨트롤을 제공합니다. 이는 [File Generation](./file-generation.md), [Drive](./drive.md) 레퍼런스, [Drive 노드](../nodes/drive-node.md)와 함께하는 대시보드입니다.

[Drive](./drive.md), [File Generation](./file-generation.md), [Drive 노드](../nodes/drive-node.md)도 참조하십시오.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Drive 데모 시청</a></p>

### [Canvas 협업](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
