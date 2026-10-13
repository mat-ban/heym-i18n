# Settings

Settings 대화상자에서는 프로필을 관리하고, 지속적인 AI 지침을 설정하며, 계정 비밀번호를 갱신하고, 채팅 음성을 구성하며, 기본 AI credential 및 모델을 설정하고, observability 상태를 확인할 수 있습니다. 헤더 오른쪽 상단의 **아바타와 이름**을 클릭하여 여십시오.

## 대화상자 열기

헤더 오른쪽 상단의 **아바타와 이름**을 클릭하십시오. 대화상자가 열리며 **Profile**, **Security**, **Voice**, **AI Defaults**, **Observability** 탭이 표시됩니다. 인스턴스 관리자는 **SSO**, **Heym Work**, **Instances** 탭도 볼 수 있습니다.

## Profile 탭

### 프로필 사진

Heym은 계정 이메일에 대한 [Gravatar](https://gravatar.com) 사진을 헤더, [Chat](../tabs/chat-tab.md) 및 **Chat with Heym**의 메시지 옆, [Board](../tabs/board-tab.md) 댓글, 공유 대화상자 및 팀 멤버 목록의 이름 옆에 표시합니다. 변경하려면 Gravatar에서 사진을 갱신하십시오. Heym은 몇 시간 이내에 새 사진을 반영합니다. Gravatar 사진이 없으면 Heym은 이름의 첫 글자를 표시합니다.

사진은 Heym 서버에서 가져와 캐시되므로 브라우저가 Gravatar에 직접 접속하지 않습니다. 서버가 Gravatar에 접근할 수 없으면 모든 사용자에게 이니셜이 계속 표시됩니다.

### 이름

앱 전체에 표시되는 표시 이름입니다. 이 필드는 필수이며 비워둘 수 없습니다.

### User Rules

User Rules는 workflow builder와 dashboard chat 모두에서 모든 AI 요청에 자동으로 주입되는 사용자 지정 지침입니다. **workflow builder**([AI Assistant](./ai-assistant.md))에서는 workflow JSON을 생성하는 데 사용되는 system prompt에 추가됩니다. **dashboard chat**에서는 시스템 수준 컨텍스트로 적용됩니다. 한 번 작성하면 각 prompt마다 반복하지 않고 전역으로 적용됩니다.

**일반적인 용도:**

- 언어 또는 어조: `Always respond in English. Keep responses concise.`
- 코딩 스타일: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Workflow 규칙: `Include error handling in all workflows. Use descriptive node labels.`
- 응답 형식: `Use bullet points. Avoid lengthy explanations.`

**적용 위치:**

| 컨텍스트 | 설명 |
|---------|-------------|
| **Workflow builder** | workflow 생성 또는 수정을 위한 [AI Assistant](./ai-assistant.md) 요청 |
| **Dashboard chat** | 모든 [Chat 탭](../tabs/chat-tab.md) 대화 |

User Rules는 시스템 수준에서 주입됩니다. workflow나 대화별 추가 구성 없이 모든 prompt 이전에 자동으로 실행됩니다.

### 프로필 변경 사항 저장

**Save Changes**를 클릭하여 적용하십시오. 변경 사항은 모든 새 AI 요청에 즉시 적용됩니다.

## Security 탭

### 비밀번호 변경

Security 탭을 사용하여 계정 비밀번호를 갱신하십시오.

**요구 사항:**

| 규칙 | 요구 사항 |
|------|-------------|
| 최소 길이 | 8자 |
| 대문자 | 대문자 최소 1개 (A–Z) |
| 소문자 | 소문자 최소 1개 (a–z) |
| 숫자 | 숫자 최소 1개 (0–9) |

비밀번호는 현재 비밀번호와 달라야 합니다. 이러한 규칙은 프런트엔드와 백엔드 모두에서 적용됩니다.

**단계:**

1. **Current Password**를 입력합니다
2. **New Password**를 입력합니다 (위의 모든 요구 사항을 충족해야 합니다)
3. **Confirm New Password**에 다시 입력합니다
4. **Update Password**를 클릭합니다

현재 비밀번호가 올바르지 않으면 인라인 오류 메시지가 표시됩니다. 성공하면 확인 메시지가 나타나고 양식이 자동으로 초기화됩니다.

## Voice 탭

Voice 탭에서는 [Chat 탭](../tabs/chat-tab.md)의 음성 읽기를 구성합니다. **ElevenLabs credential**을 선택하고(또는 인라인으로 추가), ElevenLabs 계정에서 **Voice**를 선택한 후 **Save Voice Settings**를 클릭하십시오. 이를 통해 메시지별 읽기 및 대화형 음성 모드가 활성화됩니다. 전체 흐름은 [Chat Voice (TTS & STT)](./chat-voice.md)를 참조하십시오.

## AI Defaults 탭

AI Defaults 탭에는 두 개의 섹션이 있습니다.

### 기본 credential 및 모델

**기본 LLM credential**과 그로부터의 **모델**을 선택하십시오. 이는 앱의 모든 AI 기능 — chat, [AI Assistant](./ai-assistant.md)(builder, analyzer, workflow 생성), board mapper, AI dashboard 위젯, [docs chat](../tabs/chat-tab.md), data-table AI schema helper, expression builder, evals — 에서 해당 화면에 자체 저장된 선택이 없을 때마다 시작 기본값이 됩니다.

각 화면이 따르는 선택 규칙은 다음과 같습니다.

1. **저장된 선택** — 해당 화면에서 이미 선택한 항목(예: chat 대화의 마지막 모델)이 항상 우선합니다.
2. **기본 설정** — 저장된 선택이 없을 때 사용됩니다.
3. **첫 번째 사용 가능한 credential** — 기본 설정을 지정하지 않은 경우의 대체값입니다.

언제든지 화면별로 credential과 모델을 변경할 수 있습니다. 기본 설정은 초기 기본값만 채웁니다. credential을 **No preference**로 두면 이전의 첫 번째 credential 동작이 유지됩니다. 기본 설정한 credential이 나중에 삭제되거나 공유 해제되면 탭에 알림이 표시되고 화면은 첫 번째 사용 가능한 credential로 자동 대체됩니다.

### 코딩 패키지 사용량

각 **Codex** 자격 증명(공유 자격 증명 포함)에 대해 이 탭은 활성 윈도우별 남은 rate-limit 사용량을 가로 막대로 표시합니다. 예를 들어 플랜에 따라 **5 hours** 윈도우 및/또는 **Weekly** 윈도우가 표시됩니다. 각 막대는 남은 할당량의 백분율과 재설정 카운트다운을 보여줍니다. **Refresh** 버튼은 요청 시 다시 가져옵니다(결과는 서버에 잠시 캐시됩니다).

각 **OpenCode** 자격 증명에 대해 이 탭은 OpenCode Go 구독 윈도우인 **5 hours**, **Weekly**, **Monthly**를 동일한 스타일의 막대로 표시하며, 해당 자격 증명의 API key로 gateway의 인증된 사용량 endpoint에서 읽어옵니다. 한도에 도달한 윈도우는 amber 색상으로 **"limit reached"** 로 표시됩니다. key가 유효하지 않거나 workspace에 Go 구독이 없으면 카드는 막대 대신 그 이유를 표시합니다.

## Observability 탭

Observability 탭은 이 인스턴스의 [OpenTelemetry Tracing](./opentelemetry.md)에 대한 읽기 전용 상태를 표시합니다. tracing 활성화 여부, OTLP endpoint, service name, sampler ratio, 그리고 어떤 span이 내보내지는지를 보여줍니다. Tracing은 backend의 `HEYM_OTEL_*` 환경 변수를 통해 구성되므로 이 탭에서는 아무것도 편집하지 않습니다. Tracing이 비활성화된 경우, 이 탭은 활성화에 필요한 환경 변수를 나열합니다. OTLP auth header와 같은 secret은 여기에 절대 표시되지 않습니다. 전체 구성 참조는 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)를 참조하십시오.

