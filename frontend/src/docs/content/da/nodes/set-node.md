# Set

**Set**-noden transformerer og mapper inputdata til brugerdefineret output. Den kan anvendes til store bogstaver, delstrenge, sammenkædning, tilfældige tal og enhver datatransformation - men ikke til at kalde workflows (brug [Execute](./execute-node.md) til dette formål).

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.keyName` for hver mappingnøgle |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `mappings` | array | Nøgle-værdi-par. Hvert: `{ key, value }` hvor `value` er et [udtryk](../reference/expression-dsl.md) |

## Agentværktøjsbrug

Når en Set-node er forbundet til en [Agent Node](./agent-node.md) som et canvas-nodeværktøj, kan hver mappingværdi markeres som **agent-leveret** med bot-ikonet. Markerede mappingværdier bliver til værktøjsparametre, som agenten udfylder under kørsel. Umarkerede mappingværdier forbliver faste i nodekonfigurationen.

Bot-ikonet vises kun, når Set-noden er forbundet til en agents værktøjshåndtag. En fritstående Set-node viser ikke agent-leverede kontroller.

## Udtryksregler

- Referer til tidligere noder: `$nodeName.text`, `$nodeName.body.field`
- Brug funktioner: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` ekskluderer b; returnerer fejl hvis `a > b`
- Kun ét `$` i starten af udtrykket - aldrig inden i parenteser
- Adgang til output via nøgle: `$setNode.randomNumber`, `$setNode.text`

## Eksempel

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

Efterfølgende noder får adgang via `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Relateret

- [JSON output mapper](./json-output-mapper-node.md) – Samme mapping; eneste terminal returnerer root JSON til webhooks/kørsler
- [Node Types](../reference/node-types.md) – Oversigt over alle nodetyper
- [Execute Node](./execute-node.md) – Kalder workflows (ikke datatransformation)
- [Expression DSL](../reference/expression-dsl.md) – Funktioner og syntaks
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Udvidelig editor med live backend-preview og Prev/Next til mapping
