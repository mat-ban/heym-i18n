# 오류 발생

**Throw Error** 노드는 Workflow 실행을 즉시 중단하고 사용자 지정 HTTP 상태 코드와 함께 오류 응답을 반환합니다. 유효성 검사 실패, 인증되지 않은 접근 또는 기타 오류 상황에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 0 |
| 출력 결과 | Workflow 중단; 호출자에게 오류 응답 반환 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `errorMessage` | expression | 오류 메시지 (표현식 지원) |
| `httpStatusCode` | number | HTTP 상태 코드 (예: 400, 401, 403, 404, 429, 500) |

## 일반적인 상태 코드

| 코드 | 사용 사례 |
|------|----------|
| 400 | Bad Request (잘못된 입력) |
| 401 | Unauthorized (인증 필요) |
| 403 | Forbidden (접근 거부) |
| 404 | Not Found (리소스 없음) |
| 422 | Unprocessable Entity (유효성 검사 오류) |
| 429 | Too Many Requests (속도 제한) |
| 500 | Internal Server Error |

## 예시

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

[Condition](./condition-node.md)과 함께 사용하여 입력을 검증하고 유효하지 않은 경우에만 오류를 발생시키십시오:
- Condition true → Output으로 계속 진행
- Condition false → Throw Error

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Condition Node](./condition-node.md) – 오류 발생 전 검증
- [Error Handler](./error-handler-node.md) – 다른 노드의 오류 포착
