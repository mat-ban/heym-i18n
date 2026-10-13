# メール送信

**Send Email** ノードは、SMTP 経由でメールを送信します。通知、アラート、トランザクションメールなどにご利用ください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.status`、`$nodeLabel.to`、`$nodeLabel.cc`、`$nodeLabel.bcc`、`$nodeLabel.subject`、`$nodeLabel.attachment_count` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) で設定した SMTP クレデンシャル |
| `to` | expression | 宛先。複数の場合はカンマ区切りで指定します。 |
| `cc` | expression | カーボンコピー（CC）の宛先。複数の場合はカンマ区切りで指定します。 |
| `bcc` | expression | ブラインドカーボンコピー（BCC）の宛先。複数の場合はカンマ区切りで指定します。他の受信者には表示されません。 |
| `subject` | expression | メールの件名 |
| `emailBody` | expression | メール本文の内容 |
| `attachments` | expression | 添付する [Drive](./drive-node.md) ファイル ID をカンマ区切りで指定します。添付できるのは、Workflow の所有者が所有するファイル、または所有者がいずれかのチームと共有しているファイルのみです。 |

## 添付ファイル

`attachments` フィールドに 1 つ以上の Drive ファイル ID を渡すことで、[Drive](./drive-node.md) からファイルを添付できます。上流の Drive ノードの `id` 出力を参照するには `$` 式（例：`$drive.id`）を使用するか、静的な ID をカンマ区切りで列挙してください。各 ID は Workflow 所有者のスコープで解決されます。無効な ID やアクセスできない ID が指定された場合、メールの一部のみが送信されることはなく、ノードは失敗します。

## セットアップ

サーバー、ポート、メールアドレス、パスワードを指定して SMTP クレデンシャルを追加します。表示される送信者はクレデンシャルの任意項目 **From** です。From が空欄の場合はユーザー名として送信されます。一般的な SMTP サーバーは以下のとおりです：

- Gmail：`smtp.gmail.com`、ポート 587（App Password が必要）
- Outlook：`smtp.office365.com`、ポート 587

## 例

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

上記の `attachments` の値は、`drive` というラベルが付いた上流の [Drive](./drive-node.md) ノードを参照しており、そのノードが生成したファイルを添付します。

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Error Handler](./error-handler-node.md) – 失敗時にメールを送信する
- [Credentials Tab](../tabs/credentials-tab.md) – SMTP クレデンシャルの追加
- [Third-Party Integrations](../reference/integrations.md#smtp-email) – SMTP プロバイダーのセットアップ（Gmail、Outlook、Mailgun、SendGrid）
