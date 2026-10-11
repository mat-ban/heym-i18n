# SSE Streaming

Workflow는 SSE(Server-Sent Events)를 통해 실행 이벤트를 실시간으로 스트리밍할 수 있습니다.

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

이 Endpoint는 [Webhooks](./webhooks.md)에 문서화된 표준 execute Endpoint와 동일한 workflow 수준 인증, 속도 제한, 응답 캐싱 규칙을 사용합니다.

## cURL 대화 상자에서 SSE 활성화

편집기에서 **Run with cURL** 대화 상자를 열고 **SSE Streaming**을 활성화하십시오.

활성화하면 Heym은 다음을 수행합니다:

- 생성된 명령을 `/execute`에서 `/execute/stream`으로 전환합니다
- 스트리밍된 이벤트가 터미널 출력에 즉시 표시되도록 `--no-buffer`를 추가합니다
- `Accept: text/event-stream`을 추가합니다
- 대화 상자에서 직접 노드별 `node_start` 메시지를 구성할 수 있게 합니다

## 이벤트 프로토콜

각 SSE 프레임은 `data: ` 접두사가 붙은 줄바꿈으로 구분된 JSON입니다.

| 이벤트 유형 | 발생 시점 | 주요 필드 |
|------------|--------------------|------------|
| `execution_started` | 요청이 수락된 직후 | `execution_id`, `server_now_ms` |
| `node_start` | 노드가 실행을 시작하기 직전 | `node_id`, `node_label`, `started_at_ms`, 선택적 `message` |
| `node_retry` | 노드가 재시도할 때 | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | 노드가 완료된 후 | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Output 노드가 조기 반환할 때 | `node_label`, `output` |
| `execution_complete` | workflow가 종료된 후 | `status`, `outputs`, `execution_time_ms` |

## 노드별 시작 메시지

cURL 대화 상자는 SSE 설정을 workflow 자체에 저장합니다:

- **Send start**는 `node_start` 이벤트에 `message`를 포함할지 여부를 제어합니다
- **Start message**의 기본값은 `[START] {nodeLabel}`입니다
- 사용자 지정 메시지를 지우면 기본 텍스트로 대체됩니다
- `node_complete`는 항상 발생하며 항상 노드 출력을 포함합니다

저장된 구성 예시:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## cURL 예시

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

이벤트 스트림 예시:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## 보안 참고 사항

- `anonymous`, `jwt`, `header_auth` workflow는 일반 webhook Endpoint와 동일하게 동작합니다
- `cache_ttl_seconds`가 구성된 경우 응답 캐싱이 여전히 적용됩니다
- `rate_limit_requests`와 `rate_limit_window_seconds`가 구성된 경우 workflow 속도 제한이 여전히 적용됩니다
- `test_run`은 `/execute`에서와 마찬가지로 캐시와 속도 제한을 모두 우회합니다

## 관련 문서

- [Webhooks](./webhooks.md) – 표준 execute Endpoint 및 cURL 대화 상자
- [Parallel Execution](./parallel-execution.md) – 스트리밍이 Heym의 DAG 스케줄러에 통합되는 방식
- [Canvas Features](./canvas-features.md) – Run with cURL을 포함한 편집기 컨트롤
- [Security](./security.md) – 인증 및 시크릿 처리
