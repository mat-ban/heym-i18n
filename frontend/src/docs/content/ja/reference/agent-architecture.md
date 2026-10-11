# Agentアーキテクチャ

[Agentノード](../nodes/agent-node.md)は、サブエージェント、サブWorkflow、キャンバスノードツール、オーケストレーターパターン、スキル、MCP接続、ツール呼び出し、オプションの[永続メモリ](./agent-persistent-memory.md)（キャンバスノード単位、他のエージェントへのオプション共有あり）、およびオプションの[ヒューマンレビュー](./human-in-the-loop.md)をサポートします。本ページではそのアーキテクチャについて説明します。

## サブエージェント

サブエージェントとは、オーケストレーターが `call_sub_agent` ツールを通じて呼び出すことができるAgentノードです。

- **オーケストレーター**: `isOrchestrator: true`、`subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **サブエージェント**: オーケストレーターのPromptを受け取るため、User Message内で `$input.text` を使用する必要があります
- **ツール**: `call_sub_agent`（`sub_agent_label`（enum）と `prompt` を指定）
- **深度制限**: ネストされたサブエージェント呼び出しは最大5階層まで

### 実行フロー

1. オーケストレーターがサブエージェントの呼び出しを決定します
2. `_execute_sub_agent_tool` がラベルによって対象のエージェントを検索します
3. `synthetic_inputs = {"input": {"text": prompt}}` を構築します
4. サブエージェントに対して `_execute_agent_node` を実行します
5. 結果がオーケストレーターに返されます

### サブエージェントの並列実行

オーケストレーターが1ターン内で複数の `call_sub_agent` ツール呼び出しを返した場合、それらは**並列**に実行されます。たとえば、ユーザーが「Paris」について質問し、オーケストレーターが `distanceAgent` と `foodAgent` の両方を呼び出した場合、両方が順次ではなく同時に実行されます。

- **メリット**: 合計時間はすべての合計ではなく、最も遅いサブエージェントとほぼ同じになります。
- **ヒント**: タスクで必要とされる場合は、オーケストレーターが1ターン内で複数のサブエージェントを呼び出すように促してください。

## サブWorkflow

`subWorkflowIds` が設定されている場合、エージェントは `call_sub_workflow` ツールを通じて他のWorkflowを呼び出すことができます。

- **設定**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **ツール**: `call_sub_workflow`（`workflow_id`（enum）と `inputs`（object）を指定）
- **深度制限**: ネストされたサブWorkflow呼び出しは最大5階層まで

### 実行フロー

1. エージェントがサブWorkflowの呼び出しを決定します
2. `_execute_sub_workflow_tool` が `workflow_cache` からWorkflowを取得します
3. `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}` を構築します
4. サブWorkflowに対して `WorkflowExecutor.execute()` を実行します
5. 結果がエージェントに返されます

サブWorkflowはv1ではHITLのために一時停止できません。ネストされたサブWorkflowが保留中のレビュー状態に入ろうとした場合、ネストされた呼び出し内で中断されるのではなく、実行が失敗します。

## キャンバスノードツール

キャンバスノードツールとは、`tool-input` ハンドルを通じてエージェントに接続されたWorkflowノードです。エージェントのセットアップ中に、`_build_node_tool_schemas` がそれらのエッジをスキャンし、接続されたノードごとに1つのOpenAI互換ツールスキーマを追加します。

- **ツールソース**: `_source: "node_tool"`
- **ツール名**: 接続されたノードのラベルから生成され、重複にはサフィックスが追加されます
- **ツールパラメータ**: ノードの `agentProvidedFields` から構築されます
- **固定フィールド**: `agentProvidedFields` にリストされていないすべてのノードフィールドは、ノード設定内に残ります

### 実行フロー

1. エージェントが接続されたノードツールの呼び出しを決定します
2. `_execute_node_tool` がノードデータをコピーします
3. エージェントが提供した引数が、設定済みのノードフィールドにマージされます
4. `execute_node` がブランチスケジューリングを無効にしてそのノードを1回実行します
5. 元のノードデータが復元されます
6. ノードの出力がツール結果としてエージェントに返されます

ツールノードは通常のWorkflowスケジューリングから除外されるため、二重に実行されることはありません。これらはエージェントのツール呼び出しパスを通じてのみ実行されます。

## ヒューマン・イン・ザ・ループ

エージェントに `hitlEnabled` が設定されている場合、エージェントは特定の承認チェックポイントで呼び出すことができる `request_human_review` ツールを受け取ります。

1. システムPromptとノードのHITLガイドラインが、どのアクションに承認が必要かをエージェントに伝えます
2. エージェントがそれらのステップのいずれかに到達すると、`request_human_review` を呼び出します
3. HeymがWorkflow実行スナップショットを保存し、公開レビューリクエストを作成します
4. ノード結果がレビューURLとともに `pending` としてマークされます
5. エージェントの `review` 出力ハンドルが即座にスケジュールされ、通知ブランチが保留中のPayloadで実行できるようになります
6. レビュアーが応答するまで、メイン実行のスケジューリングが停止します
7. `accept`、`edit`、または `refuse` 時に、保存されたスナップショットからエグゼキューターが再構築されます
8. 一時停止されたエージェントは承認されたレビューコンテキストで続行するか、`refuse` の場合は即座に終了します
9. 再開されたエージェントの完了後、`review` ブランチを再実行することなく、下流のノードが続行します
10. 後続のアクションにも承認が必要な場合、エージェントは同じ実行内で別のHITLチェックポイントを作成できます

レビュアー向けのサマリーはレビューリクエスト自体から生成されるため、ノードフィールドは承認ポリシーとタイミングに集中したままにできます。

これにより、エージェントWorkflowは会話履歴、完了したノード出力、ループ状態、その他のランタイムコンテキストを保持しながら、外部承認を待つことができます。

## オーケストレーターツールエグゼキューター

カスタムツールエグゼキューターは以下をルーティングします：

- **サブエージェント呼び出し**（`_source == "sub_agent"`）→ `_execute_sub_agent_tool`
- **サブWorkflow呼び出し**（`_source == "sub_workflow"`）→ `_execute_sub_workflow_tool`
- **キャンバスノードツール**（`_source == "node_tool"`）→ `_execute_node_tool`
- **ヒューマンレビュー**（`_source == "hitl"`）→ 保留中のHITLチェックポイントを作成
- **その他のツール** → `_unified_tool_executor`（Python、MCP、スキルツール）

これは、HITLが有効な場合、`subAgentLabels` を伴う `isOrchestrator` が設定されている場合、または `subWorkflowIds` が設定されている場合に使用されます。

## Skills

SkillsはAgentのシステムコンテキストを拡張し、Pythonツールを追加できます。

- **Shape**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Content**: システム指示の先頭に追加されます（`---` で結合）
- **Python tools**: `.py` ファイルを含む各Skillに対して、`skill_{skill_name}` ツールが追加されます
- **Execution**: `skill_python_executor.py` が一時ディレクトリ内で `uv run python` によりスクリプトを実行します。引数はJSONとしてstdinに、結果はJSONとしてstdoutに渡されます

Skillsは、[Agent Node](../nodes/agent-node.md) 設定のSkillsエリアに `.zip` または `.md` ファイルをドロップすることで追加できます。

## MCP Client

MCP（Model Context Protocol）クライアントは、外部ツールサーバーに接続します。

- **Transports**: `stdio`（command + args）または `sse`（url + headers）
- **List tools**: `list_mcp_tools` → `ClientSession.list_tools()` → `_source: "mcp"` を付けてOpenAI function形式に変換
- **Execute**: `execute_mcp_tool` → `ClientSession.call_tool()` → `_extract_tool_result` 経由で結果を取得

MCP接続は、[MCP Tab](../tabs/mcp-tab.md) またはAgentノードの `mcpConnections` で設定します。

## Tool Calling

LLMサービスは `execute_with_tools` ループを実行します：

1. **Context compression check** — 各イテレーションの前に、Token使用量を見積もり、必要に応じて圧縮します（後述）
2. `tools` と `tool_choice: "auto"` を指定してモデルを呼び出します
3. `tool_calls` が存在する場合：各呼び出しに対して `tool_executor(tool_def, name, args, timeout)` を実行します
4. ツール結果をメッセージに追加し、繰り返します
5. ツール呼び出しがなくなるか、`max_tool_iterations` に達したら停止します

### Tool Dispatch

`_unified_tool_executor` は `_source` に基づいてルーティングします：

| Source | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (default) | `execute_tool`（Pythonコードツール） |

ツールはOpenAI function-calling形式を使用します：`name`、`description`、`parameters`（JSON schema）。

## Context Compression

長時間実行されるAgentでのコンテキストオーバーフローを防ぐため、Heymは各ツールイテレーションの前に蓄積された `messages` リストを自動的に圧縮します。

### Algorithm

1. **Estimate tokens**: すべてのメッセージにわたって `total_chars / 4` を計算します（高速で、tokenizerは不要）
2. **Threshold check**: `estimated_tokens < context_limit × 0.80` の場合、圧縮をスキップします
3. **Context limit**: `client.models.retrieve(model).context_window` を試行します。失敗した場合は組み込みテーブル（`gpt-4o` → 128K、`claude-3-5-sonnet` → 200K、`gemini-2.0-flash` → 1M など）にフォールバックします。デフォルトは128Kです
4. **Anchor preservation**: 以下は常に保持します
   - 最初の `system` メッセージ（Agentの識別情報と指示）
   - 最初の `user` メッセージ（元のタスク）
   - 最後の `user` メッセージ（最新の指示）
5. **Summarize middle**: 最初と最後のuserメッセージの間にあるすべての内容をシリアライズし、要約Promptとともに同じモデルに送信します
6. **Rebuild**: `[system, first_user, assistant(summary), last_user]`

異なるuserメッセージが2つ未満の場合（要約対象の中間部分がない場合）、またはLLM要約呼び出しが失敗した場合（安全なフォールバック：元のメッセージを返す）は、圧縮はスキップされます。

### Observability

各圧縮イベントは次のように記録されます：
- `tool_calls_collected` 内の `_context_compression` エントリ → Execution Historyの実行詳細で確認できます
- `phase: "compression"` を持つ `on_tool_call` イベント → Debugパネルで `Context compressed (N messages → summary)` としてレンダリングされます
- `context.compression` LLM traceエントリ → Tracesタブで圧縮前後のToken見積もりとともに確認できます

Agentのツール呼び出しは、より豊富なObservabilityも出力します：

- `tool_calls` 上の呼び出しごとのライフサイクルフィールド：`tool_call_id`、`status`（`success` / `error` / `pending` / `timeout` / `cancelled`）、`started_at`、`finished_at`、`elapsed_ms`
- Agent結果上の集約 `tool_metrics`（ステータス別のカウントと合計/最大所要時間）。`_context_compression` エントリはこれらのカウントから除外されます
- オプトインのOpenTelemetry子スパン `heym.agent.tool.execute`（[OpenTelemetry Tracing](./opentelemetry.md) を参照）
- 永続化されるLLM trace / execution-historyの `tool_calls` Payloadは秘匿化され、サイズが制限されます。ライブのHITL再開状態はマッチング用に元のデータを保持します

## Related

- [Why Heym](../getting-started/why-heym.md) – Agentライフサイクル全体にわたるマルチAgentオーケストレーション
- [Agent Node](../nodes/agent-node.md) – 設定とパラメータ
- [Agent Persistent Memory](./agent-persistent-memory.md) – Agentノードごとのナレッジグラフとピア共有
- [Human-in-the-Loop](./human-in-the-loop.md) – レビューリンク、保留中のPayload、再開の動作
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow、ノード、Agentツールのスパン
- [Node Types](./node-types.md) – Agentおよび関連ノード
- [Parallel Execution](./parallel-execution.md) – DAGベースおよびサブAgentの並列実行
- [MCP Tab](../tabs/mcp-tab.md) – MCP接続の設定
- [Expression DSL](./expression-dsl.md) – サブAgent用の `$input.text`
