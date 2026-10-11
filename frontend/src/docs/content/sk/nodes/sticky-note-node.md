# Sticky Note

Uzol **Sticky Note** pridáva na plátno bohaté markdown poznámky. Nevykonáva sa – použite ho na dokumentáciu, pokyny, referenčné obrázky alebo poznámky k workflowu.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 0 |
| Výstup | N/A (nevykonáva sa) |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `stickyTitle` | string | Zobrazovaný názov zobrazený v hornej časti sticky note. |
| `stickyColor` | string | Farba pozadia: `yellow`, `sky`, `emerald`, `rose`, `violet` alebo `zinc`. |
| `note` | string | Obsah v Markdownu. Dvojkliknutím upravíte priamo na plátne. Podporuje odkazy a markdown obrázkov, napríklad `![Alt](https://example.com/image.png)`. |

## Príklad

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

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Workflow Organization](../reference/workflow-organization.md) – Organizácia workflowov
