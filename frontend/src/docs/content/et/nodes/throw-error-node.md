# Viskab Vea

**Viskab Vea** node peatab workflow täitmise koheselt ja tagastab veavastuse kohandatud HTTP olekukoodiga. Kasutage seda valideerimise ebaõnnestumiste, volitamata juurdepääsu või muude veaolukordade jaoks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 0 |
| Väljund | Workflow peatub; veavastus tagastatakse kutsujale |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Node'i identifikaator (camelCase) |
| `errorMessage` | expression | Veateade (toetab avaldisi) |
| `httpStatusCode` | number | HTTP olekukood (nt 400, 401, 403, 404, 429, 500) |

## Levinumad olekukoodid

| Kood | Kasutusjuht |
|------|----------|
| 400 | Bad Request (kehtetu sisend) |
| 401 | Unauthorized (autentimine nõutav) |
| 403 | Forbidden (juurdepääs keelatud) |
| 404 | Not Found (ressurss puudub) |
| 422 | Unprocessable Entity (valideerimise viga) |
| 429 | Too Many Requests (päringute piirang) |
| 500 | Internal Server Error |

## Näide

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

Kasutage koos [Condition](./condition-node.md) node'iga, et valideerida sisendit ja visata viga ainult kehtetu sisendi korral:
- Condition tõene → jätka Output'ini
- Condition väär → Viskab Vea

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Condition Node](./condition-node.md) – Valideeri enne vea viskamist
- [Error Handler](./error-handler-node.md) – Püüa vigu teistest node'idest
