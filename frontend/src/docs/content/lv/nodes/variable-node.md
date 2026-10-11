# Mainīgais

**Mainīgā** mezgls iestata vai atjaunina mainīgo, kas ir pieejams no jebkura mezgla, izmantojot `$vars.variableName` (workflow-lokāls) vai `$global.variableName` (pastāvīgs). Izmantojiet to skaitītājiem, uzkrātajiem sarakstiem un koplietotajam stāvoklim visā workflow.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.value` vai piekļuve, izmantojot `$vars.variableName` / `$global.variableName` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `variableName` | string | Mainīgā nosaukums (tiek izmantots kā `$vars.variableName` vai `$global.variableName`). Izvairieties no [rezervētajiem nosaukumiem](../reference/expression-dsl.md). |
| `variableValue` | expression | Iestatāmā vērtība. Atbalsta izteiksmes. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Tipa konvertēšana (noklusējums: auto) |
| `isGlobal` | boolean | Ja `true`, saglabā [Globālo mainīgo krātuvē](../reference/global-variables.md) (pastāvīgs, lietotāja tvērumā). Ja `false` vai nav norādīts, workflow-lokāls (atmiņā). |

## Masīvu mainīgie

Inicializējiet masīvus ar `$array()` vai `$array("a", "b")` Mainīgā mezglā pirms `.add()` izmantošanas:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Pēc tam pievienojiet vienumus (iekavās nav `$`):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritisks noteikums

**Nekad neizmantojiet `$` metodes iekavās:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – sabojā izteiksmi

## Piemērs – Skaitītājs

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## Saistītais

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Cilpas mezgls](./loop-node.md) – Vienumu vākšana ar Mainīgo cilpas pamattekstā
- [Izteiksmes DSL](../reference/expression-dsl.md) – `$vars`, `$global`, rezervētie nosaukumi
- [Globālie mainīgie](../reference/global-variables.md) – Pastāvīgie mainīgie ar `isGlobal`
