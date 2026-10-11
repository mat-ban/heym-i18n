# Izvajanje

Vozlišče **Izvajanje** pokliče drug workflow (pod-workflow) in mu posreduje vhodne podatke. Uporabite ga za ponovno uporabo logike, ne za transformacijo podatkov—za to uporabite [Nastavi](./set-node.md).

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `executeWorkflowId` | UUID | ID workflowa, ki ga je treba izvesti |
| `executeInput` | izraz | Enotni vhod (za workflows z enim vhodnim poljem) |
| `executeInputMappings` | tabela | `{ key, value }` za več vhodov. `key` = ime vhodnega polja ciljnega workflowa. |
| `executeDoNotWait` | boolean | Ko je `true`, pošlje pod-workflow v ozadje brez čakanja. Izhod: `{ "status": "dispatched", "workflow_id": "..." }`. Privzeto: `false`. |

## Oblika odgovora

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

## Ne čakajte

Ko je `executeDoNotWait: true`, vozlišče pošlje pod-workflow v ozadje in takoj vrne:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Nadrejeni workflow nadaljuje na naslednje vozlišče brez čakanja. Zapis o izvajanju pod-workflowa se asinkrono zapiše v sled, ko se zaključi. Uporabite to, ko rezultat pod-workflowa ni potreben v nadaljevanju.

## Enotni vhod

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

## Več vhodov

Ko ima ciljna workflow več vhodnih polj, uporabite `executeInputMappings`:
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

`key` mora ustrezati ključem [Vhoda](./input-node.md) `inputFields` ciljnega workflowa.

## Sorodno

- [Funkcije platna](../reference/canvas-features.md) – Izvleči v pod-workflow za ustvarjanje vozlišč Izvajanja iz izbranih vozlišč
- [Tipi vozlišč](../reference/node-types.md) – Pregled vseh tipov vozlišč
- [Vhodno vozlišče](./input-node.md) – Vhodna polja ciljnega workflowa
- [Vozlišče Nastavi](./set-node.md) – Transformacija podatkov (ne klici workflowa)
