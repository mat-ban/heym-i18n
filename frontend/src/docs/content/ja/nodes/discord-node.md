# Discord

**Discord** ノードは、Incoming Webhook を介して Discord チャンネルにメッセージを送信します。アラート、Workflow の通知、ボットのような返信、エラー報告などにご利用いただけます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Output | `$nodeLabel.status`、`$nodeLabel.response`、`$nodeLabel.message`、`$nodeLabel.username`、`$nodeLabel.avatar_url` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | Incoming Webhook URL を含む `discord` credential |
| `message` | expression | 送信するメッセージ本文。[expressions](../reference/expression-dsl.md) をサポートします。 |
| `username` | expression | このメッセージに限り表示名を上書きする任意設定 |
| `avatarUrl` | expression | このメッセージに限りアバター URL を上書きする任意設定 |

## セットアップ

1. [Discord Webhook credential](../reference/integrations.md#discord) を作成します
2. Workflow に **Discord** ノードを追加します
3. credential を選択します
4. `message` に送信テキスト、または上流データから構築したテンプレートを設定します
5. 必要に応じて表示用の `username` と `avatarUrl` を上書きします

## 例

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## 出力フィールド

| Expression | 説明 |
|------------|-------------|
| `$nodeLabel.status` | Discord が返す HTTP ステータスコード。通常、成功時は `204` です |
| `$nodeLabel.response` | Discord Webhook が返す生のレスポンスボディ |
| `$nodeLabel.message` | Heym が送信したメッセージ本文 |
| `$nodeLabel.username` | Webhook とともに送信されたユーザー名（指定された場合） |
| `$nodeLabel.avatar_url` | Webhook とともに送信されたアバター URL（指定された場合） |

## 一般的なパターン

- インタラクションへの返信とは別に、追加のチャンネル投稿を行いたい場合は [Discord Trigger](./discord-trigger-node.md) と併用します
- [Error Handler](./error-handler-node.md) から失敗通知を送信します
- [LLM](./llm-node.md) や [Agent](./agent-node.md) が生成したサマリーを投稿します

## Egress の安全性

- credential に保存された Webhook URL は `http://` または `https://` を使用し、パブリックアドレスにのみ解決される必要があります。Loopback、プライベート、リンクローカル、マルチキャスト、およびクラウドメタデータ宛の送信先はブロックされます。
- Heym は解決されたアドレスを検証し、送信前に接続先を固定するため、DNS の応答によってチェック後にリクエストが内部アドレスへ移動することはありません。ガードが有効な間は環境プロキシが無効化され、リダイレクトは追跡されません。
- 内部の Webhook レシーバーへ投稿するデプロイメントでは、信頼できるセルフホストインスタンス上で `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` を設定できます。ホスト型またはマルチテナントのデプロイメントでは、デフォルト設定のままにしてください。

**v0.0.109 のアップグレードに関する注意:** このチェックは Discord 向けに新たに追加されたものです。Webhook URL が loopback またはプライベートアドレスを指している credential は、上記の設定が有効でない限り拒否されます。

## 関連項目

- [Discord Trigger](./discord-trigger-node.md) – 受信した Discord インタラクションから Workflow を開始します
- [Third-Party Integrations](../reference/integrations.md) – Discord credential のセットアップ
- [Credentials Tab](../tabs/credentials-tab.md) – `discord` credential の追加と管理
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
