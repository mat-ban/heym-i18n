# Telegram

**Telegram** ノードは、Telegram Bot API を通じてメッセージを送信します。チャットへの返信、運用アラート、Workflow のステータス更新、その他 Telegram のユーザー・グループ・チャンネルへメッセージを送るべき任意の下流ステップにご利用いただけます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力 | `$nodeLabel.status`、`$nodeLabel.ok`、`$nodeLabel.result` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | bot token を含む `telegram` credential |
| `chatId` | expression | 送信先のチャット、グループ、またはチャンネル ID |
| `message` | expression | 送信するメッセージ本文。[expressions](../reference/expression-dsl.md) をサポートします。 |

## セットアップ

1. [Telegram Bot credential](../reference/integrations.md#telegram) を作成します
2. Workflow に **Telegram** ノードを追加します
3. credential を選択します
4. `chatId` に静的なチャット ID、または `$telegramEvent.message.chat.id` のような expression を設定します
5. `message` に送信するテキスト、または上流データから構築したテンプレートを設定します

## 例

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## 出力フィールド

| Expression | 説明 |
|------------|-------------|
| `$nodeLabel.status` | 成功時は `"sent"` |
| `$nodeLabel.ok` | Telegram API の成功フラグ |
| `$nodeLabel.result` | Telegram からの生の `sendMessage` 結果オブジェクト |
| `$nodeLabel.result.message_id` | Telegram メッセージ ID |
| `$nodeLabel.result.chat.id` | Telegram が返す送信先チャット ID |

## 一般的なパターン

- 会話型ボットを構築する場合は [Telegram Trigger](./telegram-trigger-node.md) と組み合わせます
- [Error Handler](./error-handler-node.md) からエラー通知を送信します
- [LLM](./llm-node.md) または [Agent](./agent-node.md) が生成したサマリーを投稿します

## 関連

- [Telegram Trigger](./telegram-trigger-node.md) – 受信した bot メッセージから Workflow を開始します
- [Third-Party Integrations](../reference/integrations.md) – Telegram credential のセットアップ
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram` credential の追加と管理
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
