# Webhook

Workflowは、HTTP Webhookを介してTriggerできます。標準のexecute EndpointはJSONを返し、ストリーミング版はServer-Sent Events（SSE）を返します。

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

`{workflow_id}` はWorkflowのUUIDに置き換えてください。ベースURLはお使いのHeymインスタンス（例: `https://app.heym.ai`）です。

## リクエストメソッド

各Workflowは1つのHTTP verbを受け付け、エディターのcURLダイアログで選択します: `GET`、`POST`、`PUT`、または `DELETE`。**`POST` がデフォルト**であり、この設定が存在する前に作成されたすべてのWorkflowはこれを維持するため、現在動作しているものが変わることはありません。

異なるverbでWorkflowを呼び出すと、設定されているverbを示す `Allow` ヘッダーとともに `405 Method Not Allowed` が返されます:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

1つの例外として、`?test_run=true` を含むリクエストはチェックをスキップします。これはエディターの **Run** ボタンとデバッグパネルが送信するもので、`GET` に設定されたWorkflowもプロダクト内からテスト可能なままになります。

### ボディを持たないメソッド

`GET` と `DELETE` はリクエストボディを持ちません。入力は代わりにクエリ文字列から取得され、`$input.query.<name>` で読み取られます:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURLダイアログは、これら2つのメソッドではリクエストボディエディターを非表示にし、`Content-Type` ヘッダーを削除します。

`GET` を [HTML output mapper](../nodes/html-output-mapper-node.md) と組み合わせると、ブラウザで直接開けるページを配信できます。

## ストリーミングEndpoint

`POST /api/workflows/{workflow_id}/execute/stream`

単一のJSONレスポンスではなく、インクリメンタルな実行イベントが必要な場合はストリーミングEndpointを使用してください。イベントプロトコルとノードごとの開始メッセージ設定については、[SSE Streaming](./sse-streaming.md) を参照してください。

## リクエストフォーマット

リクエストボディは `body` として [Input](../nodes/input-node.md) ノードに渡されます。Heymは両方のリクエスト形式を受け付けます:

- **Raw JSON** – 例: `{"userId": "123", "action": "create"}`
- **ラップ形式** – `{"inputs": {...}, "test_run": false}`

ラップ形式を使用する場合、`inputs` が抽出され `body` として渡されます。`test_run` はレート制限とレスポンスキャッシュをバイパスします。Raw JSONをPOSTする際に、クエリパラメータとして `?test_run=true` を送信することもできます。

## リクエストボディモード

各Workflowには `webhook_body_mode` 設定があり、エディターがサンプルリクエストをどのように構築するかを制御します:

| モード | 動作 |
|------|----------|
| **defined** | エディターとcURLダイアログは、WorkflowのInputノードフィールドからサンプルボディを形成し、JSON Payload内の空のキーを保持します。既存のdefined形式のcURL Payloadは引き続き動作します。 |
| **generic** | エディターとcURLダイアログは、自由形式のJSONボディを使用します。リクエストボディはそのまま渡されるため、外部アプリは独自の固定Payload形式を送信できます。 |

実行APIはどちらのモードでも後方互換性を維持します。Raw JSONとラップ形式の `{ "inputs": ... }` リクエストは、どちらの場合でも引き続き受け付けられます。

ヘッダーとクエリパラメータは、式内で `$input.headers` および `$input.query` として利用できます。ヘッダーキーは小文字に変換されます。

## 認証

エディター（Workflow設定）でWorkflowごとに構成します。認証は実行前にチェックされます。

| auth_type | 動作 |
|-----------|----------|
| **anonymous** | 認証不要。誰でもEndpointを呼び出せます。 |
| **jwt** | Bearer Tokenが必要。ユーザーセッションToken（ユーザーがWorkflowへのアクセス権を持つ必要あり）またはこのWorkflow用に作成されたスコープ付き [Execution Token](./execution-tokens.md) のいずれかを受け付けます。 |
| **header_auth** | カスタムヘッダーが一致する必要があります。`auth_header_key`（例: `X-API-Key`）と `auth_header_value` を設定します。 |

`header_auth` の場合、リクエストヘッダーの値は設定された値と完全に一致する必要があります。Workflowへのアクセス権を持つJWTユーザーは、カスタムヘッダーなしでも呼び出せます。

`jwt` の場合、外部システムからWorkflowを呼び出す推奨方法は [Execution Token](./execution-tokens.md) です。これらは単一のWorkflowにスコープされ、個別に失効させることができます。

## レスポンスキャッシュ

Workflowごとに `cache_ttl_seconds` を構成します。設定され、0より大きい場合:

- **キャッシュキー**: `workflow_id` + `body` + `query` のSHA256ハッシュ
- **キャッシュヒット**: `status: "cached"` とキャッシュされた出力を即座に返します
- **キャッシュ設定**: 実行が成功した場合（`status: "success"`）のみ
- **ストレージ**: Postgresベースで、バックエンドワーカー間で共有されます

