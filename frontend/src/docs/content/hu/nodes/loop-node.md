# Loop

A **Loop** csomópont egy tömb elemein iterál, és minden egyes elemre végrehajtja a downstream csomópontokat. Az iteráció előrehaladásához szükséges egy visszacsatolás (back-connection) az iterációs törzs utolsó csomópontjától.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 2 (alapértelmezett + loop visszacsatolás) |
| Kimenetek | 2 (loop, done) |
| Kimenet | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `arrayExpression` | expression | Olyan kifejezés, amely egy tömbre oldódik fel (pl. `$input.items`) |

## Élkezelők (Edge Handles)

- **Forrás `loop`** – Azokhoz a csomópontokhoz kapcsolódik, amelyek minden egyes elemet feldolgoznak (iterációnként fut)
- **Forrás `done`** – Azokhoz a csomópontokhoz kapcsolódik, amelyek az összes iteráció befejezése után futnak
- **Cél default** – Fogadja a tömböt tartalmazó kezdeti adatokat
- **Cél `loop`** – Fogadja a visszacsatolást az iterációs törzs utolsó csomópontjától

## Loop kontextus (az iterációs törzsben)

- `$loopNode.item` – Aktuális elem
- `$loopNode.index` – 0-alapú index
- `$loopNode.total` – Elemek összesített száma
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritikus szabályok

1. **Visszacsatolás kötelező:** Az iterációs törzs utolsó csomópontjának KÖTELEZŐ visszacsatolnia a loop `loop` bemeneti kezelőjéhez.
2. **Nincs kimenet az iterációs törzsben:** Az [Output](./output-node.md) csomópontok tiltottak az iterációs törzsön belül. A köztes eredményekhez használjon [Set](./set-node.md) vagy [Variable](./variable-node.md) csomópontot.
3. **Nincs automatikus eredménygyűjtés:** A loop nem gyűjti az eredményeket. Az akkumuláláshoz használjon Variable csomópontokat a `$array()` és `.add()` metódusokkal.

## Példa

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Folyamat: loop → feldolgozó csomópont → (vissza a loophoz) → loop → done ág → output.

## Kapcsolódó

- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Variable Node](./variable-node.md) – Elemek gyűjtése egy loopban
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, tömbmetódusok
