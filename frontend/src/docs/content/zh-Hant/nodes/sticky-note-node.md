# 便利貼

**便利貼**節點會在畫布上新增豐富的 Markdown 註記。此節點不會被執行——請用於文件說明、操作指示、參考圖片或 Workflow 註記。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 0 |
| 輸出 | N/A（不會被執行） |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `stickyTitle` | string | 顯示於便利貼頂端的標題。 |
| `stickyColor` | string | 背景顏色：`yellow`、`sky`、`emerald`、`rose`、`violet` 或 `zinc`。 |
| `note` | string | Markdown 內容。在畫布上按兩下即可編輯。支援連結與圖片 Markdown，例如 `![Alt](https://example.com/image.png)`。 |

## 範例

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

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型概觀
- [Workflow 組織](../reference/workflow-organization.md) – 組織 Workflow
