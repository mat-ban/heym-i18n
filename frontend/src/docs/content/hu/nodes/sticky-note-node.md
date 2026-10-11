# Ragadós jegyzet

A **Ragadós jegyzet** csomópont gazdag markdown jegyzeteket ad a vászonhoz. Nem kerül végrehajtásra—használja dokumentációhoz, utasításokhoz, referencia-képekhez vagy workflow-jegyzetekhez.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 0 |
| Kimenet | N/A (nem kerül végrehajtásra) |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `stickyTitle` | string | A ragadós jegyzet tetején megjelenő cím. |
| `stickyColor` | string | Háttérszín: `yellow`, `sky`, `emerald`, `rose`, `violet` vagy `zinc`. |
| `note` | string | Markdown tartalom. Kattintson duplán a vásznon való szerkesztéshez. Támogatja a linkeket és a kép-markdownt, például `![Alt](https://example.com/image.png)`. |

## Példa

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

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Workflow-szervezés](../reference/workflow-organization.md) – Workflow-k rendszerezése
