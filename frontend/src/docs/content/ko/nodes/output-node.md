# 출력

**Output** 노드는 호출자에게 응답을 반환하는 Workflow의 종단점입니다. 항상 이전 노드를 label로 참조하십시오—`$input`은 절대 사용하지 마십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 (선택 사항, 비동기 후처리용) |
| 출력값 | 호출자에게 `message` 반환 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `message` | expression | 출력값. **반드시** 이전 노드를 참조해야 합니다: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | true인 경우, output 이후의 노드들이 응답 전송 후 비동기적으로 실행됩니다 |

## Agent tool 사용

Output 노드가 캔버스 노드 도구로서 [Agent Node](./agent-node.md)에 연결된 경우, `message` 필드는 봇 아이콘과 함께 **agent-provided**로 표시될 수 있습니다. 그러면 Agent가 도구를 호출할 때 message를 제공합니다. Output 노드가 Agent 도구로 연결되지 않은 경우 봇 아이콘은 숨겨집니다.

## 핵심 규칙

**Output 노드에서는 `$input`을 절대 사용하지 마십시오.** 항상 이전 노드의 label을 사용하십시오:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (`processData`가 이전 노드의 label인 경우)

## 비동기 후처리

`allowDownstream: true`인 경우, 응답은 즉시 반환됩니다. Output 이후에 연결된 노드들은 백그라운드에서 실행됩니다(예: Slack 알림, 로깅). 다운스트림 tail이 나중에 완료될 수 있으므로, 다운스트림 실패는 조기 응답이 이미 반환된 후에도 기록된 실행 상태를 `error`로 변경할 수 있습니다. 최종 이력 및 분석에는 이 나중의 결과가 반영됩니다.

## 예시

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## 예시 – 비동기 사용

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

그런 다음 Output 이후에 [Telegram](./telegram-node.md), [Slack](./slack-node.md) 또는 기타 노드를 연결하여 fire-and-forget 알림을 구성하십시오.

## 관련 항목

- [JSON output mapper](./json-output-mapper-node.md) – 단독 종단점일 때 `result` 래핑 없는 루트 JSON body
- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Expression DSL](../reference/expression-dsl.md) – 노드 출력 참조
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – message에 대한 실시간 백엔드 미리보기가 있는 확장 가능한 편집기
- [Workflow Structure](../reference/workflow-structure.md) – JSON 형식
