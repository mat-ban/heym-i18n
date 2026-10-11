# Tracesタブ

**Traces**タブには、LLMの実行トレースが表示されます。リクエスト/レスポンスのPayload、タイミング、ツール呼び出しを確認し、[Agent](../nodes/agent-node.md)ノードと[LLM](../reference/node-types.md)ノードの動作をデバッグできます。また、任意の時間枠における集計メトリクス（呼び出し回数、Token、コスト、レイテンシ、エラー率）も確認できます。

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Tracesデモを視聴する</a></p>

## 統計ヘッダー

ページ上部には、選択した時間範囲とその他の有効なフィルターに基づいて集計された統計サマリーが、トレースリストの上に表示されます。

- **KPIカード** – 合計呼び出し回数、合計Token、合計コスト（USD）、平均レイテンシ、エラー率
- **Tokens by Model** – モデルごとのToken量を示すドーナツチャート
- **Cost by Model** – モデルごとのUSD支出を示すドーナツチャート。価格が設定されていないモデルには、[LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)への「Configure pricing」リンクが表示されます
- **Calls Over Time** – バケットごとの成功/失敗呼び出しを示す積み上げ面グラフ（5分 / 1時間 / 6時間 / 1日。範囲に応じて自動選択）
- **Unpriced models notice** – トレースされたモデルの中に価格行がないものがある場合、チャートの下に表示され、LLM Cost Tableへリンクします

## 時間範囲

フィルターバーの上部にある単一の**Time range**セレクターが、統計ヘッダーとトレースリストの両方を制御します。選択肢は、Last 1 hour、Last 24 hours、Last 7 days（デフォルト）、Last 30 days、All timeです。範囲を変更するとページネーションがリセットされ、チャートとリストが同時に再読み込みされます。

## トレースリスト

- 選択した時間範囲内の最近のトレースのページネーション付きリスト
- 各トレースには、Workflow、ノード、Credential、タイムスタンプ、所要時間が表示されます
- トレースをクリックすると詳細ビューが開きます
- 詳細ダイアログ内の**Prev / Next**を使用すると、ダイアログを閉じずにトレース間を移動できます

## フィルタリング

- **Time range** – 1h / 24h / 7d / 30d / All。チャートとリストをまとめてフィルタリングします
- **Credential** – 使用されたCredential（APIキー）でフィルタリングします
- **Source** – Workflowまたは実行ソースでフィルタリングします
- **Search** – モデル、Workflow、Credential、またはノードラベルで検索します
- **Refresh** – 現在のトレースページを再読み込みします

## トレース詳細

トレースを開くと、以下が表示されます。

- **Steps** – トレースを順序付けられたチェーンとして上から下に読み取るタイムライン：System → User → Assistant → Tool → Answer。各ステップは折りたたみ可能で、展開すると読みやすい詳細（メッセージテキスト、またはツールの引数と結果）と、そのステップのJSONが表示されます。MCP呼び出しやJSON-RPC Payloadを含むすべてのイベントタイプのJSONコンテンツは、デフォルトで展開可能なツリーとして開き、最初のレベルが展開されます。**Tree / Raw**を使用すると、整形された構造と元のテキストを切り替えられます。不正な形式のJSONはプレーンテキストとして表示されたままです。ツールステップには、該当する場合に所要時間とMCP/Skillバッジが表示され、ツール呼び出しのステータスが設定されている場合はpending / timeout / cancelledバッジも表示されます。Answerステップには、集計された`tool_metrics`バッジ（ステータス別の呼び出し回数とツールの合計所要時間）を表示できます。Dashboard ChatメッセージやルーティングされたAgentのように、トレースが各モデル呼び出しを記録する場合、要求されたツールを呼び出す前に**LLM**ステップが配置され、**Duration Breakdown**がすべてのモデル呼び出し、ツール、ルーティング判断を1つのタイムライン上に展開します。Dashboard Chatメッセージは、ツールラウンドが何回必要であっても、単一のトレースです。メッセージチェーンを持たないトレース（例：画像生成）は、最小限のRequest → Responseタイムラインを表示します。
- **Request** – LLMに送信された完全なリクエストPayload。**Tree / Raw** JSONビュー付き
- **Response** – モデルのレスポンス。ツール呼び出しがある場合はそれも含み、**Tree / Raw** JSONビュー付き
- **Tool metrics** – レスポンスに存在する場合、ツール呼び出し回数（`success` / `error` / `pending` / `timeout` / `cancelled`）とツールの合計所要時間の簡潔なサマリー
- **Timing breakdown** – パフォーマンス分析用の`llm_ms`、`tools_ms`、`mcp_list_ms`
- **Tool calls** – ツール名、引数、結果、ステータス、経過時間
- **Skills included** – リクエスト内でモデルに渡されたSkills
- **Go to Workflow** – トレース詳細ダイアログから関連するWorkflowへ直接ジャンプします

## コピーとエクスポート

- リクエストまたはレスポンスのJSONをクリップボードにコピーします。コピーは常に、アクティブなビューに関係なく完全な生のPayloadを使用します
- デバッグやサポートへの共有に使用します

## メンテナンス

- **Clear All** – 確認後、保存されたすべてのトレースを削除します
- ページネーションコントロールには、現在表示されている範囲が表示されます（例：`1-25 of 240`）

## 関連項目

- [Why Heym](../getting-started/why-heym.md) – Agentライフサイクル全体にわたるLLMオブザーバビリティ
- [Agent Node](../nodes/agent-node.md) – ツール呼び出しを備えたAgentノード
- [Node Types](../reference/node-types.md) – LLMノードとAgentノード
- [Credentials Tab](./credentials-tab.md) – トレースで使用されるCredential
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Workflow、ノード、AgentツールスパンのオプトインOTelエクスポート
- [DataTable Tab](./datatable-tab.md) – コストチャートで使用されるLLM Cost Tableをホストします
- [Contextual Showcase](../reference/contextual-showcase.md) – ダッシュボード画面向けのコンパクトなページガイド
