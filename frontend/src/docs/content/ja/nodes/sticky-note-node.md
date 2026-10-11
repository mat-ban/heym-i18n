# 付箋

**Sticky Note** ノードは、キャンバスにリッチな Markdown ノートを追加します。このノードは実行されません。ドキュメント、手順、参照画像、または Workflow のメモとしてご利用ください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 0 |
| 出力結果 | N/A（実行されません） |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `stickyTitle` | string | Sticky Note の上部に表示されるタイトル。 |
| `stickyColor` | string | 背景色：`yellow`、`sky`、`emerald`、`rose`、`violet`、または `zinc`。 |
| `note` | string | Markdown コンテンツ。キャンバス上でダブルクリックして編集できます。リンクや `![Alt](https://example.com/image.png)` のような画像 Markdown をサポートします。 |

## 例

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Workflow の整理](../reference/workflow-organization.md) – Workflow を整理する
