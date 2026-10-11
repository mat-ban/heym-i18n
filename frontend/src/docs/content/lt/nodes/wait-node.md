# Laukti

**Laukti** mazgas sustabdo workflow vykdymą nurodytam laikotarpiui. Naudokite jį greičio ribojimui, atidėtam veiksmui arba apklausų intervalams.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | Perduoda įvestį |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `duration` | number | Atidėjimas milisekundėmis (pvz., 1000 = 1 sekundė). Redaktorius priima nuo 1 iki 900000 (15 minučių) |

## Pavyzdys

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Ciklo mazgas](./loop-node.md) – Naudokite Laukti cikluose greičio ribojimui
