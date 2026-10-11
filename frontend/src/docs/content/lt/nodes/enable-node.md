# Įjungti mazgą

**Įjungti mazgą** mazgas įjungia kitą mazgą. Vykdant jį, nustatomas tikslo mazgo `active` į `true` ir išsaugomas pakeitimas. Tai yra [Išjungti mazgą](./disable-node.md) atitikmuo: naudokite jį, kad vėl suaktyvintumėte [Cron](./cron-node.md) trigger'į arba bet kurį mazgą, kuris buvo išjungtas.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `targetNodeLabel` | string | Mazgo, kurį reikia įjungti, etiketė (pvz., `hourlyCheck`) |

## Elgsena

- Tikslo mazgas išsaugomas kaip aktyvus, todėl būsimi vykdymai ir trigger'iai jį mato. Vėl įjungtas Cron trigger'is vėl įsijungia savo kitame suplanuotame laike.
- Jei tikslo mazgas yra žemiau Įjungti mazgą ir dar nebuvo vykdytas, jis taip pat bus vykdomas dabartiniame vykdyme.
- Įjungus mazgą, kuris jau yra aktyvus, niekas nepasikeičia; išvestis vis tiek rodo `enabled: true`.
- Mazgas nepavyksta su klaida, kai `targetNodeLabel` yra tuščias arba nėra mazgo su ta etikete.

## Naudojimo atvejis

Pradėkite [Cron](./cron-node.md) trigger'į pagal poreikį. Išsaugokite Cron mazgą išjungtą ir suteikite darbo eigai antrą įėjimo tašką, pvz., [Įvesties](./input-node.md) trigger'į. Prašymas šiam įėjimo taškui vykdo Įjungti mazgą, ir Cron pradeda veikti.

Išjungtas trigger'is niekada nepradeda vykdymo pats, todėl Įjungti mazgą turi būti už įėjimo taško, kuris gali vykdyti.

## Pavyzdys

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Srautas: Įvestis → Įjungti mazgą (tikslas: cron) → Išvestis. Cron mazgas `hourlyCheck` išsaugomas kaip išjungtas toje pačioje darbo eigoje ir vykdo savo HTTP tikrinimo šaką, kai tik bus įjungtas.

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Išjungti mazgą](./disable-node.md) – Išjungti mazgą iš darbo eigos
- [Cron mazgas](./cron-node.md) – Trigger'is, skirtas įjungti
- [Sąlygos mazgas](./condition-node.md) – Šaka prieš įjungiant
- [Drobės funkcijos](../reference/canvas-features.md) – Įjungti arba išjungti mazgą rankiniu būdu
