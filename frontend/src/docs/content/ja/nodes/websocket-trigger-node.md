# WebSocket Trigger

**WebSocket Trigger** ノードは、外部の WebSocket サーバーに対してアウトバウンドのクライアント接続を開き、選択したソケットイベントが発生したときに Workflow を開始します。マーケットフィード、テレメトリ、チャットバックプレーンなどのイベントストリームにご利用ください。内部のリアルタイムシステムへ接続する場合は、後述のプライベート URL オプトアウトが必要です。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| 出力 | `$nodeLabel.eventName`、`$nodeLabel.message`、`$nodeLabel.connection`、`$nodeLabel.close` |

## 重要な動作

- 本ノードは **Heym から別の WebSocket サーバーへ** 接続します。
- Heym 上に WebSocket Endpoint を公開するものでは **ありません**。
- [credential](../reference/credentials.md) は不要です。URL、ヘッダー、サブプロトコルはノード上で直接設定してください。
- リーダーワーカーがバックグラウンドで接続を維持し、有効化されている場合は再接続します。

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `websocketUrl` | string | 外部の `ws://` または `wss://` URL |
| `websocketHeaders` | JSON object string | 任意のハンドシェイクヘッダー |
| `websocketSubprotocols` | string | 任意のカンマ区切りサブプロトコルリスト |
| `websocketTriggerEvents` | array | `onMessage`、`onConnected`、`onClosed` のいずれか |
| `retryEnabled` | boolean | 切断後に再接続するかどうか |
| `retryWaitSeconds` | integer | 再接続までの待機時間 |

## 発行されるイベント

### `onMessage`

リモートソケットからフレームが到着したときに発火します。

有用なフィールド:

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.message.data` | パース済みの JSON Payload、または生のメッセージ値 |
| `$nodeLabel.message.text` | 利用可能な場合の UTF-8 デコード済みテキスト |
| `$nodeLabel.message.base64` | base64 形式のバイナリ Payload |
| `$nodeLabel.message.sizeBytes` | Payload のサイズ |
| `$nodeLabel.message.isJson` | メッセージが JSON としてパースされたかどうか |

### `onConnected`

ソケットが正常に開いた後に発火します。

有用なフィールド:

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | 初回接続時は `false`、以降の再接続時は `true` |
| `$nodeLabel.connection.subprotocol` | ネゴシエートされたサブプロトコル |

### `onClosed`

確立済みの接続が閉じたときに発火します。

有用なフィールド:

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`、`client`、または `unknown` |
| `$nodeLabel.close.code` | WebSocket クローズコード |
| `$nodeLabel.close.reason` | クローズ理由 |
| `$nodeLabel.close.wasClean` | 正常な `1000` クローズの場合は `true` |
| `$nodeLabel.close.reconnecting` | ノードが再接続を試みるかどうか |

## Trigger のセマンティクス

- 1 つのアクティブなノードが、1 つの長期間存続するアウトバウンドソケット接続を維持します。
- 接続は [IMAP Trigger](./imap-trigger-node.md) や [RabbitMQ](./rabbitmq-node.md) の受信モードと同様に、リーダーワーカー上でのみ動作します。
- 再接続が有効な場合、Heym は `retryWaitSeconds` 待機してから、切断後にソケットを再度開きます。
- 発行される各イベントは、`trigger_source = "websocket"` を持つ個別の Workflow 実行を生成します。

## エグレス安全性

- デフォルトでは、URL は `ws://` または `wss://` を使用し、パブリックアドレスのみに解決される必要があります。ループバック、プライベート、リンクローカル、マルチキャスト、およびクラウドメタデータの宛先はブロックされます。
- Heym は再接続のたびに DNS を再検証し、解決されたすべてのアドレスを検証して、それらのいずれかへ直接接続します。ガードが有効な間は、環境プロキシおよび WebSocket リダイレクトが無効化されます。
- 恒久的なポリシー違反は、無期限に再試行するのではなく Trigger を停止させます。一時的な DNS またはネットワーク障害は、引き続きノードの再試行設定に従います。
- `Authorization`、`Origin`、`User-Agent`、およびカスタムデータヘッダーがサポートされています。`Origin` は WebSocket クライアントの専用オプションを通じて送信されます。`Host`、`Connection`、`Upgrade`、および `Sec-WebSocket-*` ヘッダーは上書きできません。
- 内部サービスへ意図的に接続する信頼済みのセルフホストデプロイメントでは、`HEYM_HTTP_ALLOW_PRIVATE_URLS=true` を設定できます。ホスト型またはマルチテナントのデプロイメントでは、デフォルトのままにしてください。

**v0.0.105 のアップグレードに関する注意:** このインスタンス全体のポリシーは、Jira、Sentry、GitHub、Grist、Supabase、ClickHouse、カスタム LLM 実行およびモデル検出、AI アシスタント、ガードレール、および RAG 埋め込みが使用する credential 由来の宛先も保護するようになりました。ループバック、プライベート、またはリンクローカルアドレスを指す既存の credential は、信頼済みのセルフホストインスタンスで `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` が有効化されていない限り拒否されます。ガードが有効な間、ガード対象の HTTP クライアントは `HTTP_PROXY` および `HTTPS_PROXY` を無視します。オプトアウトを有効化すると、これらが復元されます。`SSL_CERT_FILE` または `SSL_CERT_DIR` を通じて設定されたオペレーター CA バンドルは、引き続きサポートされます。ClickHouse は接続が開く前にチェックされますが、clickhouse-connect が独自の urllib3 トランスポートを持ち込むため、ダイヤル時にピン留めされません。

## Workflow の例

**外部イベントストリーム → フィルター → 通知**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** のラベル: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** メッセージ: `"Realtime alert: $streamEvent.message.data.title"`
## ノード JSON の例

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## 関連項目

- [Triggers](../reference/triggers.md) – バックグラウンド Trigger のアーキテクチャと `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Workflow のステップから外部ソケットへデータをプッシュします
- [Node Types](../reference/node-types.md) – すべてのノードの概要
- [Third-Party Integrations](../reference/integrations.md) – どのノードが Credential を使用し、どれが使用しないか
