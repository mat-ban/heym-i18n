# コアコンセプト

## Workflow

Workflowは、**エッジ**で接続された[**ノード**](../reference/node-types.md)の有向グラフです。[Workflows](../tabs/workflows-tab.md)タブでWorkflowを管理します。[フォルダ](../reference/workflow-organization.md)で整理できます。実行は[Triggerノード](../reference/triggers.md)（[Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)）から処理ノードを経て[Output](../nodes/output-node.md)ノードへと流れます。JSON形式については[Workflow構造](../reference/workflow-structure.md)を参照してください。Workflowを[Template](../tabs/templates-tab.md)として保存・共有することで、プロジェクト間で再利用できます。Workflowは[Board](../tabs/board-tab.md)からも実行でき、カンバンカードがカードの完全なコンテキストとともにカラムのWorkflowチェーンをTriggerします。

## ノード

各ノードは以下を持ちます：

- **Type** – 動作を決定します（例：`llm`、`condition`、`http`）
- **Data** – 設定（モデル、Prompt、URLなど）
- **Inputs/Outputs** – 他のノードに接続するためのハンドル

完全なリストは[ノードタイプ](../reference/node-types.md)を参照してください。

## エッジ

エッジは、ソースノードの出力ハンドルをターゲットノードの入力ハンドルに接続します。実行中、データはエッジに沿って流れます。

## 実行フロー

1. **Trigger** – Input、Cron、Telegram Trigger、Discord Trigger、IMAP Trigger、または[WebSocket Trigger](../nodes/websocket-trigger-node.md)ノードが実行を開始します（[Trigger](../reference/triggers.md)を参照）
2. **ダウンストリーム** – 各ノードは接続されたアップストリームノードから出力を受け取ります。[並列実行](../reference/parallel-execution.md)は独立したノードを同時に実行します
3. **Expression** – ノードは`$nodeLabel.field`を介してアップストリームデータを参照します。[Expression DSL](../reference/expression-dsl.md)を参照してください。
4. **Output** – [Output](../nodes/output-node.md)ノードが最終結果を生成します

## Expression参照

Inputノードのデータには`$input`を、任意のアップストリームノードには`$nodeLabel.field`を使用します。例：`$llm.text`は「llm」というラベルのノードの`text`フィールドを参照します。完全な構文：[Expression DSL](../reference/expression-dsl.md)。Expressionの編集時には、[Expression評価ダイアログ](../reference/expression-evaluation-dialog.md)を使用すると、ライブバックエンドプレビュー付きのより大きなエディタを利用できます。

## 関連項目

- [クイックスタート](./quick-start.md) – 最初のWorkflowを構築する
- [キャンバス機能](../reference/canvas-features.md) – データピン、実行ログ、有効化/無効化、サブWorkflowへの抽出
- [AIアシスタント](../reference/ai-assistant.md) – 自然言語でWorkflowを作成する
- [ノードタイプ](../reference/node-types.md) – 利用可能なすべてのノード
- [Expression DSL](../reference/expression-dsl.md) – Expressionでのデータ参照
- [Expression評価ダイアログ](../reference/expression-evaluation-dialog.md) – ライブバックエンドプレビュー付きの拡張エディタ
- [Workflowsタブ](../tabs/workflows-tab.md) – Workflowとフォルダの管理
- [Workflow整理](../reference/workflow-organization.md) – フォルダとスケジュール削除
- [Trigger](../reference/triggers.md) – Workflowのエントリーポイント
- [Webhook](../reference/webhooks.md) – HTTP Webhook Trigger（TTL、キャッシュ、レート制限）
- [並列実行](../reference/parallel-execution.md) – ノードが並列で実行される仕組み