## SSO 탭

인스턴스 관리자, 즉 `HEYM_ADMIN_EMAILS`에 나열된 계정에만 표시됩니다. 이 탭은 Heym을 외부 OpenID Connect provider에 연결하여 사용자가 이미 보유한 계정으로 로그인할 수 있게 합니다. issuer URL과 client 자격 증명을 입력하고, 읽기 전용 redirect URI를 provider에 복사한 뒤, 활성화하기 전에 **Test connection**을 실행하십시오. 테스트가 통과하면 여기에서 password 로그인을 끌 수 있습니다. 전체 설정은 [Single Sign-On](./sso.md)을 참조하십시오.

## Heym Work 탭

인스턴스 관리자는 여기에서 비즈니스 팀용 인터페이스인 [Heym Work](./heym-work.md)를 연결합니다. 주소, 한 번만 표시되는 통합 키, **Enable Heym Work** 스위치를 설정할 수 있습니다. 또한 이 탭에는 Heym Work의 마지막 체크인 시간, 버전 및 라이선스 상태도 표시됩니다. [Heym Work 연결하기](./heym-work.md#connecting-heym-work)를 참조하십시오.

## Instances 탭

인스턴스 관리자, 즉 `HEYM_ADMIN_EMAILS`에 나열된 계정에만 표시됩니다. 이 탭은 이 데이터베이스에 연결된 Heym 인스턴스를 나열하고 백그라운드 실행이 이들 사이에 어떻게 분배되는지를 설정합니다. 각 행은 인스턴스의 편집 가능한 이름, 역할, live 여부, 데이터베이스까지 측정된 latency, on/off 스위치, 그리고 weight를 표시합니다. Weight는 현재 작업을 처리할 수 있는 인스턴스들의 몫이며 100의 백분율이 아닙니다. `41 / 26 / 33`이고 세 번째 인스턴스가 꺼져 있으면 처음 두 인스턴스는 실제로 61%와 39%를 받습니다. 패널은 테이블 아래에 그 실효 분배를 출력하며, 활성화된 인스턴스 중 weight가 전혀 없는 경우에만 저장을 거부합니다.

**Give new instances a share automatically**는 기본적으로 켜져 있습니다. 그렇지 않으면 참여하는 인스턴스가 weight 0으로 있어 아무것도 받지 못하므로, leader가 한 번 동일한 몫을 부여하고 기존 weight를 비율을 유지한 채 축소합니다. 직접 설정한 weight가 있는 인스턴스는 절대 건드리지 않습니다.

또한 이 패널은 지난 24시간의 실행 중 main 인스턴스에서만 실행할 수 있었던 것이 몇 개인지 보고합니다. 그 비율이 높으면 그 아래의 weight로는 그 작업을 옮길 수 없습니다. main에 남는 것과 숫자를 선택하는 방법은 [Load Distribution](./cluster.md)을 참조하십시오.

## 이 대화 상자에 없는 항목

| 기능 | 찾을 위치 |
|---------|-----------------|
| **API key 관리 (MCP)** | [MCP Tab](../tabs/mcp-tab.md) – MCP server API key 보기, 복사, 재생성 |
| **테마 (dark / light)** | 헤더의 Sun/Moon 토글 버튼 (사용자 배지 옆) |
| **이메일 변경** | 현재 지원되지 않음 |

## 관련 항목

- [AI Assistant](./ai-assistant.md) – User Rules를 사용하는 Workflow builder chat
- [Chat Tab](../tabs/chat-tab.md) – User Rules를 사용하는 Dashboard chat
- [Chat Voice (TTS & STT)](./chat-voice.md) – Voice 탭에서 구성하는 ElevenLabs voice
- [MCP Tab](../tabs/mcp-tab.md) – MCP server API key 및 workflow tool 노출
- [Credentials Tab](../tabs/credentials-tab.md) – AI 노드 및 통합을 위한 API key
- [Security](./security.md) – 세션 관리, rate limiting, 자격 증명 암호화
- [Single Sign-On](./sso.md) – 외부 OpenID Connect provider 연결
- [OpenTelemetry Tracing](./opentelemetry.md) – workflow 및 노드 실행을 위한 분산 tracing
