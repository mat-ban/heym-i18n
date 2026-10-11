# Execute

Az **Execute** csomópont meghív egy másik workflow-t (al-workflow-t), és bemenetet ad át neki. Újrafelhasználható logikához használja, ne adatátalakításhoz—arra a [Set](./set-node.md) csomópontot használja.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `executeWorkflowId` | UUID | A végrehajtandó workflow azonosítója |
| `executeInput` | expression | Egyetlen bemenet (egyetlen bemeneti mezővel rendelkező workflow-khoz) |
| `executeInputMappings` | array | `{ key, value }` több bemenethez. `key` = a cél-workflow bemeneti mezőjének neve. |
| `executeDoNotWait` | boolean | Ha `true`, a rendszer a háttérben indítja el az al-workflow-t anélkül, hogy megvárná. Kimenet: `{ "status": "dispatched", "workflow_id": "..." }`. Alapértelmezett: `false`. |

## Válaszformátum

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

## Várakozás nélkül

Ha `executeDoNotWait: true`, a csomópont egy háttérszálra indítja az al-workflow-t, és azonnal visszatér:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

A szülő workflow várakozás nélkül folytatja a következő csomóponttal. Az al-workflow végrehajtási rekordja aszinkron módon íródik a nyomkövetésbe, amikor befejeződik. Ezt akkor használja, ha az al-workflow eredményére nincs szükség a további feldolgozásban.

## Egyetlen bemenet

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

## Több bemenet

Ha a cél-workflow több bemeneti mezővel rendelkezik, használja az `executeInputMappings` paramétert:
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

A `key` értékének meg kell egyeznie a cél-workflow [Input](./input-node.md) csomópontjának `inputFields` kulcsaival.

## Kapcsolódó

- [Canvas funkciók](../reference/canvas-features.md) – Kinyerés al-workflow-ba Execute csomópontok létrehozásához a kijelölt csomópontokból
- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Input csomópont](./input-node.md) – A cél-workflow bemeneti mezői
- [Set csomópont](./set-node.md) – Adatátalakítás (nem workflow-hívások)
