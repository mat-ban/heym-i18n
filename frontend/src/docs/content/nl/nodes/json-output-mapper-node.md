# JSON output mapper

De **JSON output mapper**-node bouwt een JSON-object op basis van key/value-[mappings](./set-node.md) (hetzelfde model als [Set](./set-node.md)). Gebruik deze wanneer aanroepers een **plain JSON body** aan de root van de response moeten ontvangen.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 0 (sink) |
| Runtime-uitvoer | Object opgebouwd uit `mappings` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identifier (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }`-items (hetzelfde als Set) |

## Gebruik als Agent-tool

Niet ondersteund. Deze node is een terminale sink en kan daarom niet worden gekoppeld aan een tools-handle van een [Agent Node](./agent-node.md). Gebruik een [Set](./set-node.md)-node wanneer een agent waarden midden in een gesprek moet vormgeven.

## Webhook- en uitvoeringsgedrag

Wanneer deze node de **enige** terminale uitvoer van de workflow is, bestaat de uitvoer van de **uitvoeringen** uit het gemapte object zelf: keys uit `mappings` verschijnen op het **top level** van de JSON. Er is **geen** buitenste wrapper met de node-label als key en **geen** `{ "result": ... }`-object (in tegenstelling tot de [Output](./output-node.md)-node).

Als meerdere terminale nodes uitvoer produceren (bijvoorbeeld [Output](./output-node.md) plus JSON output mapper, of meerdere branches), gebruikt Heym de normale vorm: elke terminal krijgt zijn `label` als key.

## Loop-beperking

Dezelfde regel als bij [Output](./output-node.md): plaats deze node niet in een loop-iteratiebranch—alleen na de `done`-branch van de loop. Zie [Loop](./loop-node.md).

## Voorbeeld

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

## Gerelateerd

- [Set](./set-node.md) – Dezelfde mapping-mechanica voor tussentijdse transforms
- [Output](./output-node.md) – Bericht- of schema-gebaseerde response met `result`-wrapping
- [Node Types](../reference/node-types.md) – Alle node-typen
- [Workflow Structure](../reference/workflow-structure.md) – JSON-workflowformaat
- [Webhooks](../reference/webhooks.md) – Execute-endpoint en responses
