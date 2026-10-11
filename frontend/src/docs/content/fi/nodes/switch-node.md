# Switch

**Switch**-solmu ohjaa suorituksen eri poluille arvon ja vaihtoehtojen perusteella. Tukee N määrää vaihtoehtoja sekä oletuspolkua.

## Yleiskatsaus

| Ominaisuus | Arvo |
|------------|------|
| Syötteet | 1 |
| Tulosteet | n (yksi per vaihtoehto + oletus) |
| Tuloste | Lähettää syötteen vastaavalle haaralle |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|--------|--------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `expression` | lauseke | Arvo, jota arvioidaan (esim. `$input.category`) |
| `cases` | merkkijono[] | Vaihtoehtoarvot, joita verrataan (esim. `["case1", "case2", "case3"]`) |

## Reunakäsittely

- Jokaiselle vaihtoehdolle on lähdekahva (indeksi 0, 1, 2, …)
- Oletuskahva arvoille, jotka eivät vastaa mitään vaihtoehtoa

## Esimerkki

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Yhdistä reunat asettamalla `sourceHandle` vastaamaan vaihtoehdon indeksiä (0, 1, 2) tai käytä oletuskahvaa vastaamattomille arvoille.

## Liittyvät aiheet

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Ehtosolmu](./condition-node.md) – If/else-haarautuminen
- [Expression DSL](../reference/expression-dsl.md) – Lausekkeiden syntaksi
