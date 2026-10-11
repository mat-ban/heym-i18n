# Sticky Note

Il nodo **Sticky Note** aggiunge note Markdown avanzate al canvas. Non viene eseguito: utilizzarlo per documentazione, istruzioni, immagini di riferimento o note sul workflow.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 0 |
| Output | N/D (non eseguito) |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `stickyTitle` | string | Titolo visualizzato nella parte superiore della sticky note. |
| `stickyColor` | string | Colore di sfondo: `yellow`, `sky`, `emerald`, `rose`, `violet` o `zinc`. |
| `note` | string | Contenuto Markdown. Fare doppio clic per modificare sul canvas. Supporta link e Markdown per immagini come `![Alt](https://example.com/image.png)`. |

## Esempio

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

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Organizzazione dei workflow](../reference/workflow-organization.md) – Organizzare i workflow