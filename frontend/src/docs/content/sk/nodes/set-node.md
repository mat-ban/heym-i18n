# Set

Uzol **Set** transformuje a mapuje vstupné údaje na vlastný výstup. Použite ho na prevod na veľké písmená, podreťazce, zreťazenie, náhodné čísla a akúkoľvek transformáciu údajov – nie na volanie workflowov (na to použite uzol [Execute](./execute-node.md)).

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.keyName` pre každý kľúč mapovania |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `mappings` | array | Páry kľúč-hodnota. Každý: `{ key, value }`, kde `value` je [výraz](../reference/expression-dsl.md) |

## Použitie ako nástroj agenta

Keď je uzol Set pripojený k [uzlu Agent](./agent-node.md) ako nástroj na plátne, každú hodnotu mapovania je možné označiť ako **poskytnutú agentom** pomocou ikony robota. Označené hodnoty mapovania sa stanú parametrami nástroja, ktoré agent vyplní počas behu. Neoznačené mapovania zostávajú pevne nastavené v konfigurácii uzla.

Ikona robota sa zobrazí iba vtedy, keď je uzol Set pripojený k handle nástrojov agenta. Samostatný uzol Set nezobrazuje ovládacie prvky pre hodnoty poskytnuté agentom.

## Pravidlá výrazov

- Odkazujte na predchádzajúce uzly: `$nodeName.text`, `$nodeName.body.field`
- Používajte funkcie: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` nezahŕňa hodnotu `b`; ak platí `a > b`, vráti chybu.
- Iba jeden znak `$` na začiatku výrazu – nikdy nie v zátvorkách
- Prístup k výstupu podľa kľúča: `$setNode.randomNumber`, `$setNode.text`

## Príklad

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

Nadväzujúce uzly pristupujú k hodnotám cez `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Súvisiace

- [JSON output mapper](./json-output-mapper-node.md) – Rovnaké mapovania; jediný koncový uzol vracia koreňový JSON pre webhooky/spustenia
- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Execute Node](./execute-node.md) – Volanie workflowov (nie transformácia údajov)
- [Expression DSL](../reference/expression-dsl.md) – Funkcie a syntax
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Rozbaliteľný editor s živým náhľadom backendu a tlačidlami Prev/Next pre mapovania
