# Heym Trigger

**Heym Trigger** ノードは、Heym 自身がプラットフォームイベントを発行したときに Workflow を開始します。これは Heym を Heym で自動化するためのゼロ入力の Trigger ノードであり、変更監査証跡、デプロイ通知、インスタンスのヘルスダイジェストなどに活用できます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| 出力 | `$nodeLabel.events`、`$nodeLabel.count`、`$nodeLabel.triggered_at` |
| Credential | 不要 |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `eventNames` | String array | 購読するイベントを指定します。空のままにすると、すべてのイベントを受信します。 |

## イベント

| イベント | 発行タイミング | スコープ |
|-------|----------------|-------|
| `heym.started` | Heym プラットフォームが起動したとき | インスタンス全体: すべての購読者が受信します |
| `workflow.created` | Workflow が作成されたとき | Workflow 所有者の購読者のみ |
| `workflow.updated` | Workflow が保存されたとき | Workflow 所有者の購読者のみ |
| `workflow.deleted` | Workflow が削除されたとき | Workflow 所有者の購読者のみ |

ダッシュボードウィジェットは内部的に Workflow として保存されますが、`workflow.*` イベントを発行することはありません。

## 配信はバッチ単位で行われます

Heym は 5 秒ごとにイベントをディスパッチします。**1 回のディスパッチパスで取得されたすべてのイベントは、単一の Workflow 実行として配列で到着します。**

- 5 秒以内に 2 つの Workflow を作成 → 2 つのイベントを含む **1 回** の実行。
- 1 つの Workflow を作成 → 1 要素の配列を含む **1 回** の実行。

この形状は決して変わらないため、下流の式がイベントが 1 件か複数件かに応じて分岐する必要はありません。イベントごとに 1 回処理を行う必要がある場合は、`$nodeLabel.events` に対して [Loop](./loop-node.md) ノードを配置してください。

## Exactly-Once 配信

各イベントは、配信される前に購読ノードごとに一意のデータベース制約を通じて取得されます。これはすべての uvicorn ワーカー、すべてのコンテナ、すべてのマシンにわたって維持されます。つまり、Heym を 2 台のサーバーで実行しても、イベントが 2 回配信されることはありません。取得を記録できない場合、イベントはまったく配信されません。この設計は、2 回発火するよりもフェイルクローズすることを選択しています。

同じイベントを購読する 2 つの異なる `heymTrigger` ノードは、それぞれがそのイベントを 1 回受信します。互いに競合することはありません。

## ディスパッチウィンドウ

ディスパッチャは、**直近 5 分間** に発行されたイベントのみを対象とします。それより古いイベントは検査用にログに残りますが、配信されることはありません。これにより、ダウンタイム後の動作が制限されます。1 時間オフラインになった後に Heym を再起動しても、何も再生されず、1 時間分のバックログが一度に発火することはありません。

イベントは **7 日間** 保持され、その後削除されます。

## 出力フィールド

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.events` | イベントオブジェクトの配列。古い順に並びます。常に配列です。 |
| `$nodeLabel.events[0].id` | イベント UUID |
| `$nodeLabel.events[0].name` | イベント名。例: `workflow.created` |
| `$nodeLabel.events[0].payload` | イベントボディ |
| `$nodeLabel.events[0].workflow_id` | 対象 Workflow の id。`heym.started` の場合は `null` |
| `$nodeLabel.events[0].created_at` | イベントが発行された時刻の ISO タイムスタンプ |
| `$nodeLabel.count` | このバッチ内のイベント数 |
| `$nodeLabel.triggered_at` | Workflow 実行の ISO タイムスタンプ |

### Payload の形状

`workflow.created`、`workflow.updated`、`workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` は、削除直前に取得された名前を保持します。イベントを読み取る時点では Workflow の行はすでに存在しないためです。

## Workflow の例

**Workflow 変更監査証跡**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** のラベルは `platformEvents`、`workflow.created`、`workflow.updated`、`workflow.deleted` を購読
- **Heym** ノードで `getWorkflow` を指定し、`heymWorkflowId` に `$platformEvents.events[0].workflow_id` を設定
- **Slack** メッセージ: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## 注意事項

- `heym.started` は、Heym がコンテナごとに 8 つのワーカーを実行していても、ワーカーごとではなく **プラットフォーム起動ごとに 1 回** 発火します。起動時刻が 5 分以上離れたコンテナは、それぞれ 1 つのイベントを発行します。
- この方法でトリガーされた実行は、履歴に `trigger_source = "heym_event"` として表示されます。
- 将来のバージョンで追加されるイベントタイプを自動的に取得したい場合は、4 つすべてを列挙するのではなく、**Events** を none に設定してください。

## 関連項目

- [Heym](./heym-node.md) – Workflow と実行履歴の読み取り
- [Triggers](../reference/triggers.md) – すべての Workflow エントリポイントの概要
- [Loop](./loop-node.md) – バッチ内のイベントごとに 1 回処理を実行
