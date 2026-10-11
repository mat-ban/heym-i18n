# IMAP Trigger

**IMAP Trigger** 노드는 고정된 간격으로 이메일 받은 편지함을 폴링하고, 새로 감지된 각 메시지마다 워크플로우를 한 번씩 시작합니다. 이 노드는 지원 티켓 분류, 공유 메일함 모니터링, 승인 메일함과 같은 인바운드 이메일 자동화를 위해 설계된 제로 입력 Trigger 노드입니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 1 |
| 출력 | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | 서버, 로그인, 메일함, SSL 설정을 포함하는 `imap` credential |
| `pollIntervalMinutes` | Integer | Heym이 새 이메일을 확인하기 위해 메일함을 폴링하는 주기 |

## 설정 가이드

### 1. `imap` Credential 생성

1. **Settings → Credentials → New Credential**로 이동합니다
2. **IMAP Email Inbox** 타입을 선택합니다
3. 다음을 입력합니다:
   - **IMAP Host** (예: `imap.gmail.com`)
   - **IMAP Port** (대부분의 제공업체에서 SSL/TLS 사용 시 `993`)
   - **Username / Email**
   - **Password / App Password**
   - 선택 사항 **Mailbox** (기본값: `INBOX`)
4. 메일 서버가 명시적으로 비SSL IMAP을 요구하지 않는 한 **Use SSL / TLS**를 활성화된 상태로 둡니다
5. credential을 저장합니다

### 2. 워크플로우에 노드 추가

1. **IMAP Trigger**를 캔버스로 드래그합니다
2. 노드를 선택하여 Properties 패널을 엽니다
3. `imap` credential을 선택합니다
4. **Poll Interval (Minutes)**을 `1`, `5`, `15`와 같은 정수 값으로 설정합니다

## Trigger 동작 방식

- 첫 번째 폴링은 현재 메일함 내용의 기준선을 설정하며, 이전 이메일을 **재처리하지 않습니다**.
- 이후 폴링은 IMAP UID가 저장된 커서보다 새로운 메시지마다 한 번씩 트리거됩니다.
- 메일함의 `UIDVALIDITY`가 변경되면, Heym은 중복 처리를 방지하기 위해 커서를 재설정하고 다시 기준선을 설정합니다.
- 각각의 새 이메일은 `trigger_source = "imap"`으로 별도의 워크플로우 실행을 시작합니다.

## 출력 필드

노드가 트리거된 후, 다운스트림 노드에서 다음에 접근할 수 있습니다:

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.email` | 전체 파싱된 이메일 Payload |
| `$nodeLabel.email.subject` | 디코딩된 제목 |
| `$nodeLabel.email.from` | 원시 `From` 헤더 |
| `$nodeLabel.email.fromAddresses` | 파싱된 발신자 목록 |
| `$nodeLabel.email.toAddresses` | 파싱된 수신자 목록 |
| `$nodeLabel.email.ccAddresses` | 파싱된 CC 목록 |
| `$nodeLabel.email.replyToAddresses` | 파싱된 회신 주소 목록 |
| `$nodeLabel.email.text` | 일반 텍스트 본문 |
| `$nodeLabel.email.html` | HTML 본문 |
| `$nodeLabel.email.attachments` | 첨부 파일 메타데이터 배열 (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | 디코딩된 헤더 객체 |
| `$nodeLabel.email.uid` | 중복 제거 또는 로깅을 위한 IMAP UID |
| `$nodeLabel.triggered_by` | Trigger 소스 레이블 (`"imap"`) |
| `$nodeLabel.trigger_node_id` | 이메일을 감지한 캔버스 노드 ID |
| `$nodeLabel.triggered_at` | 워크플로우 실행의 ISO 타임스탬프 |

## 예제 워크플로우

**인바운드 지원 이메일 → 요약 → 라우팅**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** 레이블: `supportInbox`
- **LLM** 사용자 메시지: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## 참고 사항

- 많은 제공업체는 IMAP 접근 시 기본 계정 비밀번호 대신 **앱 비밀번호**를 요구합니다.
- 첨부 파일 내용은 워크플로우 입력에 주입되지 않으며, 첨부 파일 메타데이터만 포함됩니다.
- 새 이메일을 라우팅하거나 로깅하려면 다운스트림에서 [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) 또는 [DataTable](./datatable-node.md)을 사용하십시오.

## 관련 항목

- [Triggers](../reference/triggers.md) – 모든 워크플로우 진입점 개요
- [Third-Party Integrations](../reference/integrations.md) – IMAP credential 설정
- [Credentials Tab](../tabs/credentials-tab.md) – `imap` credential 추가 및 관리
- [Send Email](./send-email-node.md) – 인바운드 메시지에 회신 또는 전달
