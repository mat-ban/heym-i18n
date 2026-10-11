# 실행

**Execute** 노드는 다른 Workflow(하위 Workflow)를 호출하고 입력을 전달합니다. 재사용 가능한 로직에 사용하십시오. 데이터 변환에는 사용하지 마십시오. 데이터 변환에는 [Set](./set-node.md)을 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `executeWorkflowId` | UUID | 실행할 Workflow의 ID |
| `executeInput` | expression | 단일 입력 (입력 필드가 하나인 Workflow용) |
| `executeInputMappings` | array | 다중 입력용 `{ key, value }`. `key` = 대상 Workflow의 입력 필드 이름. |
| `executeDoNotWait` | boolean | `true`인 경우, 대기하지 않고 하위 Workflow를 백그라운드에서 디스패치합니다. 출력: `{ "status": "dispatched", "workflow_id": "..." }`. 기본값: `false`. |

## 응답 형식

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## 대기하지 않음

`executeDoNotWait: true`인 경우, 노드는 하위 Workflow를 백그라운드 스레드로 디스패치하고 즉시 반환합니다:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

상위 Workflow는 대기하지 않고 다음 노드로 계속 진행합니다. 하위 Workflow의 실행 기록은 완료 시 비동기적으로 trace에 기록됩니다. 하위 Workflow의 결과가 하위 단계에서 필요하지 않을 때 사용하십시오.

## 단일 입력

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## 다중 입력

대상 Workflow에 여러 입력 필드가 있는 경우 `executeInputMappings`를 사용하십시오:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

`key`는 대상 Workflow의 [Input](./input-node.md) `inputFields` 키와 일치해야 합니다.

## 관련 항목

- [Canvas Features](../reference/canvas-features.md) – 선택한 노드에서 Execute 노드를 생성하는 Extract to Sub-Workflow
- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Input Node](./input-node.md) – 대상 Workflow의 입력 필드
- [Set Node](./set-node.md) – 데이터 변환 (Workflow 호출 아님)
