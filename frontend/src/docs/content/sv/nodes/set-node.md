# Set

Noden **Set** transformerar och mappar indata till anpassad utdata. Den används för versaler, delsträngar, sammanslagning, slumptal och alla typer av datatransformering – inte för att anropa Workflows (använd [Execute](./execute-node.md) för det).

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.keyName` för varje mappningsnyckel |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `mappings` | array | Nyckel-värdepar. Varje: `{ key, value }` där `value` är ett [uttryck](../reference/expression-dsl.md) |

## Användning som agentverktyg

När en Set-nod är ansluten till en [Agent-nod](./agent-node.md) som ett canvas-nodverktyg kan varje mappningsvärde markeras som **agent-tillhandahållet** med botikonen. Markerade mappningsvärden blir verktygsparametrar som agenten fyller i vid körning. Omarkerade mappningar förblir fasta i nodkonfigurationen.

Botikonen visas endast när Set-noden är ansluten till en agents verktygshandtag. En fristående Set-nod visar inte agent-tillhandahållna kontroller.

## Uttrycksregler

- Referera till tidigare noder: `$nodeName.text`, `$nodeName.body.field`
- Använd funktioner: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` exkluderar b; ger ett fel om `a > b`.
- Endast ett `$` i början av uttrycket – aldrig inuti parenteser
- Åtkomst till utdata via nyckel: `$setNode.randomNumber`, `$setNode.text`

## Exempel

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

Nedströms noder kommer åt via `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Relaterat

- [JSON output mapper](./json-output-mapper-node.md) – Samma mappningar; enskild terminal returnerar rot-JSON för Webhooks/Körningar
- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Execute-nod](./execute-node.md) – Anropa Workflows (inte datatransformering)
- [Expression DSL](../reference/expression-dsl.md) – Funktioner och syntax
- [Dialog för uttrycksutvärdering](../reference/expression-evaluation-dialog.md) – Expanderbar redigerare med live-förhandsvisning från backend och Föregående/Nästa för mappningar
