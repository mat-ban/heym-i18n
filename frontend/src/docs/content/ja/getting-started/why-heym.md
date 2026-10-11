# Heymを選ぶ理由

Heymは、本番環境でAIエージェントを実行・統制するためのインフラストラクチャです。1つのセルフホスト型ランタイムが、エージェントライフサイクルのあらゆる段階をカバーします。

プロトタイプ段階のエージェントには、モデル、Prompt、いくつかのツールがあれば十分です。しかし本番環境のエージェントには、さらにTriggerとリトライ、人が介在するために一時停止した際の状態保存、すべてのモデル呼び出しとツール呼び出しの記録、実行ごとのコスト、変更をリリースする前のテスト、そしてエージェントが単独で実行できる操作の明確な制限が必要です。Heymはこれらすべてを1か所に集約するため、キャンバス上で設計したシステムがそのまま実行されるシステムとなります。エージェントシステムを構築し、自信を持って運用してください。

## エージェントライフサイクルを支える1つのランタイム

| 段階 | Heymが提供するもの |
|---|---|
| **構築** | キャンバス上でエージェントと決定論的ステップを組み合わせる、[AI Assistant](../reference/ai-assistant.md)で生成する、または[Templates](../tabs/templates-tab.md)とポータブルなスキルから始めることができます。 |
| **オーケストレーション** | エージェント、[サブエージェント](../reference/agent-architecture.md)、コーディングエージェント、RAG、ブラウザ自動化、ツールを、明示的なデータフローと[並列実行](../reference/parallel-execution.md)で連携させます。 |
| **実行** | [Webhook](../reference/webhooks.md)、スケジュール、イベント[Trigger](../reference/triggers.md)から実行を開始し、ノード単位のリトライ、[エラーハンドリング](../nodes/error-handler-node.md)、インスタンス間の[負荷分散](../reference/cluster.md)を実現します。 |
| **可観測性** | [履歴](../reference/execution-history.md)、[LLMトレース](../tabs/traces-tab.md)、実行ごとのUSDコスト、キャンバス上のライブ実行、[分析](../tabs/analytics-tab.md)、[アラート](../tabs/alerts-tab.md)、[OpenTelemetry](../reference/opentelemetry.md)エクスポートを通じて、すべての実行を検査できます。 |
| **評価** | [Evals](../tabs/evals-tab.md)でPromptとモデルを期待される出力に対してテストし、LLM-as-Judgeによるスコアリングとモデルの並列比較を行えます。 |
| **統制** | [レビューチェックポイント](../reference/human-in-the-loop.md)と[ガードレール](../reference/guardrails.md)で人による統制を維持し、暗号化された[認証情報](../reference/credentials.md)、[チーム](../reference/teams.md)、[シングルサインオン](../reference/sso.md)、[監査証跡](../reference/audit.md)でアクセスを統治します。 |
| **公開** | WorkflowをRESTおよび[SSE](../reference/sse-streaming.md)、[MCP](../tabs/mcp-tab.md)ツール、[Portal](../reference/portal.md)チャットUI、[ダッシュボード](../tabs/dashboard-tab.md)ウィジェットとして提供します。 |

## 構築

### AI Assistant：自然言語でWorkflowを構築

[AI Assistant](../reference/ai-assistant.md)は、Workflowエディタ内のチャットパネルです。「ユーザー入力を受け取り、ナレッジベースを検索し、GPT-4oで返信するWorkflowを作成して」のように要望を記述すると、アシスタントがノードとエッジを生成し、即座にキャンバスへ適用します。

- 独自のLLM認証情報を使用（サポートされている任意のモデル）
- ハンズフリーでのWorkflow設計のための**音声入力**をサポート
- AI応答から有効なWorkflow JSONを自動的にキャンバスへ適用
- 応答をリアルタイムでストリーミング

アシスタントはエディタ内で直接動作し、ノードをリアルタイムでキャンバス上にストリーミングします。生成されたものはすべて、手動で配置したノードと同様に編集可能な状態を保ちます。

### スキルシステム

スキルはポータブルなケイパビリティバンドルであり、`SKILL.md`命令ファイルとオプションのPythonスクリプトで構成され、任意のAgentノードにドロップできます。

- スキルの命令はエージェントのシステムPromptの先頭に追加されます
- スキル内のPythonファイルは呼び出し可能なツールになります
- スキルはWorkflow間で再利用でき、`.zip`アーカイブとして共有できます

これは、エージェントに職務記述書とツールボックスを一度に渡すことに似ています。

### Workflow Analyzer：実行を考慮したフィードバック

[Workflow Analysis](../reference/workflow-analysis.md)パネルは、エディタに組み込まれた実行を考慮したドキュメントおよびフィードバックツールです。**Analyze**をクリックし、LLM認証情報とモデルを選択すると、Heymが現在のWorkflowに対する編集可能なMarkdownレポートを生成します。

静的なメモとは異なり、アナライザーは可能な場合にまずWorkflowを実行し、その実行結果をPromptに含めます。レポートには改善領域、Workflowの目的、ノードが何を行うかのステップバイステップの説明が含まれます。レポートが既に存在する場合、**Reanalyze**は別のプレビューをストリーミングするため、新しいバージョンを受け入れるか、現在の共有ドキュメントを保持するかを選択できます。

## オーケストレーション

### 組み込みLLMノードとAgentノード

