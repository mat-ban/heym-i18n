# 노드 활성화

**Enable Node** 노드는 다른 노드를 다시 켭니다. 실행되면 대상 노드의 `active`를 `true`로 설정하고 변경 사항을 영구적으로 저장합니다. 이는 [Disable Node](./disable-node.md)의 반대 역할을 합니다. [Cron](./cron-node.md) Trigger나 꺼져 있던 노드를 다시 활성화할 때 사용하십시오.

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `targetNodeLabel` | string | 활성화할 노드의 레이블 (예: `hourlyCheck`) |

## Behavior

- 대상은 active로 저장되므로 이후 실행 및 Trigger에서 해당 상태가 반영됩니다. 다시 활성화된 Cron Trigger는 다음 예약 시간에 다시 실행됩니다.
- 대상이 Enable Node의 하위에 있고 아직 실행되지 않았다면, 현재 실행에서도 함께 실행됩니다.
- 이미 active 상태인 노드를 활성화해도 아무 변화가 없으며, 출력은 여전히 `enabled: true`를 보고합니다.
- `targetNodeLabel`이 비어 있거나 해당 레이블을 가진 노드가 없으면 오류와 함께 실패합니다.

## Use Case

[Cron](./cron-node.md) Trigger를 필요할 때 시작하십시오. Cron 노드를 꺼진 상태로 저장하고, 워크플로우에 [Input](./input-node.md) Trigger와 같은 두 번째 진입점을 추가하십시오. 해당 진입점으로의 요청이 Enable Node를 실행하면 Cron이 작동하기 시작합니다.

꺼져 있는 Trigger는 스스로 실행을 시작하지 않으므로, Enable Node는 실행 가능한 진입점 뒤에 위치해야 합니다.

## Example

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

흐름: Input → Enable Node (target: cron) → Output. Cron 노드 `hourlyCheck`는 동일한 워크플로우에서 disabled 상태로 저장되며, 활성화되면 자체 HTTP 검사 분기를 실행합니다.

## Related

- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [Disable Node](./disable-node.md) – 워크플로우 내부에서 노드를 끄기
- [Cron Node](./cron-node.md) – 활성화할 Trigger
- [Condition Node](./condition-node.md) – 활성화 전 분기
- [Canvas Features](../reference/canvas-features.md) – 수동으로 노드를 활성화 또는 비활성화
