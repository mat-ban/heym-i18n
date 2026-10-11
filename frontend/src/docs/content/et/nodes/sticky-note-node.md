# Kleepuv märkus

**Kleepuva märkuse** sõlm lisab lõuendile rikkalikke markdown-märkmeid. Seda ei käivitata – kasutage seda dokumentatsiooni, juhiste, viitepiltide või workflow' märkmete jaoks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 0 |
| Väljund | N/A (ei käivitata) |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `stickyTitle` | string | Kuvatav pealkiri, mis kuvatakse kleepuva märkuse ülaosas. |
| `stickyColor` | string | Taustavärv: `yellow`, `sky`, `emerald`, `rose`, `violet` või `zinc`. |
| `note` | string | Markdown-sisu. Redigeerimiseks lõuendil tehke topeltklõps. Toetab linke ja pildi markdown-süntaksit nagu `![Alt](https://example.com/image.png)`. |

## Näide

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

## Seotud

- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Workflow' korraldamine](../reference/workflow-organization.md) – Workflow'de korraldamine
