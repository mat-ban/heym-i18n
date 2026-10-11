# ノードタイプ

Heym は Workflow を構築するためのさまざまなノードタイプを提供しています。ノードの設定では、`$input.text` や `$nodeLabel.field` のような[式](./expression-dsl.md)を使用します。

## Trigger ノード

| ノード | 説明 | 出力 |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Workflow のテキスト入力ポイント（HTTP/[Webhook](./webhooks.md)） | 1 |
| [Cron](../nodes/cron-node.md) | スケジュール（Cron 式）で Trigger | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram ボットの Webhook 更新が到着したときに Trigger | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Slack が Events API の Webhook を送信したときに Trigger | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord がアプリケーションインタラクションの Webhook を送信したときに Trigger | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP メールボックスに新しいメールが到着したときに Trigger | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Heym がプラットフォームイベントを発行したときに Trigger（バッチ配列） | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | 外部 WebSocket サーバーへのアウトバウンド接続から Trigger | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | 単一使用のアップロードリンクを発行し、大きなファイルがアップロードされたときに開始 | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | キューからメッセージを受信したときに Trigger | 1 |
| [Error Handler](../nodes/error-handler-node.md) | いずれかのノードでエラーが発生したときに実行（入力エッジなし） | 1 |

すべてのエントリーポイントについては [Triggers](./triggers.md) を参照してください。

## AI ノード

| ノード | 説明 | 入力 | 出力 |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | 言語モデルでテキストを処理 | 1 | 1 |
| [Decision](../nodes/decision-node.md) | 意思決定モデルに型付きの質問を投げ、返された確率に基づいて分岐 | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | ツール呼び出し、スキル、MCP、オプションの[ヒューマンレビュー](./human-in-the-loop.md)、およびオプションの[永続メモリグラフ](./agent-persistent-memory.md)を備えた LLM。[Agent Architecture](./agent-architecture.md)を参照してください。 | 1 | 1、およびオプションの `review` 出力 |
| [Codex](../nodes/codex-node.md) | ChatGPT/Codex アクセス Token を使用して、GitHub リポジトリに対してローカルの Codex CLI を実行 | 1 | 1、および `question` 出力 |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go ゲートウェイ API キーを使用して、堅牢化されたコンテナ内で GitHub リポジトリに対して OpenCode CLI を実行 | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | LLM に選択させずに、特定の MCP ツールを直接呼び出し | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | RAG のために Qdrant または Postgres（pgvector）の[ベクターストア](../tabs/vectorstores-tab.md)に対して挿入、アップサート、削除、または検索を実行 | 1 | 1 |

## ロジックノード

| ノード | 説明 | 入力 | 出力 |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | if/else に基づいて分岐 | 1 | 2（true/false） |
| [Switch](../nodes/switch-node.md) | 値をケースにマッチさせてルーティング | 1 | n |
| [Merge](../nodes/merge-node.md) | 複数の入力を待機してマージ | n | 1 |
| [Loop](../nodes/loop-node.md) | 配列を反復処理 | 1 | 2（loop/done） |

## データノード

| ノード | 説明 | 入力 | 出力 |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | データを変換およびマッピング | 1 | 1 |
| [Converter](../nodes/converter-node.md) | フォーマット間（CSV、JSON、XML）のデータ変換、および画像や PDF の OCR によるテキスト化 | 1 | 1 |
| [Code](../nodes/code-node.md) | 独自の requirements.txt を持つ、使い捨てのネットワーク分離サンドボックスで Python を実行 | 1 | 1 |
| [Variable](../nodes/variable-node.md) | 変数の設定または取得（Workflow ローカルまたは[グローバル](./global-variables.md)） | 1 | 1 |
| [Execute](../nodes/execute-node.md) | 別の Workflow を呼び出し | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Heym の Workflow と実行履歴を読み取り | 1 | 1 |

## 統合ノード

