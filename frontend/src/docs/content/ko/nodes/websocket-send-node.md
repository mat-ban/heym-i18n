# WebSocket 전송

**WebSocket Send** 노드는 외부 WebSocket 서버로 아웃바운드 클라이언트 연결을 열고, 메시지 하나를 전송한 뒤 연결을 닫습니다. Workflow가 Heym 소유의 소켓 Endpoint를 노출하지 않고 실시간 시스템으로 이벤트를 푸시해야 할 때 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `websocketUrl` | string / expression | 외부 `ws://` 또는 `wss://` URL |
| `websocketHeaders` | JSON object string / expression | 선택적 handshake 헤더 |
| `websocketSubprotocols` | string | 선택적 쉼표로 구분된 subprotocol 목록 |
| `websocketMessage` | expression | 전송할 Payload |

## 메시지 직렬화 규칙

- `websocketMessage`가 **string**으로 확인되면 Heym은 텍스트 프레임을 전송합니다.
- **object**, **array**, **number**, **boolean** 또는 `null`로 확인되면 Heym은 이를 JSON 텍스트로 직렬화합니다.
- **bytes**로 확인되면 Heym은 바이너리 프레임을 전송합니다.
- `$input`과 같은 전체 표현식은 직렬화 전에 원시 타입을 보존합니다.

## Output 필드

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.status` | 성공 시 `"sent"` |
| `$nodeLabel.url` | 확인된 대상 URL |
| `$nodeLabel.message_type` | `text`, `json` 또는 `binary` |
| `$nodeLabel.size_bytes` | 바이트 단위의 Payload 크기 |
| `$nodeLabel.subprotocol` | 존재하는 경우 협상된 subprotocol |
| `$nodeLabel.sent_at` | ISO 타임스탬프 |

## 예제 Workflow

**HTTP request → transform → publish over WebSocket**

```
input → set → websocketSend → output
```

- **Set**은 `{ "type": "user.updated", "user": $input.body }`와 같은 Payload 객체를 생성합니다.
- **WebSocket Send**는 `$payloadNode`를 `websocketMessage`로 사용합니다.
- **Output**은 `$socketSend.status`를 반환할 수 있습니다.

## 예제 노드 JSON

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## 참고 사항

- 이 노드에는 [credential](../reference/credentials.md)이 필요하지 않습니다.
- 원격 서버가 인증 또는 테넌트 헤더를 요구하는 경우 `websocketHeaders`를 통해 전달하십시오.
- 원격 시스템이 소켓 기반이 아닌 요청/응답 기반인 경우 [HTTP](./http-node.md)를 사용하십시오.

## Egress 안전성

- 기본적으로 URL은 `ws://` 또는 `wss://`를 사용해야 하며 공용 주소로만 확인되어야 합니다. Loopback, private, link-local, multicast 및 cloud-metadata 대상은 차단됩니다.
- Heym은 확인된 모든 주소를 검증하고 해당 주소 중 하나에 직접 연결합니다. 가드가 활성화된 동안 환경 프록시와 WebSocket 리다이렉트는 비활성화됩니다.
- `Authorization`, `Origin`, `User-Agent` 및 사용자 정의 데이터 헤더가 지원됩니다. `Origin`은 WebSocket 클라이언트의 전용 옵션을 통해 전송됩니다. `Host`, `Connection`, `Upgrade` 및 `Sec-WebSocket-*` 헤더는 재정의할 수 없습니다.
- 의도적으로 내부 서비스에 연결하는 신뢰할 수 있는 자체 호스팅 배포에서는 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`를 설정할 수 있습니다. 호스팅 또는 멀티 테넌트 배포에서는 기본값을 유지하십시오.

**v0.0.105 업그레이드 참고 사항:** 이 인스턴스 전역 정책은 이제 Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, 사용자 정의 LLM 실행 및 모델 검색, AI 어시스턴트, guardrails 및 RAG embeddings에서 사용되는 credential 파생 대상도 보호합니다. Loopback, private 또는 link-local 주소를 가리키는 기존 credential은 신뢰할 수 있는 자체 호스팅 인스턴스에서 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`가 활성화되지 않는 한 거부됩니다. 가드가 켜져 있는 동안 가드된 HTTP 클라이언트는 `HTTP_PROXY` 및 `HTTPS_PROXY`를 무시합니다. 옵트아웃을 활성화하면 이들이 복원됩니다. `SSL_CERT_FILE` 또는 `SSL_CERT_DIR`을 통해 구성된 운영자 CA 번들은 계속 지원됩니다. ClickHouse는 연결이 열리기 전에 검사되지만 clickhouse-connect가 자체 urllib3 transport를 사용하기 때문에 dial 시점에 고정되지는 않습니다.

## 관련 항목

- [WebSocket Trigger](./websocket-trigger-node.md) – 외부 소켓을 수신하고 이벤트 발생 시 Workflow를 트리거합니다.
- [Node Types](../reference/node-types.md) – 통합 노드 개요
- [Expression DSL](../reference/expression-dsl.md) – 동적 JSON Payload 빌드
- [Third-Party Integrations](../reference/integrations.md) – Credential 기반 vs 직접 구성 통합
