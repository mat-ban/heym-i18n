# ノードの無効化

**Disable Node** ノードは、Workflow 内の別のノードを恒久的に無効化します。実行されると、対象ノードの `active` を `false` に設定し、その変更を永続化します。条件が満たされた後に Cron Trigger を停止するといった、一度きりの操作にご利用ください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力 | `$nodeLabel.targetNode`、`$nodeLabel.disabled` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `targetNodeLabel` | string | 無効化するノードのラベル（例：`hourlyCheck`） |

## ユースケース

条件が満たされた後に [Cron](./cron-node.md) Trigger を無効化し、以降の Workflow 実行で動作しないようにします。後で再度有効化するには、[Enable Node](./enable-node.md) を使用してください。

## 例

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

フロー：Cron → HTTP check → Condition（status complete？）→ true の場合：Disable Node（対象：cron）→ Output。

## 関連

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Enable Node](./enable-node.md) – 無効化されたノードを再度有効化する
- [Cron Node](./cron-node.md) – 無効化する Trigger
- [Condition Node](./condition-node.md) – 無効化する前の分岐
