# Switch

**Switch** 노드는 값을 case와 매칭하여 실행을 서로 다른 경로로 라우팅합니다. N개의 case와 default를 지원합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | n (case당 하나 + default) |
| 출력 | 매칭된 분기로 입력을 전달 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `expression` | expression | 평가할 값 (예: `$input.category`) |
| `cases` | string[] | 매칭할 case 값 (예: `["case1", "case2", "case3"]`) |

## Edge Handle

- 각 case는 source handle을 가집니다 (인덱스 0, 1, 2, …)
- 매칭되지 않는 값에 대한 default handle

## 예제

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

`sourceHandle`을 case 인덱스(0, 1, 2) 또는 매칭되지 않는 값에 대한 default handle로 설정하여 edge를 연결하십시오.

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Condition Node](./condition-node.md) – If/else 분기
- [Expression DSL](../reference/expression-dsl.md) – 표현식 구문
