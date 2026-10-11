# Output

Az **Output** csomópont a workflow végpontja, amely visszaadja a választ a hívónak. Mindig a korábbi csomópont címkéjére hivatkozzon – soha ne használja a `$input` kifejezést.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 (opcionális, aszinkron utófeldolgozáshoz) |
| Kimenet | Visszaadja a `message` értéket a hívónak |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `message` | expression | Kimeneti érték. **A korábbi csomópontra kell hivatkoznia**: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Ha igaz, az output utáni csomópontok aszinkron módon futnak le, miután a válasz elküldésre került |

## Agent eszköz használata

Amikor egy Output csomópont egy [Agent csomóponthoz](./agent-node.md) van csatlakoztatva vászon-csomópont eszközként, a `message` mező **agent által biztosítottként** jelölhető meg a bot ikonnal. Az agent ekkor biztosítja a message értékét, amikor meghívja az eszközt. Ha az Output csomópont nincs agent eszközként csatlakoztatva, a bot ikon rejtve marad.

## Kritikus szabály

**Soha ne használja a `$input` kifejezést az output csomópontban.** Mindig a korábbi csomópont címkéjét használja:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (ahol a `processData` a korábbi csomópont címkéje)

## Aszinkron utófeldolgozás

Amikor `allowDownstream: true`, a válasz azonnal visszaadásra kerül. Az output után csatlakoztatott csomópontok a háttérben futnak le (pl. Slack értesítések, naplózás). Mivel a downstream szakasz később fejeződhet be, egy downstream hiba `error` állapotra változtathatja a rögzített futtatási állapotot, miután a korai válasz már visszaadásra került; a végleges előzmények és analitika ezt a későbbi eredményt tükrözik.

## Példa

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Példa – Aszinkronnal

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Ezután csatlakoztasson egy [Telegram](./telegram-node.md), [Slack](./slack-node.md) vagy más csomópontot az output után a fire-and-forget értesítésekhez.

## Kapcsolódó

- [JSON output mapper](./json-output-mapper-node.md) – Gyökér JSON törzs `result` burkolás nélkül, ha ez az egyetlen terminál
- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Expression DSL](../reference/expression-dsl.md) – Csomópont kimenetére való hivatkozás
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Bővíthető szerkesztő élő backend előnézettel a message számára
- [Workflow struktúra](../reference/workflow-structure.md) – JSON formátum
