# 並行実行

Heym は、互いに依存関係のないノードを並列で実行し、複数の Workflow 実行を同時に実行することを可能にします。

## 単一実行内での並列処理

### DAG ベースのスケジューリング

Executor は、有向非巡回グラフ（DAG）を使用してノードを**実行レベル**ごとにグループ化します：

1. **レベル 0** – 入力エッジを持たないノード（開始ノード）
2. **レベル N** – 上流の依存関係がすべてレベル 0..N-1 に属するノード

同じレベル内のノードは互いに依存関係がなく、並列で実行されます。

### スレッドプール

- **共有プール**: ノード実行用の `ThreadPoolExecutor(max_workers=8)`
- **スケジューリング**: `wait(..., return_when=FIRST_COMPLETED)` – いずれかのノードが完了するとすぐに、下流のノードがスケジュールされます
- **スレッドセーフ**: ノードの出力はロック（`store_node_output`）を使用して保存されます

### Orchestrator サブエージェント

Orchestrator エージェントが 1 ターンで複数の `call_sub_agent` ツール呼び出しを返した場合、それらは並列で実行されます。詳細は [Agent Architecture](./agent-architecture.md) を参照してください。

### Merge ノード

[Merge](../nodes/merge-node.md) ノードは、複数の並列ブランチからの出力を統合します。結果を明示的に統合する必要がある場合に使用してください。それ以外の場合、並列ブランチはそれぞれ別々の出力ノードで終了することができます。

### ループ

ループのイテレーションは**順次**実行されます。ループ本体のノードは、イテレーションごとに再スケジュールされます。

### 早期リターン

`allowDownstream` を持つ出力ノードは、早期にリターンすることができます。残りの下流の処理はバックグラウンドで実行されます。

## 同時 Workflow 実行

- **Workflow ごとのロックなし** – 複数のリクエストが同じ Workflow を同時に実行できます
- **非同期 API** – FastAPI のエンドポイントは `asyncio.to_thread(execute_workflow)` を使用するため、イベントループの応答性が維持されます
- **分離** – 各実行は独自の `WorkflowExecutor` インスタンスと状態を取得します

Workflow を実行する Trigger（[Webhook](./webhooks.md)、[Portal](./portal.md)、[Cron](./triggers.md)、RabbitMQ、MCP、Editor）は、それぞれ独立して `execute_workflow` を呼び出します。

## ストリーミング

ストリーミングは同じ並列モデルを使用しますが、ノードの完了時にイベントを発行します。Editor と Portal のチャット UI は、リアルタイムの進捗のために内部的にストリーミングを使用しており、Webhook ユーザーも [SSE Streaming](./sse-streaming.md) の execute エンドポイントを通じて同じイベントストリームを利用できるようになりました。

## 関連項目

- [Why Heym](../getting-started/why-heym.md) – Heym ランタイムにおける並列 DAG 実行
- [Workflow Structure](./workflow-structure.md) – ノード、エッジ、実行フロー
- [Core Concepts](../getting-started/core-concepts.md) – 実行フローの概要
- [Node Types](./node-types.md) – [Merge](../nodes/merge-node.md) ノードおよびその他の種類
- [Triggers](./triggers.md) – 実行をトリガーするエントリーポイント
- [SSE Streaming](./sse-streaming.md) – `/execute/stream` のイベントストリーム形式
