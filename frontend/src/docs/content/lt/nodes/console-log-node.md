# Konsolės Žurnalas

**Konsolės Žurnalo** mazgas registruoja reikšmę serverio konsolėje. Naudokite jį derinimui ir tikrinimui kūrimo proceso metu.

## Apžvalga

| Ypatybė | Reikšmė |
|---------|---------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | Perduoda įvestį |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `logMessage` | expression | Reikšmė, kurią reikia registruoti. Palaiko [išraiškas](../reference/expression-dsl.md). |

## Pavyzdys

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Išvestis pasirodo serverio žurnaluose (pvz., terminalo išvestis, kai vykdomas `uvicorn`).

## Susiję

- [Mazgų Tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Žurnalų Skirtukas](../tabs/logs-tab.md) – Peržiūrėti programos žurnalus
