# Slack

**Slack** ノードは、Incoming Webhook を介して Slack チャンネルにメッセージを送信します。通知、アラート、エラー報告にご利用ください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | 入力をそのまま通過 |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) で設定した Slack credential（webhook URL） |
| `message` | expression | メッセージ本文。[expressions](../reference/expression-dsl.md) をサポートします。 |

## セットアップ

1. Slack ワークスペースで Incoming Webhook を作成します
2. Credentials タブで webhook URL を指定して Slack credential を追加します
3. ノード内でその credential を参照します

## 例

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

失敗通知には [Error Handler](./error-handler-node.md) と組み合わせてご利用ください：
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Egress の安全性

- credential に保存された webhook URL は `http://` または `https://` を使用し、パブリックアドレスのみに解決される必要があります。Loopback、プライベート、link-local、マルチキャスト、およびクラウドメタデータ宛の送信先はブロックされます。
- Heym は解決されたアドレスを検証し、送信前に接続先を固定するため、DNS 応答によってチェック後にリクエストが内部アドレスへ転送されることはありません。ガードが有効な間は環境プロキシが無効化され、リダイレクトは追跡されません。
- 内部の webhook レシーバーへ送信するデプロイメントでは、信頼できるセルフホストインスタンス上で `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` を設定できます。ホスト型またはマルチテナントのデプロイメントでは、デフォルト設定のままにしてください。

**v0.0.109 のアップグレードに関する注意：** このチェックは Slack 向けに新たに追加されたものです。webhook URL が loopback またはプライベートアドレスを指している credential は、上記の設定が有効でない限り拒否されます。

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Error Handler](./error-handler-node.md) – Workflow 失敗時に Slack を送信
- [Credentials Tab](../tabs/credentials-tab.md) – Slack webhook の追加
