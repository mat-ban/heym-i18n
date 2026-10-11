# OpenTelemetry Tracing

Heym は、すべての Workflow 実行、ノード実行、Agent ツール呼び出しに対して [OpenTelemetry](https://opentelemetry.io/) トレースを出力できます。各実行では、ルート span と、ノードおよび Agent ツールごとの子 span が生成されるため、どのステップが失敗したか、どれくらい時間がかかったか、何を呼び出したか、何が返されたかを確認できます。Span は OTLP/HTTP 経由で、Jaeger、Grafana Tempo、Honeycomb、Datadog、New Relic、Grafana Cloud などの互換バックエンドにエクスポートされます。

Tracing は**デフォルトで無効**です。無効の場合、測定可能なオーバーヘッドはなく、span も作成されません。

## Tracing の有効化

バックエンドで以下の環境変数を設定し、再起動してください：

環境変数の完全な一覧については、[Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) を参照してください。

| 変数 | デフォルト | 説明 |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | マスタースイッチ。`true` に設定すると tracing が有効になります。 |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP のベース Endpoint。例：`http://collector:4318`。Heym は `<endpoint>/v1/traces` に span を送信します。 |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | エクスポーター認証用のカンマ区切り `key=value` ヘッダー。例：`authorization=Bearer <token>`。 |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | `service.name` リソース属性。 |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | `0.0` から `1.0` の間のヘッドサンプリング比率。parent-based サンプラーとともに適用されます。 |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | `true` の場合、切り詰められたノードの入力および出力 Payload をノード span に付加します。プライバシー保護のためデフォルトでは無効です。 |

最小構成の例：

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

アプリの **Settings → Observability**（ヘッダーのアバターから開けます）で、有効な設定を確認できます。このパネルは読み取り専用で、エクスポーターのシークレットは表示されません。

## トレース対象

### Workflow ルート span

名前：`heym.workflow.execute`

| 属性 | 説明 |
|-----------|-------------|
| `heym.workflow.id` | Workflow の UUID。 |
| `heym.node.count` | Workflow 内のノード数。 |
| `heym.workflow.test_mode` | テスト実行の場合は `true`。 |
| `heym.sub_workflow.depth` | サブ Workflow として呼び出された場合のネスト深度。 |
| `heym.workflow.status` | 実行の最終ステータス。失敗した実行では span ステータスが `ERROR` に設定されます。 |

### ノード span

名前：`heym.node.execute`。Workflow span の子として作成されます。

| 属性 | 説明 |
|-----------|-------------|
| `heym.node.id` | ノード ID。 |
| `heym.node.type` | ノードタイプ。例：`agent`、`llm`、`http`。 |
| `heym.node.label` | キャンバス上に表示されるノードラベル。 |
| `heym.node.status` | `success` または `error`。エラー時は span ステータスが `ERROR` に設定されます。 |
| `heym.node.duration_ms` | ノード実行時間（ミリ秒）。 |
| `heym.llm.model` | LLM ノードおよび Agent ノードのモデル名（利用可能な場合）。 |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | LLM ノードおよび Agent ノードの Token 使用量（利用可能な場合）。 |

ノードが並列実行される場合でも、Workflow コンテキストがワーカースレッドに伝播されるため、ノード span は Workflow span の下に正しくネストされます。

### Agent ツール span

名前：`heym.agent.tool.execute`。アクティブな Agent ノード span の下に作成されます。

| 属性 | 説明 |
|-----------|-------------|
| `heym.agent.tool.name` | モデルが選択したツール名。 |
| `heym.agent.tool.call_id` | プロバイダーのツール呼び出し ID（利用可能な場合）。 |
| `heym.agent.tool.source` | `node_tool`、`mcp`、`skill`、`sub_workflow` などのツールソース。 |
| `heym.agent.tool.mcp_server` | MCP サーバーラベル（該当する場合）。 |
| `heym.agent.tool.iteration` | Agent ツールループのイテレーション。 |
| `heym.agent.tool.args_bytes` | シリアライズされたツール引数の UTF-8 サイズ。 |
| `heym.agent.tool.result_bytes` | シリアライズされたツール結果の UTF-8 サイズ。 |
| `heym.agent.tool.status` | `success`、`error`、`pending`、`timeout`、または `cancelled`。ツールエラー時は span ステータスが `ERROR` に設定されます。 |

生のツール引数および結果は、デフォルトでは span に付加されません。

## Agent ツール Payload の安全性

永続化される Agent オブザーバビリティ Payload は、コード内で秘匿化および切り詰められます（文字列あたり `4096` 文字、深さ `6`、LLM トレース書き込みあたり合計 `32768` 文字）。トレースの総予算はツールレコード間で分割されるため、早期の大きな結果が後続の呼び出しの識別情報やライフサイクルステータスを隠すことはありません。境界付きの `_generated_files` ダウンロードメタデータは、大きな skill 出力とは別に確保されます：

- LLM トレースの `request` / `response` ツールセクション（トレースストアに書き込まれる `_hitl_pending` コピーを含む）
- 実行履歴に表示される Agent 結果の `tool_calls` レコード
- Live Debug パネルのツール結果イベント。同じ境界付きサニタイズ済みレコードを再利用します

ライブのツール実行、モデルにバインドされたツールメッセージ、およびインメモリの HITL 再開状態（`_hitl_pending.agent_state.messages` / `tool_arguments`）は元の値を保持するため、再開および正確な引数マッチングは引き続き機能します。サニタイズされるのは、保存されたオブザーバビリティのコピーのみです。

## Trace Context Propagation

Heym は [W3C Trace Context](https://www.w3.org/TR/trace-context/) 標準に準拠しているため、Trace はサービス境界を越えても接続された状態を維持します。

- **Inbound Webhook:** 受信リクエストに `traceparent` ヘッダーが含まれている場合、Workflow の実行はその Trace の子として記録されます。これにより、Heym の実行とそれを Trigger した上流システムが関連付けられます。
- **Outbound HTTP:** HTTP ノードは自身が発行するリクエストに `traceparent` を注入するため、下流のサービスは同じ Trace を継続できます。
- **Sub-workflow:** Sub-workflow の実行は、それを呼び出したノードの子として関連付けられ、呼び出し階層が 1 つの Trace 内に保持されます。

Inbound コンテキストを持たない Trigger（Cron、IMAP、RabbitMQ、WebSocket など）は、実行ごとに新しい Trace を開始します。

## Reliability

- 遅延している、または到達不能な Collector が Workflow の実行をブロックすることはありません。Span はバッチ処理され、バックグラウンドでエクスポートされます。
- Tracing の初期化に失敗した場合（例えば、不正な Endpoint など）、バックエンドはエラーをログに記録し、起動に失敗するのではなく Tracing を無効化した状態で処理を継続します。
- OTLP の認証ヘッダーは環境変数からのみ読み取られます。データベースに保存されることはなく、ステータス API から返されることもありません。

## Related

- [Settings](./user-settings.md) – Tracing のステータスを表示する Observability タブ
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 設定の完全なリファレンス
- [Triggers](./triggers.md) – Webhook を含む、Workflow の起動方法
- [Execution History](./execution-history.md) – Heym に組み込まれた実行単位の履歴ビュー
- [HTTP](../nodes/http-node.md) – 下流の呼び出しに Trace コンテキストを伝播するノード
