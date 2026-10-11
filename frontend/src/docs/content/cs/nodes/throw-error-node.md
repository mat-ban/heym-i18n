# Throw Error

Uzel **Throw Error** okamžitě zastaví provádění workflow a vrátí chybovou odpověď s vlastním HTTP status kódem. Použijte jej pro selhání validace, neoprávněný přístup nebo jiné chybové stavy.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 0 |
| Výstup | Workflow se zastaví; volajícímu je vrácena chybová odpověď |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `errorMessage` | expression | Chybová zpráva (podporuje výrazy) |
| `httpStatusCode` | number | HTTP status kód (např. 400, 401, 403, 404, 429, 500) |

## Běžné status kódy

| Kód | Případ použití |
|------|----------|
| 400 | Bad Request (neplatný vstup) |
| 401 | Unauthorized (vyžadováno ověření) |
| 403 | Forbidden (přístup zamítnut) |
| 404 | Not Found (zdroj nenalezen) |
| 422 | Unprocessable Entity (chyba validace) |
| 429 | Too Many Requests (limit rychlosti) |
| 500 | Internal Server Error |

## Příklad

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

Použijte s uzlem [Condition](./condition-node.md) pro validaci vstupu a vyvolání chyby pouze v případě neplatnosti:
- Condition true → pokračovat na Output
- Condition false → Throw Error

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Condition Node](./condition-node.md) – Validace před vyvoláním chyby
- [Error Handler](./error-handler-node.md) – Zachycení chyb z ostatních uzlů