| ノード | 説明 | 入力 | 出力 |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | HTTPリクエスト（cURL）を実行します | 0 または 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | 外部WebSocketに接続し、1件のメッセージを送信します | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Telegramボットメッセージを送信します | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Slackメッセージを送信します | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Discord Webhookメッセージを送信します | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | SMTP経由でメールを送信します | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis操作（set、get、hasKey、deleteKey）を実行します | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Gristスプレッドシートの読み書きを行います | 1 | 1 |
| [GitHub](../nodes/github-node.md) | GitHub REST APIを通じて、リポジトリ、ユーザー、Issue、プルリクエスト、レビュー、リリース、Actions Workflow、ファイルを管理します | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Jira REST APIを通じて、Jiraプロジェクト、Issue、コメント、添付ファイル、ユーザー、通知、Workflowトランジションを管理します | 1 | 1 |
| [Linear](../nodes/linear-node.md) | GraphQLを通じて、Linearチーム、プロジェクト、Issue、Workflowステート、コメントを管理します | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | OAuth2経由でGoogle Sheetsの読み書きを行います | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | OAuth2経由でGoogle Driveファイルの一覧表示、ダウンロード、更新、削除を行います | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | BigQueryでSQLクエリを実行し、行を挿入します | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | PostgRESTを通じてSupabaseテーブルのクエリと変更を行います | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouseに対してSQL、CRUD、カウント操作を実行します | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Notionデータベース、データソース、ページ、ブロックを管理します | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Sentryの組織、プロジェクト、チーム、Issue、イベント、リリースを管理します | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | バケットとフォルダを管理し、オブジェクトの一覧表示、アップロード、ダウンロード、コピー、削除を行います | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Heym DataTable（ファーストパーティストレージ）の読み書きを行います | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Driveファイルを管理します：削除、パスワード設定、TTL、最大ダウンロード数、チーム共有/共有解除 | 1 | 1 |

## 自動化ノード

| ノード | 説明 | 入力 | 出力 |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | FlareSolverrでWebページをスクレイピングします | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | AIステップとAuto Healによるブラウザ自動化を行います | 1 | 1 |

## ユーティリティノード

| ノード | 説明 | 入力 | 出力 |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | 実行を遅延させます | 1 | 1 |
| [Output](../nodes/output-node.md) | 出力Endpointです | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | フィールドをJSONオブジェクトにマッピングします。唯一の終端ノードの場合、トップレベルのWebhook/実行ボディとなります | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | HTMLページをレンダリングします。唯一の終端ノードの場合、Webhookがtext/htmlで応答します | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | 上流の行をチャートPayloadにマッピングする、ターミナルダッシュボードウィジェット出力です | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | キャンバスにMarkdownノートを追加します（実行されません） | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | バックエンドコンソールにログを出力します | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Workflow内の別のノードを無効化します | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Workflow内の無効化されたノードを有効化します | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | エラー応答でWorkflowを停止します | 1 | 0 |

## プラグインノード

プラグインノードは、インスタンスにインストールされたプラグインによって提供されます。インストールされた各プラグインは、**Plugins**配下のパレットに独自の名前で表示されますが、内部的には以下の2つのノードタイプのいずれかにマッピングされます。

| ノード | 説明 | 入力 | 出力 |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | インストールされたプラグインが提供するカスタムアクションです | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | インストールされたプラグインが提供するカスタムTriggerです | 0 | 1 |

## 関連項目

- [Canvasの機能](./canvas-features.md) – データピン、実行ログ、有効化/無効化、サブWorkflowへの抽出
- [Agentノード](../nodes/agent-node.md) – AI Agentノードの詳細リファレンス
- [Agentアーキテクチャ](./agent-architecture.md) – サブエージェント、オーケストレーター、スキル、MCP、ツール呼び出し
- [Agent永続メモリ](./agent-persistent-memory.md) – ノードごとのナレッジグラフ、共有、バックグラウンド抽出
- [Human-in-the-Loop](./human-in-the-loop.md) – 人間の承認のためにAgentの出力を一時停止
- [Expression DSL](./expression-dsl.md) – ノード設定内でのデータ参照
- [Expression評価ダイアログ](./expression-evaluation-dialog.md) – ライブバックエンドプレビュー付きの拡張可能なエディタ
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – 単一使用リンクを通じて大容量マルチパートアップロードを受け付け
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – リアルタイムのアウトバウンドソケットTrigger
- [WebSocket Send](../nodes/websocket-send-node.md) – 外部ソケットへのメッセージプッシュ
- [Workflow構造](./workflow-structure.md) – ノードとエッジのJSON形式
- [Triggers](./triggers.md) – すべてのWorkflowエントリーポイント
- [Credentialsタブ](../tabs/credentials-tab.md) – LLM、HTTP、その他のノード用のAPIキーを追加
- [Credentials共有](./credentials-sharing.md) – 他のユーザーとCredentialsを共有
- [Portal](./portal.md) – Workflowを公開チャットUIとして公開
- [Vectorstoresタブ](../tabs/vectorstores-tab.md) – RAGノード用のベクターストアを作成