Heymの[Agentノード](../nodes/agent-node.md)は、インラインPythonツール、MCP接続、ポータブルなスキルシステムを備えた、密接に統合されたツール呼び出しループを実行します。これらはすべて本番環境のエージェント向けに設計されています。

Heymのシンプルな[LLMノード](../nodes/llm-node.md)も、単一のPrompt-レスポンスステップを超えた機能を提供します。サポートされているOpenAIおよびOpenAI互換のEndpointでは、**Batch APIモード**に切り替えることができ、1つのノードがPromptの配列を、より低コストなプロバイダー固有のバッチリクエストとして送信します。キャンバスはその後、専用の`batchStatus`ブランチを公開し、バッチが`pending`、`processing`、`completed`などの状態を遷移するたびに発火します。

つまり、LLMノードは同時に2つのことを実行できます：

- メインのバッチリクエストを実行し、通常のブランチで最終的な項目ごとの出力を返す
- フローをカスタムポーリングループにすることなく、意味のあるバッチステータス更新のたびに通知やログ記録のロジックを発火させる

バッチ実行はファーストクラスのLLM Workflowプリミティブであり、ノードUIでプロバイダーとモデルの機能チェックが行われます。

**Agentノード**は、Heymにおけるエージェントオーケストレーションの中核です：

