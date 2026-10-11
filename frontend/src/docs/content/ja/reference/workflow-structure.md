# Workflowの構造

Workflowはノードとエッジを持つJSONとして保存されます。利用可能なノードタイプについては[ノードタイプ](./node-types.md)を、`data`フィールド内の式構文については[Expression DSL](./expression-dsl.md)をご参照ください。

## Workflowオブジェクト

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## ノードオブジェクト

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Agentノードの`data`（永続メモリ）

[Agent](../nodes/agent-node.md)ノードは、キャンバスノードごとにオプションのナレッジグラフをサポートします：

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | `true`の場合、保存されたグラフをシステムPromptに読み込み、実行成功後に新しいファクトをマージします |
| `memoryShares` | array（オプション） | 他のAgentにこのノードのメモリグラフへのアクセスを許可します（`peerWorkflowId`、`peerCanvasNodeId`、`permission`: `read` \| `write`）。詳細は[Agent永続メモリ](./agent-persistent-memory.md)をご参照ください。 |

例：

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

APIパス、エディタの動作、抽出セマンティクスについては[Agent永続メモリ](./agent-persistent-memory.md)をご参照ください。

## エッジオブジェクト

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## ノードタイプ

一般的な`type`値：[Input](../nodes/input-node.md)（`textInput`）、[Cron](../nodes/cron-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)（`websocketTrigger`）、[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[Condition](../nodes/condition-node.md)、[Switch](../nodes/switch-node.md)、[Output](../nodes/output-node.md)、[JSON output mapper](../nodes/json-output-mapper-node.md)（`jsonOutputMapper`）、[Wait](../nodes/wait-node.md)、[HTTP](../nodes/http-node.md)、[WebSocket Send](../nodes/websocket-send-node.md)（`websocketSend`）、[Merge](../nodes/merge-node.md)、[Set](../nodes/set-node.md)、[Variable](../nodes/variable-node.md)、[Loop](../nodes/loop-node.md)などがあります。完全なリストは[ノードタイプ](./node-types.md)をご参照ください。同じ実行レベルのノードは[並列](./parallel-execution.md)で実行されます。

## エディタのレイアウト

各ノードはデスクトップキャンバスのレイアウト用に`position.x`と`position.y`を持ちます。768pxブレークポイント未満の画面では、エディタは自由形式のVue Flowキャンバスを全画面のインデントされたWorkflowツリーに置き換えます。ツリーは接続された実行パスをたどり、並列ブランチをマークし、デスクトップエディタと同じノードラベル、アイコン、最新の実行ステータスを使用します。

ノードをタップして選択します。記録された実行結果がある場合、入力、出力、エラータブを備えた全画面の詳細が開きます。モバイルの下部ナビゲーションには**Nodes**、**Properties**、**Run**、**More**が用意されており、ヘッダーには保存、履歴、検索、設定、共有のアクションが保持されています。デスクトップでは引き続き自由形式のVue Flowキャンバスとサイドパネルを使用します。

モバイルのNodesタブで**Add node**を使用してノードライブラリを検索します。通常のノードは追加直後に接続シートを開きます：アンカーノードを選択し、**After**、**Before**、または**Parallel**ブランチとして配置します。編集モードでは、既存の通常ノードをタップすると、現在の接続が選択された同じシートが開きます。Triggerノードは通常の入力を受け付けないため、独立したままです。編集コントロールは、選択したノードの削除アクションも公開します。実行の詳細には、隣接するノードの結果が利用可能な場合、前後の矢印が含まれます。AI Assistantは、アクティブなエディタタブを変更することなく、モバイルツリーの上にボトムシートとして開きます。

## 関連項目

- [ノードタイプ](./node-types.md) – すべてのノードタイプと説明
- [キャンバス機能](./canvas-features.md) – エディタ機能（データピン、実行ログ、有効化/無効化、サブWorkflowへの抽出）
- [ダウンロードとインポート](./download-import.md) – WorkflowをJSONとしてエクスポートおよびインポート
- [Agentノード](../nodes/agent-node.md) – Agentノードの`data`構造
- [Agent永続メモリ](./agent-persistent-memory.md) – `persistentMemoryEnabled`、`memoryShares`、メモリグラフAPI
- [Expression DSL](./expression-dsl.md) – `userMessage`、`condition`、`$vars`、`$global`などの構文
- [並列実行](./parallel-execution.md) – ノードが並列で実行される仕組み
- [Triggers](./triggers.md) – 開始ノードとエントリポイント
- [Workflowsタブ](../tabs/workflows-tab.md) – Workflowの作成と管理
