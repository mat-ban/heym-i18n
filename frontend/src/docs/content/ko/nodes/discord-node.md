# Discord

**Discord** 노드는 Incoming Webhook을 통해 Discord 채널로 메시지를 전송합니다. 알림, Workflow 알림, 봇과 유사한 응답, 오류 보고 등에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | incoming webhook URL을 포함하는 `discord` credential |
| `message` | expression | 발신 메시지 텍스트입니다. [expressions](../reference/expression-dsl.md)를 지원합니다. |
| `username` | expression | 이 메시지에 대해 선택적으로 재정의할 표시 이름 |
| `avatarUrl` | expression | 이 메시지에 대해 선택적으로 재정의할 avatar URL |

## 설정

1. [Discord Webhook credential](../reference/integrations.md#discord)을 생성합니다
2. Workflow에 **Discord** 노드를 추가합니다
3. credential을 선택합니다
4. `message`를 발신 텍스트 또는 상위 데이터로 구성한 템플릿으로 설정합니다
5. 선택적으로 표시 `username`과 `avatarUrl`을 재정의합니다

## 예시

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## 출력 필드

| Expression | 설명 |
|------------|-------------|
| `$nodeLabel.status` | Discord가 반환한 HTTP 상태 코드이며, 성공 시 일반적으로 `204`입니다 |
| `$nodeLabel.response` | Discord webhook이 반환한 원시 응답 본문 |
| `$nodeLabel.message` | Heym이 전송한 메시지 텍스트 |
| `$nodeLabel.username` | 제공된 경우, webhook과 함께 전송된 사용자 이름 |
| `$nodeLabel.avatar_url` | 제공된 경우, webhook과 함께 전송된 avatar URL |

## 일반적인 패턴

- 상호작용 응답 외에 추가 채널 게시물을 원할 때 [Discord Trigger](./discord-trigger-node.md)와 함께 사용하십시오
- [Error Handler](./error-handler-node.md)에서 실패 알림을 전송하십시오
- [LLM](./llm-node.md) 또는 [Agent](./agent-node.md)가 생성한 요약을 게시하십시오

## 송신 보안

- credential에 저장된 webhook URL은 `http://` 또는 `https://`를 사용해야 하며, 공용 주소로만 확인되어야 합니다. Loopback, private, link-local, multicast, cloud-metadata 대상은 차단됩니다.
- Heym은 확인된 주소를 검증하고 전송 전에 연결 대상을 고정하므로, 검사 이후 DNS 응답이 요청을 내부 주소로 이동시킬 수 없습니다. 가드가 활성화된 동안 환경 프록시는 비활성화되며, 리다이렉트는 따르지 않습니다.
- 내부 webhook 수신기로 게시하는 배포 환경에서는 신뢰할 수 있는 self-hosted 인스턴스에서 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`를 설정할 수 있습니다. 호스팅 또는 멀티테넌트 배포 환경에서는 기본값을 유지하십시오.

**v0.0.109 업그레이드 참고 사항:** 이 검사는 Discord에 새로 적용됩니다. webhook URL이 loopback 또는 private 주소를 가리키는 credential은 위 설정이 활성화되지 않는 한 거부됩니다.

## 관련 항목

- [Discord Trigger](./discord-trigger-node.md) – 수신 Discord 상호작용으로 Workflow를 시작합니다
- [Third-Party Integrations](../reference/integrations.md) – Discord credential 설정
- [Credentials Tab](../tabs/credentials-tab.md) – `discord` credential 추가 및 관리
- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
