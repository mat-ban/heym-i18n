# JSON 출력 매퍼

**JSON output mapper** 노드는 key/value [mappings](./set-node.md)([Set](./set-node.md)과 동일한 모델)로부터 JSON 객체를 생성합니다. 호출자가 응답의 루트에서 **일반 JSON body**를 수신해야 하는 경우에 사용하십시오.

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 0 (sink) |
| Runtime output | Object built from `mappings` |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` 항목 (Set과 동일) |

## Agent tool usage

지원되지 않습니다. 이 노드는 터미널 sink이므로 [Agent Node](./agent-node.md) tools handle에 연결할 수 없습니다. 에이전트가 대화 중간에 값을 구성해야 하는 경우에는 [Set](./set-node.md) 노드를 사용하십시오.

## Webhook and run behavior

이 노드가 워크플로우의 **유일한** 터미널 출력인 경우, 실행 **outputs**는 매핑된 객체 자체입니다. 즉, `mappings`의 key가 JSON의 **최상위 레벨**에 나타납니다. 노드 label로 키가 지정된 외부 래퍼나 `{ "result": ... }` 객체는 **없습니다** ([Output](./output-node.md) 노드와 다름).

여러 터미널 노드가 출력을 생성하는 경우(예: [Output](./output-node.md)과 JSON output mapper, 또는 여러 분기), Heym은 일반적인 형태를 사용합니다. 즉, 각 터미널은 해당 `label`로 키가 지정됩니다.

## Loop restriction

[Output](./output-node.md)과 동일한 규칙입니다. 이 노드를 루프 반복 분기 내부에 배치하지 마십시오. 루프의 `done` 분기 이후에만 배치하십시오. [Loop](./loop-node.md)를 참조하십시오.

## Example

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Related

- [Set](./set-node.md) – 중간 변환을 위한 동일한 매핑 메커니즘
- [Output](./output-node.md) – `result` 래핑을 사용하는 메시지 또는 스키마 기반 응답
- [Node Types](../reference/node-types.md) – 모든 노드 유형
- [Workflow Structure](../reference/workflow-structure.md) – JSON 워크플로우 형식
- [Webhooks](../reference/webhooks.md) – Execute endpoint 및 응답
