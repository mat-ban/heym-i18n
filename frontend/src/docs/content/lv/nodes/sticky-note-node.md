# Sticky Note

**Sticky Note** mezgls pievieno kanvai bagātīgas markdown piezīmes. Tas netiek izpildīts—izmantojiet to dokumentācijai, instrukcijām, atsauces attēliem vai workflow piezīmēm.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 0 |
| Izvade | N/A (netiek izpildīts) |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezglu identifikators (camelCase) |
| `stickyTitle` | string | Parādāmais virsraksts, kas redzams sticky note augšdaļā. |
| `stickyColor` | string | Fona krāsa: `yellow`, `sky`, `emerald`, `rose`, `violet` vai `zinc`. |
| `note` | string | Markdown saturs. Veiciet dubultklikšķi, lai rediģētu kanvā. Atbalsta saites un attēlu markdown, piemēram, `![Alt](https://example.com/image.png)`. |

## Piemērs

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

## Saistītie

- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Workflow Organization](../reference/workflow-organization.md) – Workflow organizēšana
