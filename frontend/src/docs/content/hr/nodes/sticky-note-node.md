# Sticky Note

Čvor **Sticky Note** dodaje obogaćene markdown bilješke na platno. Ne izvršava se—koristite ga za dokumentaciju, upute, referentne slike ili bilješke o workflowu.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 0 |
| Izlazi | 0 |
| Izlaz | N/A (ne izvršava se) |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `stickyTitle` | string | Naslov koji se prikazuje na vrhu sticky bilješke. |
| `stickyColor` | string | Boja pozadine: `yellow`, `sky`, `emerald`, `rose`, `violet` ili `zinc`. |
| `note` | string | Markdown sadržaj. Dvoklikom uredite na platnu. Podržava poveznice i markdown za slike poput `![Alt](https://example.com/image.png)`. |

## Primjer

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

## Povezano

- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Workflow Organization](../reference/workflow-organization.md) – Organizirajte workflowe
