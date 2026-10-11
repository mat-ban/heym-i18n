# Set

A **Set** csomópont átalakítja és leképezi a bemeneti adatokat egyéni kimenetté. Használható nagybetűsítésre, részszöveg-kinyerésre, összefűzésre, véletlenszám-generálásra és bármilyen adatátalakításra – de nem workflow-k hívására (erre az [Execute](./execute-node.md) szolgál).

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.keyName` minden leképezési kulcshoz |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | A csomópont azonosítója (camelCase) |
| `mappings` | array | Kulcs-érték párok. Mindegyik: `{ key, value }`, ahol a `value` egy [kifejezés](../reference/expression-dsl.md) |

## Agent eszköz használata

Amikor egy Set csomópont egy [Agent csomóponthoz](./agent-node.md) van csatlakoztatva vászon-csomópont eszközként, minden leképezési érték megjelölhető **agent által megadottként** a bot ikonnal. A megjelölt leképezési értékek olyan eszközparaméterekké válnak, amelyeket az agent futásidőben tölt ki. A meg nem jelölt leképezések rögzítettek maradnak a csomópont konfigurációjában.

A bot ikon csak akkor jelenik meg, ha a Set csomópont egy agent eszközkezelőjéhez van csatlakoztatva. Egy önálló Set csomópont nem jeleníti meg az agent által megadott vezérlőket.

## Kifejezésszabályok

- Hivatkozás korábbi csomópontokra: `$nodeName.text`, `$nodeName.body.field`
- Függvények használata: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- A `$range(a,b)` nem tartalmazza a `b`-t; `a > b` esetén hibát ad.
- Csak egy `$` állhat a kifejezés elején – soha nem a zárójeleken belül
- A kimenet elérése kulcs alapján: `$setNode.randomNumber`, `$setNode.text`

## Példa

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

A további csomópontok a `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr` útvonalakon érhetik el.

## Kapcsolódó

- [JSON output mapper](./json-output-mapper-node.md) – Ugyanazok a leképezések; egyetlen terminálként a gyökér JSON-t adja vissza webhookokhoz/futtatásokhoz
- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Execute csomópont](./execute-node.md) – Workflow-k hívása (nem adatátalakítás)
- [Expression DSL](../reference/expression-dsl.md) – Függvények és szintaxis
- [Kifejezés-kiértékelési párbeszédablak](../reference/expression-evaluation-dialog.md) – Bővíthető szerkesztő élő backend előnézettel és Előző/Következő navigációval a leképezésekhez
