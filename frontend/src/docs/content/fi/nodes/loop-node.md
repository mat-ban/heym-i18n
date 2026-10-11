# Silmukka

**Silmukka**-solmu iteroi taulukon yli suorittaen alaspäin olevia solmuja jokaiselle alkiolle. Edellyttää takaisinkytkentää iteroinnin viimeiseltä solmulta silmukan etenemiseksi.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 2 (oletus + silmukan takaisinkytkentä) |
| Tulosteet | 2 (silmukka, valmis) |
| Tuloste | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `arrayExpression` | lauseke | Taulukoksi evaluoituva lauseke (esim. `$input.items`) |

## Kytkentäkohdat

- **Lähde `loop`** – Yhdistää iteraatiokäsittelyyn tarkoitetut solmut (suoritetaan jokaisella iteraatiokierroksella)
- **Lähde `done`** – Yhdistää silmukan päättymisen jälkeen suoritettaviin solmuihin
- **Kohde default** – Vastaanottaa alkuperäiset taulukon sisältävät tiedot
- **Kohde `loop`** – Vastaanottaa takaisinkytkennän iteraatiokäsittelyn viimeiseltä solmulta

## Silmukankonteksti (iteraatiokäsittelyssä)

- `$loopNode.item` – Nykyinen alkio
- `$loopNode.index` – 0-pohjainen indeksi
- `$loopNode.total` – Alkioiden kokonaismäärä
- `$loopNode.isFirst` – Totuusarvo (onko ensimmäinen alkio)
- `$loopNode.isLast` – Totuusarvo (onko viimeinen alkio)

## Kriittiset säännöt

1. **Takaisinkytkentä vaaditaan:** Iteraatiokäsittelyn viimeisen solmun on OLTAVA kytkettynä takaisin silmukan `loop`-syötekohtaan.
2. **Ei tulostetta iteraatiokäsittelyssä:** [Tuloste](./output-node.md)-solmujen käyttö silmukan sisällä on KIELLETTY. Käytä [Aseta](./set-node.md)- tai [Muuttuja](./variable-node.md)-solmuja väliaikaisten tulosten tallentamiseen.
3. **Ei automaattista tulosten keräämistä:** Silmukka ei kerää tuloksia automaattisesti. Käytä Muuttuja-solmuja `$array()`- ja `.add()`-metodeilla tulosten kokoamiseen.

## Esimerkki

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Suoritusjärjestys: silmukka → käsittelysolmu → (takaisin silmukkaan) → silmukka → valmis-haara → tuloste.

## Liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Muuttujasolmu](./variable-node.md) – Alkioiden kerääminen silmukassa
- [Lauseke-DSL](../reference/expression-dsl.md) – `item`, `index`, taulukkometodit
