# 오류 처리기

**Error Handler** 노드는 Workflow 내 모든 노드에서 발생한 오류를 포착합니다. 이 노드가 존재하면, 어떤 노드가 실패할 때 자동으로 실행됩니다. 별도의 입력 연결이 필요하지 않으며, Workflow 엔진에 의해 트리거됩니다.

## Overview

| Property | Value |
|----------|-------|
| Inputs | 0 (트리거됨: 오류 발생 시) |
| Outputs | 1 |
| Output | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `message` | expression | 선택 사항. 기본값: `$error.message` |

## Error Context

Error Handler가 실행될 때 다음 필드를 사용할 수 있습니다:

| Field | Description |
|-------|-------------|
| `$errorHandler.error` | 오류 메시지 문자열 |
| `$errorHandler.errorNode` | 실패한 노드의 레이블 |
| `$errorHandler.errorNodeType` | 실패한 노드의 유형 |
| `$errorHandler.timestamp` | 오류가 발생한 시각 |

## Use Cases

- 실패 시 [Telegram](./telegram-node.md), [Slack](./slack-node.md), 또는 [Send Email](./send-email-node.md) 알림 전송
- 외부 시스템에 오류 로깅
- [Output](./output-node.md)을 통해 사용자 정의 오류 응답 반환

Workflow당 Error Handler는 하나만 사용할 수 있습니다.

## Example

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

사용자 정의 오류 응답을 위해 Output에 연결:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

또는 알림을 위해 Slack에 연결:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Related

- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [Telegram Node](./telegram-node.md) – 오류 발생 시 알림
- [Slack Node](./slack-node.md) – 오류 발생 시 알림
- [Send Email Node](./send-email-node.md) – 이메일 경고
- [Throw Error Node](./throw-error-node.md) – 의도적 오류 발생
