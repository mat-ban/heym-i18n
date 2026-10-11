# MCP 호출 노드

**MCP Call** 노드는 LLM이 어떤 도구를 호출할지 결정하지 않고, 특정 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 도구를 직접 호출합니다. 호출할 도구를 정확히 알고 있으며 결정론적인 단일 단계 실행을 원할 때 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.result` |

## 사용 시점

다음과 같은 경우 MCP Call 노드를 사용하십시오:
- 설계 시점에 호출할 MCP 도구를 정확히 알고 있는 경우
- 도구 선택을 위해 LLM이 필요하지 않은 경우
- 단일 도구 호출에 대해 agent 노드 대신 가볍고 결정론적인 대안을 원하는 경우

LLM이 호출할 도구를 결정해야 하거나 다단계 추론이 필요한 경우에는 [Agent 노드](./agent-node.md)를 대신 사용하십시오.

> MCP Call 노드는 agent 노드에 도구로 연결할 수 **없습니다**.

## 연결 구성

이 노드는 단일 MCP 서버에 연결합니다. transport를 선택하고 해당 필드를 입력하십시오.

### SSE / Streamable HTTP

| 필드 | 설명 |
|-------|-------------|
| `transport` | `sse` 또는 `streamable_http` |
| `url` | MCP 서버의 전체 URL (예: `https://mcp.example.com/sse`). DSL 표현식을 지원합니다. |
| `headers` | HTTP 헤더의 JSON 객체 (예: `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | 연결당 타임아웃(초) (기본값: 30) |

### stdio

| 필드 | 설명 |
|-------|-------------|
| `transport` | `stdio` |
| `command` | 실행할 실행 파일 (예: `npx`) |
| `args` | 인수의 JSON 배열 (예: `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | 환경 변수의 JSON 객체 (예: `{"API_KEY": "..."}`) |
| `timeoutSeconds` | 연결당 타임아웃(초) (기본값: 30) |

## 도구 선택

1. 연결 필드를 입력합니다.
2. **Fetch Tools**를 클릭합니다 — 노드가 MCP 서버에 연결하여 사용 가능한 도구를 나열합니다.
3. 드롭다운에서 도구를 선택합니다.

**도구 선택은 필수입니다.** 도구를 선택하지 않으면 노드가 실행되지 않습니다.

## 인수

도구를 선택하면 노드가 도구의 입력 스키마에 정의된 각 인수에 대해 입력 필드를 하나씩 렌더링합니다. 각 필드는 다음을 허용합니다:
- 정적 값: `10`
- DSL 표현식: `$userInput.body.text`

필수 인수는 `*`로 표시됩니다.

## 출력

| 필드 | 설명 |
|-------|-------------|
| `$nodeLabel.result` | 도구 결과. 응답이 유효한 JSON이면 파싱된 객체입니다. 그렇지 않으면 문자열입니다. |

## 예시

SSE MCP 서버에서 `search` 도구를 호출하여 사용자의 쿼리를 전달합니다:

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

다운스트림에서 결과에 접근합니다:

```
$searchCall.result.items   ← result가 JSON 객체인 경우
$searchCall.result         ← result가 일반 문자열인 경우
```

## 참고 사항

- 노드는 도구를 호출하기 전에 `url`, `headers`, `env` 및 모든 `toolArguments` 값의 DSL 표현식을 해석합니다.
- 노드 수준의 `timeoutSeconds`는 전체 실행에 적용되며, `connection.timeoutSeconds`는 MCP 세션 자체에 적용됩니다.
- MCP 서버를 사용할 수 없거나 오류를 반환하면 노드가 실패하며, 오류 메시지는 workflow trace에서 확인할 수 있습니다.
