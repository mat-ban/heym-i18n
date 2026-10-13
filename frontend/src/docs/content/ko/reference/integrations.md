# 서드파티 연동

Heym은 **credential**을 통해 외부 서비스에 연결합니다. 각 credential 유형은 하나의 서비스에 대한 연결 세부 정보를 저장하며, 여러 노드와 Workflow에서 재사용할 수 있습니다. 개요는 [Credentials](./credentials.md)를 참조하십시오.

credential은 [Settings → Credentials](../tabs/credentials-tab.md)에서 추가합니다. 모든 값은 저장 시 암호화됩니다. credential은 다른 사용자 또는 [Teams](./teams.md)와 [공유](./credentials-sharing.md)할 수 있습니다.

일부 통합 노드는 credential이 **필요하지 않습니다**. [WebSocket Trigger](../nodes/websocket-trigger-node.md)와 [WebSocket Send](../nodes/websocket-send-node.md)는 노드에 직접 구성된 URL, 헤더, 서브프로토콜을 사용하여 외부 소켓에 연결합니다.

## Credential 유형 한눈에 보기

| 유형 | 사용처 | 주요 필드 |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, 선택적 `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, 선택적 `base_url` |
| **Jira** | [Jira 노드](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, 선택적 `api_version` |
| **Linear** | [Linear 노드](../nodes/linear-node.md) | `api_key`, 또는 `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry 노드](../nodes/sentry-node.md) | `api_token`, 선택적 `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, 선택적 `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | decision model credential과, 다른 credential을 참조하는 모델 옵션 |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (벡터는 pgvector를 통해 Heym 자체 Postgres에 저장됨) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, 선택적 `embedding_api_key`, 그리고 `db_type`이 `qdrant`인 경우 `qdrant_host` |
| **Grist** | [Grist 노드](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets 노드](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 동의 |
| **Google Drive** | [Google Drive 노드](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 동의 (전체 Drive scope) |
| **BigQuery** | [BigQuery 노드](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 동의 |
| **Supabase** | [Supabase 노드](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, 선택적 `supabase_schema` |
| **ClickHouse** | [ClickHouse 노드](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion 노드](../nodes/notion-node.md) | `api_token`, 또는 `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 노드](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger 노드](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger 노드](../nodes/telegram-trigger-node.md), [Telegram 노드](../nodes/telegram-node.md) | `bot_token`, 선택적 `secret_token` |
| **Discord** | [Discord 노드](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger 노드](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ 노드](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis 노드](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack 노드](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger 노드](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP 노드](../nodes/http-node.md) | `token` |
| **Header** | [HTTP 노드](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler 노드](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub credential은 GitHub personal access token(PAT)을 저장하여, Workflow가 [GitHub 노드](../nodes/github-node.md)를 통해 GitHub REST API를 호출하거나, `@modelcontextprotocol/server-github`와 같은 MCP 서버에 토큰을 전달하거나, [HTTP 노드](../nodes/http-node.md)에서 사용자 정의 REST 호출에 사용할 수 있도록 합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `api_key` | GitHub personal access token (`github_pat_...` 세분화된 PAT 또는 클래식 `ghp_...` PAT) |
### 선택적 필드

| 필드 | 설명 |
|-------|-------------|
| `base_url` | GitHub Enterprise Server용 GitHub API base URL (예: `https://github.example.com/api/v3`) |

### 참고 사항

- 가능한 경우 세분화된 personal access token을 사용하는 것이 권장됩니다. 특정 리포지토리와 권한으로 범위를 한정할 수 있기 때문입니다.
- GitHub.com의 경우 `base_url`을 비워 두십시오. GitHub Enterprise Server의 경우 서버의 웹 UI 루트(예: `https://github.example.com`)가 아닌 `/api/v3`를 포함한 전체 REST API endpoint(예: `https://github.example.com/api/v3`)를 사용하십시오.
- 이 credential은 현재 PAT 기반 인증만 모델링합니다. 조직 리포지토리에 접근하려면 필요한 조직/리포지토리 권한이 부여된 PAT를 사용하십시오.
- GitHub App installation token과 GitHub App 설정 흐름은 현재 Heym UI에서 first-class로 지원되지 않습니다.
- 네이티브 리포지토리, 사용자, 이슈, pull request, 리뷰, 릴리스, Actions workflow, 트래픽, 파일 작업에는 [GitHub 노드](../nodes/github-node.md)를 우선 사용하십시오. GitHub 노드가 다루지 않는 endpoint나 payload가 필요할 때만 [HTTP 노드](../nodes/http-node.md)를 사용하십시오.
- MCP와 함께 [Agent 노드](../nodes/agent-node.md)를 사용할 때는 `$credentials.YourGitHubCredential`을 `GITHUB_PERSONAL_ACCESS_TOKEN`과 같은 MCP 연결 환경 변수에 전달하십시오.
- GitHub의 REST API는 일반적으로 `Authorization: Bearer <token>`과 `Accept: application/vnd.github+json`을 요구합니다.
- GitHub credential을 편집할 때 GitHub Enterprise `base_url`을 비워 두면 기존 endpoint가 유지됩니다. 해당 endpoint를 변경하려는 경우에만 새 URL을 입력하십시오.

### 사용처

- [GitHub 노드](../nodes/github-node.md)
- [Codex 노드](../nodes/codex-node.md)
- [Agent 노드](../nodes/agent-node.md)
- [HTTP 노드](../nodes/http-node.md)

---

## Decision Model

Decision model은 상태에 대한 타입이 지정된 질문에 답하고 텍스트 대신 확률을 반환합니다. TypeSafe의 Jev가 참조 구현이며, 동일한 `{model, state, questions}` body를 받는 모든 endpoint가 작동합니다. 그렇지 않은 경우 [Decision](../nodes/decision-node.md) 노드가 직접 작성한 body를 전송할 수 있습니다.

### 필수 필드

- `base_url` – endpoint (예: `https://api.typesafe.ai`). Heym은 `/v1/systemone`을 추가합니다.

### 선택적 필드

- `api_key` – `Authorization: Bearer`로 전송됩니다. 키가 필요 없는 endpoint는 이 항목을 비워 둘 수 있습니다.

### 참고 사항

- **Test Connection**은 endpoint와 키가 작동하는지 확인하기 위해 아주 작은 질문 하나를 전송합니다.
- credential을 편집할 때 키 필드를 비워 두면 저장된 키가 유지됩니다.
- 사설 및 loopback 주소로의 아웃바운드 요청은 기본적으로 차단되므로, `localhost`나 사설 대역의 self-hosted endpoint는 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`가 필요합니다.
- 이러한 모델은 Heym이 동기화하는 LLM 가격표에 없으므로 [Traces](../tabs/traces-tab.md)의 Cost 열은 비어 있습니다. Token 수는 여전히 기록됩니다.

### 사용처

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – `LLM-as-Judge` 답변을 예상 출력과 비교하여 점수를 매깁니다

## OpenAI Codex

OpenAI Codex credential은 [Codex 노드](../nodes/codex-node.md)를 인증합니다. LLM, Agent, RAG 노드에서 사용하는 OpenAI API key credential과는 별개입니다.

### 인증 모드

| 모드 | 설명 |
|------|-------------|
| **Sign in with ChatGPT** (권장) | ChatGPT Plus/Pro 구독을 사용하는 OAuth (PKCE) 로그인으로, 실행 시 토큰당 API 비용을 피할 수 있습니다. Heym은 token bundle을 저장하고 자동으로 갱신합니다. |
| **Access token** | 로컬 Codex CLI 프로세스에만 전달되는 ChatGPT/Codex `access_token`입니다. |

### 참고 사항

- 이 credential 유형에는 API key가 거부됩니다.
- Codex token은 `$credentials.Name`을 통해 노출되지 않습니다.
- Codex 노드는 리포지토리 clone, 브랜치 push, draft PR 생성을 위해 GitHub credential도 필요합니다.

### 사용처

- [Codex 노드](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go credential은 [OpenCode Go 노드](../nodes/opencode-go-node.md)를 인증합니다. OpenCode Go gateway API key([opencode.ai/go](https://opencode.ai/go)에서 발급)와 선택적 gateway base URL을 저장합니다.

### 필드

| 필드 | 설명 |
|-------|-------------|
| **API Key** | OpenCode Go gateway API key (필수). |
| **Gateway Base URL** | 선택 사항이며 기본값은 `https://opencode.ai/zen/go/v1`입니다. self-hosted 또는 프록시 gateway인 경우에만 재정의하십시오. |

### 참고 사항

- API key는 강화된 컨테이너 내부의 OpenCode CLI 프로세스에만 전달됩니다.
- OpenCode Go 노드는 리포지토리 clone, 브랜치 push, pull request 생성을 위해 GitHub credential도 필요합니다. GitHub token은 샌드박스 컨테이너 내부에 절대 배치되지 않습니다.

### 사용처

- [OpenCode Go 노드](../nodes/opencode-go-node.md)

---

## Linear

Linear credential은 [Linear 노드](../nodes/linear-node.md)에 대해 personal API key 또는 OAuth2를 지원합니다. Heym은 workspace 메타데이터, 프로젝트, 이슈, 댓글을 위해 네이티브 GraphQL 쿼리를 Linear로 전송합니다.
### 설정

다음 인증 모드 중 하나를 선택하십시오:

**Personal API key**

1. Linear에서 **Settings → Security & Access → Personal API keys**를 엽니다.
2. 자동화하려는 workspace에 대한 접근 권한이 있는 키를 생성합니다.
3. 해당 키를 Heym의 Linear credential에 붙여넣고 **Test Connection**으로 검증합니다.

**OAuth2**

1. Linear OAuth 애플리케이션을 생성합니다.
2. `{FRONTEND_URL}/api/credentials/linear/oauth/callback`을 redirect URI로 등록합니다.
3. Heym Dashboard → **Credentials** → **New** → 유형 **Linear**를 선택합니다.
4. **OAuth2**를 선택하고 Client ID와 Client Secret을 입력한 뒤 **Connect**를 클릭합니다.

### 필수 필드

| 모드 | 필드 | 설명 |
|------|-------|-------------|
| Personal API key | `api_key` | Linear personal API key이며, 일반적으로 `lin_api_` 접두사가 붙습니다 |
| OAuth2 | `client_id` | Linear OAuth 애플리케이션의 Client ID |
| OAuth2 | `client_secret` | Linear OAuth 애플리케이션의 Client Secret |

OAuth token(`access_token`, `refresh_token`, `token_expiry`)은 자동으로 저장되고 갱신됩니다.

### 참고 사항

- Personal API key와 OAuth token은 이를 생성하거나 인증한 Linear 사용자로 동작합니다.
- Linear OAuth는 `read,write,issues:create,comments:create` scope를 사용합니다.
- credential 대화상자의 **Test Connection**을 사용하여 API key 또는 OAuth token을 Linear API에 대해 검증하십시오.
- 이슈를 생성하거나 필터링하기 전에 Linear 노드의 List Teams와 List Projects를 사용하여 UUID를 확인하십시오.
- 업데이트를 위한 state 및 assignee UUID를 확인하려면 List Workflow States와 List Team Members를 사용하십시오.
- API key를 교체하려면 credential을 편집하고 대체 값을 입력하십시오. OAuth 앱 secret을 교체한 경우 **Connect**를 통해 credential을 다시 연결하십시오.

### 사용처

- [Linear 노드](../nodes/linear-node.md)

---

## Jira

Jira credential은 [Jira 노드](../nodes/jira-node.md)를 위한 Jira Basic auth credential, Jira 사이트 base URL, 배포 모드, 그리고 선택적 REST API 버전을 저장합니다. Jira Cloud에는 `cloud`를, Jira Data Center / Server에는 `data_center`를 사용하십시오.

### 설정

**Jira Cloud**

1. Atlassian 계정 설정에서 API token을 생성합니다.
2. Heym Dashboard → **Credentials** → **New** → 유형 **Jira**를 선택합니다.
3. Atlassian 이메일, API token, 그리고 `https://your-domain.atlassian.net`과 같은 Jira 사이트 URL을 입력합니다.
4. **Test Connection**을 사용하여 credential을 검증합니다.

**Jira Data Center / Server**

1. 배포 유형으로 **Jira Data Center / Server**를 선택합니다.
2. Basic auth에 사용할 Jira 사용자 이름과 비밀번호를 입력합니다.
3. Jira 사이트 URL을 입력합니다. 예: `https://jira.example.com`.
4. **Test Connection**을 사용하여 credential을 검증합니다.

### 필드

| 필드 | 설명 |
| --- | --- |
| `email` | Jira Cloud Atlassian 계정 이메일 또는 Jira Data Center / Server 사용자 이름 |
| `api_token` | Jira Cloud Atlassian API token 또는 Basic auth용 Jira Data Center / Server 비밀번호 |
| `base_url` | Jira 사이트 base URL |
| `deployment` | Jira Cloud의 경우 `cloud`, Jira Data Center / Server의 경우 `data_center` |
| `api_version` | REST API 버전이며, Jira Cloud의 기본값은 `3`입니다. Data Center / Server는 v2를 사용합니다 |

### 참고 사항

- Jira 노드는 Jira Cloud REST API v3의 경우 이슈 설명과 댓글을 Atlassian Document Format 텍스트
  문서로 전송합니다. Data Center / Server credential은 일반 텍스트를 전송합니다.
- Data Center / Server는 현재 사용자 이름/비밀번호 Basic auth만 지원합니다. Personal access
  token과 Bearer auth는 아직 지원되지 않습니다.
- 첨부 파일 업로드는 base64 또는 data URL 콘텐츠를 허용하며 플랫폼 파일 크기 제한(기본 99 MB)이 적용됩니다. 첨부 파일 다운로드는 활성화된 경우 base64 콘텐츠를 반환할 수 있습니다.
- 사용자 생성, 삭제, 이슈 알림은 인증된 Jira 계정이 관련 Jira 사이트 또는 조직 권한을 보유해야 합니다.
- 프로젝트 키, 이슈 키, transition ID를 확인하려면 List Projects, Search Issues, List Transitions를 사용하십시오.
- Jira 노드에서 다루지 않는 사용자 정의 endpoint의 경우, cURL 명령에 Jira Basic Auth(Cloud의 경우 `email:api_token`, Data Center / Server의 경우 `username:password`)를 사용하는 [HTTP 노드](../nodes/http-node.md)를 사용하거나, 일치하는 `Authorization: Basic <base64(user:secret)>` 값을 가진 Header credential을 사용하십시오.

참고 항목:

- [Jira 노드](../nodes/jira-node.md)
- [Credentials](./credentials.md)

---

## Sentry

Sentry credential은 [Sentry 노드](../nodes/sentry-node.md)를 위한 auth token을 저장합니다. Heym은 organization, project, team, issue, event, release 작업에 Sentry의 REST API를 사용합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `api_token` | 자동화하려는 organization과 project에 대한 접근 권한이 있는 Sentry auth token |

### 선택적 필드

| 필드 | 설명 |
|-------|-------------|
| `base_url` | 자체 호스팅 Sentry를 위한 선택적 루트 URL입니다. 예: `https://sentry.example.com` |

### 참고 사항

- Sentry SaaS의 경우 `base_url`을 비워 두십시오.
- **Test Connection**을 사용하여 token이 표시 가능한 organization을 나열할 수 있는지 확인하십시오.
- 사용자 정의 REST 호출의 경우 `$credentials.YourSentryCredential`을 bearer token으로 사용하십시오.

### 사용처

- [Sentry 노드](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech)는 시맨틱 검색과 RAG(Retrieval Augmented Generation)에 사용되는 오픈 소스 벡터 데이터베이스입니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `qdrant_host` | Qdrant 인스턴스의 전체 URL (예: `http://localhost:6333` 또는 cloud endpoint) |
| `openai_api_key` | 문서를 인덱싱하고 검색할 때 embedding을 생성하는 데 사용되는 OpenAI API key |
### 참고 사항

- Qdrant 컬렉션은 [Vectorstores](../tabs/vectorstores-tab.md) 탭에서 관리합니다. 각 vector store는 하나의 Qdrant 컬렉션에 매핑됩니다.
- [RAG 노드](../nodes/rag-node.md)는 vector store를 사용하며(이는 Qdrant credential을 참조함), credential을 직접 참조하지는 않습니다.
- Qdrant 인스턴스에 API key가 필요한 경우, `qdrant_host` 값에 포함하거나 Qdrant를 그에 맞게 구성하십시오. 현재 통합에는 별도의 Qdrant API key 필드가 없습니다.
- 자체 호스팅 Qdrant: [공식 Docker 이미지](https://hub.docker.com/r/qdrant/qdrant)를 사용하고 포트 `6333`을 노출하십시오.

### 사용처

- [RAG 노드](../nodes/rag-node.md) (vector store를 통해)
- [Vectorstores 탭](../tabs/vectorstores-tab.md)

## 사용자 정의 임베딩 (RAG)

기본적으로 RAG 임베딩은 OpenAI에서 제공됩니다. **RAG: Custom Embeddings** credential은 대신 모든 OpenAI 호환 임베딩 endpoint를 가리킵니다 — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together 또는 호스팅된 gateway — 그리고 기록할 vector store의 이름을 지정합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `embedding_base_url` | `/v1` 경로를 포함한 endpoint URL, 예: `http://localhost:11434/v1` |
| `embedding_api_key` | 선택 사항. 로컬 서버는 일반적으로 key가 필요하지 않습니다 |
| `embedding_model` | endpoint가 기대하는 모델 이름, 예: `nomic-embed-text` |
| `embedding_dimensions` | 모델이 반환하는 벡터 너비 (기본값 `1536`) |
| `embedding_request_dimensions` | 선택 사항. 모델의 기본 너비 대신 `embedding_dimensions`를 반환하도록 endpoint에 요청합니다 |
| `db_type` | `qdrant` 또는 `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant 연결 정보, `db_type`이 `qdrant`일 때 필수 |

### 참고 사항

- **Qdrant는 모든 차원 수를 허용합니다.** 각 컬렉션은 이 credential이 선언한 너비로 생성되므로, Dimensions 필드는 자유롭게 편집할 수 있습니다.
- **Postgres (pgvector)는 정확히 1536 차원을 요구합니다.** 해당 컬럼은 고정된 `vector(1536)`이므로 Dimensions 필드는 1536으로 고정되며, 다른 너비를 선언한 credential은 저장 시 거부됩니다.
- **pgvector를 위한 축소.** store가 Postgres인 경우, 대화 상자에서 *Ask the endpoint to return 1536 dimensions* 옵션을 제공합니다. 이는 `dimensions` 요청 파라미터를 전송하며, Matryoshka 표현으로 학습된 모델(OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` 등)은 이를 준수하여 축소되었지만 여전히 의미 있는 벡터를 반환합니다. 이 파라미터를 지원하지 않는 endpoint는 요청을 거부하며, 이를 수용하지만 무시하는 endpoint는 실제로 반환된 너비를 명시하는 명확한 오류를 생성합니다. Heym은 벡터를 직접 잘라내지 않습니다. Matryoshka가 아닌 모델의 출력을 잘라내면 검색 품질이 조용히 저하되기 때문입니다. 이 옵션은 컬렉션을 임의의 너비로 설정할 수 있는 Qdrant에는 제공되지 않습니다.
- credential 대화 상자의 **Test Connection**을 사용하여 probe 문자열을 임베딩하고 store를 생성하기 전에 모델이 실제로 반환하는 너비를 확인하십시오.
- `dimensions` 요청 파라미터는 OpenAI 자체에만 전송됩니다. 대부분의 OpenAI 호환 서버는 알 수 없는 파라미터를 거부하기 때문입니다. 대신 모델의 기본 너비가 credential에 대해 검증됩니다.
- 기존 **RAG: Qdrant + OpenAI** 및 **RAG: Psql + OpenAI** credential은 변경되지 않으며 계속 작동합니다.

### 사용처

- [RAG 노드](../nodes/rag-node.md) (vector store를 통해)
- [Vectorstores 탭](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym은 [pgvector](https://github.com/pgvector/pgvector) 확장을 사용하여 **자체 Postgres 데이터베이스 내부에** 벡터를 저장할 수도 있습니다 — 외부 vector 서비스가 필요하지 않습니다. **RAG: Psql + OpenAI** credential을 생성하고 vector store를 생성할 때 사용한 다음, RAG 노드의 Database 드롭다운에서 **Postgres (pgvector)**를 선택하십시오.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `openai_api_key` | 문서를 인덱싱하고 검색할 때 임베딩을 생성하는 데 사용되는 OpenAI API key |

### 참고 사항

- host/port가 필요하지 않습니다 — 벡터는 Heym 자체 데이터베이스에 기록되며, Heym은 다른 데이터베이스에 연결하지 않습니다.
- Qdrant에서 사용 가능한 모든 RAG 기능(삽입, 검색, 메타데이터 필터, Cohere reranking, 복제, 공유)이 Postgres 백엔드에서도 동일하게 작동합니다.
- `vector` 확장이 필요합니다. Heym은 공식 `postgres:16` 이미지를 변경하지 않고 유지하며(따라서 기존 데이터는 절대 건드리지 않음), **시작 시 `postgresql-16-pgvector` 패키지를 자동 설치합니다** — `run.sh`, `deploy.sh`, `run_e2e.sh` 모두 이를 처리합니다. 설치는 치명적이지 않습니다. 실행할 수 없는 경우(예: 네트워크 없음) Qdrant RAG는 계속 작동하고 Postgres 백엔드는 비활성 상태로 유지됩니다(마이그레이션이 테이블을 정상적으로 건너뜀).
- 게시된 단일 컨테이너 이미지(`ghcr.io/heymrun/heym`)를 **자체 외부 Postgres**에 대해 실행하는 경우, 해당 데이터베이스는 `vector` 확장을 지원해야 합니다(Heym은 관리하지 않는 데이터베이스에 이를 설치할 수 없음). 이 확장이 없으면 Postgres vector store를 생성하거나 업로드할 때 명확한 메시지가 반환되고 Qdrant RAG는 계속 작동합니다.

### 사용처

- [RAG 노드](../nodes/rag-node.md) (vector store를 통해)
- [Vectorstores 탭](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com)는 구조화된 데이터와 수식을 지원하는 스프레드시트/데이터베이스 하이브리드입니다. Grist credential을 통해 Heym이 Grist 문서를 읽고 쓸 수 있습니다.
### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `api_key` | Grist API key (Grist 인스턴스의 **Profile → API Key**에서 확인 가능) |
| `server_url` | Grist 서버의 기본 URL (예: Grist Cloud의 경우 `https://docs.getgrist.com`, 또는 자체 호스팅 URL) |

### 참고 사항

- [Grist 노드](../nodes/grist-node.md)는 구성 시 **Document ID**(Grist 문서 URL에서 확인)와 **Table ID**가 필요합니다. 이들은 credential의 일부가 아닙니다.
- 자체 호스팅 Grist의 경우 `server_url`을 인스턴스의 도메인으로 설정하십시오.
- Grist의 Column ID는 표시 레이블이 아닌 밑줄을 사용합니다(예: `User_Name`). `listColumns` 작업을 사용하여 확인하십시오.

### 사용처

- [Grist 노드](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheets credential은 OAuth2 "Bring Your Own App" 모델을 사용하여 Heym을 Google Sheets API에 연결합니다. Google Cloud OAuth2 Client ID와 Client Secret을 제공한 다음, 브라우저 팝업을 통해 액세스를 승인합니다. Token은 백그라운드에서 자동으로 갱신됩니다.

### 설정

1. [Google Cloud Console](https://console.cloud.google.com)을 엽니다 → **APIs & Services** → **Library** → **Google Sheets API**를 검색하여 활성화합니다.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → 애플리케이션 유형 **Web application**으로 이동합니다.
3. **Authorized redirect URIs** 아래에 다음을 추가합니다: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. 생성된 **Client ID**와 **Client Secret**을 복사합니다.
5. Heym Dashboard → **Credentials** → **New** → 유형 **Google Sheets (OAuth2)**를 선택합니다.
6. Client ID, Client Secret, 이름을 입력한 다음 **Connect**를 클릭하여 Google 동의 팝업을 열고 액세스를 승인합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `client_id` | Google Cloud Console의 OAuth2 Client ID |
| `client_secret` | Google Cloud Console의 OAuth2 Client Secret |

Token(`access_token`, `refresh_token`, `token_expiry`)은 자동으로 저장되고 갱신됩니다. 직접 관리하지 않습니다.

### 참고 사항

- OAuth2 동의 화면에는 spreadsheets scope(`https://www.googleapis.com/auth/spreadsheets`)가 필요합니다.
- Heym은 refresh token을 사용하여 access token이 만료되기 전에 새로 발급받습니다(60초 안전 버퍼).
- Google Cloud Console에서 Client Secret을 교체한 경우, **Connect** 버튼을 통해 credential을 다시 연결하십시오.
- **프로덕션:** 백엔드 **`FRONTEND_URL`**을 사용자가 브라우저에서 여는 정확한 공개 URL(scheme + host, 예: `https://heym.example.com`)로 설정하십시오. Heym은 이 값만으로 Google OAuth redirect URI를 구성하며, `Origin` 또는 `X-Forwarded-*` 헤더(클라이언트 제어 가능)는 신뢰하지 **않습니다**. Google Cloud Console에 `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`을 등록하십시오.

### 사용처

- [Google Sheets 노드](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive credential은 Google Sheets와 동일한 OAuth2 "Bring Your Own App" 모델을 사용하여 Heym을 Google Drive API에 연결합니다. Google Cloud OAuth2 Client ID와 Client Secret을 제공한 다음, 브라우저 팝업을 통해 액세스를 승인합니다. Token은 백그라운드에서 자동으로 갱신됩니다.

### 설정

1. [Google Cloud Console](https://console.cloud.google.com)을 엽니다 → **APIs & Services** → **Library** → **Google Drive API**를 검색하여 활성화합니다.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → 애플리케이션 유형 **Web application**으로 이동합니다.
3. **Authorized redirect URIs** 아래에 다음을 추가합니다: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. 생성된 **Client ID**와 **Client Secret**을 복사합니다.
5. Heym Dashboard → **Credentials** → **New** → 유형 **Google Drive (OAuth2)**를 선택합니다.
6. Client ID, Client Secret, 이름을 입력한 다음 **Connect**를 클릭하여 Google 동의 팝업을 열고 액세스를 승인합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `client_id` | Google Cloud Console의 OAuth2 Client ID |
| `client_secret` | Google Cloud Console의 OAuth2 Client Secret |

Token(`access_token`, `refresh_token`, `token_expiry`)은 자동으로 저장되고 갱신됩니다. 직접 관리하지 않습니다.

### Scope

Google Drive는 **전체 Drive scope**(`https://www.googleapis.com/auth/drive`)를 요청합니다.

이는 노드가 이미 소유한 파일에 대해 작동하기 때문에 필요합니다. 더 좁은 `drive.file` scope는 OAuth 클라이언트 자체가 생성한 파일에만 액세스를 부여하므로, `listFolderFiles`, `updateFile`, `removeFile`, `removeFolder`가 기존 Drive의 파일을 전혀 볼 수 없게 됩니다.

자체 Google Cloud 프로젝트의 Client ID와 Secret을 제공하므로, 이 scope에 대한 Google 앱 검증 요구 사항은 Heym이 아닌 귀하의 프로젝트에 적용됩니다.

### 참고 사항

- Heym은 refresh token을 사용하여 access token이 만료되기 전에 새로 발급받습니다(60초 안전 버퍼).
- Google Cloud Console에서 Client Secret을 교체한 경우, **Connect** 버튼을 통해 credential을 다시 연결하십시오.
- 공유 드라이브가 지원됩니다. 노드는 모든 API 호출에서 `supportsAllDrives`를 설정합니다.
- **프로덕션:** 백엔드 **`FRONTEND_URL`**을 사용자가 브라우저에서 여는 정확한 공개 URL로 설정하십시오. Heym은 이 값만으로 Google OAuth redirect URI를 구성하며, `Origin` 또는 `X-Forwarded-*` 헤더는 신뢰하지 **않습니다**. Google Cloud Console에 `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback`을 등록하십시오.
- 이 credential을 팀과 공유하기 전에 [Credential 공유](./credentials-sharing.md)를 참조하십시오.

### 사용처

- [Google Drive 노드](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

BigQuery credential은 OAuth2 "Bring Your Own App" 모델을 사용하여 Heym을 Google BigQuery API에 연결합니다. Google Cloud OAuth2 Client ID와 Client Secret을 제공한 다음, 브라우저 팝업을 통해 액세스를 승인하십시오. Token은 백그라운드에서 자동으로 갱신됩니다.

### 설정

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library**를 열고 **BigQuery API**를 검색하여 활성화하십시오.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → 애플리케이션 유형 **Web application**으로 이동하십시오.
3. **Authorized redirect URIs** 아래에 다음을 추가하십시오: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. 생성된 **Client ID**와 **Client Secret**을 복사하십시오.
5. Heym Dashboard → **Credentials** → **New** → 유형 **BigQuery (OAuth2)**를 선택하십시오.
6. Client ID, Client Secret, 이름을 입력한 다음 **Connect**를 클릭하여 Google 동의 팝업을 열고 액세스를 승인하십시오.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `client_id` | Google Cloud Console의 OAuth2 Client ID |
| `client_secret` | Google Cloud Console의 OAuth2 Client Secret |

Token(`access_token`, `refresh_token`, `token_expiry`)은 자동으로 저장되고 갱신됩니다.

### 참고 사항

- OAuth2 동의 화면에는 BigQuery scope(`https://www.googleapis.com/auth/bigquery`)가 필요합니다.
- **프로덕션:** 백엔드 **`FRONTEND_URL`**을 공개 URL로 설정하십시오. Google Cloud Console에 `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`을 등록하십시오.

### 사용하는 노드

- [BigQuery 노드](../nodes/bigquery-node.md)

---

## Supabase

Supabase credential은 Heym을 Supabase 프로젝트의 PostgREST API에 연결하여 Workflow가 Postgres 기반 테이블을 쿼리하고 변경할 수 있도록 합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `supabase_url` | 프로젝트 기본 URL, 예: `https://your-project.supabase.co` |
| `supabase_key` | 대상 테이블에 액세스할 수 있는 API key |
| `supabase_schema` | 선택적 기본 schema (기본값은 `public`) |

### 참고 사항

- [Supabase 노드](../nodes/supabase-node.md)는 `/rest/v1/<table>`과 통신하며 연산자 필터(`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` 및 관련 PostgREST 연산자)와 중첩된 `or` / `and` 논리 그룹을 지원합니다.
- 쓰기 작업의 경우, 최소한의 필요한 테이블 권한을 가진 신뢰할 수 있는 서버 측 사용 용도의 key를 사용하는 것이 좋습니다.
- credential이 기본 schema를 정의하더라도 노드는 단계별로 schema를 재정의할 수 있습니다.

### 사용하는 노드

- [Supabase 노드](../nodes/supabase-node.md)

## ClickHouse

ClickHouse credential은 HTTP 인터페이스를 통해 Heym을 외부 ClickHouse 데이터베이스에 연결하여 Workflow가 OLAP 테이블에 대해 SQL, CRUD, count 작업을 실행할 수 있도록 합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `host` | scheme이 없는 HTTP host, 예: `your-instance.clickhouse.cloud` |
| `port` | HTTP 인터페이스 포트 (HTTPS의 경우 `8443`, HTTP의 경우 `8123`) |
| `username` | ClickHouse 사용자 (기본값은 `default`) |
| `password` | 사용자 비밀번호 (선택 사항) |
| `database` | 대상 데이터베이스 (기본값은 `default`) |
| `secure` | `true`일 때 HTTPS 사용 (ClickHouse Cloud에 필요) |

### 참고 사항

- [ClickHouse 노드](../nodes/clickhouse-node.md)는 공식 `clickhouse-connect` HTTP 클라이언트를 사용하며 필터 및 값 바인딩을 매개변수화합니다.
- `update`와 `remove`는 `ALTER TABLE ... UPDATE`와 `DELETE FROM`에 매핑되며, 이는 비동기 ClickHouse mutation이므로 둘 다 필터가 필요합니다.
- `upsert`는 `INSERT`를 수행하며 merge-on-key 동작을 위해 `ReplacingMergeTree` 테이블을 가정합니다.
- credential 대화 상자의 **Test connection**을 사용하여 연결 가능성을 확인하십시오.

### 사용하는 노드

- [ClickHouse 노드](../nodes/clickhouse-node.md)

## Notion

Notion credential은 내부 integration token 또는 public-integration OAuth 연결을 지원합니다. OAuth를 사용하면 각 사용자가 Token을 수동으로 복사하는 대신 Heym에서 Notion workspace를 승인할 수 있습니다.

### 필수 필드

| 모드 | 필드 | 설명 |
|------|-------|-------------|
| Internal token | `api_token` | 내부 integration token (`ntn_...`) |
| OAuth | `client_id` | Notion public integration의 Client ID |
| OAuth | `client_secret` | Notion public integration의 Client Secret |

OAuth callback은 `access_token`, `auth_mode`, `workspace_id`, `workspace_name`, `bot_id`를 자동으로 저장합니다. OAuth가 완료되면 이전의 내부 `api_token`은 제거됩니다. Notion에 다음 redirect URI를 등록하십시오:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth 설정 흐름

1. credential 대화 상자에서 **OAuth**를 선택하고 이름, Client ID, Client Secret을 입력하십시오.
2. **Connect**를 클릭하고 Notion 팝업에서 workspace를 승인하십시오.
   - **새** credential의 경우, **Connect**를 클릭하면 Heym이 credential 레코드를 생성합니다.
   - 팝업에서 승인을 완료한 다음 **Save**를 클릭하여 credentials 목록으로 돌아가십시오.
3. 연결된 credential은 목록에 `connected (Workspace Name)`으로 표시됩니다. 승인 대기 중인 OAuth credential은 승인이 완료될 때까지 `Not connected`로 표시됩니다.

credential 대화 상자의 **Test Connection**을 사용하여 내부 token 또는 완료된 OAuth 승인을 확인하십시오. 편집 시 token 필드를 비워두면 저장된 내부 token이 유지됩니다.

내부 token과 OAuth access token 모두 Notion bearer token이 필요한 사용자 정의 [HTTP](../nodes/http-node.md) 호출에 `$credentials.CredentialName`을 통해 사용할 수 있습니다.
### 참고 사항

- 내부 통합(Internal integration)을 사용하려면 관련 페이지, 데이터베이스, 데이터 소스가 공유되어 있어야 합니다.
- OAuth 사용자는 Notion 인증 과정에서 workspace/pages를 선택합니다.
- OAuth 애플리케이션 자격 증명은 Notion credential 내부에 암호화되어 저장됩니다. 콜백은 서버 측에서 이를 다시 로드하며, secret은 OAuth state에 포함되지 않습니다.
- 연결된 OAuth credential은 workspace 이름을 표시하며, 대기 중인 OAuth credential은 인증이 완료될 때까지 `Not connected`로 표시됩니다.
- **프로덕션:** 백엔드 **`FRONTEND_URL`** 을 공개 브라우저 URL(스킴 + 호스트, 후행 슬래시 없음)로 설정하십시오. Notion redirect URI는 다음 형식과 정확히 일치해야 합니다:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- 이 노드는 API 버전 `2026-03-11` 및 최신 `data_source` 용어를 사용합니다. 이전 `archived`, `after`, 또는 database-query 예제에서 마이그레이션하는 방법은 [Notion 노드](../nodes/notion-node.md#api-version-notes) 문서를 참조하십시오.
- 객체 값이 `database`인 이전 검색 필터는 `data_source`로 정규화됩니다.

### 사용처

- [Notion 노드](../nodes/notion-node.md)

---

## SMTP (이메일)

SMTP credential은 발신 메일 전송을 위한 이메일 서버 연결 정보를 저장합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `host` | SMTP 서버 호스트 이름 (예: `smtp.gmail.com`) |
| `port` | SMTP 포트 (일반적으로 STARTTLS는 `587`, SSL은 `465`) |
| `email` | SMTP 서버가 로그인할 때 사용하는 사용자 이름이며, `from`이 비어 있을 때 표시되는 발신자이기도 합니다 |
| `password` | SMTP 비밀번호 또는 App Password |

### 선택 필드

| 필드 | 설명 |
|-------|-------------|
| `from` (`smtp_from`) | 표시되는 발신자(From) 주소입니다. `email`로 보내려면 비워 두세요. 서버는 여전히 `email`로 로그인하므로 해당 계정에 이 주소로 보낼 수 있는 권한이 있어야 합니다(Gmail의 경우 인증된 **다른 주소로 메일 보내기** 별칭). |

### 주요 SMTP 제공업체

| 제공업체 | 호스트 | 포트 | 참고 |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | [App Password](https://support.google.com/accounts/answer/185833) 필요 (2단계 인증 활성화 필수) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Microsoft 계정 자격 증명 사용 |
| Mailgun | `smtp.mailgun.org` | `587` | 도메인 설정의 Mailgun SMTP 자격 증명 사용 |
| SendGrid | `smtp.sendgrid.net` | `587` | 사용자 이름은 `apikey`, 비밀번호는 API key 사용 |
| 사용자 지정 / 자체 호스팅 | 사용자 도메인 | `587` / `465` | Postfix, Exim 등 |

### 참고 사항

- Gmail은 2단계 인증이 활성화된 경우 일반 비밀번호 대신 **App Password**가 필요합니다.
- 포트 `587`은 STARTTLS를 사용합니다(평문으로 시작하여 TLS로 업그레이드). 포트 `465`는 암시적 TLS를 사용합니다(처음부터 SSL).

### 사용처

- [Send Email 노드](../nodes/send-email-node.md)

---

## IMAP (수신 이메일)

IMAP credential은 [IMAP Trigger 노드](../nodes/imap-trigger-node.md)로 받은 편지함을 모니터링하기 위한 연결 정보를 저장합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `imap_host` | IMAP 서버 호스트 이름 (예: `imap.gmail.com`) |
| `imap_port` | IMAP 포트 (대부분의 제공업체에서 SSL/TLS는 `993`) |
| `imap_username` | 메일함 사용자 이름 또는 전체 이메일 주소 |
| `imap_password` | 비밀번호 또는 제공업체별 앱 비밀번호 |

### 선택 필드

| 필드 | 설명 |
|-------|-------------|
| `imap_mailbox` | 모니터링할 메일함 폴더 (기본값: `INBOX`) |
| `imap_use_ssl` | SSL/TLS 활성화 (권장, 기본값: `true`) |

### 참고 사항

- IMAP trigger는 첫 번째 폴링 시 현재 메일함을 기준선으로 설정한 후, 이후에는 새로운 이메일만 처리합니다.
- Gmail, Microsoft 365 및 기타 호스팅 제공업체는 종종 **앱 비밀번호** 또는 이와 유사한 IMAP 전용 secret을 요구합니다.
- 첨부 파일 내용은 workflow payload에 다운로드되지 않으며, Heym은 첨부 파일 메타데이터만 노출합니다.

### 사용처

- [IMAP Trigger 노드](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (workflow trigger로서의 IMAP)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com)는 오픈 소스 메시지 브로커입니다. RabbitMQ credential은 큐와 exchange에 발행하고 소비하기 위한 연결 정보를 저장합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `rabbitmq_host` | AMQP 연결 URL (예: `amqp://localhost:5672`) |
| `rabbitmq_username` | RabbitMQ 사용자 이름 (기본값: `guest`) |
| `rabbitmq_password` | RabbitMQ 비밀번호 (기본값: `guest`) |

### Virtual Hosts

특정 virtual host에 연결하려면 `rabbitmq_host` URL에 이를 포함하십시오:

```
amqp://username:password@hostname:5672/vhost
```

기본 vhost를 사용하는 경우 경로 `/`는 생략할 수 있습니다.

### Delayed Message Plugin

[RabbitMQ 노드](../nodes/rabbitmq-node.md)는 **rabbitmq_delayed_message_exchange** 플러그인을 지원합니다. RabbitMQ 서버에서 이 플러그인이 활성화되어 있으면, 노드의 `rabbitmqDelayMs` 필드를 사용하여 발신 메시지에 지연(밀리초 단위)을 설정할 수 있습니다.

이 노드는 발행된 메시지에 `x-delay` 헤더를 설정합니다. 지연이 적용되려면 exchange 유형이 `x-delayed-message`여야 합니다.

자체 호스팅 RabbitMQ 인스턴스에서 플러그인을 활성화하려면:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

플러그인이 설치되어 있지 않으면 `x-delay` 헤더는 무시되고 메시지는 즉시 전달됩니다.

### 사용처

- [RabbitMQ 노드](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (workflow trigger로서의 RabbitMQ)

---

## Amazon S3

Amazon S3 credential은 Heym을 [Amazon S3](https://aws.amazon.com/s3/)에 연결합니다. [Amazon S3 노드](../nodes/amazon-s3-node.md)와 함께 사용하여 버킷과 폴더를 관리하고, 객체를 업로드 및 다운로드하며, 키를 복사하고, workflow에서 객체를 나열하거나 삭제할 수 있습니다.
### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `aws_access_key_id` | AWS IAM 액세스 키 ID |
| `aws_secret_access_key` | 액세스 키 ID와 쌍을 이루는 시크릿 액세스 키 |
| `aws_region` | 버킷이 위치한 AWS 리전 (예: `us-east-1`) |

### 선택 필드

| 필드 | 설명 |
|-------|-------------|
| `aws_session_token` | AWS STS 자격 증명 사용 시 임시 세션 Token |

### 참고 사항

- 이 자격 증명은 boto3를 통한 표준 AWS SigV4 인증을 사용합니다.
- 업로드 작업은 현재 UTF-8 텍스트 콘텐츠를 전송하며, 다운로드는 텍스트 또는 바이너리 객체의 경우 base64를 반환할 수 있습니다.

### 사용처

- [Amazon S3 노드](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io)는 캐싱 및 빠른 데이터 액세스에 사용되는 인메모리 키-값 저장소입니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `host` | Redis 서버 호스트명 또는 IP (예: `localhost`) |
| `port` | Redis 포트 (기본값: `6379`) |
| `password` | Redis 비밀번호 (설정되지 않은 경우 비워 두십시오) |

### 사용처

- [Redis 노드](../nodes/redis-node.md)

---

## Slack

Slack 자격 증명은 Slack 채널에 메시지를 게시하기 위한 **Incoming Webhook URL**을 저장합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (Slack 앱 구성에서 발급) |

### 참고 사항

- [api.slack.com/apps](https://api.slack.com/apps) → 해당 앱 → **Incoming Webhooks**에서 Incoming Webhook을 생성하십시오.
- 각 Webhook은 특정 채널에 한정됩니다. 채널별로 여러 자격 증명을 생성하십시오.

### 사용처

- [Slack 노드](../nodes/slack-node.md)

---

## Telegram

Telegram 자격 증명은 봇 기반 Workflow를 위한 **Bot Token**과 선택적 **Webhook Secret Token**을 저장합니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `bot_token` | BotFather에서 발급받은 Telegram Bot API Token |

### 선택 필드

| 필드 | 설명 |
|-------|-------------|
| `secret_token` | 수신 Webhook에서 `x-telegram-bot-api-secret-token`과 대조하여 검증하는 공유 시크릿 |

### 참고 사항

- [Telegram Trigger](../nodes/telegram-trigger-node.md)와 [Telegram](../nodes/telegram-node.md) 모두에 동일한 자격 증명을 사용하십시오.
- Telegram Trigger 노드 패널에 표시된 URL을 사용하여 Telegram의 `setWebhook` API로 Webhook을 수동으로 등록하십시오.
- Telegram 노드의 `chatId`는 리터럴 ID 또는 `$telegramEvent.message.chat.id`와 같은 표현식이 될 수 있습니다.

### 사용처

- [Telegram Trigger 노드](../nodes/telegram-trigger-node.md)
- [Telegram 노드](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

이 자격 증명은 [HTTP 노드](../nodes/http-node.md)가 발신 요청을 인증하는 데 사용됩니다.

### Bearer

HTTP 요청에 `Authorization: Bearer <token>` 헤더를 첨부합니다.

| 필드 | 설명 |
|-------|-------------|
| `token` | Bearer Token 값 |

### Header

HTTP 요청에 사용자 정의 헤더를 첨부합니다.

| 필드 | 설명 |
|-------|-------------|
| `header_key` | 헤더 이름 (예: `X-Api-Key`) |
| `header_value` | 헤더 값 |

두 유형 모두 [Expression DSL](./expression-dsl.md)에서 `$credentials.CredentialName`을 통해 참조하여 표현식을 지원하는 모든 노드에서 동적으로 사용할 수 있습니다.

### 사용처

- [HTTP 노드](../nodes/http-node.md)

---

## LLM Providers (OpenAI, Google, Custom, Cohere)

이 자격 증명은 AI 노드에 사용됩니다.

| 유형 | 설명 |
|------|-------------|
| **OpenAI** | GPT 모델 및 OpenAI 임베딩용 API 키 |
| **Google** | Gemini 모델용 API 키 |
| **Custom** | OpenAI 호환 Endpoint(Ollama, vLLM, LM Studio 등)용 API 키 + base URL |
| **Cohere** | Cohere 임베딩용 API 키 |

### OpenAI Prompt Caching

OpenAI는 시스템 Prompt의 정적(변하지 않는) 접두사를 자동으로 캐싱합니다. 별도의 구성이 필요하지 않습니다. 동일한 시스템 Prompt 접두사를 공유하는 반복적인 Workflow 실행은 캐싱된 Token 요금제의 혜택을 받아 비용과 지연 시간을 모두 절감합니다. 이는 길고 고정된 지침이 있고 실행 간에 사용자 메시지만 변경되는 경우 특히 유용합니다. [Traces 탭](../tabs/traces-tab.md) 또는 OpenAI 사용량 대시보드에서 캐시 적중률과 Token 절감량을 모니터링하여 최대 캐시 재사용을 위해 Prompt 구조를 최적화하십시오.

### 사용처

- [LLM 노드](../nodes/llm-node.md)
- [Agent 노드](../nodes/agent-node.md)
- [RAG 노드](../nodes/rag-node.md) (Qdrant 자격 증명을 통한 OpenAI 임베딩)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr)는 Cloudflare 및 이와 유사한 봇 방지 챌린지를 우회하기 위한 프록시 서버입니다.

### 필수 필드

| 필드 | 설명 |
|-------|-------------|
| `flaresolverr_url` | FlareSolverr 인스턴스의 URL (예: `http://localhost:8191`) |

여기서는 루프백 및 사설 주소가 지원되므로, Heym 옆에 FlareSolverr를 실행하는 것이 문서에 설명된 대로 작동합니다. URL은 링크-로컬 또는 클라우드 메타데이터 주소로 확인되어서는 안 됩니다. 사설 주소가 허용되므로 이 필드는 다른 내부 서비스를 가리킬 수도 있으며 응답은 노드 출력으로 반환됩니다. 로그인한 모든 사용자가 이 자격 증명을 생성할 수 있으므로, 경계는 자격 증명 공유가 아니라 Workflow를 작성할 수 있는 사용자와 네트워크 규칙입니다. [Egress Safety](../nodes/crawler-node.md#egress-safety)를 참조하십시오.

### 사용처

- [Crawler 노드](../nodes/crawler-node.md)

---
## 관련 문서

- [Credentials](./credentials.md) – 자격 증명 개요 및 노드에서의 사용 방식
- [Credentials Tab](../tabs/credentials-tab.md) – 자격 증명 추가 및 관리
- [Credentials Sharing](./credentials-sharing.md) – 사용자 및 팀과 자격 증명 공유
- [Security](./security.md) – 저장 데이터 암호화, 접근 제어
- [Expression DSL](./expression-dsl.md) – 동적 접근을 위한 `$credentials` 구문

---

## Model Router (Auto Model)

의사 결정 모델을 사용하여 각 요청을 기존 모델 자격 증명 중 하나로 라우팅합니다.
참조만 저장하며, 자체 키는 저장하지 않습니다.

### 필수 필드

- `decision_credential_id` – 접근 가능한 **Decision Model** 자격 증명입니다.
- `decision_model` – 라우팅 호출을 수행하는 모델로, 예를 들어 `jev-latest`입니다.
- `options` – 최소 두 개의 항목으로, 각 항목에는 이름, 사용자의 OpenAI/Google/Custom
  자격 증명 중 하나, 해당 자격 증명의 모델, 그리고 언제 선택되어야 하는지를 나타내는
  기준이 포함됩니다.

### 선택 필드

- `routing_instructions` – 옵션 전반을 어떻게 가중 평가할지에 대한 지침입니다.
- 하나의 옵션은 라우팅 실패 시 사용되는 fallback으로 표시할 수 있습니다.

### 참고 사항

옵션 이름은 의사 결정 모델이 선택하는 대상이므로 반드시 서로 달라야 합니다. 옵션은
다른 Model Router를 가리킬 수 없습니다.
