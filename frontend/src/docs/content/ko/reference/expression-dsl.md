# Expression DSL

Heym은 상위 노드의 데이터를 참조하기 위해 간단한 표현식 언어를 사용합니다. LLM `userMessage`, Condition `condition`, Output `message`, Set 매핑, Variable 값 등과 같은 노드 구성에서 표현식을 사용하십시오. 더 큰 편집기, 백엔드 기반 실시간 미리보기, 출력 경로 선택 기능을 사용하려면 [Expression Evaluation Dialog](./expression-evaluation-dialog.md)를 사용하십시오.

## 기본 참조

### Input 노드 vs 명명된 노드

- **`$input`** – 단일 상위 [Input](../nodes/input-node.md) 노드가 있고 그 출력을 참조하려는 경우에만 사용합니다. 예: `$input.text`. 이는 "연결된 입력으로부터의 데이터"에 대한 축약형입니다.
- **`$nodeLabel.field`** – **label**(노드 데이터의 `label`)로 모든 상위 노드를 참조할 때 사용합니다. 여러 노드가 있거나 AI Assistant / Workflow DSL이 명시적 label을 요구하는 경우 이 방식을 선호하십시오. 예: `$userInput.body.text`, `$myLLM.text`.

**사용 시점:**

| 컨텍스트 | 선호 | 예시 |
|--------|--------|---------|
| 단일 입력 노드, 단순 흐름 | `$input.text` | 하나의 Input에서 출력 메시지 |
| 여러 노드 또는 명명된 참조 | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / Workflow JSON | 항상 `$nodeLabel.field` | Workflow 빌더는 `$input`이 아닌 label을 요구합니다 |

### Input 노드

단일 상위 입력이 있을 때 `$input`을 사용하여 Input 노드의 데이터를 참조하십시오:

```
$input.text
```

### 명명된 노드

label로 모든 상위 노드를 참조하십시오. 노드에 [고정된 데이터](./canvas-features.md#data-pin)가 있는 경우, 표현식 자동 완성은 실행 출력 대신 해당 데이터를 사용합니다.

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

`$credentials.CredentialName`을 사용하여 이름으로 credential 값(예: API 키, bearer Token, 또는 Notion 통합 Token)을 참조하십시오. [Credentials Sharing](./credentials-sharing.md)을 참조하십시오.

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

일반 식별자가 아닌 이름(`-`를 포함하거나, 숫자로 시작하거나, 예약어인 경우)은 대괄호 형식을 사용합니다: `$credentials["my-api-key"]`.

### Global Variables

`$global.variableName`을 사용하여 [Global Variables](./global-variables.md)를 참조하십시오 – [Variables tab](../tabs/global-variables-tab.md)에서 관리되는 영구적이고 사용자 범위의 키-값 데이터입니다.

```
$global.environment
$global.settings.baseUrl
```

### 중첩 필드

중첩 객체에는 점 표기법을 사용하십시오:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## 리터럴

- **문자열**: `"hello"` 또는 `'hello'`
- **숫자**: `42`, `3.14`
- **불리언**: `true`, `false`
- **Null**: `null`

## 타입 보존

**전체** 값이 단일 `$expr`인 경우, 백엔드는 원래 타입을 보존합니다:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

표현식이 더 큰 문자열의 일부인 경우, 최종 결과는 항상 문자열입니다:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md) 노드는 캔버스 문서이며 실행 가능한 표현식 필드가 아닙니다. 해당 `note` 콘텐츠는 markdown으로 렌더링되므로 `$...` 표현식 대신 일반 markdown 링크와 이미지를 사용하십시오.

Sticky note는 사용자 지정 표시 제목과 6개의 저장된 배경색을 지원합니다:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

허용되는 `stickyColor` 값은 `yellow`, `sky`, `emerald`, `rose`, `violet`, `zinc`입니다.

## 산술

지원되는 연산자: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## 비교

[Condition](../nodes/condition-node.md) 노드에서 사용: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop 컨텍스트

