# Sticky Note

Uzel **Sticky Note** přidává na canvas bohaté markdown poznámky. Není spouštěn – použijte jej pro dokumentaci, instrukce, referenční obrázky nebo poznámky k workflow.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 0 |
| Výstup | N/A (není spouštěn) |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `stickyTitle` | string | Zobrazovaný název zobrazený v horní části sticky note. |
| `stickyColor` | string | Barva pozadí: `yellow`, `sky`, `emerald`, `rose`, `violet` nebo `zinc`. |
| `note` | string | Obsah ve formátu Markdown. Dvojklikem jej upravíte přímo na canvas. Podporuje odkazy a markdown obrázků, například `![Alt](https://example.com/image.png)`. |

## Příklad

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

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Workflow Organization](../reference/workflow-organization.md) – Uspořádání workflow
