# Hibakezelő

A **Hibakezelő** csomópont a workflow bármely csomópontjából származó hibákat elkapja. Ha jelen van, automatikusan lefut, amikor bármely csomópont meghibásodik. Nem szükségesek bejövő kapcsolatok—a workflow motor indítja el.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 (hiba esetén aktiválódik) |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `message` | expression | Opcionális. Alapértelmezett: `$error.message` |

## Hibakörnyezet

Amikor a hibakezelő lefut, az alábbi mezők érhetők el:

| Mező | Leírás |
|-------|-------------|
| `$errorHandler.error` | Hibaüzenet szövege |
| `$errorHandler.errorNode` | A meghibásodott csomópont címkéje |
| `$errorHandler.errorNodeType` | A meghibásodott csomópont típusa |
| `$errorHandler.timestamp` | A hiba bekövetkezésének időpontja |

## Használati esetek

- [Telegram](./telegram-node.md), [Slack](./slack-node.md) vagy [E-mail küldése](./send-email-node.md) értesítések küldése hiba esetén
- Hibák naplózása külső rendszerekbe
- Egyéni hibaválasz visszaadása a [Kimenet](./output-node.md) segítségével

Workflow-nként csak egy Hibakezelő engedélyezett.

## Példa

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Kapcsolódás a Kimenethez egyéni hibaválaszhoz:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Vagy kapcsolódás a Slackhez értesítésekhez:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Telegram csomópont](./telegram-node.md) – Értesítés hiba esetén
- [Slack csomópont](./slack-node.md) – Értesítés hiba esetén
- [E-mail küldése csomópont](./send-email-node.md) – E-mail riasztások
- [Hiba dobása csomópont](./throw-error-node.md) – Szándékos hibák
