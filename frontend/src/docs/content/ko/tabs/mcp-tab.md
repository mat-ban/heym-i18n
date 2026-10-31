# MCP / A2A 탭

**MCP** 탭은 Model Context Protocol(MCP) 연동을 구성합니다, 다른 에이전트가 작업을 위임할 수 있는 [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) 서버로 노출할 수 있습니다. MCP를 사용하면 AI 클라이언트(Claude, ChatGPT, Gemini, Cursor 및 모든 MCP 호환 도구)가 귀하의 Heym Workflow를 도구로 호출할 수 있습니다.

Heym은 두 가지 모드를 지원합니다. 모든 MCP 활성화 Workflow를 단일 Endpoint 아래에 노출하는 **기본 서버**와, 각 논리적 Workflow 그룹에 전용 URL 및 API Key를 부여하는 **명명된 서버**입니다.

두 모드 모두 두 종류의 도구를 노출할 수 있습니다. 개별 **Workflow**와, 전체 [Chat 탭](./chat-tab.md) 엔진을 하나의 `heym_chat` 도구 뒤에 배치하는 **Heym chat 도구**입니다.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCP 데모 시청</a></p>

## 기본 MCP 서버

기본 서버는 항상 `{origin}/api/mcp/sse`에서 사용할 수 있습니다. MCP가 켜진 모든 Workflow가 여기에 도구로 나타납니다.

### MCP API Key

- Key는 SHA-256 다이제스트로 저장되므로, Heym은 기존 Key를 표시할 수 없습니다. 이 탭은 Key가 설정되어 있는지 여부만 보고하며, 그 값은 알려주지 않습니다.
- **Generate** / **Regenerate** – 새 Key는 생성 직후 한 번만 표시됩니다. 그때 복사하십시오. 탭을 새로 고치면 영구적으로 숨겨집니다.
- Claude Desktop, Cursor 또는 기타 MCP 클라이언트를 Heym에 연결할 때 이 Key를 사용하십시오.
- Key를 분실하셨습니까? 재생성하십시오. 이전 Key는 즉시 작동을 중단합니다.

### 연결 방법

- **API Key** – 프로그래밍 방식 연결에는 MCP API Key를 사용하십시오. 이 탭은 바로 사용 가능한 JSON config를 복사할 수 있으며, 원클릭 Cursor 설정을 위한 **Add to Cursor** 버튼도 포함합니다.
- **Claude** – 이 탭은 MCP 서버 URL과 Claude용 설정 단계를 표시합니다. OAuth Client ID와 Secret은 비워 두십시오. Claude가 자동으로 등록하고 Heym OAuth를 통해 인증합니다.
- **ChatGPT** – 탭에 ChatGPT 앱용 MCP 서버 URL과 설정 단계가 표시됩니다. 개발자 모드(Developer mode)를 켜고 해당 URL로 앱을 만든 뒤 OAuth를 선택하면 ChatGPT가 자동으로 등록됩니다.
- **Gemini** – 탭에 Gemini 커스텀 앱용 MCP 서버 URL과 설정 단계가 표시됩니다. gemini.google.com에서 **Settings → Connected Apps → Add a custom app**으로 이동한 다음 URL을 붙여넣고 **Advanced features**는 닫아 두면, Gemini가 자동으로 등록되고 Heym OAuth를 통해 인증됩니다. 한 번 연결하면 Gemini 모바일 앱에서도 Heym가 작동합니다.

### Workflow MCP 토글

각 Workflow는 MCP 도구로 노출될 수 있습니다.

- **Enable** – 해당 Workflow의 도구가 기본 서버에 연결된 모든 클라이언트에서 사용 가능해집니다.
- **Disable** – 해당 Workflow는 노출되지 않습니다.

Workflow 카드는 설명과 입력 필드 이름의 미리보기를 표시하므로, 활성화하기 전에 각 도구가 무엇을 기대하는지 확인할 수 있습니다.


### 대기 중인 실행 및 heym_execution_status

