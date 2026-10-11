# LLM

**LLM** 노드는 언어 모델로 텍스트를 처리하거나 이미지를 생성합니다. 텍스트 생성, 비전(이미지 입력), 이미지 생성, 구조화된 JSON 출력, 그리고 지원되는 텍스트 모델에 대한 공급자 네이티브 **Batch API** 실행을 지원합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1, 그리고 배치 모드가 활성화된 경우 선택적으로 `batchStatus` |
| 출력값 | `$nodeLabel.text` (텍스트), `$nodeLabel.image` (이미지), 또는 `$nodeLabel.results`와 같은 배치 결과 필드 |

## 파라미터

### Credential & Model

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 LLM credential |
| `model` | string | 모델 이름 (예: `gpt-4o`, `gemini-2.5-flash-lite`, 이미지용 `nanobanana`) |
| `fallbackCredentialId` | UUID (선택 사항) | 기본 credential 실패 시 사용할 대체 credential |
| `fallbackModel` | string (선택 사항) | 기본 모델 실패 시 사용할 대체 모델 |

기본 credential 또는 모델이 오류를 반환하면, 노드는 실패하기 전에 대체 credential과 모델로 자동 재시도합니다.

Heym은 또한 선택된 credential과 모델로부터 **배치 기능**을 확인합니다. 배치 모드는 다음의 경우에 사용할 수 있습니다:

- OpenAI credential
- 필수 `/v1/files` 및 `/v1/batches` API를 노출하는 endpoint를 가진 Custom / OpenAI 호환 credential

선택된 공급자 또는 모델이 배치 실행을 지원하지 않는 경우, Properties 패널에 이를 직접 표시하고 토글을 비활성화합니다.

### Prompts (텍스트 모드)

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `systemInstruction` | string | 시스템 Prompt. [표현식](../reference/expression-dsl.md)을 지원합니다. |
| `userMessage` | string | 사용자 메시지. 기본값: `$input.text` |
| `temperature` | number | 0.0–2.0 (기본값: 0.7) |
| `maxTokens` | number | 최대 응답 Token (선택 사항) |
| `requestTimeoutSeconds` | number | 타임아웃 전까지 모델 응답을 기다리는 최대 초 (기본값: 60). 느리거나 자체 호스팅되는 공급자(LiteLLM, vLLM, 로컬 모델)의 경우 값을 높이십시오. |

### Image & Output

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | 텍스트 또는 이미지 생성 |
| `imageInputEnabled` | boolean | 사용자 메시지에 이미지 포함 (비전) |
| `imageInput` | expression | Base64 데이터 URL 또는 이미지 URL |
| `jsonOutputEnabled` | boolean | 구조화된 JSON 출력 |
| `jsonOutputSchema` | string | 구조화된 출력을 위한 JSON Schema |
| `extraBodyEnabled` | boolean | 공급자별 요청 파라미터 전송 (기본값: `false`) |
| `extraBody` | string | API 요청 본문에 병합되는 JSON 객체 |

### Reasoning 모델 (o1, o3)

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Reasoning 모델에 대해 활성화 |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Reasoning 깊이 |

### Batch 모드

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | 단일 요청 실행 대신 공급자 네이티브 Batch API 사용 |

배치 모드는 **LLM** 노드에서만 사용할 수 있습니다. [Agent Node](./agent-node.md)에는 적용되지 **않습니다**.

배치 모드가 활성화된 경우:

- `outputType`은 `text`로 유지되어야 합니다
- `imageInputEnabled`는 `false`로 유지되어야 합니다
- `userMessage`는 **배열**로 해석되어야 합니다
- 각 배열 항목은 문자열 또는 원시 값으로 해석되어야 합니다

일반적인 예:

- `$input.items.map("item.text")`
- `$vars.promptList`

표현식이 배열 대신 단일 문자열로 해석되면, 공급자 호출이 시작되기 전에 유효성 검사 오류와 함께 실행이 실패합니다.

## Batch Status 분기

배치 모드가 활성화되면, LLM 노드는 두 번째 출력 핸들인 `batchStatus`를 노출합니다.

배치가 아직 실행 중일 때 알림, 로깅, Slack 메시지 또는 부수 효과를 위해 해당 분기를 사용하십시오. 이 분기는 다음과 같은 정규화된 상태를 포함하여 공급자 상태가 의미 있게 변경될 때마다 실행됩니다:

- `pending`
- `processing`
- `completed`
- `failed`

상태 분기 Payload는 다운스트림 노드 내에서 `$input`으로 사용할 수 있으며 다음을 포함합니다:

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

예시 edge:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

예시 상태 매퍼:

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## Batch 결과 구조

성공적으로 완료되면, 기본 LLM 출력은 다음을 포함합니다:

