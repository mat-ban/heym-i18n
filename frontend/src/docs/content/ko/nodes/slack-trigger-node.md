# Slack Trigger

**Slack Trigger** 노드는 Slack Events API Webhook을 수신하여 워크플로우를 자동으로 시작하는 제로 입력 진입점입니다. Slack의 URL 검증 challenge를 처리하고, signing secret으로 요청 서명을 검증합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | signing secret을 포함하는 `slack_trigger` credential |

## 설정 가이드

### 1. `slack_trigger` Credential 생성

1. **Settings → Credentials → New Credential**로 이동합니다
2. 타입으로 **Slack Trigger (Signing Secret)**을 선택합니다
3. Slack App의 **Signing Secret**을 붙여넣습니다:
   - Slack에서: **App settings → Basic Information → App Credentials → Signing Secret**
4. credential을 저장합니다

### 2. 워크플로우에 노드 추가

1. 워크플로우 캔버스를 엽니다
2. 노드 패널에서 **Slack Trigger**를 캔버스로 드래그합니다
3. 노드를 클릭하여 Properties 패널을 엽니다
4. `slack_trigger` credential을 선택합니다
5. 패널에 표시된 **Webhook URL**을 복사합니다

### 3. Slack App 구성

1. Slack App 설정에서 **Event Subscriptions**로 이동합니다
2. **Enable Events**를 켭니다
3. **Request URL** 필드에 Webhook URL을 붙여넣습니다
4. Slack이 URL 검증 challenge를 전송하며, Heym은 수 밀리초 내에 자동으로 응답합니다
5. 필드가 녹색으로 변합니다: ✓ Verified
6. 필요한 **Bot Events**를 구독합니다 (예: `message.channels`, `reaction_added`)
7. 변경 사항을 저장하고, 요청 시 워크스페이스에 앱을 재설치합니다

## 출력 필드

노드가 트리거된 후, 다운스트림 노드에서 다음에 접근할 수 있습니다:

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.event` | 전체 Slack 이벤트 객체 |
| `$nodeLabel.event.type` | 이벤트 타입 (예: `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | 메시지 텍스트 (해당되는 경우) |
| `$nodeLabel.event.user` | 이벤트를 트리거한 Slack 사용자 ID |
| `$nodeLabel.event.channel` | 채널 ID |
| `$nodeLabel.event.ts` | 이벤트 타임스탬프 |
| `$nodeLabel.headers` | Slack에서 전달된 정제된 HTTP 헤더 |
| `$nodeLabel.triggered_by` | 트리거 소스 레이블 (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Slack 이벤트를 수신한 캔버스 노드 ID |

## 예제 워크플로우

**Slack 메시지 → LLM 응답 → Slack 전송:**

```
slackTrigger → llm → slack
```

- **slackTrigger** 레이블: `slackEvent`
- **LLM** 사용자 메시지: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** 메시지: `$llm.text`

## 보안

- 요청은 signing secret을 사용한 **HMAC-SHA256**으로 검증됩니다
- **5분**보다 오래된 타임스탬프는 거부됩니다 (재전송 공격 방지)
- 민감한 헤더(`x-slack-signature`, `authorization` 등)는 다운스트림 노드에 도달하기 전에 제거됩니다
- credential이 설정되지 않은 경우 노드는 검증 없이 실행됩니다 — 로컬 테스트에만 권장됩니다

## 참고 사항

- Heym은 즉시 `200 OK`로 응답하고 백그라운드에서 워크플로우를 실행합니다 — 이는 Slack의 3초 응답 요구 사항을 충족합니다
- Webhook URL은 노드 ID에서 파생되며, 워크플로우 이름이 변경되어도 절대 변경되지 않습니다
- 워크플로우당 하나의 `slackTrigger` 노드만 필요합니다. 서로 다른 이벤트 타입을 라우팅하려면 다운스트림에서 **Switch** 또는 **Condition** 노드를 사용하십시오
