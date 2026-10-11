# 노드 유형

Heym은 Workflow를 구축하기 위한 다양한 노드 유형을 제공합니다. 노드 구성 시 `$input.text` 및 `$nodeLabel.field`와 같은 [표현식](./expression-dsl.md)을 사용하십시오.

## Trigger 노드

| 노드 | 설명 | 출력 |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Workflow의 텍스트 진입점 (HTTP/[Webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | 일정에 따라 Trigger (Cron 표현식) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram 봇 Webhook 업데이트가 도착하면 Trigger | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Slack이 Events API Webhook을 전송하면 Trigger | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord가 애플리케이션 상호작용 Webhook을 전송하면 Trigger | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP 메일함에 새 이메일이 도착하면 Trigger | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Heym이 플랫폼 이벤트를 게시하면 Trigger (배치 배열) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | 외부 WebSocket 서버로의 아웃바운드 연결에서 Trigger | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | 일회용 업로드 링크를 발급하고 대용량 파일이 업로드되면 시작 | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | 큐에서 메시지를 수신하면 Trigger | 1 |
| [Error Handler](../nodes/error-handler-node.md) | 임의의 노드에서 오류 발생 시 실행 (수신 엣지 없음) | 1 |

모든 진입점은 [Triggers](./triggers.md)를 참조하십시오.

## AI 노드

| 노드 | 설명 | 입력 | 출력 |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | 언어 모델로 텍스트를 처리합니다 | 1 | 1 |
| [Decision](../nodes/decision-node.md) | 결정 모델에 유형화된 질문을 하고 반환된 확률에 따라 분기합니다 | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | 도구 호출, 스킬, MCP, 선택적 [인간 검토](./human-in-the-loop.md), 선택적 [영구 메모리 그래프](./agent-persistent-memory.md)를 갖춘 LLM입니다. [Agent 아키텍처](./agent-architecture.md)를 참조하십시오. | 1 | 1, 그리고 선택적 `review` 출력 |
| [Codex](../nodes/codex-node.md) | ChatGPT/Codex 액세스 Token을 사용하여 GitHub 리포지토리에 대해 로컬 Codex CLI를 실행합니다 | 1 | 1, 그리고 `question` 출력 |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go 게이트웨이 API 키를 사용하여 강화된 컨테이너에서 GitHub 리포지토리에 대해 OpenCode CLI를 실행합니다 | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | LLM이 선택하지 않고 특정 MCP 도구를 직접 호출합니다 | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | RAG를 위해 Qdrant 또는 Postgres (pgvector) [벡터 저장소](../tabs/vectorstores-tab.md)에서 삽입, Upsert, 삭제 또는 검색합니다 | 1 | 1 |

## Logic 노드

| 노드 | 설명 | 입력 | 출력 |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | if/else를 기반으로 분기합니다 | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | 값을 케이스와 일치시켜 라우팅합니다 | 1 | n |
| [Merge](../nodes/merge-node.md) | 여러 입력을 기다린 후 병합합니다 | n | 1 |
| [Loop](../nodes/loop-node.md) | 배열을 반복합니다 | 1 | 2 (loop/done) |

## Data 노드

| 노드 | 설명 | 입력 | 출력 |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | 데이터를 변환하고 매핑합니다 | 1 | 1 |
| [Converter](../nodes/converter-node.md) | 형식 간 데이터(CSV, JSON, XML)를 변환하고 이미지 또는 PDF를 텍스트로 OCR합니다 | 1 | 1 |
| [Code](../nodes/code-node.md) | 자체 requirements.txt를 갖춘 일회용 네트워크 격리 샌드박스에서 Python을 실행합니다 | 1 | 1 |
| [Variable](../nodes/variable-node.md) | 변수(Workflow 로컬 또는 [전역](./global-variables.md))를 설정하거나 가져옵니다 | 1 | 1 |
| [Execute](../nodes/execute-node.md) | 다른 Workflow를 호출합니다 | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Heym Workflow 및 실행 이력을 읽습니다 | 1 | 1 |

## 통합 노드

| 노드 | 설명 | 입력 | 출력 |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | HTTP 요청(cURL)을 수행합니다 | 0 또는 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | 외부 WebSocket에 연결하여 하나의 메시지를 전송합니다 | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Telegram 봇 메시지를 전송합니다 | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Slack 메시지를 전송합니다 | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Discord Webhook 메시지를 전송합니다 | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | SMTP를 통해 이메일을 전송합니다 | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis 작업(set, get, hasKey, deleteKey)을 수행합니다 | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Grist 스프레드시트를 읽고 씁니다 | 1 | 1 |
| [GitHub](../nodes/github-node.md) | GitHub REST API를 통해 리포지토리, 사용자, 이슈, 풀 리퀘스트, 리뷰, 릴리스, Actions Workflow 및 파일을 관리합니다 | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Jira REST API를 통해 Jira 프로젝트, 이슈, 댓글, 첨부 파일, 사용자, 알림 및 Workflow 전환을 관리합니다 | 1 | 1 |
| [Linear](../nodes/linear-node.md) | GraphQL을 통해 Linear 팀, 프로젝트, 이슈, Workflow 상태 및 댓글을 관리합니다 | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | OAuth2를 통해 Google Sheets를 읽고 씁니다 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | OAuth2를 통해 Google Drive 파일을 나열, 다운로드, 업데이트 및 삭제합니다 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery에서 SQL 쿼리를 실행하고 행을 삽입합니다 | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | PostgREST를 통해 Supabase 테이블을 조회하고 변경합니다 | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse에 대해 SQL, CRUD 및 count 작업을 실행합니다 | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Notion 데이터베이스, 데이터 소스, 페이지 및 블록을 관리합니다 | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Sentry 조직, 프로젝트, 팀, 이슈, 이벤트 및 릴리스를 관리합니다 | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | 버킷과 폴더를 관리하고, 객체를 나열, 업로드, 다운로드, 복사 및 삭제합니다 | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Heym DataTable(자체 스토리지)을 읽고 씁니다 | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Drive 파일을 관리합니다: 삭제, 비밀번호 설정, TTL, 최대 다운로드 수, 팀 공유/공유 해제 | 1 | 1 |

## 자동화 노드

| 노드 | 설명 | 입력 | 출력 |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | FlareSolverr로 웹 페이지를 스크래핑합니다 | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | AI 단계 및 Auto Heal을 사용한 브라우저 자동화를 수행합니다 | 1 | 1 |

## 유틸리티 노드

| 노드 | 설명 | 입력 | 출력 |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | 실행을 지연합니다 | 1 | 1 |
| [Output](../nodes/output-node.md) | 출력 Endpoint입니다 | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | 필드를 JSON 객체로 매핑합니다. 유일한 종단 노드인 경우 최상위 Webhook/실행 본문이 됩니다 | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | HTML 페이지를 렌더링합니다. 유일한 종단 노드인 경우 Webhook이 text/html로 응답합니다 | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | 상위 행을 차트 Payload로 매핑하는 종단 대시보드 위젯 출력입니다 | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | 캔버스에 마크다운 노트를 추가합니다(실행되지 않음) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | 백엔드 콘솔에 로그를 기록합니다 | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Workflow 내 다른 노드를 비활성화합니다 | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Workflow 내 비활성화된 노드를 활성화합니다 | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | 오류 응답과 함께 Workflow를 중지합니다 | 1 | 0 |

## 플러그인 노드

플러그인 노드는 인스턴스에 설치된 플러그인에서 제공됩니다. 설치된 각
플러그인은 팔레트의 **Plugins** 아래에 고유한 이름으로 표시되며, 내부적으로는
다음 두 노드 유형 중 하나에 매핑됩니다.

| 노드 | 설명 | 입력 | 출력 |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | 설치된 플러그인에서 제공하는 사용자 정의 액션입니다 | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | 설치된 플러그인에서 제공하는 사용자 정의 Trigger입니다 | 0 | 1 |

## 관련 문서

- [Canvas 기능](./canvas-features.md) – 데이터 고정, 실행 로그, 활성화/비활성화, 하위 Workflow로 추출
- [Agent 노드](../nodes/agent-node.md) – AI Agent 노드에 대한 상세 참조
- [Agent 아키텍처](./agent-architecture.md) – 하위 Agent, 오케스트레이터, 스킬, MCP, 도구 호출
- [Agent 영구 메모리](./agent-persistent-memory.md) – 노드별 지식 그래프, 공유, 백그라운드 추출
- [Human-in-the-Loop](./human-in-the-loop.md) – 사람의 승인을 위해 Agent 출력 일시 중지
- [Expression DSL](./expression-dsl.md) – 노드 설정에서 데이터 참조
- [Expression 평가 대화상자](./expression-evaluation-dialog.md) – 실시간 백엔드 미리보기가 포함된 확장 가능한 편집기
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – 일회용 링크를 통해 대용량 멀티파트 업로드 수신
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – 실시간 아웃바운드 소켓 Trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – 외부 소켓으로 메시지 푸시
- [Workflow 구조](./workflow-structure.md) – 노드와 엣지의 JSON 형식
- [Trigger](./triggers.md) – 모든 Workflow 진입점
- [Credentials 탭](../tabs/credentials-tab.md) – LLM, HTTP 및 기타 노드용 API 키 추가
- [Credentials 공유](./credentials-sharing.md) – 다른 사용자와 Credentials 공유
- [Portal](./portal.md) – Workflow를 공개 채팅 UI로 노출
- [Vectorstores 탭](../tabs/vectorstores-tab.md) – RAG 노드용 벡터 스토어 생성