- `$nodeLabel.text` – 성공한 텍스트들의 연결
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – 원래 순서대로의 항목별 결과
- `$nodeLabel.usage`

`$nodeLabel.results`의 각 항목은 다음과 같은 필드를 포함합니다:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

**JSON 출력**이 배치 모드와 함께 활성화되면, Heym은 각 성공한 항목을 개별적으로 파싱합니다. 파싱된 객체는 항목별로 노출되며 `parsedResults`에 수집됩니다.
## Responses API

**Use Responses API** 체크박스를 선택하면 노드의 호출이 Chat Completions 대신
[Responses API](https://platform.openai.com/docs/api-reference/responses)를 통해 라우팅됩니다. 기본값은 꺼짐이며, 어느 쪽이든 노드의 동작은 동일합니다. 즉, 동일한 Prompt, 동일한 JSON 출력 스키마, 동일한 결과 형태를 사용합니다.

이 기능은 OpenAI credential과 함께 작동하며, Endpoint를 지원하는 gateway를 사용하는 사용자 정의 credential과도 함께 작동하므로 자체 호스팅 또는 프록시 환경에서도 사용할 수 있습니다. Google credential을 사용하는 경우에는 비활성화된 상태로 유지되며, [Batch mode](#batch-status-branch)와 함께 사용할 수 없습니다. 노드 패널은 실행 전에 특정 credential의 지원 여부를 표시합니다.

실행 시점에 Endpoint를 사용할 수 없는 것으로 확인되면, 노드는 조용히 대체 동작으로 넘어가지 않고 원인을 명시한 메시지와 함께 실패합니다. 따라서 Responses API용으로 구성된 노드는 항상 이를 통해 실행됩니다. 다른 credential이나 모델로 의도적으로 대체하려면 **Fallback Credential** 및 **Fallback Model** 필드를 사용하십시오. 이 필드들은 이 체크박스 설정을 상속하므로, fallback credential 역시 해당 Endpoint를 지원해야 합니다.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- Prompt에 [Input](./input-node.md)을 사용하는 경우, `userMessage`에 `$userPrompt.body.text`를 사용하십시오.

## JSON Output

`jsonOutputEnabled`가 true이면 LLM은 스키마와 일치하는 JSON을 반환합니다. `$nodeLabel.fieldName`을 통해 필드에 접근하십시오.

## Extra Body

일부 provider는 표준 OpenAI 호환 필드로는 다루지 못하는 요청 파라미터를 허용합니다. 예를 들어 모델의 thinking 모드를 비활성화하는 경우가 그렇습니다. 노드 속성에서 **Send extra request body**를 선택하고 JSON 객체를 입력하십시오. 이 객체는 이 노드가 수행하는 모든 API 요청에 병합됩니다.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **기본값은 비활성화입니다.** 체크박스가 꺼져 있으면 추가 항목이 전송되지 않습니다.
- 반드시 JSON **객체**여야 합니다. 배열, 스칼라 또는 잘못된 형식의 텍스트는 조용히 무시되지 않고 `Invalid extra body JSON` 오류와 함께 노드를 실패시킵니다.
- 체크박스 옆의 **Format** 버튼은 JSON을 재포맷하며, 텍스트가 파싱되지 않으면 `Invalid`를 표시하며 빨간색으로 변합니다.
- 메인 completion, fallback 모델 시도, batch mode 요청에 적용됩니다. 다른 요청 형태와 별도의 모델을 사용하는 image generation이나 guardrail 검사에는 적용되지 **않습니다**.
- `$` 표현식은 파싱 전에 해석되므로 `{"max_tokens": $prev.limit}`가 작동합니다. 이는 텍스트 치환이므로, 해석된 값에 큰따옴표나 줄바꿈이 포함되면 유효하지 않은 JSON이 되어 노드가 실패합니다.

## Example – Text

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Example – Batch text

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Example – Image generation

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

노드 속성에서 **Guardrails**를 활성화하면 LLM 호출 전에 안전하지 않은 사용자 메시지를 차단할 수 있습니다. 전체 레퍼런스는 [Guardrails](../reference/guardrails.md)를 참조하십시오.

## Related

- [Agent Node](./agent-node.md) – tool calling을 지원하는 LLM
- [Why Heym](../getting-started/why-heym.md) – 에이전트 라이프사이클에서 LLM 단계의 위치
- [Guardrails](../reference/guardrails.md) – 안전하지 않은 콘텐츠 카테고리 차단
- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [Expression DSL](../reference/expression-dsl.md) – Prompt에서 데이터 참조하기
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Prompt용 실시간 백엔드 미리보기를 제공하는 확장형 편집기
- [Credentials Tab](../tabs/credentials-tab.md) – LLM API 키 추가
- [Quick Start](../getting-started/quick-start.md) – 기본 LLM Workflow
