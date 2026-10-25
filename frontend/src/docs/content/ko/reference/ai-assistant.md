# AI 어시스턴트

**AI Assistant**는 Debug 패널에서 열리는 채팅 패널로, 에디터의 오른쪽 하단에서 시작합니다. 헤더를 드래그하여 이동하고, 가장자리나 모서리를 드래그하여 너비나 높이를 변경할 수 있습니다. 360×480 픽셀 이하로 축소되지는 않습니다. 위치와 크기는 이 브라우저에 저장됩니다. 헤더의 **Reset position and size**를 클릭하면 패널이 오른쪽 하단으로 돌아갑니다. 자연어를 사용하여 Workflow를 생성하거나 수정할 수 있습니다. 원하는 내용을 설명하면 AI가 노드와 엣지를 생성하여 캔버스에 적용합니다.

에디터 외부의 문서 관련 질문에는 [Chat with Heym](./chat-with-heym.md)을 사용하십시오. 해당 인터페이스는 Workflow 생성 대신 페이지 인식 제품 도움말에 최적화되어 있습니다.

## 패널 열기

1. 에디터에서 Workflow를 엽니다
2. 하단의 **Debug 패널**(실행 결과 영역)을 찾습니다
3. 패널 도구 모음에서 **AI** 버튼(Sparkles 아이콘)을 클릭합니다
4. AI Assistant 패널이 오른쪽 하단에서 열립니다. 헤더를 드래그하여 이동하거나, 가장자리나 모서리를 드래그하여 너비와 높이를 변경하십시오.

에디터 어디에서든 `Ctrl + I` / `Cmd + I`를 눌러 패널을 열거나 닫을 수 있습니다. 이 단축키는 텍스트 입력란이 포커스된 상태에서도 작동합니다. [Keyboard Shortcuts](./keyboard-shortcuts.md)를 참조하십시오.

