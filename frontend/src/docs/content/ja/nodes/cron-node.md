# Cron

**Cron** ノードは、cron 式を使用してスケジュールに従い Workflow をトリガーします。ユーザーによる入力は不要で、指定された時刻に Workflow が自動的に実行されます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| 出力内容 | Trigger イベント（Payload なし） |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `cronExpression` | string | cron 式（例：毎時実行なら `0 * * * *`） |

## Cron 式のフォーマット

標準的な 5 フィールドの cron：`分 時 日 月 曜日`

| フィールド | 値 | 例 |
|-------|--------|---------|
| 分 | 0–59 | `0` = 0 分に実行 |
| 時 | 0–23 | `*` = 毎時 |
| 日 | 1–31 | `*` = 毎日 |
| 月 | 1–12 | `*` = 毎月 |
| 曜日 | 0–7（0 と 7 は日曜日） | `*` = 毎日 |

**一般的な例：**

- `0 * * * *` – 毎時
- `0 0 * * *` – 毎日午前 0 時
- `*/15 * * * *` – 15 分ごと
- `0 9 * * 1-5` – 平日 9:00

## 例

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Trigger](../reference/triggers.md) – Cron、Input、RabbitMQ
- [Disable ノード](./disable-node.md) – 条件後に cron Trigger を停止する
- [Enable ノード](./enable-node.md) – 無効化された cron Trigger を再度開始する
