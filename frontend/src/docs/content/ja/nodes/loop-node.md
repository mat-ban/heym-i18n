# ループ

**Loop** ノードは配列を反復処理し、各項目に対して下流のノードを実行します。反復本体の最後のノードから戻り接続を行い、次の反復へ進める必要があります。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 2（default + loop back） |
| 出力 | 2（loop、done） |
| Output | `$nodeLabel.item`、`$nodeLabel.index`、`$nodeLabel.total`、`$nodeLabel.isFirst`、`$nodeLabel.isLast` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `arrayExpression` | expression | 配列に解決される式（例：`$input.items`） |

## エッジハンドル

- **Source `loop`** – 各項目を処理するノードに接続します（反復ごとに実行されます）
- **Source `done`** – すべての反復完了後に実行されるノードに接続します
- **Target default** – 配列を含む初期データを受け取ります
- **Target `loop`** – 反復本体の最後のノードから戻り接続を受け取ります

## Loop コンテキスト（反復本体内）

- `$loopNode.item` – 現在の項目
- `$loopNode.index` – 0 始まりのインデックス
- `$loopNode.total` – 項目の総数
- `$loopNode.isFirst` – 真偽値
- `$loopNode.isLast` – 真偽値

## 重要なルール

1. **戻り接続が必須：** 反復本体の最後のノードは、必ず Loop の `loop` 入力ハンドルに接続し直す必要があります。
2. **反復本体内では出力禁止：** 反復本体の内部では [Output](./output-node.md) ノードの使用は禁止されています。中間結果には [Set](./set-node.md) または [Variable](./variable-node.md) を使用してください。
3. **結果の自動収集なし：** Loop は結果を収集しません。結果を蓄積するには、`$array()` と `.add()` を併用した Variable ノードを使用してください。

## 例

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

フロー：loop → 処理ノード →（loop に戻る）→ loop → done ブランチ → output。

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Variable Node](./variable-node.md) – Loop 内で項目を収集する
- [Expression DSL](../reference/expression-dsl.md) – `item`、`index`、配列メソッド
