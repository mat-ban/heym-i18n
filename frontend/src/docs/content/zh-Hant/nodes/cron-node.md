# Cron

**Cron** 節點使用 cron 表達式依排程觸發 Workflow。無需使用者輸入——Workflow 會在指定時間自動執行。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 1 |
| 輸出 | Trigger 事件（無 Payload） |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `cronExpression` | string | Cron 表達式（例如 `0 * * * *` 代表每小時） |

## Cron 表達式格式

標準 5 欄位 cron：`minute hour day-of-month month day-of-week`

| 欄位 | 值 | 範例 |
|-------|--------|---------|
| 分鐘 | 0–59 | `0` = 第 0 分鐘 |
| 小時 | 0–23 | `*` = 每小時 |
| 每月第幾天 | 1–31 | `*` = 每天 |
| 月份 | 1–12 | `*` = 每個月 |
| 每週第幾天 | 0–7（0 與 7 = 星期日） | `*` = 每天 |

**常見範例：**

- `0 * * * *` – 每小時
- `0 0 * * *` – 每天午夜
- `*/15 * * * *` – 每 15 分鐘
- `0 9 * * 1-5` – 平日 9:00

## 範例

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型概觀
- [Trigger](../reference/triggers.md) – Cron、Input、RabbitMQ
- [Disable 節點](./disable-node.md) – 在條件成立後停止 cron Trigger
- [Enable 節點](./enable-node.md) – 再次啟動已停用的 cron Trigger
