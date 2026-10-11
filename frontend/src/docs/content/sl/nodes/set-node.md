# Set

**Set** vozlišče transformira in preslika vhodne podatke v prilagojene izhode. Uporabite ga za velike črke, podniz, konkatenacijo, naključna števila in katero koli transformacijo podatkov—ne za klicanje workflows (za to uporabite [Execute](./execute-node.md)).

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.keyName` za vsak preslikovalni ključ |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `mappings` | tabela | Ključ-vrednost pari. Vsak: `{ key, value }`, kjer je `value` [izraz](../reference/expression-dsl.md) |

## Uporaba orodja agenta

Ko je Set vozlišče povezano z [Agent Node](./agent-node.md) kot orodje na platnu, lahko vsako vrednost preslikave označite kot **zagotovljeno s strani agenta** z ikono bota. Oznake preslikav postanejo parametri orodja, ki jih agent izpolni med izvajanjem. Neoznačene preslikave ostanejo fiksne v konfiguraciji vozlišča.

Ikona bota se prikaže le, ko je Set vozlišče povezano z ročajem orodij agenta. Samostojno Set vozlišče ne prikazuje kontrolnikov, ki jih zagotavlja agent.

## Pravila za izraze

- Sklicevanje na prejšnja vozlišča: `$nodeName.text`, `$nodeName.body.field`
- Uporaba funkcij: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` izključuje b; v primeru `a > b` vrne napako.
- Le en `$` na začetku izraza—nikoli znotraj oklepajev
- Dostop do izhoda po ključu: `$setNode.randomNumber`, `$setNode.text`

## Primer

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

Spodnja vozlišča dostopajo preko `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Sorodno

- [JSON output mapper](./json-output-mapper-node.md) – Enake preslikave; edini terminal vrne korenski JSON za webhooke/izvedbe
- [Node Types](../reference/node-types.md) – Pregled vseh tipov vozlišč
- [Execute Node](./execute-node.md) – Klicanje workflows (ne transformacija podatkov)
- [Expression DSL](../reference/expression-dsl.md) – Funkcije in sintaksa
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Razširljiv urejevalnik z vnaprejšnjim ogledom v ozadju in Prejšnji/Naslednji za preslikave
