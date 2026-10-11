# Webhooks

Workflow는 HTTP webhook을 통해 Trigger할 수 있습니다. 표준 execute Endpoint는 JSON을 반환하며, 스트리밍 변형은 Server-Sent Events(SSE)를 반환합니다.

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

`{workflow_id}`를 workflow UUID로 교체하십시오. 기본 URL은 사용자의 Heym 인스턴스입니다(예: `https://app.heym.ai`).

## 요청 메서드

각 workflow는 하나의 HTTP verb를 허용하며, 편집기의 cURL 대화상자에서 선택합니다: `GET`, `POST`, `PUT`, `DELETE`. **`POST`가 기본값**이며, 이 설정이 존재하기 전에 생성된 모든 workflow는 이를 유지하므로 현재 작동하는 것은 아무것도 변경되지 않습니다.

다른 verb로 workflow를 호출하면 `405 Method Not Allowed`가 반환되며, `Allow` 헤더에 설정된 verb가 명시됩니다:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

한 가지 예외가 있습니다: `?test_run=true`를 포함한 요청은 이 검사를 건너뜁니다. 이는 편집기의 **Run** 버튼과 디버그 패널이 전송하는 요청이므로, `GET`으로 설정된 workflow도 제품 내부에서 테스트할 수 있습니다.

### Bodyless 메서드

`GET`과 `DELETE`는 요청 body를 포함하지 않습니다. 대신 입력은 query string에서 가져오며, `$input.query.<name>`으로 읽습니다:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL 대화상자는 이 두 메서드에 대해 요청 body 편집기를 숨기고 `Content-Type` 헤더를 제거합니다.

`GET`을 [HTML output mapper](../nodes/html-output-mapper-node.md)와 함께 사용하면 브라우저에서 직접 열 수 있는 페이지를 제공할 수 있습니다.

## 스트리밍 Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

단일 JSON 응답 대신 증분 실행 이벤트를 원할 때 스트리밍 Endpoint를 사용하십시오. 이벤트 프로토콜과 노드별 시작 메시지 구성은 [SSE Streaming](./sse-streaming.md)을 참조하십시오.

## 요청 형식

요청 body는 [Input](../nodes/input-node.md) 노드에 `body`로 전달됩니다. Heym은 두 가지 요청 형식을 모두 허용합니다:

- **Raw JSON** – 예: `{"userId": "123", "action": "create"}`
- **Wrapped 형식** – `{"inputs": {...}, "test_run": false}`

Wrapped 형식을 사용하는 경우, `inputs`가 추출되어 `body`로 전달됩니다. `test_run`은 rate limiting과 응답 캐싱을 우회합니다. Raw JSON을 POST할 때 query 파라미터로 `?test_run=true`를 전송할 수도 있습니다.

## 요청 Body 모드

각 workflow에는 편집기가 샘플 요청을 구성하는 방식을 제어하는 `webhook_body_mode` 설정이 있습니다:

| 모드 | 동작 |
|------|----------|
| **defined** | 편집기와 cURL 대화상자가 workflow의 Input 노드 필드로부터 예제 body를 구성하고 JSON Payload에 빈 키를 유지합니다. 기존 defined 스타일 cURL Payload는 계속 작동합니다. |
| **generic** | 편집기와 cURL 대화상자가 자유 형식 JSON body를 사용합니다. 요청 body는 그대로 전달되므로 외부 앱이 자체적으로 고정된 Payload 형식을 전송할 수 있습니다. |

실행 API는 두 모드 모두에서 하위 호환성을 유지합니다. Raw JSON과 wrapped `{ "inputs": ... }` 요청은 어느 쪽이든 계속 허용됩니다.

헤더와 query 파라미터는 표현식에서 `$input.headers`와 `$input.query`로 사용할 수 있습니다. 헤더 키는 소문자로 변환됩니다.

## 인증

편집기(workflow 설정)에서 workflow별로 구성합니다. 인증은 실행 전에 확인됩니다.

