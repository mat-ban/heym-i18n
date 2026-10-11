# 変数

**Variable** ノードは、`$vars.variableName`（Workflow ローカル）または `$global.variableName`（永続的）を介して任意のノードからアクセス可能な変数を設定または更新します。カウンター、累積リスト、および Workflow 全体で共有される状態に使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力値 | `$nodeLabel.value`、または `$vars.variableName` / `$global.variableName` を介してアクセス |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `variableName` | string | 変数名（`$vars.variableName` または `$global.variableName` として使用されます）。[予約名](../reference/expression-dsl.md)は避けてください。 |
| `variableValue` | expression | 設定する値。式をサポートします。 |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | 型変換（デフォルト: auto） |
| `isGlobal` | boolean | `true` の場合、[Global Variable Store](../reference/global-variables.md) に保存されます（永続的、ユーザースコープ）。`false` または省略した場合、Workflow ローカル（インメモリ）になります。 |

## 配列変数

`.add()` を使用する前に、Variable ノードで `$array()` または `$array("a", "b")` を使用して配列を初期化してください：

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

その後、アイテムを追加します（括弧内に `$` は不要）：

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## 重要なルール

**メソッドの括弧内では絶対に `$` を使用しないでください：**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – 式が壊れます

## 例 – カウンター

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Loop Node](./loop-node.md) – ループ本体で Variable を使用してアイテムを収集
- [Expression DSL](../reference/expression-dsl.md) – `$vars`、`$global`、予約名
- [Global Variables](../reference/global-variables.md) – `isGlobal` を使用した永続変数
