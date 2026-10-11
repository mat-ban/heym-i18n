# Kļūdas izmešana

Mezgls **Throw Error** nekavējoties pārtrauc workflow izpildi un atgriež kļūdas atbildi ar pielāgotu HTTP statusa kodu. Izmantojiet to validācijas kļūmēm, neatļautai piekļuvei vai citiem kļūdu nosacījumiem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 0 |
| Izvade | Workflow tiek pārtraukts; kļūdas atbilde tiek atgriezta izsaucējam |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `errorMessage` | expression | Kļūdas ziņojums (atbalsta izteiksmes) |
| `httpStatusCode` | number | HTTP statusa kods (piem., 400, 401, 403, 404, 429, 500) |

## Biežāk izmantotie statusa kodi

| Kods | Lietošanas gadījums |
|------|----------|
| 400 | Bad Request (nederīga ievade) |
| 401 | Unauthorized (nepieciešama autentifikācija) |
| 403 | Forbidden (piekļuve liegta) |
| 404 | Not Found (resurss nav atrasts) |
| 422 | Unprocessable Entity (validācijas kļūda) |
| 429 | Too Many Requests (pieprasījumu limits) |
| 500 | Internal Server Error |

## Piemērs

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

Izmantojiet kopā ar [Condition](./condition-node.md), lai validētu ievadi un izmestu kļūdu tikai tad, ja tā ir nederīga:
- Condition ir true → turpināt uz Output
- Condition ir false → Throw Error

## Saistītie

- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Condition Node](./condition-node.md) – Validēt pirms kļūdas izmešanas
- [Error Handler](./error-handler-node.md) – Uztvert kļūdas no citiem mezgliem
