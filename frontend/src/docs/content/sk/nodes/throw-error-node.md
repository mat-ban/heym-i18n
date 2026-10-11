# Vyvolanie chyby

Uzol **Vyvolanie chyby** okamžite zastaví vykonávanie workflow a vráti chybovú odpoveď s vlastným HTTP status kódom. Použite ho pri zlyhaniach validácie, neoprávnenom prístupe alebo iných chybových stavoch.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 0 |
| Výstup | Workflow sa zastaví; volajúcemu sa vráti chybová odpoveď |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `errorMessage` | expression | Chybová správa (podporuje výrazy) |
| `httpStatusCode` | number | HTTP status kód (napr. 400, 401, 403, 404, 429, 500) |

## Bežné status kódy

| Kód | Použitie |
|------|----------|
| 400 | Bad Request (neplatný vstup) |
| 401 | Unauthorized (vyžaduje sa autentifikácia) |
| 403 | Forbidden (prístup zamietnutý) |
| 404 | Not Found (zdroj neexistuje) |
| 422 | Unprocessable Entity (chyba validácie) |
| 429 | Too Many Requests (prekročený limit požiadaviek) |
| 500 | Internal Server Error |

## Príklad

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

Použite spolu s uzlom [Podmienka](./condition-node.md) na validáciu vstupu a vyvolanie chyby iba v prípade neplatnosti:
- Podmienka splnená → pokračovať na Výstup
- Podmienka nesplnená → Vyvolanie chyby

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Uzol Podmienka](./condition-node.md) – Validácia pred vyvolaním chyby
- [Spracovanie chýb](./error-handler-node.md) – Zachytenie chýb z iných uzlov
