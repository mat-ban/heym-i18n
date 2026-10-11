# Loop

**Loop**-sõlm itereerib üle massiivi, käivitades iga elemendi jaoks allavoolu sõlmed. Edasiliikumiseks on vajalik tagasiühendus iteratsiooni keha viimasest sõlmest.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 2 (vaikimisi + loop tagasi) |
| Väljundid | 2 (loop, done) |
| Väljund | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `arrayExpression` | expression | Avaldis, mis laheneb massiiviks (nt `$input.items`) |

## Serva käepidemed

- **Allikas `loop`** – Ühendub sõlmedega, mis töötlevad iga elementi (käivitub iga iteratsiooni kohta)
- **Allikas `done`** – Ühendub sõlmedega, mis käivituvad pärast kõigi iteratsioonide lõppemist
- **Sihtmärk default** – Võtab vastu algandmed, mis sisaldavad massiivi
- **Sihtmärk `loop`** – Võtab vastu tagasiühenduse iteratsiooni keha viimasest sõlmest

## Loop-kontekst (iteratsiooni kehas)

- `$loopNode.item` – Praegune element
- `$loopNode.index` – 0-põhine indeks
- `$loopNode.total` – Elementide koguarv
- `$loopNode.isFirst` – Tõeväärtus
- `$loopNode.isLast` – Tõeväärtus

## Kriitilised reeglid

1. **Tagasiühendus on nõutav:** Iteratsiooni keha viimane sõlm PEAB ühenduma tagasi loop'i `loop`-sisendkäepidemele.
2. **Loop-kehas ei tohi olla väljundit:** [Output](./output-node.md)-sõlmed on loop-kehas keelatud. Vahetulemuste jaoks kasutage [Set](./set-node.md)- või [Variable](./variable-node.md)-sõlme.
3. **Automaatseid tulemusi ei ole:** Loop ei kogu tulemusi. Kasutage Variable-sõlmi koos `$array()` ja `.add()`-iga kogumiseks.

## Näide

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Voog: loop → töötlemise sõlm → (tagasi loop'i) → loop → done-haru → väljund.

## Seotud

- [Sõlmetüübid](../reference/node-types.md) – Ülevaade kõigist sõlmetüüpidest
- [Variable-sõlm](./variable-node.md) – Elementide kogumine loop'is
- [Avaldise DSL](../reference/expression-dsl.md) – `item`, `index`, massiivi meetodid
