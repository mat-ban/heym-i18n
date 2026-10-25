# Chat 탭

**Chat** 탭은 직접적인 LLM 채팅 인터페이스를 제공합니다. 이를 사용하여 모델을 테스트하거나, 질문을 하거나, 기존 Workflow를 실행하거나, 자연어 요청으로 새 Workflow를 생성할 수 있습니다.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Chat 데모 시청</a></p>

## 설정

1. [credential](./credentials-tab.md)을 선택합니다(OpenAI, Google 등의 API key).
2. 드롭다운에서 모델을 선택합니다(모델은 선택한 credential에서 로드됩니다).
3. 메시지를 입력하여 전송을 시작합니다.

[Workflows 탭](./workflows-tab.md)의 채팅 상자에서도 대화를 시작할 수 있습니다. 첫 메시지를 전송하고, 답변이 이미 스트리밍되는 상태로 이곳에서 새 대화가 열립니다.

## 기능

- **전역 변수 컨텍스트** – [전역 변수](../reference/global-variables.md)를 LLM이 사용할 수 있으므로, 저장된 값을 질문하거나 참조할 수 있습니다.
- **워크스페이스 템플릿 컨텍스트** – 워크스페이스에 공유된 Workflow 및 노드 템플릿이 컨텍스트로 포함되므로, Chat이 사용 가능한 템플릿에 대한 질문에 답변할 수 있습니다.
- **장시간 실행 에이전트** – 브라우저를 닫아도 Chat이 백엔드에서 계속 작동하므로, 다른 기기에서 돌아와 동일한 대화를 이어갈 수 있습니다.
- **Workflow 생성** – Chat에 Workflow 생성을 요청하면, 편집기 어시스턴트와 동일한 Workflow AI Builder 엔진을 사용하여 Workflow를 생성하고 저장합니다.
- **Kanban 작업 생성** – 자연스럽게 작업 추가 또는 카드 생성을 요청합니다. Chat은 요청한 보드의 첫 번째 열에 이를 추가합니다. 여러 보드가 있고 특정 보드를 지정하지 않은 경우, Chat은 카드를 생성하기 전에 보드 선택기를 표시합니다.
- **대기열에 추가된 후속 메시지** – 답변이 스트리밍되는 동안에도 메시지를 더 보낼 수 있습니다. 대기열에 추가된 메시지는 영구 저장되며, 시작되기 전에 편집하거나 삭제할 수 있고, 활성 응답 이후 순서대로 실행됩니다.
- **계획 일시 중지** – Chat이 계획 세부 정보를 필요로 할 때, 명확화 질문을 하고 답변할 때까지 대기열에 추가된 후속 메시지를 일시 중지합니다. 계획 답변이 완료되면 대기열에 추가된 메시지가 재개됩니다.
- **Credentials** – Chat이 생성하거나 편집하는 Workflow에 credential이 필요할 때, Chat은 사용할 credential을 묻거나, 대화 중에 새로 생성할 것을 제안하거나, 없이 계속 진행할 수 있게 합니다. 또한 Chat에 credential 생성을 요청하거나 소유한 credential 업데이트를 요청할 수 있으며, 대화 중에 credential 양식이 열립니다. 모델은 credential의 이름과 유형만 보며, 값은 절대 보지 않습니다. [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)를 참조하십시오.
- **데이터 테이블** – Chat이 생성하거나 편집하는 Workflow가 레코드를 저장할 때, Chat은 사용할 [데이터 테이블](./datatable-tab.md)을 묻거나 Workflow에 필요한 열을 포함하여 새로 생성할 것을 제안합니다. 또한 테이블과 해당 열을 나열할 수 있습니다. 행은 절대 읽거나 쓰지 않습니다. [AI Assistant › Data tables](../reference/ai-assistant.md#data-tables)를 참조하십시오.
- **스트리밍 응답** – 모델의 출력이 스트리밍되는 것을 확인합니다.
- **응답 중지** – 현재 스트리밍 중인 답변을 언제든지 중단합니다. 중지하면 해당 대화의 대기열에 추가된 메시지도 지워집니다.
- **Markdown 렌더링** – 응답은 인라인 이미지를 포함한 markdown 서식을 지원합니다.
- **이미지 표시** – 응답에 포함된 이미지(예: LLM 이미지 생성 결과)가 인라인으로 표시됩니다. 이미지를 클릭하면 전체 화면으로 볼 수 있습니다. 전체 화면 보기를 닫으려면 **Esc** 키 또는 뒤로 가기 버튼(모바일)을 누르십시오.
- **메시지 복사** – 모든 메시지를 클립보드에 복사합니다.
- **채팅 지우기** – 새 대화를 시작합니다.
- **음성 입력** – 마이크 버튼을 사용하여 음성을 텍스트로 변환합니다(브라우저 지원). 녹음이 중지되면 Heym이 전송 전에 텍스트를 가볍게 정리할 수 있습니다.
- **예약된 Workflow** – cron Workflow가 언제 실행되는지(오늘, 이번 주, 이번 달 또는 사용자 지정 날짜 범위) 질문합니다. 어시스턴트는 [Scheduled](./scheduled-tab.md) 탭과 동일한 일정 데이터를 사용하며, 소유한 Workflow로 결과를 제한하거나 공유받은 Workflow를 포함할 수 있습니다.
- **Workflow 실행 기록** – 하나의 Workflow에 대해 질문합니다("일일 보고서가 몇 번 실행되었나요?", "실패했나요?", "마지막으로 언제 실행되었나요?"). Chat은 ID로 Workflow를 조회하고 실행 횟수, 상태 분석, 첫 번째 및 마지막 실행 시간, 평균 소요 시간을 바탕으로 답변합니다. 실행이 실패한 이유나 반환된 내용을 질문하면, Chat은 해당 단일 실행을 열어 입력, 출력 및 노드별 오류를 읽습니다.
- **실시간 실행 상태** – 현재 실행 중인 항목을 질문하면, Chat은 개수, Workflow 이름, 각 실행이 얼마나 오래 진행되었는지, 어느 노드에 있는지, 그리고 실시간 실행으로 바로 이동하는 링크와 함께 답변합니다.

- **실행 컨텍스트 칩** – [Execution History](../reference/execution-history.md#ask-ai)의 **AI에게 질문**을 클릭하면 선택한 Workflow 실행이 칩으로 첨부된 새 대화가 열립니다. [실행에 대해 묻기](#sil-haeng-e-dae-hae-mud-gi)를 참조하세요

## MCP 클라이언트에서 Chat 사용하기

Chat 엔진은 브라우저 외부에서도 접근할 수 있습니다. [MCP 탭](./mcp-tab.md)에서 **Heym Chat Tool**을 활성화하면 MCP 클라이언트 — Claude, Cursor, 그리고 MCP를 지원하는 그 밖의 모든 도구 — 가 동일한 엔진을 모든 기능과 함께 실행하는 단일 `heym_chat` 도구를 사용할 수 있습니다.

이러한 대화는 이 탭의 기록에 저장되며, 대화 목록에서 플러그 아이콘으로 표시됩니다. 대화를 열면 클라이언트가 무엇을 요청했는지 확인하고, Trigger된 도구 카드를 살펴보고, 스레드를 직접 이어갈 수 있습니다. 명확화 질문에 답하는 방식은 이 탭에서 시작된 턴이든 MCP 클라이언트에서 시작된 턴이든 동일하게 작동합니다.

MCP를 통해서는 Chat이 자격 증명을 나열하거나 선택하거나 생성하지 않습니다. Chat이 빌드하는 Workflow는 자격 증명 필드를 비워 두며, 응답에서 자격 증명이 필요한 노드를 명시하므로 편집기에서 설정할 수 있습니다.

데이터 테이블도 MCP를 통해 작동합니다. Chat은 테이블을 나열하고, 새로 생성하고, 빌드하는 Workflow에 연결합니다. 테이블 관련 질문은 결과에 텍스트로 도착하므로, 동일한 `conversation_id`로 답하십시오.

## 컨텍스트 제한

Chat은 최근 메시지를 최대 25개까지 컨텍스트에 유지합니다. 오래된 메시지는 모델 제한 내에서 유지되도록 잘라냅니다.

## Workflow 생성하기

Chat에 Workflow를 생성, 빌드, 생성 또는 설정해 달라고 요청하면, 생성된 이름과 설명이 포함된 새 Workflow를 저장합니다. 응답에는 생성된 노드와 엣지의 읽기 전용 캔버스 미리보기와 새 브라우저 탭에서 Workflow 편집기를 여는 **Open workflow** 링크가 포함됩니다. Workflow를 실행하려면 미리보기 카드의 **Run** 버튼을 사용하십시오.

같은 Chat에서 이어지는 피드백은 새 Workflow를 생성하는 대신 해당 Workflow를 편집합니다. 예를 들어 Chat이 Workflow를 생성한 후 "승인 단계를 추가해 줘", "출력 형식을 변경해 줘" 또는 "şöyle yap"이라고 말하면 Chat이 저장된 Workflow를 업데이트하고 미리보기를 새로 고칩니다.

이는 일회성 답변이 아니라 재사용 가능한 자동화로 작업을 수행하고자 하는 요청에 가장 적합합니다.

## Kanban 작업 생성하기

"Fix login bug라는 작업을 추가해 줘" 또는 "Launch 보드에 Update documentation이라는 새 카드를 만들어 줘"와 같이 일상적인 언어로 Chat에 요청하십시오. 같은 요청에 설명을 포함할 수도 있습니다. Chat은 항상 선택된 보드의 첫 번째 열에 카드를 생성합니다.

워크스페이스에 여러 보드가 있고 특정 보드를 지정하지 않으면, Chat이 단일 선택 보드 선택기와 함께 일시 중지합니다. 보드를 선택하면 카드 생성이 완료됩니다. 슬래시 명령이나 특별한 메시지 형식은 필요하지 않습니다.

## 실행 중인 항목 묻기

"무엇이 실행 중이야?", "지금 몇 개의 Workflow가 활성 상태야?", "야간 보고서는 어느 노드에 있어?"와 같이 일상적인 언어로 질문하면 Chat이 실시간 현황을 보고합니다.

- **몇 개**의 실행이 진행 중인지, 실행 중과 사람 검토 대기로 구분하여 표시
- **어떤 Workflow**에 속하는지 이름으로 표시
- **얼마나 오래** 각 실행이 진행되었는지 (예: `1m 35s`, `3h 25m`)
- **어느 노드**가 현재 실행 중인지 캔버스 레이블로 표시하고, 마지막으로 완료된 노드도 함께 표시
- **각 실시간 실행에 대한 링크**로, 해당 실행이 재생되는 캔버스를 엽니다

[Human-in-the-Loop](../reference/human-in-the-loop.md) 또는 Codex 검토를 위해 일시 중지된 실행은 실행 중이 아니라 사용자의 응답을 기다리는 것으로 보고됩니다. 이는 헤더의 활성 실행 배지와 동일한 데이터이므로, Chat과 배지가 서로 다르게 표시되는 일은 없습니다. 이미 완료된 실행에 대해서는 대신 최근 실행을 요청하십시오. 이는 [Execution History](../reference/execution-history.md)를 읽습니다.

## 실행에 대해 묻기

에디터 또는 All History의 [Execution History](../reference/execution-history.md#ask-ai)에서 Workflow 실행을 선택하고 대화상자 제목 옆의 **AI에게 질문**을 클릭합니다. Chat은 메시지 상자 위에 두 개의 칩이 표시된 새 대화를 엽니다:

- **Workflow:** Workflow 이름
- **Execution:** 선택한 실행 ID의 첫 몇 글자

제외하려면 **×**를 클릭하여 칩을 삭제합니다. 그런 다음 “왜 이 실행에 이렇게 오랜 시간이 걸렸나요?”, “여기서 무엇이 실패했나요?” 또는 “이 문제를 해결할 수 있나요?”와 같은 질문을 입력합니다. 나머지 칩은 전체 ID와 함께 해당 메시지에 첨부되므로 Chat은 Workflow를 검색하는 대신 실행의 입력, 출력 및 노드별 추적을 직접 읽습니다. Workflow를 수정하기 위해 Chat은 [Workflow 생성](#workflow-saeng-seong)에 설명된 대로 변경 사항을 저장, 테스트 실행 및 확인합니다.

전송된 메시지에는 질문 아래에 칩이 표시됩니다. 칩은 해당 메시지에만 속하며, 동일한 대화 내의 후속 질문은 기록의 컨텍스트를 유지합니다.

## 알림에 대해 묻기

Chat은 정의한 [알림](./alerts-tab.md)에 관한 질문에 답할 수 있습니다.

- **무엇이 존재하는지** — "내 알림이 뭐가 있어?", "invoice workflow에 알림이 있어?", "지금 어떤 알림이 발동 중이야?"
- **어떻게 설정되었는지** — "비용 알림의 임계값이 얼마야?", "그건 어떻게 구성되어 있어?"
- **왜 그리고 언제 발동했는지** — "비용 알림이 왜 발동했어?", "이게 마지막으로 언제 Trigger됐어?"

"왜 발동했는지" 질문에 대해 Chat은 발동 기록을 읽고 실제 관측값, 임계값, 평가된 정확한 기간을 인용하며, 추가 세부 정보도 함께 제공합니다. 오류 알림의 경우 실패한 실행 ID와 오류 메시지, 비용 알림의 경우 모델별 지출, 실행 횟수 알림의 경우 Trigger 소스별 분석을 제공합니다. Chat은 알림이 발동했을 당시의 사실을 보고하며 기간을 다시 계산하지 않습니다. 기간이 이미 지났고 새로 계산하면 다른 결과가 나올 수 있기 때문입니다.

## User Rules

(설정에서 구성하는) [User Rules](../reference/user-settings.md)는 모든 Chat 대화에 시스템 수준 지침으로 자동 주입됩니다. 한 번 설정하면 모든 Chat 요청에 지속적인 기본 설정이 적용됩니다.

## 관련 문서

- [MCP Tab](./mcp-tab.md) – 이 엔진을 `heym_chat` 도구로 MCP 클라이언트에 노출합니다
- [Settings](../reference/user-settings.md) – 모든 채팅 요청에 적용되는 User Rules를 설정합니다
- [Credentials Tab](./credentials-tab.md) – API 키를 추가하고 관리합니다
- [Variables Tab](./global-variables-tab.md) – Chat에서 사용할 수 있는 전역 변수입니다
- [Node Types](../reference/node-types.md) – Workflow용 LLM 및 Agent 노드입니다
- [Agent Node](../nodes/agent-node.md) – 도구 호출 기능이 있는 AI Agent입니다
- [AI Assistant](../reference/ai-assistant.md) – 동일한 workflow builder DSL을 기반으로 하는 편집기 어시스턴트입니다
- [Execution History](../reference/execution-history.md) – 과거 실행 기록을 확인합니다 (헤더의 History 버튼)
- [Scheduled Tab](./scheduled-tab.md) – 예정된 Cron 실행 캘린더입니다 (Chat이 요약할 수 있는 동일한 데이터)
- [Alerts Tab](./alerts-tab.md) – Chat이 나열하고 설명할 수 있는 임계값 알림입니다
- [Contextual Showcase](../reference/contextual-showcase.md) – 이 페이지에 대한 간결한 인앱 안내입니다
- [Chat Voice (TTS & STT)](../reference/chat-voice.md) – 메시지를 소리 내어 읽고 ElevenLabs로 핸즈프리 대화를 진행합니다

## 도구 호출 및 컨텍스트 크기

어시스턴트가 도구를 호출할 때마다(Workflow 실행, 실행 목록 조회, 새 Workflow 생성) 대화에 접을 수 있는 카드가 나타납니다. 카드는 도구가 실행되는 동안 자동으로 펼쳐져 정확한 인수를 표시합니다. 도구가 완료되면 카드는 경과 시간과 함께 한 줄 요약으로 접힙니다. 아무 카드나 클릭하면 인수와 응답 요약을 다시 펼칠 수 있습니다.

입력란 아래의 작은 링 배지는 모델 윈도우 대비 현재 컨텍스트 사용량을 백분율로 표시합니다(예: `12% · ~9.2k`). 배지에 마우스를 올리면 시스템 Prompt, AGENTS.md, workflows 블록, 사용자 규칙, 기록, 작성 중인 입력의 내역을 확인할 수 있습니다. 사용량이 80%를 넘으면 링이 호박색으로, 95%가 되면 빨간색으로 바뀝니다.

사용량이 한계에 가까워지면 Heym은 Agent 노드가 사용하는 것과 동일한 메커니즘으로 이전 메시지를 짧은 요약으로 자동 압축합니다. "Context compressed" 카드가 인라인으로 나타나 어떤 일이 발생했는지 보여줍니다.
