# 全機能セット

Heym のすべての機能を包括的に概観します。各セクションでは、機能または概念を数文で説明します。

---

## はじめに

### [Introduction](../getting-started/introduction.md)

Heym は、本番環境で AI エージェントを実行および統制するためのインフラストラクチャです。ビジュアルキャンバス上でエージェントシステムを構築し、自信を持って運用できます。エージェントのオーケストレーション、ビジネスプロセスの自動化、すべての実行の検査、そして自社インフラストラクチャ上での人間による制御を維持できます。ビジュアル Workflow、AI 搭載ノード（[LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[Qdrant RAG](../nodes/rag-node.md)）、[AI Assistant](./ai-assistant.md)、各種インテグレーション（[HTTP](../nodes/http-node.md)、[GitHub](../nodes/github-node.md)、[Jira](../nodes/jira-node.md)、[Notion](../nodes/notion-node.md)、[WebSocket Send](../nodes/websocket-send-node.md)、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、受信 [IMAP Trigger](../nodes/imap-trigger-node.md) メール、送信 [Send Email](../nodes/send-email-node.md)）、[Cron](../nodes/cron-node.md) によるスケジューリング、そしてエンドユーザー向けの [Portal](./portal.md) チャットポータルをサポートしています。

[Core Concepts](../getting-started/core-concepts.md)、[Node Types](./node-types.md)、[Third-Party Integrations](./integrations.md) もご参照ください。

### [Why Heym](../getting-started/why-heym.md)

Why Heym では、エージェントのライフサイクル（構築、オーケストレーション、実行、観測、評価、制御、公開）をたどり、各段階で単一のセルフホスト型ランタイムが何を処理するかを示します。これには、ツール呼び出し、Python ツール、[MCP](../tabs/mcp-tab.md) 接続、スキル、マルチエージェントオーケストレーションを備えた [LLM](../nodes/llm-node.md) ノードと [Agent Node](../nodes/agent-node.md)、Trigger、リトライ、[load distribution](./cluster.md)、実行ごとの USD コストと OpenTelemetry エクスポートを備えた [Traces](../tabs/traces-tab.md)、[Evals](../tabs/evals-tab.md)、[human review checkpoints](./human-in-the-loop.md)、ガードレール、SSO、監査証跡、そして REST、MCP、Portal の各 Endpoint が含まれます。n8n、Zapier、Make.com との機能比較でページを締めくくります。

[Agent Node](../nodes/agent-node.md)、[LLM](../nodes/llm-node.md)、[Qdrant RAG](../nodes/rag-node.md)、[Agent Architecture](./agent-architecture.md) もご参照ください。

### [Quick Start](../getting-started/quick-start.md)

数分で最初の Workflow を実行できます。[Workflows](../tabs/workflows-tab.md) タブから Workflow を作成し、[Input](../nodes/input-node.md) ノード、[LLM](../nodes/llm-node.md) ノード、[Output](../nodes/output-node.md) ノードを追加して接続します。[LLM](../nodes/llm-node.md) に credential を設定し、`userMessage` を `$input.text` に設定します。Run または [AI Assistant](./ai-assistant.md) を使用して、自然言語で Workflow を実行または生成できます。

[Input](../nodes/input-node.md)、[LLM](../nodes/llm-node.md)、[Output](../nodes/output-node.md)、[Expression DSL](./expression-dsl.md) と自然に組み合わせて使用できます。

### [Core Concepts](../getting-started/core-concepts.md)

Workflow は、エッジで接続されたノードの有向グラフです。実行は Trigger ノード（[Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)）から処理ノードを経て [Output](../nodes/output-node.md) ノードへと流れます。各ノードは type、data（設定）、inputs/outputs を持ち、エッジがデータフローを定義します。ノードは [Expression DSL](./expression-dsl.md) 式（`$nodeLabel.field` など）を介して上流のデータを参照します。独立したノードは自動的に[並列](./parallel-execution.md)で実行されます。

[Triggers](./triggers.md)、[Parallel Execution](./parallel-execution.md)、[Workflow Structure](./workflow-structure.md) もご参照ください。

### [Running & Deployment](../getting-started/running-and-deployment.md)

Heym は、ローカル開発用の `run.sh`（Docker 内のデータベース、FastAPI バックエンド、Vite フロントエンド）と、Docker Compose を使用した本番用の `deploy.sh` を提供します。どちらも `.env` ファイルを使用し、主要な変数には `SECRET_KEY`、`ENCRYPTION_KEY`、`DATABASE_URL`、`ALLOW_REGISTER` が含まれます。開発環境は設定可能なフロントエンドおよびバックエンドのポートで実行され、本番環境ではフロントエンドコンテナを通じて `/api` 配下で API を提供します。

[Security](./security.md)、[Enterprise](./enterprise.md)、[Settings](./user-settings.md) もご参照ください。

### [Migrate to Heym](../getting-started/migrate-to-heym.md)

AI Convert ツールは、他のプラットフォーム（n8n、Flowise、Dify、Langflow、sim.ai、Activepieces）の Workflow または平易な英語の説明を Heym Workflow に変換し、キャンバス上にライブでストリーミングして、[ダウンロードおよびインポート](./download-import.md)できる状態にします。AI 安全性チェックを実行した後、input とレート制限を設定した状態で DSL を生成します。[heym.run/convert](https://heym.run/convert) で開くことができます。

[Quick Start](../getting-started/quick-start.md)、[Download & Import](./download-import.md)、[AI Assistant](./ai-assistant.md) もご参照ください。

---

## ノード

### Triggers
#### [Input](../nodes/input-node.md)

Input ノードは、ユーザーまたは API 呼び出し元からデータを受け取る Workflow のエントリーポイントです。単一または複数の入力フィールドをサポートし、リクエストのメタデータ（headers、query params）を公開します。body フィールドには `$nodeLabel.body.fieldKey`、headers には `$nodeLabel.headers`、query には `$nodeLabel.query` でアクセスできます。

[Condition](../nodes/condition-node.md)、[LLM](../nodes/llm-node.md)、[Output](../nodes/output-node.md) と自然に組み合わせて使用できます。Payload の参照とフィールドアクセスについては、[Expression DSL](./expression-dsl.md) および [Webhooks](./webhooks.md) をご参照ください。

#### [Cron](../nodes/cron-node.md)

Cron ノードは、標準的な 5 フィールドの cron 式を使用してスケジュールに従い Workflow をトリガーします。ユーザー入力は不要で、指定された時刻（例：毎時、毎日、15 分ごと）に Workflow が自動的に実行されます。出力は Payload を持たない Trigger イベントです。

スケジュール実行と遅延実行については、[Triggers](./triggers.md)、[Wait](../nodes/wait-node.md)、[Execution History](./execution-history.md) もご参照ください。

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

IMAP Trigger ノードは、設定可能な分間隔で受信トレイをポーリングし、新たに検出されたメールごとに Workflow を開始します。解析済みの headers、送信者および受信者のリスト、プレーンテキストおよび HTML の本文、添付ファイルのメタデータ、Trigger のタイムスタンプを出力します。サポート受信トレイのトリアージ、メールボックスから [Slack](../nodes/slack-node.md) へのルーティング、[Human-in-the-Loop](./human-in-the-loop.md) を用いたメール駆動の承認フローなどにご活用ください。

受信内容のトリアージと応答 Workflow には、[Send Email](../nodes/send-email-node.md)、[LLM](../nodes/llm-node.md)、[Slack](../nodes/slack-node.md) と組み合わせて使用できます。

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Heym Trigger ノードは、Heym 自身がプラットフォームイベント（`heym.started`、`workflow.created`、`workflow.updated`、`workflow.deleted`）を発行した際に Workflow を開始します。配信はバッチ処理され、1 つの 5 秒間のディスパッチウィンドウ内で発行されたすべてのイベントが、単一の実行で `$nodeLabel.events` として到着します（常に配列です）。各イベントは一意のデータベース制約を通じて取得されるため、稼働している worker、container、マシンの数に関わらず、購読しているノードごとに正確に 1 回だけ発火します。Workflow 変更の監査証跡、デプロイの通知、インスタンスのヘルスダイジェストなどにご活用ください。

変更された Workflow を参照するには [Heym](../nodes/heym-node.md) ノードと、イベントごとに 1 回処理を実行するには [Loop](../nodes/loop-node.md) と組み合わせて使用できます。

#### [Heym](../nodes/heym-node.md)

Heym ノードは、3 つの操作を通じて Heym 自身のデータを読み取ります。`listWorkflows` はオーナーがアクセス可能なすべての Workflow をノード数とタイムスタンプとともに返し、`getWorkflow` は 1 つの Workflow のノードとエッジの構造を返し、`getExecutionHistory` は実行履歴のエントリを新しい順に返します（ステータス、時間枠、件数のフィルターを任意で指定可能）。あわせてステータス別にグループ化された合計も返します。結果は、そのノードが属する Workflow のオーナーにスコープされるため、cron、ポータル、イベントによって開始された実行でも、手動実行と同じデータが返されます。`getWorkflow` は完全なノード設定を返すため、ハードコードされたキーや Token について Workflow を監査することが可能になります。Workflow のオーナーがエディターで既に開くことのできる範囲を超えるものは一切公開しません。Credential は不要です。

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

WebSocket Trigger ノードは、外部の WebSocket サーバーへのアウトバウンドクライアント接続を開き、`onMessage`、`onConnected`、または `onClosed` で Workflow を開始します。解析済みのメッセージ Payload、再接続の状態、クローズのメタデータ、および下流の式で使用する socket URL を公開します。

リアルタイム連携には、[WebSocket Send](../nodes/websocket-send-node.md)、[HTTP](../nodes/http-node.md)、[SSE Streaming](./sse-streaming.md) と組み合わせて使用できます。

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Telegram Trigger ノードは、bot の Webhook 更新を受信し、直ちに Workflow を開始します。完全な update Payload、主要な message オブジェクト、callback queries、サニタイズ済みの headers、および Trigger のタイムスタンプを公開します。チャットボット、[Telegram](../nodes/telegram-node.md) 内の AI アシスタント、ボタン駆動のフローなどにご活用ください。

bot 駆動の Workflow には、[Telegram](../nodes/telegram-node.md)、[Agent Node](../nodes/agent-node.md)、[Webhooks](./webhooks.md) と組み合わせて使用できます。

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Slack Trigger ノードは、Slack Events API の Webhook を受信し、リクエスト署名を検証したうえで Workflow を自動的に開始します。下流のルーティング、[LLM](../nodes/llm-node.md) ベースの分類、返信フローに使用するイベント Payload とサニタイズ済みの headers を公開します。

[Slack](../nodes/slack-node.md)、[Agent Node](../nodes/agent-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用できます。

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Discord Trigger ノードは、Discord Interactions API の Webhook を受信し、選択した `discord_trigger` Credential で Ed25519 署名を検証して、Workflow を開始します。下流のルーティングや返信に使用する完全な interaction Payload、command データ、サニタイズ済みの headers、Trigger のメタデータを公開します。

[Output](../nodes/output-node.md)、[Discord](../nodes/discord-node.md)、[Agent Node](../nodes/agent-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用できます。
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ ノードは、RabbitMQ のキューおよび exchange との間でメッセージを送受信します。メッセージ駆動型の Workflow やイベント処理に使用します。送信モードでは任意の遅延を付けてメッセージを発行し、受信モードでは [Trigger](./triggers.md) として機能するため、メッセージの到着時に Workflow が開始されます。出力には status、message_id、body が含まれます。

イベント駆動型の処理には、[Condition](../nodes/condition-node.md)、[Error Handler](../nodes/error-handler-node.md)、[Parallel Execution](./parallel-execution.md) と組み合わせて使用します。

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler ノードは、Workflow 内のいずれかのノードが失敗した際に自動的に実行されます。入力エッジは不要で、エンジンによってトリガーされます。出力には、エラーメッセージ、失敗したノードのラベル、ノードタイプ、タイムスタンプが含まれます。[Slack](../nodes/slack-node.md)、[Telegram](../nodes/telegram-node.md)、[Send Email](../nodes/send-email-node.md) を介した通知の送信、エラーのログ記録、カスタムエラーレスポンスの返却などに使用します。

キャンバス上でエラーを処理する代わりに、Workflow は失敗を別の Workflow に委譲することもできます。詳細は [Error Workflow](#error-workflow) を参照してください。キャンバスにすでに Error Handler ノードが含まれている場合、Error Workflow は**呼び出されません**（ローカルのハンドラーが優先されます）。

一般的な通知先は [Slack](../nodes/slack-node.md)、[Telegram](../nodes/telegram-node.md)、[Send Email](../nodes/send-email-node.md) です。実行の詳細は [Execution History](./execution-history.md) で確認しやすくなっています。

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent ノードは、tool calling を備えた [LLM](../nodes/llm-node.md) ノードです。Python ツールの実行、接続されたキャンバスノードのツールとしての呼び出し、[MCP](../tabs/mcp-tab.md) サーバーへの接続、skills（instruction ファイルおよび任意の Python スクリプト）の使用、他の agent ノードに委譲するオーケストレーターとしての動作、および他の Workflow のツールとしての呼び出しが可能です。出力は `$nodeLabel.text` として利用できます。任意の **Extra Body** トグルは、tool-calling ループ内のすべてのリクエストに、プロバイダー固有のリクエストパラメータの JSON オブジェクトを付加します。デフォルトではオフです。任意の **Use Responses API** トグルは、agent のモデル呼び出しを Responses API 経由でルーティングします。これにより、tool call をまたいでモデルの推論が保持されるため、reasoning モデルはマルチステップのループを通じて思考の連鎖を維持できます。デフォルトではオフで、OpenAI およびカスタム credential で動作します。

キャンバスノードツールを使用すると、agent はキャンバスから設定済みの Workflow ノードを直接呼び出せます。サポート対象のノードを agent の tools ハンドルに接続し、特定のフィールドを bot アイコンで agent 提供としてマークします。これらのフィールドは実行時にツールパラメータとなり、credential とマークされていないフィールドはノード設定内で固定されたままになります。

Skills セクションには、新しい skill を作成するための **AI Build**、既存の skill に対するインライン AI 編集アクション、skill ごとの ZIP ダウンロード、および実行時に Heym Drive ファイルを読み取る必要がある skill 向けの任意の **Enable Drive files** スイッチが含まれるようになりました。Skill Builder モーダルは、左側でチャット会話をストリーミング表示し、各 fine-tune コメントとともにドラッグアンドドロップされたファイルを受け付け、右側で生成された `SKILL.md` および `.py` ファイルの読み取り専用ライブプレビューを表示し、そのプレビューを ZIP としてダウンロードでき、アップロードされた fine-tune ファイルを、手動アップロードで使用されるものと同じ ZIP 取り込みフローを通じてバンドルされた skill アセットとして保存し直します。

**[Agent Persistent Memory](./agent-persistent-memory.md)** を有効にすると、各 agent ノードは独自のナレッジグラフを保持します。ファクトは空でない場合にシステムプロンプトへ読み込まれ、実行が成功すると新しいエンティティとリレーションシップのバックグラウンドマージがトリガーされます。サブエージェントは別々のグラフを使用します。グラフダイアログから、agent のグラフを他の agent（同じまたは別の Workflow）と読み取り専用または読み書きアクセスで**共有**できます。キャンバスの brain コントロールでグラフエディターが開きます。

Agent ノードは [Human-in-the-Loop](./human-in-the-loop.md) モードに入ることもできます。このモードでは、agent は `request_human_review` ツールを取得し、承認が必要な特定のステップで一時停止し、ワンタイムの公開レビューリンクを作成し、通知フロー用の `review` キャンバスブランチを公開し、レビュアーが Markdown レビューテキストを承認、編集、または拒否するまで待機できます。ノードの HITL フィールドは、いつ尋ねるべきかの承認ガイドラインとして機能し、レビュアー向けのサマリーは各レビューリクエストから生成されます。[MCP](../tabs/mcp-tab.md) ツールの場合、Heym はモデルを使用してそれらの記述された指示を `always`、`once`、または `never` に解釈するため、自由形式の承認表現が具体的な実行時ポリシーにマッピングされます。実行は `pending` としてマークされ、決定が到着した後に保存された実行スナップショットから再開されます。また、後続のステップでもレビューが必要な場合、同じ agent の実行が複数回一時停止することがあります。

Agent ノードは、蓄積されたメッセージ履歴がモデルのコンテキストウィンドウの 80% に近づくと、自動的に圧縮します。システムプロンプト、最初のユーザーメッセージ、および最新のユーザーメッセージは常に保持され、その間にあるすべての内容は同じモデルと credential を使用して要約されます。圧縮イベントは、Debug パネル、[Execution History](./execution-history.md)、および [Traces](../tabs/traces-tab.md) タブで確認できます。

[LLM](../nodes/llm-node.md)、[Agent Architecture](./agent-architecture.md)、[Agent Persistent Memory](./agent-persistent-memory.md)、[Human-in-the-Loop](./human-in-the-loop.md)、[File Generation](./file-generation.md) も参照してください。
#### [Codex](../nodes/codex-node.md)

Codex ノードは、隔離された Heym ワークスペース内で OpenAI Codex CLI を実行します。Codex クレデンシャル（ChatGPT でサインインすると、トークンごとの API コストなしでサブスクリプションを利用できます。またはアクセストークンを貼り付けます）、GitHub クレデンシャル、リポジトリ URL、ベースブランチ、タスク Prompt、公開モード（`diff_only` または `draft_pr`）、ブランチ名、タイムアウトを受け付けます。ランナーはリポジトリをローカルにクローンし、ChatGPT トークンバンドルまたは `CODEX_ACCESS_TOKEN` を Codex プロセスにのみ渡し、構造化されたサマリー、検証ノート、変更されたファイル、diff、使用状況メタデータ、およびオプションのドラフト PR URL を返します。

Codex が `needs_input` を返すと、Workflow は一時停止し、`question` ブランチを公開します。このブランチを Slack、メール、またはその他の通知ノードに接続してください。公開されたフォローアップリンクは、回答が送信された後に保存された実行スナップショットを再開します。Codex ノードは AI Agent にツールとしてアタッチすることもでき、エージェントがコーディングタスクを委任できるようになります。ツールとして使用する場合、`needs_input` の結果は Workflow を一時停止する代わりに、インラインでエージェントに返されます。

[GitHub](../nodes/github-node.md)、[Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md)、[Node Types](./node-types.md) も参照してください。

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go ノードは、GitHub リポジトリに対して OpenCode CLI（Go）を実行します。分離は Codex のパターンに従います。ローカルではホストのサブプロセスとして実行され、Docker デプロイメントではワークスペースボリュームを共有する強化された兄弟コンテナ内で実行されます。OpenCode Go クレデンシャル（オプションのベース URL を伴うゲートウェイ API キー）、GitHub クレデンシャル、リポジトリ URL、ベースブランチ、タスク Prompt、公開モード、ブランチ名、タイムアウト、およびライブの検索可能なモデルリストから選択される `opencode-go/<model>` モデル（組み込みのフォールバック付き）を受け付けます。Heym はすべての git/GitHub 操作をホスト上で実行し、GitHub トークンをサンドボックス内に配置することは決してありません。OpenCode はディスク上のファイルを編集するだけです。このノードは、構造化されたサマリー、検証ノート、変更されたファイル、diff、およびオプションのプルリクエスト URL を返します。AI Agent にツールとしてアタッチできます。

[Codex](../nodes/codex-node.md)、[GitHub](../nodes/github-node.md)、[Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md)、[Node Types](./node-types.md) も参照してください。

#### [LLM](../nodes/llm-node.md)

LLM ノードは、言語モデルでテキストを処理するか、画像を生成します。テキスト生成、ビジョン（画像入力）、画像生成、構造化 JSON 出力、サポートされている OpenAI および OpenAI 互換エンドポイント向けのプロバイダーネイティブな Batch API 実行、および Chat Completions の代わりに Responses API 経由で呼び出しをルーティングするオプションの **Use Responses API** トグル（デフォルトはオフ、OpenAI およびカスタムクレデンシャルで動作し、Batch モードと組み合わせることはできません）をサポートします。クレデンシャル、モデル、システムメッセージとユーザーメッセージ、temperature、max tokens を設定してください。Prompt 内では [Expression DSL](./expression-dsl.md) を使用できます。Batch モードでは、`userMessage` は配列に解決される必要があり、ノードは進捗更新を含む `batchStatus` ブランチを発行し、最終出力にはアイテムごとのバッチ結果が含まれます。オプションの **Extra Body** トグルは、プロバイダー固有のリクエストパラメータの JSON オブジェクト（たとえば `{"thinking": {"type": "disabled"}}`）を各 API 呼び出しに付加します。デフォルトはオフです。オプションの [Guardrails](./guardrails.md) は、呼び出しの前に安全でないコンテンツをブロックします。

[Qdrant RAG](../nodes/rag-node.md)、[Agent Node](../nodes/agent-node.md)、[Guardrails](./guardrails.md)、[Expression Evaluation Dialog](./expression-evaluation-dialog.md) と自然に組み合わせられます。

#### [Decision](../nodes/decision-node.md)

Decision ノードは、実行の状態について型付きの質問を決定モデルに問い合わせ、散文ではなく確率を返します。**State** フィールドはモデルが読み取るべき内容を運びます。単独の式は自身の型を保持するため、`$input` はそのテキストではなくオブジェクトを送信します。質問のリストは判断を運びます。質問には 3 つの形式があります。**noul** は条件が成立するかどうかに答えます。**choice** は定義した集合から 1 つのオプションを選択し、完全な分布を返します。**score** は順序付けられたレベルに沿って状態を評価し、レベルの間に位置することもあります。Choice と score の回答は信頼度も伴うため、[Switch](../nodes/switch-node.md) は回答に基づいてルーティングし、[Condition](../nodes/condition-node.md) はその確実性に基づいてゲートできます。**Generate with AI** は、平易な文から状態テンプレートと質問行を起草し、**Custom request body** は、コントラクトが異なるエンドポイント向けに手書きの JSON を送信します。プロバイダーの応答はそのまま渡され、各呼び出しは [Traces](../tabs/traces-tab.md) に記録されます。

Decision Model クレデンシャルが必要です。[Switch](../nodes/switch-node.md)、[Condition](../nodes/condition-node.md)、[Agent Node](../nodes/agent-node.md) と自然に組み合わせられます。
#### [RAG / Vector Store](../nodes/rag-node.md)

RAG / Vector Store ノードは、検索拡張生成（retrieval-augmented generation）のために、vector store へのドキュメントの挿入、upsert、削除、検索を行います。Database ドロップダウンでバックエンドを選択します — **Qdrant**（外部サーバー）または **Postgres (pgvector)**（Heym 自身のデータベース、外部サービス不要）で、デフォルトは Qdrant です。[Vectorstores](../tabs/vectorstores-tab.md) タブから vector store を選択し、操作を insert、upsert、delete、search のいずれかに設定します。upsert と delete は、payload 内に格納された一意の id によってドキュメントを指定します — **Document ID Field** がそのフィールド名を指定し（デフォルトは `doc_id`）、**Document ID** がその値を保持します — これにより、ドキュメントはお客様自身のシステムが既に使用している id を維持できます。upsert は新しいバージョンを保存する前に一致するすべての point を置き換え、delete は一致したものがあるかどうかを報告します。ドキュメントの metadata はその値に式を受け付けるため、`{"url": "$start.url"}` は実行が生成した内容を保存します。Search は metadata フィルター、オプションの **Hybrid Search** (ベクトル類似度と BM25 キーワードマッチングを融合し、ID やエラーコードなどの正確な用語をセマンティック一致の横で見つけることができます)、およびオプションの Cohere reranking をサポートし、text、score、metadata、reranked および hybrid フラグ、count を含む結果の配列を返します。これは [LLM](../nodes/llm-node.md) または [Agent Node](../nodes/agent-node.md) のフローで使用できます。

一般的な下流ノードは [LLM](../nodes/llm-node.md) と [Agent Node](../nodes/agent-node.md) です。vector store のセットアップについては [Vectorstores](../tabs/vectorstores-tab.md) を参照してください。

#### [MCP Call Node](../nodes/mcp-call-node.md)

MCP Call ノードは、LLM がどのツールを呼び出すかを決定することなく、特定の [MCP](../tabs/mcp-tab.md) ツールを直接呼び出します。設計時に実行するツールを正確に把握している場合 — ワークフロー内での決定論的で単一ステップの MCP ツール実行 — に使用します。接続（SSE、Streamable HTTP、または stdio。[Agent Node](../nodes/agent-node.md) の MCP 接続と同じフィールド）を構成し、**Fetch Tools** をクリックしてドロップダウンを populate し、ツールを選択して、ツールの input schema から自動レンダリングされる引数フィールドを入力します。各引数は静的な値、または `$userInput.body.text` のような [DSL 式](./expression-dsl.md) を受け付けます。結果は `$nodeLabel.result` として利用できます（パース可能であれば JSON オブジェクト、そうでなければ文字列）。MCP Call ノードは、キャンバスツールとして [Agent Node](../nodes/agent-node.md) に接続することはできません。

[Agent Node](../nodes/agent-node.md)、[MCP](../tabs/mcp-tab.md)、[Expression DSL](./expression-dsl.md) も参照してください。

### Logic

#### [Condition](../nodes/condition-node.md)

Condition ノードは、if/else 式に基づいてワークフローを分岐させます。2 つの出力ハンドルを持ちます。1 つは条件が truthy の場合、もう 1 つは falsy の場合です。条件式には [Expression DSL](./expression-dsl.md) の比較演算子と論理演算子を使用します。ノードは入力を選択されたブランチへパススルーします。

[Switch](../nodes/switch-node.md)、[Throw Error](../nodes/throw-error-node.md)、[Expression DSL](./expression-dsl.md) も参照してください。

#### [Switch](../nodes/switch-node.md)

Switch ノードは、値を case と照合することによって、実行を異なるパスへルーティングします。評価する式と case 値のリストを構成します。各 case は source handle を取得し、一致しない値には default handle が使用されます。入力は一致したブランチへパススルーされます。

二値分岐には [Condition](../nodes/condition-node.md) を、ルーティングされたパスを再結合するには [Merge](../nodes/merge-node.md) を使用します。マッチングルールは [Expression DSL](./expression-dsl.md) で説明されています。

#### [Merge](../nodes/merge-node.md)

Merge ノードは、複数の並列入力を待機し、それらを単一の出力に結合します。待機する入力の数を設定します。ノードはすべてのブランチが完了すると、マージされたオブジェクトを生成します。続行する前に並列ブランチの結果を結合するために使用します。並列ブランチが別々の Output ノードで終了する場合は使用しないでください。

[Parallel Execution](./parallel-execution.md)、[Loop](../nodes/loop-node.md)、ブランチを再結合する場合の [Output](../nodes/output-node.md) も参照してください。

#### [Loop](../nodes/loop-node.md)

Loop ノードは配列を反復し、各アイテムに対して下流ノードを実行します。反復を進めるには、反復本体の最後のノードからの back-connection が必要です。ループ本体の内部では `item`、`index`、`total`、`isFirst`、`isLast` を使用します。ループは反復パスと done パスのために別々の出力を持ちます。

反復的なワークフローには、[Variable](../nodes/variable-node.md)、[Merge](../nodes/merge-node.md)、[Expression DSL](./expression-dsl.md) と組み合わせて使用します。

### Data

#### [Set](../nodes/set-node.md)

Set ノードは、入力データを変換し、カスタム出力にマッピングします。各値が [Expression DSL](./expression-dsl.md) 式である key-value マッピングを定義します。大文字化、部分文字列、連結、乱数、および同様の変換に使用します。出力には key でアクセスします（例：`$setNode.keyName`）。キャンバスノードツールとして agent に接続されている場合、マッピング値は agent-provided としてマークでき、agent が実行時にそれらを埋めます。他のワークフローを呼び出すには、代わりに [Execute](../nodes/execute-node.md) ノードを使用してください。

[Variable](../nodes/variable-node.md)、[Execute](../nodes/execute-node.md)、[Expression DSL](./expression-dsl.md) も参照してください。
#### [Converter](../nodes/converter-node.md)

Converter ノードは、コードを書くことなくデータをフォーマット間で変換します。テキスト変換には、`csvToJson`（CSV テキストを行オブジェクトの配列に変換、ヘッダーがない場合は配列の配列に変換）、`jsonToCsv`（オブジェクト/行の配列を CSV テキストに変換）、`xmlToJson`（XML テキストをオブジェクトに変換）、`jsonToXml`（オブジェクトを XML テキストに変換）があります。変換方向とソース式を設定します。CSV 変換ではさらに区切り文字とヘッダー処理を使用し、`jsonToCsv` では明示的なカラム順序を固定できます。クォート、埋め込み区切り文字、埋め込み改行は RFC 4180 に従います。XML 属性は `@` プレフィックスを使用し、属性と混在するテキストは `#text` を使用し、繰り返し要素は配列になり、XML エンティティ展開は無効化されています。同じノードは保存されたファイルに対しても動作します。`imageToText` と `pdfToText` は Tesseract OCR を実行し、Heym Drive からファイルを読み取り（File upload Trigger からの `$Upload.file.id`、Drive ノードの結果、またはエージェントが生成したファイル）、検出されたスクリプトから言語を自動的に選択するか、`tur` や `eng+tur` など指定したコードを使用し、デフォルトでテキストを UTF-8 に正規化します（オプションで NFC 正規化や `cp1254` のようなより狭い文字セットも指定可能）。`fileConvert` は保存されたファイルを別のフォーマットに書き換え、ドキュメントは pandoc を、画像は Pillow を通じて処理し、元のファイルに触れることなく結果を新しい Drive ファイルとして保存します。結果は `$converterNode.result` として利用でき、OCR 実行時には `.language`、`.encoding`、`.page_count`、`.pages`、`.file` が付随し、`fileConvert` では `.id`、`.filename`、`.download_url` が付随します。

[Set](../nodes/set-node.md)、[DataTable](../nodes/datatable-node.md)、[Expression DSL](./expression-dsl.md) も参照してください。

#### [Code](../nodes/code-node.md)

Code ノードは、あなたが記述した Python を、独自の `requirements.txt` とともに、実行ごとに作成・破棄されるコンテナ内で実行します。コードは `main(params)` 関数を定義し、JSON シリアライズ可能な任意の値を返します。これが `$codeNode.result` になります。print された内容は別途 `$codeNode.logs` としてキャプチャされ、`$codeNode.install` はどのツールが依存関係をインストールしたかを報告します。パラメータは JSON オブジェクトとして設定され、その `$` 式は実行前に解決されます。コードは `params.user.name` や `params.orders[0].id` のようなドット記法でそれらを読み取ります。依存関係は `uv` でインストールされ、`uv` が扱えないパッケージについては `pip` にフォールバックします。実行間のキャッシュはありません。`requirements.txt` を空のままにするとインストールが完全にスキップされ、大幅に高速になります。実行フェーズでは `codeAllowNetwork` が有効でない限りネットワークがありませんが、依存関係のインストールは常に PyPI に到達します。サンドボックスは非 root で実行され、すべてのケイパビリティが削除され、読み取り専用のルートファイルシステム、Docker ソケットなし、バックエンドシークレットへのアクセスなしで、メモリ 512 MB、CPU 1 基、プロセス 256 個、インストール 120 秒、実行 60 秒に制限されています。Docker が必須であり、フォールバックモードはありません。到達可能なデーモンがない場合、ノードはバックエンドプロセスでコードを実行するのではなく失敗します。

#### [Variable](../nodes/variable-node.md)

Variable ノードは、Workflow ローカル変数（`$vars.variableName`）または永続的な[グローバル変数](./global-variables.md)（`$global.variableName`）を設定または更新します。カウンター、累積リスト、共有状態に使用します。変数名、値式、型強制、およびグローバルストアに保存するかどうかを設定します。配列変数は `$array()` と `.add()` をサポートします。

[Set](../nodes/set-node.md)、[Loop](../nodes/loop-node.md)、[Global Variables](./global-variables.md) と組み合わせて使用します。

#### [Execute](../nodes/execute-node.md)

Execute ノードは別の Workflow（サブ Workflow）を呼び出し、それに入力を渡します。対象の Workflow を ID で指定し、単一の式またはキーと値のマッピングで入力を提供します。出力には workflow_id、status、outputs が含まれます。再利用可能なロジックに使用し、データ変換には使用しないでください（それには Set を使用します）。

Extract to Sub-Workflow については [Canvas Features](./canvas-features.md)、[Workflow Structure](./workflow-structure.md)、[Output](../nodes/output-node.md) も参照してください。

### Integrations

#### [HTTP](../nodes/http-node.md)

HTTP ノードは cURL スタイルの設定を使用して HTTP リクエストを行います。Workflow の開始点（入力エッジなし）にも、上流ノードから入力を受け取ることもできます。レスポンスは status、headers、body として利用できます（該当する場合はパースされた JSON）。Bearer またはカスタムヘッダー認証には [Credentials](./credentials.md) を使用します。

[Webhooks](./webhooks.md)、[Credentials](./credentials.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [WebSocket Send](../nodes/websocket-send-node.md)

WebSocket Send ノードは、アウトバウンドのクライアント接続を開き、1 つのテキスト/JSON/バイナリメッセージを送信し、それを閉じます。Heym がホストするソケット Endpoint を作成することなく、Workflow の出力をリアルタイムシステムに公開するために使用します。

[WebSocket Trigger](../nodes/websocket-trigger-node.md)、[SSE Streaming](./sse-streaming.md)、[Third-Party Integrations](./integrations.md) も参照してください。
#### [Telegram](../nodes/telegram-node.md)

Telegram ノードは、チャット、グループ、またはチャンネルにボットメッセージを送信します。Telegram の[credential](./credentials.md)を設定し、`chatId` を指定して、送信する `message` を [Expression DSL](./expression-dsl.md) 式で組み立てます。会話型 Workflow には [Telegram Trigger](../nodes/telegram-trigger-node.md) と、運用担当者へのアラートには [Error Handler](../nodes/error-handler-node.md) と自然に組み合わせて使用できます。

セットアップと credential のパターンについては、[Third-Party Integrations](./integrations.md) および [Credentials](./credentials.md) も参照してください。

#### [Slack](../nodes/slack-node.md)

Slack ノードは、Incoming Webhook を介して Slack チャンネルにメッセージを送信します。Slack の[credential](./credentials.md)とメッセージ式を設定します。通知、アラート、エラーレポートに使用でき、出力は入力をそのまま通過します。

[Slack Trigger](../nodes/slack-trigger-node.md)、[Error Handler](../nodes/error-handler-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [Discord](../nodes/discord-node.md)

Discord ノードは、Incoming Webhook を介して Discord チャンネルにメッセージを送信します。Discord の[credential](./credentials.md)を設定し、送信するメッセージを [Expression DSL](./expression-dsl.md) で組み立て、必要に応じて Webhook のユーザー名やアバターのオーバーライドを設定します。

[Discord Trigger](../nodes/discord-trigger-node.md)、[Output](../nodes/output-node.md)、[Error Handler](../nodes/error-handler-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [Send Email](../nodes/send-email-node.md)

Send Email ノードは、SMTP を介してメールを送信します。SMTP の[credential](./credentials.md)と、宛先、件名、本文のための [Expression DSL](./expression-dsl.md) 式を設定します。通知、アラート、トランザクションメールに使用できます。出力には status、to、subject が含まれます。

[IMAP Trigger](../nodes/imap-trigger-node.md) は、受信メールを処理することで Send Email を補完します。これらを組み合わせることで、Workflow は共有受信トレイに届いたメールを読み取り、AI ノードで要約または分類し、フォローアップやエスカレーションのメッセージを送信できます。[Telegram Trigger](../nodes/telegram-trigger-node.md) と [Telegram ノード](../nodes/telegram-node.md) は、ボット駆動のチャット Workflow に対して同じ受信・送信パターンを提供します。

双方向の通知フローには、[LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[Third-Party Integrations](./integrations.md) とも相性が良いです。

#### [Redis](../nodes/redis-node.md)

Redis ノードは、set、get、hasKey、deleteKey といった Redis 操作を実行します。キャッシュ、レート制限、キーバリューストレージに使用できます。[credential](./credentials.md)、操作タイプ、キー式を設定し、set 操作の場合は値と任意の TTL を設定します。出力は操作によって異なります（value、success、exists、deleted）。

キャッシュ、スロットリング、調整のために、[Wait](../nodes/wait-node.md)、[Variable](../nodes/variable-node.md)、[Parallel Execution](./parallel-execution.md) と組み合わせて使用します。

#### [Grist](../nodes/grist-node.md)

Grist ノードは、Grist スプレッドシート内のデータを読み取り、書き込み、管理します。操作には getRecord、getRecords、createRecord、updateRecord、deleteRecord、listTables、listColumns が含まれます。ドキュメント ID、テーブル ID を指定し、create/update の場合はカラム ID を使用してレコードデータを指定します。CRUD、バッチ更新、スプレッドシートの自動化に使用できます。

[Google Sheets](../nodes/google-sheets-node.md)、[DataTable](../nodes/datatable-node.md)、[Third-Party Integrations](./integrations.md) も参照してください。

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets ノードは、OAuth2 を介してスプレッドシートデータを読み取り、書き込み、管理します。Workflow 内からレポートを読み取り、Workflow の結果を追記し、トラッカーを更新し、シートタブをクリアまたは検査するために使用できます。[BigQuery](../nodes/bigquery-node.md) と同様に、Google が提供する統合 credential を使用し、スプレッドシートデータがフローの一部である場合には [Grist](../nodes/grist-node.md) と並んで適切に機能します。

[Grist](../nodes/grist-node.md)、[DataTable](../nodes/datatable-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery ノードは、OAuth2 を介して SQL クエリを実行し、Google BigQuery データセットに行を挿入します。分析 Workflow、レポートパイプライン、Workflow 実行からの構造化イベントデータの書き込みに役立ちます。行の整形には [Set](../nodes/set-node.md) と、より軽量なスプレッドシート指向のレポートには [Google Sheets](../nodes/google-sheets-node.md) と組み合わせて使用することがよくあります。

[Set](../nodes/set-node.md)、[LLM](../nodes/llm-node.md)、[Google Sheets](../nodes/google-sheets-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive ノードは、OAuth2 を介して Drive のファイルとフォルダの一覧取得、ダウンロード、更新、削除を行い、`syncToHeymDrive` オペレーションで Drive ファイルを直接 [Heym Drive](../nodes/drive-node.md) にコピーできます。Google Docs、Sheets、Slides にはダウンロード可能なバイト列が存在しないため、このノードはそれらを自動的にエクスポートします — Docs は PDF、Sheets は XLSX、Slides は PPTX へ変換され、対象フォーマットの上書きも可能です。削除は「Delete permanently」が有効でない限りアイテムを Drive のゴミ箱へ移動し、このノードはファイルオペレーションを通じてフォルダを削除すること、およびその逆を拒否します。[Google Sheets](../nodes/google-sheets-node.md) と同様に、Google が提供する OAuth2 クレデンシャルを使用しますが、こちらは完全な Drive アクセスを要求する点に注意してください。共有する前に [Credential Sharing](./credentials-sharing.md) を確認してください。

[Loop](../nodes/loop-node.md)、[Drive](../nodes/drive-node.md)、[LLM](../nodes/llm-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [GitHub](../nodes/github-node.md)

GitHub ノードは、リポジトリ、組織とユーザー、issue、pull request、レビュー、リリース、Actions workflow、トラフィックインサイト、リポジトリファイルを網羅する 40 個のネイティブ GitHub REST アクションを提供します。HTTP リクエストを手作業で組み立てることなく、issue のトリアージ、レビューの自動化、workflow のディスパッチと完了待機、リリースの自動化、リポジトリファイルの更新に利用できます。GitHub.com に対応し、クレデンシャル上でオプションの GitHub Enterprise `base_url` もサポートします。

[Agent Node](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[Set](../nodes/set-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [Jira](../nodes/jira-node.md)

Jira ノードは、workflow を Jira Cloud または Jira Data Center / Server REST API に接続し、プロジェクト、issue、コメント、添付ファイル、ユーザー、通知、トランジションの自動化を実現します。プロジェクトの一覧取得、JQL による issue 検索、issue の作成や更新、変更履歴の確認、ステークホルダーへの通知、コメントと添付ファイルの管理、ユーザーの取得や管理、利用可能なトランジションの一覧取得、トランジション ID による issue の移動が可能です。Atlassian のメールアドレス、API token、サイトのベース URL、デプロイモードを含む Jira クレデンシャルを使用してください。

サポート窓口、バグのトリアージ、リリース workflow のために、[LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[Slack](../nodes/slack-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [Linear](../nodes/linear-node.md)

Linear ノードは、workflow を Linear の GraphQL API に接続し、ワークスペースと issue の自動化を実現します。チーム、プロジェクト、issue、workflow ステート、チームメンバー、コメントの一覧取得、issue の作成・更新・削除・リンク、コメントの作成・更新・解決・未解決化・削除が可能です。Linear のパーソナル API キーまたは OAuth2 クレデンシャルを使用し、issue を作成または更新する前に、一覧取得オペレーションからチーム、プロジェクト、ステート、担当者の UUID を取得してください。

受付、トリアージ、エンジニアリングバックログの workflow のために、[LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[Slack](../nodes/slack-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [Supabase](../nodes/supabase-node.md)

Supabase ノードは、Supabase PostgREST を通じて公開されたテーブルの読み取りと変更を行います。カスタム HTTP リクエストの配線なしにデータベースアクセスを必要とする、プロダクトバックエンド、ユーザー／プロファイルデータ、workflow ステート、CRUD 形式の自動化に適しています。

[Set](../nodes/set-node.md)、[DataTable](../nodes/datatable-node.md)、[HTTP](../nodes/http-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse ノードは、HTTP インターフェースを介して外部の ClickHouse データベースに対して CRUD、count、生の SQL オペレーションを実行します。分析パイプライン、イベントログ、レポーティング workflow に適しており、イベント発生時に挿入し、`query`/`count` で集計やカウントを行えます。[DataTable](../nodes/datatable-node.md) のオペレーションセット（find、getAll、count、getById、insert、update、remove、upsert）を踏襲しつつ、生の SQL を実行する逃げ道も備えており、`update`/`remove` は ClickHouse の mutation として実行されます。

[Set](../nodes/set-node.md)、スケジュールレポートのための [Cron](../nodes/cron-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。

#### [Notion](../nodes/notion-node.md)

Notion ノードは、現在の Notion API（`2026-03-11`）を通じて Notion のデータベース、データソース、ページ、ブロックを管理します。検索、ページの CRUD、データベースとデータソースのオペレーション、ブロックの子要素、ブロックの追加・更新・削除、ゴミ箱への移動・復元をサポートします。内部インテグレーション token または Notion パブリックインテグレーションの OAuth クレデンシャルを使用してください。エディターでは、アクセス可能なデータソースと親ページを検索し、カーソルページネーションで取得できます。共有クレデンシャルは、workflow の実行において所有クレデンシャルと同じように機能します。

カスタム REST 呼び出しの場合、`$credentials.YourNotionCredential` は同じ bearer token に解決されます。[Set](../nodes/set-node.md)、[HTTP](../nodes/http-node.md)、[LLM](../nodes/llm-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせて使用します。
#### [Sentry](../nodes/sentry-node.md)

Sentry ノードは、Sentry REST API を通じて Sentry の組織、プロジェクト、チーム、イシュー、イベント、リリースを自動化します。アラートのトリアージ、イシューステータスの更新、リリースの自動化、イベントの検索、プロジェクトやチームのセットアップまたはクリーンアップにご利用いただけます。オプションの credential ベース URL により、Sentry SaaS とセルフホスト型 Sentry の両方をサポートします。

インシデントおよびリリースの Workflow には、[Error Handler](../nodes/error-handler-node.md)、[Slack](../nodes/slack-node.md)、[Linear](../nodes/linear-node.md)、[Third-Party Integrations](./integrations.md) と組み合わせてご使用ください。

#### [DataTable](../nodes/datatable-node.md)

DataTable ノードは、Heym DataTables（ファーストパーティの構造化ストレージ）内のデータを読み取り、書き込み、管理します。操作には find、getAll、getById、insert、update、remove、upsert が含まれます。外部 credential は不要です。テーブルは [DataTable](../tabs/datatable-tab.md) ダッシュボードタブから管理され、Workflow のオーナーが直接アクセスします。

ファーストパーティの構造化ストレージには、[Set](../nodes/set-node.md)、[Variable](../nodes/variable-node.md)、[DataTable タブ](../tabs/datatable-tab.md) と組み合わせてご使用ください。

#### [Drive](../nodes/drive-node.md)

Drive ノードは、スキルによって生成されたファイルを Workflow 内から直接管理します。操作には delete、setPassword、setTtl、setMaxDownloads、読み取り専用のチームアクセス管理のための shareWithMyTeams および unshareWithMyTeams が含まれます。フォーマット変換は代わりに [Converter](../nodes/converter-node.md) ノードで行います。ファイルは `$agentLabel._generated_files[0].id` で参照します。出力には status、file_id、リンク制約用に更新された download_url、チーム共有用の shared_team_count が含まれます。これは特に、[File Generation](./file-generation.md) と [Drive](./drive.md) 参照モデルを使用する [Agent Node](../nodes/agent-node.md) の Workflow で役立ちます。

よく組み合わせるノードは、[Agent Node](../nodes/agent-node.md)、[File Generation](./file-generation.md)、[Drive](./drive.md) です。

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 ノードは、`s3` credential（アクセスキー、シークレットキー、リージョン、オプションのセッショントークン）を使用して Amazon S3 上でオブジェクトストレージ操作を実行します。操作には putObject、getObject、deleteObject、listObjects、copyObject、createBucket、deleteBucket、createFolder、deleteFolder、getAllFolder、listBuckets が含まれます。テキストのアップロード、およびテキストまたは base64 のダウンロードをサポートし、bucket および key フィールドは [Expression DSL](./expression-dsl.md) を受け付けます。Workflow の出力の保存、ファイルのアーカイブ、オブジェクトのフローへの読み戻しにご利用ください。

[Set](../nodes/set-node.md)、[HTTP](../nodes/http-node.md)、[Credentials](./credentials.md)、[Third-Party Integrations](./integrations.md) と組み合わせてご使用ください。

### Automation

#### [Crawler](../nodes/crawler-node.md)

Crawler ノードは、FlareSolverr を使用して Web ページをスクレイピングし、オプションで CSS セレクターによる HTML 抽出を行います。FlareSolverr の [credential](./credentials.md)、URL 式、待機時間、および抽出用のオプションのセレクターを設定します。出力は生の HTML または抽出されたコンテンツです。Web スクレイピングおよびコンテンツ抽出にご利用ください。

スクレイピングと分析のフローには、[HTTP](../nodes/http-node.md)、[Playwright](../nodes/playwright-node.md)、[LLM](../nodes/llm-node.md) と組み合わせてご使用ください。

#### [Playwright](../nodes/playwright-node.md)

Playwright ノードは、設定可能なステップ（navigate、refresh、click、type、screenshot、extract、aiStep）またはカスタム Playwright Python 用の **Run Code** モード（サンドボックス化、`HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED` によりデフォルトで無効）でブラウザ操作を自動化します。ヘッドレスモード、一般的な Playwright 自動化シグナルを低減するオプション設定、タイムアウト、オプションのネットワークキャプチャ（responses、cookies、localStorage、sessionStorage）、`$global.authState` などの [Global Variables](./global-variables.md) 式からの cookie/storageState 認証ブートストラップ、認証復元に失敗した場合のフォールバックログインステップ、およびセレクターが失敗した際の Auto Heal を備えた AI ステップをサポートします。Web スクレイピング、フォーム入力、ブラウザベースの Workflow にご利用ください。

ブラウザ自動化とデバッグについては、[Crawler](../nodes/crawler-node.md)、[HTTP](../nodes/http-node.md)、[Execution History](./execution-history.md) もご参照ください。

### Utilities

#### [Output](../nodes/output-node.md)

Output ノードは、呼び出し元にレスポンスを返す Workflow のエンドポイントです。message 式は、ラベルで前のノードを参照するように設定してください（ここでは [Input](../nodes/input-node.md) ノードの `$input` を決して使用しないでください）。オプションの非同期ダウンストリームにより、レスポンス送信後に output より後のノードをバックグラウンドで実行できます。

一般的な上流ソースは、[Input](../nodes/input-node.md)、[LLM](../nodes/llm-node.md)、[Execute](../nodes/execute-node.md) です。レスポンスの整形は [Expression Evaluation Dialog](./expression-evaluation-dialog.md) でデバッグすると容易になります。

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper ノードは、[Set](../nodes/set-node.md) 形式のキーと値のマッピングからプレーンな JSON オブジェクトを構築し、Workflow レスポンスのルートとして返します。API 呼び出し元が、標準の [Output](../nodes/output-node.md) ノードのラッパーではなく、生の JSON ボディを受け取る必要がある場合にご利用ください。
#### [HTML 出力マッパー](../nodes/html-output-mapper-node.md)

HTML 出力マッパーノードは、単一の HTML テンプレートをレンダリングし、`$nodeLabel.field` 式をページに補間します。これが Workflow の唯一の終端ノードである場合、execute Webhook は JSON ボディの代わりに `text/html` とノードに設定されたステータスコードを返すため、Workflow はページを直接ブラウザに提供できます。デバッグのために通常の JSON エンベロープを取得したい場合は、`X-Simple-Response: false` を送信してください。

[Set](../nodes/set-node.md)、[Output](../nodes/output-node.md)、[Workflow Structure](./workflow-structure.md)、[Webhooks](./webhooks.md) と組み合わせて使用します。

#### [Chart Output](../nodes/chart-output-node.md)

Chart Output ノードは、[Dashboard](../tabs/dashboard-tab.md) ウィジェット Workflow の終端ノードです。上流のノードが生成した行を、Dashboard がレンダリングする標準化されたチャート Payload に変換します。`chartType`（bar、line、area、pie、table、numeric、gauge、scatter、proportion、bar gauge、text、または HITL）を選択し、`labelField`/`valueField`（複数系列の場合は `series`、markdown メッセージの場合は `text`）をマッピングして、最後に配置します。出力エッジはありません。HITL は上流の行を無視し、保留中のヒューマンレビューを一覧表示します。もう1つは新しいタブで URL を開くリンクボタンとしてレンダリングできます（`linkColumn`、ボタンテキストには `linkLabel` を指定）

[Dashboard](../tabs/dashboard-tab.md)、[Set](../nodes/set-node.md)、[Output](../nodes/output-node.md) も参照してください。

#### [Wait](../nodes/wait-node.md)

Wait ノードは、Workflow の実行を指定された期間（ミリ秒単位、最大 15 分）一時停止します。レート制限、遅延アクション、またはポーリング間隔に使用します。入力は変更されずにそのまま通過します。

ペーシングとポーリングのために、[Cron](../nodes/cron-node.md)、[Redis](../nodes/redis-node.md)、[Parallel Execution](./parallel-execution.md) と組み合わせて使用します。

#### [Sticky Note](../nodes/sticky-note-node.md)

Sticky Note ノードは、キャンバスに markdown ノートを追加します。実行はされません。ドキュメント、手順、または Workflow のメモとして、他の [Canvas Features](./canvas-features.md) とともに使用します。キャンバスをダブルクリックすると、ノートの内容を編集できます。

[Canvas Features](./canvas-features.md)、[Keyboard Shortcuts](./keyboard-shortcuts.md)、[Workflow Organization](./workflow-organization.md) も参照してください。

#### [Console Log](../nodes/console-log-node.md)

Console Log ノードは、値をバックエンド（サーバー）コンソールにログ出力します。開発中のデバッグや検査に使用します。ログメッセージは [Expression DSL](./expression-dsl.md) 式をサポートしており、出力は入力をそのまま通過します。

デバッグのために、[Execution History](./execution-history.md)、[Traces](../tabs/traces-tab.md)、[Expression Evaluation Dialog](./expression-evaluation-dialog.md) と組み合わせて使用します。

#### [Disable Node](../nodes/disable-node.md)

Disable Node ノードは、対象ノードの `active` フラグを false に設定することで、Workflow 内の別のノードを永続的に無効化します。対象ノードはラベルで指定します。条件が満たされた後に [Cron](../nodes/cron-node.md) Trigger を停止するなど、一度きりの操作に使用します。

Workflow 制御パターンについては、[Canvas Features](./canvas-features.md)、[Edit History](./edit-history.md)、[Cron](../nodes/cron-node.md) も参照してください。

#### [Enable Node](../nodes/enable-node.md)

Enable Node ノードは、対象ノードの `active` フラグを true に設定して変更を保存することで、別のノードを再び有効化します。対象ノードはラベルで指定します。別のエントリーポイントから無効化された [Cron](../nodes/cron-node.md) Trigger を再び有効化したり、条件が満たされたときにノードをオンに切り替えたりするために使用します。Enable Node の下流にあり、まだ実行されていない対象も、現在の実行で実行されます。

Workflow 制御パターンについては、[Disable Node](../nodes/disable-node.md)、[Canvas Features](./canvas-features.md)、[Cron](../nodes/cron-node.md) も参照してください。

#### [Throw Error](../nodes/throw-error-node.md)

Throw Error ノードは、Workflow の実行を即座に停止し、カスタム HTTP ステータスコードを含むエラー応答を返します。エラーメッセージ式とステータスコード（例：400、401、403、404、429、500）を設定します。バリデーションの失敗、不正アクセス、その他のエラー条件に使用し、特に [Condition](../nodes/condition-node.md) や [Error Handler](../nodes/error-handler-node.md) と組み合わせて使用します。

明示的な失敗パスのために、[Condition](../nodes/condition-node.md)、[Error Handler](../nodes/error-handler-node.md)、[Security](./security.md) と組み合わせて使用します。

---

## Reference
### [ノードタイプ](./node-types.md)

Heym は多様なノードタイプを提供しています。[Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Slack Trigger](../nodes/slack-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[RabbitMQ](../nodes/rabbitmq-node.md)、[Error Handler](../nodes/error-handler-node.md) などの Trigger。[LLM](../nodes/llm-node.md)、[Decision](../nodes/decision-node.md)、[Agent Node](../nodes/agent-node.md)、[Codex](../nodes/codex-node.md)、[OpenCode Go](../nodes/opencode-go-node.md)、[Qdrant RAG](../nodes/rag-node.md)、[MCP Call](../nodes/mcp-call-node.md) などの AI ノード。[Condition](../nodes/condition-node.md)、[Switch](../nodes/switch-node.md)、[Merge](../nodes/merge-node.md)、[Loop](../nodes/loop-node.md) などのロジックノード。[Set](../nodes/set-node.md)、[Converter](../nodes/converter-node.md)、[Code](../nodes/code-node.md)、[Variable](../nodes/variable-node.md)、[Execute](../nodes/execute-node.md)、[Heym](../nodes/heym-node.md) などのデータノード。[HTTP](../nodes/http-node.md)、[GitHub](../nodes/github-node.md)、[Jira](../nodes/jira-node.md)、[Linear](../nodes/linear-node.md)、[Notion](../nodes/notion-node.md)、[Sentry](../nodes/sentry-node.md)、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、[Discord](../nodes/discord-node.md)、[Send Email](../nodes/send-email-node.md)、[Redis](../nodes/redis-node.md)、[Grist](../nodes/grist-node.md)、[Google Sheets](../nodes/google-sheets-node.md)、[Google Drive](../nodes/google-drive-node.md)、[BigQuery](../nodes/bigquery-node.md)、[Supabase](../nodes/supabase-node.md)、[ClickHouse](../nodes/clickhouse-node.md)、[DataTable](../nodes/datatable-node.md)、[Drive](../nodes/drive-node.md) などのインテグレーション。[Crawler](../nodes/crawler-node.md)、[Playwright](../nodes/playwright-node.md) などの自動化ノード。そして [Wait](../nodes/wait-node.md)、[Output](../nodes/output-node.md)、[JSON output mapper](../nodes/json-output-mapper-node.md)、[HTML output mapper](../nodes/html-output-mapper-node.md)、[Console Log](../nodes/console-log-node.md)、[Throw Error](../nodes/throw-error-node.md)、[Disable Node](../nodes/disable-node.md)、[Enable Node](../nodes/enable-node.md)、[Sticky Note](../nodes/sticky-note-node.md) などのユーティリティです。ノードの設定には `$input.text` や `$nodeLabel.field` のような式を使用します。

[Triggers](./triggers.md)、[Third-Party Integrations](./integrations.md)、[Parallel Execution](./parallel-execution.md) もあわせてご参照ください。

### [Expression DSL](./expression-dsl.md)

Heym は上流ノードのデータを参照するためのシンプルな式言語を使用します。[Input](../nodes/input-node.md) ノードには `$input`、任意の上流ノードには `$nodeLabel.field`、[credentials](./credentials.md) には `$credentials.CredentialName`、[global variables](./global-variables.md) には `$global.variableName` を使用します。組み込みの特殊変数には `$now`、`$UUID`、およびワークフローのメタデータ（`$workflowName`、`$workflowDescription`、`$workflowPath`、`$workflowUrl`、`$executionId`）があります（`$executionId` はその実行の [Execution History](./execution-history.md) id であり、`/workflows/{id}/{executionId}` でキャンバス上にその実行を開けます。ランタイム専用で、式プレビューダイアログでは空になります）。リテラル、算術演算、比較、[Loop](../nodes/loop-node.md) コンテキスト、ネストされたフィールド、文字列・配列ヘルパー（JSON 文字列をパースする `$text.toJson()` を含む）をサポートします。値全体が単一の `$expr` である場合、バックエンドは配列、オブジェクト、真偽値、数値をネイティブ型として保持します。

[Expression Evaluation Dialog](./expression-evaluation-dialog.md)、[Global Variables](./global-variables.md)、[Workflow Structure](./workflow-structure.md) もあわせてご参照ください。

### [Global Variables](./global-variables.md)

Global Variable Store は、ワークフローの実行をまたいで永続する、ユーザースコープのキー・バリューデータを保持します。変数は [Variables](../tabs/global-variables-tab.md) タブから、または「Store in Global Variable Store」を有効にした [Variable](../nodes/variable-node.md) ノードから作成できます。式内で `$global.variableName` を使用してアクセスし、他のユーザーや [teams](./teams.md) と共有できます。

共有ワークフロー状態のために、[Variable](../nodes/variable-node.md)、[Teams](./teams.md)、[Credentials Sharing](./credentials-sharing.md) と組み合わせて使用します。
### [式評価ダイアログ](./expression-evaluation-dialog.md)

式評価ダイアログは、式フィールドの横にある展開ボタンをクリックすると表示される拡張可能なエディターです。中央に大きなモーダルとして開き、オートコンプリートを有効に保ち、入力が止まるとバックエンドのプレビュー出力を自動的に更新します。オブジェクトや配列の結果は、出力パスピッカーで参照できます。このダイアログは、完全な行のベアなドットパス（例：`myNode.output.field`）を `$myNode.output.field` と同様に受け付けます。配置ルールについては[式 DSL](./expression-dsl.md)をご参照ください。

ツールバーの **Build with AI** ボタンを使用すると、希望する式をプレーンテキストで記述できます。LLM の[認証情報](./credentials.md)とモデルを選択し、*「API レスポンスから顧客名を取得する」* のような説明を入力して、Generate をクリックします。バックエンドは[式 DSL](./expression-dsl.md)のコンテキストと直近の実行におけるノード出力をモデルに送信し、単一の式文字列を返します。結果は即座に評価されるため、Apply をクリックする前に検証できます。

[式 DSL](./expression-dsl.md)、[Output](../nodes/output-node.md)、[JSON 出力マッパー](../nodes/json-output-mapper-node.md)と自然に組み合わせて使用できます。

### [Workflow 構造](./workflow-structure.md)

Workflow はノードとエッジを持つ JSON として保存されます。Workflow オブジェクトには、id、name、description、nodes、edges、および認証設定が含まれます。各ノードは id、type、position、および data（ラベルとタイプ固有の設定）を持ちます。エッジは、任意のハンドル ID を伴ってソースとターゲットのノード ID を接続します。data フィールド内の式構文は[式 DSL](./expression-dsl.md)に従い、この同じ形状が[ダウンロードとインポート](./download-import.md)でも使用されます。

[ノードタイプ](./node-types.md)、[式 DSL](./expression-dsl.md)、[ダウンロードとインポート](./download-import.md)もご参照ください。

### [キャンバス機能](./canvas-features.md)

任意の非スティッキーキャンバスノードにカーソルを合わせ、**Run** をクリックすると、そのノードまで実行されます。必要な入力がある場合は Run パネルが開き、最初のフィールドにフォーカスが当たります。入力のないパスは即座に開始されます。[ノードまで実行](./canvas-features.md#run-to-node)をご参照ください。

Workflow エディターは、Data Pin（再実行せずに下流をテストするためにノードの直近の出力をピン留め）、Execution Logs（[実行履歴](./execution-history.md)を補完するリアルタイムのノード結果とエージェントの進捗）、Enable/Disable（実行中にノードをスキップ）、Extract to Sub-Workflow（選択範囲を新しい Workflow に移動し、[Execute](../nodes/execute-node.md)ノードで置き換え）を提供します。実行中の本番実行は、History または Board カードから開くことができ、エディターは現在のスナップショットを復元し、SSE に接続して、キャンバスのアニメーションと Debug ログをライブで維持します。[キーボードショートカット](./keyboard-shortcuts.md)は、コピー、貼り付け、実行、およびインラインノード検索をサポートします。

[キーボードショートカット](./keyboard-shortcuts.md)、[編集履歴](./edit-history.md)、[実行履歴](./execution-history.md)もご参照ください。

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ エディターのデモを見る</a></p>

### [キーボードショートカット](./keyboard-shortcuts.md)

Heym はエディター全体にわたるショートカットを提供します：Command Palette（Ctrl+K）、Run（Ctrl+Enter）、Save（Ctrl+S）、Undo/Redo、および閉じるための Escape。キャンバス上では、すべて選択、複数選択、コピー/切り取り/貼り付け、削除、ノードの有効化切り替え（D）、ピンデータの切り替え（P）、および入力によるインラインノード検索が可能です。ショートカットはアプリ内リファレンスに記載されており、Data Pin やノードの有効化/無効化などの[キャンバス機能](./canvas-features.md)と密接に連携します。

[キャンバス機能](./canvas-features.md)、[クイックドロワー](./quick-drawer.md)、[コンテキストショーケース](./contextual-showcase.md)もご参照ください。

### [AI アシスタント](./ai-assistant.md)

AI アシスタントは、Debug パネルから開くチャットパネルで、自然言語で Workflow を作成または変更できます。[認証情報](./credentials.md)とモデルを選択し、希望する内容を記述すると、AI がレスポンスをストリーミングし、コードブロック内の有効な [Workflow JSON](./workflow-structure.md) が自動的に解析されてキャンバスに適用されます。対応ブラウザーでは音声入力がサポートされています。

**YOLO モード**（Agent モード、デフォルトではオフ）をオンにすると、アシスタントは構築したものをテストします。各変更後、キャンバス上で Workflow を実行し、結果を読み取り、要求どおりに動作するまで Workflow を修正します。これはメッセージごとに最大 5 回の実行まで行われます。最初の実行前にテスト入力を求め、他の Workflow の結果が必要な場合はそれらを実行でき、作業の各ステップを表示します。[AI アシスタント › YOLO モード](./ai-assistant.md#yolo-mode)をご参照ください。

キャンバス上の任意のノードの上にある **AI** をクリックすると、そのノードのみを変更または修正できます。パネルには変更中のノードが表示され（実行後の最新の結果を含む）、**Change this node as ...**、**Fix error in this node ...**、**Other** が提供されます。そのノードのみが更新され、ワークフローの残りの部分とレイアウトはそのまま残ります。[AI Assistant › 単一ノードの変更](./ai-assistant.md#changing-one-node) を参照してください。

Workflow がレコードを保存する場合、アシスタントは使用する[データテーブル](../tabs/datatable-tab.md)を尋ねるか、Workflow が必要とするカラムを持つテーブルを作成します。[AI アシスタント › データテーブル](./ai-assistant.md#data-tables)をご参照ください。

現在の Workflow に [Agent ノード](../nodes/agent-node.md)のスキルが含まれている場合、アシスタントは各スキルの `SKILL.md` のみを Workflow コンテキストに送信します。添付された `.py` ファイルとバイナリのスキルアセットは、リクエスト前に除外されるため、大きなスキルバンドルがモデルのコンテキストウィンドウをオーバーフローさせることはありません。

[Heym とのチャット](./chat-with-heym.md)、[エージェントアーキテクチャ](./agent-architecture.md)、[式 DSL](./expression-dsl.md)と相性が良いです。
### [Chat with Heym](./chat-with-heym.md)

Chat with Heym は、製品に関する質問に答えるドキュメントヘッダーアシスタントです。中央のダイアログで開き、credential とモデルの選択を上部に常時表示し、アクティブなドキュメントページのパスをコンテキストとして注入し、ダイアログを閉じるとメッセージ履歴をクリアします。より包括的な [AI Assistant](./ai-assistant.md) および軽量な [Contextual Showcase](./contextual-showcase.md) を補完する機能です。

[AI Assistant](./ai-assistant.md)、[Contextual Showcase](./contextual-showcase.md)、[Node Types](./node-types.md) もあわせてご参照ください。

### [Workflow Organization](./workflow-organization.md)

インスタンス管理者（`HEYM_ADMIN_EMAILS`）は、すべての Workflow にアクセスして編集でき、メールアドレスでオーナーの Workflow を検索し、スケジュールと実行履歴を確認し、自動 Trigger を一時停止および再開し、実行が落ち着いた後に Workflow を削除できます。オフボーディングのフロー、および自動 Trigger の一時停止とすべての呼び出しのブロックの違いについては、[Instance Administration](../tabs/workflows-tab.md#instance-administration) をご参照ください。

Workflow はフォルダとサブフォルダのツリー構造で整理できます。フォルダには名前と任意の親フォルダがあり、Workflow はフォルダに割り当てられます。Workflow は削除をスケジュールできます（完全削除の前にゴミ箱領域へ移動されます）。API は Workflow の作成、更新、削除、およびフォルダ間の移動をサポートしており、同じ整理モデルが [Workflows](../tabs/workflows-tab.md) タブにも表示されます。

[Quick Drawer](./quick-drawer.md)、[Download & Import](./download-import.md)、[Edit History](./edit-history.md) もあわせてご参照ください。

### [Quick Drawer](./quick-drawer.md)

Quick Drawer は、キャンバス以外の内部ページ向けの、右側に固定された高速実行パネルです。エディタを開くことなく、[workflows](../tabs/workflows-tab.md) の検索、お気に入りのピン留め、入力の選択、即時実行、進捗や結果の確認ができます。[File Upload Trigger](../nodes/file-upload-trigger-node.md) を持つ Workflow は、ドロップまたは選択されたファイルを受け取ります。ピンの順序と最後に選択した Workflow はブラウザに保存されます。

[Workflow Organization](./workflow-organization.md)、[Keyboard Shortcuts](./keyboard-shortcuts.md)、[Execution History](./execution-history.md) もあわせてご参照ください。

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase は、ダッシュボードタブ、[Evals](../tabs/evals-tab.md)、Docs、Workflow エディタなど、認証済みの主要画面向けのコンパクトなアプリ内ガイドレールです。デフォルトでは閉じた状態で、まず短いページ概要を表示し、必要に応じて少し詳しい情報を提供し、より深いガイダンスが必要な場合は完全なドキュメント記事へリンクします。

アプリ内ガイダンスフローとして、[Chat with Heym](./chat-with-heym.md)、[Quick Drawer](./quick-drawer.md)、[AI Assistant](./ai-assistant.md) と組み合わせてご利用ください。

### [Credentials](./credentials.md)

Credentials は、Workflow ノードで使用される API キーとシークレットを保存します。[Credentials](../tabs/credentials-tab.md) タブで追加し、[LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[Telegram](../nodes/telegram-node.md)、[Send Email](../nodes/send-email-node.md)、[Redis](../nodes/redis-node.md) などのノードで名前または ID により参照します。保存時には暗号化され、ユーザーまたは [teams](./teams.md) と共有でき、[Expression DSL](./expression-dsl.md) 内で `$credentials.Name` を介して参照することもできます。

[Credentials](../tabs/credentials-tab.md)、[Credentials Sharing](./credentials-sharing.md)、[Third-Party Integrations](./integrations.md) もあわせてご参照ください。

### [Credentials Sharing](./credentials-sharing.md)

Credentials は、メールアドレスで他のユーザーと、または teams と共有できます。credential が team と共有されると、すべての team メンバーがアクセス権を取得します。共有された credential は、[Credentials](../tabs/credentials-tab.md) タブにインジケーター付きで表示されます。実行時には、Workflow オーナーのコンテキストが、所有している credential、ユーザー共有の credential、および team 共有の credential をマージします。式内で `$credentials.CredentialName` を使用するか、ノードデータで credentialId を設定してください。

[Credentials](./credentials.md)、[Teams](./teams.md)、[Third-Party Integrations](./integrations.md) もあわせてご参照ください。

### [Teams](./teams.md)

Teams を使用すると、Workflow、credentials、global variables、vector stores、および Drive ファイルを、ユーザーのグループと一度に共有できます。[Teams](../tabs/teams-tab.md) タブから teams を作成し、メールアドレスでメンバーを追加します。該当する共有ダイアログから team とリソースを共有すると、すべてのメンバーがアクセス権を取得します。作成者は team を編集および削除できます。team を削除すると、すべての team 共有が削除されます。

[Credentials Sharing](./credentials-sharing.md)、[Global Variables](./global-variables.md)、[Enterprise](./enterprise.md) と組み合わせてご利用ください。

### [Parallel Execution](./parallel-execution.md)

Heym は、ノード間に相互依存関係がない場合、それらを並列で実行します。executor は DAG を構築し、同じレベルのノードをスレッドプールで同時に実行します。ノードが完了するとすぐに、その下流のノードがスケジュールされます。必要に応じて、並列ブランチを統合するには [Merge](../nodes/merge-node.md) ノードを使用してください。複数の Workflow 実行は同時に実行され、各実行は分離されています。[SSE Streaming](./sse-streaming.md) モードでは、ノードの完了時にイベントが発行されます。

[Merge](../nodes/merge-node.md)、[Loop](../nodes/loop-node.md)、[Execution History](./execution-history.md) もあわせてご参照ください。
### [Agent Architecture](./agent-architecture.md)

[Agent ノード](../nodes/agent-node.md)は、サブエージェント（オーケストレーターが call_sub_agent を介して他の Agent ノードを呼び出す）、サブ Workflow（Agent が call_sub_workflow を介して他の Workflow を呼び出す）、スキル（.zip または .md からの指示コンテンツおよび Python ツール）、および [MCP](../tabs/mcp-tab.md) クライアント接続をサポートします。オーケストレーターのツールエグゼキューターは、サブエージェントおよびサブ Workflow の呼び出しをルーティングし、その他のツールは Python、MCP、またはスキルエグゼキューターに送られます。サブエージェントおよびサブ Workflow の最大ネスト深度は 5 です。ツール呼び出しループには自動コンテキスト圧縮が組み込まれています。各イテレーションの前に Token 使用量が推定され、モデルのコンテキストウィンドウの 80% を超える場合、同じモデルを使用して中間メッセージが要約され、システム Prompt、最初のユーザーメッセージ、および最後のユーザーメッセージはそのまま保持されます。

[Agent ノード](../nodes/agent-node.md)、[Agent Persistent Memory](./agent-persistent-memory.md)、[Human-in-the-Loop](./human-in-the-loop.md)、および [MCP](../tabs/mcp-tab.md) も参照してください。

### [Agent Persistent Memory](./agent-persistent-memory.md)

オプションの [Agent ノード](../nodes/agent-node.md)ごとのナレッジグラフで、Postgres に保存されます。エンティティ、型、プロパティ、および有向リレーションシップで構成されます。`persistentMemoryEnabled` が true の場合、実行ごとにグラフがシステム Prompt に要約されます。正常に完了した後、[LLM](../nodes/llm-node.md) がバックグラウンドで構造化された更新を抽出します。REST CRUD は `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...` 以下に配置されています。エディターはノード上のピンク色の脳のコントロールから開きます。

[Agent ノード](../nodes/agent-node.md)、[Agent Architecture](./agent-architecture.md)、および [Traces](../tabs/traces-tab.md) も参照してください。

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop を使用すると、[Agent ノード](../nodes/agent-node.md)が特定のチェックポイントで承認を要求し、公開された `/review/{token}` ページを作成して、ログインしていないレビュアーが Markdown レビューテキストを承認、編集、または拒否するのを待つことができます。HITL が有効な Agent は `review` 出力ハンドルも公開するため、実行が保留中に [Slack](../nodes/slack-node.md)、[Send Email](../nodes/send-email-node.md)、またはその他のチャネルに通知できます。ノードレベルの HITL テキストは承認ガイドラインとして使用され、公開ページのサマリーはレビューリクエスト自体から生成されます。保留中の実行は即座に [Execution History](./execution-history.md) に表示され、同じ実行内で複数回発生する可能性があり、各決定が送信されると保存された Workflow スナップショットから正確に再開されます。

[Agent ノード](../nodes/agent-node.md)、[Portal](./portal.md)、[Execution History](./execution-history.md)、および [Send Email](../nodes/send-email-node.md) も参照してください。

### [Webhooks](./webhooks.md)

Workflow は `POST /api/workflows/{workflow_id}/execute` で [HTTP](../nodes/http-node.md) を介してトリガーすることも、`POST /api/workflows/{workflow_id}/execute/stream` からインクリメンタルにストリーミングすることもできます。リクエストボディは body として [Input](../nodes/input-node.md) ノードに渡されます。ヘッダーとクエリパラメータは [Expression DSL](./expression-dsl.md) 式で利用できます。Workflow ごとの認証（anonymous、JWT、またはカスタムヘッダー）を設定できます。オプションのレスポンスキャッシュ、レート制限、およびエディターの Run with cURL ダイアログはすべて Workflow 上にあり、両方のモードに適用されます。 [同時実行制限](./webhooks.md#concurrency-limit-and-queued-runs) がある場合、待機する必要がある呼び出しは代わりに実行 ID とステータス URL を含む `202 Accepted` を受け取ります。

[Input](../nodes/input-node.md)、[Execution Tokens](./execution-tokens.md)、[SSE Streaming](./sse-streaming.md)、[HTTP](../nodes/http-node.md)、および [Workflow Structure](./workflow-structure.md) も参照してください。

### [Execution Tokens](./execution-tokens.md)

Execution Token は、単一の Workflow の execute および stream Endpoint へのアクセスを許可するスコープ付き JWT です。Workflow が JWT 認証を使用する場合、Token を使用することで外部スクリプト、CI パイプライン、およびインテグレーションがユーザーセッションを共有することなく Workflow を呼び出せます。各 Token は、1 つの Workflow に固定する `wid` クレーム、即時失効に使用される `jti`、および設定可能な TTL（60 秒から 10 年）を保持します。Token の作成、選択、および失効は **Run with cURL** ダイアログから直接行えます。選択された Token は生成されたコマンドに自動的に埋め込まれます。

[Webhooks](./webhooks.md)、[Security](./security.md)、および [SSE Streaming](./sse-streaming.md) も参照してください。

### [SSE Streaming](./sse-streaming.md)

cURL ダイアログでは、[webhook](./webhooks.md) 実行を Server-Sent Events モードに切り替えることができます。これにより、`execution_started`、`node_start`、`node_complete`、および `execution_complete` イベントがリアルタイムで生成され、生成された cURL コマンドに `--no-buffer` が追加され、外部ターミナルコンシューマー向けに `[START] LLM` などのノードごとの開始メッセージやカスタムテキストを設定できます。

[Webhooks](./webhooks.md)、[Execution History](./execution-history.md)、および [LLM](../nodes/llm-node.md) も参照してください。
### [Triggers](./triggers.md)

Workflow は、Trigger ノード（[Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[RabbitMQ](../nodes/rabbitmq-node.md) の受信）またはエントリーポイント（[Webhook/API](./webhooks.md)、[MCP](../tabs/mcp-tab.md)、[Portal](./portal.md)、Cron スケジューラー、Telegram webhook、Discord interaction webhook、IMAP trigger manager、RabbitMQ consumer、Editor 実行）によって開始されます。各 Trigger は独自の Endpoint またはバックグラウンドプロセスを持ちます。[Cron](../nodes/cron-node.md) は 60 秒ごとに実行され、[Telegram Trigger](../nodes/telegram-trigger-node.md) ノードは bot webhook を受信し、[Discord Trigger](../nodes/discord-trigger-node.md) ノードは署名済みの interaction webhook を受信し、[IMAP Trigger](../nodes/imap-trigger-node.md) ノードは設定されたポーリング間隔で実行されます。[Input](../nodes/input-node.md) ノードは webhook リクエストから body、headers、query を受信します。

[Node Types](./node-types.md)、[Webhooks](./webhooks.md)、[Parallel Execution](./parallel-execution.md) も参照してください。

### [Execution History](./execution-history.md)

Execution history は Workflow の実行を記録します。入力、出力、ノードの結果、ステータス、Trigger のソースが含まれます。Editor ツールバー、Docs ビュー、Dashboard ヘッダー、または [Evals](../tabs/evals-tab.md) ビューからアクセスできます。Workflow ごとの履歴には開いている Workflow の実行が表示され、全履歴ビューには Workflow とチャット全体の実行が表示されます。現在実行中の Execution は、両方のダイアログの上部に **Open live** および **Cancel** アクションとともに表示されます。Open live は [SSE](./sse-streaming.md) を介して Editor を既存の Execution に接続し、完了したノードを復元し、現在および保留中のノードをパルス表示し、別の実行を開始することなく Debug ログを追記します。Bring to Canvas は完了した実行の入力とノード出力を読み込み、再実行やデバッグに使用できるようにします。ディープリンク `/workflows/{workflowId}/{executionId}` は、ライブ実行と完了した実行の両方をサポートします。[Human-in-the-Loop](./human-in-the-loop.md) で一時停止された実行は、公開レビュー URL とエージェントの `review` ブランチから実行された通知ノードを含め、`pending` として即座に保存されます。実行中にサーバーが再起動した場合、中断された実行は自動的に復旧されます。同じ入力で最初から再実行され、完了として表示されます（**Recovered** とマークされます）。これは Workflow ごとの **Auto-recover runs** トグルで制御され、代わりに `skipped` として記録することもできます。

[SSE Streaming](./sse-streaming.md)、[Human-in-the-Loop](./human-in-the-loop.md)、[Traces](../tabs/traces-tab.md) も参照してください。

### Execution Highlights

ライブ実行後、または **Bring to Canvas** の後に、Canvas の右上に閉じることができる **Execution Highlights** ポップアップが表示され、各ノードが実行順に何を生成したかを一覧表示します。各ノードを開くことなく、ノードごとの出力をすばやく確認できる方法です。**✕** で閉じることができ、次回の実行時に再度開きます。Highlights は dashboard の実行でも表示されます。詳細は [Execution History](./execution-history.md) を参照してください。

### [Edit History](./edit-history.md)

Edit History は Workflow の保存されたバージョンを追跡します（保存するたびにバージョンが作成されます）。リストを表示し、バージョンを開いて現在の Workflow（[ノード](./workflow-structure.md)、エッジ、設定）との差分を確認し、Revert で過去のバージョンを復元できます。[Execution History](./execution-history.md) とは異なり、Edit History は実行ではなく構造の変更を追跡します。

[Execution History](./execution-history.md)、[Workflow Structure](./workflow-structure.md)、[Canvas Features](./canvas-features.md) も参照してください。

### Error Workflow

Workflow は、失敗時に実行する別の Workflow を指定できます。Workflow レベルの **Properties** パネル（ノードが選択されていないときに表示されます）の **On error, run workflow** で設定します。設定、変更、クリアができるのは Workflow のオーナーのみです。詳細は [Owner-only settings](./workflow-organization.md#owner-only-settings) を参照してください。トップレベルの実行が未処理の失敗で終了すると、選択された error workflow が実行され、失敗のコンテキスト（失敗した Workflow の id と名前、実行 id、エラーメッセージ、失敗したノードのラベルとタイプ、タイムスタンプ）を受信します。Canvas にすでに [Error Handler](../nodes/error-handler-node.md) ノードが含まれている場合、ローカルのハンドラーが優先され、error workflow は **呼び出されません**。error workflow 自体は直接実行されるため、自身の error workflow をトリガーすることはありません。

これは、すべての非テストのトップレベル実行を対象とします。両方の execute Endpoint、[Portal](./portal.md)、および [cron](../nodes/cron-node.md)、チャットプラットフォームの Trigger、メール、キュー、[MCP](../tabs/mcp-tab.md)、dashboard ウィジェットを含むすべての Trigger が該当します。[Load Distribution](./cluster.md) が有効な場合もこれは変わりません。worker が実行した実行も含まれます。失敗したノードは結果とともに返送され、error workflow は他の実行と同様に分散されるため、その中で main インスタンス上で実行する必要があるノードも同様に実行されます。Workflow 自体の結果がまだ判明していないため、次の 2 つのケースは意図的に除外されています。どのインスタンスも実行しなかった実行と、実行がまだ進行中である可能性がある間にタイムアウトした待機です。また、手動の Canvas テスト実行によっても **トリガーされません**。
### Workflow Timeout

各 Workflow では、Workflow レベルの **Properties** パネルで **workflow timeout** を秒単位で設定できます。`0`（デフォルト）に設定すると無効になります。設定した場合、制限時間を超えた実行は次のノード境界で停止され、「timed out」エラーを伴う失敗した実行として記録されます。このタイムアウトは、手動実行、API 実行、および Trigger による実行に適用されます。長時間の [Wait](../nodes/wait-node.md) ノードは、その全期間にわたってブロックされることなく、速やかに中断されます。

### 同時実行制限

各ワークフローは、ワークフローレベルの **Properties** パネルにある **同時実行制限** で同時に実行される本番実行数を制限できます。オーナーおよび編集アクセス権を持つ共同編集者が変更でき、デフォルトでは無効になっています。制限に達すると、[webhook](./webhooks.md#concurrency-limit-and-queued-runs) および [ストリーミング](./sse-streaming.md) endpoint、[Portal](./portal.md)、[Quick Drawer](./quick-drawer.md)、[MCP](../tabs/mcp-tab.md)、および各 [trigger](./triggers.md) からの新しい実行は、[クラスタ](./cluster.md) のすべてのインスタンスにわたってカウントされる先入れ先出し (FIFO) キューで待機します。エディタのテスト実行、サブワークフロー呼び出し、[Evals](../tabs/evals-tab.md)、およびレビューの再開はキューに入れられず、[Board](../tabs/board-tab.md) カードの実行、ファイルアップロードの実行、AI アシスタントの run-workflow ツールによって開始された実行、およびアラート通知ワークフローはスロットを待たずに開始されます。待機する必要がある webhook 呼び出しは、`execution_id`、同じ認証情報で応答するステータス URL、順位、キューのサイズ、および実行中のカウントとともに直ちに `202 Accepted` を受け取ります。MCP クライアントも同様に受け取り、`heym_execution_status` ツールをポーリングします。オプションの **最大キューサイズ** は超過した呼び出しを `429` で拒否し、オプションの **最大待機時間** は待機時間が長すぎた実行を `expired` として記録します。待機中の実行は [実行履歴](./execution-history.md) に **キュー内 n/m** として表示され、そこでキャンセルできます。

### Time Saved

各 Workflow では、**1 回の実行あたりの推定節約時間**（分単位）を記録できます。これは Workflow レベルの **Properties** パネルで設定します。[Analytics](../tabs/analytics-tab.md) タブでは、選択した範囲にわたってこれを集計し、**Time Saved** 統計の合計値として表示します（各 Workflow の推定値 × 成功した実行回数の合計）。Most Used にも Workflow ごとの合計値が表示されます。**Not Set** をクリックすると、推定値が未設定の場合にその入力フィールドが開きます。[Workflow Analysis](./workflow-analysis.md) レポートでは、推定値が設定されていない場合に設定を推奨します。

### [Settings](./user-settings.md)

Settings ダイアログ（ヘッダーのアバターから開きます）には 4 つのタブがあります：Profile（Gravatar 画像、表示名、User Rules）、[Security](./security.md)（パスワード変更）、Voice（[ElevenLabs TTS/STT](./chat-voice.md)）、および Observability（読み取り専用の [OpenTelemetry](./opentelemetry.md) ステータス）です。User Rules は、Workflow ビルダーや [Chat](../tabs/chat-tab.md) を含むすべての AI リクエストに挿入されるカスタム指示であり、言語、トーン、コーディングスタイル、または Workflow の規約を一度に設定できます。パスワードポリシーおよび [MCP](../tabs/mcp-tab.md) API キー管理も利用できます。

[Security](./security.md)、[Chat Voice](./chat-voice.md)、[OpenTelemetry Tracing](./opentelemetry.md)、および [AI Assistant](./ai-assistant.md) も参照してください。

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym は、すべての Workflow 実行およびノード実行に対して OpenTelemetry トレースを出力できます。実行ごとにルートの `heym.workflow.execute` スパン、ノードごとに子の `heym.node.execute` スパンが生成され、モデルと Token の使用量が LLM ノードおよびエージェントノードに付加されます。スパンは OTLP/HTTP を介して互換性のある任意のバックエンド（Jaeger、Grafana Tempo、Honeycomb、Datadog）にエクスポートされ、W3C トレースコンテキストは受信 Webhook、送信 HTTP、およびサブ Workflow をまたいで伝播されます。トレーシングはデフォルトで無効になっており、`HEYM_OTEL_*` [環境変数](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)で設定します。有効なステータスは [Settings](./user-settings.md) の Observability タブに表示されます。

[Execution History](./execution-history.md)、[Traces](../tabs/traces-tab.md)、および [Webhooks](./webhooks.md) も参照してください。

### [Download & Import](./download-import.md)

エディターツールバーの Download ボタンから、現在の Workflow を JSON としてエクスポートできます。ファイルにはノードとエッジが含まれます。インポートするには、JSON ファイルを [Workflows](../tabs/workflows-tab.md) タブにドラッグする（新しい Workflow を作成）か、キャンバスにドラッグします（置換またはマージ）。JSON には nodes 配列が必須です。name と edges は任意です。バックアップ、共有、またはインスタンス間の移行にご利用ください。

[Workflow Structure](./workflow-structure.md)、[Workflows](../tabs/workflows-tab.md)、および [Canvas Features](./canvas-features.md) も参照してください。

### [Portal](./portal.md)

Portal は、Workflow を `/chat/{slug}` で公開チャット UI として公開します。Workflow ごとに portal_enabled、slug、任意の認証（portal users）、ストリーミング、およびファイルアップロードを設定できます。エンドユーザーは Heym にログインすることなく、チャットインターフェースを通じて操作できます。画像出力はチャット内に表示できます。Portal の Workflow は、[Agent Node](../nodes/agent-node.md) が承認を必要とする場合に [Human-in-the-Loop](./human-in-the-loop.md) レビューページへ引き継ぐこともでき、エージェントの `review` ブランチが他のチャネルへ通知を送信します。社内ツール、顧客向けチャットボット、および AI を活用したフォームにご利用ください。

[Human-in-the-Loop](./human-in-the-loop.md)、[Agent Node](../nodes/agent-node.md)、および [Drive](./drive.md) も参照してください。

### [File Generation](./file-generation.md)

Skills は、実行中に `_OUTPUT_DIR` ワークスペースへ書き込むことで、PDF、DOCX、CSV、JSON、画像などのファイルを生成できます。Heym はそれらのファイルを自動的にキャプチャして保存し、`_generated_files` の下にダウンロードメタデータを公開します。これはその後、[Drive node](../nodes/drive-node.md) で管理したり、[Drive](../tabs/drive-tab.md) タブで確認したりできます。

[Agent Node](../nodes/agent-node.md)、[Drive](./drive.md)、および [Drive node](../nodes/drive-node.md) も参照してください。

### [Drive](./drive.md)

Drive は、Skills によって生成されたファイルのための共有ストレージおよび共有レイヤーです。ファイルの閲覧、公開リンクまたはパスワード保護されたリンクの作成、有効期限とダウンロード制限の適用、チームとの読み取り専用でのファイル共有、およびそれらのファイルを [Drive node](../nodes/drive-node.md) でプログラム的に、または [Drive](../tabs/drive-tab.md) タブから手動で管理できます。

[Drive](../tabs/drive-tab.md)、[File Generation](./file-generation.md)、および [Portal](./portal.md) も参照してください。
### [セキュリティ](./security.md)

Heym はパスワードポリシー（長さ、大文字、小文字、数字）を適用し、アクセストークンを HttpOnly Cookie に保存し、使用時にリフレッシュトークンをローテーションします。レート制限はログイン、登録、および [Portal](./portal.md) ログインに適用されます。[Credentials](./credentials.md) は保存時に AES-256（Fernet）で暗号化されます。[MCP](../tabs/mcp-tab.md) API キーはクライアント認証に使用され、コンテンツの安全性は [LLM](../nodes/llm-node.md) ノードおよび [Agent Node](../nodes/agent-node.md) ノード上の [Guardrails](./guardrails.md) を介して利用できます。[Execution Tokens](./execution-tokens.md) は、外部呼び出し元向けに Workflow 単位でスコープされた JWT を提供します。

[Execution Tokens](./execution-tokens.md)、[Guardrails](./guardrails.md)、[Portal](./portal.md)、[Credentials](./credentials.md) も参照してください。

### [シングルサインオン](./sso.md)

Heym は、`HEYM_ADMIN_EMAILS` に記載されたインスタンス管理者が **Settings → SSO** から実行時に設定する、任意の外部 OpenID Connect プロバイダー（Keycloak、Okta、Entra ID、Auth0、Google）に対してユーザーを認証します。入力するのは issuer URL とクライアントクレデンシャルのみで、すべての Endpoint はプロバイダーの discovery ドキュメントから取得されるため、プロバイダーがハードコードされることはありません。サインインには PKCE を使用した Authorization Code を使用し、ID token はプロバイダーが公開する鍵に対して検証されます。アカウントはまず `(issuer, subject)` で、次に検証済みメールアドレスでマッピングされ、オプションの自動プロビジョニングはメールドメインの許可リストに限定されます。パスワードサインインは SSO と併用して引き続き利用でき、接続テストに合格した後に無効化できます。この際、`HEYM_ADMIN_EMAILS` のアカウントは除外されるため、プロバイダーの設定ミスによってインスタンスがロックされることはありません。

[Settings](./user-settings.md)、[Security](./security.md)、[Audit Logging](./audit.md) も参照してください。

### [負荷分散](./cluster.md)

2 つ目の Heym インスタンスを同じデータベースに向けると、ワーカーとして参加します。バックグラウンド実行（cron、webhooks、MCP tool calls、chat triggers）は、インスタンス管理者が **Settings → Instances** で設定した割合に従ってインスタンス間で分担され、各インスタンスのステータス、データベースレイテンシ、バージョンが 1 つのテーブルに表示されます。インスタンス同士が通信することはありません。作業を運ぶのは Postgres であるため、ワーカーに開いたポートも、メインインスタンスへの戻り経路も必要ありません。ローカルファイル、コーディングエージェントのワークスペース、またはインストール済みプラグインに触れる作業は常にメインインスタンスで実行され、パネルには過去 24 時間でその割合がどれほどであったかが報告されるため、オペレーターは割合設定が役に立たない状況を把握できます。履歴内のすべての実行は、それを実行したインスタンスを記録しており、両方の履歴ダイアログでそのインスタンスによるフィルタリングが可能です。

[Settings](./user-settings.md)、[Traces](../tabs/traces-tab.md)、[Analytics](../tabs/analytics-tab.md) も参照してください。

### [サードパーティ統合](./integrations.md)

Heym は、[Credentials](../tabs/credentials-tab.md) タブに保存されたクレデンシャル（保存時に暗号化）を通じて外部サービスに接続します。サポートされるタイプには、OpenAI、Google、[Decision node](../nodes/decision-node.md) 用の Decision Model、自動モデル選択用の Model Router（下記参照）、[GitHub node](../nodes/github-node.md) および MCP 統合用の GitHub、[Jira node](../nodes/jira-node.md) 用の Jira、[Notion node](../nodes/notion-node.md) 用の Notion、Custom LLM、Cohere、RAG: Qdrant + OpenAI、RAG: Psql + OpenAI、[Grist](../nodes/grist-node.md)、[Send Email](../nodes/send-email-node.md) 用の SMTP、[RabbitMQ](../nodes/rabbitmq-node.md)、[Redis](../nodes/redis-node.md)、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、Bearer、Header、および [Crawler](../nodes/crawler-node.md) 用の FlareSolverr が含まれます。各タイプには必須フィールドが記載されています。クレデンシャルはユーザーまたは [teams](./teams.md) と共有でき、ノード内で名前で参照するか、式内で `$credentials.Name` として参照できます。

### Model Router（Auto Model）

**Model Router** クレデンシャルは、キーを保持する代わりに、リクエストごとにモデルを選択します。これには
decision model クレデンシャルと、既存の OpenAI/Google/Custom クレデンシャルのリストが保存され、それぞれに
いつ使用すべきかの基準が付与され、すべてのモデルピッカーに **Auto** という単一のモデルとして表示されます。

Traces、キャンバスの Execution Log、および Span View には、選択の両方の部分が表示されます。たとえば
`Auto Model / GPT-5` のように表示され、コストは実行されたモデルに帰属したままになります。Auto
Model は Responses API、Batch モード、または画像出力と組み合わせることはできません。完全な動作については
[Credentials](./credentials.md) を参照してください。

[Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md)、[Teams](./teams.md) も参照してください。

### [Guardrails](./guardrails.md)

Guardrails は、安全でない、または望ましくないユーザーメッセージが [LLM](../nodes/llm-node.md) または [Agent Node](../nodes/agent-node.md) に到達する前にブロックします。ノードごとに有効化し、ブロックするカテゴリ（例: 暴力、ヘイトスピーチ、性的コンテンツ、自傷、ハラスメント、違法行為）を選択します。感度（low、medium、high）を設定します。トリガーされると、ノードは [Error Handler](../nodes/error-handler-node.md) でキャッチできるエラーをスローします。検出には、クレデンシャルタイプに応じてプロバイダーの moderation API または LLM 分類が使用されます。

[Security](./security.md)、[LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[Error Handler](../nodes/error-handler-node.md) も参照してください。
### [Enterprise](./enterprise.md)

Enterprise は、Heym を本番環境で運用するチーム向けの商用ライセンス、プロフェッショナルサポート、およびデプロイメントサービスを提供します。Workflow アーキテクチャの支援、オンボーディング、Kubernetes およびスケーリングのガイダンス、優先サポート、ならびに [Agent Node](../nodes/agent-node.md)、[Human-in-the-Loop](./human-in-the-loop.md)、[Parallel Execution](./parallel-execution.md)、[Portal](./portal.md) といった高度な機能に関するカスタム開発が含まれます。

[Running & Deployment](../getting-started/running-and-deployment.md)、[Security](./security.md)、[Teams](./teams.md) もあわせてご参照ください。

### [Heym Work](./heym-work.md)

Heym Work は、Heym の上に構築されたビジネスチーム向けの第 2 のインターフェースです。担当者が業務内容を説明していくつかの質問に答えると、テスト済みの Workflow が作成され、ページ、承認、およびすべての実行に名前が付いたアクティビティリストから作業を進められます。インスタンス管理者は **設定 → Heym Work** でアドレスと統合キーを使って接続します（Heym チームからの独自ライセンスが必要です）。

[Enterprise](./enterprise.md)、[Single Sign-On](./sso.md)、[Human-in-the-Loop](./human-in-the-loop.md) もあわせてご参照ください。

---

## Dashboard Tabs

### [Workflows](../tabs/workflows-tab.md)

Workflows タブはダッシュボードのデフォルトビューです。2 ペインのリストを表示し、左側には Workflow とフォルダが高密度の行として並び、右側には選択した Workflow のプレビューが Trigger、最終実行、ステップとともに表示され、さらに Open Workflow と Run Now も利用できます。各行にはステータスチップ（Running、Scheduled、Listening、Paused、API、SubWorker、Portal、Manual、Remove Scheduled）が付いており、Status ドロップダウンでフィルタリングできます。Trigger ノードを持たない Workflow は、直近の実行がどのように開始されたかによってラベル付けされます — HTTP 呼び出しの場合は API、親 Workflow の場合は SubWorker、公開チャットの場合は Portal — そして実行されるまでは Manual のままとなります。フォルダとサブフォルダは[整理](./workflow-organization.md)を担います。New Workflow で Workflow を作成し、JSON をドラッグアンドドロップして[インポート](./download-import.md)し、行のアクションから編集または削除できます。Workflow はフォルダ間で移動できます。削除は完全削除の前にスケジュール（ゴミ箱）されます。

[Workflow Organization](./workflow-organization.md)、[Download & Import](./download-import.md)、[Quick Drawer](./quick-drawer.md) もあわせてご参照ください。

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

カードが永続的なジョブとなるエージェント型カンバンボードです。各カラムを順序付けられた Workflow チェーンで構成し、カードをカラムに移動すると、そのカードの完全なコンテキスト（コンテンツ、コメント、履歴、以前の出力）でチェーンが実行されます。結果はカードに書き戻されます — 成功時は緑、失敗時は赤、実行中は琥珀色です。フォローアップのラウンドでは、それまでに蓄積されたすべてを伴って現在のカラムのチェーンが再実行され、これが反復的な計画立案を支えます。実行は `board` Trigger ソースとともに [Execution History](./execution-history.md) に記録されます。カードの実行がアクティブな間、**Open live** はその正確な実行を、増分 Debug ログを伴うアニメーションキャンバス上で開きます。

[Workflows](../tabs/workflows-tab.md)、[Execution History](./execution-history.md)、[Human-in-the-Loop](./human-in-the-loop.md) もあわせてご参照ください。

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Templates タブでは、Workflow テンプレート（完全な Workflow）とノードテンプレート（構成済みの単一ノード）を保存および再利用できます。Workflow テンプレートはエディタから（Share as Template）、ノードテンプレートはノードを右クリックして作成します。公開範囲（Everyone または Specific users/[teams](./teams.md)）で閲覧し、テンプレートを適用して新しい Workflow を作成したり、キャンバスにノードを追加したり、共有したテンプレートを管理したりできます。

[Workflows](../tabs/workflows-tab.md)、[Teams](./teams.md)、[Canvas Features](./canvas-features.md) もあわせてご参照ください。

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Variables タブは [Global Variable Store](./global-variables.md) を管理します。グローバル変数の作成、編集、削除ができ、名前、値、値の型（Auto、String、Number、Boolean、Array、Object）を設定できます。変数はユーザースコープであり、実行をまたいで永続化されます。任意の Workflow の[式](./expression-dsl.md)内で `$global.variableName` として参照できます。変数は他のユーザーや[チーム](./teams.md)と共有できます。

[Global Variables](./global-variables.md)、[Variable](../nodes/variable-node.md)、[Expression DSL](./expression-dsl.md) もあわせてご参照ください。

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Chat タブは、会話を通じてワークスペースを操作するための Heym の長時間稼働エージェントサーフェスです。[credential](./credentials.md) とモデルを選択し、Chat に質問への回答、Workflow 定義の検査、既存の Workflow の実行、実行とスケジュールの要約、単一の Workflow の実行履歴のレポート（実行回数、ステータス内訳、最終実行、およびリクエストに応じた 1 回の実行の詳細）、現在実行中の実行のレポート（経過時間、現在のノード、各ライブ実行へのリンク付き）、保留中の human review の解決、エディターで使用されるものと同じ AI Builder エンジンによる Workflow の作成と修正、あるいは自然言語による kanban ボードへのカード追加を依頼できます。新しいカードは常に選択されたボードの最初の列から開始されます。複数のボードが利用可能で、いずれも指定されなかった場合、Chat はカードを作成する前にボードの選択を提示します。

Chat はブラウザを閉じた後もバックエンドで実行を継続します。回答のストリーミング中にも、さらにメッセージを送信できます。Heym はそれらをデータベースに基づくキューに保存し、開始前にキューのメッセージを編集または削除できるようにし、現在の応答が完了したときに順番に実行します。アシスタントが計画の詳細を必要とし、明確化のための質問を返した場合、キューはそれらの質問に回答するまで一時停止し、計画応答の後に再開します。

応答は markdown、インライン画像、Workflow プレビューカード、折りたたみ可能な tool-call カード、コンテキスト使用量、および自動コンテキスト圧縮とともにストリーミングされます。Chat は添付ファイル、音声入力、読み上げ再生、コピーアクション、クイックプロンプト、[Settings](./user-settings.md) の User Rules、およびコンテキストとしての[グローバル変数](./global-variables.md)をサポートします。

[AI Assistant](./ai-assistant.md)、[Credentials](./credentials.md)、[Settings](./user-settings.md)も参照してください。

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Chat デモを見る</a></p>

### [Credentials](../tabs/credentials-tab.md)

Credentials タブは、ノードで使用される API キーとシークレットを管理します。タイプ別（OpenAI、Google、Custom、Bearer、Header、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、SMTP、[Redis](../nodes/redis-node.md)、RAG: Qdrant + OpenAI、RAG: Psql + OpenAI、Cohere など）に credential を追加し、名前を付け、Workflow ノードで参照します。カードから編集または削除でき、メールアドレスでユーザーと、または[チーム](./teams.md)と共有できます。すべての値は保存時に暗号化され、UI ではマスクされます。

[Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md)、[Third-Party Integrations](./integrations.md)も参照してください。

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Credentials デモを見る</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Vectorstores タブは、[RAG](../nodes/rag-node.md) ノードで使用される vector store を管理します。名前と vector store の [credential](./credentials.md) を指定してストアを作成します — *RAG: Qdrant + OpenAI*（外部 Qdrant）または *RAG: Psql + OpenAI*（pgvector を介した Heym 自身の Postgres）で、これによりストアのバックエンドが固定されます — 任意でコレクション名を設定し、その後ドキュメント（PDF、TXT など）をアップロードします。コンテンツの管理（ソースの表示、削除）、ストア詳細の編集、およびユーザーとのストアの共有が可能です。[RAG](../nodes/rag-node.md) ノードでは、Database を選択し、vector store を選び、insert、upsert、delete、または search 操作を実行します。

[Qdrant RAG](../nodes/rag-node.md)、[Credentials](./credentials.md)、[Teams](./teams.md)も参照してください。

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vectorstores デモを見る</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP タブでは、Model Context Protocol 統合を設定します。Heym は次の 2 つのモードをサポートしています。

**デフォルトサーバー** – `/api/mcp/sse` にある単一の Endpoint が、MCP が有効なすべての Workflow を公開します。API key の表示と再生成、すぐに使えるクライアント JSON のコピー、Cursor へのワンクリック接続、あるいは自動 OAuth 登録を伴う Claude セットアップフローの実行が可能です。

**名前付きサーバー** – 複数の分離された MCP Endpoint を作成でき、それぞれが独自の UUID ベースの URL（`/api/mcp/servers/{uuid}/sse`）と独立した API key を持ちます。特定の Workflow を各サーバーに割り当てることで、異なる AI クライアントやチームが必要なツールだけを参照できるようになります。各名前付きサーバーは同じ認証方式（API key、Claude OAuth）をサポートし、独自の Copy JSON および Add to Cursor ショートカットを備えています。どちらの Endpoint も SSE transport（GET）と Streamable HTTP transport（POST）をサポートします。名前付きサーバー内で Workflow を切り替えると、その Workflow は割り当てリストの先頭に移動するため、変更された行が表示されたままになります。

**Heym chat tool** – どちらのモードでも、[Chat](../tabs/chat-tab.md) エンジンを単一の `heym_chat` ツールとして公開できます。サーフェスごとに切り替え可能で、独自の LLM credential とモデル（[Settings](./user-settings.md) で設定した優先モデルから事前入力されます）を使用します。MCP クライアントが自然言語の `message` を 1 つ送信すると、あとはエンジンが処理します。ビルドモードでの Workflow の構築（保存、最大 5 回のテスト実行、修正、検証）、Workflow の実行、analytics、executions、live run status、schedules、boards と cards、teams、global variables、documentation search、human-in-the-loop の意思決定などが含まれます。後から Chat に追加された機能も、追加登録なしで同じツールを通じて利用できます。各呼び出しは Chat タブの履歴にプラグマーク付きの会話として保存され、クライアントがスレッドを継続するために返送できる `conversation_id` を返します。

[Agent Architecture](./agent-architecture.md)、[Agent Node](../nodes/agent-node.md)、[SSE Streaming](./sse-streaming.md) も参照してください。

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCP デモを見る</a></p>

### [Traces](../tabs/traces-tab.md)

Traces タブでは、[LLM](../nodes/llm-node.md) の実行トレースを表示します。リストの上にある統計ヘッダーには、選択した時間範囲の概要が KPI カード（Calls、Tokens、Cost、Avg Latency、Error %）と 3 つのチャート — Tokens by Model、Cost by Model、Calls Over Time（成功とエラーの積み上げ）— で表示されます。単一の **Time range** セレクター（1h / 24h / 7d / 30d / All、デフォルトは 7 日）が、チャートとリストの両方をまとめて絞り込みます。Cost はユーザーごとの [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) から計算されます。価格が設定されていないモデルは、そのテーブルへリンクするインライン警告として表示されます。任意のトレースを開くと、リクエストとレスポンスの Payload、タイミングの内訳（llm_ms、tools_ms、mcp_list_ms）、ツール呼び出し（名前、引数、結果）、および含まれる skills を確認できます。展開されたイベントは JSON（MCP や JSON-RPC の Payload を含む）を折りたたみ可能なツリーとして表示し、デフォルトでは第 1 階層が開いた状態になります。**Tree / Raw** で元のテキストに切り替えられ、不正な形式の JSON も読み取り可能なままです。トレースは [Agent Node](../nodes/agent-node.md) や [LLM](../nodes/llm-node.md) の動作をデバッグしたり、Payload をコピー・エクスポートしたりするために使用します。

[Execution History](./execution-history.md)、[Agent Node](../nodes/agent-node.md)、[LLM](../nodes/llm-node.md) も参照してください。

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Traces デモを見る</a></p>
### [アラート](../tabs/alerts-tab.md)

アラートタブでは、時間ウィンドウに対するしきい値条件を定義し、それを超えたときに通知を受け取ることができます。4 種類のアラートタイプは、運用担当者が実際に抱く疑問をカバーしています。**エラーしきい値**（ウィンドウ内で N 回を超えて失敗したか）、**ワークフロー実行時間**（実行が遅くなったか。最大値、平均値、または p95 で測定）、**Token / USD コスト**（支出が予算を超えたか。[Traces](../tabs/traces-tab.md) と同じ価格テーブルで解決）、そして**実行回数**（想定よりもはるかに頻繁に実行されたか）です。どのタイプも、単一のイベントではなく、選択したウィンドウ全体で判定されます。1 回の失敗した実行はノイズであり、バーストはインシデントだからです。アラートは 1 つのワークフロー、またはアクセス可能なすべてのワークフローを監視できます。

5 ステップのウィザードで、タイプ、スコープ、条件、応答、レビューの順に進みます。レビューステップでは、まず条件を**バックテスト**し、過去 24 時間から 7 日間でその条件が何回発火したかを報告します。これにより、しきい値が低すぎる場合に、誰かを呼び出した後に気づくのではなく、保存前に発見できます。希望する内容を平易な言葉で記述すると、AI が可能な限りのステップを埋め、推測した箇所にはマークを付けます。部分的なリクエストでもウィザードは先に進み、最初からやり直させるのではなく、まだ決定が必要な最初のステップを開きます。デフォルトでは、アラートは 1 回発火すると、メトリクスが回復するまで静かなままです。代わりに、一定間隔で繰り返すように設定することもできます。

応答ステップでは、アラートが発火したときに実行する新しいワークフローを作成して割り当てるか、既存のワークフローを使用するか、何もしないかを選択できます。発火時の Payload には、観測値、しきい値、ウィンドウ、およびその数値に寄与したワークフローが含まれます。これにより、既にお持ちのノードを使ってアラートを Slack、メール、Telegram に届けることができます。発火履歴には、各アラートが発火した瞬間の状態が記録され、90 日間保持されます。発火を確認応答すると、条件が解消されたかのように装うことなく、バッジが Firing から Acknowledged に変わります。[Chat](../tabs/chat-tab.md) タブでは、どのようなアラートが存在するか、なぜ、またはいつトリガーされたかを回答できます。アラートはユーザーおよび[チーム](../tabs/teams-tab.md)と共有できます。

[Analytics](../tabs/analytics-tab.md)、[Traces](../tabs/traces-tab.md)、[実行履歴](./execution-history.md)もあわせてご覧ください。

### [Analytics](../tabs/analytics-tab.md)

Analytics タブでは、実行メトリクスとトレンドを表示します。サマリー統計には、総実行回数、成功率、エラー率、レイテンシの内訳、および合計 **Time Saved**（各ワークフローの 1 回あたりの推定節約分数 × 成功した実行回数の合計）が含まれます。Most Used には、ワークフローごとの同じ合計が表示されます。基準となる時間範囲（24h、7d、30d、または all）を選択し、必要に応じてワークフローでフィルタリングしてから、任意のチャート上をドラッグして選択した日付範囲にドリルダウンします。チャートとワークフローテーブルは選択内容に合わせて更新され、自動更新によりメトリクスが最新の状態に保たれます。過去の結果と今後の実行の両方を確認したい場合に、[実行履歴](./execution-history.md)および[スケジュール](../tabs/scheduled-tab.md)ビューを補完します。

[実行履歴](./execution-history.md)、[スケジュール](../tabs/scheduled-tab.md)、[Evals](../tabs/evals-tab.md)もあわせてご覧ください。

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Analytics デモを見る</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Dashboard タブは Grafana スタイルのスペースで、それぞれが独自の非表示の Heym ワークフローからレンダリングされるチャートウィジェットのグリッドを構築できます。必要なだけダッシュボードを保持し、それぞれをユーザーまたはチームと、読み取り専用または編集可能として共有できます。ウィジェットは常に所有者の認証情報で実行されるため、全員が同じデータを参照します。メトリクスを平易な言葉で記述すると AI がウィジェットを生成します。または手動で追加してチャートタイプを選択し、サンプルデータでプレビューできます。棒、折れ線、面、円、テーブル、数値、ゲージ、散布図、割合、棒ゲージ、テキスト、または HITL です。HITL は、保留中のヒューマンレビューのカルーセルです。ヘッダーには `1/n pending` と表示されます。ワークフロー名をクリックすると、キャンバス上でその実行が開きます。**Approve**、**Request changes**、**Reject** で解決でき、ウィジェットタイトル横の履歴アイコンをクリックすると、同じページの履歴ダイアログでその実行が開きます。ウィジェットは結果をキャッシュし、AI で微調整でき（各変更は[編集履歴](./edit-history.md)に保存されます）、完全なワークフローとともに複製でき、Tidy up で再配置でき、編集モードでドラッグまたはサイズ変更できます。テーブルにはステータスチップを表示して、クリックした行のレコードを `$page.record` として読み取る詳細ダッシュボードへ行をリンクできます。また、Run ウィジェットを使うと、ドロップされたファイル、入力フィールド、または実行ボタンからダッシュボード上でワークフローを実行できます。各ウィジェットはワークフローであるため、取得できるあらゆるデータ — [HTTP](../nodes/http-node.md) 呼び出し、[BigQuery](../nodes/bigquery-node.md) クエリ、[RAG](../nodes/rag-node.md) ルックアップ、または [LLM](../nodes/llm-node.md) 出力 — をチャートにできます。HITL ウィジェットの設定では、単一のワークフローのレビュー、またはその中のエージェントや Slack 承認ステップに絞り込むことができます。このようなウィジェットは、そのワークフローを開くことができるすべての人にそれらを表示し、開くことができない人からは非表示になります。

[Chart Output ノード](../nodes/chart-output-node.md)、[Analytics](../tabs/analytics-tab.md)、[実行履歴](./execution-history.md)もあわせてご覧ください。

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Dashboard デモを見る</a></p>
### [Evals](../tabs/evals-tab.md)

Evals タブ（`/evals`）では、評価スイートを作成し、テストケースを追加または生成し、スイートの Prompt を最適化し、[Agent ノード](../nodes/agent-node.md)の Workflow に対して評価を実行できます。1つ以上のモデルを選択し、スコアリング方法（Exact Match、Contains、LLM-as-Judge）を選び、必要に応じて別のモデルまたは [Decision ノード](../nodes/decision-node.md)に LLM-as-Judge の回答を判定させ、テストごとの実行回数（および Exact Match と Contains の場合は temperature と reasoning effort）を設定したうえで、合否とモデルごとの出力を比較できます。過去の評価の実行履歴を確認し、各実行で使用された judge を確認したり、同じ judge で再実行したり、JSON としてエクスポートしたり、基盤となる動作を [Traces](../tabs/traces-tab.md) で相互確認したりできます。

[Agent ノード](../nodes/agent-node.md)、[Traces](../tabs/traces-tab.md)、[実行履歴](./execution-history.md)もあわせてご参照ください。

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evals デモを見る</a></p>

### [Teams](../tabs/teams-tab.md)

Teams タブでは、チームの作成と管理ができます。チームを作成し、メールアドレスでメンバーを追加し、メンバーを削除できます（作成者は削除できません）。[Workflow](../tabs/workflows-tab.md)、[テンプレート](../tabs/templates-tab.md)、[認証情報](../tabs/credentials-tab.md)、[変数](../tabs/global-variables-tab.md)、[ベクターストア](../tabs/vectorstores-tab.md)、[Drive ファイル](../tabs/drive-tab.md)は、それぞれの共有ダイアログからチームと共有でき、すべてのチームメンバーがアクセス権を取得します。チーム名と説明を編集したり、チームを削除したりできます（すべてのチーム共有が削除されます）。

[Teams](./teams.md)、[認証情報の共有](./credentials-sharing.md)、[Workflow の整理](./workflow-organization.md)もあわせてご参照ください。

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Teams デモを見る</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

Scheduled タブでは、すべてのアクティブな [Cron](../nodes/cron-node.md) Workflow を視覚的なカレンダー上に表示します。日、週、月のビューを切り替えて、自動化がいつ実行されるようにスケジュールされているかを確認し、スケジュールを編集する必要があるときは関連する [Workflow](../tabs/workflows-tab.md) に戻ることができます。

[Cron](../nodes/cron-node.md)、[Analytics](../tabs/analytics-tab.md)、[実行履歴](./execution-history.md)もあわせてご参照ください。

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Scheduled デモを見る</a></p>

### [Logs](../tabs/logs-tab.md)

Logs タブでは、Heym スタック（バックエンド、フロントエンド、PostgreSQL）の Docker コンテナログを表示します。コンテナを選択し、ログレベル（All、INFO、WARNING、ERROR、DEBUG）でフィルタリングし、ログ内を検索できます。デバッグやトラブルシューティングにご利用ください。Workflow の実行ログ（ノードの結果、出力）については、代わりに[実行履歴](./execution-history.md)、[Traces](../tabs/traces-tab.md)、またはエディターの Debug パネルをご使用ください。

[実行履歴](./execution-history.md)、[Traces](../tabs/traces-tab.md)、[キャンバス機能](./canvas-features.md)もあわせてご参照ください。

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Logs デモを見る</a></p>

### [DataTable](../tabs/datatable-tab.md)

DataTable タブでは、Heym 内で構造化データテーブルを作成および管理できます。型付きの列（string、number、boolean、date、JSON）を定義し、ダブルクリックによるインライン編集で行を管理し、CSV をインポート/エクスポートし、読み取り/書き込み権限を付けてユーザーまたは [Teams](./teams.md) とテーブルを共有できます。Workflow 内でプログラム的にテーブルにアクセスするには、[DataTable ノード](../nodes/datatable-node.md)をご使用ください。上部に固定された **System tables** セクションには **LLM Cost Table** が配置されています。これは、バックグラウンドで Helicone からシードされるモデルごとの価格設定の固定スキーマビューであり（24時間の TTL、手動 Refresh）、各ユーザーは価格を上書きしたり、Helicone が掲載していないモデルのカスタム行を追加したりできます。これらの価格設定ルールは、[Traces](../tabs/traces-tab.md) タブのコスト KPI とモデルごとのコストチャートを駆動します。

[DataTable ノード](../nodes/datatable-node.md)、[Traces](../tabs/traces-tab.md)、[Workflow の構造](./workflow-structure.md)、[Teams](./teams.md)もあわせてご参照ください。

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ DataTable デモを見る</a></p>
### [Drive](../tabs/drive-tab.md)

Drive タブには、Workflow 全体のスキルによって生成されたすべてのファイルが表示されます。各ファイルは名前、種類、サイズ、ソースノード、作成日、チーム共有状態とともに一覧表示され、検索、認証済みダウンロード、共有、削除、ページネーションの各コントロールを提供します。これは [File Generation](./file-generation.md)、[Drive](./drive.md) リファレンス、および [Drive ノード](../nodes/drive-node.md) に対応するダッシュボードです。

[Drive](./drive.md)、[File Generation](./file-generation.md)、[Drive ノード](../nodes/drive-node.md) もあわせてご参照ください。

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Drive デモを見る</a></p>

### [Canvas コラボレーション](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
