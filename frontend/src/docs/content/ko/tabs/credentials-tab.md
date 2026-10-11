# Credentials 탭

**Credentials** 탭은 노드에서 사용하는 API 키와 시크릿을 관리합니다. 여기에서 자격 증명을 추가하고 Workflow 노드에서 이름으로 참조하십시오. 자격 증명의 개념과 노드에서의 사용 방식에 대한 개요는 [Credentials](../reference/credentials.md)를 참조하십시오.

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Credentials 데모 시청</a></p>

## 자격 증명 유형

| 유형 | 사용 사례 |
|------|----------|
| **OpenAI** | LLM, Agent, RAG 노드용 OpenAI API 키 |
| **Google** | Google AI (Gemini) API 키 |
| **GitHub** | GitHub API, GitHub 노드 Workflow, MCP 서버, Agent Workflow용 GitHub personal access token (PAT); 선택적 GitHub Enterprise `base_url` |
| **Linear** | 팀, 프로젝트, 이슈, 댓글용 Linear personal API 키 또는 OAuth2 |
| **Notion** | Internal integration token 또는 public-integration OAuth workspace 인증 |
| **Custom** | 사용자 정의 LLM Endpoint |
| **Bearer** | HTTP 인증용 Bearer Token |
| **Header** | HTTP 요청용 사용자 정의 헤더 키-값 |
| **Telegram** | Telegram 봇 Token 및 선택적 Webhook 시크릿 |
| **Slack** | Slack incoming Webhook URL |
| **Discord** | Discord incoming Webhook URL |
| **Discord Trigger** | Discord 애플리케이션 공개 키 |
| **IMAP** | 수신 메일함 Trigger 자격 증명 |
| **SMTP** | 이메일 발송 자격 증명 |
| **Redis** | Redis 연결 |
| **RAG: Qdrant + OpenAI** | 외부 Qdrant 서버를 백엔드로 사용하는 RAG 노드용 벡터 저장소 |
| **RAG: Psql + OpenAI** | Heym 자체 Postgres 데이터베이스(pgvector)를 백엔드로 사용하는 RAG 노드용 벡터 저장소 — 외부 서비스 불필요 |
| **RAG: Custom Embeddings** | OpenAI 호환 Embedding Endpoint를 사용하며 Qdrant 또는 Postgres(pgvector)를 저장소로 사용하는 RAG 노드용 벡터 저장소 |
| **Cohere** | Embedding용 Cohere API |

## 자격 증명 추가

1. **Add Credential**을 클릭합니다
2. 자격 증명 유형을 선택합니다
3. 필수 값을 입력합니다 (API 키, URL 등)
4. 노드에서 참조할 이름을 지정합니다

GitHub의 경우 현재 자격 증명 흐름은 PAT 기반입니다. 세분화된(fine-grained) PAT를 권장합니다. GitHub App 설치 흐름은 현재 UI에서 일급(first-class)으로 지원되지 않습니다. GitHub Enterprise Server를 사용하는 경우 `https://github.example.com/api/v3`와 같은 선택적 GitHub API base URL을 설정할 수도 있습니다.

Linear의 경우 대화 상자에서 **Personal API key** 또는 **OAuth2**를 선택하십시오. Personal API 키는 Linear의 **Settings → Security & Access → Personal API keys**에서 생성합니다. OAuth2는 Linear OAuth 애플리케이션의 Client ID와 Client Secret을 사용하며, `{FRONTEND_URL}/api/credentials/linear/oauth/callback`을 리디렉션 URI로 등록합니다. 자격 증명은 이를 생성하거나 인증한 Linear 사용자의 권한으로 동작합니다. 저장하기 전에 자격 증명 대화 상자의 **Test Connection**을 사용하여 API 키 또는 OAuth Token을 검증하십시오.

