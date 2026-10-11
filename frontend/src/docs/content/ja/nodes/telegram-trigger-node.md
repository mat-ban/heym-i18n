# Telegram Trigger

**Telegram Trigger** ノードは、Telegram ボットが Webhook 更新を受信した際に Workflow を開始する、入力不要のエントリーポイントです。チャットボット、サポートのトリアージ、スラッシュコマンド風の操作、またはインラインボタンのコールバックなど、下流の AI ノードや統合ノードへ展開すべき用途にご利用いただけます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| Output | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | ボット Token および任意の Webhook シークレット Token を含む `telegram` クレデンシャル |

## セットアップガイド

### 1. `telegram` クレデンシャルを作成する

1. **Settings → Credentials → New Credential** に移動します
2. タイプ **Telegram Bot** を選択します
3. BotFather から取得した **Bot Token** を貼り付けます
4. Telegram に一致する検証ヘッダーを送信させたい場合は、任意で **Webhook Secret Token** を設定します
5. クレデンシャルを保存します

### 2. ノードを Workflow に追加する

1. **Telegram Trigger** をキャンバスにドラッグします
2. ノードを選択して Properties パネルを開きます
3. `telegram` クレデンシャルを選択します
4. ノードパネルに表示される **Webhook URL** をコピーします

### 3. Telegram に Webhook を登録する

ノードに表示された URL を使用して、Bot API の `setWebhook` メソッドを呼び出します：

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Heym でシークレット Token を設定した場合は、Webhook 設定時にも同じ値を送信してください：

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## 出力フィールド

ノードがトリガーされた後、下流のノードから以下にアクセスできます：

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.update` | Telegram 更新の完全な Payload |
| `$nodeLabel.message` | 更新に含まれる主要なメッセージ相当のオブジェクト |
| `$nodeLabel.message.text` | 受信メッセージのテキスト |
| `$nodeLabel.message.chat.id` | 下流で返信するためのチャット ID |
| `$nodeLabel.message.from.id` | Telegram ユーザー ID |
| `$nodeLabel.callback_query` | 更新がインラインキーボードから送信された場合のコールバック Payload |
| `$nodeLabel.headers` | サニタイズ済みの Webhook ヘッダー |
| `$nodeLabel.triggered_by` | Trigger ソースのラベル（`"telegram"`） |
| `$nodeLabel.trigger_node_id` | Telegram 更新を受信したキャンバスノード ID |
| `$nodeLabel.triggered_at` | この Workflow 実行の ISO タイムスタンプ |

## Workflow の例

**Telegram メッセージ → LLM → Telegram 返信**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** のラベル：`telegramEvent`
- **LLM** のユーザーメッセージ：`"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** の chatId：`$telegramEvent.message.chat.id`

## セキュリティ

- クレデンシャルに `secret_token` が設定されている場合、Heym は Workflow を実行する前に `x-telegram-bot-api-secret-token` を検証します。
- 機密性の高いリクエストヘッダーは、Payload が下流のノードに到達する前に削除されます。
- Webhook URL はノード ID に対して固定されているため、再登録が必要となるのはノード自体が変更された場合のみです。

## 関連項目

- [Telegram Node](./telegram-node.md) – 返信またはアウトバウンド通知を送信します
- [Triggers](../reference/triggers.md) – すべての Workflow エントリーポイントの概要
- [Third-Party Integrations](../reference/integrations.md) – Telegram クレデンシャルのセットアップ
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram` クレデンシャルの追加と管理
