# Throw Error

De **Throw Error**-node stopt de uitvoering van de workflow onmiddellijk en retourneert een foutrespons met een aangepaste HTTP-statuscode. Gebruik deze voor validatiefouten, ongeautoriseerde toegang of andere foutcondities.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 0 |
| Uitvoer | Workflow stopt; foutrespons geretourneerd naar de aanroeper |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `errorMessage` | expression | Foutmelding (ondersteunt expressies) |
| `httpStatusCode` | number | HTTP-statuscode (bijv. 400, 401, 403, 404, 429, 500) |

## Veelvoorkomende statuscodes

| Code | Gebruikssituatie |
|------|----------|
| 400 | Bad Request (ongeldige invoer) |
| 401 | Unauthorized (authenticatie vereist) |
| 403 | Forbidden (toegang geweigerd) |
| 404 | Not Found (resource ontbreekt) |
| 422 | Unprocessable Entity (validatiefout) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

## Voorbeeld

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

Gebruik in combinatie met [Condition](./condition-node.md) om invoer te valideren en alleen bij ongeldige invoer een fout te werpen:
- Conditie waar → doorgaan naar Output
- Conditie onwaar → Throw Error

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Condition Node](./condition-node.md) – Valideren voordat een fout wordt geworpen
- [Error Handler](./error-handler-node.md) – Fouten van andere nodes opvangen
