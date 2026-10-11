# Throw Error

A **Throw Error** csomópont azonnal leállítja a workflow végrehajtását, és egy egyéni HTTP státuszkóddal ellátott hibaválaszt ad vissza. Használja érvényesítési hibák, jogosulatlan hozzáférés vagy egyéb hibafeltételek esetén.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 0 |
| Kimenet | A workflow leáll; a hívónak hibaválasz kerül visszaadásra |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `errorMessage` | expression | Hibaüzenet (támogatja a kifejezéseket) |
| `httpStatusCode` | number | HTTP státuszkód (pl. 400, 401, 403, 404, 429, 500) |

## Gyakori státuszkódok

| Kód | Használati eset |
|------|----------|
| 400 | Bad Request (érvénytelen bemenet) |
| 401 | Unauthorized (hitelesítés szükséges) |
| 403 | Forbidden (hozzáférés megtagadva) |
| 404 | Not Found (az erőforrás hiányzik) |
| 422 | Unprocessable Entity (érvényesítési hiba) |
| 429 | Too Many Requests (sebességkorlát) |
| 500 | Internal Server Error |

## Példa

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

Használja a [Condition](./condition-node.md) csomóponttal a bemenet érvényesítéséhez, és csak érvénytelen esetben dobjon hibát:
- Condition igaz → folytatás az Output felé
- Condition hamis → Throw Error

## Kapcsolódó

- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Condition Node](./condition-node.md) – Érvényesítés a hibadobás előtt
- [Error Handler](./error-handler-node.md) – Más csomópontok hibáinak elkapása
