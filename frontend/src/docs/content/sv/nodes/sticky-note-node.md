# Sticky Note

Noden **Sticky Note** lägger till formaterade markdown-anteckningar på canvas. Den körs inte – använd den för dokumentation, instruktioner, referensbilder eller workflow-anteckningar.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Inmatningar | 0 |
| Utmatningar | 0 |
| Utdata | N/A (körs inte) |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `stickyTitle` | string | Visningstitel som visas högst upp i sticky note. |
| `stickyColor` | string | Bakgrundsfärg: `yellow`, `sky`, `emerald`, `rose`, `violet` eller `zinc`. |
| `note` | string | Markdown-innehåll. Dubbelklicka för att redigera på canvas. Stöder länkar och bildmarkdown som `![Alt](https://example.com/image.png)`. |

## Exempel

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

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Workflow-organisering](../reference/workflow-organization.md) – Organisera workflows
