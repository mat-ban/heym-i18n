# Telegram Trigger

**Telegram Trigger** 노드는 Telegram 봇이 webhook 업데이트를 수신할 때 Workflow를 시작하는 제로 입력 진입점입니다. 챗봇, 지원 티켓 분류, 슬래시 명령어 형태의 명령, 또는 다운스트림 AI 및 통합 노드로 분기되어야 하는 인라인 버튼 콜백에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 1 |
| 출력 | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | 봇 Token과 선택적 webhook secret token을 포함하는 `telegram` credential |

## 설정 가이드

### 1. `telegram` Credential 생성

1. **Settings → Credentials → New Credential**로 이동합니다
2. **Telegram Bot** 타입을 선택합니다
3. BotFather에서 발급받은 **Bot Token**을 붙여넣습니다
4. Telegram이 일치하는 검증 헤더를 전송하도록 하려면 **Webhook Secret Token**을 선택적으로 설정합니다
5. Credential을 저장합니다

### 2. Workflow에 노드 추가

1. **Telegram Trigger**를 캔버스로 드래그합니다
2. 노드를 선택하여 Properties 패널을 엽니다
3. `telegram` credential을 선택합니다
4. 노드 패널에 표시된 **Webhook URL**을 복사합니다

### 3. Telegram에 Webhook 등록

노드에서 확인한 URL과 함께 Bot API `setWebhook` 메서드를 사용하십시오:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Heym에서 secret token을 설정한 경우, webhook 설정 시 동일한 값을 전송하십시오:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## 출력 필드

노드가 Trigger된 후 다운스트림 노드에서 다음 항목에 접근할 수 있습니다:

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.update` | 전체 Telegram update Payload |
| `$nodeLabel.message` | Update에서 추출한 기본 메시지 형태의 객체 |
| `$nodeLabel.message.text` | 수신 메시지 텍스트 |
| `$nodeLabel.message.chat.id` | 다운스트림에서 응답을 보낼 Chat ID |
| `$nodeLabel.message.from.id` | Telegram 사용자 ID |
| `$nodeLabel.callback_query` | Update가 인라인 키보드에서 발생한 경우의 Callback Payload |
| `$nodeLabel.headers` | 정제된 webhook 헤더 |
| `$nodeLabel.triggered_by` | Trigger 소스 레이블 (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Telegram update를 수신한 캔버스 노드 ID |
| `$nodeLabel.triggered_at` | 이 Workflow 실행에 대한 ISO 타임스탬프 |

## 예제 Workflow

**Telegram 메시지 → LLM → Telegram 응답**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** 레이블: `telegramEvent`
- **LLM** 사용자 메시지: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## 보안

- Credential에 `secret_token`이 있는 경우, Heym은 Workflow를 실행하기 전에 `x-telegram-bot-api-secret-token`을 검증합니다.
- Payload가 다운스트림 노드에 도달하기 전에 민감한 요청 헤더가 제거됩니다.
- Webhook URL은 노드 ID에 대해 정적이므로, 노드 자체가 변경될 때만 재등록하면 됩니다.

## 관련 항목

- [Telegram Node](./telegram-node.md) – 응답 또는 아웃바운드 알림 전송
- [Triggers](../reference/triggers.md) – 모든 Workflow 진입점 개요
- [Third-Party Integrations](../reference/integrations.md) – Telegram credential 설정
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram` credential 추가 및 관리
