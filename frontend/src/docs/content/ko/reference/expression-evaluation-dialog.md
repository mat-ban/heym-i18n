# 표현식 평가 대화상자

Expression Evaluation Dialog는 표현식 입력이 가능한 필드를 위한 확장 편집기입니다. 표현식 입력 옆의 확장 버튼에서 열리며, 더 넓은 작업 공간, 자동 완성, 실시간 백엔드 미리보기, 출력 탐색 기능을 한 곳에서 제공합니다.

## Dialog 열기

- Properties 패널의 표현식 필드 옆에 있는 확장 버튼을 클릭합니다.
- 여러 줄 필드는 입력 내부에 버튼이 표시됩니다.
- 한 줄 필드는 입력 오른쪽에 버튼이 표시됩니다.

## Dialog 레이아웃

- Dialog는 약 **80vw × 80vh** 크기의 중앙 모달로 열립니다.
- 필드 레이블을 알 수 있는 경우 헤더에 **Evaluate — {field name}** 이 표시됩니다.
- 편집기는 자동 완성, 필드 간 이동, 일반적인 **Apply** / **Cancel** 동작을 유지합니다.
- 입력을 멈추면 약 **300 ms** 후 미리보기가 자동으로 새로 고쳐집니다.
- `Ctrl` / `Cmd` + `Enter` 를 누르면 현재 텍스트를 필드에 적용하고 Dialog를 닫습니다(**Apply** 와 동일).

## Output 섹션

Output 영역은 편집기에서 입력을 멈춘 후 자동으로 새로 고쳐집니다.

### Evaluation

| Expression type | Result |
|---|---|
| 단일 `$expr` (필드 전체) | 네이티브 값이 유지됨 |
| 단일 bare dot path (필드 전체, `$` 없음, 줄바꿈 없음) | `$` + 해당 경로와 동일 (평가를 위해 백엔드에서 정규화) |
| `$refs` 가 포함된 텍스트 | 최종 결과는 항상 문자열 |
| 리터럴 텍스트 (`$` 없음, 단일 dot path 아님) | 그대로 반환됨 |

**Examples**

| Input | Result |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (전체 값이 이 경로일 때 `$input.items` 와 동일) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

평가 컨텍스트는 다음 순서로 구성됩니다:

- 업스트림 노드의 **Pinned data**
- 캔버스의 **Last run outputs**
- 업스트림 데이터를 사용할 수 없을 때 `null`

현재 노드에 업스트림 의존성이 있지만 그중 어느 것도 pinned data 또는 최근 실행 결과가 없는 경우, Dialog는 먼저 테스트 실행을 수행하여 컨텍스트를 구성한 다음 현재 텍스트를 평가합니다.

### Output Path Picker

백엔드 결과가 객체 또는 배열인 경우, Output 영역은 원시 JSON 대신 대화형 path picker를 표시할 수 있습니다.

- 행을 더블 클릭하면 해당 경로가 현재 `$node.path` 참조에 추가됩니다.
- 확장 가능한 행을 한 번 클릭하면 분기를 열거나 닫습니다.
- 내장된 쿼리 박스를 사용하여 키, 값, 경로 문자열을 검색할 수 있습니다.

## Autocomplete

- `$` 를 입력하면 업스트림 노드, 빌트인, 메서드에 대한 제안이 열립니다.
- `Tab` 또는 `Enter` 를 눌러 선택한 제안을 삽입합니다.
- `↑` / `↓` 를 사용하여 제안 목록을 이동합니다.

### Example Answers

`$…` 참조를 점(.)으로 이어서 입력하면, 각 제안 행은 해당 제안이 생성할 결과를 행 오른쪽에 굵은 글씨로 표시합니다.

