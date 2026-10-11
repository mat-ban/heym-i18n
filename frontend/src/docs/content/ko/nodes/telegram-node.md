# Telegram

**Telegram** 노드는 Telegram Bot API를 통해 메시지를 전송합니다. 채팅 응답, 운영 알림, Workflow 상태 업데이트 또는 Telegram 사용자, 그룹, 채널에 메시지를 보내야 하는 모든 하위 단계에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | 봇 Token을 포함하는 `telegram` credential |
| `chatId` | expression | 대상 채팅, 그룹 또는 채널 ID |
| `message` | expression | 발신 메시지 텍스트. [expressions](../reference/expression-dsl.md)를 지원합니다. |

## 설정

1. [Telegram Bot credential](../reference/integrations.md#telegram)을 생성합니다
2. Workflow에 **Telegram** 노드를 추가합니다
3. credential을 선택합니다
4. `chatId`를 정적 채팅 ID 또는 `$telegramEvent.message.chat.id`와 같은 expression으로 설정합니다
5. `message`를 발신 텍스트 또는 상위 데이터로 구성된 템플릿으로 설정합니다

## 예시

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Output 필드

| Expression | 설명 |
|------------|-------------|
| `$nodeLabel.status` | 성공 시 `"sent"` |
| `$nodeLabel.ok` | Telegram API 성공 플래그 |
| `$nodeLabel.result` | Telegram에서 반환된 원시 `sendMessage` 결과 객체 |
| `$nodeLabel.result.message_id` | Telegram 메시지 ID |
| `$nodeLabel.result.chat.id` | Telegram에서 반환된 대상 채팅 ID |

## 일반적인 패턴

- 대화형 봇을 위해 [Telegram Trigger](./telegram-trigger-node.md)와 함께 사용합니다
- [Error Handler](./error-handler-node.md)에서 오류 알림을 전송합니다
- [LLM](./llm-node.md) 또는 [Agent](./agent-node.md)에서 생성된 요약을 게시합니다

## 관련 항목

- [Telegram Trigger](./telegram-trigger-node.md) – 수신 봇 메시지로부터 Workflow를 시작합니다
- [Third-Party Integrations](../reference/integrations.md) – Telegram credential 설정
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram` credential 추가 및 관리
- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
