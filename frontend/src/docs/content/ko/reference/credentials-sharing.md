# 자격 증명 공유

Credentials는 다른 사용자와 공유할 수 있어, 그들의 Workflow에서 귀하의 API 키를 사용할 수 있습니다. 개요는 [Credentials](./credentials.md)를, 추가 및 관리는 [Credentials Tab](../tabs/credentials-tab.md)을 참조하십시오.

## LLM과 Credentials 공유

LLM 또는 AI 에이전트가 API 키를 사용하도록 하려면, 키를 credential로 저장하고 요청을 수행하는 노드가 이를 첨부하도록 하십시오. 모델은 무엇을 호출할지 결정하고, 노드는 실행 시 호출을 인증합니다.

- **시크릿을 credential로 저장하십시오.** 민감한 값은 저장 시 암호화되며, 생성 후 UI에서 마스킹됩니다.
- **요청이 이루어지는 곳에서 참조하십시오.** [LLM](../nodes/llm-node.md) 및 [Agent](../nodes/agent-node.md) 노드는 ID로 모델 credential을 선택하며, HTTP 요청은 auth 헤더에 `$credentials.CredentialName`을 넣습니다. Prompt 필드에는 시크릿을 두지 마십시오. Prompt에 있는 모든 내용은 텍스트로 모델 제공자에게 전송되기 때문입니다.
- **에이전트에게는 키가 아닌 도구를 제공하십시오.** Agent가 HTTP 노드, MCP 서버, 또는 하위 Workflow를 도구로 호출할 때, credential은 해당 도구 내부에서 적용되며 모델은 도구의 결과를 받습니다.
- **출력은 마스킹됩니다.** 7자보다 긴 credential 값이 노드의 출력에 나타나면 처음 7자만 유지되므로, 키를 그대로 반환하는 응답은 결과와 trace에서 해당 접두사만 표시됩니다. [출력 마스킹](#output-masking)을 참조하십시오.
- **어시스턴트가 credential을 생성하도록 하십시오.** [AI Assistant](./ai-assistant.md#credentials) 또는 Chat 탭이 credential을 생성할 때, 어시스턴트는 이름과 유형만 보며, 귀하가 일반 credential 양식에 시크릿을 입력합니다.
- **사람에게도 동일한 방식으로 공유하십시오.** 아래에 설명된 대로 사용자 또는 팀에 credential을 공유하면, 그들의 Workflow가 자체 LLM 및 Agent 노드를 통해 귀하의 키를 사용할 수 있습니다.

## 공유 모델

- **CredentialShare** – `credential_id`를 `user_id`에 연결합니다 (쌍당 고유)
- **이메일로 공유** – 이메일과 함께 `POST /api/credentials/{credential_id}/shares`; 사용자가 조회되어 추가됩니다
- **취소** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

[Teams](./teams.md)와도 credential을 공유할 수 있습니다:

- **CredentialTeamShare** – `credential_id`를 `team_id`에 연결합니다; 모든 팀 멤버가 접근 권한을 얻습니다
- **팀과 공유** – `team_id`와 함께 `POST /api/credentials/{credential_id}/team-shares`
- **팀 공유 취소** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

공유된 credential은 [Credentials Tab](../tabs/credentials-tab.md) UI에 표시기가 나타납니다.

## 광범위한 범위의 Credentials

Credential을 공유하면 수신자에게 해당 credential이 할 수 있는 모든 것이 부여됩니다. 대부분의 통합에서는 하나의 workspace 또는 하나의 API 키 권한으로 범위가 제한되지만, 일부 credential은 훨씬 광범위합니다.

> **Google Drive credential은 전체 Drive 접근 권한을 부여합니다.** [Google Drive](../nodes/google-drive-node.md) credential은 노드가 귀하가 이미 소유한 파일을 조작할 수 있도록 `https://www.googleapis.com/auth/drive` scope로 인증됩니다. 이를 사용자 또는 팀에 공유하면, 그들 모두가 Workflow를 통해 **귀하의 Google Drive에 있는 모든 것을 읽고, 수정하고, 영구적으로 삭제**할 수 있는 능력을 얻게 됩니다 — 귀하가 염두에 두었던 파일만이 아닙니다. 직접 전체 Drive 접근 권한을 부여할 사람에게만 공유하십시오.

노출을 제한해야 하는 경우, Workflow에 필요한 폴더에만 접근할 수 있는 전용 Google 계정을 만들고, 기본 계정 대신 해당 계정으로 credential을 연결하십시오.

**Decision Model** credential은 endpoint와, 설정된 경우 API 키를 포함합니다. 이를 공유하면 수신자가 실행할 수 있는 모든 Workflow에서 해당 키로 비용을 지출할 수 있으며, 이는 LLM credential과 정확히 동일합니다.

**Model Router** credential은 라우팅하는 모든 것을 공유합니다. 이를 공유한 사람들은 옵션 목록에 있는 모든 credential에 대해 요청을 실행할 수 있으며, 그 요청은 귀하의 키로 비용을 지출합니다. 그들은 키를 읽을 수 없고, credential은 그들 자신의 credential 목록에 나타나지 않습니다.

이는 OpenAI credential을 직접 공유하는 것과 동일한 권한 부여이며, 이것이 router를 팀에 유용하게 만드는 이유입니다. 이를 원하지 않으면 개별 credential을 공유하고 각자가 모델을 선택하도록 하십시오.

## Workflow 협업자와 공유

Workflow를 공유하면 협업자가 이를 열고 실행할 수 있지만, 해당 credential도 그들과 공유하지 않는 한 귀하의 credential을 사용할 수 없습니다. 이는 메인 Workflow와 그것이 호출하는 모든 하위 Workflow의 credential에 적용됩니다. Workflow에 초대한 것과 동일한 사용자 또는 팀에 각 credential을 공유하십시오. 하위 Workflow는 하위 Workflow의 편집기에서 별도로 공유해야 합니다. [Workflow Organization](./workflow-organization.md#sharing-workflows)을 참조하십시오.

## 실행 컨텍스트

Workflow가 실행될 때, credential은 **Workflow 소유자** (또는 실행 시 현재 사용자)에 대해 해석됩니다. `get_credentials_context()`는 다음을 병합합니다:

1. **소유한 credential** – `Credential.owner_id == user_id`
2. **사용자 공유 credential** – `CredentialShare.user_id == user_id`인 `CredentialShare`
3. **팀 공유 credential** – 사용자가 팀의 멤버인 `CredentialTeamShare`

모두 credential 이름으로 키가 지정된 단일 컨텍스트 dict로 병합됩니다.

## Workflow에서의 사용
### 이름 기준 (Expression DSL)

Credential은 [Expression DSL](./expression-dsl.md)에서 `$credentials.CredentialName`으로 노출됩니다. 다음 용도로 사용하십시오:

- HTTP 노드 (Bearer/Header 인증)
- Telegram 노드
- Slack 노드
- 사용자 정의 HTTP 요청에서의 Notion bearer token (내부 token 또는 OAuth access token)
- 인증을 위해 표현식을 허용하는 모든 노드

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### ID 기준 (credentialId)

일부 노드는 `node.data`에 `credentialId` (UUID)를 저장합니다:

| 노드 유형 | 필드 | 설명 |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API credential |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex access token credential 및 GitHub credential |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go gateway credential 및 GitHub credential |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud email/API token 또는 Data Center username/password credential |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion 내부 token 또는 OAuth workspace credential |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token 및 선택적 base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase 프로젝트 URL 및 API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse 연결 정보 (host, port, auth, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot credential |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord public key 또는 webhook credential |
| Vector Store | `credential_id` | Qdrant 또는 Postgres (pgvector) vector DB, Qdrant, Psql 또는 Custom Embeddings RAG credential을 통해 |
| Evals | `credential_id`, `judge_credential_id` | 모델 credential; LLM-as-Judge judge를 위한 모델 또는 Decision Model credential |
| [Playwright](../nodes/playwright-node.md) AI step | `credentialId` | LLM/Vision 모델 (AI step 및 [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)용) |

executor는 데이터베이스에서 ID로 credential을 직접 로드하고 config를 복호화합니다.

## 출력 마스킹

실행 후 `mask_sensitive_output()`은 출력에서 credential 값을 마스킹하며, 7자보다 긴 각 secret의 처음 7자만 유지하고 나머지는 `**`로 대체하여 결과나 trace에 secret이 노출되지 않도록 합니다.

## 관련 항목

- [Credentials 탭](../tabs/credentials-tab.md) – Credential 추가 및 공유
- [서드파티 통합](./integrations.md) – 각 credential 유형별 상세 설정
- [Teams](./teams.md) – 팀과 공유
- [Expression DSL](./expression-dsl.md) – `$credentials` 구문
- [노드 유형](./node-types.md) – Credential을 사용하는 노드 ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent 노드](../nodes/agent-node.md) – LLM에 `credentialId` 사용
