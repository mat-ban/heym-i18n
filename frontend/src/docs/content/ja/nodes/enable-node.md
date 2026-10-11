# ノードの有効化

**Enable Node** ノードは、別のノードを再び有効化します。実行されると、対象ノードの `active` を `true` に設定し、その変更を永続化します。これは [Disable Node](./disable-node.md) の対となるノードです。[Cron](./cron-node.md) Trigger や、無効化されていた任意のノードを再び有効化するために使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.targetNode`、`$nodeLabel.enabled` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `targetNodeLabel` | string | 有効化するノードのラベル（例：`hourlyCheck`） |

## 動作

- 対象は active として保存されるため、以降の実行や Trigger からも参照されます。再有効化された Cron Trigger は、次回のスケジュール時刻に再び発火します。
- 対象が Enable Node の下流に位置し、まだ実行されていない場合、現在の実行内でも実行されます。
- すでに active なノードを有効化しても何も変わりません。出力は引き続き `enabled: true` を報告します。
- `targetNodeLabel` が空の場合、またはそのラベルを持つノードが存在しない場合、ノードはエラーで失敗します。

## ユースケース

[Cron](./cron-node.md) Trigger をオンデマンドで開始します。Cron ノードを無効化した状態で保存し、Workflow に [Input](./input-node.md) Trigger などの第二のエントリーポイントを用意します。そのエントリーポイントへのリクエストが Enable Node を実行し、Cron が発火を開始します。

無効化された Trigger はそれ自体では実行を開始しないため、Enable Node は実行可能なエントリーポイントの背後に配置する必要があります。

## 例

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

フロー：Input → Enable Node（対象：cron）→ Output。Cron ノード `hourlyCheck` は同じ Workflow 内で無効化された状態で保存されており、有効化されると自身の HTTP チェックブランチを実行します。

## 関連

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Disable Node](./disable-node.md) – Workflow 内部からノードを無効化する
- [Cron Node](./cron-node.md) – 有効化する対象の Trigger
- [Condition Node](./condition-node.md) – 有効化する前に分岐する
- [Canvas Features](../reference/canvas-features.md) – 手動でノードを有効化・無効化する
