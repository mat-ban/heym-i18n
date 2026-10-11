# 値設定

**Set** ノードは、入力データを変換し、カスタム出力にマッピングします。大文字変換、部分文字列、連結、乱数、その他あらゆるデータ変換に使用します。Workflow の呼び出しには使用しません（その用途には [Execute](./execute-node.md) を使用してください）。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力 | 各マッピングキーに対する `$nodeLabel.keyName` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `mappings` | array | キーと値のペア。各要素は `{ key, value }` で、`value` は [expression](../reference/expression-dsl.md) です |

## Agent ツールとしての使用

Set ノードがキャンバスノードツールとして [Agent Node](./agent-node.md) に接続されている場合、各マッピング値はボットアイコンで **agent-provided**（エージェント提供）としてマークできます。マークされたマッピング値は、実行時にエージェントが入力するツールパラメータになります。マークされていないマッピングは、ノード設定内で固定されたままです。

ボットアイコンは、Set ノードがエージェントのツールハンドルに接続されている場合にのみ表示されます。単独の Set ノードでは、agent-provided コントロールは表示されません。

## 式のルール

- 前のノードを参照: `$nodeName.text`、`$nodeName.body.field`
- 関数を使用: `$randomInt(1, 10)`、`$range(1, 5)`、`$now.format('HH:mm')`
- `$range(a,b)` は b を含みません。`a > b` の場合はエラーになります。
- 式の先頭に `$` は 1 つだけ記述します。括弧の内部には決して記述しないでください。
- キーで出力にアクセス: `$setNode.randomNumber`、`$setNode.text`

## 例

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

下流のノードは `$transformData.text`、`$transformData.firstChar`、`$transformData.randomNum`、`$transformData.rangeArr` を介してアクセスします。

## 関連項目

- [JSON output mapper](./json-output-mapper-node.md) – 同じマッピング。唯一の終端ノードが Webhook／実行に対してルート JSON を返します
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Execute Node](./execute-node.md) – Workflow の呼び出し（データ変換ではありません）
- [Expression DSL](../reference/expression-dsl.md) – 関数と構文
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – ライブバックエンドプレビューとマッピングの Prev/Next を備えた拡張エディタ
