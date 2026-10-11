# IMAP Trigger

**IMAP Trigger** ノードは、一定間隔でメールの受信トレイをポーリングし、新しく検出されたメッセージごとにワークフローを1回起動します。これはゼロ入力の Trigger ノードであり、サポートトリアージ、共有メールボックスの監視、承認用メールボックスなど、受信メールの自動化を目的として設計されています。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.email`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id`、`$nodeLabel.triggered_at` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | サーバー、ログイン情報、メールボックス、SSL 設定を含む `imap` 認証情報 |
| `pollIntervalMinutes` | Integer | Heym が新着メールをチェックする間隔（分） |

## セットアップガイド

### 1. `imap` 認証情報を作成する

1. **Settings → Credentials → New Credential** に移動します
2. 種類として **IMAP Email Inbox** を選択します
3. 以下を入力します：
   - **IMAP Host**（例：`imap.gmail.com`）
   - **IMAP Port**（ほとんどのプロバイダーでは SSL/TLS 用に `993`）
   - **Username / Email**
   - **Password / App Password**
   - 任意で **Mailbox**（デフォルト：`INBOX`）
4. メールサーバーが明示的に非 SSL の IMAP を要求しない限り、**Use SSL / TLS** は有効のままにしてください
5. 認証情報を保存します

### 2. ノードをワークフローに追加する

1. **IMAP Trigger** をキャンバスにドラッグします
2. ノードを選択して Properties パネルを開きます
3. `imap` 認証情報を選択します
4. **Poll Interval (Minutes)** に `1`、`5`、`15` などの整数値を設定します

## Trigger の動作仕様

- 最初のポーリングでは、現在のメールボックスの内容を基準として確立し、過去のメールを**再処理しません**。
- 以降のポーリングでは、保存されたカーソルより新しい IMAP UID を持つメッセージごとに1回起動します。
- メールボックスの `UIDVALIDITY` が変更された場合、Heym は重複処理を避けるためにカーソルをリセットし、再度ベースラインを確立します。
- 新着メールごとに、`trigger_source = "imap"` を持つ個別のワークフロー実行が開始されます。

## 出力フィールド

ノードが起動した後、下流のノードは以下にアクセスできます：

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.email` | パース済みの完全なメール Payload |
| `$nodeLabel.email.subject` | デコードされた件名 |
| `$nodeLabel.email.from` | 生の `From` ヘッダー |
| `$nodeLabel.email.fromAddresses` | パース済みの送信者リスト |
| `$nodeLabel.email.toAddresses` | パース済みの受信者リスト |
| `$nodeLabel.email.ccAddresses` | パース済みの CC リスト |
| `$nodeLabel.email.replyToAddresses` | パース済みの reply-to リスト |
| `$nodeLabel.email.text` | プレーンテキスト本文 |
| `$nodeLabel.email.html` | HTML 本文 |
| `$nodeLabel.email.attachments` | 添付ファイルメタデータの配列（`filename`、`content_type`、`size_bytes`） |
| `$nodeLabel.email.headers` | デコードされたヘッダーオブジェクト |
| `$nodeLabel.email.uid` | 重複排除やログ記録に使用する IMAP UID |
| `$nodeLabel.triggered_by` | Trigger ソースのラベル（`"imap"`） |
| `$nodeLabel.trigger_node_id` | メールを検出したキャンバスノード ID |
| `$nodeLabel.triggered_at` | ワークフロー実行の ISO タイムスタンプ |

## ワークフロー例

**受信サポートメール → 要約 → ルーティング**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** のラベル：`supportInbox`
- **LLM** のユーザーメッセージ：`"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**：`$supportInbox.email.subject.lower().contains("urgent")`

## 注意事項

- 多くのプロバイダーでは、IMAP アクセスにメインアカウントのパスワードではなく **アプリパスワード** が必要です。
- 添付ファイルの内容はワークフロー入力に注入されず、添付ファイルのメタデータのみが含まれます。
- 新着メールのルーティングやログ記録には、下流で [Send Email](./send-email-node.md)、[Telegram](./telegram-node.md)、[Slack](./slack-node.md)、または [DataTable](./datatable-node.md) を使用してください。

## 関連項目

- [Triggers](../reference/triggers.md) – すべてのワークフローエントリーポイントの概要
- [Third-Party Integrations](../reference/integrations.md) – IMAP 認証情報のセットアップ
- [Credentials Tab](../tabs/credentials-tab.md) – `imap` 認証情報の追加と管理
- [Send Email](./send-email-node.md) – 受信メッセージへの返信または転送
