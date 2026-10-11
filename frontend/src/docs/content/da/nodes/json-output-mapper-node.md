# JSON output mapper

**JSON output mapper**-noden konstruerer et JSON-objekt fra nøgle/værdi-[mappings](./set-node.md) (samme model som [Set](./set-node.md)). Anvend denne node, når modtageren skal have en **ren JSON-body** i roden af svaret.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 0 (sink) |
| Runtime output | Objekt bygget fra `mappings` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }`-poster (samme som Set) |

## Agent tool-brug

Ikke understøttet. Denne node er en terminal sink, så den kan ikke tilknyttes et [Agent Node](./agent-node.md)-værktøjshåndtag. Brug en [Set](./set-node.md)-node, når en agent skal forme værdier midt i en samtale.

## Webhook og kørselsadfærd

Når denne node er den **eneste** terminale output i workflowet, vil eksekverings**outputs** være det mappede objekt selv: nøgler fra `mappings` vises på **topniveau** af JSON'en. Der er **ingen** ydre wrapper med node-label som nøgle og **intet** `{ "result": ... }`-objekt (i modsætning til [Output](./output-node.md)-noden).

Hvis flere terminalnoder producerer outputs (f.eks. [Output](./output-node.md) plus JSON output mapper, eller flere grene), bruger Heym den normale struktur: hver terminal er nøglet efter sin `label`.

## Loop-begrænsning

Samme regel som [Output](./output-node.md): placer ikke denne node inden for en loop-iterationsgren - kun efter loop `done`-grenen. Se [Loop](./loop-node.md).

## Eksempel

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

## Relateret

- [Set](./set-node.md) – Samme mapping-mekanik til mellemliggende transformationer
- [Output](./output-node.md) – Besked- eller skema-baseret respons med `result`-indpakning
- [Node Types](../reference/node-types.md) – Alle nodetyper
- [Workflow Structure](../reference/workflow-structure.md) – JSON-workflow-format
- [Webhooks](../reference/webhooks.md) – Eksekverings-endpoint og svar
