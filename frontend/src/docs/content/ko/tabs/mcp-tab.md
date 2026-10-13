# MCP 탭

**MCP** 탭은 Model Context Protocol(MCP) 연동을 구성합니다. MCP를 사용하면 AI 클라이언트(Claude, ChatGPT, Gemini, Cursor 및 모든 MCP 호환 도구)가 귀하의 Heym Workflow를 도구로 호출할 수 있습니다.

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

## Heym Chat 도구

**Heym Capabilities** 섹션은 Chat 탭 엔진을 `heym_chat`이라는 단일 MCP 도구로 전환합니다. 기본 서버, 임의의 명명된 서버 또는 둘 모두에서 활성화할 수 있으며, 각 표면은 자체 토글과 모델 선택을 유지합니다.

활성화되면 `heym_chat`이 Workflow 도구들과 함께 `tools/list`에 나타납니다. MCP 클라이언트가 자연어 메시지 하나를 보내면 Heym 엔진이 이를 처리하며, Chat 탭과 동일한 기능을 갖습니다.

- Workflow를 구축하고, 샘플 입력으로 테스트 실행하고, 수정하여 실행이 통과하면 완료하기([빌드 모드](#build-mode) 참조)
- 기존 Workflow 검사 및 실행
- 분석, 최근 실행 및 예정된 cron 스케줄을 보고합니다.
- 하나의 Workflow 실행 이력을 보고합니다. 실행 횟수, 상태별 집계, 실행 시점, 그리고 요청 시 단일 실행의 입력, 출력 및 노드별 오류를 보고합니다.
- 현재 실행 중인 항목을 보고합니다. 활성 실행 수, 해당 Workflow 이름, 각 실행의 경과 시간, 현재 위치한 노드, 그리고 라이브 실행 링크를 보고합니다.
- [Board 탭](./board-tab.md)에서 보드를 나열하고, 카드를 생성하며, 카드 상세를 읽습니다.
- 데이터 테이블을 열과 함께 나열하고, 새로 생성하며, 자신이 구축하는 Workflow에 연결합니다.
- 팀과 전역 변수를 읽고, 문서를 검색합니다.
- 대기 중인 human-in-the-loop 검토를 승인, 편집 또는 거부합니다.

나중에 Chat 탭에 추가되는 기능은 `heym_chat`을 통해 자동으로 사용 가능해집니다. 동기화를 유지해야 할 기능별 토글은 없습니다.

### 빌드 모드

`heym_chat`은 항상 Chat 엔진을 빌드 모드(build mode)로 실행합니다. 한 번의 호출로 어시스턴트는 새 Workflow를 저장하고, 현실적인 샘플 입력으로 실행하고, 실행 보고서를 읽고, 실패한 부분을 수정한 뒤 다시 실행하는 과정을 호출당 최대 다섯 번의 테스트 실행까지 수행할 수 있습니다. 최신 저장본의 가장 최근 실행이 통과하면 한 문장의 요약으로 마무리하며, 응답은 `Verified: the latest test run of the saved workflow passed.`로 끝납니다.

- 테스트 실행은 실제 실행입니다. 부수 효과(side effects)가 실제로 발생하며, 다른 실행과 마찬가지로 Workflow의 실행 기록에 표시됩니다.
- 저장은 에디터 경로를 따릅니다. 그래프를 변경하면 이전 그래프가 Workflow의 **Edit History**에 유지됩니다.
- 이전에 만든 Workflow를 변경하려면 동일한 `conversation_id`로 스레드를 이어가세요. 어시스턴트는 새 Workflow를 만드는 대신 해당 Workflow를 업데이트하며, 사용자가 편집할 수 있는 Workflow만 변경합니다.
- 다섯 번의 테스트 실행을 모두 소진하면 어시스턴트는 멈추고 무엇이 여전히 실패하는지 설명합니다.

Credential은 UI에 남아 있습니다. `heym_chat`은 Credential을 나열, 선택 또는 생성하지 않습니다. Workflow를 구축하거나 편집할 때 Credential이 필요한 새 노드는 비워 두며, 응답에서 해당 노드의 이름을 알려주므로 편집기에서 설정할 수 있습니다.

데이터 테이블은 다릅니다. 테이블에는 비밀이 담기지 않으므로, `heym_chat`은 테이블을 나열하고, Workflow가 어느 테이블을 사용해야 하는지 묻고, 열과 함께 새 테이블을 생성할 수 있습니다. 행을 읽거나 쓰지는 않습니다.

### Credential 및 모델

`heym_chat`은 귀하의 Heym 계정에서 엔진을 실행하므로, 자체적인 LLM Credential이 필요합니다.

| 필드 | 동작 |
|-------|----------|
| **Credential** | 접근 가능한 OpenAI, Google 또는 Custom Credential을 선택하십시오. 아직 선택하지 않은 경우 [Settings](../reference/user-settings.md)의 선호 Credential에서 미리 채워집니다. |
| **Model** | 선택한 Credential에서 로드됩니다. Credential이 일치하면 선호 모델에서 미리 채워집니다. |

둘 중 하나라도 누락되면 도구는 여전히 `tools/list`에 나타나지만, 각 호출은 이 탭에서 설정을 완료하라는 오류를 반환합니다.

### 인수 및 이력

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `message` | 예 | 자연어로 된 지시 또는 질문입니다. |
| `conversation_id` | 아니오 | 이전 `heym_chat` 결과의 `conversation_id`로, 해당 스레드를 이어갑니다. |

모든 호출은 일반 대화로 [Chat 탭](./chat-tab.md) 이력에 기록되며, 대화 목록에서 플러그 아이콘으로 표시됩니다. 메시지, 도구 카드 및 명확화 일시 중지는 직접 시작한 대화와 똑같이 보이며, 브라우저에서 스레드를 열고 계속 대화할 수 있습니다. 각 결과는 `conversation_id`를 반환하므로 MCP 클라이언트는 매 호출마다 새 스레드를 여는 대신 동일한 스레드를 이어갈 수 있습니다.

어시스턴트가 명확화를 필요로 하면 일시 중지하고 그렇게 알립니다. 동일한 `conversation_id`를 사용하여 답변을 회신하십시오.

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
| **Heym Capabilities** | 이 서버의 `heym_chat` 도구를 토글하고 credential과 model을 선택합니다 |
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
