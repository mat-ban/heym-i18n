# 병합

**Merge** 노드는 여러 병렬 입력을 기다린 후 이를 단일 출력으로 결합합니다. 병렬 분기의 결과를 이어가기 전에 결합해야 할 때 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | n (구성 가능) |
| 출력 | 1 |
| 출력 | `$nodeLabel.merged` – 각 분기의 입력을 포함하는 객체 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `inputCount` | number | 대기할 입력 수 (기본값: 2) |

## 사용 시기

- 병렬 분기의 결과를 **결합**하거나 **조인**해야 할 때 사용하십시오
- 별도의 [Output](./output-node.md) 노드로 끝나는 병렬 Workflow에는 사용하지 마십시오
- 각 입력 분기는 병합된 출력에 기여합니다

## 예제

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

여러 분기를 Merge 노드에 연결하십시오. 노드는 출력을 생성하기 전에 모든 입력을 기다립니다.

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Parallel Execution](../reference/parallel-execution.md) – 병렬 분기가 실행되는 방식
- [Workflow Structure](../reference/workflow-structure.md) – Edges 및 handles
