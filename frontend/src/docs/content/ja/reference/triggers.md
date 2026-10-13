# Trigger

Workflow は **Trigger ノード** または **エントリーポイント** によって開始されます。各 Trigger タイプには、それぞれ固有の Endpoint またはバックグラウンドプロセスがあります。

## Trigger ノード

実行を開始する開始ノード（入力エッジを持たないノード）です：

| ノードタイプ | 説明 |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP エントリーポイント。リクエストから `body`、`headers`、`query` を受け取ります。 |
| [Cron](../nodes/cron-node.md) | スケジュールに従って実行されます（cron 式、例：毎時実行の `0 * * * *`）。 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram がノード固有の Webhook URL にボット Webhook 更新を送信したときに開始されます。 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord がノード固有の Endpoint に Interactions API Webhook を送信したときに開始されます。 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP メールボックスをポーリングし、新しく検出されたメールごとに 1 回開始されます。 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Heym がプラットフォームイベントを発行したときに開始されます。1 つのディスパッチウィンドウ内のイベントは配列としてまとめて到着します。 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | 外部ソケットへのアウトバウンドクライアント接続を開き、選択されたソケットイベントで開始されます。 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | 単一使用のアップロード URL を発行し、呼び出し元が大きなマルチパートファイルを POST したときに開始されます。 |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | RabbitMQ キューからメッセージが消費されたときに開始されます。 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Slack が Events API Webhook 経由でイベントを送信したときに開始されます。 |

## エントリーポイント

