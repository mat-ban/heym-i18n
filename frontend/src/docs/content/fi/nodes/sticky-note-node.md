# Muistilappu

**Muistilappu**-solmu lisää rikastetun Markdown-muotoisen tekstin canvas-alueelle. Sitä ei suoriteta – sitä voidaan käyttää dokumentointiin, ohjeisiin, viitekuviin tai workflow-muistiinpanoihin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|-----------|------|
| Syötteet | 0 |
| Tulosteet | 0 |
| Tuloste | Ei sovellu (ei suoriteta) |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|--------|--------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `stickyTitle` | merkkijono | Näkyvä otsikko, joka näytetään muistilapun yläosassa. |
| `stickyColor` | merkkijono | Taustaväri: `yellow`, `sky`, `emerald`, `rose`, `violet` tai `zinc`. |
| `note` | merkkijono | Markdown-sisältö. Kaksoisnapsauta muokkaaksesi sisältöä canvas-alueella. Tukee linkkejä ja kuvia Markdown-syntaksilla, kuten `![Alt](https://example.com/image.png)`. |

## Esimerkki

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Käynnistysmuistiinpanot",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Workflowjen organisointi](../reference/workflow-organization.md) – Workflowjen järjestely
