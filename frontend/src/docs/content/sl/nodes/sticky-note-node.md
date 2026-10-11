# Lepljiva Opomba

**Lepljiva Opomba** vozlišče dodaja bogate markdown opombe na platno. Ne izvaja se—uporabite jo za dokumentacijo, navodila, referenčne slike ali opombe o workflow.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 0 |
| Izhodi | 0 |
| Izhod | N/A (ne izvaja se) |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `stickyTitle` | niz | Prikazano ime, ki se prikaže na vrhu lepljive opombe. |
| `stickyColor` | niz | Barva ozadja: `yellow`, `sky`, `emerald`, `rose`, `violet` ali `zinc`. |
| `note` | niz | Vsebina v markdown formatu. Dvakrat kliknite za urejanje na platnu. Podpira povezave in markdown za slike, kot je `![Alt](https://example.com/image.png)`. |

## Primer

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Opombe ob zagonu",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## Sorodno

- [Vrste Vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Organizacija Workflow](../reference/workflow-organization.md) – Organizirajte workflows
