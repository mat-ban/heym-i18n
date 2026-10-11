# Set

Uzel **Set** transformuje a mapuje vstupní data na vlastní výstup. Použijte jej pro převod na velká písmena, podřetězce, zřetězení, náhodná čísla a jakoukoli transformaci dat – nikoli pro volání workflow (k tomu použijte [Execute](./execute-node.md)).

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.keyName` pro každý klíč mapování |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `mappings` | array | Páry klíč–hodnota. Každý: `{ key, value }`, kde `value` je [výraz](../reference/expression-dsl.md) |

## Použití jako nástroj agenta

Když je uzel Set připojen k [uzlu Agent](./agent-node.md) jako nástroj na canvasu, každou hodnotu mapování lze označit jako **poskytovanou agentem** pomocí ikony robota. Označené hodnoty mapování se stanou parametry nástroje, které agent vyplní za běhu. Neoznačená mapování zůstávají pevně daná v konfiguraci uzlu.

Ikona robota se zobrazí pouze tehdy, když je uzel Set připojen k handle nástrojů agenta. Samostatný uzel Set nezobrazuje ovládací prvky pro hodnoty poskytované agentem.

## Pravidla výrazů

- Odkazujte na předchozí uzly: `$nodeName.text`, `$nodeName.body.field`
- Používejte funkce: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` vylučuje hodnotu `b`; pokud platí `a > b`, vyvolá chybu.
- Na začátku výrazu je pouze jedno `$` – nikdy uvnitř závorek
- K výstupu přistupujte pomocí klíče: `$setNode.randomNumber`, `$setNode.text`

## Příklad

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

Následné uzly přistupují pomocí `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Související

- [JSON output mapper](./json-output-mapper-node.md) – Stejná mapování; jediný koncový uzel vrací kořenový JSON pro webhooky/spuštění
- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Execute Node](./execute-node.md) – Volání workflow (nikoli transformace dat)
- [Expression DSL](../reference/expression-dsl.md) – Funkce a syntaxe
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Rozšiřitelný editor s živým náhledem backendu a tlačítky Prev/Next pro mapování
