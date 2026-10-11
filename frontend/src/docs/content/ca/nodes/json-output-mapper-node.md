# Assignador de sortida JSON

El node **Assignador de sortida JSON** construeix un objecte JSON a partir d'[assignacions](./set-node.md) clau/valor (el mateix model que [Set](./set-node.md)). Utilitzeu-lo quan els sol·licitants hagin de rebre un **cos JSON pla** a l'arrel de la resposta.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 0 (terminal) |
| Sortida en temps d'execució | Objecte construït a partir de `mappings` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `mappings` | array | Entrades `{ "key": "fieldName", "value": "expression" }` (igual que a Set) |

## Ús com a eina d'agent

No compatible. Aquest node és un terminal de sortida, de manera que no es pot adjuntar a una handle d'eines d'un [Node Agent](./agent-node.md). Utilitzeu un node [Set](./set-node.md) quan un agent necessiti donar forma a valors durant la conversa.

## Comportament amb Webhook i execucions

Quan aquest node és l'**únic** terminal de sortida del workflow, les **sortides** de l'execució són el propi objecte assignat: les claus de `mappings` apareixen al **nivell superior** del JSON. **No** hi ha cap clau embolcalladora externa indexada per l'etiqueta del node ni cap objecte `{ "result": ... }` (a diferència del node [Output](./output-node.md)).

Si diversos nodes terminals produeixen sortides (per exemple, [Output](./output-node.md) més l'assignador de sortida JSON, o diverses branques), Heym utilitza la forma habitual: cada terminal s'indexa per la seva `label`.

## Restricció de bucles

Mateixa regla que a [Output](./output-node.md): no col·loqueu aquest node dins d'una branca d'iteració d'un bucle—només després de la branca `done` del bucle. Vegeu [Loop](./loop-node.md).

## Exemple

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

## Relacionats

- [Set](./set-node.md) – Mateixa mecànica d'assignació per a transformacions intermèdies
- [Output](./output-node.md) – Resposta basada en missatge o esquema amb embolcall `result`
- [Node Types](../reference/node-types.md) – Tots els tipus de node
- [Workflow Structure](../reference/workflow-structure.md) – Format JSON del workflow
- [Webhooks](../reference/webhooks.md) – Endpoint d'execució i respostes