단일 노드에서 작업하려면 캔버스에서 노드 위로 마우스를 가져간 다음 노드 위의 **AI**를 클릭합니다. 패널이 해당 노드에 초점을 맞춰 열립니다. [단일 노드 변경](#changing-one-node)을 참조하세요.

## 패널 닫기

**X** 버튼을 클릭하거나, `Ctrl + I` / `Cmd + I`를 누르거나, Debug 패널 도구 모음의 **AI** 버튼을 토글합니다. 헤더는 패널을 드래그하는 용도이며, 닫지는 않습니다.

## 구성

메시지를 보내기 전에 다음을 선택하십시오:

| 설정 | 설명 |
|---------|-------------|
| **Credential** | [Credentials](../tabs/credentials-tab.md)의 LLM credential(API key) |
| **Model** | 모델 이름(예: `gpt-4o`, `gemini-2.5-flash`) |

[Credentials Tab](../tabs/credentials-tab.md)에서 credential을 추가하십시오. 모델 목록은 선택한 credential에서 로드됩니다.

## Agent Mode vs Ask Mode

패널에는 두 가지 모드가 있으며, 패널 헤더의 **Agent / Ask** 칩으로 전환합니다.

| 모드 | 기본값 | 동작 |
|------|---------|-----------|
| **Agent** | ✓ | 캔버스를 구축하고 수정합니다. AI가 Workflow JSON 블록을 생성하며, 응답이 완료되면 자동으로 캔버스에 적용됩니다. |
| **Ask** | | 질문에만 답변합니다. 캔버스는 절대 변경되지 않습니다. Workflow, Heym 기능에 대해 질문하거나 캔버스 업데이트를 트리거하지 않고 조언을 구할 때 사용하십시오. |

언제든지 모드를 전환할 수 있습니다. 모드를 변경해도 대화 내용은 지워지지 않습니다.

Agent 모드에서 메시지 필드 아래의 **YOLO mode** 상자를 선택하면 어시스턴트가 자신이 구축한 것을 실행하고 수정합니다. [YOLO Mode](#yolo-mode)를 참조하십시오.

## 채팅 사용

- 입력란에 요청을 입력합니다(예: "Create a workflow that takes user input and sends it to an LLM")
- **Enter**를 눌러 전송합니다(줄바꿈은 Shift+Enter)
- AI가 응답을 스트리밍합니다. **Agent** 모드에서 응답에 \`\`\`json 코드 블록의 Workflow가 포함되어 있으면 자동으로 파싱되어 캔버스에 적용됩니다. **Ask** 모드에서는 캔버스가 절대 수정되지 않습니다.
- **Clear**를 사용하여 대화를 초기화합니다
- 메시지에 마우스를 올리고 복사 아이콘을 클릭하면 표시된 텍스트(Workflow JSON 포함)를 복사할 수 있습니다
- 메시지 상자 위의 선을 드래그하면 상자가 더 커집니다. 입력 영역은 패널의 60%까지 커질 수 있으며, 페이지를 새로고침하면 기본 높이로 돌아갑니다

## Workflow 자동 적용

AI 응답에 유효한 Workflow JSON 블록(`nodes`와 선택적으로 `edges` 포함)이 \`\`\`json 코드 블록 안에 포함되어 있으면 Heym은 다음을 수행합니다:

1. 응답에서 JSON을 파싱합니다
2. 현재 캔버스를 새 노드와 엣지로 교체합니다
3. 노드 레이아웃을 정리합니다
4. Workflow를 저장되지 않은 상태로 표시합니다

파싱에 실패하면 **Retry** 버튼이 나타나 응답을 다시 생성합니다.

## 단일 노드 변경

캔버스의 노드 위에 마우스를 올리고 그 위의 **AI**를 클릭합니다. 패널이 해당 노드에 초점을 맞춰 Agent 모드로 열리고 변경 중인 노드를 표시합니다:

| 노드 상태... | 패널 표시 내용 |
|---|---|
| 현재 실행에 결과 없음 | **Modifying Node:** 노드 아이콘과 이름이 포함된 간결한 행. 어시스턴트는 노드 설정만으로 편집합니다. 출력을 확인해야 하는 경우 먼저 노드를 실행하세요 |
| 현재 실행에 결과 있음 | **Modifying Node: (Has Node Output)** 노드 자체 위: 아이콘, 이름 및 유형, 마지막 상태 및 지속 시간, 실패 시 오류. 어시스턴트는 노드를 편집할 때 해당 출력과 오류를 확인합니다 |

라벨 위로 마우스를 가져가면 패널이 어떤 상태인지 확인할 수 있습니다.

패널이 어떤 상태이든 어시스턴트는 노드 헤더의 책 아이콘 뒤에 있는 노드 문서 페이지도 읽습니다. 이 페이지를 통해 노드의 옵션을 이해하고 이에 대한 질문에 답변합니다.

메시지 아래의 세 가지 옵션으로 요청을 시작합니다:

| 옵션 | 동작 |
|---|---|
| **Change this node as ...** | 문장을 완성할 수 있도록 메시지 상자에 *이 노드를 다음으로 변경:*을 입력합니다 |
| **Fix error in this node ...** | *이 노드의 오류를 수정합니다.*를 입력합니다. 어시스턴트는 마지막 실행에서 이 노드의 오류를 읽습니다 |
| **Other** | 빈 메시지 상자에 포커스를 맞춥니다 |

텍스트를 편집하고 **Send**를 누릅니다. 어시스턴트는 이 노드만 반환하고 Heym은 즉시 업데이트합니다. 노드는 ID, 유형 및 이름을 유지하므로 다른 노드의 `$checkLinkedIn.result`와 같은 표현식이 계속 작동합니다. 다른 노드, 연결 및 레이아웃은 변경되지 않으며 **Undo**를 통해 이전 설정으로 복원할 수 있습니다.

요청이 노드 내에 맞지 않는 경우(예: 다른 노드 유형이나 새 노드가 필요한 경우) 어시스턴트는 편집하는 대신 변경해야 할 사항을 알려줍니다. 노드 카드의 **X**로 노드 포커스를 닫아 전체 워크플로우를 다시 편집할 수 있습니다. 패널을 닫아도 포커스가 지워집니다.

[YOLO 모드](#yolo-mode)는 포커스된 노드에서 작동합니다. 어시스턴트는 노드를 변경하고 워크플로우를 실행하며 실행이 통과될 때까지 노드를 수정합니다. **Ask** 모드에서는 포커스를 통해 어시스턴트에게 질문 대상 노드를 알려주며 캔버스는 변경되지 않습니다.

## YOLO Mode

**YOLO mode**를 사용하면 어시스턴트가 자신이 구축한 것을 테스트할 수 있습니다. 메시지 필드 아래의 **YOLO mode** 상자를 선택한 후 요청을 전송하십시오. 이 상자는 Agent 모드에서만 나타납니다. 기본적으로 꺼져 있으며, 페이지를 새로고침하면 꺼진 상태로 초기화됩니다. 옆의 정보 아이콘에 마우스를 올리면 간단한 요약을 볼 수 있습니다.

YOLO mode가 켜져 있으면 어시스턴트는 Workflow를 적용한 후 멈추지 않습니다:

1. 캔버스에 Workflow를 적용합니다.
2. 첫 실행 전에 테스트 입력을 요청합니다. 카드에는 Workflow의 입력 필드가 나열되며, 어시스턴트가 제안한 값으로 채워집니다. 값을 편집하고 **Run**을 누르십시오. 이후 실행에서는 이 값들이 재사용됩니다. 카드는 입력 필드가 변경되거나 어시스턴트가 다른 테스트 데이터를 필요로 할 때만 다시 나타납니다.
3. **Run** 버튼과 정확히 동일하게 캔버스에서 Workflow를 실행합니다. 저장되지 않은 변경 사항이 먼저 저장되고, 노드가 점등되며, 실행 결과가 Debug 패널과 [Execution History](./execution-history.md)에 나타납니다.
4. 결과를 읽습니다. 실행이 요청한 대로 수행되었으면 **Verified**와 간단한 요약으로 마무리합니다. 그렇지 않으면 Workflow를 수정하고 다시 실행합니다.

메시지당 최대 **5회 실행**합니다. 언제든지 **Stop**을 눌러 루프를 종료하고 진행 중인 실행을 중지할 수 있습니다.

각 응답은 진행되는 단계를 표시합니다:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, 각 노드에 대한 `Executing <node>` 행 포함;
- 최종 판정.

각 실행 후 *Attempt 1 result sent · error in 1.2s*와 같은 짧은 줄이 표시되어 결과가 어시스턴트에게 전달되었음을 나타냅니다.
### 다른 Workflow 실행하기

YOLO 모드에서 어시스턴트는 다른 Workflow의 결과가 필요할 때 해당 Workflow를 실행할 수도 있습니다. 예를 들어, [Execute](../nodes/execute-node.md) 노드에서 호출하기 전에 Workflow가 무엇을 반환하는지 확인할 수 있습니다. 이러한 실행은 `Running workflow "<name>"...` 단계로 표시되며, Execution History에 트리거 소스 `ai_assistant`로 기록됩니다. 편집 중인 Workflow는 항상 캔버스에서 테스트됩니다.

### 조기에 중단되는 경우

| 상황 | 발생하는 일 |
|---|---|
| 어시스턴트가 결정, 정보, credential 또는 데이터 테이블을 필요로 하는 경우 | 일반적인 질문 카드로 질문합니다. 답변하면 루프가 계속됩니다. |
| 실행이 [human review](./human-in-the-loop.md)를 기다리는 경우 | 루프가 중단됩니다. 리뷰를 승인한 후 메시지를 보내십시오. |
| Workflow가 파일 업로드를 기다리는 경우 | 루프가 중단됩니다. YOLO 모드는 업로드로 트리거된 실행을 테스트할 수 없습니다. |
| 더 새로운 버전의 Workflow가 다른 곳에 저장된 경우 | 루프가 중단됩니다. 저장 충돌을 해결한 후 메시지를 보내십시오. |

> **실행은 실제입니다.** Workflow의 이메일, 메시지, API 호출은 매 시도마다 실제로 전송되며, DataTable 노드는 실제 행을 기록합니다. 모든 실행은 Workflow를 저장하므로 이전 버전은 [Edit History](./edit-history.md)에 남습니다.

## Voice Input

지원되는 브라우저에서는 **Voice** 버튼으로 음성-텍스트 변환을 사용할 수 있습니다. 클릭하여 녹음을 시작하고, 다시 클릭하여 중지합니다. 변환된 텍스트는 전송하기 전에 문법 교정을 위해 AI로 전달됩니다.

## Agent Node vs AI Assistant

| | Agent Node | AI Assistant |
|---|------------|---------------|
| **목적** | Workflow 내부의 LLM 노드; 실행 중에 동작 | 자연어로 Workflow를 구축하는 채팅 UI |
| **위치** | 캔버스 노드 | Debug panel → floating panel |
| **시점** | 런타임 시 | 편집 중 |

도구와 MCP로 LLM 호출을 실행하는 Workflow 노드에 대해서는 [Agent Node](../nodes/agent-node.md)를 참조하십시오.

## 작동 방식 (AI Builder DSL)

AI Assistant는 노드, 엣지, 표현식을 기술하는 **workflow DSL**(도메인 특화 언어)로 구동됩니다. 메시지를 보내면:

1. 메시지와 [User Rules](./user-settings.md), 그리고 현재 Workflow(있는 경우)가 백엔드로 전송됩니다.
2. 백엔드가 다음을 포함하는 **system prompt**를 구성합니다:
   - 전체 workflow DSL(노드 유형, 표현식 구문, 규칙, 예제)
   - "User Custom Rules"로 추가된 User Rules
   - 기존 Workflow를 편집 중일 때 현재 workflow JSON
   - Execute 노드를 사용하는 경우 사용 가능한 Workflow 목록
   - 본인이 소유하거나 공유받은 credential의 이름, 유형, id(값은 절대 포함되지 않음)
   - 사용할 수 있는 데이터 테이블의 이름, id, 설명, 컬럼(행은 절대 포함되지 않음)
3. 모델이 단일 workflow JSON 블록(`nodes`와 `edges` 포함)을 반환합니다. 프런트엔드가 이를 파싱하여 캔버스에 적용합니다.

### Credentials

Workflow에 credential이 필요하면 어시스턴트는 구축 전에 질문합니다. 적합한 유형의 credential이 있으면 **Create a new credential**과 함께 목록을 표시하고, 없으면 생성할지 묻습니다. 모든 질문에서 credential 없이 계속 진행할 수도 있습니다.

생성을 선택하면 패널에서 credential 양식이 열리며, 올바른 유형과 제안된 이름이 미리 설정됩니다. 값은 곧바로 Heym으로 전달되며, 어시스턴트는 이름과 유형만 알게 됩니다. OAuth credential(Google Sheets, Google Drive, BigQuery, Linear, Notion)은 팝업에서 연결되며, 팝업이 차단된 경우를 대비해 인증 페이지 링크가 표시됩니다. Credential이 저장되면 카드에 이름이 표시되고 생성 버튼이 꺼집니다. **Submit answers**를 누르면 어시스턴트가 새 credential을 노드에 배치합니다.

Credential만 단독으로 요청하거나("create a GitHub credential") 소유한 credential의 변경을 요청할 수도 있습니다("update my sheet credential", "reconnect my Google Sheets"). 어시스턴트는 동일한 카드로 응답합니다. 생성은 빈 양식을 열고, 업데이트는 해당 credential의 양식을 비밀 값이 마스킹된 상태로 엽니다.

어시스턴트는 전용 노드를 선호합니다. Google Sheet에 탭을 추가하는 것처럼 노드가 지원하지 않는 작업의 경우 HTTP request를 사용하고 선택한 credential에 대한 헤더 라인을 작성합니다. [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials)를 참조하십시오.

Workflow가 없어도 되는 명확화 질문은 입력에 **Optional**로 표시되며 건너뛸 수 있습니다.

DSL은 camelCase 레이블, 통합 표현식 규칙, 노드별 필드를 강제합니다. 필드 값이 단일 `$expr`이면 백엔드는 원래 유형을 보존하고, 값이 `$refs`와 산문을 혼합하면 결과는 문자열입니다. 하나의 `$` 규칙은 여전히 적용됩니다. 괄호 안에는 `$`가 없어야 합니다. [Settings](./user-settings.md) User Rules는 이 system prompt에 주입되므로 사용자의 기본 설정이 모든 AI 생성 Workflow에 적용됩니다.

현재 Workflow에 Agent skills가 포함되어 있으면 AI Assistant는 해당 Workflow 컨텍스트에 각 skill의 `SKILL.md`만 포함합니다. 첨부된 `.py` 파일과 바이너리 skill 자산은 요청 전에 제거되므로, skill에 대규모 구현이 포함되어 있어도 빌더가 모델 컨텍스트 한도 내에 머무릅니다.
### 데이터 테이블

Workflow가 레코드를 저장, 보관 또는 조회할 때 다른 저장소를 지정하지 않은 경우, 어시스턴트는 [DataTable](../nodes/datatable-node.md) 노드를 사용합니다. 테이블 이름을 지정했고 해당 테이블에 Workflow가 필요로 하는 열이 있으면 어시스턴트는 그 테이블을 사용합니다. 그렇지 않으면 어떤 테이블을 사용할지 질문합니다. 카드에는 적합한 테이블이 각각의 설명 및 열 유형과 함께 나열되며, 제안된 이름과 열이 포함된 **Create a new table**도 표시됩니다. 공유받은 테이블도 제공되며, 읽기만 가능한 테이블은 읽기 용도로만 제공됩니다.

새 테이블을 선택하고 **Submit answers**를 누르십시오. 카드가 테이블을 생성하고, 어시스턴트가 해당 id를 노드에 설정하며 정확한 열 이름을 사용합니다. 예를 들어 "create a table for my leads"와 같이 테이블만 단독으로 요청할 수도 있습니다.

어시스턴트는 테이블 이름, 설명 및 열을 확인할 수 있지만 행은 볼 수 없습니다. 기존 테이블의 열을 변경하지 않습니다. 테이블에 Workflow가 필요로 하는 열이 없으면 해당 열의 이름을 명시하고 대신 새 테이블을 제안합니다. 열 추가는 [DataTable tab](../tabs/datatable-tab.md)에서 수행하십시오.

## Related

- [Why Heym](../getting-started/why-heym.md) – 에이전트 라이프사이클의 첫 단계로서의 자연어 빌딩
- [Quick Start](../getting-started/quick-start.md) – 첫 Workflow 빌드하기
- [Settings](./user-settings.md) – AI Assistant 시스템 프롬프트에 주입되는 User Rules
- [Chat with Heym](./chat-with-heym.md) – 문서 영역 내의 페이지 인식 어시스턴트
- [Core Concepts](../getting-started/core-concepts.md) – Workflow, 노드 및 실행 흐름
- [Agent Node](../nodes/agent-node.md) – 도구 및 MCP를 갖춘 LLM 노드
- [Credentials Tab](../tabs/credentials-tab.md) – AI Assistant용 API 키 추가
- [Workflow Structure](./workflow-structure.md) – Workflow의 JSON 형식
