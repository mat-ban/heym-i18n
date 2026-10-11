# Set-solmu

**Set**-solmu muuntaa ja yhdistää syötetietoja mukautetuksi tulosteeksi. Käytä sitä isoiksi kirjaimiksi muuntamiseen, osamerkkijonoihin, liittämiseen, satunnaislukuihin ja mihin tahansa datan muokkaukseen – ei workflowien kutsumiseen (käytä tähän [Execute](./execute-node.md)-solmua).

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.keyName` jokaiselle yhdistämisavaimelle |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `mappings` | taulukko | Avain-arvo -parit. Jokainen: `{ key, value }`, jossa `value` on [lauseke](../reference/expression-dsl.md) |

## Agenttityökalun käyttö

Kun Set-solmu on kytkettynä [Agent Node](./agent-node.md)-solmuun canvas-työkaluna, jokainen yhdistämisarvo voidaan merkitä **agentin toimittamaksi** bottikuvakkeella. Merkityt arvot muuttuvat työkalun parametreiksi, jotka agentti täyttää suoritusaikana. Merkitsemättömät arvot pysyvät solmun asetuksissa ennallaan.

Bottikuvake näkyy vain, kun Set-solmu on kytketty agentin työkalujen kahvaan. Itsenäinen Set-solmu ei näytä agentin toimittamia ohjauksia.

## Lausekesäännöt

- Viittaa edellisiin solmuihin: `$nodeName.text`, `$nodeName.body.field`
- Käytä funktioita: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` ei sisällä arvoa b; virhe, jos `a > b`
- Vain yksi `$` lausekkeen alussa – ei koskaan sulkeiden sisällä
- Pääsy tulosteisiin avaimen perusteella: `$setNode.randomNumber`, `$setNode.text`

## Esimerkki

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Alasvirtana olevat solmut käyttävät tuloksia muodossa `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Liittyvät

- [JSON output mapper](./json-output-mapper-node.md) – Samat yhdistämiset; palauttaa pääasiallisen JSONin webhookeille/suorituksille
- [Node Types](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Execute Node](./execute-node.md) – Workflowien kutsuminen (ei datan muunnos)
- [Expression DSL](../reference/expression-dsl.md) – Funktiot ja syntaksi
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Laajennettava editori reaaliaikaisella esikatselulla ja Edellinen/Seuraava -toiminnoilla yhdistämisille
