# WebSocket Trigger

**WebSocket Trigger** 노드는 외부 WebSocket 서버로 아웃바운드 클라이언트 연결을 열고, 선택한 소켓 이벤트가 발생하면 Workflow를 시작합니다. 시세 피드, 텔레메트리, 채팅 백플레인과 같은 이벤트 스트림에 사용하십시오. 내부 실시간 시스템에 연결하려면 아래에 설명된 private-URL opt-out이 필요합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 1 |
| 출력 | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## 중요 동작

- 이 노드는 **Heym에서 다른 WebSocket 서버로** 연결합니다.
- Heym에 WebSocket Endpoint를 노출하지 **않습니다**.
- [credential](../reference/credentials.md)이 필요하지 않습니다. URL, 헤더, subprotocol을 노드에서 직접 구성하십시오.
- 리더 워커가 백그라운드에서 연결을 유지하며, 활성화된 경우 재연결합니다.

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `websocketUrl` | string | 외부 `ws://` 또는 `wss://` URL |
| `websocketHeaders` | JSON object string | 선택적 handshake 헤더 |
| `websocketSubprotocols` | string | 선택적 쉼표로 구분된 subprotocol 목록 |
| `websocketTriggerEvents` | array | `onMessage`, `onConnected`, `onClosed` 중 하나 이상 |
| `retryEnabled` | boolean | 연결 해제 후 재연결 |
| `retryWaitSeconds` | integer | 재연결 전 대기 시간 |

## 발생 이벤트

### `onMessage`

원격 소켓에서 프레임이 도착하면 발생합니다.

유용한 필드:

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.message.data` | 파싱된 JSON Payload 또는 원시 메시지 값 |
| `$nodeLabel.message.text` | 사용 가능한 경우 UTF-8로 디코딩된 텍스트 |
| `$nodeLabel.message.base64` | base64로 인코딩된 바이너리 Payload |
| `$nodeLabel.message.sizeBytes` | Payload 크기 |
| `$nodeLabel.message.isJson` | 메시지가 JSON으로 파싱되었는지 여부 |

### `onConnected`

소켓이 성공적으로 열린 후 발생합니다.

유용한 필드:

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | 최초 연결 시 `false`, 이후 재연결 시 `true` |
| `$nodeLabel.connection.subprotocol` | 협상된 subprotocol |

### `onClosed`

설정된 연결이 닫힐 때 발생합니다.

유용한 필드:

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` 또는 `unknown` |
| `$nodeLabel.close.code` | WebSocket close code |
| `$nodeLabel.close.reason` | 종료 사유 |
| `$nodeLabel.close.wasClean` | 정상적인 `1000` 종료인 경우 `true` |
| `$nodeLabel.close.reconnecting` | 노드가 재연결을 시도할지 여부 |

## Trigger 시맨틱

- 하나의 활성 노드가 하나의 장기 유지 아웃바운드 소켓 연결을 유지합니다.
- 연결은 [IMAP Trigger](./imap-trigger-node.md) 및 [RabbitMQ](./rabbitmq-node.md) 수신 모드와 유사하게 리더 워커에서만 실행됩니다.
- 재연결이 활성화된 경우, Heym은 `retryWaitSeconds`만큼 대기한 후 연결이 끊긴 뒤 소켓을 다시 엽니다.
- 발생한 각 이벤트는 `trigger_source = "websocket"`으로 별도의 Workflow 실행을 생성합니다.

## Egress 안전

- 기본적으로 URL은 `ws://` 또는 `wss://`를 사용해야 하며, 공용 주소로만 확인되어야 합니다. Loopback, private, link-local, multicast, cloud-metadata 대상은 차단됩니다.
- Heym은 재연결할 때마다 DNS를 재검증하고, 확인된 모든 주소를 검증하며, 해당 주소 중 하나에 직접 연결합니다. 가드가 활성화된 동안 환경 프록시와 WebSocket 리다이렉트는 비활성화됩니다.
- 영구적인 정책 위반은 무한 재시도 대신 Trigger를 중지합니다. 일시적인 DNS 또는 네트워크 장애는 노드의 재시도 설정을 따릅니다.
- `Authorization`, `Origin`, `User-Agent` 및 사용자 정의 데이터 헤더가 지원됩니다. `Origin`은 WebSocket 클라이언트의 전용 옵션을 통해 전송됩니다. `Host`, `Connection`, `Upgrade`, `Sec-WebSocket-*` 헤더는 재정의할 수 없습니다.
- 내부 서비스에 의도적으로 연결하는 신뢰할 수 있는 자체 호스팅 배포에서는 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`를 설정할 수 있습니다. 호스팅 또는 멀티 테넌트 배포에서는 기본값을 유지하십시오.

**v0.0.105 업그레이드 참고:** 이 인스턴스 전역 정책은 이제 Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, 사용자 정의 LLM 실행 및 모델 검색, AI 어시스턴트, guardrails, RAG 임베딩에서 사용하는 credential 파생 대상도 보호합니다. Loopback, private 또는 link-local 주소를 가리키는 기존 credential은 신뢰할 수 있는 자체 호스팅 인스턴스에서 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`가 활성화되지 않는 한 거부됩니다. 가드가 켜져 있는 동안 가드된 HTTP 클라이언트는 `HTTP_PROXY` 및 `HTTPS_PROXY`를 무시하며, opt-out을 활성화하면 복원됩니다. `SSL_CERT_FILE` 또는 `SSL_CERT_DIR`을 통해 구성된 운영자 CA 번들은 계속 지원됩니다. ClickHouse는 연결이 열리기 전에 검사되지만, clickhouse-connect가 자체 urllib3 transport를 사용하기 때문에 dial 시점에 고정되지는 않습니다.

## 예제 Workflow

**외부 이벤트 스트림 → 필터 → 알림**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** 레이블: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** 메시지: `"Realtime alert: $streamEvent.message.data.title"`
## 예제 노드 JSON

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## 관련 항목

- [Triggers](../reference/triggers.md) – 백그라운드 Trigger 아키텍처 및 `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Workflow 단계에서 외부 소켓으로 데이터 푸시
- [Node Types](../reference/node-types.md) – 모든 노드 개요
- [Third-Party Integrations](../reference/integrations.md) – 어떤 노드가 자격 증명을 사용하고 사용하지 않는지
