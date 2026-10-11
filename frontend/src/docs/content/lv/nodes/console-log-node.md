# Konsoles žurnāls

**Konsoles žurnāla** mezgls reģistrē vērtību aizmugursistēmas (servera) konsolē. Izmantojiet to atkļūdošanai un pārbaudei izstrādes laikā.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | Nodod tālāk ievadi |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezglu identifikators (camelCase) |
| `logMessage` | expression | Reģistrējamā vērtība. Atbalsta [izteiksmes](../reference/expression-dsl.md). |

## Piemērs

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Izvade parādās servera žurnālos (piem., termināļa izvadē, palaižot `uvicorn`).

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Žurnālu cilne](../tabs/logs-tab.md) – Lietotnes žurnālu skatīšana
