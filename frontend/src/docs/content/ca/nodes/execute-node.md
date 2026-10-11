# Execute

El node **Execute** crida un altre workflow (sub-workflow) i li passa l'entrada. Utilitzeu-lo per a lògica reutilitzable, no per a la transformació de dades; per a això, feu servir [Set](./set-node.md).

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `executeWorkflowId` | UUID | ID del workflow a executar |
| `executeInput` | expression | Entrada única (per a workflows amb un sol camp d'entrada) |
| `executeInputMappings` | array | `{ key, value }` per a múltiples entrades. `key` = nom del camp d'entrada del workflow de destinació. |
| `executeDoNotWait` | boolean | Quan és `true`, envia el sub-workflow en segon pla sense esperar. Sortida: `{ "status": "dispatched", "workflow_id": "..." }`. Per defecte: `false`. |

## Format de resposta

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## No esperar

Quan `executeDoNotWait: true`, el node envia el sub-workflow a un fil en segon pla i retorna immediatament:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

El workflow pare continua cap al node següent sense esperar. El registre d'execució del sub-workflow s'escriu a l'execució de manera asíncrona quan finalitza. Utilitzeu aquesta opció quan el resultat del sub-workflow no sigui necessari aigües avall.

## Entrada única

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Múltiples entrades

Quan el workflow de destinació té múltiples camps d'entrada, utilitzeu `executeInputMappings`:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

El `key` ha de coincidir amb les claus `inputFields` del node [Input](./input-node.md) del workflow de destinació.

## Relacionat

- [Funcions del Canvas](../reference/canvas-features.md) – Extreure a sub-workflow per crear nodes Execute a partir dels nodes seleccionats
- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [Node Input](./input-node.md) – Camps d'entrada del workflow de destinació
- [Node Set](./set-node.md) – Transformació de dades (no pas crides a workflows)