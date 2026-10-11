# 변수

**Variable** 노드는 `$vars.variableName`(워크플로우 로컬) 또는 `$global.variableName`(영구)을 통해 모든 노드에서 접근할 수 있는 변수를 설정하거나 업데이트합니다. 카운터, 누적 목록, 워크플로우 전반의 공유 상태에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.value`, 또는 `$vars.variableName` / `$global.variableName`을 통해 접근 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `variableName` | string | 변수 이름 (`$vars.variableName` 또는 `$global.variableName`으로 사용됨). [예약어](../reference/expression-dsl.md)는 피하십시오. |
| `variableValue` | expression | 설정할 값. 표현식을 지원합니다. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | 타입 강제 변환 (기본값: auto) |
| `isGlobal` | boolean | `true`인 경우 [Global Variable Store](../reference/global-variables.md)에 저장됩니다(영구, 사용자 범위). `false`이거나 생략된 경우 워크플로우 로컬(인메모리)입니다. |

## 배열 변수

`.add()`를 사용하기 전에 Variable 노드에서 `$array()` 또는 `$array("a", "b")`로 배열을 초기화하십시오:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

그런 다음 항목을 추가하십시오 (괄호 안에 `$` 없이):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## 중요 규칙

**메서드 괄호 안에 절대 `$`를 사용하지 마십시오:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – 표현식이 깨집니다

## 예제 – 카운터

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Loop Node](./loop-node.md) – 루프 본문에서 Variable로 항목 수집
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, 예약어
- [Global Variables](../reference/global-variables.md) – `isGlobal`을 사용한 영구 변수
