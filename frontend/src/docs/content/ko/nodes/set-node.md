# 값 설정

**Set** 노드는 입력 데이터를 변환하고 사용자 정의 출력에 매핑합니다. 대문자 변환, 부분 문자열, 연결, 난수 생성 및 모든 데이터 변환에 사용하십시오. Workflow 호출에는 사용하지 마십시오(이 경우 [Execute](./execute-node.md)를 사용하십시오).

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력 | 각 매핑 키에 대해 `$nodeLabel.keyName` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `mappings` | array | 키-값 쌍. 각 항목: `{ key, value }`이며 `value`는 [expression](../reference/expression-dsl.md)입니다 |

## Agent 도구 사용법

Set 노드가 캔버스 노드 도구로서 [Agent Node](./agent-node.md)에 연결된 경우, 각 매핑 값은 봇 아이콘으로 **agent-provided**로 표시할 수 있습니다. 표시된 매핑 값은 에이전트가 런타임에 채우는 도구 파라미터가 됩니다. 표시되지 않은 매핑은 노드 구성에 고정된 상태로 유지됩니다.

봇 아이콘은 Set 노드가 에이전트의 도구 핸들에 연결된 경우에만 나타납니다. 독립 실행형 Set 노드는 agent-provided 컨트롤을 표시하지 않습니다.

## 표현식 규칙

- 이전 노드 참조: `$nodeName.text`, `$nodeName.body.field`
- 함수 사용: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)`는 b를 제외합니다. `a > b`인 경우 오류가 발생합니다.
- 표현식 시작 부분에 `$`는 하나만 사용하십시오. 괄호 안에는 절대 사용하지 마십시오.
- 키로 출력에 접근: `$setNode.randomNumber`, `$setNode.text`

## 예제

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

다운스트림 노드는 `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`를 통해 접근합니다.

## 관련 항목

- [JSON output mapper](./json-output-mapper-node.md) – 동일한 매핑. 단독 터미널은 webhooks/runs에 대해 루트 JSON을 반환합니다
- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Execute Node](./execute-node.md) – Workflow 호출 (데이터 변환 아님)
- [Expression DSL](../reference/expression-dsl.md) – 함수 및 구문
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – 실시간 백엔드 미리보기 및 매핑용 Prev/Next가 있는 확장 가능한 편집기
