# 조건

**Condition** 노드는 if/else 표현식을 기반으로 Workflow를 분기합니다. 결과에 따라 true 또는 false 경로로 라우팅합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 2 (true, false) |
| 출력 | 선택된 분기로 입력을 전달 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `condition` | expression | JavaScript 유사 표현식 (예: `$input.text.length > 0`) |

## Edge Handle

- **Source handle `true`** – 조건이 truthy로 평가될 때
- **Source handle `false`** – 조건이 falsy로 평가될 때

## 표현식 연산자

지원: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` 등. [Expression DSL](../reference/expression-dsl.md)을 참조하십시오.

## 예시

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

서로 다른 분기로 라우팅하려면 `sourceHandle: "true"` 또는 `sourceHandle: "false"`로 Edge를 연결하십시오.

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Switch Node](./switch-node.md) – 값에 따른 다중 분기 라우팅
- [Expression DSL](../reference/expression-dsl.md) – 조건 구문
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – 조건에 대한 실시간 백엔드 미리보기를 제공하는 확장 가능한 편집기
