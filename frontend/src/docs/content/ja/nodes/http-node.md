# HTTP

**HTTP** ノードは、cURL 構文を使用して HTTP リクエストを送信します。Workflow の開始点（入力エッジなし）としても、上流のノードから入力を受け取ることもできます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 または 1 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.status`、`$nodeLabel.body`、`$nodeLabel.headers` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `curl` | string | cURL コマンド（例：`curl -X GET https://api.example.com`） |

## レスポンス形式

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## レスポンスへのアクセス

- `$httpNode.status` – HTTP ステータスコード
- `$httpNode.body` – レスポンスボディ（文字列またはパース済み JSON）
- `$httpNode.body.fieldName` – JSON フィールドへのアクセス
- `$httpNode.headers` – レスポンスヘッダー

## 例

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

cURL 構文を使用し、ヘッダーには `-H`、POST ボディには `-d` などを指定します。式は curl 文字列内のどこにでも使用でき、URL、ヘッダー、あるいはヘッダー行全体に含めることも可能です。[Header credential](../reference/credentials.md) は `key: value` に解決されるため、`-H "$credentials.MyApiKey"` と記述すると完全なヘッダーが送信されます：

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

式内の引用符やスペースは cURL コマンドではなく式に属するため、文字列引数を取るメソッドもインラインで動作します：

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Credential による認証

`$credentials.Name` は [credential](../reference/credentials.md) の種類ごとに異なる値に解決されるため、ヘッダー行は種類によって変わります：

| Credential の種類 | `$credentials.Name` の解決結果 | ヘッダー |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI、Custom、Cohere | 生の API キー | `-H "Authorization: Bearer $credentials.Name"` |
| Google | 生の API キー | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | 生の API キー | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets、Google Drive | 有効期限切れ時に更新される新しい OAuth アクセストークン | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub、Notion、Sentry | トークン | `-H "Authorization: Bearer $credentials.Name"` |

Bearer credential にはすでに `Bearer ` プレフィックスが含まれているため、さらに追加すると `Bearer Bearer …` が送信されてしまいます。Google Sheets および Google Drive の credential を使用すると、そのノードがカバーしていない Google API（スプレッドシートへのタブ追加など）を、credential に付与されたスコープ内で呼び出すことができます。名前が単純な識別子でない場合（`-` を含む、数字で始まる、予約語であるなど）は、ブラケット形式を使用してください：`-H "Authorization: $credentials["my-api-key"]"`。

[AI Assistant](../reference/ai-assistant.md) または [Chat](../tabs/chat-tab.md) が認証を必要とする HTTP リクエストを構築する際に、そのサービスをカバーする専用ノードがない場合、どの credential を使用するかを尋ねられます。1 つ選択し、API が別のヘッダー名を期待する場合は事前入力されたヘッダー名を変更すると、ヘッダー行が自動的に記述されます。アシスタントは credential の名前と種類を参照しますが、その値には決してアクセスしません。適切な credential がない場合は、作成を提案する質問が表示されます。送信された `request.headers` など、ノードの出力に到達するシークレットは、実行結果内でマスクされます。

## 送信の安全性

- デフォルトでは、URL は `http://` または `https://` を使用し、パブリックアドレスにのみ解決される必要があります。ループバック、プライベート、リンクローカル、マルチキャスト、およびクラウドメタデータの宛先はブロックされます。
- Heym は解決されたアドレスを検証し、DNS リバインディングを防ぐために接続先をピン留めします。ガードが有効な間は環境プロキシが無効化されます。リダイレクトはデフォルトでは追跡されません。追跡するには cURL の `-L` オプションを追加してください。有効にすると、各リダイレクトホップが同じパブリックアドレスポリシーに対してチェックされ、接続前にピン留めされます。
- 内部サービスへの接続を意図的に行う信頼されたセルフホスト型デプロイメントでは、`HEYM_HTTP_ALLOW_PRIVATE_URLS=true` を設定できます。ホスト型またはマルチテナントのデプロイメントではデフォルトのままにしてください。

**v0.0.105 のアップグレードに関する注意：** このインスタンス全体のポリシーは、Jira、Sentry、GitHub、Grist、Supabase、ClickHouse、カスタム LLM 実行およびモデル検出、AI アシスタント、guardrails、および RAG 埋め込みで使用される credential 由来の宛先も保護するようになりました。ループバック、プライベート、またはリンクローカルアドレスを指す既存の credential は、信頼されたセルフホスト型インスタンスで `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` が有効になっていない限り拒否されます。ガードが有効な間、ガード対象の HTTP クライアントは `HTTP_PROXY` および `HTTPS_PROXY` を無視します。オプトアウトを有効にすると、これらが復元されます。`SSL_CERT_FILE` または `SSL_CERT_DIR` を通じて設定されたオペレーター CA バンドルは引き続きサポートされます。ClickHouse は接続が開く前にチェックされますが、clickhouse-connect が独自の urllib3 トランスポートを持ち込むため、ダイヤル時にピン留めされません。

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Triggers](../reference/triggers.md) – Workflow のエントリポイントとしての HTTP
- [Credentials Tab](../tabs/credentials-tab.md) – 認証済みリクエスト用の API キーの追加
