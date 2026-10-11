# Throw Error

**Throw Error**-noden stopper workflow-udførelsen med det samme og returnerer en fejlrespons med en brugerdefineret HTTP-statuskode. Anvendes til valideringsfejl, uautoriseret adgang eller andre fejltilstande.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 0 |
| Output | Workflow stoppes; fejlrespons returneres til kalderen |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `errorMessage` | expression | Fejlmeddelelse (understøtter udtryk) |
| `httpStatusCode` | number | HTTP-statuskode (f.eks. 400, 401, 403, 404, 429, 500) |

## Almindelige statuskoder

| Kode | Anvendelsestilfælde |
|------|----------|
| 400 | Bad Request (ugyldig input) |
| 401 | Unauthorized (authentication påkrævet) |
| 403 | Forbidden (adgang nægtet) |
| 404 | Not Found (ressource mangler) |
| 422 | Unprocessable Entity (valideringsfejl) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

## Eksempel

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

Anvend sammen med [Condition](./condition-node.md) for at validere input og kun kaste fejl ved ugyldigt input:
- Betingelse sand → fortsæt til Output
- Betingelse falsk → Throw Error

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Condition Node](./condition-node.md) – Valider før fejludsendelse
- [Error Handler](./error-handler-node.md) – Håndter fejl fra andre noder
