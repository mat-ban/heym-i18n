# Lipnusis Užrašas

**Lipnusis Užrašas** mazgas prideda turtingus markdown užrašus prie drobės. Jis nėra vykdomas—naudokite jį dokumentacijai, instrukcijoms, nuorodų vaizdams ar workflow užrašams.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 |
| Išvestys | 0 |
| Išvestis | N/A (nevykdomas) |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `stickyTitle` | string | Rodomas pavadinimas, matomas viršuje lipniojo užrašo. |
| `stickyColor` | string | Fono spalva: `yellow`, `sky`, `emerald`, `rose`, `violet`, arba `zinc`. |
| `note` | string | Markdown turinys. Dukart spustelėkite, kad redaguotumėte drobėje. Palaiko nuorodas ir vaizdų markdown, pvz., `![Alt](https://example.com/image.png)`. |

## Pavyzdys

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Paleidimo Užrašai",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## Susiję

- [Mazgų Tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Workflow Organizavimas](../reference/workflow-organization.md) – Organizavimo workflow