[Loop](../nodes/loop-node.md) 노드 내부에서 `item`을 사용하여 현재 배열 요소를 참조하십시오:

```
item.name
item.value
```

## 특수 변수
- `$now` - 포맷팅 메서드가 있는 현재 날짜/시간
- `$Date()` - 날짜 생성/파싱 (예: `$Date("2024-01-15")`)
- `$UUID` - 32자 고유 식별자 생성 (괄호 없음; `$UUID()`가 아닌 `$UUID` 사용)
- `$workflowName` - 현재 Workflow의 이름
- `$workflowDescription` - 현재 Workflow의 설명
- `$workflowPath` - Workflow의 상대 경로, 예: `/workflows/<id>`
- `$workflowUrl` - Workflow의 절대 URL, 예: `https://<host>/workflows/<id>`
- `$executionId` - 현재 실행의 id ([Execution History](./execution-history.md) 항목 id와 동일하므로 `/workflows/<id>/<executionId>`는 캔버스에서 이 실행을 엽니다). **런타임 전용**: 표현식 미리보기 다이얼로그에서는 비어 있으며, Workflow가 실행 중일 때만 채워집니다.
- `$vars` - Workflow 로컬 변수 (`$vars.variableName`으로 접근; `variable` 노드로 업데이트)
- `$global` - 영구 전역 변수 저장소 (`$global.variableName`으로 접근)

### $vars 사용법
- `$vars.counter` - `counter`라는 변수에 접근
- `$vars.myArray.add("item")` - 배열 변수에 항목 추가

### $global 사용법
- `$global.environment` - `environment`라는 전역 변수에 접근
- `$global.settings.baseUrl` - 객체 타입 전역 변수의 중첩 필드에 접근

## 요청 컨텍스트 (API 실행)
Workflow가 HTTP API를 통해 실행되면, 입력 노드는 추가적인 요청 메타데이터를 수신합니다:
- `$textInputLabel.body` - HTTP 요청 body 객체 (원시 JSON Payload)
- `$textInputLabel.headers` - HTTP 요청 헤더 객체 (모든 헤더 키는 소문자입니다)
- `$textInputLabel.query` - URL 쿼리 파라미터 객체

다음과 같이 요청 데이터에 접근하십시오:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## 타입 변환 함수
- `str(value)` - 문자열로 변환합니다
- `int(value)` - 정수로 변환합니다
- `float(value)` - 부동 소수점으로 변환합니다
- `bool(value)` - 불리언으로 변환합니다
- `list(value)` - 리스트로 변환합니다
- `dict(key=value, ...)` - 키워드 인수로 딕셔너리를 생성합니다 (예: `$dict(name="Ali", age=30)`)

## 수학 함수
- `len(value)` - 길이를 가져옵니다
- `abs(value)` - 절댓값
- `min(a, b)` - 최솟값
- `max(a, b)` - 최댓값
- `round(value)` - 숫자를 반올림합니다
- `sum(list)` - 리스트의 합계
- `sorted(list)` - 리스트를 정렬합니다
- `randomInt(min, max)` - 임의의 정수

