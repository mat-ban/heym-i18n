# 입력

**Input** 노드는 사용자 또는 API 호출자로부터 데이터를 수신하는 Workflow의 진입점입니다. 단일 또는 다중 입력 필드를 지원하며, 요청 메타데이터(headers, query params)를 노출합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `value` | string | 단일 텍스트 입력의 기본값 (선택 사항) |
| `inputFields` | array | 입력 필드 정의. 각 항목: `{ key, defaultValue? }` |

### 입력 필드

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `key` | string | 필드 키 (예: `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | 제공되지 않을 경우의 기본값 (선택 사항) |

## 입력 데이터 접근

**Body 필드** (항상 `$nodeLabel.body.fieldKey` 사용):

- `$userInput.body.text` – 텍스트 필드
- `$userInput.body.imageUrl` – 이미지 URL
- `$userInput.body.userId` – 설정된 경우 기본값 포함
- `$userInput.body.event.user.id` – Generic webhook 모드의 중첩 JSON

**요청 메타데이터** (API를 통해 실행될 때):

- `$userInput.headers` – 모든 headers (키는 소문자)
- `$userInput.headers.authorization` – 특정 header
- `$userInput.query` – query parameters
- `$userInput.query.param1` – 특정 query param

## Run 패널 파일 입력

에디터의 **Run** 탭(Defined webhook 모드)에서 각 입력 필드는 드래그 앤 드롭과 인라인 첨부 컨트롤(필드 우측 하단)을 지원합니다:

- **텍스트 파일** (`.txt`, `.md`, `.json`, `.csv` 등)은 일반 텍스트로 읽힙니다.
- **이미지** (JPEG, PNG, GIF, WebP)는 `data:` URL (base64)로 필드 값에 저장됩니다 — 다운스트림 노드가 이미지 데이터를 기대하는 경우 `imageUrl` 또는 `base64`와 같은 필드 키를 사용하십시오.
- **PDF** 파일은 추출된 텍스트로 변환됩니다 (최대 5 MB 파일, 100k 문자 콘텐츠).

필드당 하나의 파일만 가능합니다. 파일이 로드된 후에도 textarea를 편집할 수 있습니다. Generic webhook 모드(raw JSON body)에서는 필드별 파일 컨트롤이 표시되지 않습니다.

## 입력 필드 vs Generic Webhooks

`inputFields`는 defined-mode 에디터 폼, sub-workflow 매핑 및 기타 메타데이터 기반 표면에서 예상되는 입력을 여전히 설명합니다.

Workflow가 **Generic** webhook body 모드를 사용하는 경우, 수신되는 HTTP body는 `inputFields`로부터 재구성되지 않습니다. 대신 원시 JSON payload가 `$nodeLabel.body`로 그대로 전달되며, Input 노드의 필드 추가/제거 컨트롤은 노드 패널에서 숨겨집니다.

## 예시

**단일 입력 (기본):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**다중 입력:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## 관련 문서

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Triggers](../reference/triggers.md) – 진입점 (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – `$nodeLabel.body`, `$nodeLabel.query` 참조
- [Portal](../reference/portal.md) – Workflow를 채팅 UI로 노출
- [Webhooks](../reference/webhooks.md) – Workflow용 HTTP trigger
