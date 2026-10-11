# RabbitMQ

**RabbitMQ** 노드는 RabbitMQ 큐 및 익스체인지와 메시지를 주고받습니다. 메시지 기반 Workflow와 이벤트 처리에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (수신) |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 RabbitMQ credential |
| `rabbitmqOperation` | `"send"` \| `"receive"` | 작업 유형 |
| `rabbitmqExchange` | string | 익스체인지 이름 (송신 시 선택 사항) |
| `rabbitmqRoutingKey` | string | 라우팅 키 (송신 시) |
| `rabbitmqQueueName` | string | 큐 이름 (수신 시 필수, 송신 시 선택 사항) |
| `rabbitmqMessageBody` | expression | 송신용 메시지 본문 (표현식 지원) |
| `rabbitmqDelayMs` | number | x-delay 헤더 (밀리초, 지연 메시지 플러그인) |

## 작업

### 송신

큐 또는 익스체인지에 메시지를 발행합니다.

| 필드 | 필수 | 설명 |
|-------|----------|-------------|
| `rabbitmqMessageBody` | 예 | JSON 또는 문자열 본문 |
| `rabbitmqQueueName` | 선택 사항 | 직접 큐 대상 |
| `rabbitmqExchange` | 선택 사항 | 익스체인지 이름 |
| `rabbitmqRoutingKey` | 선택 사항 | 라우팅 키 |
| `rabbitmqDelayMs` | 선택 사항 | 지연 시간 (밀리초) |

**출력:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### 수신

Trigger 모드: 메시지가 도착하면 Workflow가 시작됩니다. Trigger로 사용할 경우 입력 엣지가 필요하지 않습니다.

**출력:** `$nodeLabel.body` (메시지 Payload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## 예제 – 송신

```json
{
  "type": "rabbitmq",
  "data": {
    "label": "publishMessage",
    "credentialId": "rabbitmq-credential-uuid",
    "rabbitmqOperation": "send",
    "rabbitmqQueueName": "tasks",
    "rabbitmqMessageBody": "$userInput.body"
  }
}
```

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [Triggers](../reference/triggers.md) – Workflow Trigger로서의 RabbitMQ
- [Credentials Tab](../tabs/credentials-tab.md) – RabbitMQ credential 추가
- [Third-Party Integrations](../reference/integrations.md#rabbitmq) – RabbitMQ credential 설정 및 지연 플러그인 세부 정보