| auth_type | 동작 |
|-----------|----------|
| **anonymous** | 인증이 필요하지 않습니다. 누구나 Endpoint를 호출할 수 있습니다. |
| **jwt** | Bearer Token이 필요합니다. 사용자 세션 Token(사용자가 workflow 접근 권한을 보유해야 함) 또는 이 workflow를 위해 생성된 범위 지정 [Execution Token](./execution-tokens.md)을 허용합니다. |
| **header_auth** | 사용자 정의 헤더가 일치해야 합니다. `auth_header_key`(예: `X-API-Key`)와 `auth_header_value`를 설정하십시오. |

`header_auth`의 경우, 요청 헤더 값이 구성된 값과 정확히 일치해야 합니다. workflow 접근 권한이 있는 JWT 사용자는 사용자 정의 헤더 없이도 호출할 수 있습니다.

`jwt`의 경우, [Execution Token](./execution-tokens.md)이 외부 시스템에서 workflow를 호출하는 권장 방식입니다 — 단일 workflow로 범위가 지정되며 독립적으로 폐기할 수 있습니다.

## 응답 캐싱

workflow별로 `cache_ttl_seconds`를 구성합니다. 설정되어 있고 0보다 큰 경우:

- **Cache key**: `workflow_id` + `body` + `query`의 SHA256 해시
- **Cache hit**: `status: "cached"`와 캐시된 출력과 함께 즉시 반환
- **Cache set**: 성공적인 실행(`status: "success"`) 이후에만
- **Storage**: Postgres 기반이며 백엔드 worker 간에 공유됨

| 설정 | 효과 |
|---------|--------|
| `cache_ttl_seconds` = 0 또는 null | 캐싱 비활성화 |
| `cache_ttl_seconds` > 0 | 이 시간(초) 동안 응답 캐시됨 |

`test_run` 요청은 캐시를 우회합니다(읽기 없음, 쓰기 없음).

cURL 대화상자에서 응답 캐싱이 활성화된 경우, **Clear cache**는 현재 workflow의 캐시된 응답을 즉시 제거합니다.

## Rate Limiting

workflow별로 구성합니다: `rate_limit_requests`와 `rate_limit_window_seconds`.

- **Scope**: `workflow_id` + 클라이언트 IP별(슬라이딩 윈도우)
- **초과 시**: `Retry-After` 헤더와 함께 HTTP 429
- **헤더**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| 설정 | 설명 |
|---------|-------------|
| `rate_limit_requests` | 윈도우 내 허용되는 최대 요청 수 |
| `rate_limit_window_seconds` | 윈도우 지속 시간(초) |

`test_run` 요청은 rate limiting을 우회합니다.

## 응답 형식

Endpoint는 JSON을 반환합니다:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| 필드 | 설명 |
|-------|-------------|
| `workflow_id` | Workflow UUID |
| `status` | `success`, `error`, `cached` 또는 `rate_limited` |
| `outputs` | 종료 노드의 출력입니다. 단일 [JSON output mapper](../nodes/json-output-mapper-node.md)만이 유일한 종료 노드인 경우, 응답 본문은 최상위 레벨에서 해당 매핑된 객체입니다(기본 단순 JSON 응답). 그렇지 않으면 [Output](../nodes/output-node.md) 및 기타 종료 노드가 레이블을 키로 하여 포함됩니다. |
| `execution_time_ms` | 실행 시간(밀리초)입니다(cached/rate_limited의 경우 0). |

오류 발생 시 `outputs`에 오류 세부 정보가 포함될 수 있습니다. [Throw Error](../nodes/throw-error-node.md) 노드는 사용자 지정 HTTP 상태 코드(4xx/5xx)를 설정할 수 있습니다.

## cURL로 실행 대화상자

**Run with cURL** 툴바 버튼(편집기 우측 상단, `cURL` 아이콘)은 현재 Workflow에 대해 즉시 실행 가능한 cURL 명령을 생성하고 복사하는 대화상자를 엽니다.

### 기능 설명

