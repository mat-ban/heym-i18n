# Heym을 선택하는 이유

Heym은 프로덕션 환경에서 AI 에이전트를 실행하고 관리하기 위한 인프라입니다. 하나의 자체 호스팅 런타임이 에이전트 라이프사이클의 모든 단계를 포괄합니다.

프로토타입 에이전트에는 모델, Prompt, 그리고 몇 가지 도구만 있으면 됩니다. 하지만 프로덕션 에이전트에는 Trigger와 재시도, 사람을 기다릴 때 저장되는 상태, 모든 모델 및 도구 호출에 대한 기록, 각 실행에 대한 비용, 변경 사항 배포 전 테스트, 그리고 에이전트가 자율적으로 수행할 수 있는 작업에 대한 명확한 제한이 추가로 필요합니다. Heym은 이 모든 것을 한곳에서 관리하므로, 캔버스에서 설계한 시스템이 곧 실행되는 시스템입니다. 에이전트 시스템을 구축하고, 자신 있게 실행하십시오.

## 에이전트 라이프사이클을 위한 단일 런타임

| 단계 | Heym이 제공하는 것 |
|---|---|
| **Build** | 캔버스에서 에이전트와 결정적 단계를 구성하거나, [AI Assistant](../reference/ai-assistant.md)로 생성하거나, [Templates](../tabs/templates-tab.md)와 이식 가능한 스킬에서 시작하십시오. |
| **Orchestrate** | 명시적 데이터 흐름과 [병렬 실행](../reference/parallel-execution.md)을 통해 에이전트, [sub-agents](../reference/agent-architecture.md), 코딩 에이전트, RAG, 브라우저 자동화, 도구를 조정하십시오. |
| **Run** | [Webhook](../reference/webhooks.md), 스케줄, 이벤트 [Trigger](../reference/triggers.md)로 실행을 시작하고, 노드별 재시도, [오류 처리](../nodes/error-handler-node.md), 인스턴스 간 [부하 분산](../reference/cluster.md)을 활용하십시오. |
| **Observe** | [history](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md), 실행별 USD 비용, 캔버스의 실시간 실행, [analytics](../tabs/analytics-tab.md), [alerts](../tabs/alerts-tab.md), [OpenTelemetry](../reference/opentelemetry.md) 내보내기를 통해 모든 실행을 검사하십시오. |
| **Evaluate** | [Evals](../tabs/evals-tab.md)에서 예상 출력에 대해 Prompt와 모델을 테스트하고, LLM-as-Judge 점수 평가와 모델 간 비교를 활용하십시오. |
| **Control** | [검토 체크포인트](../reference/human-in-the-loop.md)와 [가드레일](../reference/guardrails.md)로 사람이 제어권을 유지하고, 암호화된 [credentials](../reference/credentials.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md), [감사 추적](../reference/audit.md)으로 접근을 관리하십시오. |
| **Expose** | Workflow를 REST와 [SSE](../reference/sse-streaming.md), [MCP](../tabs/mcp-tab.md) 도구, [Portal](../reference/portal.md) 채팅 UI, [dashboard](../tabs/dashboard-tab.md) 위젯으로 제공하십시오. |

## Build

### AI Assistant: 자연어로 Workflow 구축

[AI Assistant](../reference/ai-assistant.md)는 Workflow 편집기 내부의 채팅 패널입니다. 원하는 것을 설명하십시오. 예를 들어 "사용자 입력을 받아 내 지식 베이스를 검색하고 GPT-4o로 응답하는 Workflow를 생성해 줘"라고 입력하면, 어시스턴트가 노드와 엣지를 생성하여 즉시 캔버스에 적용합니다.

- 자체 LLM credential을 사용합니다(지원되는 모든 모델)
- **음성 입력**을 지원하여 핸즈프리로 Workflow를 설계할 수 있습니다
- AI 응답에서 유효한 Workflow JSON을 캔버스에 자동 적용합니다
- 응답을 실시간으로 스트리밍합니다

어시스턴트는 편집기 내부에서 직접 작동하며 노드를 실시간으로 캔버스에 스트리밍하고, 생성된 모든 것은 직접 배치한 노드처럼 편집 가능한 상태로 유지됩니다.

### 스킬 시스템

스킬은 이식 가능한 기능 번들로, `SKILL.md` 지침 파일과 선택적 Python 스크립트로 구성되며, 모든 Agent 노드에 적용할 수 있습니다.

- 스킬의 지침은 에이전트의 시스템 Prompt 앞에 추가됩니다
- 스킬 내 Python 파일은 호출 가능한 도구가 됩니다
- 스킬은 Workflow 간에 재사용 가능하며 `.zip` 아카이브로 공유할 수 있습니다

이는 에이전트에게 직무 기술서와 도구 상자를 한 번에 제공하는 것과 유사합니다.

### Workflow Analyzer: 실행 인식 피드백

[Workflow Analysis](../reference/workflow-analysis.md) 패널은 편집기에 내장된 실행 인식 문서화 및 피드백 도구입니다. **Analyze**를 클릭하고 LLM credential과 모델을 선택하면, Heym이 현재 Workflow에 대한 편집 가능한 Markdown 보고서를 생성합니다.

정적 메모와 달리, 분석기는 가능한 경우 먼저 Workflow를 실행하고 실행 결과를 Prompt에 포함합니다. 보고서는 개선 영역, Workflow의 목적, 노드가 수행하는 작업에 대한 단계별 설명을 다룹니다. 보고서가 이미 존재하는 경우, **Reanalyze**는 별도의 미리보기를 스트리밍하여 새 버전을 수락하거나 현재 공유 문서를 유지할 수 있습니다.

## Orchestrate

### 내장 LLM 및 Agent 노드

Heym의 [Agent 노드](../nodes/agent-node.md)는 인라인 Python 도구, MCP 연결, 그리고 이식 가능한 스킬 시스템을 갖춘 긴밀하게 통합된 도구 호출 루프를 실행하며, 이 모든 것은 프로덕션 에이전트를 위해 설계되었습니다.

