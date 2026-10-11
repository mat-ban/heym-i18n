# 条件

**Condition** ノードは、if/else 式に基づいて Workflow を分岐させます。結果に応じて true または false のパスへルーティングします。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 2 (true, false) |
| 出力内容 | 選択されたブランチへ入力をパススルー |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `condition` | expression | JavaScript ライクな式（例：`$input.text.length > 0`） |

## エッジハンドル

- **ソースハンドル `true`** – condition が truthy と評価された場合
- **ソースハンドル `false`** – condition が falsy と評価された場合

## 式の演算子

対応：`==`、`!=`、`>`、`<`、`>=`、`<=`、`&&`、`||`、`.length`、`.contains()` など。詳細は [Expression DSL](../reference/expression-dsl.md) をご参照ください。

## 例

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

異なるブランチへルーティングするには、`sourceHandle: "true"` または `sourceHandle: "false"` を指定してエッジを接続します。

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Switch Node](./switch-node.md) – 値による多方向ルーティング
- [Expression DSL](../reference/expression-dsl.md) – condition の構文
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – condition のライブバックエンドプレビュー付き拡張エディタ