- `$set.listItems.first().toString().u` 를 입력하면 `upper`, `urlEncode`, `urlDecode`, `unescape` 가 각각의 평가된 결과와 함께 나열되므로, 이름이 아닌 결과를 기준으로 선택할 수 있습니다.
- `$node.text.toJson()` 을 입력하면 JSON 문자열을 객체 또는 배열로 파싱합니다. `.toJson()` 이후에는 last-run 또는 pinned 출력을 사용할 수 있을 때 자동 완성이 파싱된 키(예: `repoUrl`)를 제안할 수 있습니다.
- 결과는 Dialog 미리보기가 사용하는 것과 동일한 pinned data 및 last-run outputs를 기준으로 백엔드에서 평가되므로, 필드가 생성할 결과와 일치합니다.
- 독립적으로 성립하는 제안만 평가됩니다: 인수가 없는 메서드(`upper()`, `first()`, `keys()`, `toJson()`)와 일반 속성(`length`, `year`)입니다. 인수가 먼저 필요한 제안 — `map`, `filter`, `sort`, `replace` — 은 비워 둡니다.
- 후보가 결과를 생성하지 못하는 경우(오류, `null`, 또는 해당 값에 적용되지 않는 메서드) 행은 비어 있게 유지됩니다.
- 결과는 한 줄로 축약됩니다. 축약된 결과 위에 마우스를 올리면 더 많이 볼 수 있습니다.

## Build with AI

**Build with AI** 버튼은 Workflow가 로드된 경우 evaluate dialog의 오른쪽 상단 모서리에 나타납니다. 이 버튼을 클릭하면 중첩 모달이 열리며, 원하는 표현식을 일반 텍스트로 설명하면 LLM이 이를 생성해 줍니다.

### 작동 방식

1. evaluate dialog 툴바에서 **Build with AI** 를 클릭합니다.
2. 드롭다운에서 LLM credential과 모델을 선택합니다.
3. 원하는 내용을 일반 텍스트로 입력합니다 — 예: *"Get the customer name from the API response"*.
4. **Generate** 를 클릭합니다. 모달은 백엔드를 호출하며, 백엔드는 [Expression DSL](./expression-dsl.md) 시스템 프롬프트와 마지막 Workflow 실행 출력을 컨텍스트로 사용하여 단일 표현식 문자열을 반환합니다.
5. 생성된 표현식은 동일한 캔버스 데이터를 기준으로 즉시 평가되므로 적용하기 전에 결과를 확인할 수 있습니다.
6. **Apply** 를 클릭하면 편집기 내용이 생성된 표현식으로 대체되고, **Regenerate** 를 클릭하면 다시 시도합니다.

### 사용되는 컨텍스트

생성기는 캔버스의 마지막 테스트 실행에서 나온 노드 출력을 받습니다. Workflow가 아직 실행되지 않은 경우, LLM은 노드 레이블과 DSL 규칙을 기반으로 최선의 표현식을 생성합니다.

### 요구 사항

- [Credentials](./credentials.md) 탭에 LLM credential(OpenAI, Google, Custom)이 구성되어 있어야 합니다.
- Workflow가 편집기에서 열려 있어야 합니다.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| 입력 일시 정지 (~300 ms) | 백엔드 미리보기 새로 고침 |
| `Ctrl` / `Cmd` + `Enter` | 적용하고 Dialog 닫기 |
| `Escape` | 자동 완성을 먼저 닫고, 그렇지 않으면 Dialog 닫기 |
## 메서드 인수에서의 중첩 `$`

Dialog / 백엔드 평가 시, 동적 키가 필요할 때 `.get($other.field)`와 같은 호출 내부에 중첩 `$`를 포함한 또 다른 참조를 전달할 수 있습니다. `.get(...)` 내부에 순수 경로(예: `other.field`)를 사용할 수도 있으며, 백엔드는 동일한 방식으로 이를 해석합니다. 저장된 Workflow 필드는 여전히 [Expression DSL](./expression-dsl.md) 규칙을 따라야 합니다. evaluate API는 편의를 위해 전체 라인의 순수 점 경로(bare dot path)도 허용합니다(위 표 참조).

## 내비게이션

Set 및 Execute 매핑 편집기는 **Prev** / **Next** 버튼을 표시하여 다이얼로그를 닫지 않고도 필드 간을 이동할 수 있습니다.

## 관련 항목

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — Build with AI 기능에 필요합니다
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
