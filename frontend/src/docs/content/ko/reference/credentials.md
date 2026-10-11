# Credentials

Credentials는 Workflow 노드에서 사용하는 API 키와 시크릿을 저장합니다. [Credentials Tab](../tabs/credentials-tab.md)에서 추가하며, 노드 구성에서 이름으로 참조합니다.

## Credentials의 정의

- **사용자별 저장** – 각 credential은 사용자에게 속하며, 다른 사용자 또는 [Teams](./teams.md)와 [공유](./credentials-sharing.md)할 수 있습니다.
- **저장 시 암호화** – 민감한 값은 암호화되며, 생성 후에는 UI에서 마스킹 처리됩니다.
- **이름으로 참조** – 노드는 이름(또는 ID)으로 credential을 선택합니다. 실행 엔진은 런타임에 Workflow 소유자의 credential을 확인합니다.

## 노드에서의 사용 방식

| 노드 유형 | 일반적인 credential | 용도 |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | 모델용 API 키 |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | decision model Endpoint의 Base URL 및 선택적 API 키 |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | decision model을 사용하여 각 요청을 처리할 모델을 선택 |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT 구독 로그인(OAuth) 또는 runner용 Codex access Token, 그리고 저장소 작업용 GitHub PAT |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | runner용 OpenCode Go gateway API 키(선택적 base URL), 그리고 저장소 작업용 GitHub PAT |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub API 호출, GitHub 노드 작업, MCP 통합용 GitHub personal access Token(PAT) |
| [Jira](../nodes/jira-node.md) | Jira | Cloud 이메일/API Token 또는 Data Center 사용자 이름/비밀번호, Jira 사이트 base URL, 배포 모드, 선택적 REST API 버전 |
| [Linear](../nodes/linear-node.md) | Linear | 팀, 프로젝트, 이슈, 댓글용 Personal API 키 또는 OAuth2 |
| [HTTP](../nodes/http-node.md) | Bearer, Header | 요청 인증 |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot Token 및 선택적 Webhook 시크릿 |
| [Discord](../nodes/discord-node.md) | Discord | Incoming Webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | 서명 검증용 애플리케이션 공개 키 |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | 벡터 저장소 연결(외부 Qdrant 또는 pgvector를 통한 Heym 자체 Postgres), OpenAI 또는 OpenAI 호환 embedding Endpoint 사용 |
| [Slack](../nodes/slack-node.md) | Slack | Webhook 또는 API Token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | 수신 메일함 연결 |
| [Send Email](../nodes/send-email-node.md) | SMTP | 메일 서버 |
| [Redis](../nodes/redis-node.md) | Redis | 연결 |
| [Grist](../nodes/grist-node.md) | Grist | API 키 + 서버 URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 동의 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 동의 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 동의 |
| [Supabase](../nodes/supabase-node.md) | Supabase | 프로젝트 URL + API 키(+ 선택적 기본 스키마) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | 호스트 + 포트 + 사용자 이름/비밀번호 + 데이터베이스(+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration Token 또는 public integration Client ID + Client Secret + OAuth 동의 |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth Token 및 선택적 self-hosted base URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

자세한 설정(호스트, 포트, 공급자별 필드)은 [Third-Party Integrations](./integrations.md)를 참조하십시오. 여기에는 Telegram bot 설정, IMAP을 통한 수신 이메일, SMTP를 통한 발신 이메일이 포함됩니다.

GitHub.com 대신 GitHub Enterprise Server를 대상으로 하는 경우, GitHub credential에 선택적 `base_url`을 포함할 수 있습니다. Token을 교체하기 위해 GitHub credential을 편집할 때 `base_url`을 비워 두면 기존 Enterprise Endpoint가 유지됩니다. 해당 Endpoint를 변경하려는 경우에만 새 URL을 입력하십시오.

Jira, Linear, Supabase, Notion, Sentry, ClickHouse credential은 credential 대화 상자에서 **Test Connection**을 제공합니다. Jira의 경우, 검사는 Jira의 current user Endpoint를 호출합니다. Linear의 경우, 검사는 `getViewer`로 Linear API를 호출하고 API 키 또는 OAuth Token이 유효한지 확인합니다. 편집 시 저장된 시크릿이 여전히 존재한다면 API 키를 다시 입력하지 않고도 테스트할 수 있습니다. Notion의 경우, 대화 상자에서 **Internal token** 또는 **OAuth**를 선택하십시오. OAuth는 Notion public integration의 Client ID와 Client Secret을 사용합니다. Notion 설정에 대한 자세한 내용은 [Third-Party Integrations](./integrations.md#notion)를 참조하십시오.

## Coding-package 사용

[Settings](./user-settings.md)의 **AI Defaults** 탭에서는 Codex 자격 증명(소유 및 공유)의 남은 coding-package 사용량을 확인할 수 있습니다. 각 Codex 자격 증명에 대해 활성 rate-limit 윈도우별로 가로 막대를 표시합니다. 일반적으로 플랜에 따라 **5 hours** 및/또는 **Weekly** 윈도우가 표시되며, 남은 할당량의 백분율과 재설정 카운트다운이 함께 나타납니다. 데이터는 요청 시 가져오는 Codex 백엔드의 rate-limit 응답 헤더에서 가져옵니다.

OpenCode Go 자격 증명도 여기에 나열되지만 **"usage unavailable"** 로 표시됩니다. OpenCode zen gateway는 남은 할당량 데이터를 노출하지 않으므로 막대를 표시할 수 없습니다.

## 표현식에서 사용

일부 노드는 인증에 표현식을 허용합니다. 표현식 내에서 자격 증명의 확인된 secret을 참조하려면 [Expression DSL](./expression-dsl.md)과 `$credentials.CredentialName`을 사용하십시오. HTTP 요청에서 각 자격 증명 유형에 필요한 헤더 라인은 [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials)를 참조하십시오.

Codex 자격 증명은 의도적으로 `$credentials`에서 제외됩니다. ChatGPT(구독, 토큰당 API 비용 없음)로 로그인하든 Codex `access_token`을 붙여넣든, 토큰은 로컬 Codex runner 프로세스에만 전달됩니다. ChatGPT 로그인 토큰은 만료 시 자동으로 갱신됩니다.

Jira 자격 증명도 `$credentials`에서 제외됩니다. [Jira 노드](../nodes/jira-node.md)는 실행 시 `credentialId`로 자격 증명을 로드합니다. Jira 노드에서 다루지 않는 사용자 지정 Jira REST 호출의 경우 [HTTP 노드](../nodes/http-node.md)와 Jira Basic Auth(Jira Cloud의 경우 `email:api_token`, Data Center / Server의 경우 `username:password`)를 사용하십시오. 예: `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. `Authorization: Basic <base64(user:secret)>`와 함께 [Header](../nodes/http-node.md) 자격 증명을 사용할 수도 있습니다. Jira Data Center / Server personal access token과 Bearer 인증은 아직 Jira 자격 증명에서 지원되지 않습니다.

| 자격 증명 유형 | `$credentials.Name`에 노출되는 값 |
|-----------------|--------------------------------------|
| Bearer | Bearer token 문자열 |
| Header | cURL `-H` 인수에 바로 넣을 수 있는 완전한 `header key: header value` 라인 |
| GitHub | Personal access token |
| Notion | 내부 `api_token` 또는 OAuth `access_token` (Notion API 호출용 Bearer token) |
| Sentry | Sentry auth token |
| Discord / Slack | Webhook URL |

예시:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

네이티브 데이터베이스, 페이지, 블록 작업에는 Notion **노드**를 사용하십시오. 사용자 지정 [HTTP](../nodes/http-node.md) 요청에 동일한 Notion bearer token이 필요할 때는 `$credentials`를 사용하십시오.

## Chat에서 자격 증명 생성

[AI Assistant](./ai-assistant.md#credentials), [Chat 탭](../tabs/chat-tab.md) 및 [Chat with Heym](./chat-with-heym.md)은 Workflow에 자격 증명이 필요할 때 또는 요청할 때마다 자격 증명을 생성할 수 있습니다. 어시스턴트가 유형과 이름을 제안하면 대화 내에서 일반 자격 증명 양식이 열립니다. 소유한 자격 증명의 업데이트를 요청하면 secret이 마스킹된 상태로 동일한 양식이 열립니다. 어시스턴트는 이름과 유형만 볼 수 있습니다. [MCP](../tabs/mcp-tab.md)를 통한 `heym_chat`은 자격 증명을 생성, 업데이트 또는 선택할 수 없습니다.

## 관련 항목

- [Credentials 탭](../tabs/credentials-tab.md) – 자격 증명 추가, 편집, 삭제
- [GitHub 노드](../nodes/github-node.md) – 네이티브 GitHub REST 작업
- [Jira 노드](../nodes/jira-node.md) – Jira 프로젝트, 이슈, 댓글, 첨부 파일, 사용자, 알림 및 전환 자동화
- [Linear 노드](../nodes/linear-node.md) – Linear GraphQL 워크스페이스 및 이슈 자동화
- [Notion 노드](../nodes/notion-node.md) – Notion 콘텐츠 검색 및 관리
- [Sentry 노드](../nodes/sentry-node.md) – Sentry 조직, 프로젝트, 팀, 이슈, 이벤트 및 릴리스 자동화
- [Credentials Sharing](./credentials-sharing.md) – 사용자 및 팀과 공유
- [Third-Party Integrations](./integrations.md) – 자격 증명 유형별 설정 가이드
- [Expression DSL](./expression-dsl.md) – 표현식에서의 `$credentials`

## Model Router (Auto Model)

Model Router는 key를 보유하지 않습니다. 대신 **decision model credential**, **model options** 목록(각각 기존 OpenAI, Google 또는 Custom 자격 증명과 모델로 구성) 및 각 옵션에 대해 해당 옵션을 언제 사용해야 하는지 설명하는 자유 텍스트를 보유합니다.

모델을 제공하는 모든 picker에 나타납니다. [LLM](../nodes/llm-node.md) 및 [Agent](../nodes/agent-node.md) 노드, Chat, AI Defaults, Dashboards, 표현식 빌더 및 Data Tables가 여기에 해당합니다. 유일한 모델은 **Auto**입니다. 이를 선택하면 decision model이 각 요청을 읽고 라우팅합니다. [Evals](../tabs/evals-tab.md)는 이를 제외합니다. eval은 특정 모델을 비교하는 반면 router는 스스로 선택하기 때문입니다.

Agent는 tool loop가 진행됨에 따라 재라우팅하므로 저렴한 모델이 초기 턴을 담당하고 더 강력한 모델이 필요한 턴을 담당할 수 있습니다. 동일한 입력은 이전 결정을 재사용하므로 loop는 대화가 실제로 진행된 경우에만 결정 비용을 지불합니다.

### 할 수 없는 작업

Auto Model은 **Responses API**, **Batch mode** 또는 **image output**과 함께 사용할 수 없습니다. router가 선택되면 해당 토글은 자체적으로 비활성화되며 각각 이유를 표시합니다. Guardrail 검사와 human-review policy classifier는 고정된 단일 모델 호출이며 절대 라우팅하지 않습니다.

### 라우팅이 실패할 경우

**라우팅 실패 시 이 옵션 사용** 옵션을 하나 표시하면 결정 모델 장애가 실행을 중단시키지 않습니다. 폴백이 사용되며 그 이유가 실행에 기록됩니다. 이 옵션이 없으면 노드는 추측하는 대신 실패합니다.

### 요청이 어디로 전달되었는지 확인하기

Traces는 모델만이 아니라 `Auto Model / GPT-5`를 표시하며, 비용은 실제로 실행된 모델에 계속 귀속됩니다. 캔버스 Execution Log와 Span View는 동일한 쌍을 표시하며, Span View는 어느 턴이 어디로 전달되었는지 나열합니다.
