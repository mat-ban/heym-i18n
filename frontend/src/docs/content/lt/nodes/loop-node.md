# Ciklas

**Ciklo** mazgas iteruoja per masyvą, vykdydamas žemyn esančius mazgus kiekvienam elementui. Reikalingas atgalinis ryšys iš paskutinio mazgo ciklo kūne, kad būtų galima tęsti.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 2 (numatytosios + ciklo atgalinis ryšys) |
| Išvestys | 2 (ciklas, baigta) |
| Išvestis | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `arrayExpression` | expression | Išraiška, kuri išsprendžiama į masyvą (pvz., `$input.items`) |

## Kraštinių valdymas

- **Šaltinis `ciklas`** – Jungiasi prie mazgų, kurie apdoroja kiekvieną elementą (vykdomas kiekvienos iteracijos metu)
- **Šaltinis `baigta`** – Jungiasi prie mazgų, kurie vykdomi po to, kai visos iteracijos baigtos
- **Tikslas numatytasis** – Priima pradinius duomenis, kuriuose yra masyvas
- **Tikslas `ciklas`** – Priima atgalinį ryšį iš paskutinio iteracijos kūno mazgo

## Ciklo kontekstas (ciklo kūne)

- `$loopNode.item` – Dabartinis elementas
- `$loopNode.index` – 0 pagrindu indeksas
- `$loopNode.total` – Iš viso elementų
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritinės taisyklės

1. **Reikalingas atgalinis ryšys:** Paskutinis mazgas ciklo kūne PRIVALO jungtis atgal prie ciklo `ciklas` įvesties valdymo.
2. **Nėra išvesties ciklo kūne:** [Išvesties](./output-node.md) mazgai yra draudžiami ciklo kūne. Naudokite [Nustatyti](./set-node.md) arba [Kintamąjį](./variable-node.md) tarpiniams rezultatams.
3. **Nėra automatinio rezultatų rinkimo:** Ciklas nesurenka rezultatų. Naudokite Kintamųjų mazgus su `$array()` ir `.add()`, kad sukauptumėte.

## Pavyzdys

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Srautas: ciklas → apdorojimo mazgas → (atgal į ciklą) → ciklas → baigta šaka → išvestis.

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visi mazgų tipai
- [Kintamojo mazgas](./variable-node.md) – Surinkti elementus cikle
- [Išraiškų DSL](../reference/expression-dsl.md) – `item`, `index`, masyvo metodai
