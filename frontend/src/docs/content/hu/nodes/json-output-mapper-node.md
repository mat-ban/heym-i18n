# JSON output mapper

A **JSON output mapper** csomópont kulcs/érték [mappings](./set-node.md) alapján épít fel egy JSON objektumot (ugyanaz a modell, mint a [Set](./set-node.md) esetében). Akkor használja, amikor a hívóknak a válasz gyökerében egy **sima JSON törzset** kell kapniuk.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 0 (nyelő) |
| Futásidejű kimenet | A `mappings` alapján felépített objektum |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | A csomópont azonosítója (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` bejegyzések (ugyanaz, mint a Set esetében) |

## Agent eszköz használata

Nem támogatott. Ez a csomópont egy terminális nyelő, ezért nem csatolható egy [Agent Node](./agent-node.md) tools handle-jéhez. Használjon [Set](./set-node.md) csomópontot, amikor egy agentnek a beszélgetés közben kell értékeket formálnia.

## Webhook és futtatási viselkedés

Amikor ez a csomópont a workflow **egyetlen** terminális kimenete, a végrehajtás **outputs** értéke maga a leképezett objektum: a `mappings` kulcsai a JSON **legfelső szintjén** jelennek meg. **Nincs** külső burkoló kulcs, amelyet a csomópont címkéje azonosítana, és **nincs** `{ "result": ... }` objektum sem (ellentétben az [Output](./output-node.md) csomóponttal).

Ha több terminális csomópont állít elő kimenetet (például [Output](./output-node.md) és JSON output mapper, vagy több ág), a Heym a szokásos formát használja: minden terminálist a `label`-je azonosít.

## Loop megkötés

Ugyanaz a szabály, mint az [Output](./output-node.md) esetében: ne helyezze ezt a csomópontot egy loop iterációs ágba—csak a loop `done` ága után. Lásd: [Loop](./loop-node.md).

## Példa

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

## Kapcsolódó

- [Set](./set-node.md) – Ugyanaz a leképezési mechanizmus köztes átalakításokhoz
- [Output](./output-node.md) – Üzenet- vagy sémaalapú válasz `result` burkolással
- [Node Types](../reference/node-types.md) – Az összes csomóponttípus
- [Workflow Structure](../reference/workflow-structure.md) – JSON workflow formátum
- [Webhooks](../reference/webhooks.md) – Execute endpoint és válaszok
