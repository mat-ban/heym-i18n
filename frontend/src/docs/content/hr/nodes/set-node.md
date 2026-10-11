# Set

Čvor **Set** transformira i mapira ulazne podatke u prilagođeni izlaz. Koristite ga za velika slova, podnizove, konkatenaciju, slučajne brojeve i bilo koju transformaciju podataka—ne za pozivanje workflowa (za to koristite [Execute](./execute-node.md)).

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.keyName` za svaki ključ mapiranja |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `mappings` | array | Parovi ključ-vrijednost. Svaki: `{ key, value }` gdje je `value` [izraz](../reference/expression-dsl.md) |

## Korištenje agent alata

Kada je Set čvor povezan s [Agent čvorom](./agent-node.md) kao alat na platnu, svaka vrijednost mapiranja može se označiti kao **agent-provided** pomoću ikone bota. Označene vrijednosti mapiranja postaju parametri alata koje agent popunjava tijekom izvršavanja. Neoznačena mapiranja ostaju fiksna u konfiguraciji čvora.

Ikona bota pojavljuje se samo kada je Set čvor povezan s agentovom ručkom alata. Samostalni Set čvor ne prikazuje kontrole agent-provided.

## Pravila izraza

- Referencirajte prethodne čvorove: `$nodeName.text`, `$nodeName.body.field`
- Koristite funkcije: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` isključuje b; ako je `a > b`, vraća grešku.
- Samo jedan `$` na početku izraza—nikada unutar zagrada
- Pristupite izlazu po ključu: `$setNode.randomNumber`, `$setNode.text`

## Primjer

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

Nizvodni čvorovi pristupaju putem `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Povezano

- [JSON output mapper](./json-output-mapper-node.md) – Ista mapiranja; jedini terminal vraća korijenski JSON za webhookove/izvršavanja
- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Execute Node](./execute-node.md) – Pozivanje workflowa (ne transformacija podataka)
- [Expression DSL](../reference/expression-dsl.md) – Funkcije i sintaksa
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Proširivi editor s pregledom uživo na backendu i Prev/Next za mapiranja
