# Canvas 기능

Workflow 편집기는 노드를 디버깅, 테스트 및 정리하기 위한 여러 기능을 제공합니다: **Run to Node**, **노드의 AI**, **Data Pin**, **Execution Logs**, **Enable/Disable**, **Extract to Sub-Workflow**입니다.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ 편집기 데모 시청</a></p>

## Run to Node

Sticky note를 제외한 모든 노드 위에 마우스를 올리고 해당 노드 아래의 **Run**을 클릭하십시오. Heym은 해당 노드와 그 상위 의존성을 실행하며, 하위 노드와 관련 없는 분기는 그대로 둡니다. 이는 고정된 출력과 workflow의 일반 분기 조건을 포함한 canvas 테스트 모드를 사용합니다.

선택한 경로에 입력 필드가 있는 경우, 오른쪽 **Run** 패널이 열리고 첫 번째 필드에 포커스가 맞춰집니다. 값을 입력한 후 **Run to _node label_**을 클릭하거나 **Ctrl+Enter**(macOS에서는 Cmd+Enter)를 누르십시오. Generic body 모드는 JSON body 편집기에 포커스를 맞춥니다. 입력 필드가 없는 경로는 패널을 열지 않고 즉시 실행됩니다. Pinned Input 노드는 입력을 요청하지 않고 고정된 출력을 재사용합니다.

패널은 후속 실행을 위해 선택한 대상을 유지합니다. 대상을 지우려면 **Run full workflow**를 선택하십시오. 실행이 진행 중인 동안에는 Run 버튼이 비활성화됩니다. loop 내부의 대상은 해당 노드에 처음 도달했을 때 실행을 중지합니다. loop 이후의 노드를 선택하면 전체 상위 loop가 실행됩니다.

## 노드의 AI

