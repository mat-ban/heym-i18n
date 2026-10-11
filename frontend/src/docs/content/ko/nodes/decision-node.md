# 의사 결정

**Decision** 노드는 실행의 현재 상태에 대해 결정 모델에 유형이 지정된 질문을 던지고 확률을 반환합니다. 텍스트를 생성하지는 않습니다. Workflow가 분기할 수 있는 판단이 필요할 때 사용하십시오 — 라우팅, 분류, 순위 지정, 검증, 또는 되돌릴 수 없는 단계의 게이팅 등이 이에 해당합니다.

결정 모델(*System One* 모델이라고도 함)은 LLM과는 다른 종류의 모델입니다. Prompt도, 시스템 지시도, temperature도, 도구 호출도 없습니다. **state**와 **questions** 맵을 보내면 각 답변이 확률 분포를 동반한 숫자로 돌아옵니다. 답변이 몇 개의 Token에 불과하기 때문에, [LLM](./llm-node.md)에 JSON 생성을 요청하고 파싱하는 것보다 이 모델들이 빠르고 저렴합니다.

텍스트 생성에는 [LLM](./llm-node.md) 노드를 사용하십시오. 도구를 호출하는 모델에는 [Agent Node](./agent-node.md)를 사용하십시오.

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | 제공자 응답 원문 — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | *Decision Model* credential입니다. LLM credential이 아닙니다. |
| `model` | string | 모델 이름, 예: `jev-latest` |
| `state` | expression | 모델이 읽어야 할 대상 (기본값 `$input.text`) |
| `questions` | array | 순서가 지정된 질문 행, 최소 하나 이상 |
| `customBodyEnabled` | boolean | 폼 대신 직접 작성한 요청 본문을 전송 |
| `customBody` | expression (JSON) | 토글이 켜져 있을 때 전송할 본문 |
| `requestTimeoutSeconds` | number | 최대 대기 시간(초) (기본값: 60) |

### State

**State**는 모델이 판단하는 상황입니다. 문자열, 객체 또는 배열을 받습니다.

정확히 하나의 표현식을 담은 필드는 자체 타입을 유지하므로, `$input`은 텍스트가 아닌 객체 자체를 전송합니다. 표현식이 내부에 포함된 템플릿(`Ticket: $input.text`)은 문자열로 해석됩니다. 각 질문에 답할 수 있을 만큼 충분한 정보를 제공하십시오: 원본 텍스트, 식별자, 관계, 정책, 현재 사실 등입니다.

## Question types

각 질문에는 `id`, `type`, `instructions`, 그리고 타입에 따라 달라지는 기준이 있습니다.

`id`는 Workflow가 답변을 다시 읽는 방식입니다. 이 값은 **모델에 전송되지 않으므로**, 전체 의미가 `instructions`에 담겨야 합니다. `id: is_urgent`에 `instructions: "Is it?"`라고 작성하면 모델이 활용할 수 있는 정보가 없습니다.

### Noul

조건이 성립하는지 여부입니다. 답변이 yes일 확률을 0에서 1 사이로 반환합니다.

기준은 선택 사항입니다: **Yes means**와 **No means**는 각 측면이 무엇을 포괄하는지 설명합니다. 0.5에 가까운 값은 모델이 yes와 no를 거의 동등하게 본다는 의미이며, "중간 강도"가 아닙니다.

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

`$triage.answers.is_urgent.noul`로 읽습니다.

### Choice

사용자가 정의한 집합에서 하나의 옵션을 선택합니다. 선택된 옵션, 전체 분포, 그리고 그로부터 도출된 confidence를 반환합니다.

아무것도 해당하지 않을 수 있는 경우에는 항상 "none of these"를 포괄하는 옵션을 추가하십시오 — 모델은 제공하지 않은 옵션을 선택할 수 없습니다.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

`$triage.answers.department.choice`, `.probabilities.billing`, `.confidence`로 읽습니다.

### Score

순서가 지정된 rubric에 따라 상태를 평가합니다. 레벨 **사이**에 위치할 수 있는 확률 가중치 값과 함께 legend 및 분포를 반환합니다.

레벨은 가장 낮은 것부터 시작하며, 최소 두 개에서 최대 열 개입니다. 각 레벨은 구체적인 상황을 설명하고 독립적으로 성립해야 합니다.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

`$triage.answers.frustration.score`, `.legend`, `.confidence`로 읽습니다.

## Generate with AI

**Generate with AI**는 평범한 문장을 제안된 state 템플릿과 질문 행 집합으로 변환합니다. 판단하고자 하는 내용을 설명하십시오 — "triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds" — 그리고 노드에 추가하기 전에 반환된 결과를 검토하십시오.

