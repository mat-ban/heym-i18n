# Throw Error

Noden **Throw Error** stoppar workflow-körningen omedelbart och returnerar ett felsvar med en anpassad HTTP-statuskod. Den används för valideringsfel, obehörig åtkomst eller andra felvillkor.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 0 |
| Resultat | Workflow stoppas; felsvar returneras till anroparen |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `errorMessage` | expression | Felmeddelande (stöder uttryck) |
| `httpStatusCode` | number | HTTP-statuskod (t.ex. 400, 401, 403, 404, 429, 500) |

## Vanliga statuskoder

| Kod | Användningsområde |
|-----|-------------------|
| 400 | Bad Request (ogiltig indata) |
| 401 | Unauthorized (autentisering krävs) |
| 403 | Forbidden (åtkomst nekad) |
| 404 | Not Found (resurs saknas) |
| 422 | Unprocessable Entity (valideringsfel) |
| 429 | Too Many Requests (hastighetsbegränsning) |
| 500 | Internal Server Error |

## Exempel

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Använd tillsammans med [Condition](./condition-node.md) för att validera indata och endast kasta ett fel när indata är ogiltig:
- Condition true → fortsätt till Output
- Condition false → Throw Error

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Condition-nod](./condition-node.md) – Validera innan fel kastas
- [Error Handler](./error-handler-node.md) – Fånga fel från andra noder
