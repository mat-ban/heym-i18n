# Discord Trigger

**Discord Trigger** 노드는 Discord Interactions API Webhook을 수신하여 워크플로우를 자동으로 시작하는 제로 입력 진입점입니다. 슬래시 명령, 버튼, 모달 및 기타 Discord 애플리케이션 상호작용을 다운스트림 AI 또는 통합 노드로 전달하고자 할 때 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## 파라미터

| 파라미터 | 유형 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | Discord 애플리케이션 공개 키를 포함하는 `discord_trigger` credential |

## 설정 가이드

### 1. `discord_trigger` Credential 생성

1. **Settings → Credentials → New Credential**로 이동합니다
2. 유형으로 **Discord Trigger (Public Key)**를 선택합니다
3. Discord Developer Portal에서 **Application Public Key**를 복사하여 붙여넣습니다:
   - **Your application → General Information → Public Key**
4. Credential을 저장합니다

### 2. 워크플로우에 노드 추가

1. **Discord Trigger**를 캔버스로 드래그합니다
2. 노드를 선택하여 Properties 패널을 엽니다
3. `discord_trigger` credential을 선택합니다
4. 노드 패널에 표시된 **Interactions URL**을 복사합니다

### 3. Discord에 Interactions Endpoint 등록

1. [Discord Developer Portal](https://discord.com/developers/applications)을 엽니다
2. 애플리케이션을 선택합니다
3. **General Information** 또는 **Interactions**로 이동합니다
4. 노드의 **Interactions Endpoint URL**을 endpoint 필드에 붙여넣습니다
5. Discord가 endpoint를 검증하기 위해 `PING` 요청을 전송하며, Heym은 서명 검증 후 자동으로 응답합니다
6. 변경 사항을 저장합니다

## 출력 필드

노드가 Trigger된 후 다운스트림 노드에서 다음에 접근할 수 있습니다:

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.interaction` | 전체 Discord interaction Payload |
| `$nodeLabel.type` | Interaction 유형 |
| `$nodeLabel.data` | 명령, 버튼 또는 모달 Payload |
| `$nodeLabel.data.name` | 해당되는 경우 슬래시 명령 이름 |
| `$nodeLabel.data.options` | 슬래시 명령 옵션 배열 |
| `$nodeLabel.headers` | 정제된 Webhook 헤더 |
| `$nodeLabel.triggered_by` | Trigger 소스 레이블 (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Discord interaction을 수신한 캔버스 노드 ID |
| `$nodeLabel.triggered_at` | 이 워크플로우 실행의 ISO 타임스탬프 |

## 예제 워크플로우

**Discord 슬래시 명령 → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger** 레이블: `discordEvent`
- **LLM** 사용자 메시지: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output** 메시지: `$llm.text`

## 보안

- 요청은 애플리케이션의 공개 키를 사용하여 **Ed25519**로 검증됩니다
- 재전송 공격을 줄이기 위해 **5분**보다 오래된 타임스탬프는 거부됩니다
- 민감한 헤더(`x-signature-ed25519`, `authorization` 등)는 데이터가 다운스트림 노드에 도달하기 전에 제거됩니다
- Trigger에는 유효한 `discord_trigger` credential이 필요하며, credential이 없거나 유효하지 않은 경우 요청이 거부됩니다

## 참고 사항

- Heym은 즉시 지연된 Discord 응답을 반환하고, 백그라운드에서 워크플로우를 실행하며, `Output` 노드가 콘텐츠를 생성하면 최종 워크플로우 출력을 Discord 후속 메시지로 게시합니다
- Interactions URL은 노드 ID에서 파생되며 워크플로우 이름이 변경되어도 안정적으로 유지됩니다
- Interaction 후속 메시지 외에 별도의 Webhook 게시도 원하는 경우에만 일반 [Discord Node](./discord-node.md)를 사용하십시오
- 일반적으로 `discordTrigger` 노드 하나로 충분하며, 서로 다른 interaction 유형을 라우팅하려면 다운스트림에 **Switch** 또는 **Condition**을 사용하십시오

## 관련 항목

- [Discord Node](./discord-node.md) – 아웃바운드 Discord 메시지 전송
- [Triggers](../reference/triggers.md) – 모든 워크플로우 진입점 개요
- [Third-Party Integrations](../reference/integrations.md) – Discord credential 설정
- [Credentials Tab](../tabs/credentials-tab.md) – `discord_trigger` credential 추가 및 관리