| 設定 | 効果 |
|---------|--------|
| `cache_ttl_seconds` = 0 または null | キャッシュ無効 |
| `cache_ttl_seconds` > 0 | この秒数だけレスポンスをキャッシュ |

`test_run` リクエストはキャッシュをバイパスします（読み取りも書き込みもなし）。

cURLダイアログでレスポンスキャッシュが有効になっている場合、**Clear cache** は現在のWorkflowのキャッシュされたレスポンスを即座に削除します。

## レート制限

Workflowごとに構成します: `rate_limit_requests` と `rate_limit_window_seconds`。

- **スコープ**: `workflow_id` + クライアントIPごと（スライディングウィンドウ）
- **超過時**: `Retry-After` ヘッダー付きのHTTP 429
- **ヘッダー**: `X-RateLimit-Limit`、`X-RateLimit-Remaining`、`X-RateLimit-Reset`

| 設定 | 説明 |
|---------|-------------|
| `rate_limit_requests` | ウィンドウ内で許可される最大リクエスト数 |
| `rate_limit_window_seconds` | ウィンドウの期間（秒） |

`test_run` リクエストはレート制限をバイパスします。

<a id="concurrency-limit-and-queued-runs"></a>

## 同時実行制限とキューに入った実行

ワークフローは、同時に実行される本番実行の数を制限できます。ワークフローレベルの **Properties** パネルで **同時実行制限** を有効にし、**最大同時実行数** を設定します。オーナーおよび編集アクセス権を持つ共同編集者がこれを変更できます。この制限はデフォルトで無効になっています。

制限に達している間、新しい実行は先入れ先出し (FIFO) キューで待機します。これは、すべての本番エントリポイントを対象とします。この endpoint、[ストリーミングEndpoint](./sse-streaming.md)、[Portal](./portal.md)、[Quick Drawer](./quick-drawer.md)、[MCP](../tabs/mcp-tab.md)、および各 [trigger](./triggers.md) です。エディタ自身のテスト実行は常にすぐに開始され、スロットを消費しません。ワークフローを開くことができるサインインセッションなしで `test_run=true` を送信しても、キューをバイパスすることはできません。

| 設定 | 説明 |
|---|---|
| `concurrency_limit` | 同時に許可される本番実行数。`0` で制限が無効になります |
| `concurrency_max_queue` | 任意。同時に待機できる実行数。空の場合は無制限 |
| `concurrency_max_wait_seconds` | 任意。これより長く待機した実行は `expired` として記録されます。空の場合は必要なだけ待機します |

### 202 Accepted