Heym의 일반 [LLM 노드](../nodes/llm-node.md) 또한 단일 Prompt-응답 단계를 넘어섭니다. 지원되는 OpenAI 및 OpenAI 호환 Endpoint의 경우, **Batch API 모드**로 전환하여 하나의 노드가 더 저렴한 비용의 공급자 네이티브 배치 요청으로 Prompt 배열을 제출할 수 있습니다. 그러면 캔버스는 배치가 `pending`, `processing`, `completed`와 같은 상태를 거칠 때마다 실행되는 전용 `batchStatus` 분기를 노출합니다.

즉, LLM 노드는 동시에 두 가지를 수행할 수 있습니다:

- 메인 배치 요청을 실행하고 일반 분기에서 항목별 최종 출력을 반환합니다
- 흐름을 사용자 정의 폴링 루프로 만들지 않고도 모든 의미 있는 배치 상태 업데이트마다 알림 또는 로깅 로직을 실행합니다

배치 실행은 노드 UI에서 공급자 및 모델 기능 검사를 포함하는 일급 LLM Workflow 기본 요소입니다.

**Agent 노드**는 Heym에서 에이전트 오케스트레이션의 핵심입니다:

- **도구 호출** – 에이전트는 최종 답변을 생성할 때까지 루프에서 도구 호출을 반복합니다
- **Python 도구** – 완전한 Python으로 인라인 사용자 정의 도구를 정의하면 에이전트가 런타임에 이를 호출합니다
- **MCP 연결** – 모든 [Model Context Protocol](https://modelcontextprotocol.io/) 서버(stdio 또는 SSE)에 연결하면 에이전트가 모든 도구를 자동으로 가져옵니다
- **스킬** – `.zip` 또는 `.md` 파일을 에이전트에 드롭하여 시스템 컨텍스트를 확장하고 Python 도구를 추가합니다
- **Sub-workflow 호출** – 에이전트는 다른 Heym Workflow를 도구로 호출하여 사용자 정의 코드 없이 복잡한 동작을 구성할 수 있습니다

전체 참조는 [Agent 노드](../nodes/agent-node.md) 및 [Agent 아키텍처](../reference/agent-architecture.md)를 참조하십시오.

### 멀티 에이전트 오케스트레이션

Heym은 일급 시각적 기본 요소를 갖춘 **오케스트레이터 패턴**을 지원합니다:

- 하나의 에이전트가 **오케스트레이터**(`isOrchestrator: true`) 역할을 하며 `call_sub_agent` 도구를 부여받습니다
- 동일한 캔버스에서 명명된 **서브 에이전트**에게 작업을 위임합니다
- 서브 에이전트는 다른 에이전트나 Sub-workflow를 호출할 수 있습니다(최대 깊이: 5)
- **병렬 실행**: 오케스트레이터가 한 턴에서 여러 서브 에이전트를 호출하면 더 빠른 결과를 위해 병렬로 실행됩니다

이를 통해 작업을 연구원, 코더, 요약자에게 라우팅하는 계획 에이전트와 같은 아키텍처를 사용자 정의 오케스트레이션 코드 없이 시각적으로 구성할 수 있습니다.

실행 세부 사항은 [Agent 아키텍처](../reference/agent-architecture.md)를 참조하십시오.

### Workflow 노드로서의 코딩 에이전트

Heym은 채팅 완성이 아닌 Workflow 단계로 실제 코딩 에이전트를 실행하는 두 개의 노드를 제공합니다:

- **[Codex 노드](../nodes/codex-node.md)** – 격리된 Heym 워크스페이스에서 GitHub 리포지토리에 대해 OpenAI Codex CLI를 실행합니다. **Sign in with ChatGPT**(Plus/Pro 구독에서 PKCE OAuth, Token당 API 비용 없음) 또는 액세스 Token을 지원하며, 리포지토리를 복제하고 Codex가 코드를 편집하도록 한 뒤 `summary`, `diff`, `changedFiles`, 그리고 초안 `pullRequestUrl`을 반환합니다.
- **[OpenCode Go 노드](../nodes/opencode-go-node.md)** – 공급자에 구애받지 않는 OpenCode 게이트웨이(Kimi, DeepSeek, Qwen 등)를 통한 동일한 리포지토리 Workflow로, **강화된 일회용 컨테이너**에서 실행됩니다: 모든 기능이 제거되고, 읽기 전용 루트, pid/메모리/CPU 제한이 적용됩니다. GitHub Token은 샌드박스 외부에 유지됩니다: Heym이 모든 git 및 GitHub 작업을 호스트 측에서 수행하므로 생성된 코드가 push 자격 증명을 유출할 수 없습니다.

즉, Workflow가 Webhook에서 버그를 분류하고, 리포지토리를 코딩 에이전트에 넘기고, 초안 PR을 기다린 뒤 Slack에 링크를 게시하는 전 과정을 완전 자동화할 수 있으며, 배포별로 리소스 제한을 구성할 수 있습니다.

### 내장 RAG 파이프라인

Heym은 [RAG / Vector Store 노드](../nodes/rag-node.md)와 관리형 [Vectorstores](../tabs/vectorstores-tab.md) 탭을 포함합니다. 다음을 수행할 수 있습니다:

- 벡터 백엔드 선택: **Qdrant**(외부 서버) 또는 **Postgres (pgvector)** — 후자는 추가 서비스 실행 없이 Heym 자체 데이터베이스에 벡터를 저장합니다
- Workflow 노드에서 직접 벡터 스토어에 문서 삽입
- 시맨틱 검색을 수행하고 결과를 LLM 또는 Agent 노드에 공급
- `$ragNode.results.map("item.payload.content").join("\n\n")`와 같은 표현식으로 결과 참조

Heym에서 RAG는 임베딩과 검색을 완전히 제어할 수 있는 두 개의 노드입니다.

### Playwright를 사용한 브라우저 자동화

[Playwright 노드](../nodes/playwright-node.md)는 캔버스에서의 자사 브라우저 자동화입니다.

- **Steps 모드** – navigate, click, type, fill, screenshot, extract, scroll 작업을 시각적으로 구성합니다
- **자동 복구 기능이 있는 AI 단계** – 자연어로 작업을 설명하면 LLM이 Playwright 작업을 생성합니다. 실패한 선택자는 자동으로 복구될 수 있으며, 생성된 단계는 캐시되어 향후 LLM 호출을 건너뛸 수 있습니다
- **Run Code 모드** – 복잡한 흐름을 위해 노드를 전체 Playwright Python으로 전환합니다(기본적으로 비활성화되며, 활성화 시 Heym의 강화된 샌드박스에서 실행됩니다)
- **인증된 세션** – 실행 전에 쿠키/`storageState`를 복원하고, 선택자 검사로 로그인을 확인하며, 스크립트 로그인 단계로 폴백합니다
- **네트워크 캡처** – 선택적으로 결과와 함께 JSON 응답, 헤더, 쿠키, 브라우저 스토리지를 수집합니다

Heym은 브라우저를 다른 모든 것과 동일한 표현식, 자격 증명, 오류 처리를 갖춘 일반 노드로 취급합니다.

### Expression DSL

Heym의 [Expression DSL](../reference/expression-dsl.md)은 상위 노드 데이터를 참조하기 위한 깔끔하고 강력한 구문을 제공합니다:

- `$input.text` – Input 노드 데이터
- `$nodeName.field` – 모든 상위 노드의 출력 필드
- `$global.variableName` – 영구 전역 변수
- 배열 헬퍼: `.first()`, `.map("field")`, `.join("\n")`

Expression은 Prompt, HTTP 헤더, 조건, 설정 값 등 모든 문자열 필드에서 동작하므로 데이터가 단계 간에 명시적으로 이동합니다. 이 DSL은 완전한 JavaScript 지식 없이도 강력함과 가독성의 균형을 유지합니다.

## Run

### Triggers, Retries, and Error Paths

Workflow는 다양한 위치에서 시작할 수 있습니다. [Input](../nodes/input-node.md) 노드는 HTTP [Webhook](../reference/webhooks.md)을 수신하고, [Cron](../nodes/cron-node.md)은 스케줄에 따라 실행되며, 이벤트 [Trigger](../reference/triggers.md)는 Telegram, Discord, Slack, IMAP 받은편지함, WebSocket 스트림, RabbitMQ 큐, 파일 업로드, Heym 플랫폼 이벤트로부터 실행을 시작합니다.

실패는 그래프 내부에서 처리됩니다. 모든 노드는 실패 시 설정된 횟수만큼 재시도하고 시도 사이에 대기할 수 있으며, 각 시도는 [실행 이력](../reference/execution-history.md)에 기록되고, 노드가 실패하면 [Error Handler](../nodes/error-handler-node.md) 노드가 자동으로 실행되므로 복구가 Workflow 자체의 일부가 됩니다.

### Parallel DAG Execution

Heym의 Workflow 실행기는 방향성 비순환 그래프(DAG) 스케줄러를 사용합니다. 독립적인 노드는 별도의 설정 없이 자동으로 병렬 실행됩니다.

- 동일한 의존성 수준의 노드는 스레드 풀(`max_workers=8`)에 동시에 디스패치됩니다
- 노드가 완료되는 즉시 해당 하위 노드가 스케줄링됩니다
- [Merge Node](../nodes/merge-node.md)는 병렬 분기의 결과를 결합합니다
- 여러 Workflow 실행이 동시에 수행되며, 각 실행은 완전히 격리됩니다

병렬성은 그래프 구조에 의해 결정되는 기본 동작입니다.

[Parallel Execution](../reference/parallel-execution.md)을 참조하십시오.

### Scale Across Instances

두 번째 Heym 인스턴스를 동일한 PostgreSQL 데이터베이스에 연결하면 Worker로 참여합니다. 백그라운드 실행은 설정한 가중치에 따라 인스턴스 간에 공유되며, 선출된 리더 한 대가 장애 조치를 통해 스케줄, 알림 평가, 충돌 복구를 지속적으로 수행하고, 모든 실행은 이를 수행한 인스턴스를 기록합니다. [Load Distribution](../reference/cluster.md)을 참조하십시오.

### Agentic Kanban Board

[Board 탭](../tabs/board-tab.md)은 컬럼 자체가 Workflow를 실행하는 내장 Kanban 보드입니다. 카드는 컨텍스트, 대화 이력, 실행 상태, 출력, Workflow 실행을 담는 영구적인 에이전트 작업입니다.

- **컬럼 Workflow 체인** – 카드를 컬럼으로 이동하면 해당 컬럼의 Workflow 체인이 Trigger됩니다. **Agentic Kanban Model**(사용자의 자격 증명 + 모델)이 카드 내용을 Workflow 입력으로 매핑하고 출력을 다시 읽을 수 있는 텍스트로 변환합니다
- **카드 첨부 파일** – 카드에 파일을 드롭하면, 각 실행 전에 문서는 텍스트로 추출되고 이미지는 비전 지원 모델로 전달됩니다
- **실시간 실행 캔버스** – 카드 내에서 활성 실행을 열고 실제 Workflow 캔버스에서 노드별로 실행되는 모습을 확인할 수 있습니다
- **팀 공유** – 읽기/쓰기 권한으로 사용자 또는 팀과 보드를 공유할 수 있습니다. 공유 보드의 체인은 소유자의 자격 증명으로 실행되므로 협업자는 자신의 자격 증명이 필요하지 않습니다
- **실패 가시성** – 실패한 카드는 오류 이력 표시기를 노출하며, 후속 실행은 댓글을 기다리기 위해 일시 중지될 수 있습니다

보드는 플랫폼의 네이티브 표면으로, 카드, Workflow, 자격 증명, 실시간 실행이 모두 한곳에 있습니다.

### Heym Drive: Built-In File Storage

[Drive 탭](../tabs/drive-tab.md)은 플랫폼에 내장된 파일 저장소입니다. Skill과 Workflow에서 생성된 파일(PDF, DOCX, CSV, 이미지)이 자동으로 이곳에 저장되며, Board 카드 첨부 파일도 여기에 보관됩니다.

- **공유 링크** – 만료 및 최대 다운로드 제한을 선택적으로 설정할 수 있는 공개 또는 비밀번호 보호(Basic Auth) 다운로드 링크
- **팀 공유** – 팀과 파일을 읽기 전용으로 공유하고, 한 번의 작업으로 모든 팀 공유를 제거할 수 있습니다
- **일괄 작업** – Shift-클릭 범위로 다중 선택하고, 선택 항목을 단일 ZIP 다운로드로 묶거나, 하나의 공유/비밀번호/삭제 설정을 여러 파일에 한 번에 적용할 수 있습니다
- **Agent 접근** – Skill은 Drive 파일을 읽도록 선택할 수 있으므로, Agent가 사용자 또는 다른 Workflow가 생성한 문서를 처리할 수 있습니다

생성된 산출물은 플랫폼 내에서 영구적이고 공유 가능한 저장 위치를 갖습니다.

## Observe

### LLM Traces

[Traces 탭](../tabs/traces-tab.md)은 모든 LLM 호출에 대한 완전한 관측성을 제공합니다:

- 요청 및 응답 Payload
- 호출별 타이밍: `llm_ms`, `tools_ms`, `mcp_list_ms`
- 도구 호출 이름, 인수, 결과
- 모델에 전달된 Skill

Trace 시스템은 완전한 요청 및 응답 Payload와 호출별 타이밍을 통해 에이전트 동작을 디버깅하기 위해 특별히 설계되었습니다.

### LLM Token 비용 추적

Heym의 모든 LLM 호출은 자동으로 비용이 산정됩니다. [Traces 탭](../tabs/traces-tab.md)은 동기화된 가격 테이블에서 산출된 실시간 USD 비용과 함께 트레이스별 입력 및 출력 Token 수를 표시합니다.

- **트레이스별 비용** – 모든 트레이스 행에 입력 Token, 출력 Token, 총 USD가 표시됩니다
- **비용 분석** – KPI 카드와 모델별 비용 차트가 선택한 시간 범위(1h / 24h / 7d / 30d / All)에 따라 갱신됩니다
- **LLM Cost Table** – [DataTable 탭](../tabs/datatable-tab.md)의 시스템 테이블이 24시간마다 Helicone에서 시드되며, 아직 등록되지 않은 모델의 가격을 재정의하거나 사용자 정의 행을 추가할 수 있습니다
- **가격 누락 경고** – 가격 항목이 없는 모델의 트레이스에는 비용 테이블로 직접 연결되는 인라인 경고가 표시됩니다

모든 실행은 모델별로 세분화된 자체 USD 비용을 가집니다.

### 라이브 캔버스에서 프로덕션 실행 열기

프로덕션 Workflow는 편집기 외부에서 시작된 후에도 검사 가능한 상태로 유지됩니다. 두 History 대화 상자 중 하나에서 **Running** 항목을 열거나, Agentic Kanban 카드 내부의 활성 실행을 열면 Heym이 해당 실행에 일반 Workflow 편집기를 연결합니다.

- 이미 완료된 노드는 결과와 함께 즉시 표시됩니다
- 현재 노드와 대기 중인 다운스트림 노드는 실행이 진행됨에 따라 계속 펄스 표시됩니다
- Debug 패널은 캔버스에서 시작된 실행과 동일한 증분 노드 결과를 수신합니다
- 최종 출력과 실행 하이라이트는 폴링이나 중복 실행 시작 없이 도착합니다
- 편집기를 닫으면 관찰자 연결만 끊기며, 프로덕션 Workflow는 절대 취소되지 않습니다

관찰자는 크로스 워커 실행 스냅샷을 기반으로 하는 SSE를 사용하므로, 다른 백엔드 워커가 실행을 소유한 경우에도 Webhook, schedule, chat, MCP, integration, Board Trigger에서 작동합니다.

### OpenTelemetry, 분석 및 알림

Heym은 모든 Workflow 실행, 노드 실행, Agent 도구 호출에 대해 [OpenTelemetry](../reference/opentelemetry.md) span을 내보내며, OTLP/HTTP를 통해 Jaeger, Grafana Tempo, Honeycomb, Datadog 또는 기타 호환 백엔드로 전송합니다.

[Analytics](../tabs/analytics-tab.md) 탭은 Workflow별 실행 횟수, 성공률, 소요 시간, 추세를 추적합니다. [Alerts](../tabs/alerts-tab.md)는 시간 창 동안의 오류 횟수, 실행 소요 시간, Token 또는 USD 지출, 실행량을 감시한 후 선택한 notify Workflow를 실행하므로, 알림이 Slack, 이메일, Telegram 또는 노드가 도달할 수 있는 어디든 전달됩니다.

## Evaluate

### 내장 Evals

[Evals 탭](../tabs/evals-tab.md)에서는 테스트 스위트를 정의하고 Agent Workflow에 대해 실행할 수 있습니다:

- 입력과 예상 출력으로 테스트 케이스를 생성하거나, 스위트 Prompt에서 생성합니다
- 하나의 스위트를 여러 모델에 대해 실행하고 출력을 나란히 비교합니다
- Exact Match, Contains 또는 독립적인 judge 모델을 사용한 LLM-as-Judge로 채점합니다
- 통과/실패, 실제 vs 예상, 실행 이력을 검토합니다

Prompt나 모델을 변경한 후 스위트를 재실행하고, 변경 사항이 프로덕션에 도달하기 전에 결과를 비교하십시오.

## Control

### Human-in-the-Loop (HITL)

Heym에는 Agent가 실행을 일시 중지하고, 사람의 검토를 요청하고, 중단된 지점에서 정확히 재개할 수 있게 하는 내장 [Human-in-the-Loop](../reference/human-in-the-loop.md) 시스템이 있습니다.

- **Agent 체크포인트** – 모든 Agent 노드에서 `hitlEnabled`를 활성화하면 `request_human_review` 도구가 제공됩니다. Agent는 결정에 사람의 감독이 필요하다고 판단될 때 요약과 초안과 함께 이 도구를 호출합니다.
- **공개 검토 URL** – 각 검토 요청은 `/review/{token}`에 보안 일회용 링크(168시간 TTL)를 생성합니다. 검토자는 로그인 없이 **accept**, **edit & continue**, 또는 **refuse**할 수 있습니다.
- **실행 스냅샷** – Workflow는 전체 상태(대화 이력, 변수, 도구 결과)를 동결하므로, 검토자가 응답한 후 일시 중지된 지점에서 정확히 재개됩니다.
- **알림 분기** – 선택적 `review` 출력 핸들을 통해 검토가 요청될 때 발동하는 알림 흐름(Slack, 이메일, Webhook)을 연결할 수 있습니다.
- **MCP 도구 승인 정책** – 작성된 HITL 가이드라인이 승인 범위(`always` / `once` / `never`)로 해석되므로, Agent는 저위험 도구를 자동 승인하고 고위험 도구를 에스컬레이션할 수 있습니다.
- **다중 체크포인트** – 단일 Agent 실행은 검토를 위해 여러 번 일시 중지될 수 있으며, 각 체크포인트는 독립적입니다.

공개 검토 URL, edit-and-continue, 알림 분기, 스냅샷 기반 재개는 모두 동일한 Agent 체크포인트에서 작동합니다.

전체 참조는 [Human-in-the-Loop](../reference/human-in-the-loop.md)를 참조하십시오.

### LLM Guardrails

Heym은 [LLM](../nodes/llm-node.md) 및 [Agent](../nodes/agent-node.md) 노드 모두에 내장 [Guardrails](../reference/guardrails.md)를 제공하므로, 모델 응답이 다운스트림 단계에 도달하기 전에 안전하지 않은 콘텐츠를 차단할 수 있습니다.

- **노드 수준 안전 토글** – 사용자 대면 콘텐츠를 생성하거나 처리하는 노드에서 직접 Guardrails를 활성화합니다
- **광범위한 정책 커버리지** – 폭력, 혐오 발언, 성적 콘텐츠, NSFW/욕설, 괴롭힘, 불법 활동, 개인정보 요청, Prompt injection 시도를 차단합니다
- **다국어 감지** – 터키어, 영어, 아랍어, 스페인어 및 기타 언어에 동일한 안전 규칙을 적용합니다
- **Workflow 네이티브 폴백** – 메시지가 차단되면 노드는 [Error Handler](../nodes/error-handler-node.md)를 통해 라우팅할 수 있는 타입화된 Workflow 오류를 발생시킵니다

안전 정책은 LLM 및 Agent 구성 내부에 직접 존재하며 Workflow 분기와 오류 처리에 바로 연결됩니다.

### 액세스, 자격 증명 및 감사

Agent는 실제 자격 증명으로 작동하므로, 액세스는 거버넌스의 일부입니다. [자격 증명](../reference/credentials.md)은 저장 시 암호화되고, 생성 후 마스킹되며, 사용자 또는 [팀](../reference/teams.md)과 공유할 수 있습니다. 또한 팀은 Workflow, 변수, 벡터 스토어, Drive 파일도 공유합니다. [싱글 사인온](../reference/sso.md)은 Okta, Entra ID, Keycloak, Auth0, Google을 포함한 모든 OpenID Connect 제공자와 연결됩니다. [감사 추적](../reference/audit.md)은 모든 보안 관련 작업을 수행자, 대상, 결과와 함께 기록하며, 이미 운영 중인 로그 수집기 또는 SIEM으로 컨테이너 로그와 함께 스트리밍됩니다.

### 셀프 호스팅, 데이터를 직접 소유합니다

Heym은 귀하의 인프라에서 실행됩니다. Workflow, 자격 증명, 실행 이력, 트레이스는 귀하의 데이터베이스에 저장되며, 모델 호출은 귀하의 서버에서 선택한 제공자로 전달되거나 Ollama 또는 vLLM을 통해 직접 호스팅하는 모델로 전달됩니다. 민감한 문서, 고객 데이터, 독점 지식 베이스를 처리하는 Agent에게 이는 종종 필수 요건입니다.

Heym은 **MIT License with the Commons Clause 조건**에 따라 라이선스가 부여됩니다. 소스 코드는 소스 공개(source-available) 방식입니다. 자유롭게 사용, 수정, 셀프 호스팅할 수 있습니다. Commons Clause는 소프트웨어 판매를 제한하며, 이는 Heym에서 실질적인 가치를 파생하는 유료 호스팅 또는 컨설팅/지원 서비스 제공을 포함합니다. 상업적 라이선스, 엔터프라이즈 배포 또는 전문 지원이 필요하시면 [enterprise@heym.run](mailto:enterprise@heym.run)으로 문의하십시오.

## 노출

### API 및 스트리밍

Workflow는 `/api/workflows/{workflow_id}/execute`에서 HTTP로 호출 가능하며 JSON을 반환하고, `/api/workflows/{workflow_id}/execute/stream`에서는 실행이 진행되는 동안 노드 이벤트를 Server-Sent Events로 스트리밍합니다. 두 Endpoint 모두 Workflow 수준의 인증, 속도 제한, 응답 캐싱을 공유합니다. [Webhook](../reference/webhooks.md) 및 [SSE 스트리밍](../reference/sse-streaming.md)을 참조하십시오.

### MCP (Model Context Protocol) 통합

Heym은 양측 모두에서 네이티브 [MCP](../tabs/mcp-tab.md) 지원을 제공합니다:

- **클라이언트로서**: Agent 노드가 stdio 또는 SSE를 통해 외부 MCP 서버(Filesystem, Browserbase, 사용자 정의 도구)에 연결하고 해당 도구를 자동으로 사용합니다
- **서버로서**: MCP가 활성화된 Workflow는 `/api/mcp/sse`의 기본 서버 또는 자체 URL과 API key를 가진 명명된 서버에서 도구가 되어, Claude Desktop, Cursor 및 기타 MCP 클라이언트가 귀하의 Heym Workflow를 직접 호출할 수 있습니다

Agent는 여러 MCP 서버를 동시에 사용할 수 있으며, 모든 Workflow는 외부 MCP 클라이언트의 도구가 될 수 있습니다.

### Portal: Workflow를 채팅 UI로 게시

[Portal](../reference/portal.md) 기능은 모든 Workflow를 `/chat/{slug}`에서 공개 채팅 인터페이스로 전환합니다:

- 사용자별 자격 증명을 통한 선택적 인증
- 스트리밍 실행 (실시간 노드 진행 상황)
- 파일 업로드 지원
- 다중 턴 대화 이력

팀은 프론트엔드 코드를 작성하지 않고도 Workflow와 URL만으로 내부 도구, 고객 대면 챗봇, AI 기반 양식을 출시할 수 있습니다.

### Workflow 기반 대시보드

[Dashboard 탭](../tabs/dashboard-tab.md)은 사용자가 직접 구축하는 리포팅 화면으로, 모든 차트 위젯이 자체적인 숨겨진 Heym Workflow에 의해 구동됩니다. 위젯은 API를 호출하고, BigQuery를 쿼리하고, RAG/벡터 스토어를 검색하고, LLM 단계를 실행하고, 행을 변환한 뒤 [Chart Output 노드](../nodes/chart-output-node.md)로 마무리할 수 있습니다. 위젯을 수동으로 생성하거나, AI로 생성하거나, 나중에 세부 조정하거나, 결과를 캐싱하거나, 그리드를 시각적으로 재배치할 수 있습니다.

## Workflow 자동화 도구와의 비교

많은 팀이 Workflow 자동화 도구에서 Heym으로 넘어옵니다. 아래 표는 Agent가 프로덕션에서 실행될 때 중요한 역량을 기준으로 Heym을 n8n, Zapier, Make.com과 비교하며, 표 아래의 각주는 비교의 근거가 된 공식 문서를 인용합니다. 각 도구를 하나씩 더 깊이 살펴보려면 [heym.run/compare](https://heym.run/compare)의 비교 페이지를 참조하십시오.

| 역량 | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| 내장 LLM 노드 | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + 상태 분기 | ✓ | 제한적¹¹ | –¹¹ | 제한적¹¹ |
| 내장 Agent 노드 (도구 호출) | ✓ | ✓ | ✓ | ✓ |
| 멀티 Agent 오케스트레이션 | ✓ | ✓ | 제한적 | 제한적 |
| 코딩 Agent 노드 (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| 내장 RAG / 벡터 스토어 | ✓ | ✓ | 제한적¹ | 플러그인² |
| WebSocket 읽기 / 쓰기 | ✓ | 제한적¹² | –¹³ | –¹⁴ |
| 자연어 Workflow 빌더 | ✓ | 제한적³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| 실행 중인 run을 라이브 캔버스에서 열기 | ✓ | 제한적¹⁹ | 제한적¹⁹ | –¹⁹ |
| Workflow 기반 대시보드 | ✓ | 제한적¹⁷ | 제한적¹⁷ | 제한적¹⁷ |
| Agentic Kanban 보드 | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Agent용 Skills 시스템 | ✓ | – | – | – |
| 내장 파일 드라이브 (공유 링크, 팀) | ✓ | 제한적²² | 제한적²² | –²² |
| 브라우저 자동화 노드 (Playwright) | ✓ | 제한적²³ | 제한적²³ | –²³ |
| LLM trace 검사 | ✓ | 제한적⁴ | – | ✓ |
| OpenTelemetry tracing 내보내기 | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM Token 비용 추적 (USD) | ✓ | –¹⁵ | –¹⁵ | 제한적¹⁵ |
| AI Workflow용 내장 evals | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | 제한적⁶ | 제한적⁷ |
| LLM 가드레일 | ✓ | ✓⁸ | ✓⁸ | 제한적⁸ |
| 자동 컨텍스트 압축 | ✓ | – | – | – |
| 병렬 DAG 실행 | ✓ | 제한적⁹ | – | – |
| 자체 호스팅 가능, 소스 공개 | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| 동적 데이터용 Expression DSL | ✓ | ✓ | 제한적 | ✓ |

> **각주:** ¹ Zapier Knowledge Sources — 노출된 벡터 스토어나 임베딩 제어 기능이 없습니다. ² Make.com에는 Pinecone/Qdrant 모듈이 있으나 네이티브 RAG 노드는 없습니다. ³ n8n AI Workflow Builder는 크레딧 상한이 있는 클라우드 전용 베타입니다. ⁴ n8n은 중간 단계를 표시하나 전체 추적에는 서드파티 도구가 필요합니다. ⁵ n8n은 채팅, 이메일, 협업 채널을 통한 AI 도구 호출 승인을 지원하나, Heym처럼 전체 실행을 스냅샷하고 재개하지는 않습니다. ⁶ Zapier Human in the Loop는 Zaps 내부에서 승인과 데이터 수집을 지원하나, 공개 검토 및 스냅샷 재개 체크포인트 시스템은 아닙니다. ⁷ Make.com은 Human in the Loop를 검토 요청과 조정/승인/취소 결과를 갖춘 Enterprise 앱으로 제공하나, 여전히 플랜 제한이 있고 에이전트 네이티브 특성이 떨어집니다. ⁸ n8n은 전용 Guardrails 노드를 제공하고, Zapier는 AI 제품 전반에 AI Guardrails를 제공하며, Make.com은 에이전트 규칙과 검토 흐름을 문서화하나 이에 상응하는 독립형 가드레일 기능은 없으므로 Make는 제한으로 표시합니다. ⁹ n8n은 기본적으로 순차 실행하며, 병렬 처리를 위해서는 하위 Workflow 우회 방법이 필요합니다. ¹⁰ Sustainable Use License — 내부 사용을 위한 자체 호스팅은 무료이나 상업적 재배포는 제한됩니다. ¹¹ 2026년 4월 22일 기준, n8n의 공식 문서는 네이티브 LLM 배치 상태 분기가 아닌 HTTP 배칭 및 루프/대기 패턴을 설명하고, Zapier의 공식 ChatGPT 앱 문서는 Trigger를 나열하지 않으며 일반적인 API Request 베타만 제공하며, Make의 공식 OpenAI 통합 페이지는 create/watch completed와 같은 배치 액션을 노출하나 일급 상태 분기 LLM 노드는 제공하지 않으므로, 이 특정 Workflow 패턴에 대해 n8n/Make는 제한으로, Zapier는 사용 불가로 표시합니다. ¹² n8n의 공식 문서는 HTTP Webhook 및 HTTP Request 노드와 Code/커스텀/커뮤니티 확장성을 다루나, 자사 WebSocket Trigger/전송 노드를 찾을 수 없으므로 n8n은 제한으로 표시합니다. ¹³ Zapier의 공식 문서는 인바운드 Webhook과 아웃바운드 Webhook/API 요청을 HTTP를 통해서만 다루며, 네이티브 WebSocket Trigger나 전송 단계는 다루지 않습니다. ¹⁴ Make의 공식 문서는 Webhooks 모듈과 HTTP(S) 요청 모듈을 다루나, 네이티브 WebSocket Trigger나 전송 모듈을 찾을 수 없습니다. ¹⁵ n8n에는 네이티브 LLM Token 비용 추적 기능이 없으며, 커뮤니티 우회 Workflow가 존재하나 수동 설치와 실행 후 API 호출이 필요합니다(2026년 5월 기준 오픈 기능 요청). Zapier는 사용자에게 실행별 Token 수나 USD 비용을 노출하지 않으며, AI 단계는 Task만 소비합니다. Make.com의 크레딧 대시보드는 Make 호스팅 AI에 대한 Token 소비를 부분적으로 반영하나(2025년 8월 이후), 서드파티 API 키 연결은 1 operation = 1 credit으로 청구되어 Token 집계가 없으며, 모델별 실행별 USD 내역은 제공되지 않습니다. ¹⁶ Heym은 네이티브 OpenTelemetry span(Workflow 실행당 하나, 노드당 하나)을 OTLP/HTTP를 통해 호환 백엔드로 전송하며, W3C trace-context 전파를 지원하고 계측 코드가 필요 없으며, `HEYM_OTEL_*` 환경 변수로 구성하고 기본적으로 비활성화됩니다. n8n은 Workflow 및 노드 실행을 위한 문서화된 OpenTelemetry 추적 통합을 갖추고 있습니다. Zapier와 Make.com은 2026년 6월 기준으로 Workflow/시나리오 실행의 OpenTelemetry 내보내기를 문서화하지 않습니다. ¹⁷ n8n은 프로덕션 실행 지표를 위한 Insights 대시보드를 문서화하고, Zapier는 Zap History와 Task Usage를 문서화하며, Make.com은 Scenario History를 문서화하나, 이들은 모니터링/이력 표면이며 Heym의 Dashboard 탭처럼 임의의 Workflow 로직으로 뒷받침되는 커스텀 대시보드 위젯은 아닙니다. ¹⁸ Heym Workflow Analyzer는 가능한 경우 Workflow를 실행하고, 실행 결과를 읽으며, 개선 영역, 목적, 단계별 동작을 다루는 공유 편집 가능 Markdown 보고서를 생성합니다. n8n은 Workflow 생성/개선/디버깅을 위한 AI Workflow Builder를 문서화하고, Zapier는 오류 발생 Zap 실행에 대한 AI 문제 해결을 문서화하며, Make.com은 시나리오 이력과 AI 에이전트 추론 단계를 문서화하나, 이들의 공개 문서는 동일한 실행 인식 공유 Workflow 분석 문서를 설명하지 않습니다. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/)는 실행 중인 실행을 나열하고 이전 실행의 데이터를 편집기로 불러올 수 있으며, [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows)는 편집기에서 실행 중 상태를 노출합니다. [Make Scenario History](https://help.make.com/scenario-history)는 실행 세부 정보와 로그를 문서화합니다. 2026년 7월 18일 기준으로 확인한 이들의 공개 문서는 Heym의 정확한 흐름 — History나 Kanban 카드에서 임의의 진행 중 프로덕션 실행을 열고, 현재 노드 스냅샷을 복원하며, 동일한 캔버스에서 노드 애니메이션과 Debug 로그를 계속 수신하는 것 — 을 설명하지 않습니다. ²⁰ Heym의 [Codex](../nodes/codex-node.md) 및 [OpenCode Go](../nodes/opencode-go-node.md) 노드는 격리된 Heym 워크스페이스에서 GitHub 리포지토리에 대해 실제 코딩 에이전트 CLI를 실행합니다 — clone, 편집, diff 생성, 브랜치 push, pull request 열기 — 를 일급 Workflow 단계로 수행합니다. 2026년 7월 20일 기준으로 어떤 경쟁자도 이에 상응하는 것을 문서화하지 않았습니다: n8n의 [OpenAI node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai)는 채팅/어시스턴트 API 호출을 다루며 리포지토리 수준 코딩 에이전트는 아니고, 네이티브 Codex 지원은 여전히 커뮤니티 요청입니다. Zapier 자체 블로그는 반대 방향 — [Codex driving Zapier tools through Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — 을 문서화하며, Codex를 Zap 단계로 다루지 않습니다. Make.com의 OpenAI 모듈은 completions/assistants/batch 액션을 노출하나 리포지토리를 clone하고 PR을 여는 코딩 에이전트는 아닙니다. ²¹ Heym의 [Board tab](../tabs/board-tab.md)은 컬럼이 Workflow를 실행하고 카드가 컨텍스트, 대화 이력, 실행 상태, 실행을 담는 내장 에이전틱 Kanban 보드입니다. n8n([Kanban Tool integration](https://n8n.io/integrations/kanban-tool/)), Zapier([Kanban Tool integrations](https://zapier.com/apps/kanbantool/integrations)), Make.com([Kanban Tool integration](https://www.make.com/en/integrations/kanban-tool))은 Kanban Tool, Wekan, NocoDB와 같은 서드파티 칸반 앱에 연결할 뿐이며, 2026년 7월 20일 기준으로 자체 Workflow를 실행하는 내장 보드를 문서화한 곳은 없습니다. ²² n8n은 실행 바이너리 데이터를 내부적으로 저장하나(선택적으로 [S3-compatible external storage](https://docs.n8n.io/hosting/scaling/external-storage/)에 저장), 공유 링크나 팀 공유 기능이 있는 사용자 대상 파일 드라이브를 문서화하지 않으므로 제한으로 표시합니다. Zapier의 [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations)는 Zap 실행 기간 동안만 파일을 처리하고 [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps)는 작은 텍스트 값을 보관하므로 Zapier는 제한으로 표시합니다. Make.com의 [data stores](https://help.make.com/l6du-data-stores)는 구조화된 레코드를 보관하고 [file handling](https://help.make.com/working-with-files)은 영구 내장 스토리지 없이 앱 간에 파일을 전달하므로 Make는 사용 불가로 표시합니다. ²³ Heym의 [Playwright node](../nodes/playwright-node.md)는 시각적 단계 모드, AI 생성 단계, 전체 코드 모드를 갖춘 자사 브라우저 자동화입니다. n8n은 [n8n-playwright](https://github.com/toema/n8n-playwright)와 같은 커뮤니티 패키지만 제공하며 [네이티브 브라우저 자동화 노드에 대한 기능 요청](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796)은 여전히 열려 있으므로 제한으로 표시합니다. Zapier Agents는 [웹 브라우징과 Chrome 확장 프로그램을 통해 페이지를 탐색하고 읽을 수 있으나](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), Zapier는 스크립트 기반 브라우저 자동화 단계를 문서화하지 않으므로 제한으로 표시합니다. Make.com은 2026년 7월 20일 기준으로 네이티브 브라우저 자동화 모듈이 아닌 HTTP 모듈과 서드파티 스크래핑 앱을 문서화합니다.

## 관련 문서

- [소개](./introduction.md) – 플랫폼 개요
- [빠른 시작](./quick-start.md) – 첫 번째 Workflow 구축
- [Workflow 분석](../reference/workflow-analysis.md) – 공유 실행 인식 Workflow 보고서 및 개선 피드백 생성
- [Dashboard 탭](../tabs/dashboard-tab.md) – AI 생성 차트 위젯으로 Workflow 기반 대시보드 구축
- [Agent 노드](../nodes/agent-node.md) – 도구 호출, MCP, 스킬을 지원하는 LLM 노드
- [Agent 아키텍처](../reference/agent-architecture.md) – 서브 에이전트, 오케스트레이터, 도구 디스패치
- [Board 탭](../tabs/board-tab.md) – Workflow를 실행하는 컬럼이 있는 에이전틱 칸반 보드
- [Codex 노드](../nodes/codex-node.md) – GitHub 리포지토리에 대해 OpenAI Codex 코딩 에이전트 실행
- [OpenCode Go 노드](../nodes/opencode-go-node.md) – 강화된 컨테이너에서 제공자에 구애받지 않는 코딩 에이전트
- [Drive 탭](../tabs/drive-tab.md) – 공유 링크, 팀, 대량 작업을 지원하는 내장 파일 스토리지
- [Playwright 노드](../nodes/playwright-node.md) – AI 단계와 코드 모드를 갖춘 자사 브라우저 자동화
- [RAG / Vector Store 노드](../nodes/rag-node.md) – 벡터 검색 및 문서 삽입 (Qdrant 또는 Postgres pgvector)
- [AI 어시스턴트](../reference/ai-assistant.md) – 자연어 Workflow 빌더
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – 공개 검토 URL을 사용하는 Agent 체크포인트
- [가드레일](../reference/guardrails.md) – 모델에 도달하기 전에 안전하지 않은 Prompt 차단
- [Traces 탭](../tabs/traces-tab.md) – LLM 호출 관측성
- [Evals 탭](../tabs/evals-tab.md) – AI Workflow용 테스트 스위트
- [Alerts 탭](../tabs/alerts-tab.md) – 오류, 소요 시간, 비용, 실행량에 대한 임계값 알림
- [OpenTelemetry 추적](../reference/opentelemetry.md) – OTLP를 통한 실행, 노드, 도구 span 내보내기
- [부하 분산](../reference/cluster.md) – 리더 페일오버를 통한 인스턴스 간 실행 공유
- [Single Sign-On](../reference/sso.md) – 모든 OpenID Connect 제공자를 통한 로그인
- [감사 로깅](../reference/audit.md) – 행위자, 대상, 결과를 포함한 보안 관련 작업
- [Portal](../reference/portal.md) – Workflow를 공개 채팅 UI로 게시
- [병렬 실행](../reference/parallel-execution.md) – DAG 기반 동시 실행
- [MCP 탭](../tabs/mcp-tab.md) – MCP 서버 및 클라이언트 구성