## 배열 함수
- `$array(a, b, c)` - 인수로부터 배열을 생성합니다 (예: `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - `a`부터 `b`까지의 정수 범위를 생성하며 `b`는 제외됩니다 (예: `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - `a > b`인 경우 실패합니다
- `notNull(list)` - 배열에서 null 값을 제거합니다

## 문자열 생성 함수 (map/filter 표현식용)
- `concat(a, b, c, ...)` - N개의 인수를 연결합니다
  - `.map()` 내부에서 표현식 문자열로 사용하십시오 (문자열 내부에 `$`를 사용하지 마십시오)
  - concat 문자열 내부에는 작은따옴표를 사용하십시오:
    - 올바른 예: `concat('prefix', 'item.field', 'suffix')`

## 객체 리터럴 / 딕셔너리
중괄호 구문을 사용하여 임의의 문자열 키로 객체/딕셔너리를 생성합니다:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### 동적 키
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### 객체 리터럴 규칙
- 키는 임의의 문자열이 될 수 있습니다 (공백/특수 문자 포함)
- 키는 반드시 큰따옴표로 감싸야 합니다 (예: `"key"`)
- 값은 문자열/숫자/불리언/표현식/중첩 객체가 될 수 있습니다

## 문자열 함수
- `upper(text)` - 대문자로 변환합니다
- `lower(text)` - 소문자로 변환합니다
- `strip(text)` - 공백을 제거합니다
- `capitalize(text)` - 첫 글자를 대문자로 변환합니다
- `title(text)` - 제목 형식으로 변환합니다
- `split(text, separator)` - 문자열을 분할합니다
- `join(separator, list)` - 리스트를 결합합니다
- `replace(text, old, new)` - 텍스트를 대체합니다
- `regexReplace(text, pattern, replacement)` - 정규식 패턴으로 대체합니다
- `base64Encode(text)` - UTF-8 텍스트를 표준 Base64로 인코딩합니다
- `base64Decode(text)` - 표준 Base64를 UTF-8 텍스트로 디코딩합니다
- `toJson(text)` - JSON 문자열을 객체, 배열 또는 값으로 파싱합니다

## 문자열 메서드 (문자열 값에 사용)
- `.orEmpty()` - 문자열 값을 반환하거나, 값이 null/누락된 경우 `""`를 반환합니다
- `.upper()` / `.lower()` - 대소문자 변환
- `.strip()` - 공백을 제거합니다
- `.capitalize()` / `.title()` - 첫 글자를 대문자로 변환합니다
- `.length` - 문자열 길이
- `.toString()` - 문자열로 변환합니다
- `.substring(start, end)` - 부분 문자열을 추출합니다
- `.contains(text)` - 부분 문자열을 포함하는지 확인합니다
- `.startswith(prefix)` / `.endswith(suffix)` - 접두사/접미사를 확인합니다
- `.indexOf(text)` - 위치를 찾습니다 (찾지 못하면 -1을 반환합니다)
- `.replace(old, new)` - 첫 번째 항목을 대체합니다
- `.replaceAll(old, new)` - 모든 항목을 대체합니다
- `.regexReplace(pattern, replacement)` - 정규식 패턴으로 대체합니다
- `.hash()` - 문자열의 MD5 해시
- `.base64Encode()` - UTF-8 텍스트를 표준 Base64로 인코딩합니다
- `.base64Decode()` - 표준 Base64를 UTF-8 텍스트로 디코딩합니다
- `.urlEncode()` - 문자열을 URL 인코딩합니다
- `.urlDecode()` - 문자열을 URL 디코딩합니다
- `.escape()` - JSON 문자열 이스케이프 (특수 문자를 JSON 형식으로 변환합니다)
- `.unescape()` - JSON 문자열 언이스케이프 (JSON 형식을 원래 문자열로 변환합니다)
- `.toJson()` - JSON 문자열을 객체, 배열 또는 값으로 파싱합니다

### 문자열 메서드 예시
- `$profile.nickname.orEmpty()` - nullable/누락된 텍스트를 빈 문자열로 변환합니다
- `$text.upper()` - 대문자로 변환합니다
- `$text.lower()` - 소문자로 변환합니다
- `$text.strip()` - 공백을 제거합니다
- `$text.replace("old", "new")` - 텍스트를 대체합니다
- `$text.replaceAll("a", "b")` - 모든 항목을 대체합니다
- `$text.length` - 문자열 길이를 가져옵니다
- `$text.escape()` - 특수 JSON 문자(예: 따옴표, 줄바꿈)를 이스케이프합니다
- `$escapedText.unescape()` - JSON 형식 문자열을 원래대로 언이스케이프합니다
- `$text.toJson()` - JSON 객체/배열 문자열을 파싱합니다 (이후 `$text.toJson().repoUrl`)
- `$toJson($text)` - 함수로서 동일하게 파싱합니다
- `$base64Encode("Héym 🌍")` - `SMOpeW0g8J+MjQ==`를 반환합니다
- `$encodedText.base64Decode()` - Base64를 UTF-8 텍스트로 디코딩합니다
- `$text.urlEncode()` - API 파라미터용으로 URL 인코딩합니다
- `$encodedText.urlDecode()` - URL 인코딩된 텍스트를 디코딩합니다

## 배열 메서드 (배열 대상)
- `.first()` - 첫 번째 요소를 가져옵니다
- `.last()` - 마지막 요소를 가져옵니다
- `.random()` - 임의의 요소를 가져옵니다
- `.reverse()` - 배열을 뒤집습니다
- `.flat()` - 중첩 배열을 단일 배열로 평탄화합니다
- `.flat(depth)` - 깊이 제한을 두고 평탄화합니다
- `.distinct()` - 중복을 제거합니다
- `.distinctBy(expr)` - 표현식 기준으로 중복을 제거합니다 (예: `$array.distinctBy("item.id")`)
- `.notNull()` - null 값을 제거합니다
- `.add(item)` - 항목을 추가합니다 (새 배열을 반환합니다)
- `.contains(item)` - 배열에 항목이 포함되어 있는지 확인합니다 (boolean을 반환합니다)
- `.join(separator)` - 배열 요소를 문자열로 결합합니다
- `.filter(expr)` - `item` 변수를 사용하여 배열을 필터링합니다 (예: `$array.filter("item > 5")`)
- `.map(expr)` - `item` 변수를 사용하여 각 요소를 변환합니다 (예: `$array.map("item.name")`)
- `.sort(expr, order)` - 표현식 기준으로 정렬하며, order는 `"asc"`(기본값) 또는 `"desc"`입니다
- `.take(n)` - 처음 N개(양수) 또는 마지막 N개(음수) 요소를 가져옵니다
- `.length` - 배열 길이
- `.toString()` - JSON 문자열로 변환합니다

### Filter / Map / Sort 예시
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## 객체/딕셔너리 메서드 (객체 대상)
- `.get(key)` - 키로 값을 가져옵니다 (찾지 못하면 null을 반환합니다)
- `.get(key, default)` - 기본값 fallback과 함께 키로 값을 가져옵니다
- `.keys()` - 모든 키의 목록을 반환합니다
- `.values()` - 모든 값의 목록을 반환합니다
- `.entries()` - `{key, value}` 객체의 목록을 반환합니다 (속성당 하나씩)
- `.filter(expr)` - `{key, value}` 항목을 순회하며 일치하는 항목을 목록으로 반환합니다 (`expr` 내에서 `item.key` / `item.value`를 사용하십시오)
- `.map(expr)` - `{key, value}` 항목을 순회하며 변환된 값의 목록을 반환합니다 (`expr` 내에서 `item.key` / `item.value`를 사용하십시오)
- `.toString()` - JSON 문자열로 변환합니다

### 객체 순회 예시
`.map()` 또는 `.filter()`로 객체를 순회할 때, 각 `item`은 `{key, value}` 쌍입니다:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → null이 아닌 속성 이름의 목록

## 날짜/시간
- `$now` - 현재 날짜/시간
- `$now.format("YYYY-MM-DD")` - 날짜/시간 형식을 지정합니다
- `$now.toISO()` / `.toDate()` / `.toTime()` - 형식을 변환합니다
- `$now.addDays(n)` / `.addHours(n)` - 날짜 연산
- `$Date("2024-01-15")` - 날짜 문자열을 파싱합니다

## 숫자 연산
- 기본 수학: `+`, `-`, `*`, `/`, `%`
- 비교: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Boolean 연산자: `and`, `or`, `not`

## Boolean 조건
Boolean의 경우 표현식을 그대로 작성하십시오 (`== true`를 강제로 붙이지 마십시오):
- 잘못된 예: `$nodeName.isValid == true`
- 올바른 예: `$nodeName.isValid`
- 부정: `not $nodeName.isValid`

## 규칙 및 화이트리스트 (중요)
### $ 배치 규칙
- 독립적인 표현식은 보통 앞에 `$`로 시작합니다.
- 템플릿 문자열은 여러 개의 `$refs`를 포함할 수 있습니다.
- 메서드 파라미터는 다른 표현식 결과(동적 키 또는 중첩 해석)를 전달하려는 경우 중첩된 `$refs`를 포함할 수 있습니다.
  - 유효: `$node.method(other.field)` — `other`는 인자 내부에 `$` 없이 최상위 레이블처럼 컨텍스트에서 해석됩니다.
  - 유효: `$node.method($other.field)` — 중첩된 `$`는 evaluate 대화상자 미리보기 및 조건 평가에서 지원됩니다.
  - 유효: `$array($a.x, $b.y)`
  - `.get(` 내부의 자동 완성은 `$array(...)` / `$notNull(...)` 내부와 마찬가지로 **bare** `label.field` 경로를 삽입합니다 (앞에 `$` 없음).
- **Evaluate API (Run):** 제출된 전체 값이 앞에 `$` 없이 단일 dot path인 경우(예: 편집기에서 선택한 텍스트, `execute.outputs.output.result.today`), 백엔드는 이를 `$execute.outputs.output.result.today`와 동일하게 처리합니다. trim 후 줄 바꿈이나 캐리지 리턴을 포함하는 값은 재작성되지 않습니다 (모호한 다중 행 payload를 방지합니다). 저장된 workflow 필드에는 `$`를 작성하는 것을 권장합니다. 재작성은 주로 검사 및 도구용입니다.
- Evaluate 대화상자의 `Run` 결과는 구체적인 표현식이 어떻게 해석되는지에 대한 기준입니다.

### 배열 문자열 인용
문자열 값으로 배열을 생성할 때는 항상 큰따옴표를 사용하십시오:
- 올바른 예: `$array("hello", "world")`
- 잘못된 예: `$array('hello', 'world')`

### 다음 함수만 사용하십시오 (화이트리스트)
다음만 사용하십시오:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- 문서화된 문자열/배열/객체 메서드

위에 나열되지 않은 함수는 존재하지 않습니다.

### 배열 / 딕셔너리 메서드 제한
- 배열은 다음만 사용할 수 있습니다: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- 객체/딕셔너리는 다음만 사용할 수 있습니다: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### 예약된 노드 레이블 이름

다음 이름들은 노드 레이블로 사용하지 마십시오: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## 예시

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### DSL 예시

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## 관련 문서

- [표현식 평가 대화상자](./expression-evaluation-dialog.md) – 백엔드 실시간 미리보기 및 자동 완성 기능을 제공하는 확장형 편집기
- [캔버스 기능](./canvas-features.md) – 노드를 다시 실행하지 않고 표현식을 테스트할 수 있는 데이터 핀
- [노드 유형](./node-types.md) – 표현식을 사용하는 노드 ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md) 등)
- [스티키 노트](../nodes/sticky-note-node.md) – 편집 가능한 제목, 색상, 이미지 표시를 지원하는 캔버스 마크다운 노트
- [Agent 노드](../nodes/agent-node.md) – Agent Prompt에서 표현식 사용하기
- [Agent 영구 메모리](./agent-persistent-memory.md) – Agent `data`의 `persistentMemoryEnabled` 및 `memoryShares` (표현식 필드 아님)
- [Workflow 구조](./workflow-structure.md) – 표현식을 허용하는 노드 `data` 필드
- [Credentials 탭](../tabs/credentials-tab.md) – 노드에서 참조하는 Credentials
- [Credentials 공유](./credentials-sharing.md) – Credentials 공유 및 표현식에서 `$credentials` 사용하기
- [전역 변수](./global-variables.md) – `$global`을 사용하는 영구 변수
