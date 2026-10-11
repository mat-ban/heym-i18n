# Konsooli logi

**Konsooli logi** sõlm logib väärtuse taustsüsteemi (serveri) konsooli. Kasutage seda arenduse ajal silumiseks ja kontrollimiseks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | Edastab sisendi muutmata kujul |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `logMessage` | expression | Logitav väärtus. Toetab [avaldised](../reference/expression-dsl.md). |

## Näide

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Väljund kuvatakse serveri logides (nt terminali väljund, kui käivitate `uvicorn`).

## Seotud

- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Logide vahekaart](../tabs/logs-tab.md) – Rakenduse logide vaatamine
