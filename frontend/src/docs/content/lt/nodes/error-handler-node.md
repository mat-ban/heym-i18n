# Klaidų Apdorojimo Mazgas

**Klaidų Apdorojimo** mazgas fiksuoja klaidas iš bet kurio mazgo darbo eigoje. Kai jis yra, jis automatiškai vykdomas, kai bet kuris mazgas nepavyksta. Nereikia jokių įeinančių ryšių – jis yra aktyvuojamas darbo eigos variklio.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 (aktyvuojama klaidos atveju) |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `message` | expression | Pasirinktinai. Numatytoji: `$error.message` |

## Klaidų Kontekstas

Kai klaidų apdorojimo mazgas vykdomas, šie laukai yra prieinami:

| Laukas | Aprašymas |
|--------|-----------|
| `$errorHandler.error` | Klaidos pranešimo tekstas |
| `$errorHandler.errorNode` | Nepavykusio mazgo etiketė |
| `$errorHandler.errorNodeType` | Nepavykusio mazgo tipas |
| `$errorHandler.timestamp` | Klaidos įvykimo laikas |

## Naudojimo Atvejai

- Siųsti [Telegram](./telegram-node.md), [Slack](./slack-node.md) arba [Siųsti El. Laišką](./send-email-node.md) pranešimus apie klaidas
- Registruoti klaidas išorinėse sistemose
- Grąžinti pasirinktą klaidos atsakymą per [Išvestį](./output-node.md)

Per darbo eigą gali būti tik vienas Klaidų Apdorojimo mazgas.

## Pavyzdys

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Prijunkite prie Išvesties, kad gautumėte pasirinktą klaidos atsakymą:
```json
{"message": "Klaida: $errorHandler.error mazge $errorHandler.errorNode"}
```

Arba prijunkite prie Slack pranešimams:
```json
{"message": "Darbo eiga nepavyko: $errorHandler.error mazge $errorHandler.errorNode"}
```

## Susiję

- [Mazgų Tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Telegram Mazgas](./telegram-node.md) – Pranešti apie klaidą
- [Slack Mazgas](./slack-node.md) – Pranešti apie klaidą
- [Siųsti El. Laišką Mazgas](./send-email-node.md) – El. laiškų įspėjimai
- [Išmesti Klaidos Mazgas](./throw-error-node.md) – Tyčiniai klaidų atvejai
