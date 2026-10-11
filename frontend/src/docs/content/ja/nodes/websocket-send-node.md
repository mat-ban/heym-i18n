# WebSocket 送信

**WebSocket Send** ノードは、外部の WebSocket サーバーへのアウトバウンドクライアント接続を開き、1 件のメッセージを送信して接続を閉じます。Heym が所有するソケットエンドポイントを公開することなく、Workflow からリアルタイムシステムへイベントをプッシュする必要がある場合に使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力 | `$nodeLabel.status`、`$nodeLabel.url`、`$nodeLabel.message_type`、`$nodeLabel.size_bytes` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `websocketUrl` | string / expression | 外部の `ws://` または `wss://` URL |
| `websocketHeaders` | JSON object string / expression | 任意のハンドシェイクヘッダー |
| `websocketSubprotocols` | string | 任意のカンマ区切りサブプロトコルリスト |
| `websocketMessage` | expression | 送信する Payload |

## メッセージシリアライズ規則

- `websocketMessage` が **string** に解決される場合、Heym はテキストフレームを送信します。
- **object**、**array**、**number**、**boolean**、または `null` に解決される場合、Heym は JSON テキストとしてシリアライズします。
- **bytes** に解決される場合、Heym はバイナリフレームを送信します。
- `$input` のような完全な式は、シリアライズ前にネイティブ型を保持します。

## 出力フィールド

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.status` | 成功時は `"sent"` |
| `$nodeLabel.url` | 解決された送信先 URL |
| `$nodeLabel.message_type` | `text`、`json`、または `binary` |
| `$nodeLabel.size_bytes` | Payload のサイズ（バイト単位） |
| `$nodeLabel.subprotocol` | 存在する場合にネゴシエートされたサブプロトコル |
| `$nodeLabel.sent_at` | ISO タイムスタンプ |

## Workflow の例

**HTTP request → transform → publish over WebSocket**

```
input → set → websocketSend → output
```

- **Set** は `{ "type": "user.updated", "user": $input.body }` のような Payload オブジェクトを生成します。
- **WebSocket Send** は `$payloadNode` を `websocketMessage` として使用します。
- **Output** は `$socketSend.status` を返すことができます。

## ノード JSON の例

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## 注意事項

- このノードには [credential](../reference/credentials.md) は不要です。
- リモートサーバーが認証やテナントヘッダーを要求する場合は、`websocketHeaders` を介して渡してください。
- リモートシステムがソケットベースではなくリクエスト/レスポンスベースの場合は、[HTTP](./http-node.md) を使用してください。

## エグレス安全性

- デフォルトでは、URL は `ws://` または `wss://` を使用し、パブリックアドレスにのみ解決される必要があります。Loopback、プライベート、リンクローカル、マルチキャスト、およびクラウドメタデータの宛先はブロックされます。
- Heym は解決されたすべてのアドレスを検証し、それらのアドレスの 1 つに直接接続します。ガードが有効な間は、環境プロキシおよび WebSocket リダイレクトは無効化されます。
- `Authorization`、`Origin`、`User-Agent`、およびカスタムデータヘッダーがサポートされています。`Origin` は WebSocket クライアントの専用オプションを介して送信されます。`Host`、`Connection`、`Upgrade`、および `Sec-WebSocket-*` ヘッダーは上書きできません。
- 内部サービスへの接続を意図的に行う信頼されたセルフホストデプロイメントでは、`HEYM_HTTP_ALLOW_PRIVATE_URLS=true` を設定できます。ホスト型またはマルチテナントのデプロイメントではデフォルトのままにしてください。

**v0.0.105 のアップグレードに関する注意:** このインスタンス全体のポリシーは、Jira、Sentry、GitHub、Grist、Supabase、ClickHouse、カスタム LLM 実行およびモデルディスカバリ、AI アシスタント、guardrails、および RAG embeddings で使用される credential 由来の宛先も保護するようになりました。Loopback、プライベート、またはリンクローカルアドレスを指す既存の credential は、信頼されたセルフホストインスタンスで `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` が有効化されていない限り拒否されます。ガードが有効な間、ガード対象の HTTP クライアントは `HTTP_PROXY` および `HTTPS_PROXY` を無視します。オプトアウトを有効化すると、これらが復元されます。`SSL_CERT_FILE` または `SSL_CERT_DIR` を介して設定されたオペレーター CA バンドルは引き続きサポートされます。ClickHouse は接続が開く前にチェックされますが、clickhouse-connect が独自の urllib3 トランスポートを持ち込むため、ダイヤル時にピン留めされません。

## 関連項目

- [WebSocket Trigger](./websocket-trigger-node.md) – 外部ソケットをリッスンし、イベントで Workflow をトリガーします
- [Node Types](../reference/node-types.md) – 統合ノードの概要
- [Expression DSL](../reference/expression-dsl.md) – 動的な JSON Payload を構築します
- [Third-Party Integrations](../reference/integrations.md) – credential ベースと直接設定の統合
