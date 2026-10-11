# Slack

**Slack** 노드는 Incoming Webhook을 통해 Slack 채널로 메시지를 전송합니다. 알림, 경고, 오류 보고에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력 | 입력을 그대로 전달 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 Slack credential (webhook URL) |
| `message` | expression | 메시지 텍스트. [expressions](../reference/expression-dsl.md)를 지원합니다. |

## 설정

1. Slack 워크스페이스에서 Incoming Webhook을 생성합니다
2. Credentials 탭에서 webhook URL과 함께 Slack credential을 추가합니다
3. 노드에서 해당 credential을 참조합니다

## 예시

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

실패 알림을 위해 [Error Handler](./error-handler-node.md)와 함께 사용하십시오:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Egress 안전성

- credential에 저장된 webhook URL은 `http://` 또는 `https://`를 사용해야 하며, 공인 주소로만 확인(resolve)되어야 합니다. Loopback, private, link-local, multicast, cloud-metadata 목적지는 차단됩니다.
- Heym은 확인된 주소를 검증하고 전송 전에 연결 대상을 고정(pin)하므로, DNS 응답이 검사 이후에 요청을 내부 주소로 이동시킬 수 없습니다. 가드가 활성화된 동안 환경 프록시는 비활성화되며, 리다이렉트는 따르지 않습니다.
- 내부 webhook 수신기로 전송하는 배포 환경에서는 신뢰할 수 있는 self-hosted 인스턴스에서 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`를 설정할 수 있습니다. 호스팅 또는 멀티테넌트 배포 환경에서는 기본값을 유지하십시오.

**v0.0.109 업그레이드 참고 사항:** 이 검사는 Slack에 새로 적용됩니다. webhook URL이 loopback 또는 private 주소를 가리키는 credential은 위 설정이 활성화되지 않는 한 거부됩니다.

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Error Handler](./error-handler-node.md) – Workflow 실패 시 Slack 전송
- [Credentials Tab](../tabs/credentials-tab.md) – Slack webhook 추가
