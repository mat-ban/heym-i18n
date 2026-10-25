# SSE Streaming

Workflow は Server-Sent Events（SSE）を使用して、実行イベントをリアルタイムでストリーミングできます。

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

この Endpoint は、[Webhooks](./webhooks.md) に記載されている標準の execute Endpoint と同じ、workflow レベルの認証、レート制限、およびレスポンスキャッシュのルールを使用します。

## cURL ダイアログで SSE を有効化する

エディタで **Run with cURL** ダイアログを開き、**SSE Streaming** を有効にします。

有効にすると、Heym は以下の処理を行います：

- 生成されるコマンドを `/execute` から `/execute/stream` に切り替えます
- `--no-buffer` を追加し、ストリーミングされたイベントがターミナル出力に即座に表示されるようにします
- `Accept: text/event-stream` を追加します
- ダイアログ内でノードごとの `node_start` メッセージを直接設定できるようにします

## イベントプロトコル

各 SSE フレームは、`data: ` をプレフィックスとした改行区切りの JSON です。

| イベントタイプ | 送信されるタイミング | 主要フィールド |
|------------|--------------------|------------|
| `queued` | Workflow が[同時実行制限](./webhooks.md#concurrency-limit-and-queued-runs)に達しています。実行の順番が変わるたびに再送信されます | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | リクエストが受け入れられた直後、またはキューに入った実行が開始されたとき | `execution_id`, `server_now_ms` |
| `node_start` | ノードが実行を開始する直前 | `node_id`、`node_label`、`started_at_ms`、任意の `message` |
| `node_retry` | ノードがリトライするとき | `node_id`、`attempt`、`max_attempts` |
| `node_complete` | ノードが完了した後 | `node_id`、`node_label`、`status`、`output`、`execution_time_ms` |
| `final_output` | Output ノードが早期に結果を返すとき | `node_label`、`output` |
| `execution_complete` | workflow が終了した後 | `status`、`outputs`、`execution_time_ms` |

### キューに入れられた実行

Workflow が同時実行制限に達している場合、実行が待機している間ストリームは開いたまま維持され、`queued` イベントを送信します。キューに入れられた実行はバックグラウンドワーカー（場合によっては別のプロセス）で実行されるため、そのストリームには実行開始時の `execution_started` と終了時の `execution_complete` が含まれますが、その間の `node_start`、`node_complete`、またはトークンイベントは含まれません。その `execution_complete` には空の `node_results` が含まれます。ノードの詳細については、[実行履歴](./execution-history.md)で実行を開いてください。接続を閉じても、キューに入れられた実行はキャンセルされません。キューがいっぱいの場合、ストリームが開く前にリクエストは `429` で応答されます。

## ノードごとの開始メッセージ

cURL ダイアログは、SSE 設定を workflow 自体に保存します：

- **Send start** は、`node_start` イベントに `message` を含めるかどうかを制御します
- **Start message** のデフォルトは `[START] {nodeLabel}` です
- カスタムメッセージをクリアすると、デフォルトのテキストにフォールバックします
- `node_complete` は常に送信され、常にノードの出力を含みます

保存される設定の例：

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## cURL の例

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

イベントストリームのサンプル：

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## セキュリティに関する注意事項

- `anonymous`、`jwt`、`header_auth` の workflow は、通常の webhook Endpoint と同じように動作します
- `cache_ttl_seconds` が設定されている場合、レスポンスキャッシュは引き続き適用されます
- `rate_limit_requests` と `rate_limit_window_seconds` が設定されている場合、workflow のレート制限は引き続き適用されます
- `test_run` は、`/execute` の場合と同様に、キャッシュとレート制限の両方をバイパスします

## 関連項目

- [Webhooks](./webhooks.md) – 標準の execute Endpoint と cURL ダイアログ
- [Parallel Execution](./parallel-execution.md) – ストリーミングが Heym の DAG スケジューラにどのように組み込まれるか
- [Canvas Features](./canvas-features.md) – Run with cURL を含むエディタのコントロール
- [Security](./security.md) – 認証とシークレットの取り扱い