[동시성 제한](../reference/webhooks.md#concurrency-limit-and-queued-runs)이 있는 Workflow는 클라이언트가 호출할 때 사용 중일 수 있습니다. 이 경우 호출은 오류가 아닌 결과로 즉시 반환됩니다:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

클라이언트는 해당 `execution_id`를 사용하여 `heym_execution_status` 도구를 폴링합니다. [상태 URL](../reference/webhooks.md#status-url)과 동일한 본문을 반환합니다: 현재 대기 순위가 포함된 `queued`, `running`, 그리고 출력이 포함된 `success` 또는 `error`. 동일한 서버가 노출하는 Workflow의 실행만 찾습니다. 이 도구는 기본 서버 및 각 명명된 서버에서 하나 이상의 Workflow에 동시성 제한이 설정되어 있는 동안에만 목록에 표시됩니다. 대기열이 가득 찬 경우 호출은 "Concurrency queue is full" 오류를 반환합니다.
## Heym Agent

**Heym Capabilities** 섹션은 Chat 탭 엔진을 `heym_chat`이라는 단일 MCP 도구로 전환합니다. 기본 서버, 임의의 명명된 서버 또는 둘 모두에서 활성화할 수 있으며, 각 표면은 자체 토글과 모델 선택을 유지합니다.

활성화되면 `heym_chat`이 Workflow 도구들과 함께 `tools/list`에 나타납니다. MCP 클라이언트가 자연어 메시지 하나를 보내면 Heym 엔진이 이를 처리하며, Chat 탭과 동일한 기능을 갖습니다.

- Workflow를 구축하고, 샘플 입력으로 테스트 실행하고, 수정하여 실행이 통과하면 완료하기([빌드 모드](#build-mode) 참조)
- 기존 Workflow 검사 및 실행
- 분석, 최근 실행 및 예정된 cron 스케줄을 보고합니다.
- 워크플로가 어디서 실패하고 왜 느린지 설명: 가장 많이 실행되고 가장 많이 실패하며 가장 느린 워크플로와 지난 1, 3, 6시간, 24시간, 7일 또는 30일, 혹은 전체 기간 동안 가장 많은 시간, 오류 및 호출을 기록한 노드 유형
- 하나의 Workflow 실행 이력을 보고합니다. 실행 횟수, 상태별 집계, 실행 시점, 그리고 요청 시 단일 실행의 입력, 출력 및 노드별 오류를 보고합니다.
- 현재 실행 중인 항목을 보고합니다. 활성 실행 수, 해당 Workflow 이름, 각 실행의 경과 시간, 현재 위치한 노드, 그리고 라이브 실행 링크를 보고합니다.
- [Board 탭](./board-tab.md)에서 보드를 나열하고, 카드를 생성하며, 카드 상세를 읽습니다.
- 대시보드(Heym Work의 페이지)와 해당 위젯 나열, 워크플로가 있는 대시보드 찾기, 새 위젯 추가 및 워크플로 구축, 기존 워크플로를 위젯으로 배치, 위젯 이름 변경 또는 삭제, 레이아웃 정리([Dashboard › Chat 및 MCP에서](./dashboard-tab.md#from-chat-and-mcp) 참조)
- 데이터 테이블 및 행 검사, 테이블 생성, 열 추가 또는 제거, 행 삽입, 업데이트 또는 삭제, 워크플로에 테이블 연결
- 프롬프트 및 에이전트 평가 스위트([Eval suites](./evals-tab.md#from-chat-and-mcp)) 생성, 편집 및 실행(보고되거나 실행에서 빌드되거나 숫자로 지정된 에이전트 기준선 포함). 결과에는 저장된 모든 스위트의 Evals 링크가 나열됩니다.
- Heym 자체 페이지에서 credential 생성 또는 업데이트([Credentials](#credentials) 참조)
- 팀과 전역 변수를 읽고, 문서를 검색합니다.
- 대기 중인 human-in-the-loop 검토를 승인, 편집 또는 거부합니다.

나중에 Chat 탭에 추가되는 기능은 `heym_chat`을 통해 자동으로 사용 가능해집니다. 동기화를 유지해야 할 기능별 토글은 없습니다.

이러한 기능은 `heym_chat` 내부에서 실행됩니다. `tools/list`에는 `heym_chat`과 워크플로 도구만 표시되며 평가 스위트 도구와 같은 채팅 내부 도구는 표시되지 않습니다.

### 빌드 모드

`heym_chat`은 항상 Chat 엔진을 빌드 모드(build mode)로 실행합니다. 한 번의 호출로 어시스턴트는 새 Workflow를 저장하고, 현실적인 샘플 입력으로 실행하고, 실행 보고서를 읽고, 실패한 부분을 수정한 뒤 다시 실행하는 과정을 호출당 최대 다섯 번의 테스트 실행까지 수행할 수 있습니다. 최신 저장본의 가장 최근 실행이 통과하면 한 문장의 요약으로 마무리하며, 응답은 `Verified: the latest test run of the saved workflow passed.`로 끝납니다.

호출을 통해 Workflow를 생성하거나 편집하면 응답에 `https://heym.example.com/workflows/<id>`와 같은 전체 편집기 링크가 나열되며, 어시스턴트 답변 내부의 링크도 전체 링크입니다. 구성된 Heym 주소(`FRONTEND_URL`)를 사용하며 Heym에 로그인되어 해당 Workflow에 액세스할 수 있는 사용자에게 열립니다.

- 테스트 실행은 실제 실행입니다. 부수 효과(side effects)가 실제로 발생하며, 다른 실행과 마찬가지로 Workflow의 실행 기록에 표시됩니다.
- 저장은 에디터 경로를 따릅니다. 그래프를 변경하면 이전 그래프가 Workflow의 **Edit History**에 유지됩니다.
- 이전에 만든 Workflow를 변경하려면 동일한 `conversation_id`로 스레드를 이어가세요. 어시스턴트는 새 Workflow를 만드는 대신 해당 Workflow를 업데이트하며, 사용자가 편집할 수 있는 Workflow만 변경합니다.
- 다섯 번의 테스트 실행을 모두 소진하면 어시스턴트는 멈추고 무엇이 여전히 실패하는지 설명합니다.

`heym_chat`은 테이블과 행을 검사하고, 테이블을 생성하며, 열을 추가하거나 제거하고, 행을 삽입, 업데이트 또는 삭제할 수 있습니다. 테이블 이름, UUID 또는 DataTable 링크를 제공하십시오(예: „https://heym.example/?tab=datatable/<table-id> 에 이름과 성 두 개의 문자열 열 추가”). 테이블을 직접 수정하며 열을 추가할 때 기존 열과 값을 보존합니다.

`heym_chat`은 테이블과 행을 검사하고, 테이블을 생성하며, 열을 추가하거나 제거하고, 행을 삽입, 업데이트 또는 삭제할 수 있습니다. 테이블 이름, UUID 또는 DataTable 링크를 제공하십시오(예: „https://heym.example/?tab=datatable/<table-id> 에 이름과 성 두 개의 문자열 열 추가”). 테이블을 직접 수정하며 열을 추가할 때 기존 열과 값을 보존합니다.

쓰기 작업에는 직접 또는 팀 공유를 통한 소유권이나 **쓰기** 권한이 필요합니다. 읽기 전용 액세스는 검사만 허용합니다. 행 쓰기에는 DataTable 탭의 유형, 기본값, 필수 및 고유성 검사가 적용되며 부분 가져오기는 거부된 행을 보고합니다. 열을 제거하면 모든 행에서 해당 값이 지워집니다. DataTable 탭에서와 마찬가지로 열 제거 및 모든 행 지우기는 먼저 확인을 요청합니다. 확인하려면 동일한 `conversation_id`로 응답하십시오. 선택한 행을 삭제할 때는 추가 확인이 필요하지 않습니다.


### Credentials

`heym_chat`은 Chat 탭과 동일하게 이름과 유형별로 사용자가 소유한 credential과 공유된 credential을 확인합니다. 구축하는 Workflow에 credential이 필요한 경우 결과에서 어떤 것을 사용할지 질문합니다. 동일한 `conversation_id`로 응답하십시오.

credential을 추가하거나 소유한 credential을 업데이트하려면 어시스턴트가 Heym 페이지(`/credentials/setup/<id>`)에서 Heym의 credential 양식을 엽니다. 거기서 Heym에 로그인하고 키를 입력하거나 계정을 연결한 후 저장을 누릅니다. 값은 Heym으로 직접 전달됩니다. MCP 클라이언트와 해당 모델은 credential의 이름과 유형만 알게 됩니다. MCP 클라이언트에 키를 붙여넣지 마십시오. 대신 양식을 요청하십시오.

| 클라이언트 | 동작 |
|------------|------|
| MCP URL 도출 지원 | 클라이언트가 Heym 페이지를 열도록 요청합니다. 양식을 작성하는 동안 최대 10분 동안 대기한 다음 새 credential로 계속 진행합니다. |
| 기타 모든 클라이언트 | 결과에 링크가 포함되며 `wait_for_credential_form`을 사용하여 `heym_chat`을 다시 호출하도록 요청합니다. 해당 호출은 양식을 작성하는 동안 최대 5분 동안 대기한 후 대화를 재개합니다. 클라이언트가 기다리지 않는 경우 양식을 저장하고 동일한 `conversation_id`로 회신하십시오. 다음 호출에서 양식이 저장되었는지와 생성된 credential을 인식합니다. |

페이지는 요청을 시작한 Heym 계정에 대해서만 열리므로 전달된 링크는 다른 사람에게 유용하지 않습니다. 양식은 24시간 동안 열려 있으며 페이지에서 거부할 수 있습니다. 저장하거나 거부하면 Chat 탭 대화의 단계에 결과가 표시됩니다.


### Credential 및 모델

`heym_chat`은 귀하의 Heym 계정에서 엔진을 실행하므로, 자체적인 LLM Credential이 필요합니다.

| 필드 | 동작 |
|-------|----------|
| **Credential** | 접근 가능한 OpenAI, Google 또는 Custom Credential을 선택하십시오. 아직 선택하지 않은 경우 [Settings](../reference/user-settings.md)의 선호 Credential에서 미리 채워집니다. |
| **Model** | 선택한 Credential에서 로드됩니다. Credential이 일치하면 선호 모델에서 미리 채워집니다. |

둘 중 하나라도 누락되면 도구는 여전히 `tools/list`에 나타나지만, 각 호출은 이 탭에서 설정을 완료하라는 오류를 반환합니다.


`heym_chat`이 구축하는 Workflow의 LLM 및 Agent 노드는 공유 credential을 포함하여 이 credential과 모델에서 실행되므로 추가 설정 단계 없이 테스트 실행이 작동합니다. `heym_chat`이 Workflow를 편집할 때 이미 credential이 있는 LLM 및 Agent 노드는 해당 모델과 함께 이를 유지합니다.
### 인수 및 이력

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `message` | 예 | 자연어로 된 지시 또는 질문입니다. |
| `conversation_id` | 아니오 | 이전 `heym_chat` 결과의 `conversation_id`로, 해당 스레드를 이어갑니다. |
| `wait_for_credential_form` | 아니요 | `conversation_id` 사용 시: 스레드가 연 credential 양식을 사용자가 저장하거나 거부할 때까지 대기한 후 `message`를 전송합니다. |

모든 호출은 일반 대화로 [Chat 탭](./chat-tab.md) 이력에 기록되며, 대화 목록에서 플러그 아이콘으로 표시됩니다. 메시지, 도구 카드 및 명확화 일시 중지는 직접 시작한 대화와 똑같이 보이며, 브라우저에서 스레드를 열고 계속 대화할 수 있습니다. 각 결과는 `conversation_id`를 반환하므로 MCP 클라이언트는 매 호출마다 새 스레드를 여는 대신 동일한 스레드를 이어갈 수 있습니다.

어시스턴트가 명확화를 필요로 하면 일시 중지하고 그렇게 알립니다. 동일한 `conversation_id`를 사용하여 답변을 회신하십시오.

### A2A 활성화

Heym Agent가 켜져 있는 동안 카드에 **A2A 활성화** 확인란이 표시됩니다. 이를 선택하면 다른 에이전트가 Agent2Agent 프로토콜(A2A 1.0)을 통해 Heym Agent에 작업을 보낼 수 있습니다. 그런 다음 카드에는 각각 복사 버튼이 있는 **Agent Card** URL과 **JSON-RPC endpoint**, 그리고 카드를 가져오는 `curl` 명령이 나열됩니다. A2A는 MCP와 동일한 키 및 OAuth 로그인을 사용합니다. 에이전트를 끄면 A2A도 꺼집니다. 메서드, 작업 상태 및 예제는 [A2A](../reference/a2a.md)를 참조하십시오.

### 진행 상황

오래 걸리는 `heym_chat` 호출은 Chat 탭에 표시되는 문구(예: `워크플로 테스트 중 · 시도 2/5`)로 에이전트의 작업을 MCP 진행 상황(`notifications/progress`)으로 보고합니다. 진행 상황 수신 시 시간 초과를 재설정하는 클라이언트는 에이전트가 작업하는 동안 계속 대기합니다.

## 명명된 MCP 서버

명명된 서버를 사용하면 Workflow를 격리된 MCP Endpoint로 분할할 수 있습니다. 각 서버는 자체 URL과 API Key를 가지므로, 서로 다른 AI 클라이언트, 팀 또는 사용 사례가 필요한 Workflow에 정확히 연결할 수 있습니다.

### 명명된 서버 생성하기

1. MCP 탭 하단의 입력 필드에 이름을 입력합니다(예: **CRM Tools**)
2. **Create**를 클릭합니다 — 새 서버 카드가 즉시 나타납니다
3. 카드를 클릭하여 펼칩니다

### 서버별 설정

각 서버 카드에는 다음이 표시됩니다:

| 설정 | 설명 |
|---------|-------------|
| **SSE Endpoint** | 고유 URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | 독립적인 Key로, 생성 또는 재생성 시 한 번만 표시됩니다. 즉시 복사하십시오. 해시되어 저장되므로 나중에 다시 확인할 수 없습니다 |
| **How to connect** | **Copy JSON**은 바로 붙여넣을 수 있는 MCP config를 복사합니다. **Add to Cursor**는 한 번의 클릭으로 설치합니다 |
| **Heym Capabilities** | 이 서버에 대해 Heym Agent (`heym_chat`)를 켜거나 끄고 credential과 모델을 선택합니다 |
| **A2A 활성화** | `{origin}/api/a2a/servers/{uuid}/agent-card.json`에 자체 Agent Card를 보유한 이 서버 전용 A2A 스위치 |
| **A2A 활성화** | `{origin}/api/a2a/servers/{uuid}/agent-card.json`에 자체 Agent Card를 보유한 이 서버 전용 A2A 스위치 |
| **Assigned Workflows** | 이 서버가 노출할 Workflow를 토글합니다 |

### Workflow 할당

Workflow 할당은 서버별로 이루어지며 기본 서버 토글과 독립적입니다. 하나의 Workflow는 기본 서버와 여러 명명된 서버에서 동시에 활성화되거나, 어디에서도 활성화되지 않을 수 있습니다.

Workflow를 토글하면 할당 목록의 맨 위로 이동하므로, 방금 변경한 행이 스크롤되어 사라지지 않고 계속 표시됩니다.

### 인증

명명된 서버는 기본 서버와 동일한 인증 방법을 지원합니다:

- **X-MCP-Key header** – 서버의 API Key를 직접 전달합니다(API 클라이언트, Cursor). Header 전용입니다. URL은 액세스 로그, 프록시 로그 및 브라우저 기록에 남기 때문에 Key는 `?key=` 쿼리 파라미터로 허용되지 않습니다.
- **Claude, ChatGPT 및 Gemini OAuth** – 서버 URL을 클라이언트의 커넥터 또는 커스텀 앱에 추가합니다. credential을 비워 두면 클라이언트가 OAuth를 통해 자동으로 등록합니다. bearer Token은 `?token=`이 아닌 `Authorization` header로 전달되어야 합니다.
- **Session token** – SSE handshake 중에 발급되며 특정 서버로 범위가 지정되므로, 한 명명된 서버의 Token으로 다른 서버에 액세스할 수 없습니다. 수명이 짧은 `?session=` 파라미터는 영향을 받지 않습니다.

### 명명된 서버 삭제하기

서버 카드 헤더의 **X** 아이콘을 클릭합니다. 삭제하면 서버와 모든 Workflow 할당이 제거됩니다. Workflow 자체는 영향을 받지 않습니다.

## SSE Endpoint

| 서버 | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

두 Endpoint 모두 SSE transport(GET, MCP spec 2024-11-05)와 Streamable HTTP transport(POST, MCP spec 2025-03-26)를 지원합니다. Claude, ChatGPT 및 Gemini는 두 경우 모두 보안 로그인을 위해 OAuth 2.1 / PKCE를 사용합니다.

## 관련 항목

- [Why Heym](../getting-started/why-heym.md) – Heym의 일급 primitive로서의 MCP
- [Agent Node](../nodes/agent-node.md) – MCP 도구 지원이 있는 Agent 노드
- [Agent Architecture](../reference/agent-architecture.md) – MCP 클라이언트, 도구 디스패치, 오케스트레이터
- [Triggers](../reference/triggers.md) – Workflow 진입점으로서의 MCP
- [Chat Tab](./chat-tab.md) – `heym_chat` 도구의 엔진
- [Workflows Tab](./workflows-tab.md) – Workflow 생성 및 관리
- [Node Types](../reference/node-types.md) – AI 노드 개요
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 화면을 위한 간결한 페이지 가이드