# Loop

Uzol **Loop** iteruje cez pole a pre každú položku vykonáva nadväzujúce uzly. Na posun vpred vyžaduje spätné prepojenie z posledného uzla v tele iterácie.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 2 (predvolený + spätná slučka) |
| Výstupy | 2 (loop, done) |
| Výstup | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `arrayExpression` | expression | Výraz, ktorý sa vyhodnotí na pole (napr. `$input.items`) |

## Hrany (Edge Handles)

- **Zdroj `loop`** – Pripája sa k uzlom, ktoré spracúvajú každú položku (spúšťa sa pri každej iterácii)
- **Zdroj `done`** – Pripája sa k uzlom, ktoré sa spustia po dokončení všetkých iterácií
- **Cieľ predvolený** – Prijíma počiatočné dáta obsahujúce pole
- **Cieľ `loop`** – Prijíma spätné prepojenie z posledného uzla tela iterácie

## Kontext slučky (v tele iterácie)

- `$loopNode.item` – Aktuálna položka
- `$loopNode.index` – Index od 0
- `$loopNode.total` – Celkový počet položiek
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritické pravidlá

1. **Vyžaduje sa spätné prepojenie:** Posledný uzol v tele iterácie MUSÍ byť prepojený späť na vstupný handle `loop` uzla slučky.
2. **Žiadny výstup v tele slučky:** Uzly [Output](./output-node.md) sú v tele slučky zakázané. Pre medzivýsledky použite [Set](./set-node.md) alebo [Variable](./variable-node.md).
3. **Žiadne automatické výsledky:** Slučka nezhromažďuje výsledky. Na akumuláciu použite uzly Variable s `$array()` a `.add()`.

## Príklad

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Tok: loop → uzol spracovania → (späť do loop) → loop → vetva done → výstup.

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Variable Node](./variable-node.md) – Zhromažďovanie položiek v slučke
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, metódy pre polia
