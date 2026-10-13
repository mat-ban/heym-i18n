# 이메일 전송

**Send Email** 노드는 SMTP를 통해 이메일을 발송합니다. 알림, 경고 및 트랜잭션 이메일에 사용하십시오.

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 SMTP credential |
| `to` | expression | 수신자. 여러 명인 경우 쉼표로 구분합니다. |
| `cc` | expression | 참조 수신자. 여러 명인 경우 쉼표로 구분합니다. |
| `bcc` | expression | 숨은 참조 수신자. 여러 명인 경우 쉼표로 구분합니다. 다른 수신자에게는 표시되지 않습니다. |
| `subject` | expression | 이메일 제목 |
| `emailBody` | expression | 이메일 본문 내용 |
| `attachments` | expression | 첨부할 [Drive](./drive-node.md) 파일 ID를 쉼표로 구분한 목록. Workflow 소유자가 소유하거나 해당 팀 중 하나와 공유된 파일만 첨부할 수 있습니다. |

## Attachments

`attachments` 필드에 하나 이상의 Drive 파일 ID를 전달하여 [Drive](./drive-node.md)의 파일을 첨부하십시오. `$` 표현식을 사용하여 상위 Drive 노드의 `id` 출력을 참조하거나(예: `$drive.id`), 정적 ID를 쉼표로 구분하여 나열하십시오. 각 ID는 Workflow 소유자의 범위에서 확인되며, 유효하지 않거나 접근할 수 없는 ID는 부분 이메일을 발송하는 대신 노드를 실패시킵니다.

## Setup

서버, 포트, 이메일 및 비밀번호를 포함한 SMTP credential을 추가하십시오. 표시되는 발신자는 credential의 선택적 **From** 필드이며, From이 비어 있으면 사용자 이름으로 발송됩니다. 일반적인 SMTP 서버:

- Gmail: `smtp.gmail.com`, 포트 587 (App Password 필요)
- Outlook: `smtp.office365.com`, 포트 587

## Example

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

위의 `attachments` 값은 `drive`라는 레이블이 지정된 상위 [Drive](./drive-node.md) 노드를 참조하여 해당 노드가 생성한 파일을 첨부합니다.

## Related

- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [Error Handler](./error-handler-node.md) – 실패 시 이메일 발송
- [Credentials Tab](../tabs/credentials-tab.md) – SMTP credential 추가
- [Third-Party Integrations](../reference/integrations.md#smtp-email) – SMTP 제공자 설정 (Gmail, Outlook, Mailgun, SendGrid)
