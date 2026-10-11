# Izvršavanje

**Izvršavanje** čvor poziva drugi workflow (pod-workflow) i prosljeđuje mu ulazne podatke. Koristite ga za ponovnu upotrebu logike, a ne za transformaciju podataka—za to koristite [Set](./set-node.md).

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `executeWorkflowId` | UUID | ID workflowa koji se izvršava |
| `executeInput` | izraz | Jedan ulaz (za workflows s jednim ulaznim poljem) |
| `executeInputMappings` | niz | `{ key, value }` za više ulaza. `key` = naziv ulaznog polja ciljanog workflowa. |
| `executeDoNotWait` | boolean | Kada je `true`, pokreće pod-workflow u pozadini bez čekanja. Izlaz: `{ "status": "dispatched", "workflow_id": "..." }`. Zadano: `false`. |

## Format Odgovora

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "vrijednost izlaza" }
  },
  "execution_time_ms": 1297.63
}
```

## Ne Čekaj

Kada je `executeDoNotWait: true`, čvor pokreće pod-workflow u pozadinskoj niti i odmah vraća:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Roditeljski workflow nastavlja na sljedeći čvor bez čekanja. Zapis o izvršenju pod-workflowa se asinkrono zapisuje u trag kada završi. Koristite ovo kada rezultat pod-workflowa nije potreban u nastavku.

## Jedan Ulaz

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

## Više Ulaza

Kada ciljani workflow ima više ulaznih polja, koristite `executeInputMappings`:
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

`key` mora odgovarati [Input](./input-node.md) `inputFields` ključevima ciljanog workflowa.

## Povezano

- [Canvas Značajke](../reference/canvas-features.md) – Izdvojite u Pod-Workflow za stvaranje Execute čvorova iz odabranih čvorova
- [Tipovi Čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Input Čvor](./input-node.md) – Ulazna polja ciljanog workflowa
- [Set Čvor](./set-node.md) – Transformacija podataka (ne pozivi workflowa)