| Trigger | Endpoint / ソース | 認証 |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`、`/message`、`/sse` | `X-MCP-Key` ヘッダーまたは `Authorization: Bearer`（ヘッダーのみ） |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal セッション Token |
| **Board** | [Board](../tabs/board-tab.md) カードの移動 / Workflow チェーンを持つカラムへのフォローアップ実行（`trigger_source="board"`） | JWT（Board オーナー） |
| **Cron** | Cron スケジューラー（60 秒ごとに実行され、cron 式を評価） | なし |
| **IMAP** | IMAP Trigger マネージャー（リーダーワーカー、ノードごとのポーリング間隔） | IMAP ユーザー名/パスワード |
| **WebSocket** | アウトバウンド WebSocket Trigger マネージャー（リーダーワーカー、永続的なクライアント接続） | ノードごとのオプションヘッダー |
| **File Upload** | スロット発行後の `POST /api/file-intake/u/{token}` | 単一使用のケイパビリティ Token |
| **RabbitMQ** | RabbitMQ コンシューマー（リーダーワーカー） | なし |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 署名シークレット |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 アプリケーション公開鍵 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | オプションの `x-telegram-bot-api-secret-token` |
| **Editor** | Webhook と同じ、`workflowStore.executeWorkflow` 経由 | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **入力**: リクエストボディは `body` として textInput ノードに渡されます
- **Body モード**: Workflow はエディターおよび cURL ダイアログで、`defined` フィールド形式のサンプルまたは `generic` 生 JSON サンプルを使用できます
- **認証**: Workflow ごとに設定されます（`auth_type`、`allow_anonymous`）

TTL、キャッシュ、レート制限、認証の詳細については [Webhook](./webhooks.md) を参照してください。

### MCP

`mcp_enabled=true` の Workflow は、MCP クライアントからツールとして表示されます。ツール名は Workflow 名から生成されます。詳細は [MCP Tab](../tabs/mcp-tab.md) を参照してください。

### Portal

`/chat/{slug}` で公開されるチャット UI です。詳細は [Portal](./portal.md) を参照してください。

### Cron

Cron スケジューラーは 60 秒ごとに実行され、アクティブな `cron` ノードを持つ Workflow を検索し、cron 式を評価して、一致する Workflow を実行します。入力には `{"triggered_by": "cron"}` が含まれます。

### IMAP

IMAP Trigger マネージャーはリーダーワーカーで実行され、設定された `pollIntervalMinutes` に従ってアクティブな `imapTrigger` ノードをチェックします。各ノードは IMAP カーソル（`UIDVALIDITY` + 最後に確認された UID）を保存します。入力には `email`、`triggered_by: "imap"`、`trigger_node_id`、`triggered_at` が含まれます。

### Heym プラットフォームイベント

Heym イベントディスパッチャーは 5 秒ごとに `heym_events` ログをポーリングし、一致するイベントをアクティブな `heymTrigger` ノードに配信します。配信は一意制約を通じて (イベント, Workflow, ノード) ごとにクレームされるため、イベントはすべてのワーカー、コンテナ、マシンにわたって購読ノードごとに正確に 1 回だけ発火します。1 回のパスでクレームされたすべてのイベントは単一の実行で配信されます。入力には `events`（常に配列、古い順）、`count`、`triggered_by: "heym_event"`、`trigger_node_id`、`triggered_at` が含まれます。過去 5 分以内に発行されたイベントのみがディスパッチされるため、障害発生時にバックログが再生されることを防ぎます。イベントは 7 日間保持されます。

### WebSocket

WebSocket Trigger マネージャーはリーダーワーカーで実行され、アクティブな [WebSocket Trigger](../nodes/websocket-trigger-node.md) ノードごとに 1 つのアウトバウンドクライアント接続を維持します。`onMessage`、`onConnected`、`onClosed` の実行を発行できます。入力には `eventName`、`url`、`triggered_by: "websocket"`、`trigger_node_id`、および `message`、`connection`、`close` のいずれかが含まれます。

### ファイルアップロード

[File Upload Trigger](../nodes/file-upload-trigger-node.md) は、Workflow が API、MCP、またはキャンバス経由で呼び出された際に、TTL で制限された単一使用のアップロードスロットを発行します。マルチパートフォームデータを `POST /api/file-intake/u/{token}` にアップロードするとスロットが消費され、ファイルが Drive ファイルとして保存され、Workflow が同期的に開始されます。入力には `file`、`uploaded_at`、`triggered_by: "file_upload"`、およびアップロードメタデータが含まれます。

### Telegram

Telegram はボットの Webhook 更新を `POST /api/telegram/webhook/{node_id}` に送信します。Payload は `update`、`message`、オプションの `callback_query`、サニタイズされた `headers`、`triggered_by`、`trigger_node_id`、`triggered_at` として Workflow に渡されます。選択された Credential にシークレット Token がある場合、Heym は実行前に `x-telegram-bot-api-secret-token` を検証します。

### Discord

Discord はインタラクション Webhook を `POST /api/discord/webhook/{node_id}` に送信します。Payload は `interaction`、`type`、`data`、サニタイズされた `headers`、`triggered_by`、`trigger_node_id`、`triggered_at` として Workflow に渡されます。Heym は実行前に Ed25519 と、選択された `discord_trigger` Credential のアプリケーション公開鍵を使用してリクエストを検証します。

### RabbitMQ

RabbitMQ コンシューマーは、リーダーワーカーが初期化されたときに起動します。`rabbitmqOperation === "receive"` である `rabbitmq` ノードを持つ Workflow にはコンシューマーが割り当てられます。入力には `message_data`（body、headers、routing_key など）と `triggered_by: "rabbitmq"` が含まれます。

## trigger_source

実行履歴は、すべてのエントリーポイントに対して `trigger_source` を記録します：

| 値 | タイミング |
|-------|------|
| `"API"` | 明示的なヘッダーのない Webhook / API 呼び出し（デフォルト） |
| `"Canvas"` | Workflow エディターのキャンバスからの実行 |
| `"Quick Drawer"` | エディターのクイックドロワーパネルからの実行（ドロップゾーンからアップロードされたファイル実行を含む） |
| `"cron"` | Cron スケジューラー |
| `"imap"` | IMAP Trigger マネージャー |
| `"websocket"` | アウトバウンド WebSocket Trigger マネージャー |
| `"file_upload"` | File Upload Trigger のアップロード Endpoint（HTTP、MCP、またはキャンバスで発行されたリンク） |
| `"dashboard"` | ダッシュボードウィジェットの実行およびファイルドロップウィジェットからのアップロード |
| `"telegram"` | Telegram ボット Webhook |
| `"Discord"` | Discord インタラクション Webhook |
| `"MCP"` | MCP ツール呼び出し |
| `"portal"` | Portal 実行 |
| `"dashboard_chat"` | AI アシスタントチャット |
| `"AI Agents"` | AI Agent ノードによって呼び出されたサブ Workflow |
| `"SUB_WORKFLOW"` | Execute Workflow ノードによって呼び出されたサブ Workflow |
| カスタム | `X-Trigger-Source` ヘッダーまたは `trigger_source` クエリ/ボディパラメータで送信された任意の値 |
| （未設定） | RabbitMQ コンシューマー |

## Trigger ごとの入力

- **HTTP/Webhook**: リクエストからの `body`、`headers`、`query`
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + オプションの `callback_query` + サニタイズされた `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + サニタイズされた `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event`（完全な Slack イベントオブジェクト）+ `headers`（サニタイズ済み）+ `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + オプションの `conversation_history`

## 関連項目

- [Webhooks](./webhooks.md) – Webhook の TTL、キャッシュ、レート制限、認証
- [Workflow Structure](./workflow-structure.md) – ノードとエッジ
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)、[File Upload Trigger](../nodes/file-upload-trigger-node.md)、[RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord インタラクション Webhook Trigger
- [Quick Start](../getting-started/quick-start.md) – Input を使用した Workflow の構築
- [Portal](./portal.md) – Portal Trigger とチャット UI
- [Execution History](./execution-history.md) – 過去の実行と trigger_source の表示
