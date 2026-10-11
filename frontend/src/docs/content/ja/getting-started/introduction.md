# はじめに

**エージェント型システムを構築し、自信を持って運用しましょう。**

Heym は、本番環境で AI エージェントを実行・統制するためのインフラストラクチャです。エージェントのオーケストレーション、ビジネスプロセスの自動化、すべての実行の検査、そして人間によるコントロールの維持を実現します。Heym はご自身のインフラストラクチャ上にデプロイできます。

Heym では、Workflow がエージェント、決定論的ステップ、ツール、データの連携方法を定義します。ランタイムはそのグラフを実行し、すべての実行を記録し、指定した箇所で人間のレビューのために一時停止します。ビジュアルキャンバスは Workflow を構築・検査する場所であり、同じ Workflow は API、スケジュール、イベント Trigger、MCP クライアント、Portal チャットからも実行できます。製品サイトは [heym.run](https://heym.run) をご覧ください。エージェントライフサイクルの各段階で Heym が何を担うかについては、[Why Heym](./why-heym.md) を参照してください。

## できること

- **構築** – [Workflows](../tabs/workflows-tab.md) タブの[キャンバス](../reference/canvas-features.md)上でエージェントと決定論的ステップを組み合わせたり、[AI Assistant](../reference/ai-assistant.md) に記述したり、[Templates](../tabs/templates-tab.md) から始めたりできます
- **オーケストレーション** – [Agent](../nodes/agent-node.md)、[LLM](../nodes/llm-node.md)、[RAG](../nodes/rag-node.md) ノード、[サブエージェント](../reference/agent-architecture.md)、MCP ツール、および HTTP、Slack、メールなどの[インテグレーション](../reference/integrations.md)を、依存関係が許す箇所では[並列実行](../reference/parallel-execution.md)とともに調整します
- **実行** – [Webhook](../reference/webhooks.md)、[Cron](../nodes/cron-node.md) スケジュール、イベント [Trigger](../reference/triggers.md) から Workflow を開始し、ノード単位のリトライ、[エラーハンドリング](../nodes/error-handler-node.md)、インスタンス間の[負荷分散](../reference/cluster.md)を利用できます
- **観測** – [実行履歴](../reference/execution-history.md)、Token コストを含む [LLM トレース](../tabs/traces-tab.md)、[分析](../tabs/analytics-tab.md)、[アラート](../tabs/alerts-tab.md)を検査し、[OpenTelemetry](../reference/opentelemetry.md) トレースをエクスポートできます
- **評価** – [Evals](../tabs/evals-tab.md) タブで Prompt とモデルを期待される出力に対してテストします
- **統制** – [人間によるレビュー](../reference/human-in-the-loop.md)のためにエージェントを一時停止し、[ガードレール](../reference/guardrails.md)で安全でないコンテンツをブロックし、[Credentials](../tabs/credentials-tab.md)、[チーム](../reference/teams.md)、[シングルサインオン](../reference/sso.md)、[監査証跡](../reference/audit.md)でアクセスを管理します
- **公開** – Workflow を REST および [SSE ストリーミング](../reference/sse-streaming.md)、[MCP](../tabs/mcp-tab.md) ツール、エンドユーザー向けの [Portal](../reference/portal.md) チャットインターフェースとして提供します。[Chat](../tabs/chat-tab.md) タブを使ってモデルを直接テストできます
- **Heym とのチャット** – ドキュメント内の [Chat with Heym](../reference/chat-with-heym.md) ダイアログから、ページを認識した製品に関する質問ができます

## 主要な概念

- **Workflows** – ノードとエッジによる有向グラフです。[Workflows](../tabs/workflows-tab.md) タブで管理します。[Workflow の構造](../reference/workflow-structure.md)を参照してください。
- **ノード** – 処理単位です（[Input](../nodes/input-node.md)、[LLM](../nodes/llm-node.md)、[Condition](../nodes/condition-node.md) など）。[ノードの種類](../reference/node-types.md)を参照してください。
- **エッジ** – 実行フローを定義する接続です
- **Credentials** – [Credentials](../tabs/credentials-tab.md) タブに保存され、ノードから参照される API キーとシークレットです。
- **変数** – [Variables](../tabs/global-variables-tab.md) タブに保存される永続的なキーと値のデータで、`$global.variableName` でアクセスできます。[グローバル変数](../reference/global-variables.md)を参照してください。
- **式** – `$input` および `$nodeName.field` で上流のデータを参照します。[式 DSL](../reference/expression-dsl.md)を参照してください。

## 関連項目

- [Why Heym](./why-heym.md) – エージェントライフサイクルの各段階で Heym が担うこと
- [クイックスタート](./quick-start.md) – 最初の Workflow を構築する
- [実行とデプロイ](./running-and-deployment.md) – `run.sh` でローカル起動、または `deploy.sh` でデプロイ
- [AI Assistant](../reference/ai-assistant.md) – 自然言語で Workflow を作成する
- [Chat with Heym](../reference/chat-with-heym.md) – ドキュメントを読みながら追加の質問をする
- [コアコンセプト](./core-concepts.md) – Workflow、ノード、実行フロー
- [Workflows タブ](../tabs/workflows-tab.md) – Workflow とフォルダの管理
- [Credentials タブ](../tabs/credentials-tab.md) – ノード用の API キーを追加する
