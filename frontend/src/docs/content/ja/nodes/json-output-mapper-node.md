# JSON 出力マッパー

**JSON output mapper** ノードは、key/value の[マッピング](./set-node.md)（[Set](./set-node.md) と同じモデル）から JSON オブジェクトを構築します。呼び出し元がレスポンスのルートで**プレーンな JSON ボディ**を受け取るべき場合に使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 0（sink） |
| ランタイム出力 | `mappings` から構築されたオブジェクト |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` エントリ（Set と同じ） |

## Agent tool での使用

サポートされていません。このノードは終端の sink であるため、[Agent Node](./agent-node.md) の tools ハンドルにアタッチすることはできません。エージェントが会話の途中で値を整形する必要がある場合は、[Set](./set-node.md) ノードを使用してください。

## Webhook と実行時の動作

このノードが workflow の**唯一の**終端出力である場合、実行の **outputs** はマッピングされたオブジェクトそのものになります。`mappings` のキーは JSON の**トップレベル**に現れます。ノードの label をキーとする外側のラッパーは**存在せず**、`{ "result": ... }` オブジェクトも**存在しません**（[Output](./output-node.md) ノードとは異なります）。

複数の終端ノードが出力を生成する場合（たとえば [Output](./output-node.md) と JSON output mapper、または複数のブランチ）、Heym は通常の形式を使用します。各終端はその `label` をキーとします。

## ループの制限

[Output](./output-node.md) と同じルールです。このノードをループのイテレーションブランチ内に配置しないでください。ループの `done` ブランチの後にのみ配置してください。[Loop](./loop-node.md) を参照してください。

## 例

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## 関連項目

- [Set](./set-node.md) – 中間変換のための同じマッピングの仕組み
- [Output](./output-node.md) – `result` ラッピングを伴うメッセージまたはスキーマベースのレスポンス
- [Node Types](../reference/node-types.md) – すべてのノードタイプ
- [Workflow Structure](../reference/workflow-structure.md) – JSON workflow 形式
- [Webhooks](../reference/webhooks.md) – Execute endpoint とレスポンス
