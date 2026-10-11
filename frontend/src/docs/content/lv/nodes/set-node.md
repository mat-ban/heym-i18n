# Set

**Set** mezgls pārveido un kartē ievades datus uz pielāgotu izvadi. Izmantojiet to lielo burtu maiņai, apakšvirknes izgūšanai, savienošanai, nejaušu skaitļu ģenerēšanai un jebkurai datu transformācijai—nevis workflow izsaukšanai (šim nolūkam izmantojiet [Execute](./execute-node.md)).

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.keyName` katram kartēšanas atslēgai |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezglu identifikators (camelCase) |
| `mappings` | array | Atslēgu-vērtību pāri. Katrs: `{ key, value }`, kur `value` ir [izteiksme](../reference/expression-dsl.md) |

## Aģenta rīka izmantošana

Kad Set mezgls ir savienots ar [Agent Node](./agent-node.md) kā kanvas mezgla rīks, katra kartēšanas vērtība var tikt atzīmēta kā **aģenta nodrošināta** ar bota ikonu. Atzīmētās kartēšanas vērtības kļūst par rīka parametriem, ko aģents aizpilda izpildes laikā. Neatzīmētās kartēšanas paliek fiksētas mezgla konfigurācijā.

Bota ikona parādās tikai tad, kad Set mezgls ir savienots ar aģenta rīku rokturi. Atsevišķs Set mezgls nerāda aģenta nodrošinātās vadīklas.

## Izteiksmju noteikumi

- Atsaucieties uz iepriekšējiem mezgliem: `$nodeName.text`, `$nodeName.body.field`
- Izmantojiet funkcijas: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` neietver b; ja `a > b`, tiek parādīta kļūda.
- Tikai viens `$` izteiksmes sākumā—nekad iekavās
- Piekļūstiet izvadei pēc atslēgas: `$setNode.randomNumber`, `$setNode.text`

## Piemērs

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

Lejupstraumes mezgli piekļūst, izmantojot `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Saistītie

- [JSON output mapper](./json-output-mapper-node.md) – Tādas pašas kartēšanas; vienīgais terminālis atgriež saknes JSON webhook/runs
- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Execute Node](./execute-node.md) – Izsaukt workflow (nevis datu transformācija)
- [Expression DSL](../reference/expression-dsl.md) – Funkcijas un sintakse
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Paplašināms redaktors ar tiešu backend priekšskatījumu un Prev/Next kartēšanām
