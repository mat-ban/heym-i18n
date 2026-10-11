# Sticky Note

De **Sticky Note**-node voegt uitgebreide markdown-notities toe aan het canvas. Deze wordt niet uitgevoerd—gebruik deze voor documentatie, instructies, referentieafbeeldingen of workflow-notities.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 0 |
| Uitvoer | N.v.t. (wordt niet uitgevoerd) |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `stickyTitle` | string | Weergavetitel bovenaan de sticky note. |
| `stickyColor` | string | Achtergrondkleur: `yellow`, `sky`, `emerald`, `rose`, `violet` of `zinc`. |
| `note` | string | Markdown-inhoud. Dubbelklik om te bewerken op het canvas. Ondersteunt links en afbeeldingsmarkdown zoals `![Alt](https://example.com/image.png)`. |

## Voorbeeld

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

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Workflow Organization](../reference/workflow-organization.md) – Workflows organiseren