스티커 메모를 제외한 모든 노드 위로 마우스를 가져간 다음 노드 위의 **AI**를 클릭합니다. [AI Assistant](./ai-assistant.md)가 해당 노드에서 열리고 **Change this node as ...**, **Fix error in this node ...**, **Other**를 제공합니다. Agent 모드에서 어시스턴트는 해당 노드만 변경하며, 다른 노드, 연결 및 레이아웃은 그대로 유지됩니다. [AI Assistant › 단일 노드 변경](./ai-assistant.md#changing-one-node)을 참조하세요.

보기 권한만 있는 워크플로우에서는 이 버튼이 숨겨집니다.

## Data Pin

Data Pin을 사용하면 마지막 실행에서 노드의 출력을 고정하여, 고정된 노드를 다시 실행하지 않고도 하위 노드를 테스트할 수 있습니다.

### 찾는 위치

- **Properties panel** – 노드를 선택하고 **Pinned Data** 섹션으로 스크롤하십시오
- **Node badge** – 데이터가 고정되면 노드에 pin 아이콘이 표시됩니다

### 작업

| 작업 | 설명 |
|--------|-------------|
| **Pin** | 노드의 마지막 실행 출력을 고정합니다(실행 후 사용 가능) |
| **Clear** | 고정된 데이터를 제거합니다 |
| **Edit** | 고정된 JSON을 직접 편집합니다. Save를 클릭하여 적용하십시오 |

### 테스트 모드 동작

테스트 모드에서 workflow를 실행할 때, `pinnedData`가 있는 노드는 실행을 건너뛰고 고정된 출력을 대신 사용합니다. 다음 용도로 사용하십시오:

- 외부 API를 호출하지 않고 하위 로직 테스트
- 노드의 출력을 참조하는 표현식 디버깅
- 고정된 샘플 데이터로 Prompt 또는 조건 반복 개선

편집기의 표현식 자동 완성은 사용 가능한 경우 고정된 데이터를 사용하여 필드를 제안합니다.

## Execution Logs

**Debug panel**(하단 drawer)은 workflow 실행 중 실시간 실행 로그를 표시합니다. History 대화 상자나 Board 카드에서 실행 중인 프로덕션 실행을 열 수도 있습니다. 편집기는 해당 실행의 SSE 스트림에 연결하고, 완료된 노드 결과를 복원하며, 새로운 노드가 시작되고 완료될 때 노드 애니메이션과 로그를 계속 표시합니다.

### 표시 내용

- **Node results** – 노드별 상태(`success`, `error`, `skipped`, `running`), 실행 시간 및 출력
- **Final outputs** – [Output](../nodes/output-node.md) 노드의 집계된 출력
- **Agent progress** – [Agent](../nodes/agent-node.md) 노드의 경우 단계별 도구 호출 및 추론

### 작업

- **Copy as JSON** – 전체 실행 로그를 클립보드에 복사합니다
- **Open in JSON editor** – 검사를 위해 JSON Hero 또는 JSON Editor Online에서 로그를 엽니다
- **Download generated files** – skill이 다운로드 가능한 파일(`_generated_files`)을 생성한 경우 Download 버튼이 나타납니다. 단일 파일은 직접 다운로드되고, 여러 파일은 선택 팝업이 열립니다.

### Logs Tab과의 차이

Debug panel은 **workflow 실행** 로그(노드 결과, 출력)를 표시합니다. [Logs Tab](../tabs/logs-tab.md)은 **Docker 컨테이너** 로그(백엔드, 프론트엔드, 데이터베이스)를 표시합니다. <!-- pragma: allowlist secret -->

## Enable / Disable

노드를 비활성화하여 실행 중에 건너뛰도록 할 수 있습니다. 비활성화된 노드는 "off" 배지를 표시하며 흐리게 표시됩니다.

### 전환 방법

| 방법 | 설명 |
|--------|-------------|
| **Properties panel** | 노드 선택 → Power 아이콘(오른쪽 상단) |
| **Context menu** | 노드 마우스 오른쪽 클릭 → Disable 또는 Enable |
| **Keyboard** | 노드 선택 → **D** 키 누르기([Keyboard Shortcuts](./keyboard-shortcuts.md) 참조) |

### 다중 선택

여러 노드가 선택된 경우 Enable/Disable이 모두에 적용됩니다. 선택한 노드 중 하나라도 비활성화되어 있으면 context menu에 "Enable"이 표시되고, 모두 활성화되어 있으면 "Disable"이 표시됩니다.

### 런타임 동작

`active: false`인 노드는 건너뜁니다. 하위 노드는 건너뛴 노드로부터 데이터를 받지 않습니다. 노드를 삭제하지 않고 일시적으로 제외하려면 이 기능을 사용하십시오.

수동이 아닌 workflow 내부에서 노드를 켜거나 끄려면 [Disable Node](../nodes/disable-node.md)와 [Enable Node](../nodes/enable-node.md)를 사용하십시오.

## Agent 메모리 그래프

**[영구 메모리](./agent-persistent-memory.md)** 가 활성화된 [Agent](../nodes/agent-node.md) 노드는 노드 위에 분홍색 **brain** 컨트롤을 표시합니다. 이를 클릭하면 메모리 그래프 편집기가 열립니다. 엔터티는 엔터티 유형별로 클러스터링된 애니메이션 force-directed 그래프로 렌더링되며, 관계를 추가하기 위한 검색 가능한 Source/Target 선택기와 연결된 엔터티 간을 이동할 수 있는 연결 패널이 제공됩니다. 동일한 대화상자에는 [에이전트 간 메모리 공유](./agent-persistent-memory.md#sharing-with-other-agents)를 위한 **Share memory with other agents** (Workflow → agent → read 또는 read/write) 기능이 포함되어 있습니다. 대화상자가 열려 있는 동안 메인 캔버스의 실행 취소/다시 실행은 보류되어 그래프 편집이 자체적인 이력을 유지합니다.

**그래프 필터링.** 캔버스의 좌측 상단에는 검색 컨트롤이 있으며, 클릭하거나 **Ctrl/Cmd+F** 를 누르기 전까지는 바로가기 버튼으로 축소되어 있습니다. 이는 엔터티의 이름, 유형, 모든 속성 키와 값, 그리고 관계의 유형(`parent_of`)과 그 속성을 검색합니다. 일치하는 관계는 양쪽 엔터티를 함께 가져옵니다. 공백으로 구분된 모든 검색어가 일치해야 합니다. 일치하는 엔터티는 그 전체 이웃 — 해당 엔터티가 참여하는 모든 관계와 각 관계의 반대편 엔터티 — 를 함께 가져오므로, 일치 항목이 연결되지 않은 점으로 남는 경우는 없습니다. 일치하는 관계는 그것이 연결하는 두 엔터티만 가져오고 거기서 멈춥니다. 이는 관계 유형을 검색하는 것이 그 관계의 양 끝에 연결된 모든 것에 대한 질문이 아니라 해당 관계 자체에 대한 질문이기 때문입니다. 나머지는 모두 캔버스와 **All edges** 목록에서 흐리게 표시되는 것이 아니라 완전히 숨겨지며, 배지가 전체 엔터티 중 몇 개가 남았는지 표시합니다. 검색 상자 안의 **✕** 는 먼저 검색어를 지우고, 두 번째 누르면 상자를 닫습니다. Escape는 가장 안쪽부터 동일한 순서로 되돌립니다. 즉, 검색어를 지우고, 검색 상자를 닫고, 확장된 캔버스 보기를 나가고, 이들 중 아무것도 열려 있지 않을 때만 대화상자를 닫습니다. 지우면 모든 엔터티가 원래 위치로 돌아간 전체 그래프가 복원됩니다.

**엔터티 수동 배치.** 엔터티를 드래그하면 놓은 위치에 고정되므로, 자동 레이아웃이 해당 엔터티를 다시 끌어오는 대신 나머지 그래프를 그 주위에 배치합니다. 선택한 엔터티를 드래그하면 직접 연결된 엔터티들이 함께 이동하여 클러스터의 형태를 유지합니다. 다른 엔터티를 드래그하면 해당 엔터티만 이동합니다. **Tidy layout** (지팡이 버튼)은 고정된 모든 엔터티를 해제하고 자동 레이아웃을 다시 실행합니다.

## Sub-Workflow로 추출

선택한 노드를 재사용 가능한 sub-workflow로 변환하고 [Execute](../nodes/execute-node.md) 노드로 대체합니다.

### 사용 방법

1. 캔버스에서 하나 이상의 노드를 선택합니다
2. 마우스 오른쪽 버튼 클릭 → **Extract to Sub-Workflow**
3. 새 Workflow의 이름(및 선택적 설명)을 입력합니다
4. **Extract** 를 클릭합니다

### 수행 내용

- 선택한 노드로 새 Workflow가 생성됩니다
- 외부 입력(선택 영역 외부에서 들어오는 엣지)은 sub-workflow의 [Input](../nodes/input-node.md) 필드가 됩니다
- 외부 출력(선택 영역 외부의 노드로 나가는 엣지)은 sub-workflow의 [Output](../nodes/output-node.md)에 매핑됩니다
- 선택한 노드는 새 Workflow를 호출하는 단일 [Execute](../nodes/execute-node.md) 노드로 대체됩니다
- 입력/출력 매핑은 자동으로 유지됩니다

### 사용 사례

- 여러 Workflow에서 노드 시퀀스를 재사용합니다
- 관련 로직을 그룹화하여 복잡한 Workflow를 단순화합니다
- 모듈화되고 테스트 가능한 sub-workflow를 생성합니다

## cURL로 실행

편집기 도구 모음(우측 상단)의 **cURL** 버튼은 API를 통해 Workflow를 Trigger하기 위한 cURL 명령을 작성하고 복사하는 대화상자를 엽니다.

- Workflow의 요청 본문 모드(`Defined` 또는 `Generic`)를 선택합니다
- 인증 유형(Anonymous, JWT 또는 Header Auth)을 설정합니다
- 응답 캐싱 및 속도 제한을 구성합니다
- SSE 스트리밍을 전환하고 노드별 시작 메시지를 사용자 지정합니다
- 요청 본문을 편집합니다
- Generic 모드에서 캔버스 실행 패널은 cURL 대화상자와 동일한 원시 JSON 본문을 사용합니다
- **Copy cURL** 을 클릭하여 바로 실행 가능한 명령을 복사합니다

전체 대화상자 세부 정보는 [Webhooks](./webhooks.md#run-with-curl-dialog)를, 이벤트 프로토콜은 [SSE Streaming](./sse-streaming.md)을 참조하십시오.

## 관련 항목

- [키보드 단축키](./keyboard-shortcuts.md) – 모든 캔버스 및 편집기 단축키
- [Agent 영구 메모리](./agent-persistent-memory.md) – 메모리 그래프 동작 및 API
- [Execute 노드](../nodes/execute-node.md) – sub-workflow를 호출합니다
- [Expression DSL](./expression-dsl.md) – 참조 및 고정 데이터
- [Workflow 구조](./workflow-structure.md) – 노드 및 엣지 형식
- [다운로드 및 가져오기](./download-import.md) – Workflow를 JSON으로 내보내기 및 가져오기
- [노드 유형](./node-types.md) – 모든 노드 유형
- [Logs 탭](../tabs/logs-tab.md) – Docker 컨테이너 로그
- [실행 이력](./execution-history.md) – 과거 실행
- [템플릿](../tabs/templates-tab.md) – Workflow 및 노드 저장 및 재사용
- [상황별 쇼케이스](./contextual-showcase.md) – 편집기에서 사용 가능한 간략한 페이지 가이드