- **ツール呼び出し** – エージェントは最終的な回答を生成するまで、ループ内でツール呼び出しを繰り返します
- **Pythonツール** – 完全なPythonでカスタムツールをインラインで定義でき、エージェントは実行時にそれらを呼び出します
- **MCP接続** – 任意の[Model Context Protocol](https://modelcontextprotocol.io/)サーバー（stdioまたはSSE）に接続すると、エージェントはそのすべてのツールを自動的に取得します
- **スキル** – `.zip`または`.md`ファイルをエージェントにドロップすると、システムコンテキストを拡張し、Pythonツールを追加できます
- **サブWorkflow呼び出し** – エージェントは他のHeym Workflowをツールとして呼び出し、カスタムコードなしで複雑な動作を構成できます

完全なリファレンスについては、[Agentノード](../nodes/agent-node.md)および[エージェントアーキテクチャ](../reference/agent-architecture.md)を参照してください。

### マルチエージェントオーケストレーション

Heymは、ファーストクラスのビジュアルプリミティブを備えた**オーケストレーターパターン**をサポートしています：

- 1つのエージェントが**オーケストレーター**（`isOrchestrator: true`）として機能し、`call_sub_agent`ツールが付与されます
- 同じキャンバス上の名前付き**サブエージェント**にタスクを委任します
- サブエージェントは、他のエージェントやサブWorkflowを呼び出すことができます（最大深度：5）
- **並列実行**：オーケストレーターが1ターンで複数のサブエージェントを呼び出すと、それらは並列で実行され、より高速な結果が得られます

これにより、作業をリサーチャー、コーダー、サマライザーにルーティングするプランニングエージェントのようなアーキテクチャを、カスタムオーケストレーションコードなしで視覚的に構築できます。

実行の詳細については、[エージェントアーキテクチャ](../reference/agent-architecture.md)を参照してください。

### Workflowノードとしてのコーディングエージェント

Heymは、チャット補完ではなく、実際のコーディングエージェントをWorkflowステップとして実行する2つのノードを提供します：

- **[Codexノード](../nodes/codex-node.md)** – 分離されたHeymワークスペース内で、GitHubリポジトリに対してOpenAI Codex CLIを実行します。**Sign in with ChatGPT**（Plus/ProサブスクリプションでのPKCE OAuth、TokenごとのAPIコストなし）またはアクセスTokenをサポートし、リポジトリをクローンしてCodexにコードを編集させ、`summary`、`diff`、`changedFiles`、およびドラフトの`pullRequestUrl`を返します。
- **[OpenCode Goノード](../nodes/opencode-go-node.md)** – プロバイダーに依存しないOpenCodeゲートウェイ（Kimi、DeepSeek、Qwenなど）を介した同じリポジトリWorkflowを、**強化された使い捨てコンテナ**内で実行します：すべてのケイパビリティが削除され、読み取り専用ルート、pid/メモリ/CPU制限が適用されます。GitHub Tokenはサンドボックスの外部に保持されます：HeymがすべてのgitおよびGitHub操作をホスト側で実行するため、生成されたコードがプッシュ認証情報を外部に漏洩させることはできません。

つまり、WorkflowはWebhookからバグをトリアージし、リポジトリをコーディングエージェントに渡し、ドラフトPRを待ち、Slackにリンクを投稿するまでを完全に自動化でき、リソース制限はデプロイメントごとに設定可能です。

### 組み込みRAGパイプライン

Heymには[RAG / Vector Storeノード](../nodes/rag-node.md)と、管理された[Vectorstores](../tabs/vectorstores-tab.md)タブが含まれています。以下のことが可能です：

- ベクターバックエンドの選択：**Qdrant**（外部サーバー）または**Postgres（pgvector）**。後者はHeym自身のデータベースにベクターを保存するため、追加のサービスを実行する必要がありません
- Workflowノードから直接、ドキュメントをベクターストアに挿入
- セマンティック検索を実行し、結果をLLMまたはAgentノードに渡す
- `$ragNode.results.map("item.payload.content").join("\n\n")`のような式で結果を参照

Heymでは、RAGはEmbeddingと検索を完全に制御できる2つのノードです。

### Playwrightによるブラウザ自動化

[Playwrightノード](../nodes/playwright-node.md)は、キャンバス上のファーストパーティのブラウザ自動化です。

- **Stepsモード** – ナビゲート、クリック、タイプ、入力、スクリーンショット、抽出、スクロールの各アクションを視覚的に組み合わせます
- **自動修復機能付きAIステップ** – 自然言語でアクションを記述すると、LLMがPlaywrightアクションを生成します。失敗したセレクターは自動的に修復でき、生成されたステップをキャッシュして将来のLLM呼び出しをスキップできます
- **Run Codeモード** – 複雑なフロー向けにノードを完全なPlaywright Pythonに切り替えます（デフォルトでは無効。有効にするとHeymの強化されたサンドボックス内で実行されます）
- **認証済みセッション** – 実行前にCookie/`storageState`を復元し、セレクターチェックでログインを検証し、スクリプト化されたログインステップにフォールバックします
- **ネットワークキャプチャ** – オプションで、結果とともにJSONレスポンス、ヘッダー、Cookie、ブラウザストレージを収集します

Heymは、ブラウザを他のすべてと同じ式、認証情報、エラー処理を備えた通常のノードとして扱います。

### Expression DSL

Heymの[Expression DSL](../reference/expression-dsl.md)は、上流ノードのデータを参照するためのクリーンで強力な構文を提供します：

- `$input.text` – Inputノードのデータ
- `$nodeName.field` – 任意の上流ノードの出力フィールド
- `$global.variableName` – 永続的なグローバル変数
- 配列ヘルパー：`.first()`、`.map("field")`、`.join("\n")`

Expressionは、Prompt、HTTPヘッダー、条件、設定値など、あらゆる文字列フィールドで動作するため、データはステップ間で明示的に受け渡されます。このDSLは、完全なJavaScriptの知識を必要とせず、強力さと可読性のバランスを実現します。

## Run

### Triggers、Retries、Error Paths

Workflowはさまざまな場所から開始できます。[Input](../nodes/input-node.md)ノードはHTTP [Webhook](../reference/webhooks.md)を受信し、[Cron](../nodes/cron-node.md)はスケジュールで実行され、イベント[Trigger](../reference/triggers.md)はTelegram、Discord、Slack、IMAP受信トレイ、WebSocketストリーム、RabbitMQキュー、ファイルアップロード、Heymプラットフォームイベントから実行を開始します。

障害はグラフ内部で処理されます。任意のノードは、設定された試行回数と試行間の待機時間で失敗時にリトライでき、各試行は[実行履歴](../reference/execution-history.md)に記録され、ノードが失敗すると[Error Handler](../nodes/error-handler-node.md)ノードが自動的に実行されるため、リカバリはWorkflow自体の一部となります。

### 並列DAG実行

HeymのWorkflow実行エンジンは、有向非巡回グラフ（DAG）スケジューラを使用します。独立したノードは設定不要で自動的に並列実行されます。

- 同じ依存レベルのノードはスレッドプール（`max_workers=8`）に同時にディスパッチされます
- いずれかのノードが完了するとすぐに、その下流ノードがスケジュールされます
- [Merge Node](../nodes/merge-node.md)は並列ブランチの結果を統合します
- 複数のWorkflow実行が同時に実行され、各実行は完全に分離されています

並列性はデフォルトの動作であり、グラフ構造によって決定されます。

[Parallel Execution](../reference/parallel-execution.md)を参照してください。

### インスタンス間のスケール

2つ目のHeymインスタンスを同じPostgreSQLデータベースに向けると、ワーカーとして参加します。バックグラウンド実行は設定した重みに従ってインスタンス間で共有され、選出された1つのリーダーがスケジュール、アラート評価、クラッシュリカバリをフェイルオーバーを通じて実行し続け、すべての実行はそれを実行したインスタンスを記録します。[Load Distribution](../reference/cluster.md)を参照してください。

### Agentic Kanban Board

[Boardタブ](../tabs/board-tab.md)は、カラム自体がWorkflowを実行する組み込みのKanbanボードです。カードは、コンテキスト、会話履歴、実行状態、出力、Workflow実行を保持する永続的なエージェントジョブです。

- **カラムWorkflowチェーン** – カードをカラムに移動すると、そのカラムのWorkflowチェーンがTriggerされます。**Agentic Kanban Model**（あなたのCredential + モデル）がカードの内容をWorkflow入力にマッピングし、出力を読みやすいテキストに変換します
- **カード添付ファイル** – カードにファイルをドロップできます。ドキュメントはテキストに抽出され、画像は各実行前にビジョン対応モデルに渡されます
- **ライブ実行キャンバス** – カード内でアクティブな実行を開き、実際のWorkflowキャンバス上でノードごとに実行される様子を確認できます
- **チーム共有** – 読み取り/書き込み権限でボードをユーザーやチームと共有できます。共有ボード上のチェーンはオーナーのCredentialで実行されるため、コラボレーターが自身のCredentialを用意する必要はありません
- **障害の可視性** – 失敗したカードはエラー履歴インジケータを表示し、フォローアップ実行はコメントを待って一時停止できます

ボードはプラットフォームのネイティブなサーフェスです。カード、Workflow、Credential、ライブ実行がすべて1か所に存在します。

### Heym Drive：組み込みファイルストレージ

[Driveタブ](../tabs/drive-tab.md)は、プラットフォームに組み込まれたファイルストアです。スキルとWorkflowによって生成されたファイル（PDF、DOCX、CSV、画像）は自動的にそこに保存され、ボードカードの添付ファイルもそこに保存されます。

- **共有リンク** – 公開またはパスワード保護（Basic Auth）されたダウンロードリンク。有効期限と最大ダウンロード数の制限を任意で設定できます
- **チーム共有** – チームと読み取り専用でファイルを共有し、すべてのチーム共有を1回の操作で削除できます
- **一括操作** – Shiftクリックによる範囲選択で複数選択し、選択したものを単一のZIPダウンロードにまとめたり、1つの共有/パスワード/削除設定を多数のファイルに一度に適用できます
- **Agentアクセス** – スキルはDriveファイルの読み取りをオプトインできるため、Agentはあなたや他のWorkflowが生成したドキュメントを処理できます

生成された成果物は、プラットフォーム内に永続的で共有可能な場所を確保します。

## Observe

### LLM Traces

[Tracesタブ](../tabs/traces-tab.md)は、すべてのLLM呼び出しに対する完全な可観測性を提供します：

- リクエストとレスポンスのPayload
- 呼び出しごとのタイミング：`llm_ms`、`tools_ms`、`mcp_list_ms`
- ツール呼び出しの名前、引数、結果
- モデルに渡されたスキル

Traceシステムは、エージェント動作のデバッグ専用に設計されており、完全なリクエストとレスポンスのPayload、および呼び出しごとのタイミングを提供します。

### LLM Token コスト追跡

Heym 内のすべての LLM 呼び出しは自動的にコスト計算されます。[Traces タブ](../tabs/traces-tab.md)には、Trace ごとの入力 Token 数と出力 Token 数、および同期された価格テーブルから算出されたリアルタイムの USD コストが表示されます。

- **Trace ごとのコスト** – 各 Trace 行に入力 Token、出力 Token、合計 USD が表示されます
- **コスト分析** – KPI カードとモデル別コストチャートが、選択した期間（1h / 24h / 7d / 30d / All）に応じて更新されます
- **LLM Cost Table** – [DataTable タブ](../tabs/datatable-tab.md)のシステムテーブルは 24 時間ごとに Helicone からシードされ、価格の上書きや、まだ掲載されていないモデルのカスタム行の追加が可能です
- **価格未設定の警告** – 価格エントリがないモデルの Trace には、コストテーブルへの直接リンク付きのインライン警告が表示されます

すべての実行は、モデル別に分類された独自の USD コストを保持します。

### 本番実行をライブキャンバスで開く

本番 Workflow は、エディタ外で開始された後も検査可能な状態を維持します。いずれかの History ダイアログから **Running** エントリを開くか、Agentic Kanban カード内のアクティブな実行を開くと、Heym は通常の Workflow エディタをその正確な実行にアタッチします。

- すでに完了したノードは、結果とともに即座に表示されます
- 現在のノードと保留中の下流ノードは、実行の進行に合わせてパルス表示を続けます
- Debug パネルは、キャンバスから開始された実行と同じインクリメンタルなノード結果を受信します
- 最終出力と実行ハイライトは、ポーリングや重複実行の開始なしに到着します
- エディタを閉じてもオブザーバーが切断されるだけで、本番 Workflow がキャンセルされることはありません

オブザーバーは、クロスワーカー実行スナップショットに支えられた SSE を使用するため、別のバックエンドワーカーが実行を所有している場合でも、Webhook、スケジュール、チャット、MCP、統合、Board の各 Trigger で動作します。

### OpenTelemetry、Analytics、Alerts

Heym は、すべての Workflow 実行、ノード実行、Agent ツール呼び出しに対して [OpenTelemetry](../reference/opentelemetry.md) スパンを出力し、OTLP/HTTP 経由で Jaeger、Grafana Tempo、Honeycomb、Datadog、その他の互換バックエンドにエクスポートします。

[Analytics](../tabs/analytics-tab.md) タブは、Workflow ごとの実行回数、成功率、所要時間、トレンドを追跡します。[Alerts](../tabs/alerts-tab.md) は、時間枠内のエラー数、実行時間、Token または USD 消費量、実行量を監視し、選択した通知 Workflow を実行するため、アラートは Slack、メール、Telegram、またはノードが到達できるあらゆる場所に届きます。

## Evaluate

### 組み込み Evals

[Evals タブ](../tabs/evals-tab.md)では、テストスイートを定義し、Agent Workflow に対して実行できます：

- 入力と期待される出力を含むテストケースを作成するか、スイート Prompt から生成します
- 1 つのスイートを複数のモデルに対して実行し、出力を並べて比較します
- Exact Match、Contains、または独立したジャッジモデルによる LLM-as-Judge でスコアリングします
- 合否、実際の出力と期待値の比較、実行履歴を確認します

Prompt やモデルを変更し、スイートを再実行して、変更が本番に到達する前に結果を比較できます。

## Control

### Human-in-the-Loop（HITL）

Heym には組み込みの [Human-in-the-Loop](../reference/human-in-the-loop.md) システムがあり、Agent が実行を一時停止し、人間のレビューを要求し、中断した正確な位置から再開できます。

- **Agent チェックポイント** – 任意の Agent ノードで `hitlEnabled` を有効にすると、`request_human_review` ツールが付与されます。Agent は、人間の監督が必要な判断を下すタイミングを決定し、サマリーとドラフトを添えてツールを呼び出します。
- **公開レビュー URL** – 各レビュー要求は、`/review/{token}`（TTL 168 時間）で安全なワンタイムリンクを生成します。レビュアーはサインインなしで **accept**、**edit & continue**、または **refuse** できます。
- **実行スナップショット** – Workflow は完全な状態（会話履歴、変数、ツール結果）を凍結するため、レビュアーの応答後に一時停止した正確な位置から再開します。
- **通知ブランチ** – オプションの `review` 出力ハンドルにより、レビューが要求されたときに発火する通知フロー（Slack、メール、Webhook）を接続できます。
- **MCP ツール承認ポリシー** – 記述された HITL ガイドラインが承認スコープ（`always` / `once` / `never`）に解釈されるため、Agent は低リスクのツールを自動承認し、高リスクのツールをエスカレーションできます。
- **複数のチェックポイント** – 単一の Agent 実行は、レビューのために複数回一時停止できます。各チェックポイントは独立しています。

公開レビュー URL、edit-and-continue、通知ブランチ、スナップショットベースの再開は、すべて同じ Agent チェックポイントから機能します。

完全なリファレンスについては、[Human-in-the-Loop](../reference/human-in-the-loop.md) を参照してください。

### LLM ガードレール

Heym には、[LLM](../nodes/llm-node.md) ノードと [Agent](../nodes/agent-node.md) ノードの両方に組み込みの [Guardrails](../reference/guardrails.md) があり、モデルの応答が下流のステップに到達する前に安全でないコンテンツをブロックできます。

- **ノードレベルの安全性トグル** – ユーザー向けコンテンツを生成または処理するノードで、ガードレールを直接有効化できます
- **幅広いポリシーカバレッジ** – 暴力、ヘイトスピーチ、性的コンテンツ、NSFW/冒涜、ハラスメント、違法行為、個人データ要求、Prompt インジェクションの試行をブロックします
- **多言語検出** – トルコ語、英語、アラビア語、スペイン語、その他の言語にわたって同じ安全ルールを適用します
- **Workflow ネイティブのフォールバック** – メッセージがブロックされると、ノードは型付き Workflow エラーをスローし、[Error Handler](../nodes/error-handler-node.md) 経由でルーティングできます

安全ポリシーは LLM と Agent の設定内に直接存在し、Workflow の分岐とエラー処理にそのまま接続されます。

### アクセス、Credentials、監査

Agentは実際のCredentialsで動作するため、アクセスはガバナンスの一部です。[Credentials](../reference/credentials.md)は保存時に暗号化され、作成後はマスクされ、ユーザーまたは[チーム](../reference/teams.md)と共有できます。また、チームはWorkflow、変数、ベクターストア、Driveファイルも共有します。[シングルサインオン](../reference/sso.md)は、Okta、Entra ID、Keycloak、Auth0、Googleを含む任意のOpenID Connectプロバイダーと接続できます。[監査証跡](../reference/audit.md)は、セキュリティに関連するすべてのアクションを実行者、対象、結果とともに記録し、お使いのコンテナログとともに、既に運用されているログコレクターまたはSIEMにストリーミングされます。

### セルフホスト型、データはお客様の管理下に

Heymはお客様のインフラストラクチャ上で動作します。Workflow、Credentials、実行履歴、トレースはお客様自身のデータベースに保存され、モデル呼び出しはお客様のサーバーから選択したプロバイダーへ、またはOllamaやvLLMを通じてセルフホストするモデルへ送信されます。機密文書、顧客データ、独自のナレッジベースを処理するAgentにとって、これは多くの場合、必須要件です。

Heymは**MIT License with the Commons Clause条件**の下でライセンスされています。ソースコードはsource-availableです。自由に使用、変更、セルフホストできます。Commons Clauseは、ソフトウェアの販売を制限します。これには、Heymから実質的に価値を得る有償ホスティングやコンサルティング/サポートサービスの提供が含まれます。商用ライセンス、エンタープライズ導入、プロフェッショナルサポートについては、[enterprise@heym.run](mailto:enterprise@heym.run)までお問い合わせください。

## 公開

### APIとストリーミング

WorkflowはHTTP経由で呼び出し可能です。`/api/workflows/{workflow_id}/execute`はJSONを返し、`/api/workflows/{workflow_id}/execute/stream`は実行の進行に合わせてノードイベントをServer-Sent Eventsとしてストリーミングします。どちらもWorkflowレベルの認証、レート制限、レスポンスキャッシュを共有します。[Webhook](../reference/webhooks.md)および[SSEストリーミング](../reference/sse-streaming.md)をご参照ください。

### MCP (Model Context Protocol) 統合

Heymは両側でネイティブな[MCP](../tabs/mcp-tab.md)サポートを備えています：

- **クライアントとして**: AgentノードはstdioまたはSSE経由で外部MCPサーバー（Filesystem、Browserbase、カスタムツール）に接続し、そのツールを自動的に利用します
- **サーバーとして**: MCPを有効にしたWorkflowは、デフォルトサーバーの`/api/mcp/sse`、または独自のURLとAPIキーを持つ名前付きサーバー上のツールとなり、Claude Desktop、Cursor、その他のMCPクライアントがお客様のHeym Workflowを直接呼び出せるようになります

Agentは複数のMCPサーバーを同時に利用でき、任意のWorkflowが外部MCPクライアントのツールとなれます。

### Portal: WorkflowをチャットUIとして公開

[Portal](../reference/portal.md)機能は、任意のWorkflowを`/chat/{slug}`で公開向けチャットインターフェースに変換します：

- ユーザーごとのCredentialsによるオプション認証
- ストリーミング実行（リアルタイムのノード進捗）
- ファイルアップロードのサポート
- マルチターンの会話履歴

チームは、WorkflowとURLだけで、社内ツール、顧客向けチャットボット、AI搭載フォームを提供でき、フロントエンドコードを書く必要はありません。

### Workflow駆動型ダッシュボード

[Dashboardタブ](../tabs/dashboard-tab.md)は、ユーザーが構築するレポート画面であり、すべてのチャートウィジェットは独自の非表示のHeym Workflowによって動作します。ウィジェットはAPIを呼び出し、BigQueryにクエリを実行し、RAG/ベクターストアを検索し、LLMステップを実行し、行を変換し、最後に[Chart Outputノード](../nodes/chart-output-node.md)で完了できます。ウィジェットは手動で作成したり、AIで生成したり、後から微調整したり、結果をキャッシュしたり、グリッドを視覚的に並べ替えたりできます。

## Workflow自動化ツールとの比較

多くのチームがWorkflow自動化ツールを経てHeymにたどり着きます。以下の表では、Agentが本番環境で稼働するようになった際に重要となる機能について、Heymとn8n、Zapier、Make.comを比較し、その下の脚注で比較の根拠となる公式ドキュメントを引用しています。各ツールを個別に詳しく知りたい場合は、[heym.run/compare](https://heym.run/compare)の比較ページをご覧ください。

| 機能 | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| 組み込みLLMノード | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + ステータス分岐 | ✓ | 限定的¹¹ | –¹¹ | 限定的¹¹ |
| 組み込みAgentノード（ツール呼び出し） | ✓ | ✓ | ✓ | ✓ |
| マルチAgentオーケストレーション | ✓ | ✓ | 限定的 | 限定的 |
| コーディングAgentノード（Codex、OpenCode） | ✓ | –²⁰ | –²⁰ | –²⁰ |
| 組み込みRAG / ベクトルストア | ✓ | ✓ | 限定的¹ | プラグイン² |
| WebSocket読み取り / 書き込み | ✓ | 限定的¹² | –¹³ | –¹⁴ |
| 自然言語によるWorkflowビルダー | ✓ | 限定的³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| 実行中のRunをライブキャンバスで開く | ✓ | 限定的¹⁹ | 限定的¹⁹ | –¹⁹ |
| Workflow駆動型ダッシュボード | ✓ | 限定的¹⁷ | 限定的¹⁷ | 限定的¹⁷ |
| Agentic Kanbanボード | ✓ | –²¹ | –²¹ | –²¹ |
| MCP（Model Context Protocol） | ✓ | ✓ | ✓ | ✓ |
| Agent向けSkillsシステム | ✓ | – | – | – |
| 組み込みファイルドライブ（共有リンク、チーム） | ✓ | 限定的²² | 限定的²² | –²² |
| ブラウザ自動化ノード（Playwright） | ✓ | 限定的²³ | 限定的²³ | –²³ |
| LLMトレース検査 | ✓ | 限定的⁴ | – | ✓ |
| OpenTelemetryトレースエクスポート | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM Tokenコスト追跡（USD） | ✓ | –¹⁵ | –¹⁵ | 限定的¹⁵ |
| AI Workflow向け組み込みEval | ✓ | ✓ | – | – |
| Human-in-the-Loop（HITL） | ✓ | ✓⁵ | 限定的⁶ | 限定的⁷ |
| LLMガードレール | ✓ | ✓⁸ | ✓⁸ | 限定的⁸ |
| 自動コンテキスト圧縮 | ✓ | – | – | – |
| 並列DAG実行 | ✓ | 限定的⁹ | – | – |
| セルフホスト可能、ソース公開 | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| 動的データ向けExpression DSL | ✓ | ✓ | 限定的 | ✓ |

> **脚注：** ¹ Zapier Knowledge Sources — 公開されたベクターストアや埋め込み制御はありません。 ² Make.com には Pinecone/Qdrant モジュールがありますが、ネイティブの RAG ノードはありません。 ³ n8n AI Workflow Builder はクラウド限定のベータ版で、クレジット上限があります。 ⁴ n8n は中間ステップを表示しますが、完全なトレーシングにはサードパーティツールが必要です。 ⁵ n8n はチャット、メール、コラボレーションチャネルを通じて AI ツール呼び出しの承認をサポートしますが、Heym のように実行全体をスナップショットして再開することはできません。 ⁶ Zapier Human in the Loop は Zap 内での承認とデータ収集をサポートしますが、公開レビューやスナップショット再開のチェックポイントシステムではありません。 ⁷ Make.com は Human in the Loop を Enterprise アプリとして提供し、レビューリクエストと adjusted/approved/canceled の結果を持ちますが、プラン制限があり、エージェントネイティブ性は低くなっています。 ⁸ n8n は専用の Guardrails ノードを提供し、Zapier は AI 製品全体で AI Guardrails を提供し、Make.com はエージェントルールとレビューフローを文書化していますが、同等のスタンドアロン guardrails 機能はないため、Make は limited としています。 ⁹ n8n はデフォルトで逐次実行し、並列化にはサブ Workflow の回避策が必要です。 ¹⁰ Sustainable Use License — 内部利用のためのセルフホストは無料ですが、商用再配布は制限されています。 ¹¹ 2026年4月22日時点で、n8n の公式ドキュメントはネイティブの LLM バッチステータス分岐ではなく HTTP バッチ処理と loop/wait パターンを説明しており、Zapier の公式 ChatGPT アプリドキュメントには Trigger がなく汎用 API Request ベータのみが記載され、Make の公式 OpenAI 統合ページは create/watch completed のようなバッチアクションを公開していますが、ファーストクラスのステータス分岐 LLM ノードはないため、この特定の Workflow パターンにおいて n8n/Make は limited、Zapier は unavailable としています。 ¹² n8n の公式ドキュメントは HTTP Webhook ノードと HTTP Request ノード、および Code/カスタム/コミュニティによる拡張性を扱っていますが、ファーストパーティの WebSocket Trigger/送信ノードは見つからなかったため、n8n は limited としています。 ¹³ Zapier の公式ドキュメントはインバウンド Webhook とアウトバウンド Webhook/API リクエストを HTTP 経由でのみ扱っており、ネイティブの WebSocket Trigger や送信ステップはありません。 ¹⁴ Make の公式ドキュメントは Webhooks モジュールと HTTP(S) リクエストモジュールを扱っていますが、ネイティブの WebSocket Trigger や送信モジュールは見つかりませんでした。 ¹⁵ n8n にはネイティブの LLM Token コスト追跡がありません。コミュニティの回避策 Workflow は存在しますが、手動インストールと実行後の API 呼び出しが必要です（2026年5月時点で機能リクエストがオープン）。Zapier はユーザーに対して実行ごとの Token 数や USD コストを公開しておらず、AI ステップはタスクのみを消費します。Make.com のクレジットダッシュボードは Make ホスト型 AI の Token 消費を部分的に反映していますが（2025年8月以降）、サードパーティ API キー接続は 1 operation = 1 credit として課金され Token カウントはなく、モデル別の実行ごとの USD 内訳は利用できません。 ¹⁶ Heym はネイティブの OpenTelemetry スパン（Workflow 実行ごとに1つ、加えてノードごとに1つ）を OTLP/HTTP 経由で互換バックエンドに送信し、W3C trace-context 伝播を備え、計装コードは不要で、`HEYM_OTEL_*` 環境変数で設定し、デフォルトでは無効です。n8n には Workflow およびノード実行のための文書化された OpenTelemetry トレーシング統合があります。Zapier と Make.com は 2026年6月時点で Workflow/シナリオ実行の OpenTelemetry エクスポートを文書化していません。 ¹⁷ n8n は本番実行メトリクスのための Insights ダッシュボードを文書化し、Zapier は Zap History と Task Usage を文書化し、Make.com は Scenario History を文書化していますが、これらは監視/履歴のサーフェスであり、Heym の Dashboard タブのように任意の Workflow ロジックに基づくカスタムダッシュボードウィジェットではありません。 ¹⁸ Heym Workflow Analyzer は可能な場合に Workflow を実行し、実行結果を読み取り、改善領域・目的・ステップごとの動作を網羅した共有可能な編集可能 Markdown レポートを生成します。n8n は Workflow の作成/改善/デバッグのための AI Workflow Builder を文書化し、Zapier はエラーになった Zap 実行の AI トラブルシューティングを文書化し、Make.com はシナリオ履歴と AI エージェントの推論ステップを文書化していますが、それらの公開ドキュメントは同じ実行認識型の共有 Workflow 分析ドキュメントを説明していません。 ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) は実行中の実行を一覧表示し、以前の実行からエディタにデータを読み込むことができ、[Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) はエディタで running 状態を公開しています。[Make Scenario History](https://help.make.com/scenario-history) は実行の詳細とログを文書化しています。2026年7月18日に確認したこれらの公開ドキュメントは、Heym の正確なフロー — History または Kanban カードから任意の実行中の本番実行を開き、その現在のノードスナップショットを復元し、同じキャンバス上でノードアニメーションと Debug ログを受信し続ける — を説明していません。 ²⁰ Heym の [Codex](../nodes/codex-node.md) ノードと [OpenCode Go](../nodes/opencode-go-node.md) ノードは、GitHub リポジトリに対して分離された Heym ワークスペースで実際のコーディングエージェント CLI を実行します — clone、編集、diff 生成、ブランチ push、プルリクエスト作成 — をファーストクラスの Workflow ステップとして行います。2026年7月20日時点で、同等のものを文書化している競合他社はありません。n8n の [OpenAI ノード](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) は chat/assistant API 呼び出しを扱いますが、リポジトリレベルのコーディングエージェントではなく、ネイティブの Codex サポートはコミュニティリクエストのままです。Zapier 自身のブログは逆方向 — [Zapier MCP を通じて Codex が Zapier ツールを操作する](https://zapier.com/blog/automate-codex-zapier-mcp/) — を文書化しており、Codex を Zap ステップとして扱っていません。Make.com の OpenAI モジュールは completions/assistants/batch アクションを公開していますが、リポジトリを clone して PR を開くコーディングエージェントではありません。 ²¹ Heym の [Board タブ](../tabs/board-tab.md) は、カラムが Workflow を実行し、カードがコンテキスト・会話履歴・実行状態・実行を保持する、組み込みのエージェント型 Kanban ボードです。n8n（[Kanban Tool 統合](https://n8n.io/integrations/kanban-tool/)）、Zapier（[Kanban Tool 統合](https://zapier.com/apps/kanbantool/integrations)）、Make.com（[Kanban Tool 統合](https://www.make.com/en/integrations/kanban-tool)）は Kanban Tool、Wekan、NocoDB などのサードパーティ kanban アプリに接続するのみで、2026年7月20日時点で自身の Workflow を実行する組み込みボードを文書化しているものはありません。 ²² n8n は実行バイナリデータを内部的に保存します（オプションで [S3 互換外部ストレージ](https://docs.n8n.io/hosting/scaling/external-storage/) 上）が、共有リンクやチーム共有を備えたユーザー向けファイルドライブは文書化していないため、limited としています。Zapier の [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) は Zap 実行の間だけファイルを処理し、[Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) は小さなテキスト値を保持するため、Zapier は limited としています。Make.com の [データストア](https://help.make.com/l6du-data-stores) は構造化レコードを保持し、その[ファイル処理](https://help.make.com/working-with-files)は永続的な組み込みストレージなしでアプリ間でファイルを受け渡すため、Make は unavailable としています。 ²³ Heym の [Playwright ノード](../nodes/playwright-node.md) は、ビジュアルステップモード、AI 生成ステップ、フルコードモードを備えたファーストパーティのブラウザ自動化です。n8n は [n8n-playwright](https://github.com/toema/n8n-playwright) のようなコミュニティパッケージのみを提供しており、[ネイティブのブラウザ自動化ノードの機能リクエスト](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796)は依然オープンであるため、limited としています。Zapier Agents は[ウェブブラウジングと Chrome 拡張機能を通じてページを閲覧・読み取り](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension)できますが、Zapier はスクリプト化されたブラウザ自動化ステップを文書化していないため、limited としています。Make.com は 2026年7月20日時点で、ネイティブのブラウザ自動化モジュールではなく HTTP モジュールとサードパーティのスクレイピングアプリを文書化しています。

## 関連項目

- [はじめに](./introduction.md) – プラットフォームの概要
- [クイックスタート](./quick-start.md) – 最初のWorkflowを構築する
- [Workflow分析](../reference/workflow-analysis.md) – 共有可能な実行対応Workflowレポートと改善フィードバックを生成する
- [Dashboardタブ](../tabs/dashboard-tab.md) – AI生成チャートウィジェットでWorkflowを活用したダッシュボードを構築する
- [Agentノード](../nodes/agent-node.md) – ツール呼び出し、MCP、スキルを備えたLLMノード
- [Agentアーキテクチャ](../reference/agent-architecture.md) – サブエージェント、オーケストレーター、ツールディスパッチ
- [Boardタブ](../tabs/board-tab.md) – Workflowを実行するカラムを備えたエージェント型Kanbanボード
- [Codexノード](../nodes/codex-node.md) – GitHubリポジトリに対してOpenAI Codexコーディングエージェントを実行する
- [OpenCode Goノード](../nodes/opencode-go-node.md) – 堅牢化されたコンテナ内で動作するプロバイダー非依存のコーディングエージェント
- [Driveタブ](../tabs/drive-tab.md) – 共有リンク、チーム、一括操作を備えた組み込みファイルストレージ
- [Playwrightノード](../nodes/playwright-node.md) – AIステップとコードモードを備えたファーストパーティのブラウザ自動化
- [RAG / Vector Storeノード](../nodes/rag-node.md) – ベクトル検索とドキュメント挿入（QdrantまたはPostgres pgvector）
- [AIアシスタント](../reference/ai-assistant.md) – 自然言語によるWorkflowビルダー
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – 公開レビューURLによるAgentチェックポイント
- [Guardrails](../reference/guardrails.md) – 安全でないPromptがモデルに到達する前にブロックする
- [Tracesタブ](../tabs/traces-tab.md) – LLM呼び出しの可観測性
- [Evalsタブ](../tabs/evals-tab.md) – AI Workflow向けのテストスイート
- [Alertsタブ](../tabs/alerts-tab.md) – エラー、実行時間、コスト、実行量に対するしきい値アラート
- [OpenTelemetryトレーシング](../reference/opentelemetry.md) – OTLP経由で実行、ノード、ツールのスパンをエクスポートする
- [負荷分散](../reference/cluster.md) – リーダーフェイルオーバーによるインスタンス間での実行共有
- [シングルサインオン](../reference/sso.md) – 任意のOpenID Connectプロバイダーを通じてサインインする
- [監査ログ](../reference/audit.md) – 実行者、対象、結果を含むセキュリティ関連アクション
- [ポータル](../reference/portal.md) – Workflowを公開チャットUIとして公開する
- [並列実行](../reference/parallel-execution.md) – DAGベースの並行実行
- [MCPタブ](../tabs/mcp-tab.md) – MCPサーバーとクライアントの設定
