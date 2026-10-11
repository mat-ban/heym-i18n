# 実行

**Execute** ノードは、別の Workflow（サブ Workflow）を呼び出し、そこへ入力を受け渡します。再利用可能なロジックに使用してください。データ変換には使用せず、その用途には [Set](./set-node.md) をご利用ください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Output | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `executeWorkflowId` | UUID | 実行する Workflow の ID |
| `executeInput` | expression | 単一の入力（入力フィールドが 1 つの Workflow 向け） |
| `executeInputMappings` | array | 複数入力用の `{ key, value }`。`key` = 対象 Workflow の入力フィールド名。 |
| `executeDoNotWait` | boolean | `true` の場合、待機せずにサブ Workflow をバックグラウンドでディスパッチします。Output: `{ "status": "dispatched", "workflow_id": "..." }`。デフォルト: `false`。 |

## レスポンス形式

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## 待機しない場合

`executeDoNotWait: true` の場合、ノードはサブ Workflow をバックグラウンドスレッドへディスパッチし、即座に以下を返します：

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

親 Workflow は待機せずに次のノードへ進みます。サブ Workflow の実行記録は、完了時に非同期で trace に書き込まれます。サブ Workflow の結果を後続処理で必要としない場合にご利用ください。

## 単一入力

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## 複数入力

対象 Workflow が複数の入力フィールドを持つ場合は、`executeInputMappings` を使用します：
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

`key` は、対象 Workflow の [Input](./input-node.md) `inputFields` のキーと一致している必要があります。

## 関連項目

- [Canvas Features](../reference/canvas-features.md) – 選択したノードから Execute ノードを作成する「Extract to Sub-Workflow」
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Input Node](./input-node.md) – 対象 Workflow の入力フィールド
- [Set Node](./set-node.md) – データ変換（Workflow 呼び出しではありません）
