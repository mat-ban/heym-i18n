# JSON-utdatamappare

Noden **JSON-utdatamappare** bygger ett JSON-objekt från nyckel/värde-[mappningar](./set-node.md) (samma modell som [Set](./set-node.md)). Den används när anropare ska ta emot en **ren JSON-body** i roten av svaret.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 0 (sink) |
| Körtidsutdata | Objekt som byggs från `mappings` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `mappings` | array | Poster av typen `{ "key": "fieldName", "value": "expression" }` (samma som Set) |

## Användning som agentverktyg

Stöds inte. Denna nod är en terminal sink och kan därför inte kopplas till ett verktygshandtag för en [Agent-nod](./agent-node.md). Använd en [Set](./set-node.md)-nod när en agent behöver forma värden under en pågående konversation.

## Webhook- och körningsbeteende

När denna nod är den **enda** terminala utdatan i workflowet utgörs körningens **utdata** av det mappade objektet självt: nycklar från `mappings` visas på **toppnivå** i JSON:en. Det finns **ingen** yttre omslutning med nodens label som nyckel och **inget** `{ "result": ... }`-objekt (till skillnad från [Output](./output-node.md)-noden).

Om flera terminala noder producerar utdata (till exempel [Output](./output-node.md) plus JSON-utdatamappare, eller flera grenar) använder Heym den normala formen: varje terminal får sin `label` som nyckel.

## Loop-begränsning

Samma regel som för [Output](./output-node.md): placera inte denna nod inuti en loop-iterationsgren – endast efter loopens `done`-gren. Se [Loop](./loop-node.md).

## Exempel

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Relaterat

- [Set](./set-node.md) – Samma mappningsmekanik för mellanliggande transformeringar
- [Output](./output-node.md) – Meddelande- eller schemabaserat svar med `result`-omslutning
- [Nodtyper](../reference/node-types.md) – Alla nodtyper
- [Workflow-struktur](../reference/workflow-structure.md) – JSON-format för workflow
- [Webhooks](../reference/webhooks.md) – Execute-endpoint och svar