**Notion**의 경우 대화 상자에서 **Internal token** 또는 **OAuth**를 선택하십시오. OAuth는 Notion public integration의 Client ID와 Client Secret을 사용하며, Heym은 이를 암호화하여 자격 증명에 저장합니다. Workflow를 저장하기 전에 **Test Connection**을 사용하여 Supabase, Linear 또는 Notion 자격 증명을 검증하십시오. Notion 설정에 대한 자세한 내용은 [Third-Party Integrations](../reference/integrations.md#notion)를 참조하십시오.

OAuth 자격 증명은 팝업에서 공급자의 인증 페이지를 엽니다. 브라우저가 이를 차단하는 경우 Connect 버튼 아래의 **Open the authorization page** 링크를 사용하십시오. 연결이 완료되면 대화 상자에서 이를 감지합니다. 새 자격 증명이 연결되면 버튼이 **Connected**로 표시됩니다.

## 편집 및 삭제

- **Edit** – 자격 증명 값을 업데이트합니다 (민감한 값은 마스킹됩니다)
- **Delete** – 자격 증명을 제거합니다. 이를 사용하는 Workflow에는 대체 자격 증명이 필요합니다

GitHub Enterprise Server에서 **GitHub** 자격 증명을 편집할 때 선택적 **GitHub API Base URL**을 비워 두면 기존 Enterprise Endpoint가 유지됩니다. 해당 Endpoint를 변경하려는 경우에만 새 URL을 입력하십시오.

## 공유

- 이메일로 다른 사용자와 또는 [Teams](../reference/teams.md)와 [자격 증명을 공유](../reference/credentials-sharing.md)할 수 있습니다
- 공유된 자격 증명은 표시자와 함께 나타납니다
- 자격 증명 카드 메뉴에서 공유를 취소할 수 있습니다

## 노드에서 사용하기

노드 구성에서 이름으로 자격 증명을 참조하십시오. 예를 들어:
- [LLM 노드](../nodes/llm-node.md) – 모델 API에 사용할 자격 증명을 선택합니다
- [HTTP 노드](../nodes/http-node.md) – 인증에 Bearer 또는 Header 자격 증명을 사용합니다
- [Agent 노드](../nodes/agent-node.md) – GitHub 토큰을 `GITHUB_PERSONAL_ACCESS_TOKEN`과 같은 MCP 서버 환경 변수에 전달합니다
- [GitHub 노드](../nodes/github-node.md) – 네이티브 GitHub 리포지토리, 사용자, 이슈, 리뷰, 릴리스, Workflow, 트래픽 및 파일 작업을 실행합니다
- [Linear 노드](../nodes/linear-node.md) – 워크스페이스 메타데이터를 읽고 Linear 이슈 및 댓글을 자동화합니다
- [Notion 노드](../nodes/notion-node.md) – Notion 데이터베이스, 데이터 소스, 페이지 및 블록을 관리합니다
- [RAG 노드](../nodes/rag-node.md) – 벡터 스토어에 Qdrant 또는 Postgres(pgvector) 자격 증명을 사용합니다
- [Telegram Trigger 노드](../nodes/telegram-trigger-node.md) – Telegram 봇 Webhook을 수신합니다
- [Telegram 노드](../nodes/telegram-node.md) – Telegram 봇 메시지를 전송합니다
- [Discord Trigger 노드](../nodes/discord-trigger-node.md) – Discord 인터랙션 Webhook을 수신합니다
- [Discord 노드](../nodes/discord-node.md) – Discord Webhook 메시지를 전송합니다
- [IMAP Trigger 노드](../nodes/imap-trigger-node.md) – 공유 받은 편지함에서 새 이메일을 폴링합니다

표현식에서 자격 증명 기반 값을 참조하는 방법은 [Expression DSL](../reference/expression-dsl.md)을 참조하십시오.

## 관련 항목

- [서드파티 통합](../reference/integrations.md) – 각 자격 증명 유형(Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack 등)에 대한 상세 설정 가이드
- [자격 증명 공유](../reference/credentials-sharing.md) – 다른 사용자와 자격 증명 공유
- [보안](../reference/security.md) – 저장 시 암호화, 세션 관리, 속도 제한
- [노드 유형](../reference/node-types.md) – 자격 증명을 사용하는 노드 ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [이메일 전송](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vectorstores 탭](./vectorstores-tab.md) – Qdrant 또는 Postgres(pgvector) 자격 증명을 사용합니다
- [Chat 탭](./chat-tab.md) – OpenAI/Google 자격 증명을 사용합니다
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 화면을 위한 간결한 페이지 가이드
