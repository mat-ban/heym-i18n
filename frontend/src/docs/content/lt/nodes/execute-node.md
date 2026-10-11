# Vykdyti

**Execute** mazgas kviečia kitą workflow (sub-workflow) ir perduoda jam įvestį. Naudokite jį pakartotinai naudojamai logikai, o ne duomenų transformacijai—tam naudokite [Set](./set-node.md).

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `executeWorkflowId` | UUID | Vykdomo workflow ID |
| `executeInput` | expression | Viena įvestis (workflow su viena įvesties lauku) |
| `executeInputMappings` | array | `{ key, value }` kelioms įvestims. `key` = tikslinio workflow įvesties lauko pavadinimas. |
| `executeDoNotWait` | boolean | Kai `true`, sub-workflow vykdomas fone, nesulaukiant. Išvestis: `{ "status": "dispatched", "workflow_id": "..." }`. Numatytoji reikšmė: `false`. |

## Atsakymo formatas

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "išvesties reikšmė" }
  },
  "execution_time_ms": 1297.63
}
```

## Nesulaukti

Kai `executeDoNotWait: true`, mazgas siunčia sub-workflow į fono giją ir iš karto grąžina:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Tėvinis workflow tęsiasi prie kito mazgo nesulaukdamas. Sub-workflow vykdymo įrašas yra rašomas į seką asinkroniškai, kai jis baigiasi. Naudokite tai, kai sub-workflow rezultatas nėra reikalingas tolesniam apdorojimui.

## Viena įvestis

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

## Kelios įvestys

Kai tikslinis workflow turi kelis įvesties laukus, naudokite `executeInputMappings`:
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

`key` turi atitikti tikslinio workflow [Input](./input-node.md) `inputFields` raktus.

## Susiję

- [Drobės funkcijos](../reference/canvas-features.md) – Ištraukti į Sub-Workflow, kad sukurtumėte Execute mazgus iš pasirinktų mazgų
- [Mazgų tipai](../reference/node-types.md) – Visi mazgų tipų apžvalga
- [Įvesties mazgas](./input-node.md) – Tikslinio workflow įvesties laukai
- [Set mazgas](./set-node.md) – Duomenų transformacija (ne workflow kvietimai)
