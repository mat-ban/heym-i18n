# Set

De **Set**-node transformeert en mapt invoergegevens naar aangepaste uitvoer. Gebruik deze voor hoofdletters, substrings, samenvoeging, willekeurige getallen en elke vorm van gegevenstransformatie—niet voor het aanroepen van workflows (gebruik hiervoor [Execute](./execute-node.md)).

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.keyName` voor elke mapping-sleutel |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `mappings` | array | Sleutel-waardeparen. Elk: `{ key, value }` waarbij `value` een [expressie](../reference/expression-dsl.md) is |

## Gebruik als agent-tool

Wanneer een Set-node is verbonden met een [Agent Node](./agent-node.md) als canvas-node-tool, kan elke mapping-waarde worden gemarkeerd als **agent-provided** met het bot-pictogram. Gemarkeerde mapping-waarden worden tool-parameters die de agent tijdens runtime invult. Niet-gemarkeerde mappings blijven vast in de node-configuratie.

Het bot-pictogram verschijnt alleen wanneer de Set-node is verbonden met de tools-handle van een agent. Een zelfstandige Set-node toont geen agent-provided-besturingselementen.

## Expressieregels

- Verwijs naar eerdere nodes: `$nodeName.text`, `$nodeName.body.field`
- Gebruik functies: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` sluit b uit; geeft een fout bij `a > b`.
- Slechts één `$` aan het begin van de expressie—nooit binnen haakjes
- Toegang tot uitvoer via sleutel: `$setNode.randomNumber`, `$setNode.text`

## Voorbeeld

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

Stroomafwaartse nodes krijgen toegang via `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Gerelateerd

- [JSON output mapper](./json-output-mapper-node.md) – Dezelfde mappings; enige terminale node die root-JSON retourneert voor webhooks/runs
- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Execute Node](./execute-node.md) – Workflows aanroepen (geen gegevenstransformatie)
- [Expression DSL](../reference/expression-dsl.md) – Functies en syntaxis
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Uitbreidbare editor met live backend-preview en Prev/Next voor mappings
