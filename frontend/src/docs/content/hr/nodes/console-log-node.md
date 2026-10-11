# Console Log

**Console Log** čvor bilježi vrijednost u konzolu backend-a (poslužitelja). Koristite ga za otklanjanje pogrešaka i inspekciju tijekom razvoja.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | Prolazi kroz ulaz |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `logMessage` | izraz | Vrijednost za bilježenje. Podržava [izraze](../reference/expression-dsl.md). |

## Primjer

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Izlaz se pojavljuje u zapisima poslužitelja (npr. izlaz u terminalu prilikom pokretanja `uvicorn`).

## Povezano

- [Vrste čvorova](../reference/node-types.md) – Pregled svih vrsta čvorova
- [Zapisnici](../tabs/logs-tab.md) – Pregled zapisnika aplikacije
