# Aruncare Eroare

Nodul **Aruncare Eroare** oprește imediat execuția workflow-ului și returnează un răspuns de eroare cu un cod de stare HTTP personalizat. Utilizați-l pentru eșecuri de validare, acces neautorizat sau alte condiții de eroare.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 0 |
| Ieșire | Workflow-ul se oprește; răspunsul de eroare este returnat apelantului |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `errorMessage` | expression | Mesajul de eroare (acceptă expresii) |
| `httpStatusCode` | number | Codul de stare HTTP (de ex. 400, 401, 403, 404, 429, 500) |

## Coduri de stare uzuale

| Cod | Caz de utilizare |
|------|----------|
| 400 | Bad Request (intrare invalidă) |
| 401 | Unauthorized (autentificare necesară) |
| 403 | Forbidden (acces interzis) |
| 404 | Not Found (resursă inexistentă) |
| 422 | Unprocessable Entity (eroare de validare) |
| 429 | Too Many Requests (limită de rată) |
| 500 | Internal Server Error |

## Exemplu

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

Utilizați împreună cu [Condiție](./condition-node.md) pentru a valida intrarea și a arunca eroarea doar când aceasta este invalidă:
- Condiție adevărată → continuați către Ieșire
- Condiție falsă → Aruncare Eroare

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nod Condiție](./condition-node.md) – Validați înainte de a arunca eroarea
- [Handler de erori](./error-handler-node.md) – Capturați erorile de la alte noduri
