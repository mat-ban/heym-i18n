# 콘솔 로그

**Console Log** 노드는 값을 백엔드(서버) 콘솔에 기록합니다. 개발 중 디버깅 및 검사에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력 | 입력을 그대로 전달 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `label` | string | 노드 식별자 (camelCase) |
| `logMessage` | expression | 기록할 값. [expressions](../reference/expression-dsl.md)를 지원합니다. |

## 예시

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

출력은 서버 로그에 나타납니다 (예: `uvicorn` 실행 시 터미널 출력).

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Logs Tab](../tabs/logs-tab.md) – 애플리케이션 로그 보기