초안 작성은 LLM이 수행하므로, 대화 상자에서 LLM credential을 요청합니다. 결정 모델은 Workflow가 실행될 때 나중에 질문에 답합니다. 생성된 id는 노드가 이미 보유한 행에 대해 중복 제거되므로, 두 번 생성해도 기존 답변 키를 덮어쓰지 않습니다.

각 생성은 노드 자체가 실행 시점에 기록하는 `decision.systemone` trace와 함께 [Traces](../tabs/traces-tab.md) 탭의 **Decision Questions** 소스에 기록됩니다.
## Custom request body

**Custom request body**를 켜면 폼 대신 직접 작성한 JSON을 전송합니다. 폼이 구성하는 계약과 다른 계약을 사용하는 Endpoint에 사용하십시오.

편집기는 현재 폼을 기반으로 초기화되며, 그 안의 표현식은 요청이 전송되기 전에 해석됩니다. 토글이 켜져 있는 동안에는 State 필드와 질문 행이 무시됩니다. 응답은 어느 쪽이든 변경 없이 그대로 전달되므로, 다른 계약은 표현식이 읽을 수 있는 형태만 다르게 만들 뿐입니다.

## Output

노드는 제공자가 반환한 것을 그대로 반환합니다. 이름이 바뀌거나 평탄화되는 것은 없습니다.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## 답변에 따른 분기

[Switch](./switch-node.md) 노드는 선택된 옵션에 따라 라우팅하며, [Condition](./condition-node.md) 노드는 신뢰도가 낮은 사례를 사람이 확인할 수 있는 곳으로 보낼 수 있습니다:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

타입이 지정된 답변은 형태를 보장할 뿐, 진실을 보장하지는 않습니다. 예제에서 숫자를 그대로 복사하지 말고, 자신의 데이터와 결과를 기준으로 임계값을 선택하십시오.

## Credential

[Credentials](../tabs/credentials-tab.md) 탭에서 **Decision Model** credential을 생성하십시오:

- **Base URL** — Endpoint이며, 예를 들어 `https://api.typesafe.ai`입니다. Heym은 `/v1/systemone`을 덧붙입니다.
- **API Key** — 선택 사항입니다. 키가 필요 없는 Endpoint는 비워 둘 수 있습니다.

credential을 편집할 때 키 필드를 비워 두면 저장된 키가 유지됩니다. 교체하려는 경우에만 다시 입력하십시오.

동일한 credential로 [Evals](../tabs/evals-tab.md) 실행을 판정할 수 있습니다. **LLM-as-Judge**를 선택한 상태에서 이를 judge로 선택하면, decision model이 모든 답변을 예상 출력과 비교하여 점수를 매깁니다.

Heym은 기본적으로 사설 및 loopback 주소로의 아웃바운드 요청을 차단하므로, `localhost`나 사설 대역에서 직접 실행하는 decision endpoint에는 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`가 필요합니다.

Decision model은 Heym이 동기화하는 LLM 가격표에 나타나지 않으므로, 이러한 호출에 대해 [Traces](../tabs/traces-tab.md)의 **Cost** 열은 비어 있습니다. Token 수는 여전히 기록되며, pricing override로 직접 가격을 추가할 수 있습니다.

## Errors

| 상황 | 발생하는 일 |
|-----------|--------------|
| 유효하지 않은 API key | 노드가 credential을 지목하는 메시지와 함께 실패합니다 |
| 잘못된 형식의 질문 | 제공자의 필드 수준 메시지가 노드 오류에 그대로 전달됩니다 |
| Rate limited 또는 과부하 | 노드가 일시적 조건이라는 메시지와 함께 실패합니다 — 이 노드에 [retry](../reference/features.md)를 켜서 견디십시오 |
| 중복되거나 비어 있는 질문 id | 요청이 전송되기 전에 노드가 실패합니다 |

## Related

- [LLM Node](./llm-node.md) – 판단 대신 텍스트를 생성합니다
- [Agent Node](./agent-node.md) – 도구로 증거를 수집한 뒤 여기서 판단합니다
- [Switch Node](./switch-node.md) – 선택된 옵션에 따라 라우팅합니다
- [Condition Node](./condition-node.md) – 신뢰도를 기준으로 게이트합니다
- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [Credentials](../reference/credentials.md) – Credential 유형과 필드
- [Traces Tab](../tabs/traces-tab.md) – decision 호출과 token 사용량을 검사합니다
