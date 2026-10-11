# Switch

**Switch** ノードは、値とケースの照合結果に基づいて、実行を異なるパスへルーティングします。N 個のケースとデフォルトをサポートします。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | n（ケースごとに 1 つ + デフォルト） |
| 出力 | 一致したブランチへ入力をパススルーします |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `expression` | expression | 評価する値（例: `$input.category`） |
| `cases` | string[] | 照合するケース値（例: `["case1", "case2", "case3"]`） |

## エッジハンドル

- 各ケースにはソースハンドルが割り当てられます（インデックス 0、1、2、…）
- 一致しない値用のデフォルトハンドル

## 例

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

`sourceHandle` をケースインデックス（0、1、2）または一致しない値用のデフォルトハンドルに設定してエッジを接続します。

## 関連

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Condition ノード](./condition-node.md) – If/else 分岐
- [Expression DSL](../reference/expression-dsl.md) – 式の構文