すぐに開始される呼び出しは、レスポンス形式に記載されているとおりに動作します。待機する必要がある呼び出しは、`X-Simple-Response` の値にかかわらず直ちに `202 Accepted` を受け取り、ステータス URL を指す `Location` ヘッダーが返されます:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| フィールド | 説明 |
|---|---|
| `queue.position` | キュー内でのこの実行の位置 (1 から開始) |
| `queue.size` | 現在待機中の実行数 |
| `queue.running` | 現在スロットを保持している実行数 |
| `queue.limit` | ワークフローの同時実行制限 |
| `status_token` | 匿名ワークフローのみ。このレスポンスで一度だけ返されます |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` は実行の状態を返します。実行を開始したのと同じ認証情報 (セッションまたは JWT、[実行トークン](./execution-tokens.md)、またはワークフローのカスタムヘッダー) で呼び出します。匿名ワークフローには確認する認証情報がないため、202 レスポンスからの `status_token` を `X-Heym-Run-Token` ヘッダーで送信します。トークンがクエリ文字列から読み取られることはありません。トークンが間違っているか存在しない場合は、不明な実行と同様に `404` が返されます。

```json
{
  "execution_id": "...",
  "workflow_id": "...",
  "status": "success",
  "queue": null,
  "outputs": { "done": { "result": "ok" } },
  "error": null,
  "execution_time_ms": 5120
}
```

| `status` | 意味 (同時実行スロットを待機する必要がある実行は、代わりに [202 レスポンス](#202-accepted) を受け取ります) |
|---|---|
| `queued` | スロットを待機中。`queue` がその順位を示します |
| `running` | スロットを確保して実行中 |
| `success` / `error` | 完了。`outputs` と `error` が入力されています |
| `pending` | [人間によるレビュー](./human-in-the-loop.md) のため一時停止中 |
| `cancelled` | [実行履歴](./execution-history.md) からキャンセルされました |
| `expired` | `concurrency_max_wait_seconds` を超えて待機し、実行されませんでした |

ステータスが `queued` または `running` でなくなるまで数秒ごとにポーリングします。キューに入れられた実行は、誰もポーリングしなくても実行されます。

### キューが満杯

`concurrency_max_queue` が設定されており、すでにその数の実行が待機している場合、呼び出しは `429 Concurrency queue is full` で拒否され、実行履歴に `queue_full` エントリが記録されます。キューには何も追加されません。

## レスポンス形式

Endpoint は JSON を返します：

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| フィールド | 説明 |
|-------|-------------|
| `workflow_id` | Workflow の UUID |
| `status` | `success`、`error`、`cached`、または `rate_limited` |
| `outputs` | 終端ノードの出力。[JSON output mapper](../nodes/json-output-mapper-node.md) が唯一の終端ノードである場合、レスポンスボディはそのマッピングされたオブジェクトがトップレベルに展開されます（デフォルトのシンプルな JSON レスポンス）。それ以外の場合は、[Output](../nodes/output-node.md) およびその他の終端ノードがラベルをキーとして含まれます。 |
| `execution_time_ms` | 実行時間（ミリ秒単位、cached/rate_limited の場合は 0） |

エラー時には、`outputs` にエラーの詳細が含まれる場合があります。[Throw Error](../nodes/throw-error-node.md) ノードを使用すると、カスタム HTTP ステータスコード（4xx/5xx）を設定できます。

## Run with cURL ダイアログ

ツールバーの **Run with cURL** ボタン（エディター右上、`cURL` アイコン）をクリックすると、現在の Workflow 用の実行可能な cURL コマンドを生成してコピーするダイアログが開きます。

### 機能概要

| フィールド | 説明 |
|-------|-------------|
| **Request Body Mode** | **Defined** または **Generic** を選択します。Generic では、Input フィールドから整形せず、ボディを生の JSON として保持します。 |
| **Authentication** | Anonymous、JWT Token、または Header Auth を選択します。コマンド内の適切な認証ヘッダーを設定します。JWT Token を選択すると、ダイアログに [Execution Token](./execution-tokens.md) マネージャーが表示され、Token を作成または選択してコマンドに直接埋め込むことができます。 |
| **Header Key / Value** | Header Auth を選択した場合に表示されます。Workflow の認証設定から事前入力されます。 |
| **Response Cache** | 同一レスポンスをキャッシュする分数（0 = 無効）。変更は Workflow に保存されます。有効にすると、**Clear cache** でキャッシュされたレスポンスを即座に削除できます。 |
| **Rate Limit** | 時間枠あたりの最大リクエスト数。変更は Workflow に保存されます。 |
| **SSE Streaming** | コマンドを `/execute/stream` に切り替え、`--no-buffer` を追加し、ノードごとの `node_start` メッセージ設定を公開します。 |
| **Body** | JSON リクエストボディ。Defined モードでは [Input](../nodes/input-node.md) フィールドから事前入力され、空のキーも保持されます。Generic モードでは生の JSON エディターになります。 |
| **Command** | cURL コマンド全体の読み取り専用プレビュー。 |

**Copy cURL** をクリックすると、コマンドがクリップボードにコピーされます。

### 例

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Generic モードでは、ネストされた Payload がそのまま保持されます。例：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

このダイアログは、Workflow に保存されている認証、ボディモード、キャッシュ、レート制限の設定を反映しており、ここで編集すると Workflow が即座に更新されます。

### ダイアログでの SSE Streaming

ターミナルから実行をリアルタイムで追跡するコマンドを生成したい場合は、**SSE Streaming** を有効にします。

- Endpoint が `/execute` から `/execute/stream` に変わります
- コマンドに `--no-buffer` と `Accept: text/event-stream` が追加されます
- 各非スティッキーノードがリストに表示され、以下を設定できます：
  - `node_start` メッセージの有効化／無効化
  - 開始メッセージテキストのカスタマイズ
- `node_complete` イベントは常に発行され、ノードの完全な出力が含まれます

例：

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

完全なイベントプロトコルと例については、[SSE Streaming](./sse-streaming.md) を参照してください。

## Trigger Source のタグ付け

すべての実行には `trigger_source` ラベルが保存され、[Execution History](./execution-history.md) で確認できます。任意の値を `X-Trigger-Source` ヘッダーで送信して設定します：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

エディターダイアログの **Copy cURL** ボタンには、`X-Trigger-Source: API` が自動的に含まれます。`API` は任意の意味のある値（`scheduler`、`rabbitmq`、`github-actions` など）に置き換えられます。

ヘッダーが送信されない場合、`trigger_source` はデフォルトで `"API"` となり、履歴では **API** としてラベル付けされます。システムにとって意味のある任意の値（`scheduler`、`github-actions`、`rabbitmq` など）で上書きできます。

## 関連項目

- [Execution Tokens](./execution-tokens.md) – 外部システムから Workflow を呼び出すためのスコープ付き JWT
- [SSE Streaming](./sse-streaming.md) – Server-Sent Events を介してノードイベントをリアルタイムでストリーミング
- [Triggers](./triggers.md) – Webhook を含むすべての Workflow エントリーポイント
- [Workflow Structure](./workflow-structure.md) – ノードとエッジ
- [Expression DSL](./expression-dsl.md) – `$input.body`、`$input.headers`、`$input.query` へのアクセス
