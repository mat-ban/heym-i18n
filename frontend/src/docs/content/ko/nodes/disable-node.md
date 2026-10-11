# 노드 비활성화

**Disable Node** 노드는 Workflow 내 다른 노드를 영구적으로 비활성화합니다. 실행되면 대상 노드의 `active`를 `false`로 설정하고 변경 사항을 영구 저장합니다. 조건이 충족된 후 Cron Trigger를 중지하는 것과 같은 일회성 작업에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `targetNodeLabel` | string | 비활성화할 노드의 Label (예: `hourlyCheck`) |

## 사용 사례

조건이 충족된 후 [Cron](./cron-node.md) Trigger를 비활성화하여 이후 Workflow 실행에서 더 이상 실행되지 않도록 합니다. 나중에 [Enable Node](./enable-node.md)로 다시 활성화할 수 있습니다.

## 예시

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

흐름: Cron → HTTP check → Condition (status complete?) → true인 경우: Disable Node (대상: cron) → Output.

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Enable Node](./enable-node.md) – 비활성화된 노드를 다시 활성화
- [Cron Node](./cron-node.md) – 비활성화할 Trigger
- [Condition Node](./condition-node.md) – 비활성화 전 분기 처리
