# Error Handler

Nodul **Error Handler** captează erorile de la orice nod din workflow. Când este prezent, rulează automat atunci când orice nod eșuează. Nu sunt necesare conexiuni de intrare—este declanșat de motorul de workflow.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 (declanșat la eroare) |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `message` | expression | Opțional. Implicit: `$error.message` |

## Contextul erorii

Când rulează error handler-ul, aceste câmpuri sunt disponibile:

| Câmp | Descriere |
|-------|-------------|
| `$errorHandler.error` | Șirul mesajului de eroare |
| `$errorHandler.errorNode` | Eticheta nodului care a eșuat |
| `$errorHandler.errorNodeType` | Tipul nodului care a eșuat |
| `$errorHandler.timestamp` | Momentul în care a apărut eroarea |

## Cazuri de utilizare

- Trimiteți notificări prin [Telegram](./telegram-node.md), [Slack](./slack-node.md) sau [Send Email](./send-email-node.md) la eșec
- Înregistrați erorile în sisteme externe
- Returnați un răspuns de eroare personalizat prin [Output](./output-node.md)

Doar un singur Error Handler per workflow.

## Exemplu

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Conectați la Output pentru un răspuns de eroare personalizat:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Sau conectați la Slack pentru notificări:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Resurse conexe

- [Node Types](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Telegram Node](./telegram-node.md) – Notificare la eroare
- [Slack Node](./slack-node.md) – Notificare la eroare
- [Send Email Node](./send-email-node.md) – Alerte prin email
- [Throw Error Node](./throw-error-node.md) – Erori intenționate
