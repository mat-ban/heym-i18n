# Agent 노드

**AI Agent** 노드는 도구 호출 기능을 갖춘 LLM 노드입니다. Python 도구를 실행하고, 연결된 캔버스 노드를 도구로 호출하며, MCP 서버에 연결하고, 스킬을 사용하며, 선택적으로 다른 agent 노드에 위임하는 오케스트레이터 역할을 수행하고, 다른 Workflow를 도구로 호출하며, [human review](../reference/human-in-the-loop.md)를 위해 일시 중지할 수 있습니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1, 그리고 HITL이 활성화된 경우 선택적으로 `review` |
| 출력값 | `$nodeLabel.text`, `$nodeLabel.fieldName` (JSON 출력이 활성화된 경우), 또는 review 대기 중인 HITL Payload |

## 핵심 파라미터

### Credential 및 모델

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | Settings의 LLM credential (API key) |
| `model` | string | 모델 이름 (예: `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (선택) | 기본 credential 실패 시 사용할 대체 credential |
| `fallbackModel` | string (선택) | 기본 모델 실패 시 사용할 대체 모델 |

[Credentials](../tabs/credentials-tab.md) 탭에서 credential을 추가하십시오. 모델 목록은 선택한 credential에서 로드됩니다. 기본 credential 또는 모델이 오류를 반환하면, 노드는 실패하기 전에 대체 credential과 모델로 자동 재시도합니다.

### Prompt

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `systemInstruction` | string | AI를 위한 시스템 Prompt. [표현식](../reference/expression-dsl.md)을 지원합니다. |
| `userMessage` | string | 사용자 메시지/Prompt. 기본값: `$input.text` |
| `jsonOutputEnabled` | boolean | 구조화된 JSON 출력 |
| `jsonOutputSchema` | string | 구조화된 출력을 위한 JSON Schema |
| `extraBodyEnabled` | boolean | 제공자별 요청 파라미터 전송 (기본값: `false`) |
| `extraBody` | string | agent가 수행하는 모든 API 요청에 병합되는 JSON 객체 |

`$input.text`, `$nodeName.field` 및 기타 [Expression DSL](../reference/expression-dsl.md) 문법을 사용하십시오.

### 추론 모델 (o1, o3)

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (기본값: 0.7), 표준 모델용 |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | 추론 모델의 추론 깊이 |

추론 모델(예: o1, o3)을 사용하는 경우 UI는 Temperature 대신 **Reasoning Effort**를 표시합니다. 표준 모델의 경우 **Temperature**가 창의성을 제어합니다.

**JSON 출력 예시:** agent로부터 구조화된 데이터(예: 분류, 추출)가 필요할 때 JSON 출력을 활성화하고 schema를 제공하십시오. agent는 schema에 맞는 JSON을 반환하며, 노드 출력에서 이름으로 필드에 접근할 수 있습니다:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

다운스트림 노드는 `$agentLabel.status`, `$agentLabel.reason` 등을 사용할 수 있습니다. [LLM 노드](../nodes/llm-node.md)의 JSON 출력과 동일하게 동작합니다.

## Human Review (HITL)

agent가 중요한 작업 전 특정 시점에 승인이 필요할 수 있는 경우 HITL을 사용하십시오.

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `hitlEnabled` | boolean | agent에 human-review 체크포인트를 추가합니다 |
| `hitlSummary` | string | agent에게 human review가 언제 필요한지 알려주는 승인 가이드라인 |

HITL이 활성화되면 agent는 `request_human_review` 도구를 받습니다. 시스템 Prompt와 이 가이드라인 필드를 사용하여 어떤 도구 호출, 하위 agent, 하위 Workflow, MCP 작업, 스킬 또는 부작용에 승인이 필요한지 설명하십시오. agent는 필요할 때만 해당 도구를 호출할 수 있으며, 한 번의 실행에서 여러 번 호출할 수도 있습니다.

공개 페이지에서 reviewer에게 표시되는 요약은 런타임 시 agent의 review 요청으로부터 생성됩니다. agent가 요약을 명시적으로 제공하지 않으면 Heym이 Markdown review 본문에서 요약을 도출합니다.

MCP 도구의 경우, Heym은 모델에게 작성된 HITL 지침을 `always`, `once`, `never` 중 하나의 범위로 해석하도록 요청합니다. 즉, "for each call", "only one time", "never ask"와 같은 자유 형식 표현은 런타임 게이팅이 적용되기 전에 정규화됩니다.

각 HITL 체크포인트는 `/review/{token}`에 일회성 공개 review 링크를 생성합니다. reviewer는 다음을 수행할 수 있습니다:

- **Accept**: 원본 Markdown review 텍스트를 그대로 수락
- **Edit & Continue**: 수정된 Markdown으로 계속 진행
- **Refuse**: `text: ""`로 계속 진행

HITL이 활성화되면 노드는 캔버스에 `review` 출력 핸들도 노출합니다. 실행이 일시 중지되는 즉시 review URL과 요약을 브로드캐스트하려면 해당 분기를 Slack, 이메일 또는 기타 알림 노드에 연결하십시오.

reviewer가 응답할 때까지 실행은 `pending`으로 이동합니다. review 텍스트는 단일 Markdown 본문이며, pending Payload에는 외부 핸드오프를 위한 공유 가능한 링크 텍스트도 포함됩니다. `review` 분기의 노드는 일시 중지가 생성될 때 즉시 실행되며, 정상 출력 경로는 승인 후에만 계속됩니다. 승인 후 Heym은 저장된 실행 스냅샷에서 재개하고 agent는 승인된 컨텍스트로 계속 진행합니다. 이후 단계에서도 승인이 필요한 경우 agent는 또 다른 HITL 체크포인트를 생성할 수 있습니다. Payload 형태, review URL 동작 및 재개 의미론은 [Human-in-the-Loop](../reference/human-in-the-loop.md)를 참조하십시오.

HITL은 텍스트 모드 agent 출력에서만 사용할 수 있습니다. v1에서는 `jsonOutputEnabled`와 함께 사용할 수 없습니다.
## Orchestrator 모드

활성화하면 에이전트가 Workflow 내 다른 에이전트 노드에 작업을 위임할 수 있습니다. **Orchestrator 모드가 비활성화된 경우**, 에이전트는 캔버스에서 **에이전트→에이전트 연결을 생성할 수 없습니다**.

| Parameter | Type | Description |
|-----------|------|-------------|
| `isOrchestrator` | boolean | `true`인 경우, 에이전트에 `call_sub_agent` 도구가 부여됩니다 |
| `subAgentLabels` | string[] | 이 Orchestrator가 호출할 수 있는 에이전트 노드의 Label |

**Sub-agent**는 Orchestrator의 Prompt를 수신할 수 있도록 User Message에서 반드시 `$input.text`를 사용해야 합니다.

Orchestrator가 단일 턴에서 여러 Sub-agent를 호출하면, 이들은 병렬로 실행됩니다. 자세한 내용은 [Agent Architecture](../reference/agent-architecture.md)를 참조하십시오.

## Sub-Workflow

설정하면 에이전트가 다른 Workflow를 실행할 수 있는 `call_sub_workflow` 도구를 수신합니다.

| Parameter | Type | Description |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | 이 에이전트가 도구로 호출할 수 있는 Workflow의 ID |

에이전트 설정의 Sub-Workflows 섹션에서 Workflow를 선택하십시오. 에이전트는 `workflow_id`와 `inputs`(대상 Workflow의 입력 필드와 일치하는 객체)로 이들을 호출합니다. 최대 깊이: 중첩된 Sub-Workflow 호출 5단계.

## 캔버스 노드 도구

지원되는 Workflow 노드를 에이전트의 **tools** 핸들에 연결하면 에이전트가 런타임에 해당 노드를 호출할 수 있습니다. 이를 통해 Python을 작성하지 않고도 기존 캔버스 액션과 변환을 호출 가능한 도구로 전환할 수 있습니다.

자격 증명, 정적 필드, Workflow별 설정을 노드 UI에 그대로 유지하면서 에이전트가 구성된 노드의 실행 시점을 결정하도록 하려면 캔버스 노드 도구를 사용하십시오.

### 에이전트 제공 필드

연결된 도구 노드의 필드는 봇 아이콘으로 표시할 수 있습니다. 표시된 필드는 에이전트가 노드를 호출할 때 반드시 제공해야 하는 필수 도구 Parameter가 됩니다. 표시되지 않은 필드는 고정된 상태로 유지되며 노드 구성에서 읽어옵니다.

예를 들어:

- Slack 노드를 도구로 에이전트에 연결
- Slack 노드에서 자격 증명을 고정으로 유지
- `message`를 에이전트 제공으로 표시
- 에이전트는 런타임에 메시지만 제공하는 Slack 도구를 수신

노드가 도구로 에이전트에 연결되지 않은 경우, 봇 아이콘은 숨겨지고 노드는 일반 Workflow 단계처럼 동작합니다.

### 런타임 동작

에이전트가 캔버스 노드 도구를 호출하면, Heym은 에이전트가 제공한 인수를 해당 노드의 데이터에 임시로 병합하고, 노드를 실행하고, 노드 출력을 에이전트에 반환한 다음, 원래 노드 구성을 복원합니다. 도구 노드는 일반 스케줄링을 통한 정규 Workflow 단계로 실행되지 않으며, 에이전트가 호출할 때만 실행됩니다.

캔버스 노드 도구는 Slack, Telegram, HTTP, Send Email과 같은 통합 노드 및 [Set](./set-node.md)과 같은 데이터 가공 노드와 함께 사용하면 유용합니다. Trigger 노드, 제어 흐름 노드, 터미널 출력 매퍼([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md))는 에이전트 도구로 사용할 수 없습니다.

## Python 도구

에이전트가 호출할 수 있는 사용자 정의 도구를 정의합니다. 각 도구는 다음을 가집니다:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | 도구 이름 (예: `count_characters`) |
| `description` | string | LLM을 위한 설명 |
| `parameters` | JSON Schema | OpenAI function-calling 스키마 (객체 형식) |
| `code` | string | Python 함수 코드 |

**Parameters**는 문자열이 아닌 JSON 객체여야 합니다:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**도구 예시:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python 도구는 기본적으로 강화된 격리 Docker 컨테이너에서 신뢰할 수 없는 코드로 실행됩니다 (네트워크 없음, Docker 소켓 없음, 읽기 전용 파일 시스템, 비루트). Import는 안전한 표준 라이브러리 모듈의 허용 목록으로 제한됩니다. 구성(`HEYM_PYTHON_TOOL_SANDBOX`)은 [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox)를 참조하십시오.

| Parameter | Type | Description |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | 도구 실행당 최대 초 (기본값: 30) |
| `requestTimeoutSeconds` | number | 타임아웃 전 각 모델 응답을 대기하는 최대 초 (기본값: 60). 느리거나 자체 호스팅되는 Provider(LiteLLM, vLLM, 로컬 모델) 및 긴 다단계 실행의 경우 값을 높이십시오. |
## MCP Connections

[Model Context Protocol](https://modelcontextprotocol.io/) 서버에 연결하여 해당 서버의 도구를 에이전트에 노출합니다.

| Parameter | Type | Description |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | 연결 유형 |
| `timeoutSeconds` | number | 이 연결의 타임아웃 (기본값: 30) |
| `label` | string | 선택적 표시 이름 |

**stdio** (로컬 프로세스):

| Field | Description |
|-------|-------------|
| `command` | 실행할 명령어 (예: `npx`) |
| `args` | JSON 배열 (예: `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | 프로세스에 주입할 환경 변수의 JSON 객체 (예: `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

대부분의 API 키 기반 stdio 서버는 명령어 인자가 아닌 환경 변수를 통해 인증합니다. 각 에이전트 노드가 호스트 환경을 건드리지 않고 서로 다른 자격 증명을 사용할 수 있도록 연결별로 `env`를 설정하십시오.

`env` 값은 [Expression DSL](../reference/expression-dsl.md)을 지원하므로, 시크릿을 하드코딩하는 대신 Workflow 입력을 자격 증명으로 전달할 수 있습니다:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

표현식 `$userInput.pat`은 MCP 프로세스가 시작되기 전에 Workflow의 입력 데이터를 기준으로 런타임에 해석됩니다. 이를 통해 Workflow 정의에 토큰을 포함시키는 대신 Trigger 또는 입력 노드에서 토큰을 받을 수 있습니다.

예시 — 하드코딩된 토큰을 사용하는 GitHub MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

예시 — Workflow 입력에서 동적 토큰을 사용하는 GitHub MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

예시 — Heym GitHub 자격 증명을 사용하는 GitHub MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

내장 GitHub 자격 증명은 현재 PAT 기반 인증을 대상으로 합니다. 조직 액세스가 필요한 경우, 필요한 조직/저장소 권한을 가진 PAT를 사용하십시오.

예시 — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (원격 서버):

| Field | Description |
|-------|-------------|
| `url` | SSE endpoint URL. 표현식을 지원합니다 (예: `$userInput.serverUrl`). |
| `headers` | 인증/사용자 정의 헤더용 JSON 객체. 값은 표현식을 지원합니다. |

**Streamable HTTP** (원격 서버):

| Field | Description |
|-------|-------------|
| `url` | MCP endpoint URL (예: `https://example.com/mcp`). 표현식을 지원합니다. |
| `headers` | 인증/사용자 정의 헤더용 JSON 객체. 값은 표현식을 지원합니다. |

## Skills

Skills는 SKILL.md 지침과 선택적 Python 파일 및 번들 자산으로 구성됩니다. 이들은 에이전트의 시스템 컨텍스트를 확장하며 Python 도구를 추가할 수 있습니다.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Skill 이름 |
| `content` | string | SKILL.md 콘텐츠 (지침) |
| `timeoutSeconds` | number | Skill Python 실행 타임아웃 (기본값: 30) |
| `driveFilesEnabled` | boolean | 이 Skill에 대해 런타임 `heym_drive` 헬퍼를 활성화합니다 (기본값: false) |
| `files` | array | 선택적 `{ path, content, encoding, mimeType }` 항목 (예: `.py` 스크립트 또는 base64로 저장된 바이너리 자산) |

Skills 영역에 `.zip` 또는 `.md` 파일을 드롭하여 Skill을 추가할 수 있습니다.
Skill 카드를 펼친 후 해당 Skill에 파일을 드롭하면 PDF 및 이미지와 같은 바이너리 자산을 포함한 번들 파일을 첨부하거나 교체할 수 있습니다.
Skill 카드의 다운로드 버튼을 사용하면 해당 Skill을 `.zip` 아카이브로 내보내 백업하거나 다른 Workflow에서 재사용할 수 있습니다.

Skill의 Python 코드가 Heym Drive에서 파일을 읽어야 하는 경우에만 **Drive files**를 활성화하십시오. 활성화된 Skill은 런타임에 생성된 `heym_drive.py` 헬퍼를 받으며, Drive 파일 id 또는 정확한 파일명으로 `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text`, `read_drive_base64`를 호출할 수 있습니다. 파일명 조회는 액세스 가능한 가장 최신 일치 항목을 사용합니다. 비활성화된 Skill은 헬퍼를 받지 않습니다.

각 Skill 카드에는 제목 아래 행에 네 가지 작업이 있습니다:

| Button | Description |
|--------|-------------|
| **Edit with AI** | 채팅 Prompt로 Skill을 수정할 수 있도록 Skill Builder를 엽니다 |
| **Download** | Skill을 `.zip` 아카이브로 내보냅니다 |
| **Remove** | 이 에이전트 노드에서 Skill을 삭제합니다 |
| **History** | [Edit History](../reference/edit-history.md)에서 파생된 Skill 이력을 엽니다 |
### Skill 이력

Skill 이력은 **별도로** 저장되지 않습니다. 이는 Workflow Edit History 스냅샷에서 파생됩니다. 저장된 각 Workflow 버전에는 전체 에이전트 노드 `skills` 배열이 포함됩니다.

History 대화상자에서 다음을 수행할 수 있습니다:

- **미리보기(Preview)** — 과거 스냅샷(SKILL.md 및 파일 목록)을 확인합니다
- **편집(Edit)** — 전체 Workflow를 되돌리지 않고 스냅샷을 Skill 편집기에 로드합니다
- **AI Fine-tune** — 해당 스냅샷을 시작점으로 하여 Skill Builder를 엽니다
- **되돌리기(Revert)** — 과거 버전에서 이 Skill만 복원합니다(다른 노드는 그대로 유지됨)

이력은 Workflow Edit History와 동일한 7일 보존 정책을 따릅니다. Skill 편집 후 Workflow를 저장하면 새로운 이력 항목이 생성됩니다.

Skills 섹션에는 **AI Build**도 포함됩니다:

- **AI Build**를 클릭하여 채팅 Prompt로 새 Skill을 생성합니다
- 기존 Skill의 반짝임 버튼을 클릭하여 AI로 수정합니다
- Prompt 작성기에 파일을 드롭하여 Fine-tune 코멘트에 첨부합니다. 해당 파일은 번들 Skill 자산으로도 저장됩니다
- 모달은 실시간 `SKILL.md` 및 `.py` 파일 미리보기를 표시하면서 어시스턴트 텍스트를 스트리밍합니다
- **Download ZIP**은 현재 미리보기를 노드에 추가하지 않고 내보냅니다
- **Save & Add**는 수동 업로드에 사용되는 것과 동일한 ZIP 파싱 흐름을 통해 생성된 파일을 다시 저장합니다

AI로 편집할 때 Heym은 텍스트 `.md` 및 `.py` Skill 파일만 빌더로 전송합니다. 바이너리 및 기타 편집 불가능한 첨부 파일은 보존되며 경로 메타데이터로 빌더와 공유되어, 생성된 Python 코드가 상대 파일 참조를 올바르게 유지할 수 있습니다.
오른쪽 패널에서 첨부 파일을 선택하고 AI가 번들 템플릿을 검사해야 할 때 **Include this file in AI context**를 활성화하십시오. 텍스트, PDF, DOCX 파일은 가능한 경우 Prompt 컨텍스트로 추출됩니다. Heym은 플랫폼 요청 본문 제한 외에 별도의 Skill Builder 첨부 파일 크기 상한을 적용하지 않습니다.

## Extra Body

일부 제공자는 표준 OpenAI 호환 필드가 다루지 않는 요청 파라미터를 허용합니다. 예를 들어 모델의 thinking 모드를 비활성화하는 경우입니다. 노드 속성에서 **Send extra request body**를 체크하고 JSON 객체를 입력하십시오.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **기본적으로 비활성화됩니다.** 체크박스가 꺼져 있으면 추가 항목이 전송되지 않습니다.
- 첫 번째 턴뿐만 아니라 tool-calling 루프의 **모든** 요청과 fallback 모델 시도에 적용됩니다. 별도의 모델을 사용하는 guardrail 검사에는 적용되지 않습니다.
- 반드시 JSON **객체**여야 합니다. 배열, 스칼라 또는 잘못된 형식의 텍스트는 조용히 무시되지 않고 `Invalid extra body JSON`과 함께 노드를 실패시킵니다.
- `$` 표현식은 파싱 전에 해석됩니다. 이는 텍스트 치환이므로, 해석된 값에 큰따옴표나 줄바꿈이 포함되면 유효하지 않은 JSON이 생성되어 노드가 실패합니다.

[LLM 노드](./llm-node.md) extra body와 동일한 필드 및 동작입니다.

## Guardrails

노드 속성에서 **Guardrails**를 활성화하면 에이전트가 실행되기 전에 안전하지 않은 사용자 메시지를 차단합니다. 전체 참조는 [Guardrails](../reference/guardrails.md)를 확인하십시오.

## Persistent memory (graph)

데이터베이스에 저장되는 선택적 **에이전트 노드별** 지식 그래프입니다. 활성화하면 Heym은 각 실행 전에 기억된 엔티티와 관계에 대한 Markdown 요약을 **시스템 지침**에 추가합니다(그래프가 비어 있지 않은 경우에만). 에이전트가 **성공적으로** 완료된 후, 백그라운드 작업이 대화에서 새로운 지속적 사실을 추출하여 그래프에 병합합니다.

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | 이 캔버스 노드에 대한 로드 + 백그라운드 추출을 활성화합니다 |

**Sub-agent**는 오케스트레이터와 별도로 **자체** 그래프(해당 노드 id로 키 지정)를 유지합니다.

노드의 분홍색 **brain** 컨트롤(메모리가 켜져 있거나 모델 행이 표시될 때)을 사용하여 그래프 편집기와 선택적 **memory sharing**(다른 Workflow/에이전트)을 엽니다. 전체 동작, REST 경로 및 JSON 내보내기 세부 정보: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API and reasoning continuity

**Use Responses API** 체크박스는 에이전트의 모델 호출을 Chat Completions 대신 [Responses API](https://platform.openai.com/docs/api-reference/responses)를 통해 라우팅합니다. 기본적으로 꺼져 있습니다.

이는 `gpt-5` 또는 `o` 시리즈와 같은 reasoning 모델에서 가장 중요합니다. Responses API는 각 tool call과 함께 모델의 reasoning을 반환하고, 에이전트는 다음 턴에 해당 reasoning 항목을 다시 공급하므로, 모델은 매 tool 결과 후에 다시 도출하는 대신 다단계 tool 루프 전반에 걸쳐 사고 연쇄를 유지합니다. 전체 루프는 [human review](#human-review-hitl) 일시 중지 및 재개, [context compression](#context-compression) 및 최종 답변을 포함하여 동일한 경로에서 실행됩니다.

대화 자체는 Heym에 남아 있습니다. Heym은 매 턴마다 전체 입력을 전송하고 reasoning을 암호화된 blob으로 전달하므로, 호출 간에 제공자 측에 아무것도 보존되지 않습니다. context compression이 요약하는 범위 내의 reasoning 항목은 암호화된 blob을 요약할 수 없으므로 함께 삭제됩니다.

이는 OpenAI credential과, endpoint를 지원하는 gateway를 가진 사용자 정의 credential에서 작동합니다. Google credential에서는 비활성화된 상태로 유지됩니다.
## 컨텍스트 압축

에이전트가 대규모 결과(웹 스크래핑, 문서 읽기, 하위 Workflow 출력)와 함께 많은 도구 반복을 실행하면, 누적된 메시지 기록이 모델의 컨텍스트 윈도우 한계에 근접할 수 있습니다. Heym은 컨텍스트 오버플로를 방지하기 위해 실행 중간에 대화 기록을 자동으로 압축합니다.

**작동 방식:**

1. 각 도구 반복 전에 Heym은 현재 Token 수를 추정합니다(약 4자당 1 Token).
2. 추정치가 모델의 컨텍스트 윈도우 **80%** 를 초과하면 압축이 트리거됩니다.
3. 메시지 기록이 보존 구간과 압축 구간으로 분할됩니다:
   - **보존**: 시스템 Prompt, 첫 번째 사용자 메시지, 가장 최근 사용자 메시지
   - **압축**: 그 사이의 모든 내용(어시스턴트 추론 턴, 도구 호출, 도구 결과)
4. 중간 구간은 **동일한 모델과 Credential** 을 사용하여 요약됩니다 — 추가 구성이 필요하지 않습니다.
5. 압축된 요약이 중간 구간을 단일 어시스턴트 메시지로 대체합니다.

**관찰 가능성:**

압축 이벤트는 `Context compressed (N messages → summary)` 항목으로 다음 위치에 표시됩니다:
- 실시간 실행 중 **Debug 패널** 도구 호출 목록
- **Execution history** 실행 상세 보기
- **Traces 탭** 에 `context.compression` trace 항목으로 표시

압축은 자동으로 이루어지며 Agent 노드에서 항상 활성화됩니다. LLM 노드, Chat 탭, AI Assistant 세션에는 적용되지 **않습니다**.

## 관련 항목

- [Why Heym](../getting-started/why-heym.md) – 에이전트가 프로덕션에서 실행되고 관리되는 방식
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – 에이전트 노드별 지식 그래프, 선택적 공유, API, 에디터
- [Agent Architecture](../reference/agent-architecture.md) – 하위 에이전트, 오케스트레이터, 스킬, MCP, 도구 호출
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – 공개 검토 페이지, 대기 중인 실행, 승인/편집/거부 흐름
- [Guardrails](../reference/guardrails.md) – 안전하지 않은 콘텐츠 카테고리 차단
- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [AI Assistant](../reference/ai-assistant.md) – 자연어로 Workflow를 구축하기 위한 Chat UI(Agent 노드와 구별됨)
- [Expression DSL](../reference/expression-dsl.md) – Prompt에서 데이터 참조
- [Workflow Structure](../reference/workflow-structure.md) – 노드, 엣지, DSL 형식
- [Quick Start](../getting-started/quick-start.md) – LLM과 표현식을 사용한 기본 Workflow
- [Credentials Tab](../tabs/credentials-tab.md) – 에이전트용 API 키 추가
- [MCP Tab](../tabs/mcp-tab.md) – Workflow 도구용 MCP 구성
