# 루프

**Loop** 노드는 배열을 순회하며 각 항목마다 다운스트림 노드를 실행합니다. 다음 반복으로 진행하려면 반복 본문의 마지막 노드에서 되돌아오는 back-connection이 필요합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 2개 (default + loop back) |
| 출력 | 2개 (loop, done) |
| 출력값 | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `arrayExpression` | expression | 배열로 평가되는 표현식 (예: `$input.items`) |

## Edge Handle

- **Source `loop`** – 각 항목을 처리하는 노드에 연결됩니다 (반복마다 실행)
- **Source `done`** – 모든 반복이 완료된 후 실행되는 노드에 연결됩니다
- **Target default** – 배열을 포함한 초기 데이터를 수신합니다
- **Target `loop`** – 반복 본문의 마지막 노드로부터 back-connection을 수신합니다

## Loop Context (반복 본문 내)

- `$loopNode.item` – 현재 항목
- `$loopNode.index` – 0부터 시작하는 인덱스
- `$loopNode.total` – 전체 항목 수
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## 중요 규칙

1. **Back-connection 필수:** 반복 본문의 마지막 노드는 반드시 loop의 `loop` 입력 handle로 다시 연결되어야 합니다.
2. **Loop 본문 내 출력 금지:** [Output](./output-node.md) 노드는 loop 본문 내에서 사용할 수 없습니다. 중간 결과에는 [Set](./set-node.md) 또는 [Variable](./variable-node.md)을 사용하십시오.
3. **자동 결과 수집 없음:** loop는 결과를 수집하지 않습니다. 결과를 누적하려면 `$array()`와 `.add()`를 사용하는 Variable 노드를 활용하십시오.

## 예시

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

흐름: loop → 처리 노드 → (loop로 복귀) → loop → done 분기 → output.

## 관련 문서

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Variable Node](./variable-node.md) – loop 내에서 항목 수집
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, 배열 메서드