| 필드 | 설명 |
|-------|-------------|
| **Request Body Mode** | **Defined** 또는 **Generic**을 선택합니다. Generic은 Input 필드로부터 본문을 구성하지 않고 원시 JSON으로 유지합니다. |
| **Authentication** | Anonymous, JWT Token 또는 Header Auth를 선택합니다. 명령에 올바른 인증 헤더를 설정합니다. JWT Token을 선택하면 대화상자에 [Execution Token](./execution-tokens.md) 관리자가 표시되며, Token을 생성하거나 선택하여 명령에 직접 포함할 수 있습니다. |
| **Header Key / Value** | Header Auth를 선택한 경우 표시됩니다. Workflow의 인증 설정에서 미리 채워집니다. |
| **Response Cache** | 동일한 응답을 캐시할 시간(분)입니다(0 = 비활성화). 변경 사항은 Workflow에 저장됩니다. 활성화된 경우 **Clear cache**를 통해 캐시된 응답을 즉시 제거할 수 있습니다. |
| **Rate Limit** | 시간 창당 최대 요청 수입니다. 변경 사항은 Workflow에 저장됩니다. |
| **SSE Streaming** | 명령을 `/execute/stream`으로 전환하고 `--no-buffer`를 추가하며, 노드별 `node_start` 메시지 설정을 노출합니다. |
| **Body** | JSON 요청 본문입니다. Defined 모드에서는 [Input](../nodes/input-node.md) 필드에서 미리 채워지며 빈 키를 유지합니다. Generic 모드에서는 원시 JSON 편집기입니다. |
| **Command** | 전체 cURL 명령의 읽기 전용 미리보기입니다. |

**Copy cURL**을 클릭하여 명령을 클립보드에 복사하십시오.

### 예시

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Generic 모드에서는 중첩된 Payload가 그대로 유지됩니다. 예를 들어:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

대화상자는 Workflow에 저장된 인증, 본문 모드, 캐싱 및 Rate Limit 설정을 반영합니다. 여기서 편집하면 Workflow가 즉시 업데이트됩니다.

### 대화상자의 SSE Streaming

터미널에서 생성된 명령이 실행을 실시간으로 추적하도록 하려면 **SSE Streaming**을 활성화하십시오.

- Endpoint가 `/execute`에서 `/execute/stream`으로 변경됩니다.
- 명령에 `--no-buffer`와 `Accept: text/event-stream`이 추가됩니다.
- 각 비-sticky 노드가 목록에 표시되며 다음을 수행할 수 있습니다:
  - `node_start` 메시지를 활성화 또는 비활성화합니다.
  - 시작 메시지 텍스트를 사용자 지정합니다.
- `node_complete` 이벤트는 항상 발생하며 전체 노드 출력을 포함합니다.

예시:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

전체 이벤트 프로토콜과 예시는 [SSE Streaming](./sse-streaming.md)을 참조하십시오.

## Trigger Source 태깅

모든 실행은 [Execution History](./execution-history.md)에 표시되는 `trigger_source` 레이블을 저장합니다. 원하는 값을 `X-Trigger-Source` 헤더로 전송하여 설정하십시오:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

편집기 대화상자의 **Copy cURL** 버튼은 `X-Trigger-Source: API`를 자동으로 포함합니다. `API`를 `scheduler`, `rabbitmq`, `github-actions` 등 의미 있는 값으로 대체할 수 있습니다.

헤더를 전송하지 않으면 `trigger_source`는 기본값 `"API"`가 되며, 기록에서 실행은 **API**로 레이블됩니다. 시스템에 의미 있는 값(`scheduler`, `github-actions`, `rabbitmq` 등)으로 재정의하십시오.

## 관련 항목

- [Execution Tokens](./execution-tokens.md) – 외부 시스템에서 Workflow를 호출하기 위한 범위 지정 JWT
- [SSE Streaming](./sse-streaming.md) – Server-Sent Events를 통해 노드 이벤트를 실시간으로 스트리밍
- [Triggers](./triggers.md) – Webhook을 포함한 모든 Workflow 진입점
- [Workflow Structure](./workflow-structure.md) – 노드와 엣지
- [Expression DSL](./expression-dsl.md) – `$input.body`, `$input.headers`, `$input.query` 접근
