# Sticky Note

Вузол **Sticky Note** додає насичені markdown-нотатки на canvas. Він не виконується — використовуйте його для документації, інструкцій, довідкових зображень або нотаток до Workflow.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 0 |
| Виходи | 0 |
| Вихід | Н/Д (не виконується) |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `label` | string | Ідентифікатор вузла (camelCase) |
| `stickyTitle` | string | Заголовок, що відображається вгорі sticky note. |
| `stickyColor` | string | Колір фону: `yellow`, `sky`, `emerald`, `rose`, `violet` або `zinc`. |
| `note` | string | Вміст у форматі Markdown. Двічі клацніть, щоб редагувати на canvas. Підтримує посилання та markdown-зображення, як-от `![Alt](https://example.com/image.png)`. |

## Приклад

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

## Пов'язане

- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
- [Workflow Organization](../reference/workflow-organization.md) – Організація Workflow
