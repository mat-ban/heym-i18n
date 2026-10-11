# JSON output mapper

Čvor **JSON output mapper** izgrađuje JSON objekt iz key/value [mapiranja](./set-node.md) (isti model kao [Set](./set-node.md)). Koristite ga kada pozivatelji trebaju primiti **obično JSON tijelo** u korijenu odgovora.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 0 (sink) |
| Runtime izlaz | Objekt izgrađen iz `mappings` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` unosi (isto kao Set) |

## Korištenje kao Agent tool

Nije podržano. Ovaj čvor je terminalni sink, pa se ne može priključiti na tools ručku [Agent Node](./agent-node.md). Koristite [Set](./set-node.md) čvor kada agent treba oblikovati vrijednosti tijekom razgovora.

## Ponašanje Webhooka i izvršavanja

Kada je ovaj čvor **jedini** terminalni izlaz workflowa, izvršni **outputs** je sam mapirani objekt: ključevi iz `mappings` pojavljuju se na **najvišoj razini** JSON-a. **Ne postoji** vanjski omotač ključan po labelu čvora niti `{ "result": ... }` objekt (za razliku od [Output](./output-node.md) čvora).

Ako više terminalnih čvorova proizvodi izlaze (na primjer [Output](./output-node.md) plus JSON output mapper, ili nekoliko grana), Heym koristi uobičajeni oblik: svaki terminal je ključan po svom `label`.

## Ograničenje petlje

Isto pravilo kao [Output](./output-node.md): ne postavljajte ovaj čvor unutar grane iteracije petlje—samo nakon `done` grane petlje. Pogledajte [Loop](./loop-node.md).

## Primjer

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

## Povezano

- [Set](./set-node.md) – Ista mehanika mapiranja za međukorake transformacije
- [Output](./output-node.md) – Odgovor temeljen na poruci ili schemi s `result` omotačem
- [Node Types](../reference/node-types.md) – Svi tipovi čvorova
- [Workflow Structure](../reference/workflow-structure.md) – JSON format workflowa
- [Webhooks](../reference/webhooks.md) – Execute endpoint i odgovori
