# Error Handler

Uzol **Error Handler** zachytáva chyby z akéhokoľvek uzla vo workflow. Ak je prítomný, spustí sa automaticky, keď zlyhá ktorýkoľvek uzol. Nie sú potrebné žiadne prichádzajúce prepojenia – spúšťa ho engine workflow.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 (spúšťa sa pri chybe) |
| Výstupy | 1 |
| Výstup | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `message` | expression | Voliteľné. Predvolené: `$error.message` |

## Kontext chyby

Keď sa spustí error handler, sú dostupné tieto polia:

| Pole | Popis |
|-------|-------------|
| `$errorHandler.error` | Reťazec s chybovou správou |
| `$errorHandler.errorNode` | Label uzla, ktorý zlyhal |
| `$errorHandler.errorNodeType` | Typ zlyhaného uzla |
| `$errorHandler.timestamp` | Kedy nastala chyba |

## Prípady použitia

- Odosielanie upozornení cez [Telegram](./telegram-node.md), [Slack](./slack-node.md) alebo [Send Email](./send-email-node.md) pri zlyhaní
- Zaznamenávanie chýb do externých systémov
- Vrátenie vlastnej chybovej odpovede cez [Output](./output-node.md)

Iba jeden Error Handler na workflow.

## Príklad

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Prepojenie na Output pre vlastnú chybovú odpoveď:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Alebo prepojenie na Slack pre upozornenia:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Telegram Node](./telegram-node.md) – Upozornenie pri chybe
- [Slack Node](./slack-node.md) – Upozornenie pri chybe
- [Send Email Node](./send-email-node.md) – E-mailové upozornenia
- [Throw Error Node](./throw-error-node.md) – Zámerné chyby
