# Sticky Note

**Sticky Note** node добавя богати markdown бележки към canvas. Той не се изпълнява — използвайте го за документация, инструкции, референтни изображения или бележки към workflow.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 |
| Изходи | 0 |
| Изход | N/A (не се изпълнява) |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `stickyTitle` | string | Заглавие, показвано в горната част на sticky note. |
| `stickyColor` | string | Цвят на фона: `yellow`, `sky`, `emerald`, `rose`, `violet` или `zinc`. |
| `note` | string | Markdown съдържание. Двойно щракване за редактиране върху canvas. Поддържа връзки и markdown за изображения като `![Alt](https://example.com/image.png)`. |

## Пример

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

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове node
- [Workflow Organization](../reference/workflow-organization.md) – Организиране на workflow
