# Sticky Note

**Sticky Note**-noden tilføjer formaterede markdown-noter til canvas. Noden udføres ikke – den kan anvendes til dokumentation, instruktioner, referencebilleder eller workflow-noter.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 0 |
| Output | N/A (udføres ikke) |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `stickyTitle` | string | Titel, der vises øverst på sticky note'en. |
| `stickyColor` | string | Baggrundsfarve: `yellow`, `sky`, `emerald`, `rose`, `violet` eller `zinc`. |
| `note` | string | Markdown-indhold. Dobbeltklik for at redigere på canvas. Understøtter links og billedmarkdown som f.eks. `![Alt](https://example.com/image.png)`. |

## Eksempel

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

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Workflow-organisation](../reference/workflow-organization.md) – Organisering af workflows
