# Registre de consola

El node **Registre de consola** enregistra un valor a la consola del backend (servidor). Utilitzeu-lo per a la depuració i la inspecció durant el desenvolupament.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | Passa a través de l'entrada |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `logMessage` | expression | Valor a enregistrar. Admet [expressions](../reference/expression-dsl.md). |

## Exemple

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

La sortida apareix als registres del servidor (p. ex., la sortida del terminal en executar `uvicorn`).

## Relacionat

- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [Pestanya de registres](../tabs/logs-tab.md) – Visualitzeu els registres de l'aplicació