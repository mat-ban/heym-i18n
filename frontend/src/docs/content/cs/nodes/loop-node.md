# Loop

Uzel **Loop** iteruje přes pole a pro každou položku spouští navazující uzly. Pro posun je vyžadováno zpětné propojení z posledního uzlu v těle iterace.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 2 (výchozí + loop back) |
| Výstupy | 2 (loop, done) |
| Výstup | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `arrayExpression` | expression | Výraz, který se vyhodnotí na pole (např. `$input.items`) |

## Handly hran

- **Zdroj `loop`** – Připojuje se k uzlům, které zpracovávají každou položku (spouští se při každé iteraci)
- **Zdroj `done`** – Připojuje se k uzlům, které se spustí po dokončení všech iterací
- **Cíl výchozí** – Přijímá počáteční data obsahující pole
- **Cíl `loop`** – Přijímá zpětné propojení z posledního uzlu těla iterace

## Kontext smyčky (v těle iterace)

- `$loopNode.item` – Aktuální položka
- `$loopNode.index` – Index počínaje 0
- `$loopNode.total` – Celkový počet položek
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritická pravidla

1. **Vyžadováno zpětné propojení:** Poslední uzel v těle iterace MUSÍ být propojen zpět na vstupní handle `loop` smyčky.
2. **Žádný výstup v těle smyčky:** Uzly [Output](./output-node.md) jsou v těle smyčky zakázány. Pro mezivýsledky použijte [Set](./set-node.md) nebo [Variable](./variable-node.md).
3. **Žádné automatické výsledky:** Smyčka neshromažďuje výsledky. Pro akumulaci použijte uzly Variable s `$array()` a `.add()`.

## Příklad

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Tok: loop → uzel zpracování → (zpět do loop) → loop → větev done → output.

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Variable Node](./variable-node.md) – Shromažďování položek ve smyčce
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, metody pole
